/**
 * Secure File Upload Component
 * Provides comprehensive security measures for file uploads including type validation,
 * malware scanning, size limits, and secure handling
 */

import React, { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  File,
  X,
  AlertTriangle,
  CheckCircle,
  Shield,
  FileX,
  Eye,
  Download,
} from "lucide-react";
import { xssProtection } from "./xssProtection";
import { useCSRFProtection } from "./csrfProtection";
import { useRateLimiting } from "./rateLimiting";

// Security configuration for file uploads
const SECURITY_CONFIG = {
  // File size limits (in bytes)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_TOTAL_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_FILES: 5,

  // Allowed file types with MIME type validation
  ALLOWED_TYPES: {
    "image/jpeg": { extensions: [".jpg", ".jpeg"], maxSize: 5 * 1024 * 1024 },
    "image/png": { extensions: [".png"], maxSize: 5 * 1024 * 1024 },
    "image/gif": { extensions: [".gif"], maxSize: 2 * 1024 * 1024 },
    "image/webp": { extensions: [".webp"], maxSize: 5 * 1024 * 1024 },
    "application/pdf": { extensions: [".pdf"], maxSize: 10 * 1024 * 1024 },
    "text/plain": { extensions: [".txt"], maxSize: 1 * 1024 * 1024 },
    "application/msword": { extensions: [".doc"], maxSize: 10 * 1024 * 1024 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      extensions: [".docx"],
      maxSize: 10 * 1024 * 1024,
    },
  },

  // Dangerous file extensions to block
  BLOCKED_EXTENSIONS: [
    ".exe",
    ".bat",
    ".cmd",
    ".com",
    ".pif",
    ".scr",
    ".vbs",
    ".js",
    ".jar",
    ".app",
    ".deb",
    ".pkg",
    ".dmg",
    ".rpm",
    ".sh",
    ".ps1",
    ".php",
    ".asp",
    ".jsp",
    ".py",
    ".rb",
    ".pl",
    ".sql",
    ".html",
    ".htm",
    ".xml",
  ],

  // Magic bytes for file type validation
  MAGIC_BYTES: {
    "image/jpeg": [0xff, 0xd8, 0xff],
    "image/png": [0x89, 0x50, 0x4e, 0x47],
    "image/gif": [0x47, 0x49, 0x46],
    "image/webp": [0x52, 0x49, 0x46, 0x46],
    "application/pdf": [0x25, 0x50, 0x44, 0x46],
  },

  // Virus scanning patterns (simple heuristics)
  VIRUS_SIGNATURES: [
    "EICAR-STANDARD-ANTIVIRUS-TEST-FILE",
    "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*",
  ],
};

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: "pending" | "scanning" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
  url?: string;
  securityChecks: {
    typeValidation: boolean;
    sizeValidation: boolean;
    nameValidation: boolean;
    contentValidation: boolean;
    virusScanning: boolean;
  };
}

interface SecureFileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  onFileRemoved?: (fileId: string) => void;
  maxFiles?: number;
  maxFileSize?: number;
  allowedTypes?: string[];
  uploadEndpoint?: string;
  category?: string;
  description?: string;
  disabled?: boolean;
  showPreview?: boolean;
}

