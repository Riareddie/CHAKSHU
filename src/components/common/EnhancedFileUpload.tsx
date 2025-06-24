import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Upload,
  File,
  X,
  CheckCircle,
  AlertCircle,
  Image,
  Video,
  FileText,
  Music,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnhancedFileUploadProps {
  onFilesUploaded?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedFileTypes?: string[];
  className?: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  file: File;
  uploadProgress: number;
  status: "uploading" | "completed" | "error";
}

const EnhancedFileUpload: React.FC<EnhancedFileUploadProps> = ({
  onFilesUploaded,
  maxFiles = 5,
  maxSize = 10,
  acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "audio/mp3",
    "audio/wav",
    "audio/mpeg",
    "video/mp4",
    "video/mov",
    "video/quicktime",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  className = "",
}) => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/"))
      return <Image className="h-5 w-5 text-blue-500" />;
    if (type.startsWith("video/"))
      return <Video className="h-5 w-5 text-purple-500" />;
    if (type.startsWith("audio/"))
      return <Music className="h-5 w-5 text-green-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const getFileTypeLabel = (type: string) => {
    if (type.startsWith("image/")) return "Image";
    if (type.startsWith("video/")) return "Video";
    if (type.startsWith("audio/")) return "Audio";
    if (type.includes("pdf")) return "PDF";
    if (type.includes("word") || type.includes("document")) return "Document";
    return "File";
  };

  const simulateUpload = async (file: UploadedFile): Promise<void> => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          // Simulate potential upload failure (5% chance)
          if (Math.random() < 0.05) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? { ...f, status: "error" as const, uploadProgress: 0 }
                  : f,
              ),
            );
            reject(new Error("Upload failed"));
          } else {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === file.id
                  ? {
                      ...f,
                      status: "completed" as const,
                      uploadProgress: 100,
                      url: URL.createObjectURL(f.file),
                    }
                  : f,
              ),
            );
            resolve();
          }
        } else {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === file.id
                ? { ...f, uploadProgress: Math.round(progress) }
                : f,
            ),
          );
        }
      }, 100);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[], rejectedFiles: any[]) => {
      // Handle rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file, errors }) => {
          errors.forEach((error: any) => {
            if (error.code === "file-too-large") {
              toast({
                title: "File too large",
                description: `${file.name} exceeds ${maxSize}MB limit`,
                variant: "destructive",
              });
            } else if (error.code === "file-invalid-type") {
              toast({
                title: "Invalid file type",
                description: `${file.name} is not a supported file type`,
                variant: "destructive",
              });
            }
          });
        });
      }

      // Check total file count
      if (files.length + acceptedFiles.length > maxFiles) {
        toast({
          title: "Too many files",
          description: `Maximum ${maxFiles} files allowed. Currently have ${files.length} files.`,
          variant: "destructive",
        });
        return;
      }

      setUploading(true);

      try {
        const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
          id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          file,
          uploadProgress: 0,
          status: "uploading" as const,
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        // Upload files sequentially to show individual progress
        for (const file of newFiles) {
          try {
            await simulateUpload(file);
          } catch (error) {
            toast({
              title: "Upload failed",
              description: `Failed to upload ${file.name}`,
              variant: "destructive",
            });
          }
        }

        const allFiles = [
          ...files,
          ...newFiles.filter((f) => f.status === "completed"),
        ];
        onFilesUploaded?.(allFiles);

        const successCount = newFiles.filter(
          (f) => f.status === "completed",
        ).length;
        if (successCount > 0) {
          toast({
            title: "Upload completed",
            description: `${successCount} file(s) uploaded successfully`,
          });
        }
      } catch (error: any) {
        toast({
          title: "Upload failed",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    },
    [files, maxFiles, maxSize, onFilesUploaded, toast],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: acceptedFileTypes.reduce(
        (acc, type) => {
          acc[type] = [];
          return acc;
        },
        {} as Record<string, string[]>,
      ),
      maxFiles: maxFiles - files.length,
      maxSize: maxSize * 1024 * 1024,
      disabled: uploading || files.length >= maxFiles,
    });

  const removeFile = (fileId: string) => {
    const newFiles = files.filter((file) => file.id !== fileId);
    setFiles(newFiles);
    onFilesUploaded?.(newFiles.filter((f) => f.status === "completed"));
  };

  const getOverallProgress = () => {
    if (files.length === 0) return 0;
    const totalProgress = files.reduce(
      (sum, file) => sum + file.uploadProgress,
      0,
    );
    return Math.round(totalProgress / files.length);
  };

  const hasUploadingFiles = files.some((f) => f.status === "uploading");

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-india-saffron" />
            Upload Evidence
            <Badge variant="secondary" className="ml-auto">
              {files.filter((f) => f.status === "completed").length}/{maxFiles}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Drop Zone */}
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              ${
                isDragActive && !isDragReject
                  ? "border-india-saffron bg-saffron-50 scale-105"
                  : isDragReject
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 hover:border-india-saffron hover:bg-gray-50"
              }
              ${uploading || files.length >= maxFiles ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />
            <Upload
              className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? "text-india-saffron animate-bounce" : "text-gray-400"}`}
            />

            {isDragReject ? (
              <div className="text-red-600">
                <p className="text-lg font-medium mb-2">Invalid file type</p>
                <p className="text-sm">Please drop only supported file types</p>
              </div>
            ) : isDragActive ? (
              <div className="text-india-saffron">
                <p className="text-lg font-medium mb-2">Drop files here!</p>
                <p className="text-sm">Release to upload</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag & drop evidence files here
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse and select files
                </p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading || files.length >= maxFiles}
                  className="mb-4"
                >
                  {files.length >= maxFiles
                    ? "Maximum files reached"
                    : "Choose Files"}
                </Button>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>
                    Supported: Images (JPG, PNG, GIF), Audio (MP3, WAV), Video
                    (MP4, MOV), Documents (PDF, DOC)
                  </p>
                  <p>
                    Maximum {maxFiles} files • {maxSize}MB per file • Total size
                    limit: {maxFiles * maxSize}MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Overall Progress */}
          {hasUploadingFiles && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Overall Progress
                </span>
                <span className="text-sm text-gray-500">
                  {getOverallProgress()}%
                </span>
              </div>
              <Progress value={getOverallProgress()} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Uploaded Files (
              {files.filter((f) => f.status === "completed").length} of{" "}
              {maxFiles})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">
                          {file.name}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {getFileTypeLabel(file.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        {file.status === "uploading" && (
                          <span className="text-blue-600">
                            Uploading... {file.uploadProgress}%
                          </span>
                        )}
                        {file.status === "completed" && (
                          <span className="text-green-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Uploaded
                          </span>
                        )}
                        {file.status === "error" && (
                          <span className="text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Failed
                          </span>
                        )}
                      </div>

                      {/* Individual file progress */}
                      {file.status === "uploading" && (
                        <Progress
                          value={file.uploadProgress}
                          className="h-1 mt-2"
                        />
                      )}
                    </div>
                  </div>

                  {/* Preview thumbnail for images */}
                  {file.status === "completed" &&
                    file.type.startsWith("image/") &&
                    file.url && (
                      <div className="ml-4">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    )}

                  {/* Remove button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="ml-2 h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                    disabled={file.status === "uploading"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* File upload tips */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  <p className="font-medium mb-1">Evidence Upload Tips:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-xs">
                    <li>Screenshots of fraudulent messages or calls</li>
                    <li>Audio recordings of suspicious phone calls</li>
                    <li>Email headers and content as PDF</li>
                    <li>Bank statements showing unauthorized transactions</li>
                    <li>Any other relevant documentation</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedFileUpload;
