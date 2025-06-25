/**
 * Database Connection and Pool Management
 * Handles PostgreSQL connections with proper pooling, monitoring, and failover
 */

import { Pool, PoolClient, PoolConfig } from "pg";
import { QueryMetrics, TransactionContext } from "@/types/database";
import { auditLogger } from "./auditLogger";
import { encryptionService } from "./encryption";

// Database configuration interface
interface DatabaseConfig extends PoolConfig {
  master: PoolConfig;
  replicas?: PoolConfig[];
  monitoring: {
    slowQueryThreshold: number;
    connectionHealthCheck: boolean;
    metricsCollection: boolean;
  };
  encryption: {
    enabled: boolean;
    keyId: string;
    algorithm: string;
  };
  backup: {
    enabled: boolean;
    schedule: string;
    retention: number;
  };
}

// Connection pool manager
class DatabaseManager {
  private masterPool: Pool;
  private replicaPools: Pool[] = [];
  private config: DatabaseConfig;
  private metrics: Map<string, QueryMetrics[]> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor(config: DatabaseConfig) {
    this.config = config;
    this.initializePools();
    this.startHealthChecks();
  }

  /**
   * Initialize connection pools
   */
  private initializePools(): void {
    try {
      // Master pool configuration
      const masterConfig: PoolConfig = {
        ...this.config.master,
        max: this.config.master.max || 20,
        min: this.config.master.min || 5,
        idleTimeoutMillis: this.config.master.idleTimeoutMillis || 30000,
        connectionTimeoutMillis:
          this.config.master.connectionTimeoutMillis || 2000,
        acquireTimeoutMillis: this.config.master.acquireTimeoutMillis || 60000,
        statementTimeout: this.config.master.statementTimeout || 60000,
        query_timeout: this.config.master.query_timeout || 60000,
      };

      this.masterPool = new Pool(masterConfig);

      // Setup master pool event handlers
      this.setupPoolEventHandlers(this.masterPool, "master");

      // Initialize replica pools if configured
      if (this.config.replicas) {
        this.replicaPools = this.config.replicas.map((replicaConfig, index) => {
          const pool = new Pool({
            ...replicaConfig,
            max: replicaConfig.max || 10,
            min: replicaConfig.min || 2,
            idleTimeoutMillis: replicaConfig.idleTimeoutMillis || 30000,
            connectionTimeoutMillis:
              replicaConfig.connectionTimeoutMillis || 2000,
          });

          this.setupPoolEventHandlers(pool, `replica-${index}`);
          return pool;
        });
      }

      this.isInitialized = true;
      console.log("Database pools initialized successfully");
    } catch (error) {
      console.error("Failed to initialize database pools:", error);
      throw error;
    }
  }

  /**
   * Setup event handlers for connection pools
   */
  private setupPoolEventHandlers(pool: Pool, poolName: string): void {
    pool.on("connect", (client: PoolClient) => {
      console.log(`Database client connected to ${poolName} pool`);
      this.logPoolEvent("connect", poolName);
    });

    pool.on("acquire", (client: PoolClient) => {
      this.logPoolEvent("acquire", poolName);
    });

    pool.on("remove", (client: PoolClient) => {
      console.log(`Database client removed from ${poolName} pool`);
      this.logPoolEvent("remove", poolName);
    });

    pool.on("error", (error: Error, client: PoolClient) => {
      console.error(`Database pool error in ${poolName}:`, error);
      this.logPoolEvent("error", poolName, { error: error.message });

      // Notify monitoring system
      this.notifyMonitoring("pool_error", {
        pool: poolName,
        error: error.message,
        timestamp: new Date(),
      });
    });
  }

  /**
   * Log pool events for monitoring
   */
  private logPoolEvent(event: string, poolName: string, metadata?: any): void {
    if (this.config.monitoring.metricsCollection) {
      auditLogger.logSystemEvent({
        action: `pool_${event}`,
        resource: "database_pool",
        details: {
          pool: poolName,
          timestamp: new Date(),
          ...metadata,
        },
        severity: event === "error" ? "high" : "low",
        category: "system_event",
      });
    }
  }

