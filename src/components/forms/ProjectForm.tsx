import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface ProjectFormData {
  projectName: string;
  role?: string;
  completionYear?: number;
  description?: string;
  impactDescription?: string;
  projectUrl?: string;
  displayOrder?: number;
}

interface ProjectApiData {
  projectName: string;
  role?: string;
  completionYear?: number;
  description?: string;
  impactDescription?: string;
  projectUrl?: string;
  displayOrder: number;
}

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectApiData) => Promise<void>;
  initialData?: ProjectFormData;
}

export function ProjectForm({ isOpen, onClose, onSubmit, initialData }: ProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: initialData?.projectName || "",
    role: initialData?.role || "",
    completionYear: initialData?.completionYear || undefined,
    description: initialData?.description || "",
    impactDescription: initialData?.impactDescription || "",
    projectUrl: initialData?.projectUrl || "",
    displayOrder: initialData?.displayOrder,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof ProjectFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.projectName) {
        toast.error('Please fill in the required field: Project Name');
        setIsSubmitting(false);
        return;
      }

      if (formData.projectUrl && !/^https?:\/\/.+$/.test(formData.projectUrl)) {
        toast.error('Please enter a valid URL for Project URL');
        setIsSubmitting(false);
        return;
      }

      if (formData.completionYear && (formData.completionYear < 1900 || formData.completionYear > new Date().getFullYear() + 5)) {
        toast.error(`Completion Year must be between 1900 and ${new Date().getFullYear() + 5}`);
        setIsSubmitting(false);
        return;
      }

      const cleanedData: ProjectApiData = {
        projectName: formData.projectName.trim(),
        displayOrder: formData.displayOrder ?? 0,
        ...(formData.role && { role: formData.role.trim() }),
        ...(formData.completionYear && { completionYear: formData.completionYear }),
        ...(formData.description && { description: formData.description.trim() }),
        ...(formData.impactDescription && { impactDescription: formData.impactDescription.trim() }),
        ...(formData.projectUrl && { projectUrl: formData.projectUrl.trim() }),
      };
      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save project");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name *</Label>
              <Input
                id="projectName"
                value={formData.projectName}
                onChange={(e) => handleInputChange("projectName", e.target.value)}
                placeholder="e.g., E-commerce Platform"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="e.g., Full Stack Developer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="completionYear">Completion Year</Label>
              <Input
                id="completionYear"
                type="number"
                value={formData.completionYear || ''}
                onChange={(e) => handleInputChange("completionYear", e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g., 2023"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the project, technologies used, or key features"
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="impactDescription">Impact</Label>
              <Textarea
                id="impactDescription"
                value={formData.impactDescription}
                onChange={(e) => handleInputChange("impactDescription", e.target.value)}
                placeholder="Describe the impact or results of the project"
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectUrl">Project URL</Label>
              <Input
                id="projectUrl"
                value={formData.projectUrl}
                onChange={(e) => handleInputChange("projectUrl", e.target.value)}
                placeholder="e.g., https://github.com/johndoe/ecommerce-platform"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}