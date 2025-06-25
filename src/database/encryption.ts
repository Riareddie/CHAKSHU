/**
 * Data Encryption Service
 * Handles encryption/decryption of sensitive database fields with key rotation and audit
 */

import crypto from "crypto";
import { EncryptionMapping } from "@/types/database";

// Encryption configuration
interface EncryptionConfig {
  algorithm: string;
  keyDerivation: {
    iterations: number;
    keyLength: number;
    hashAlgorithm: string;
  };
  keys: {
    [keyId: string]: {
      key: string;
      salt: string;
      version: number;
      createdAt: Date;
      active: boolean;
    };
  };
  rotation: {
    enabled: boolean;
    maxAge: number; // Days
    warningThreshold: number; // Days before expiry
  };
}

interface EncryptedData {
  data: string;
  keyId: string;
  keyVersion: number;
  algorithm: string;
  iv: string;
  authTag: string;
  timestamp: Date;
}

interface SearchableHash {
  hash: string;
  salt: string;
  algorithm: string;
}

class EncryptionService {
  private config: EncryptionConfig;
  private encryptionMappings: Map<string, EncryptionMapping> = new Map();

  constructor(config: EncryptionConfig) {
    this.config = config;
    this.loadEncryptionMappings();
    this.setupKeyRotationCheck();
  }