  /**
   * Get connection for read operations (uses replica if available)
   */
  async getReadConnection(): Promise<PoolClient> {
    if (!this.isInitialized) {
      throw new Error("Database manager not initialized");
    }

    try {
      // Use replica pool if available and healthy
      if (this.replicaPools.length > 0) {
        const healthyReplica = await this.findHealthyReplica();
        if (healthyReplica) {
          return await healthyReplica.connect();
        }
      }

      // Fallback to master pool
      return await this.masterPool.connect();
    } catch (error) {
      console.error("Failed to get read connection:", error);
      throw error;
    }
  }

  /**
   * Get connection for write operations (always uses master)
   */
  async getWriteConnection(): Promise<PoolClient> {
    if (!this.isInitialized) {
      throw new Error("Database manager not initialized");
    }

    try {
      return await this.masterPool.connect();
    } catch (error) {
      console.error("Failed to get write connection:", error);
      throw error;
    }
  }

  /**
   * Execute query with automatic connection management
   */
  async query<T = any>(
    text: string,
    params?: any[],
    context?: TransactionContext,
    useReplica = false,
  ): Promise<{ rows: T[]; rowCount: number; executionTime: number }> {
    const startTime = Date.now();
    let client: PoolClient | null = null;

    try {
      // Get appropriate connection
      client = useReplica
        ? await this.getReadConnection()
        : await this.getWriteConnection();

      // Execute query
      const result = await client.query(text, params);
      const executionTime = Date.now() - startTime;

      // Log slow queries
      if (executionTime > this.config.monitoring.slowQueryThreshold) {
        this.logSlowQuery(text, params, executionTime, context);
      }

      // Collect metrics
      if (this.config.monitoring.metricsCollection) {
        this.collectQueryMetrics(
          text,
          params,
          result.rowCount,
          executionTime,
          context,
        );
      }

      // Audit if required
      if (context?.auditRequired) {
        await auditLogger.logDataAccess({
          userId: context.userId,
          action: this.getQueryAction(text),
          resource: this.extractTableName(text),
          details: {
            query: this.sanitizeQuery(text),
            rowCount: result.rowCount,
            executionTime,
          },
          context,
        });
      }

      return {
        rows: result.rows,
        rowCount: result.rowCount || 0,
        executionTime,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      // Log query error
      console.error("Query execution failed:", {
        query: this.sanitizeQuery(text),
        error: (error as Error).message,
        executionTime,
      });

      // Audit failed query
      if (context?.auditRequired) {
        await auditLogger.logDataAccess({
          userId: context.userId,
          action: this.getQueryAction(text),
          resource: this.extractTableName(text),
          details: {
            query: this.sanitizeQuery(text),
            error: (error as Error).message,
            executionTime,
            successful: false,
          },
          context,
        });
      }

      throw error;
    } finally {
      // Release connection
      if (client) {
        client.release();
      }
    }
  }

  /**
   * Execute transaction with automatic rollback on error
   */
  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>,
    context?: TransactionContext,
  ): Promise<T> {
    const client = await this.getWriteConnection();
    const startTime = Date.now();

    try {
      await client.query("BEGIN");

      // Audit transaction start
      if (context?.auditRequired) {
        await auditLogger.logTransaction({
          userId: context.userId,
          action: "transaction_begin",
          details: {
            action: context.action,
            timestamp: new Date(),
          },
          context,
        });
      }

      const result = await callback(client);

      await client.query("COMMIT");
      const executionTime = Date.now() - startTime;

      // Audit successful transaction
      if (context?.auditRequired) {
        await auditLogger.logTransaction({
          userId: context.userId,
          action: "transaction_commit",
          details: {
            action: context.action,
            executionTime,
            successful: true,
          },
          context,
        });
      }

      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      const executionTime = Date.now() - startTime;

      // Log transaction error
      console.error("Transaction failed:", {
        action: context?.action,
        error: (error as Error).message,
        executionTime,
      });

      // Audit failed transaction
      if (context?.auditRequired) {
        await auditLogger.logTransaction({
          userId: context.userId,
          action: "transaction_rollback",
          details: {
            action: context.action,
            error: (error as Error).message,
            executionTime,
            successful: false,
          },
          context,
        });
      }

      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Find healthy replica pool
   */
  private async findHealthyReplica(): Promise<Pool | null> {
    for (const replica of this.replicaPools) {
      try {
        const client = await replica.connect();
        await client.query("SELECT 1");
        client.release();
        return replica;
      } catch (error) {
        console.warn("Replica pool unhealthy, trying next:", error);
        continue;
      }
    }
    return null;
  }

  /**
   * Start health checks for all pools
   */
  private startHealthChecks(): void {
    if (!this.config.monitoring.connectionHealthCheck) {
      return;
    }

    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthChecks();
    }, 30000); // Check every 30 seconds
  }

