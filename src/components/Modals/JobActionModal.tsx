import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface JobActionModalProps {
  open: boolean;
  onClose: (payload: { coverLetter?: string; notes?: string } | null) => void;
  action: "save" | "apply";
  jobTitle: string;
}

const JobActionModal: React.FC<JobActionModalProps> = ({ open, onClose, action, jobTitle }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (action === "apply") {
      onClose({ coverLetter: coverLetter || undefined, notes: notes || undefined });
    } else {
      onClose({ notes: notes || undefined });
    }
    setCoverLetter("");
    setNotes("");
  };

  const handleSkip = () => {
    onClose(null);
    setCoverLetter("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose(null)}>
      <DialogContent className="sm:max-w-[425px] bg-jobcardsecondary border-primary/10">
        <DialogHeader>
          <DialogTitle>{action === "apply" ? `Apply to ${jobTitle}` : `Save ${jobTitle}`}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {action === "apply" && (
            <div className="grid gap-2">
              <label htmlFor="coverLetter" className="text-sm font-medium">
                Cover Letter (Optional)
              </label>
              <Textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write your cover letter here..."
                className="min-h-[100px] bg-background"
              />
            </div>
          )}
          <div className="grid gap-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes here..."
              className="min-h-[100px] bg-background"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleSkip}>
            Skip
          </Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobActionModal;