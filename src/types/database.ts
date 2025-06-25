/**
 * Database Models and Interfaces
 * Comprehensive TypeScript models for the government fraud reporting system
 */

// Base entity interface with audit fields
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
  version: number;
  isDeleted: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

// User related interfaces
export interface User extends BaseEntity {
  email: string;
  passwordHash: string; // Encrypted
  fullName: string;
  phone?: string;
  role: UserRole;
  permissions: Permission[];
  status: UserStatus;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  lastLoginAt?: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string; // Encrypted
  metadata: UserMetadata;
  auditLog: AuditLogEntry[];
}

export interface UserMetadata {
  department?: string;
  employeeId?: string;
  securityClearance?: string;
  preferences: {
    language: string;
    timezone: string;
    notifications: NotificationPreferences;
  };
  deviceFingerprints: string[];
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  reportUpdates: boolean;
  systemAlerts: boolean;
}

// Fraud report interfaces
export interface FraudReport extends BaseEntity {
  reportNumber: string;
  type: FraudType;
  category: FraudCategory;
  title: string;
  description: string; // Encrypted
  status: ReportStatus;
  priority: Priority;
  amount?: number; // Encrypted
  currency: string;
  incidentDate?: Date;
  location?: Location;
  isAnonymous: boolean;
  reporterId?: string;
  assignedTo?: string;
  contactInfo: ContactInfo;
  evidence: Evidence[];
  timeline: TimelineEntry[];
  resolution?: Resolution;
  tags: string[];
  sensitiveData: SensitiveData; // Encrypted fields
  publicData: PublicData; // Non-sensitive, searchable data
}

export interface ContactInfo {
  suspiciousNumbers: string[];
  suspiciousEmails: string[]; // Encrypted
  suspiciousWebsites: string[];
  bankDetails?: BankDetails; // Encrypted
  otherDetails?: Record<string, any>;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string; // Encrypted
  ifscCode: string;
  transactionIds: string[];
  branchName?: string;
}

export interface Evidence extends BaseEntity {
  reportId: string;
  type: EvidenceType;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  checksum: string;
  url: string; // Encrypted storage path
  thumbnailUrl?: string;
  description?: string;
  metadata: EvidenceMetadata;
  securityScan: SecurityScanResult;
}

export interface EvidenceMetadata {
  dimensions?: { width: number; height: number };
  duration?: number; // for videos
  location?: Location;
  device?: string;
  software?: string;
  exifData?: Record<string, any>; // Sanitized EXIF data
}

export interface SecurityScanResult {
  scannedAt: Date;
  isClean: boolean;
  threats: string[];
  confidence: number;
  scanner: string;
  version: string;
}

// Location interface
export interface Location {
  address?: string;
  city?: string;
  state?: string;
  country: string;
  pincode?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
    accuracy?: number;
  };
}

// Timeline and resolution
export interface TimelineEntry {
  id: string;
  timestamp: Date;
  action: string;
  description: string;
  performedBy: string;
  metadata?: Record<string, any>;
}

export interface Resolution {
  resolvedAt: Date;
  resolvedBy: string;
  resolution: string;
  outcome: ResolutionOutcome;
  actionsTaken: string[];
  followUpRequired: boolean;
  followUpDate?: Date;
  notes?: string;
}

// Session management
export interface UserSession extends BaseEntity {
  userId: string;
  sessionToken: string; // Hashed
  refreshToken: string; // Hashed
  ipAddress: string;
  userAgent: string;
  deviceFingerprint: string;
  expiresAt: Date;
  isActive: boolean;
  lastActivity: Date;
  location?: Location;
  metadata: SessionMetadata;
}

export interface SessionMetadata {
  loginMethod: "password" | "otp" | "biometric";
  riskScore: number;
  isSecure: boolean;
  browserInfo: {
    name: string;
    version: string;
    os: string;
  };
}

// Audit logging
export interface AuditLogEntry extends BaseEntity {
  userId?: string;
  sessionId?: string;
  action: AuditAction;
  resource: string;
  resourceId?: string;
  details: AuditDetails;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  severity: AuditSeverity;
  category: AuditCategory;
  tags: string[];
}

export interface AuditDetails {
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  metadata?: Record<string, any>;
  riskScore?: number;
  successful: boolean;
  errorMessage?: string;
}

// Search and analytics
export interface SearchQuery extends BaseEntity {
  userId?: string;
  query: string;
  filters: SearchFilters;
  results: SearchResult[];
  executionTime: number;
  cached: boolean;
}

export interface SearchFilters {
  types?: FraudType[];
  categories?: FraudCategory[];
  status?: ReportStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  location?: Location;
  amountRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  snippet: string;
  relevanceScore: number;
  matchedFields: string[];
}

// Notification system
export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  priority: Priority;
  expiresAt?: Date;
  channels: NotificationChannel[];
  deliveryStatus: DeliveryStatus[];
}

export interface DeliveryStatus {
  channel: NotificationChannel;
  status: "pending" | "sent" | "delivered" | "failed";
  sentAt?: Date;
  deliveredAt?: Date;
  errorMessage?: string;
  attempts: number;
}

// Configuration and settings
export interface SystemConfiguration extends BaseEntity {
  key: string;
  value: any;
  type: "string" | "number" | "boolean" | "json";
  description: string;
  category: string;
  isEncrypted: boolean;
  validationSchema?: string;
  environment: "development" | "staging" | "production";
}

// Data encryption mappings
export interface EncryptionMapping {
  tableName: string;
  columnName: string;
  encryptionType: "aes256" | "rsa" | "hash";
  keyId: string;
  isSearchable: boolean;
  indexType?: "hash" | "partial";
}