  /**
   * Load encryption mappings for database fields
   */
  private loadEncryptionMappings(): void {
    // Define which fields need encryption
    const mappings: EncryptionMapping[] = [
      // User sensitive data
      {
        tableName: "users",
        columnName: "password_hash",
        encryptionType: "hash",
        keyId: "user_auth",
        isSearchable: false,
      },
      {
        tableName: "users",
        columnName: "email",
        encryptionType: "aes256",
        keyId: "user_pii",
        isSearchable: true,
        indexType: "hash",
      },
      {
        tableName: "users",
        columnName: "phone",
        encryptionType: "aes256",
        keyId: "user_pii",
        isSearchable: true,
        indexType: "hash",
      },
      {
        tableName: "users",
        columnName: "two_factor_secret",
        encryptionType: "aes256",
        keyId: "user_auth",
        isSearchable: false,
      },

      // Fraud report sensitive data
      {
        tableName: "fraud_reports",
        columnName: "description",
        encryptionType: "aes256",
        keyId: "report_content",
        isSearchable: true,
        indexType: "partial",
      },
      {
        tableName: "fraud_reports",
        columnName: "amount",
        encryptionType: "aes256",
        keyId: "financial",
        isSearchable: false,
      },

      // Contact info
      {
        tableName: "contact_info",
        columnName: "suspicious_emails",
        encryptionType: "aes256",
        keyId: "contact_data",
        isSearchable: true,
        indexType: "hash",
      },
      {
        tableName: "contact_info",
        columnName: "account_number",
        encryptionType: "aes256",
        keyId: "financial",
        isSearchable: true,
        indexType: "hash",
      },

      // Evidence files
      {
        tableName: "evidence",
        columnName: "url",
        encryptionType: "aes256",
        keyId: "file_paths",
        isSearchable: false,
      },

      // Session data
      {
        tableName: "user_sessions",
        columnName: "session_token",
        encryptionType: "hash",
        keyId: "session",
        isSearchable: true,
        indexType: "hash",
      },
      {
        tableName: "user_sessions",
        columnName: "refresh_token",
        encryptionType: "hash",
        keyId: "session",
        isSearchable: true,
        indexType: "hash",
      },

      // System configuration
      {
        tableName: "system_configuration",
        columnName: "value",
        encryptionType: "aes256",
        keyId: "config",
        isSearchable: false,
      },
    ];

    mappings.forEach((mapping) => {
      const key = `${mapping.tableName}.${mapping.columnName}`;
      this.encryptionMappings.set(key, mapping);
    });
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(data: string, keyId: string = "default"): EncryptedData {
    try {
      if (!data || typeof data !== "string") {
        throw new Error("Invalid data for encryption");
      }

      const keyConfig = this.config.keys[keyId];
      if (!keyConfig || !keyConfig.active) {
        throw new Error(`Encryption key '${keyId}' not found or inactive`);
      }

      // Derive encryption key
      const derivedKey = this.deriveKey(keyConfig.key, keyConfig.salt);

      // Generate IV
      const iv = crypto.randomBytes(16);

      // Create cipher
      const cipher = crypto.createCipher(this.config.algorithm, derivedKey);
      cipher.setAAD(Buffer.from(keyId)); // Additional authenticated data

      // Encrypt data
      let encrypted = cipher.update(data, "utf8", "hex");
      encrypted += cipher.final("hex");

      // Get authentication tag
      const authTag = cipher.getAuthTag();

      return {
        data: encrypted,
        keyId,
        keyVersion: keyConfig.version,
        algorithm: this.config.algorithm,
        iv: iv.toString("hex"),
        authTag: authTag.toString("hex"),
        timestamp: new Date(),
      };
    } catch (error) {
      console.error("Encryption failed:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: EncryptedData): string {
    try {
      const keyConfig = this.config.keys[encryptedData.keyId];
      if (!keyConfig) {
        throw new Error(`Decryption key '${encryptedData.keyId}' not found`);
      }

      // Check if key version matches (for key rotation)
      if (keyConfig.version !== encryptedData.keyVersion) {
        console.warn(
          `Key version mismatch for ${encryptedData.keyId}: expected ${keyConfig.version}, got ${encryptedData.keyVersion}`,
        );
      }

      // Derive decryption key
      const derivedKey = this.deriveKey(keyConfig.key, keyConfig.salt);

      // Create decipher
      const decipher = crypto.createDecipher(
        encryptedData.algorithm,
        derivedKey,
      );
      decipher.setAAD(Buffer.from(encryptedData.keyId));
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

      // Decrypt data
      let decrypted = decipher.update(encryptedData.data, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error("Failed to decrypt data");
    }
  }

  /**
   * Create searchable hash for encrypted fields
   */
  createSearchableHash(
    data: string,
    keyId: string = "default",
  ): SearchableHash {
    try {
      const keyConfig = this.config.keys[keyId];
      if (!keyConfig) {
        throw new Error(`Hash key '${keyId}' not found`);
      }

      // Use a separate salt for hashing
      const hashSalt = crypto
        .createHash("sha256")
        .update(keyConfig.salt + "search")
        .digest("hex")
        .substring(0, 32);

      // Create hash
      const hash = crypto
        .pbkdf2Sync(
          data.toLowerCase().trim(),
          hashSalt,
          this.config.keyDerivation.iterations,
          32,
          this.config.keyDerivation.hashAlgorithm,
        )
        .toString("hex");

      return {
        hash,
        salt: hashSalt,
        algorithm: this.config.keyDerivation.hashAlgorithm,
      };
    } catch (error) {
      console.error("Hash creation failed:", error);
      throw new Error("Failed to create searchable hash");
    }
  }

  /**
   * Create partial searchable hash for text fields
   */
  createPartialHash(data: string, keyId: string = "default"): SearchableHash[] {
    try {
      const words = data.toLowerCase().trim().split(/\s+/);
      const hashes: SearchableHash[] = [];

      // Create hash for each significant word (length > 3)
      for (const word of words) {
        if (word.length > 3) {
          const hash = this.createSearchableHash(word, keyId);
          hashes.push(hash);
        }
      }

      return hashes;
    } catch (error) {
      console.error("Partial hash creation failed:", error);
      throw new Error("Failed to create partial hashes");
    }
  }

  /**
   * Derive encryption key from master key and salt
   */
  private deriveKey(masterKey: string, salt: string): Buffer {
    return crypto.pbkdf2Sync(
      masterKey,
      salt,
      this.config.keyDerivation.iterations,
      this.config.keyDerivation.keyLength,
      this.config.keyDerivation.hashAlgorithm,
    );
  }

  /**
   * Hash password with salt
   */
  hashPassword(
    password: string,
    salt?: string,
  ): { hash: string; salt: string } {
    try {
      const passwordSalt = salt || crypto.randomBytes(32).toString("hex");

      const hash = crypto
        .pbkdf2Sync(
          password,
          passwordSalt,
          this.config.keyDerivation.iterations,
          64,
          this.config.keyDerivation.hashAlgorithm,
        )
        .toString("hex");

      return { hash, salt: passwordSalt };
    } catch (error) {
      console.error("Password hashing failed:", error);
      throw new Error("Failed to hash password");
    }
  }

  /**
   * Verify password against hash
   */
  verifyPassword(password: string, hash: string, salt: string): boolean {
    try {
      const computedHash = crypto
        .pbkdf2Sync(
          password,
          salt,
          this.config.keyDerivation.iterations,
          64,
          this.config.keyDerivation.hashAlgorithm,
        )
        .toString("hex");

      return crypto.timingSafeEqual(
        Buffer.from(hash, "hex"),
        Buffer.from(computedHash, "hex"),
      );
    } catch (error) {
      console.error("Password verification failed:", error);
      return false;
    }
  }

  /**
   * Generate new encryption key
   */
  generateKey(keyId: string): { key: string; salt: string } {
    const key = crypto.randomBytes(32).toString("hex");
    const salt = crypto.randomBytes(32).toString("hex");

    return { key, salt };
  }

  /**
   * Add new encryption key
   */
  addKey(keyId: string, key: string, salt: string): void {
    this.config.keys[keyId] = {
      key,
      salt,
      version: 1,
      createdAt: new Date(),
      active: true,
    };
  }

  /**
   * Rotate encryption key
   */
  rotateKey(keyId: string): { oldKey: string; newKey: string } {
    const oldKeyConfig = this.config.keys[keyId];
    if (!oldKeyConfig) {
      throw new Error(`Key '${keyId}' not found for rotation`);
    }

    // Generate new key
    const { key: newKey, salt: newSalt } = this.generateKey(keyId);

    // Store old key with inactive status
    const oldKeyId = `${keyId}_v${oldKeyConfig.version}`;
    this.config.keys[oldKeyId] = {
      ...oldKeyConfig,
      active: false,
    };

    // Update with new key
    this.config.keys[keyId] = {
      key: newKey,
      salt: newSalt,
      version: oldKeyConfig.version + 1,
      createdAt: new Date(),
      active: true,
    };

    return {
      oldKey: oldKeyId,
      newKey: keyId,
    };
  }

  /**
   * Setup automatic key rotation check
   */
  private setupKeyRotationCheck(): void {
    if (!this.config.rotation.enabled) {
      return;
    }

    // Check every day
    setInterval(
      () => {
        this.checkKeyRotation();
      },
      24 * 60 * 60 * 1000,
    );
  }

  /**
   * Check if any keys need rotation
   */
  private checkKeyRotation(): void {
    const now = new Date();
    const maxAgeMs = this.config.rotation.maxAge * 24 * 60 * 60 * 1000;
    const warningThresholdMs =
      this.config.rotation.warningThreshold * 24 * 60 * 60 * 1000;

    for (const [keyId, keyConfig] of Object.entries(this.config.keys)) {
      if (!keyConfig.active) continue;

      const keyAge = now.getTime() - keyConfig.createdAt.getTime();

      if (keyAge >= maxAgeMs) {
        console.warn(
          `Key '${keyId}' requires immediate rotation (age: ${Math.floor(keyAge / (24 * 60 * 60 * 1000))} days)`,
        );
        // Would trigger key rotation process
      } else if (keyAge >= warningThresholdMs) {
        console.warn(
          `Key '${keyId}' approaching rotation threshold (age: ${Math.floor(keyAge / (24 * 60 * 60 * 1000))} days)`,
        );
      }
    }
  }

  /**
   * Encrypt database field based on mapping
   */
  encryptField(tableName: string, columnName: string, value: any): any {
    const key = `${tableName}.${columnName}`;
    const mapping = this.encryptionMappings.get(key);

    if (!mapping) {
      return value; // No encryption required
    }

    if (value === null || value === undefined) {
      return value;
    }

    const stringValue = String(value);

    switch (mapping.encryptionType) {
      case "aes256":
        return this.encrypt(stringValue, mapping.keyId);

      case "hash":
        const { hash } = this.hashPassword(stringValue);
        return hash;

      case "rsa":
        // RSA encryption implementation would go here
        throw new Error("RSA encryption not implemented");

      default:
        return value;
    }
  }

  /**
   * Decrypt database field based on mapping
   */
  decryptField(tableName: string, columnName: string, value: any): any {
    const key = `${tableName}.${columnName}`;
    const mapping = this.encryptionMappings.get(key);

    if (!mapping || !value) {
      return value; // No decryption required or no value
    }

    switch (mapping.encryptionType) {
      case "aes256":
        if (typeof value === "object" && value.data) {
          return this.decrypt(value as EncryptedData);
        }
        return value;

      case "hash":
        // Hashes are not decryptable
        return value;

      case "rsa":
        // RSA decryption implementation would go here
        throw new Error("RSA decryption not implemented");

      default:
        return value;
    }
  }

  /**
   * Create searchable index for encrypted field
   */
  createSearchIndex(
    tableName: string,
    columnName: string,
    value: any,
  ): SearchableHash | SearchableHash[] | null {
    const key = `${tableName}.${columnName}`;
    const mapping = this.encryptionMappings.get(key);

    if (!mapping || !mapping.isSearchable || !value) {
      return null;
    }

    const stringValue = String(value);

    switch (mapping.indexType) {
      case "hash":
        return this.createSearchableHash(stringValue, mapping.keyId);

      case "partial":
        return this.createPartialHash(stringValue, mapping.keyId);

      default:
        return null;
    }
  }

  /**
   * Get encryption status for a field
   */
  isFieldEncrypted(tableName: string, columnName: string): boolean {
    const key = `${tableName}.${columnName}`;
    return this.encryptionMappings.has(key);
  }

  /**
   * Get all encryption mappings
   */
  getEncryptionMappings(): Map<string, EncryptionMapping> {
    return new Map(this.encryptionMappings);
  }

  /**
   * Audit encryption operations
   */
  auditEncryptionOperation(
    operation: string,
    keyId: string,
    tableName?: string,
    columnName?: string,
  ): void {
    // Log encryption operations for audit
    console.log("Encryption audit:", {
      operation,
      keyId,
      table: tableName,
      column: columnName,
      timestamp: new Date(),
    });
  }
}

// Encryption configuration
const encryptionConfig: EncryptionConfig = {
  algorithm: "aes-256-gcm",
  keyDerivation: {
    iterations: 100000,
    keyLength: 32,
    hashAlgorithm: "sha512",
  },
  keys: {
    default: {
      key:
        process.env.ENCRYPTION_KEY_DEFAULT ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_DEFAULT ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
    user_pii: {
      key:
        process.env.ENCRYPTION_KEY_USER_PII ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_USER_PII ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
    user_auth: {
      key:
        process.env.ENCRYPTION_KEY_USER_AUTH ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_USER_AUTH ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
    financial: {
      key:
        process.env.ENCRYPTION_KEY_FINANCIAL ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_FINANCIAL ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
    report_content: {
      key:
        process.env.ENCRYPTION_KEY_REPORTS ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_REPORTS ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
    contact_data: {
      key:
        process.env.ENCRYPTION_KEY_CONTACT ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_CONTACT ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
    file_paths: {
      key:
        process.env.ENCRYPTION_KEY_FILES ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_FILES ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
    session: {
      key:
        process.env.ENCRYPTION_KEY_SESSION ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_SESSION ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
    config: {
      key:
        process.env.ENCRYPTION_KEY_CONFIG ||
        crypto.randomBytes(32).toString("hex"),
      salt:
        process.env.ENCRYPTION_SALT_CONFIG ||
        crypto.randomBytes(32).toString("hex"),
      version: 1,
      createdAt: new Date(),
      active: true,
    },
  },
  rotation: {
    enabled: process.env.KEY_ROTATION_ENABLED === "true",
    maxAge: parseInt(process.env.KEY_MAX_AGE_DAYS || "365"),
    warningThreshold: parseInt(process.env.KEY_WARNING_THRESHOLD_DAYS || "30"),
  },
};

// Create singleton instance
export const encryptionService = new EncryptionService(encryptionConfig);

// Export types
export type { EncryptedData, SearchableHash, EncryptionConfig };
