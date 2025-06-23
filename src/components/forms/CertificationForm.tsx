import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CertificationFormData {
  certificationName: string;
  issuingOrganization: string;
  issueDate?: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  displayOrder?: number;
}

interface CertificationApiData {
  certificationName: string;
  issuingOrganization: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  displayOrder: number;
}

interface CertificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CertificationApiData) => Promise<void>;
  initialData?: CertificationFormData;
}

export function CertificationForm({ isOpen, onClose, onSubmit, initialData }: CertificationFormProps) {
  const [formData, setFormData] = useState<CertificationFormData>({
    certificationName: initialData?.certificationName || "",
    issuingOrganization: initialData?.issuingOrganization || "",
    issueDate: initialData?.issueDate ? new Date(initialData.issueDate) : undefined,
    expiryDate: initialData?.expiryDate ? new Date(initialData.expiryDate) : undefined,
    credentialId: initialData?.credentialId || "",
    credentialUrl: initialData?.credentialUrl || "",
    description: initialData?.description || "",
    displayOrder: initialData?.displayOrder,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof CertificationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.certificationName || !formData.issuingOrganization) {
        const missingFields = [];
        if (!formData.certificationName) missingFields.push('Certification Name');
        if (!formData.issuingOrganization) missingFields.push('Issuing Organization');
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      if (formData.credentialUrl && !/^https?:\/\/.+$/.test(formData.credentialUrl)) {
        toast.error('Please enter a valid URL for Credential URL');
        setIsSubmitting(false);
        return;
      }

      const cleanedData: CertificationApiData = {
        certificationName: formData.certificationName.trim(),
        issuingOrganization: formData.issuingOrganization.trim(),
        displayOrder: formData.displayOrder ?? 0,
        ...(formData.issueDate && { issueDate: formData.issueDate.toISOString().split('T')[0] }),
        ...(formData.expiryDate && { expiryDate: formData.expiryDate.toISOString().split('T')[0] }),
        ...(formData.credentialId && { credentialId: formData.credentialId.trim() }),
        ...(formData.credentialUrl && { credentialUrl: formData.credentialUrl.trim() }),
        ...(formData.description && { description: formData.description.trim() }),
      };
      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to save certification");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Certification" : "Add Certification"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certificationName">Certification Name *</Label>
              <Input
                id="certificationName"
                value={formData.certificationName}
                onChange={(e) => handleInputChange("certificationName", e.target.value)}
                placeholder="e.g., AWS Certified Solutions Architect"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuingOrganization">Issuing Organization *</Label>
              <Input
                id="issuingOrganization"
                value={formData.issuingOrganization}
                onChange={(e) => handleInputChange("issuingOrganization", e.target.value)}
                placeholder="e.g., Amazon Web Services"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={formData.issueDate ? formData.issueDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange("issueDate", e.target.value ? new Date(e.target.value) : undefined)}
                  className="bg-black border border-[rgba(209,209,214,0.2)] text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate ? formData.expiryDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value ? new Date(e.target.value) : undefined)}
                  className="bg-black border border-[rgba(209,209,214,0.2)] text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialId">Credential ID</Label>
              <Input
                id="credentialId"
                value={formData.credentialId}
                onChange={(e) => handleInputChange("credentialId", e.target.value)}
                placeholder="e.g., AWS-SA-12345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialUrl">Credential URL</Label>
              <Input
                id="credentialUrl"
                value={formData.credentialUrl}
                onChange={(e) => handleInputChange("credentialUrl", e.target.value)}
                placeholder="e.g., https://aws.amazon.com/verification/AWS-SA-12345678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the certification, skills gained, or its relevance"
                className="h-24"
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