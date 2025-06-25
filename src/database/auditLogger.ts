/**
 * Audit Logger Service
 * Comprehensive audit logging for all database operations with tamper-proof logs
 */

import {
  AuditLogEntry,
  AuditAction,
  AuditSeverity,
  AuditCategory,
  TransactionContext,
} from "@/types/database";
import { query } from "./connection";
import { encryptionService } from "./encryption";

interface AuditConfig {
  enabled: boolean;
  retentionDays: number;
  encryptSensitiveData: boolean;
  realTimeAlerts: boolean;
  exportSettings: {
    enabled: boolean;
    schedule: string;
    destination: string;
  };
  complianceMode: boolean;
}

interface SecurityEvent {
  type:
    | "authentication"
    | "authorization"
    | "data_access"
    | "system_event"
    | "performance";
  severity: AuditSeverity;
  details: any;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: AuditSeverity;
  actions: string[];
  enabled: boolean;
}

class AuditLogger {
  private config: AuditConfig;
  private alertRules: AlertRule[] = [];
  private logBuffer: AuditLogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  constructor(config: AuditConfig) {
    this.config = config;
    this.initializeAlertRules();
    this.startLogBuffering();
  }

  /**
   * Initialize security alert rules
   */
  private initializeAlertRules(): void {
    this.alertRules = [
      {
        id: "failed_login_attempts",
        name: "Multiple Failed Login Attempts",
        condition:
          'action = "login" AND successful = false AND COUNT(*) > 5 IN 15 minutes',
        severity: AuditSeverity.HIGH,
        actions: ["email_alert", "lock_account"],
        enabled: true,
      },
      {
        id: "privilege_escalation",
        name: "Privilege Escalation Attempt",
        condition:
          'action = "update" AND resource = "users" AND details.role_changed = true',
        severity: AuditSeverity.CRITICAL,
        actions: ["immediate_alert", "disable_session"],
        enabled: true,
      },
      {
        id: "bulk_data_access",
        name: "Bulk Data Access",
        condition: 'action = "read" AND result_count > 1000',
        severity: AuditSeverity.MEDIUM,
        actions: ["log_alert"],
        enabled: true,
      },
      {
        id: "unusual_hours_access",
        name: "After Hours Data Access",
        condition: 'TIME BETWEEN "22:00" AND "06:00" AND severity >= "medium"',
        severity: AuditSeverity.MEDIUM,
        actions: ["email_alert"],
        enabled: true,
      },
      {
        id: "sensitive_data_export",
        name: "Sensitive Data Export",
        condition: 'action = "export" AND resource LIKE "%sensitive%"',
        severity: AuditSeverity.HIGH,
        actions: ["immediate_alert", "log_alert"],
        enabled: true,
      },
    ];
  }

  /**
   * Start log buffering for performance
   */
  private startLogBuffering(): void {
    // Flush logs every 5 seconds
    this.flushTimer = setInterval(() => {
      this.flushLogBuffer();
    }, 5000);
  }

