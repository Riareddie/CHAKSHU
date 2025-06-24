
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import FileUpload from '@/components/common/FileUpload';

interface EvidenceUploadProps {
  reportId: string;
  onEvidenceUploaded?: () => void;
}

const EvidenceUpload: React.FC<EvidenceUploadProps> = ({ reportId, onEvidenceUploaded }) => {
  const handleFilesUploaded = () => {
    onEvidenceUploaded?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Evidence
        </CardTitle>
        <CardDescription>
          Upload supporting documents, screenshots, or other evidence related to this fraud report
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FileUpload
          reportId={reportId}
          onFilesUploaded={handleFilesUploaded}
          maxFiles={10}
          maxSize={25}
          acceptedFileTypes={[
            'image/*',
            'application/pdf',
            '.doc',
            '.docx',
            '.txt',
            '.csv',
            '.xlsx',
            'audio/*',
            'video/*'
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default EvidenceUpload;
