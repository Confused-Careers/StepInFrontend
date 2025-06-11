import { Upload, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const ProfilePictureUploadModal = ({
  isOpen,
  onClose,
  onUpload,
  filePreview,
  setFilePreview,
  selectedFile,
  setSelectedFile,
}: {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  filePreview: string | null;
  setFilePreview: (preview: string | null) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit.');
        return;
      }
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const removePreview = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedFile ? (
            <div
              className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4 transition-all hover:border-blue-400/50 group cursor-pointer"
              onClick={() => document.getElementById('profile-picture-upload')?.click()}
            >
              <div className="flex items-center justify-center gap-3 py-8 text-slate-400 group-hover:text-blue-400 transition-colors">
                <Upload className="w-6 h-6" />
                <div className="text-center">
                  <p className="font-medium">Select Profile Picture</p>
                  <p className="text-sm">JPG, JPEG, PNG, GIF, WEBP (Max 5MB)</p>
                </div>
              </div>
              <Input
                id="profile-picture-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600/50 flex-shrink-0">
                  <img src={filePreview || ''} alt="Profile Picture Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{selectedFile.name}</p>
                  <p className="text-slate-400 text-sm">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    title="Remove Preview"
                    onClick={removePreview}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => selectedFile && onUpload(selectedFile)} disabled={!selectedFile}>
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};