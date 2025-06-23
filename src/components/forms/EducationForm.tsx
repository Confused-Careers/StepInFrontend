import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface EducationFormData {
  institutionName: string;
  degreeType: string;
  fieldOfStudy: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrentlyStudying: boolean;
  gpa?: string;
  gpaScale?: string;
  description?: string;
  thesisProject?: string;
  displayOrder?: number;
}

interface EducationApiData {
  institutionName: string;
  degreeType: string;
  fieldOfStudy: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  gpaScale?: string;
  description?: string;
  thesisProject?: string;
  displayOrder: number;
}

interface EducationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EducationApiData) => Promise<void>;
  initialData?: EducationFormData;
}

export function EducationForm({ isOpen, onClose, onSubmit, initialData }: EducationFormProps) {
  const [formData, setFormData] = useState<EducationFormData>({
    institutionName: initialData?.institutionName || "",
    degreeType: initialData?.degreeType || "",
    fieldOfStudy: initialData?.fieldOfStudy || "",
    location: initialData?.location || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
    isCurrentlyStudying: initialData?.isCurrentlyStudying || false,
    gpa: initialData?.gpa?.toString() || "",
    gpaScale: initialData?.gpaScale || "4.00",
    description: initialData?.description || "",
    thesisProject: initialData?.thesisProject || "",
    displayOrder: initialData?.displayOrder,
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        institutionName: initialData.institutionName || "",
        degreeType: initialData.degreeType || "",
        fieldOfStudy: initialData.fieldOfStudy || "",
        location: initialData.location || "",
        startDate: initialData.startDate ? new Date(initialData.startDate) : undefined,
        endDate: initialData.endDate ? new Date(initialData.endDate) : undefined,
        isCurrentlyStudying: initialData.isCurrentlyStudying || false,
        gpa: initialData.gpa?.toString() || "",
        gpaScale: initialData.gpaScale || "4.00",
        description: initialData.description || "",
        thesisProject: initialData.thesisProject || "",
        displayOrder: initialData.displayOrder,
      });
    } else if (isOpen && !initialData) {
      setFormData({
        institutionName: "",
        degreeType: "",
        fieldOfStudy: "",
        location: "",
        startDate: undefined,
        endDate: undefined,
        isCurrentlyStudying: false,
        gpa: "",
        gpaScale: "4.00",
        description: "",
        thesisProject: "",
        displayOrder: undefined,
      });
    }
  }, [isOpen, initialData]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EducationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.institutionName || !formData.degreeType || !formData.fieldOfStudy || !formData.startDate) {
        const missingFields = [];
        if (!formData.institutionName) missingFields.push('Institution Name');
        if (!formData.degreeType) missingFields.push('Degree Type');
        if (!formData.fieldOfStudy) missingFields.push('Field of Study');
        if (!formData.startDate) missingFields.push('Start Date');
        
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      const cleanedData: EducationApiData = {
        institutionName: formData.institutionName.trim(),
        degreeType: formData.degreeType.trim(),
        fieldOfStudy: formData.fieldOfStudy.trim(),
        startDate: formData.startDate.toISOString().split('T')[0],
        displayOrder: formData.displayOrder ?? 0,
        ...(formData.location && { location: formData.location.trim() }),
        ...(!formData.isCurrentlyStudying && formData.endDate && {
          endDate: formData.endDate.toISOString().split('T')[0]
        }),
        ...(formData.gpa && { 
          gpa: parseFloat(formData.gpa),
          gpaScale: formData.gpaScale || "4.00"
        }),
        ...(formData.description && { description: formData.description.trim() }),
        ...(formData.thesisProject && { thesisProject: formData.thesisProject.trim() })
      };
      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", {
        error,
        formData,
        cleanedData: {
          institutionName: formData.institutionName.trim(),
          degreeType: formData.degreeType.trim(),
          fieldOfStudy: formData.fieldOfStudy.trim(),
          startDate: formData.startDate?.toISOString().split('T')[0],
          displayOrder: formData.displayOrder ?? 0,
          ...(formData.location && { location: formData.location.trim() }),
          ...(!formData.isCurrentlyStudying && formData.endDate && {
            endDate: formData.endDate.toISOString().split('T')[0]
          }),
          ...(formData.gpa && { 
            gpa: parseFloat(formData.gpa),
            gpaScale: formData.gpaScale || "4.00"
          }),
          ...(formData.description && { description: formData.description.trim() }),
          ...(formData.thesisProject && { thesisProject: formData.thesisProject.trim() })
        }
      });
      toast.error("Failed to save education record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Education" : "Add Education"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institutionName">Institution Name *</Label>
              <Input
                id="institutionName"
                value={formData.institutionName}
                onChange={(e) => handleInputChange("institutionName", e.target.value)}
                placeholder="Enter institution name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="degreeType">Degree Type *</Label>
              <Select
                value={formData.degreeType}
                onValueChange={(value) => handleInputChange("degreeType", value)}
              >
                <SelectTrigger id="degreeType">
                  <SelectValue placeholder="Select degree type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="associate">Associate's</SelectItem>
                  <SelectItem value="bachelor">Bachelor's</SelectItem>
                  <SelectItem value="master">Master's</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                  <SelectItem value="diploma">Diploma</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Field of Study *</Label>
              <Input
                id="fieldOfStudy"
                value={formData.fieldOfStudy}
                onChange={(e) => handleInputChange("fieldOfStudy", e.target.value)}
                placeholder="Enter field of study"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="Enter location (optional)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate ? formData.startDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange("startDate", e.target.value ? new Date(e.target.value) : undefined)}
                  className="bg-black border border-[rgba(209,209,214,0.2)] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate ? formData.endDate.toISOString().split('T')[0] : ''}
                  onChange={(e) => handleInputChange("endDate", e.target.value ? new Date(e.target.value) : undefined)}
                  disabled={formData.isCurrentlyStudying}
                  className="bg-black border border-[rgba(209,209,214,0.2)] text-white"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isCurrentlyStudying"
                checked={formData.isCurrentlyStudying}
                onCheckedChange={(checked) => {
                  handleInputChange("isCurrentlyStudying", checked);
                  if (checked) {
                    handleInputChange("endDate", undefined);
                  }
                }}
              />
              <Label htmlFor="isCurrentlyStudying">I am currently studying here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                value={formData.gpa}
                onChange={(e) => handleInputChange("gpa", e.target.value)}
                placeholder="Enter GPA (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpaScale">GPA Scale</Label>
              <Input
                id="gpaScale"
                value={formData.gpaScale}
                onChange={(e) => handleInputChange("gpaScale", e.target.value)}
                placeholder="Enter GPA scale (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your studies, achievements, or activities"
                className="h-24"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thesisProject">Thesis/Project</Label>
              <Textarea
                id="thesisProject"
                value={formData.thesisProject}
                onChange={(e) => handleInputChange("thesisProject", e.target.value)}
                placeholder="Enter thesis or project description"
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