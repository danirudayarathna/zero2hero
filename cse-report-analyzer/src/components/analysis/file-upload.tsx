'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
  isLoading?: boolean;
}

export function FileUpload({ onFileUploaded, isLoading = false }: FileUploadProps) {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      setError('Please upload a valid PDF file');
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are supported');
        return;
      }
      setError(null);
      onFileUploaded(file);
    }
  }, [onFileUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={cn(
          'relative flex flex-col items-center justify-center w-full h-64',
          'border-2 border-dashed rounded-xl',
          'transition-all duration-300 ease-in-out',
          'cursor-pointer',
          isDragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : 'border-border hover:border-primary/50 hover:bg-muted/50',
          isLoading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} disabled={isLoading} />
        
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">
              Analyzing your report... This may take a moment.
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 p-8 text-center">
            <div className={cn(
              'flex items-center justify-center w-16 h-16 rounded-full',
              'transition-colors duration-300',
              isDragActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
            )}>
              {isDragActive ? (
                <FileText className="w-8 h-8" />
              ) : (
                <Upload className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-lg font-medium">
                {isDragActive ? 'Drop the PDF here' : 'Upload Annual/Quarterly Report'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop your PDF report here, or click to browse
              </p>
            </div>
            
            <Button variant="outline" size="sm" className="mt-2">
              Select PDF File
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 mt-4 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