const SecureFileUpload: React.FC<SecureFileUploadProps> = ({
  onFilesUploaded,
  onFileRemoved,
  maxFiles = SECURITY_CONFIG.MAX_FILES,
  maxFileSize = SECURITY_CONFIG.MAX_FILE_SIZE,
  allowedTypes = Object.keys(SECURITY_CONFIG.ALLOWED_TYPES),
  uploadEndpoint = "/api/upload",
  category = "general",
  description,
  disabled = false,
  showPreview = true,
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { getTokenForRequest } = useCSRFProtection();
  const { checkRateLimit } = useRateLimiting();

  /**
   * Validate file type using multiple methods
   */
  const validateFileType = async (file: File): Promise<boolean> => {
    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return false;
    }

    // Check file extension
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const typeConfig = SECURITY_CONFIG.ALLOWED_TYPES[file.type];

    if (!typeConfig || !typeConfig.extensions.includes(extension)) {
      return false;
    }

    // Check for blocked extensions
    if (SECURITY_CONFIG.BLOCKED_EXTENSIONS.includes(extension)) {
      return false;
    }

    // Validate magic bytes
    try {
      const magicBytes = SECURITY_CONFIG.MAGIC_BYTES[file.type];
      if (magicBytes) {
        const buffer = await file.slice(0, 8).arrayBuffer();
        const bytes = new Uint8Array(buffer);

        for (let i = 0; i < magicBytes.length; i++) {
          if (bytes[i] !== magicBytes[i]) {
            return false;
          }
        }
      }
    } catch (error) {
      console.error("Magic byte validation failed:", error);
      return false;
    }

    return true;
  };

  /**
   * Validate file name for security
   */
  const validateFileName = (name: string): boolean => {
    // Sanitize file name
    const sanitizedName = xssProtection.sanitizeText(name);

    // Check for dangerous patterns
    const dangerousPatterns = [
      /\.\./, // Directory traversal
      /[<>:"/\\|?*]/, // Invalid characters
      /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i, // Reserved names
      /^\./, // Hidden files
    ];

    return !dangerousPatterns.some((pattern) => pattern.test(sanitizedName));
  };

  /**
   * Scan file content for security threats
   */
  const scanFileContent = async (file: File): Promise<boolean> => {
    try {
      // Read file content as text for scanning
      const content = await file.text();

      // Check for virus signatures
      for (const signature of SECURITY_CONFIG.VIRUS_SIGNATURES) {
        if (content.includes(signature)) {
          return false;
        }
      }

      // Check for script injection in text files
      if (file.type.startsWith("text/")) {
        const hasScript = /<script|javascript:|vbscript:|data:/i.test(content);
        if (hasScript) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Content scanning failed:", error);
      return false; // Fail secure
    }
  };

  /**
   * Perform comprehensive security validation
   */
  const performSecurityChecks = async (
    file: File,
  ): Promise<UploadedFile["securityChecks"]> => {
    const checks = {
      typeValidation: false,
      sizeValidation: false,
      nameValidation: false,
      contentValidation: false,
      virusScanning: false,
    };

    try {
      // Type validation
      checks.typeValidation = await validateFileType(file);

      // Size validation
      const typeConfig = SECURITY_CONFIG.ALLOWED_TYPES[file.type];
      const maxSize = typeConfig ? typeConfig.maxSize : maxFileSize;
      checks.sizeValidation = file.size <= maxSize;

      // Name validation
      checks.nameValidation = validateFileName(file.name);

      // Content validation
      checks.contentValidation = await scanFileContent(file);

      // Virus scanning (basic heuristics)
      checks.virusScanning = checks.contentValidation;
    } catch (error) {
      console.error("Security check failed:", error);
    }

    return checks;
  };

  /**
   * Upload file to server with security measures
   */
  const uploadFile = async (uploadedFile: UploadedFile): Promise<void> => {
    // Check rate limit
    const rateLimitResult = checkRateLimit(uploadEndpoint);
    if (!rateLimitResult.allowed) {
      throw new Error(
        `Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`,
      );
    }

    const formData = new FormData();
    formData.append("file", uploadedFile.file);
    formData.append("category", category);
    formData.append("originalName", uploadedFile.file.name);
    formData.append(
      "securityChecks",
      JSON.stringify(uploadedFile.securityChecks),
    );

    if (description) {
      formData.append("description", xssProtection.sanitizeText(description));
    }

    // Add CSRF token
    const csrfHeaders = getTokenForRequest();

    const response = await fetch(uploadEndpoint, {
      method: "POST",
      headers: {
        ...csrfHeaders,
        // Don't set Content-Type for FormData
      },
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Upload failed with status ${response.status}`,
      );
    }

    const result = await response.json();

    // Update file with server response
    setFiles((prev) =>
      prev.map((f) =>
        f.id === uploadedFile.id
          ? { ...f, status: "success", progress: 100, url: result.url }
          : f,
      ),
    );
  };

  /**
   * Process dropped/selected files
   */
  const processFiles = useCallback(
    async (acceptedFiles: File[]) => {
      setGlobalError(null);

      // Check total file count
      if (files.length + acceptedFiles.length > maxFiles) {
        setGlobalError(`Maximum ${maxFiles} files allowed`);
        return;
      }

      // Check total size
      const totalSize =
        files.reduce((sum, f) => sum + f.size, 0) +
        acceptedFiles.reduce((sum, f) => sum + f.size, 0);

      if (totalSize > SECURITY_CONFIG.MAX_TOTAL_SIZE) {
        setGlobalError(
          `Total file size exceeds ${SECURITY_CONFIG.MAX_TOTAL_SIZE / 1024 / 1024}MB limit`,
        );
        return;
      }

      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        status: "pending",
        progress: 0,
        securityChecks: {
          typeValidation: false,
          sizeValidation: false,
          nameValidation: false,
          contentValidation: false,
          virusScanning: false,
        },
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Process each file
      for (const uploadedFile of newFiles) {
        try {
          // Update status to scanning
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id ? { ...f, status: "scanning" } : f,
            ),
          );

          // Perform security checks
          const securityChecks = await performSecurityChecks(uploadedFile.file);

          // Check if all security checks passed
          const allChecksPassed = Object.values(securityChecks).every(
            (check) => check,
          );

          if (!allChecksPassed) {
            const failedChecks = Object.entries(securityChecks)
              .filter(([_, passed]) => !passed)
              .map(([check]) => check);

            throw new Error(
              `Security validation failed: ${failedChecks.join(", ")}`,
            );
          }

          // Update security checks
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, securityChecks, status: "uploading" }
                : f,
            ),
          );

          // Upload file
          await uploadFile({ ...uploadedFile, securityChecks });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Upload failed";

          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadedFile.id
                ? { ...f, status: "error", error: errorMessage }
                : f,
            ),
          );
        }
      }

      // Notify parent component
      if (onFilesUploaded) {
        onFilesUploaded(files.filter((f) => f.status === "success"));
      }
    },
    [files, maxFiles, onFilesUploaded],
  );

  /**
   * Remove file from list
   */
  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (onFileRemoved) {
      onFileRemoved(fileId);
    }
  };

  /**
   * Setup dropzone
   */
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: processFiles,
    accept: allowedTypes.reduce(
      (acc, type) => {
        acc[type] = SECURITY_CONFIG.ALLOWED_TYPES[type]?.extensions || [];
        return acc;
      },
      {} as Record<string, string[]>,
    ),
    maxSize: maxFileSize,
    disabled: disabled || isUploading,
    multiple: maxFiles > 1,
  });

  /**
   * Get security check icon
   */
  const getSecurityIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="h-3 w-3 text-green-500" />
    ) : (
      <X className="h-3 w-3 text-red-500" />
    );
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : disabled
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 hover:border-primary/50"
        }`}
      >
        <CardContent
          {...getRootProps()}
          className="flex flex-col items-center justify-center p-8 text-center cursor-pointer"
        >
          <input {...getInputProps()} ref={fileInputRef} />

          <Upload
            className={`h-12 w-12 mb-4 ${
              disabled ? "text-gray-400" : "text-gray-500"
            }`}
          />

          <div className="space-y-2">
            <p className="text-lg font-medium">
              {isDragActive ? "Drop files here" : "Drag & drop files here"}
            </p>
            <p className="text-sm text-gray-500">or click to select files</p>
            <p className="text-xs text-gray-400">
              Max {maxFiles} files, {maxFileSize / 1024 / 1024}MB each
            </p>
          </div>

          {!disabled && (
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select Files
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Global Error */}
      {globalError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {globalError}
          </AlertDescription>
        </Alert>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm">
            Uploaded Files ({files.length})
          </h4>

          {files.map((uploadedFile) => (
            <Card key={uploadedFile.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <File className="h-5 w-5 text-gray-500 mt-0.5" />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(uploadedFile.size / 1024).toFixed(1)} KB •{" "}
                      {uploadedFile.type}
                    </p>

                    {/* Progress Bar */}
                    {uploadedFile.status === "uploading" && (
                      <Progress
                        value={uploadedFile.progress}
                        className="mt-2"
                      />
                    )}

                    {/* Error Message */}
                    {uploadedFile.error && (
                      <p className="text-xs text-red-600 mt-1">
                        {uploadedFile.error}
                      </p>
                    )}

                    {/* Security Checks */}
                    {(uploadedFile.status === "scanning" ||
                      uploadedFile.status === "uploading" ||
                      uploadedFile.status === "success") && (
                      <div className="mt-2 flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          {getSecurityIcon(
                            uploadedFile.securityChecks.typeValidation,
                          )}
                          <span>Type</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getSecurityIcon(
                            uploadedFile.securityChecks.sizeValidation,
                          )}
                          <span>Size</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getSecurityIcon(
                            uploadedFile.securityChecks.nameValidation,
                          )}
                          <span>Name</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getSecurityIcon(
                            uploadedFile.securityChecks.contentValidation,
                          )}
                          <span>Content</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {getSecurityIcon(
                            uploadedFile.securityChecks.virusScanning,
                          )}
                          <span>Security</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Status indicator */}
                  {uploadedFile.status === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  {uploadedFile.status === "error" && (
                    <FileX className="h-4 w-4 text-red-500" />
                  )}
                  {(uploadedFile.status === "scanning" ||
                    uploadedFile.status === "uploading") && (
                    <Shield className="h-4 w-4 text-blue-500 animate-pulse" />
                  )}

                  {/* Preview/Download button */}
                  {showPreview &&
                    uploadedFile.url &&
                    uploadedFile.status === "success" && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(uploadedFile.url, "_blank")}
                      >
                        {uploadedFile.type.startsWith("image/") ? (
                          <Eye className="h-3 w-3" />
                        ) : (
                          <Download className="h-3 w-3" />
                        )}
                      </Button>
                    )}

                  {/* Remove button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(uploadedFile.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SecureFileUpload;

// Export security configuration
export { SECURITY_CONFIG };
export type { UploadedFile };