// Database performance monitoring
export interface QueryMetrics {
  id: string;
  query: string;
  executionTime: number;
  timestamp: Date;
  userId?: string;
  endpoint: string;
  parameters?: Record<string, any>;
  resultCount: number;
  cacheHit: boolean;
  error?: string;
}

// Enums
export enum UserRole {
  CITIZEN = "citizen",
  MODERATOR = "moderator",
  INVESTIGATOR = "investigator",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
  SYSTEM = "system",
}

export enum Permission {
  READ_REPORTS = "read_reports",
  CREATE_REPORTS = "create_reports",
  UPDATE_REPORTS = "update_reports",
  DELETE_REPORTS = "delete_reports",
  MANAGE_USERS = "manage_users",
  VIEW_ANALYTICS = "view_analytics",
  SYSTEM_CONFIG = "system_config",
  AUDIT_LOGS = "audit_logs",
  DATA_EXPORT = "data_export",
  BULK_OPERATIONS = "bulk_operations",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  LOCKED = "locked",
  PENDING_VERIFICATION = "pending_verification",
}

export enum FraudType {
  FINANCIAL = "financial",
  CYBER = "cyber",
  IDENTITY_THEFT = "identity_theft",
  TELECOM = "telecom",
  BANKING = "banking",
  INVESTMENT = "investment",
  OTHER = "other",
}

export enum FraudCategory {
  PHISHING = "phishing",
  FRAUD_CALL = "fraud_call",
  FAKE_WEBSITE = "fake_website",
  UNAUTHORIZED_TRANSACTION = "unauthorized_transaction",
  SIM_CLONING = "sim_cloning",
  PONZI_SCHEME = "ponzi_scheme",
  LOTTERY_SCAM = "lottery_scam",
  JOB_FRAUD = "job_fraud",
  MATRIMONIAL_FRAUD = "matrimonial_fraud",
  OTHER = "other",
}

export enum ReportStatus {
  DRAFT = "draft",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  INVESTIGATING = "investigating",
  ADDITIONAL_INFO_REQUIRED = "additional_info_required",
  RESOLVED = "resolved",
  CLOSED = "closed",
  ESCALATED = "escalated",
  REJECTED = "rejected",
}

export enum Priority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
  URGENT = "urgent",
}

export enum EvidenceType {
  SCREENSHOT = "screenshot",
  DOCUMENT = "document",
  AUDIO = "audio",
  VIDEO = "video",
  TRANSACTION_RECORD = "transaction_record",
  COMMUNICATION_LOG = "communication_log",
  OTHER = "other",
}

export enum ResolutionOutcome {
  FRAUD_CONFIRMED = "fraud_confirmed",
  NOT_FRAUD = "not_fraud",
  INSUFFICIENT_EVIDENCE = "insufficient_evidence",
  REFERRED_TO_AUTHORITY = "referred_to_authority",
  DUPLICATE_REPORT = "duplicate_report",
  SPAM = "spam",
}

export enum AuditAction {
  CREATE = "create",
  READ = "read",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  LOGOUT = "logout",
  ACCESS_DENIED = "access_denied",
  PASSWORD_CHANGE = "password_change",
  EXPORT = "export",
  BULK_OPERATION = "bulk_operation",
}

export enum AuditSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

export enum AuditCategory {
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  DATA_ACCESS = "data_access",
  DATA_MODIFICATION = "data_modification",
  SYSTEM_EVENT = "system_event",
  SECURITY_EVENT = "security_event",
}

export enum NotificationType {
  REPORT_UPDATE = "report_update",
  SYSTEM_ALERT = "system_alert",
  SECURITY_ALERT = "security_alert",
  REMINDER = "reminder",
  ANNOUNCEMENT = "announcement",
}

export enum NotificationChannel {
  EMAIL = "email",
  SMS = "sms",
  PUSH = "push",
  IN_APP = "in_app",
}

// Sensitive and public data separation
export interface SensitiveData {
  personalDetails?: {
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  financialDetails?: {
    accountNumbers?: string[];
    cardNumbers?: string[];
    transactionIds?: string[];
    amounts?: number[];
  };
  identificationDetails?: {
    aadhaarNumber?: string;
    panNumber?: string;
    passportNumber?: string;
    drivingLicense?: string;
  };
}

export interface PublicData {
  generalCategory: string;
  locationState?: string;
  amountRange?: string; // e.g., "1000-5000"
  fraudMethod?: string;
  targetDemographic?: string;
  timeOfIncident?: string; // generalized time
}

// API request/response types
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface SortParams {
  field: string;
  order: "asc" | "desc";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
    timing?: {
      executionTime: number;
      cached: boolean;
    };
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  value?: any;
}

export interface BulkOperationResult<T> {
  successful: T[];
  failed: Array<{
    item: T;
    error: string;
    code: string;
  }>;
  totalProcessed: number;
  successCount: number;
  failureCount: number;
}

// Transaction context
export interface TransactionContext {
  userId?: string;
  sessionId?: string;
  action: string;
  metadata?: Record<string, any>;
  auditRequired: boolean;
}

// Backup and recovery
export interface BackupConfiguration {
  id: string;
  name: string;
  schedule: string; // Cron expression
  type: "full" | "incremental" | "differential";
  retention: number; // Days
  encryption: boolean;
  compression: boolean;
  tables: string[];
  destination: string;
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
}

export interface BackupRecord extends BaseEntity {
  configurationId: string;
  type: "full" | "incremental" | "differential";
  startTime: Date;
  endTime?: Date;
  status: "running" | "completed" | "failed";
  size: number;
  location: string;
  checksum: string;
  errorMessage?: string;
  metadata: {
    recordCount: number;
    tables: string[];
    compressionRatio?: number;
  };
}
