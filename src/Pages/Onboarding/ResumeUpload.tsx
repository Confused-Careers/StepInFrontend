import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";

interface ResumeUploadProps {
  onUpload: (file: File) => void;
  uploaded: boolean;
}

export function ResumeUpload({ onUpload, uploaded }: ResumeUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }
      setFile(droppedFile);
      onUpload(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);
      onUpload(selectedFile);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl md:text-3xl font-bold">Upload Your Resume</h2>
        <p className="text-muted-foreground">Our AI will analyze your skills and experience to find the best matches. A resume is required to proceed.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <div
          className={`border-2 border-dashed rounded-lg p-10 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {!file && !uploaded ? (
            <div className="space-y-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-slow">
                <Upload className="h-7 w-7 text-primary" />
              </div>
              <div>
                <p className="font-medium">Drag and drop your resume here</p>
                <p className="text-sm text-muted-foreground mt-1">Supports PDF, DOCX, or TXT files up to 5MB</p>
              </div>
              <div className="relative">
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.txt"
                />
                <Button variant="outline" className="pointer-events-none hover:bg-primary/10">
                  Browse Files
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {uploaded ? (
                <div className="mx-auto w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-pulse-slow">
                  <CheckCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-slow">
                  <FileText className="h-7 w-7 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium">{uploaded ? "Resume uploaded successfully!" : file?.name}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {uploaded ? "Your resume is ready to be processed." : "Selected file ready to upload..."}
                </p>
              </div>
              {!uploaded && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setFile(null)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}