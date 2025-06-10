import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface EducationFormData {
  school: string;
  degree: string;
  fieldOfStudy: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrentlyStudying: boolean;
  grade?: string;
  description?: string;
  coursework: string[];
}

interface EducationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EducationFormData) => Promise<void>;
  initialData?: EducationFormData;
}

export function EducationForm({ isOpen, onClose, onSubmit, initialData }: EducationFormProps) {
  const [formData, setFormData] = useState<EducationFormData>({
    school: initialData?.school || "",
    degree: initialData?.degree || "",
    fieldOfStudy: initialData?.fieldOfStudy || "",
    location: initialData?.location || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
    isCurrentlyStudying: initialData?.isCurrentlyStudying || false,
    grade: initialData?.grade || "",
    description: initialData?.description || "",
    coursework: initialData?.coursework || [""],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof EducationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCourseworkChange = (index: number, value: string) => {
    const newCoursework = [...formData.coursework];
    newCoursework[index] = value;
    handleInputChange("coursework", newCoursework);
  };

  const addCoursework = () => {
    handleInputChange("coursework", [...formData.coursework, ""]);
  };

  const removeCoursework = (index: number) => {
    const newCoursework = formData.coursework.filter((_: string, i: number) => i !== index);
    handleInputChange("coursework", newCoursework);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Filter out empty coursework
      const cleanedData = {
        ...formData,
        coursework: formData.coursework.filter((course: string) => course.trim() !== ""),
      };

      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Education" : "Add Education"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="school">School/Institution *</Label>
              <Input
                id="school"
                value={formData.school}
                onChange={(e) => handleInputChange("school", e.target.value)}
                placeholder="Enter school or institution name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree *</Label>
                <Input
                  id="degree"
                  value={formData.degree}
                  onChange={(e) => handleInputChange("degree", e.target.value)}
                  placeholder="Enter degree"
                  required
                />
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
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "MMM yyyy") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => handleInputChange("startDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        (!formData.endDate && !formData.isCurrentlyStudying) && "text-muted-foreground"
                      )}
                      disabled={formData.isCurrentlyStudying}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.isCurrentlyStudying 
                        ? "Present" 
                        : formData.endDate 
                          ? format(formData.endDate, "MMM yyyy")
                          : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => handleInputChange("endDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
              <Label htmlFor="grade">Grade/GPA</Label>
              <Input
                id="grade"
                value={formData.grade}
                onChange={(e) => handleInputChange("grade", e.target.value)}
                placeholder="Enter grade or GPA (optional)"
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
              <Label>Coursework</Label>
              <div className="space-y-2">
                {formData.coursework.map((course: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={course}
                      onChange={(e) => handleCourseworkChange(index, e.target.value)}
                      placeholder="Enter a course"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCoursework(index)}
                      disabled={formData.coursework.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addCoursework}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Course
                </Button>
              </div>
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