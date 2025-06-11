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
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Achievement {
  achievementText: string;
  impactDescription: string;
}

interface WorkExperienceFormData {
  positionTitle: string;
  companyName: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
  workEnvironmentTags: string[];
  displayOrder?: number;
  achievements: Achievement[];
}

interface WorkExperienceApiData {
  positionTitle: string;
  companyName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  workEnvironmentTags: string[];
  displayOrder: number;
  achievements: Achievement[];
}

interface WorkExperienceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WorkExperienceApiData) => Promise<void>;
  initialData?: WorkExperienceFormData;
}

const PREDEFINED_TAGS = [
  "Remote",
  "Hybrid",
  "On-site",
  "Agile",
  "Waterfall",
  "Fast-paced",
  "Startup",
  "Enterprise",
  "Team-oriented",
  "Collaborative",
  "Innovative",
  "Cross-functional"
] as const;

export function WorkExperienceForm({ isOpen, onClose, onSubmit, initialData }: WorkExperienceFormProps) {
  const [formData, setFormData] = useState<WorkExperienceFormData>({
    positionTitle: initialData?.positionTitle || "",
    companyName: initialData?.companyName || "",
    location: initialData?.location || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : undefined,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : undefined,
    isCurrent: initialData?.isCurrent || false,
    description: initialData?.description || "",
    workEnvironmentTags: initialData?.workEnvironmentTags || [],
    displayOrder: initialData?.displayOrder,
    achievements: initialData?.achievements || [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof WorkExperienceFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      workEnvironmentTags: prev.workEnvironmentTags.includes(tag)
        ? prev.workEnvironmentTags.filter(t => t !== tag)
        : [...prev.workEnvironmentTags, tag]
    }));
  };

  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { achievementText: "", impactDescription: "" }]
    }));
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  const updateAchievement = (index: number, field: keyof Achievement, value: string) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => 
        i === index ? { ...achievement, [field]: value } : achievement
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.positionTitle || !formData.companyName || !formData.startDate) {
        const missingFields = [];
        if (!formData.positionTitle) missingFields.push('Position Title');
        if (!formData.companyName) missingFields.push('Company Name');
        if (!formData.startDate) missingFields.push('Start Date');
        
        toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // Validate end date if not current position
      if (!formData.isCurrent && !formData.endDate) {
        toast.error('Please select an end date or mark as current position');
        setIsSubmitting(false);
        return;
      }

      // Format data for submission
      const cleanedData: WorkExperienceApiData = {
        positionTitle: formData.positionTitle.trim(),
        companyName: formData.companyName.trim(),
        startDate: formData.startDate.toISOString().split('T')[0],
        isCurrent: formData.isCurrent,
        workEnvironmentTags: formData.workEnvironmentTags || [],
        displayOrder: formData.displayOrder ?? 0,
        achievements: formData.achievements
          .filter(a => a.achievementText.trim() || a.impactDescription.trim())
          .map(a => ({
            achievementText: a.achievementText.trim(),
            impactDescription: a.impactDescription.trim()
          })),
        ...(formData.location && { location: formData.location.trim() }),
        ...(!formData.isCurrent && formData.endDate && {
          endDate: formData.endDate.toISOString().split('T')[0]
        }),
        ...(formData.description && { description: formData.description.trim() })
      };

      // Debug log
      console.log('Form data before submission:', {
        rawFormData: formData,
        cleanedData: cleanedData
      });

      await onSubmit(cleanedData);
      onClose();
    } catch (error: any) {
      console.error("Form submission error:", error);
      const errorMessage = error?.message || error?.error || "Failed to save work experience";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto no-scrollbar">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Work Experience" : "Add Work Experience"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="positionTitle">Position Title *</Label>
              <Input
                id="positionTitle"
                value={formData.positionTitle}
                onChange={(e) => handleInputChange("positionTitle", e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name *</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                placeholder="e.g., Tech Innovations Inc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g., San Francisco, CA"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : "Select date"}
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
                <Label>End Date {!formData.isCurrent && '*'}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        (!formData.endDate && !formData.isCurrent) && "text-muted-foreground"
                      )}
                      disabled={formData.isCurrent}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.isCurrent 
                        ? "Present" 
                        : formData.endDate 
                          ? format(formData.endDate, "yyyy-MM-dd")
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
                id="isCurrent"
                checked={formData.isCurrent}
                onCheckedChange={(checked) => {
                  handleInputChange("isCurrent", checked);
                  if (checked) {
                    handleInputChange("endDate", undefined);
                  }
                }}
              />
              <Label htmlFor="isCurrent">I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your role, responsibilities, and key achievements..."
                className="h-32"
              />
            </div>

            <div className="space-y-2">
              <Label>Work Environment</Label>
              <div className="flex flex-wrap gap-2 mt-1.5">
                {PREDEFINED_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={formData.workEnvironmentTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Key Achievements</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAchievement}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Achievement
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => removeAchievement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="space-y-2">
                      <Label>Achievement</Label>
                      <Input
                        value={achievement.achievementText}
                        onChange={(e) => updateAchievement(index, "achievementText", e.target.value)}
                        placeholder="e.g., Led a team of 5 developers in building scalable web applications"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Impact</Label>
                      <Input
                        value={achievement.impactDescription}
                        onChange={(e) => updateAchievement(index, "impactDescription", e.target.value)}
                        placeholder="e.g., Improved deployment efficiency by 40%"
                      />
                    </div>
                  </div>
                ))}
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