  /**
   * Log authentication events
   */
  async logAuthentication(event: {
    userId?: string;
    action:
      | "login"
      | "logout"
      | "password_change"
      | "account_lock"
      | "account_unlock";
    successful: boolean;
    ipAddress: string;
    userAgent: string;
    details?: any;
    sessionId?: string;
  }): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      userId: event.userId,
      sessionId: event.sessionId,
      action: event.action as AuditAction,
      resource: "authentication",
      details: {
        successful: event.successful,
        ipAddress: event.ipAddress,
        userAgent: event.userAgent,
        ...event.details,
      },
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      timestamp: new Date(),
      severity: event.successful ? AuditSeverity.LOW : AuditSeverity.MEDIUM,
      category: AuditCategory.AUTHENTICATION,
      tags: ["auth", event.action],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: event.userId || "system",
      version: 1,
      isDeleted: false,
    };

    await this.addToBuffer(auditEntry);
    await this.checkAlertRules(auditEntry);
  }

  /**
   * Log data access operations
   */
  async logDataAccess(event: {
    userId?: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    details: any;
    context?: TransactionContext;
  }): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      userId: event.userId,
      sessionId: event.context?.sessionId,
      action: event.action,
      resource: event.resource,
      resourceId: event.resourceId,
      details: {
        ...event.details,
        context: event.context?.metadata,
      },
      ipAddress: event.context?.metadata?.ipAddress || "unknown",
      userAgent: event.context?.metadata?.userAgent || "unknown",
      timestamp: new Date(),
      severity: this.determineSeverity(event.action, event.resource),
      category: AuditCategory.DATA_ACCESS,
      tags: [event.action, event.resource],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: event.userId || "system",
      version: 1,
      isDeleted: false,
    };

    await this.addToBuffer(auditEntry);
    await this.checkAlertRules(auditEntry);
  }

  /**
   * Log data modification operations
   */
  async logDataModification(event: {
    userId?: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    oldValues?: any;
    newValues?: any;
    context?: TransactionContext;
  }): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      userId: event.userId,
      sessionId: event.context?.sessionId,
      action: event.action,
      resource: event.resource,
      resourceId: event.resourceId,
      details: {
        oldValues: this.sanitizeData(event.oldValues),
        newValues: this.sanitizeData(event.newValues),
        successful: true,
        context: event.context?.metadata,
      },
      ipAddress: event.context?.metadata?.ipAddress || "unknown",
      userAgent: event.context?.metadata?.userAgent || "unknown",
      timestamp: new Date(),
      severity: this.determineSeverity(event.action, event.resource),
      category: AuditCategory.DATA_MODIFICATION,
      tags: [event.action, event.resource, "modification"],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: event.userId || "system",
      version: 1,
      isDeleted: false,
    };

    await this.addToBuffer(auditEntry);
    await this.checkAlertRules(auditEntry);
  }

  /**
   * Log system events
   */
  async logSystemEvent(event: {
    action: string;
    resource: string;
    details: any;
    severity?: AuditSeverity;
    category?: AuditCategory;
  }): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      action: event.action as AuditAction,
      resource: event.resource,
      details: event.details,
      ipAddress: "system",
      userAgent: "system",
      timestamp: new Date(),
      severity: event.severity || AuditSeverity.LOW,
      category: event.category || AuditCategory.SYSTEM_EVENT,
      tags: ["system", event.action],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "system",
      version: 1,
      isDeleted: false,
    };

    await this.addToBuffer(auditEntry);
  }

  /**
   * Log security events
   */
  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      userId: event.userId,
      sessionId: event.sessionId,
      action: event.type as AuditAction,
      resource: "security",
      details: event.details,
      ipAddress: event.ipAddress || "unknown",
      userAgent: event.userAgent || "unknown",
      timestamp: new Date(),
      severity: event.severity,
      category: AuditCategory.SECURITY_EVENT,
      tags: ["security", event.type],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: event.userId || "system",
      version: 1,
      isDeleted: false,
    };

    await this.addToBuffer(auditEntry);
    await this.checkAlertRules(auditEntry);

    // Immediate alert for critical security events
    if (event.severity === AuditSeverity.CRITICAL) {
      await this.triggerImmediateAlert(auditEntry);
    }
  }

  /**
   * Log transaction events
   */
  async logTransaction(event: {
    userId?: string;
    action: string;
    details: any;
    context?: TransactionContext;
  }): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      userId: event.userId,
      sessionId: event.context?.sessionId,
      action: event.action as AuditAction,
      resource: "transaction",
      details: event.details,
      ipAddress: event.context?.metadata?.ipAddress || "unknown",
      userAgent: event.context?.metadata?.userAgent || "unknown",
      timestamp: new Date(),
      severity: AuditSeverity.MEDIUM,
      category: AuditCategory.DATA_MODIFICATION,
      tags: ["transaction", event.action],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: event.userId || "system",
      version: 1,
      isDeleted: false,
    };

    await this.addToBuffer(auditEntry);
  }

  /**
   * Log performance issues
   */
  async logPerformanceIssue(event: {
    type: string;
    query?: string;
    executionTime: number;
    threshold: number;
    context?: TransactionContext;
  }): Promise<void> {
    const auditEntry: AuditLogEntry = {
      id: this.generateId(),
      userId: event.context?.userId,
      action: "performance_issue" as AuditAction,
      resource: "database",
      details: {
        type: event.type,
        query: event.query,
        executionTime: event.executionTime,
        threshold: event.threshold,
        severity: event.executionTime > event.threshold * 3 ? "high" : "medium",
      },
      ipAddress: event.context?.metadata?.ipAddress || "system",
      userAgent: event.context?.metadata?.userAgent || "system",
      timestamp: new Date(),
      severity: AuditSeverity.MEDIUM,
      category: AuditCategory.SYSTEM_EVENT,
      tags: ["performance", event.type],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: event.context?.userId || "system",
      version: 1,
      isDeleted: false,
    };

    await this.addToBuffer(auditEntry);
  }

  /**
   * Add audit entry to buffer
   */
  private async addToBuffer(entry: AuditLogEntry): Promise<void> {
    // Encrypt sensitive data if configured
    if (this.config.encryptSensitiveData) {
      entry.details = this.encryptSensitiveFields(entry.details);
    }

    this.logBuffer.push(entry);

    // Flush immediately for critical events
    if (entry.severity === AuditSeverity.CRITICAL) {
      await this.flushLogBuffer();
    }
  }

  /**
   * Flush log buffer to database
   */
  private async flushLogBuffer(): Promise<void> {
    if (this.logBuffer.length === 0) {
      return;
    }

    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    try {
      // Batch insert audit logs
      const insertQuery = `
        INSERT INTO audit_logs (
          id, user_id, session_id, action, resource, resource_id,
          details, ip_address, user_agent, timestamp, severity, category,
          tags, created_at, updated_at, created_by, version, is_deleted
        ) VALUES ${logsToFlush
          .map(
            (_, index) =>
              `($${index * 18 + 1}, $${index * 18 + 2}, $${index * 18 + 3}, $${index * 18 + 4}, 
           $${index * 18 + 5}, $${index * 18 + 6}, $${index * 18 + 7}, $${index * 18 + 8},
           $${index * 18 + 9}, $${index * 18 + 10}, $${index * 18 + 11}, $${index * 18 + 12},
           $${index * 18 + 13}, $${index * 18 + 14}, $${index * 18 + 15}, $${index * 18 + 16},
           $${index * 18 + 17}, $${index * 18 + 18})`,
          )
          .join(", ")}
      `;

      const values = logsToFlush.flatMap((log) => [
        log.id,
        log.userId,
        log.sessionId,
        log.action,
        log.resource,
        log.resourceId,
        JSON.stringify(log.details),
        log.ipAddress,
        log.userAgent,
        log.timestamp,
        log.severity,
        log.category,
        log.tags,
        log.createdAt,
        log.updatedAt,
        log.createdBy,
        log.version,
        log.isDeleted,
      ]);

      await query(insertQuery, values, undefined, false);
    } catch (error) {
      console.error("Failed to flush audit logs:", error);

      // Re-add failed logs to buffer for retry
      this.logBuffer.unshift(...logsToFlush);
    }
  }

  /**
   * Check alert rules against audit entry
   */
  private async checkAlertRules(entry: AuditLogEntry): Promise<void> {
    for (const rule of this.alertRules) {
      if (!rule.enabled) continue;

      try {
        const shouldAlert = await this.evaluateRule(rule, entry);
        if (shouldAlert) {
          await this.triggerAlert(rule, entry);
        }
      } catch (error) {
        console.error(`Error evaluating alert rule ${rule.id}:`, error);
      }
    }
  }

  /**
   * Evaluate alert rule condition
   */
  private async evaluateRule(
    rule: AlertRule,
    entry: AuditLogEntry,
  ): Promise<boolean> {
    // Simplified rule evaluation - in production, use a proper rule engine
    const condition = rule.condition.toLowerCase();

    // Check basic conditions
    if (condition.includes("failed_login_attempts")) {
      return await this.checkFailedLoginAttempts(entry);
    }

    if (condition.includes("privilege_escalation")) {
      return this.checkPrivilegeEscalation(entry);
    }

    if (condition.includes("bulk_data_access")) {
      return this.checkBulkDataAccess(entry);
    }

    if (condition.includes("unusual_hours_access")) {
      return this.checkUnusualHoursAccess(entry);
    }

    if (condition.includes("sensitive_data_export")) {
      return this.checkSensitiveDataExport(entry);
    }

    return false;
  }

  /**
   * Check for failed login attempts
   */
  private async checkFailedLoginAttempts(
    entry: AuditLogEntry,
  ): Promise<boolean> {
    if (entry.action !== "login" || entry.details.successful) {
      return false;
    }

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    const result = await query(
      `
      SELECT COUNT(*) as attempt_count
      FROM audit_logs
      WHERE action = 'login'
        AND details->>'successful' = 'false'
        AND ip_address = $1
        AND timestamp >= $2
    `,
      [entry.ipAddress, fifteenMinutesAgo],
    );

    return parseInt(result.rows[0].attempt_count) >= 5;
  }

  /**
   * Check for privilege escalation
   */
  private checkPrivilegeEscalation(entry: AuditLogEntry): boolean {
    return (
      entry.action === "update" &&
      entry.resource === "users" &&
      entry.details.oldValues?.role !== entry.details.newValues?.role
    );
  }

  /**
   * Check for bulk data access
   */
  private checkBulkDataAccess(entry: AuditLogEntry): boolean {
    return entry.action === "read" && entry.details.resultCount > 1000;
  }

  /**
   * Check for unusual hours access
   */
  private checkUnusualHoursAccess(entry: AuditLogEntry): boolean {
    const hour = entry.timestamp.getHours();
    return (
      (hour >= 22 || hour <= 6) &&
      (entry.severity === AuditSeverity.MEDIUM ||
        entry.severity === AuditSeverity.HIGH)
    );
  }

  /**
   * Check for sensitive data export
   */
  private checkSensitiveDataExport(entry: AuditLogEntry): boolean {
    return (
      entry.action === "export" &&
      entry.resource.toLowerCase().includes("sensitive")
    );
  }

  /**
   * Trigger alert based on rule
   */
  private async triggerAlert(
    rule: AlertRule,
    entry: AuditLogEntry,
  ): Promise<void> {
    console.warn(`Security alert triggered: ${rule.name}`, {
      rule: rule.id,
      entry: {
        id: entry.id,
        action: entry.action,
        resource: entry.resource,
        userId: entry.userId,
        timestamp: entry.timestamp,
      },
    });

    // Execute alert actions
    for (const action of rule.actions) {
      try {
        await this.executeAlertAction(action, rule, entry);
      } catch (error) {
        console.error(`Failed to execute alert action ${action}:`, error);
      }
    }
  }

  /**
   * Execute alert action
   */
  private async executeAlertAction(
    action: string,
    rule: AlertRule,
    entry: AuditLogEntry,
  ): Promise<void> {
    switch (action) {
      case "email_alert":
        await this.sendEmailAlert(rule, entry);
        break;

      case "immediate_alert":
        await this.triggerImmediateAlert(entry);
        break;

      case "lock_account":
        if (entry.userId) {
          await this.lockUserAccount(entry.userId);
        }
        break;

      case "disable_session":
        if (entry.sessionId) {
          await this.disableSession(entry.sessionId);
        }
        break;

      case "log_alert":
        await this.logAlert(rule, entry);
        break;
    }
  }

  /**
   * Send email alert
   */
  private async sendEmailAlert(
    rule: AlertRule,
    entry: AuditLogEntry,
  ): Promise<void> {
    // Implementation would send email to security team
    console.log(`Email alert: ${rule.name}`, entry);
  }

  /**
   * Trigger immediate alert
   */
  private async triggerImmediateAlert(entry: AuditLogEntry): Promise<void> {
    // Implementation would send immediate notification (SMS, Slack, etc.)
    console.error(`IMMEDIATE SECURITY ALERT:`, entry);
  }

  /**
   * Lock user account
   */
  private async lockUserAccount(userId: string): Promise<void> {
    await query(
      `
      UPDATE users 
      SET status = 'locked', 
          locked_until = NOW() + INTERVAL '1 hour',
          updated_at = NOW()
      WHERE id = $1
    `,
      [userId],
    );
  }

  /**
   * Disable session
   */
  private async disableSession(sessionId: string): Promise<void> {
    await query(
      `
      UPDATE user_sessions 
      SET is_active = false, 
          updated_at = NOW()
      WHERE id = $1
    `,
      [sessionId],
    );
  }

  /**
   * Log alert
   */
  private async logAlert(rule: AlertRule, entry: AuditLogEntry): Promise<void> {
    await this.logSecurityEvent({
      type: "security_event",
      severity: rule.severity,
      details: {
        alertRule: rule.id,
        triggerEntry: entry.id,
        description: `Alert rule "${rule.name}" triggered`,
      },
      userId: entry.userId,
      sessionId: entry.sessionId,
    });
  }

  /**
   * Determine severity based on action and resource
   */
  private determineSeverity(
    action: AuditAction,
    resource: string,
  ): AuditSeverity {
    // Critical operations
    if (action === "delete" && ["users", "fraud_reports"].includes(resource)) {
      return AuditSeverity.HIGH;
    }

    // Sensitive operations
    if (
      ["create", "update"].includes(action) &&
      ["users", "system_configuration"].includes(resource)
    ) {
      return AuditSeverity.MEDIUM;
    }

    // Default to low severity
    return AuditSeverity.LOW;
  }

  /**
   * Sanitize data for logging
   */
  private sanitizeData(data: any): any {
    if (!data || typeof data !== "object") {
      return data;
    }

    const sensitiveFields = ["password", "token", "secret", "key", "hash"];
    const sanitized = { ...data };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = "[REDACTED]";
      }
    }

    return sanitized;
  }

  /**
   * Encrypt sensitive fields in audit data
   */
  private encryptSensitiveFields(data: any): any {
    if (!data || typeof data !== "object") {
      return data;
    }

    const encryptedData = { ...data };
    const sensitiveFields = ["oldValues", "newValues", "query", "parameters"];

    for (const field of sensitiveFields) {
      if (encryptedData[field]) {
        encryptedData[field] = encryptionService.encrypt(
          JSON.stringify(encryptedData[field]),
          "audit_logs",
        );
      }
    }

    return encryptedData;
  }

  /**
   * Generate unique audit log ID
   */
  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clean up old audit logs
   */
  async cleanupOldLogs(): Promise<void> {
    if (!this.config.enabled) return;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.retentionDays);

    try {
      const result = await query(
        `
        UPDATE audit_logs 
        SET is_deleted = true, 
            deleted_at = NOW(),
            deleted_by = 'system'
        WHERE created_at < $1 
          AND is_deleted = false
      `,
        [cutoffDate],
      );

      console.log(`Cleaned up ${result.rowCount} old audit logs`);
    } catch (error) {
      console.error("Failed to cleanup old audit logs:", error);
    }
  }

  /**
   * Export audit logs for compliance
   */
  async exportAuditLogs(
    startDate: Date,
    endDate: Date,
    format: "csv" | "json" = "json",
  ): Promise<string> {
    try {
      const result = await query(
        `
        SELECT * FROM audit_logs
        WHERE timestamp BETWEEN $1 AND $2
          AND is_deleted = false
        ORDER BY timestamp DESC
      `,
        [startDate, endDate],
      );

      if (format === "csv") {
        return this.convertToCSV(result.rows);
      }

      return JSON.stringify(result.rows, null, 2);
    } catch (error) {
      console.error("Failed to export audit logs:", error);
      throw error;
    }
  }

  /**
   * Convert audit logs to CSV format
   */
  private convertToCSV(logs: any[]): string {
    if (logs.length === 0) return "";

    const headers = Object.keys(logs[0]);
    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        headers.map((header) => JSON.stringify(log[header] || "")).join(","),
      ),
    ].join("\n");

    return csvContent;
  }

  /**
   * Destroy audit logger (cleanup)
   */
  async destroy(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }

    // Flush remaining logs
    await this.flushLogBuffer();
  }
}

// Audit configuration
const auditConfig: AuditConfig = {
  enabled: process.env.AUDIT_LOGGING_ENABLED !== "false",
  retentionDays: parseInt(process.env.AUDIT_RETENTION_DAYS || "2555"), // 7 years for government compliance
  encryptSensitiveData: process.env.AUDIT_ENCRYPT_SENSITIVE === "true",
  realTimeAlerts: process.env.AUDIT_REAL_TIME_ALERTS === "true",
  exportSettings: {
    enabled: process.env.AUDIT_EXPORT_ENABLED === "true",
    schedule: process.env.AUDIT_EXPORT_SCHEDULE || "0 0 * * 0", // Weekly
    destination:
      process.env.AUDIT_EXPORT_DESTINATION || "/var/backups/audit-logs",
  },
  complianceMode: process.env.AUDIT_COMPLIANCE_MODE === "true",
};

// Create singleton instance
export const auditLogger = new AuditLogger(auditConfig);

// Graceful shutdown
process.on("SIGINT", async () => {
  await auditLogger.destroy();
});

process.on("SIGTERM", async () => {
  await auditLogger.destroy();
});

// Export types
export type { SecurityEvent, AlertRule, AuditConfig };