  /**
   * Perform health checks on all pools
   */
  private async performHealthChecks(): Promise<void> {
    try {
      // Check master pool
      await this.checkPoolHealth(this.masterPool, "master");

      // Check replica pools
      for (let i = 0; i < this.replicaPools.length; i++) {
        await this.checkPoolHealth(this.replicaPools[i], `replica-${i}`);
      }
    } catch (error) {
      console.error("Health check failed:", error);
    }
  }

  /**
   * Check individual pool health
   */
  private async checkPoolHealth(pool: Pool, poolName: string): Promise<void> {
    try {
      const client = await pool.connect();
      const startTime = Date.now();

      await client.query("SELECT version(), now()");
      const responseTime = Date.now() - startTime;

      client.release();

      // Log health status
      this.logPoolEvent("health_check", poolName, {
        healthy: true,
        responseTime,
        totalConnections: pool.totalCount,
        idleConnections: pool.idleCount,
        waitingClients: pool.waitingCount,
      });
    } catch (error) {
      console.error(`Health check failed for ${poolName}:`, error);

      this.logPoolEvent("health_check", poolName, {
        healthy: false,
        error: (error as Error).message,
      });

      // Notify monitoring system
      this.notifyMonitoring("health_check_failed", {
        pool: poolName,
        error: (error as Error).message,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Collect query performance metrics
   */
  private collectQueryMetrics(
    query: string,
    params: any[] | undefined,
    rowCount: number,
    executionTime: number,
    context?: TransactionContext,
  ): void {
    const metric: QueryMetrics = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      query: this.sanitizeQuery(query),
      executionTime,
      timestamp: new Date(),
      userId: context?.userId,
      endpoint: context?.metadata?.endpoint || "unknown",
      parameters: params ? { paramCount: params.length } : undefined,
      resultCount: rowCount,
      cacheHit: false, // Would be set by caching layer
    };

    const queryType = this.getQueryAction(query);
    if (!this.metrics.has(queryType)) {
      this.metrics.set(queryType, []);
    }

    const typeMetrics = this.metrics.get(queryType)!;
    typeMetrics.push(metric);

    // Keep only last 1000 metrics per type
    if (typeMetrics.length > 1000) {
      typeMetrics.splice(0, typeMetrics.length - 1000);
    }
  }

  /**
   * Log slow queries for optimization
   */
  private logSlowQuery(
    query: string,
    params: any[] | undefined,
    executionTime: number,
    context?: TransactionContext,
  ): void {
    console.warn("Slow query detected:", {
      query: this.sanitizeQuery(query),
      executionTime,
      threshold: this.config.monitoring.slowQueryThreshold,
      context: context?.action,
    });

    // Store in slow query log
    auditLogger.logPerformanceIssue({
      type: "slow_query",
      query: this.sanitizeQuery(query),
      executionTime,
      threshold: this.config.monitoring.slowQueryThreshold,
      context,
    });
  }

  /**
   * Extract table name from query for audit logging
   */
  private extractTableName(query: string): string {
    const sanitized = query.toLowerCase().trim();
    const patterns = [
      /from\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
      /insert\s+into\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
      /update\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
      /delete\s+from\s+([a-zA-Z_][a-zA-Z0-9_]*)/,
    ];

    for (const pattern of patterns) {
      const match = sanitized.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return "unknown";
  }

  /**
   * Determine query action type
   */
  private getQueryAction(query: string): string {
    const sanitized = query.toLowerCase().trim();

    if (sanitized.startsWith("select")) return "read";
    if (sanitized.startsWith("insert")) return "create";
    if (sanitized.startsWith("update")) return "update";
    if (sanitized.startsWith("delete")) return "delete";
    if (sanitized.startsWith("create")) return "create";
    if (sanitized.startsWith("alter")) return "alter";
    if (sanitized.startsWith("drop")) return "drop";

    return "unknown";
  }

  /**
   * Sanitize query for logging (remove sensitive data)
   */
  private sanitizeQuery(query: string): string {
    // Remove potential sensitive data from query
    return query
      .replace(/'[^']*'/g, "'[REDACTED]'")
      .replace(/\$\d+/g, "$[PARAM]")
      .substring(0, 200); // Limit query length in logs
  }

  /**
   * Notify monitoring system
   */
  private notifyMonitoring(event: string, data: any): void {
    // Implementation would send to monitoring service (e.g., DataDog, New Relic)
    console.log(`Monitoring event: ${event}`, data);
  }

  /**
   * Get pool statistics
   */
  getPoolStats(): any {
    return {
      master: {
        totalConnections: this.masterPool.totalCount,
        idleConnections: this.masterPool.idleCount,
        waitingClients: this.masterPool.waitingCount,
      },
      replicas: this.replicaPools.map((pool, index) => ({
        name: `replica-${index}`,
        totalConnections: pool.totalCount,
        idleConnections: pool.idleCount,
        waitingClients: pool.waitingCount,
      })),
      metrics: Object.fromEntries(this.metrics),
    };
  }

  /**
   * Close all connections
   */
  async close(): Promise<void> {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }

    try {
      await this.masterPool.end();

      for (const replica of this.replicaPools) {
        await replica.end();
      }

      console.log("All database connections closed");
    } catch (error) {
      console.error("Error closing database connections:", error);
      throw error;
    }
  }
}

// Database configuration
const dbConfig: DatabaseConfig = {
  master: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME || "chakshu_portal",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
    max: parseInt(process.env.DB_MAX_CONNECTIONS || "20"),
    min: parseInt(process.env.DB_MIN_CONNECTIONS || "5"),
  },
  replicas: process.env.DB_REPLICA_HOSTS
    ? process.env.DB_REPLICA_HOSTS.split(",").map((host) => ({
        host: host.trim(),
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "chakshu_portal",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        ssl:
          process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: false }
            : false,
        max: 10,
        min: 2,
      }))
    : undefined,
  monitoring: {
    slowQueryThreshold: parseInt(process.env.SLOW_QUERY_THRESHOLD || "1000"),
    connectionHealthCheck: process.env.DB_HEALTH_CHECK === "true",
    metricsCollection: process.env.DB_METRICS_COLLECTION === "true",
  },
  encryption: {
    enabled: process.env.DB_ENCRYPTION_ENABLED === "true",
    keyId: process.env.DB_ENCRYPTION_KEY_ID || "default",
    algorithm: process.env.DB_ENCRYPTION_ALGORITHM || "aes-256-gcm",
  },
  backup: {
    enabled: process.env.DB_BACKUP_ENABLED === "true",
    schedule: process.env.DB_BACKUP_SCHEDULE || "0 2 * * *",
    retention: parseInt(process.env.DB_BACKUP_RETENTION || "30"),
  },
};

// Create singleton instance
export const dbManager = new DatabaseManager(dbConfig);

// Export connection helpers
export const getReadConnection = () => dbManager.getReadConnection();
export const getWriteConnection = () => dbManager.getWriteConnection();
export const query = dbManager.query.bind(dbManager);
export const transaction = dbManager.transaction.bind(dbManager);
export const getPoolStats = () => dbManager.getPoolStats();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Closing database connections...");
  await dbManager.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Closing database connections...");
  await dbManager.close();
  process.exit(0);
});
