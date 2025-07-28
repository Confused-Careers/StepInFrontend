import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, AlertCircle, User, FileText, Briefcase, GraduationCap, Code, FileUp, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jobSeekerServices, { ProfileCompletionDetails } from "@/services/jobSeekerServices";
import { toast } from "sonner";

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  completionPercentage?: number;
  missingRequirements?: string[];
  fetchDetails?: boolean;
}

export function ProfileCompletionModal({
  isOpen,
  onClose,
  completionPercentage: propCompletionPercentage,
  missingRequirements: propMissingRequirements,
  fetchDetails = false
}: ProfileCompletionModalProps) {
  const navigate = useNavigate();
  const [profileDetails, setProfileDetails] = useState<ProfileCompletionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && fetchDetails) {
      fetchProfileCompletion();
    }
  }, [isOpen, fetchDetails]);

  const fetchProfileCompletion = async () => {
    setIsLoading(true);
    try {
      const details = await jobSeekerServices.getProfileCompletion();
      setProfileDetails(details);
    } catch (error) {
      console.error("Error fetching profile completion:", error);
      toast.error("Failed to load profile details");
    } finally {
      setIsLoading(false);
    }
  };

  const completionPercentage = profileDetails?.overallPercentage ?? propCompletionPercentage ?? 0;
  const missingRequirements = profileDetails?.missingRequirements ?? propMissingRequirements ?? [];

  const sectionIcons = {
    basicInfo: User,
    aboutMe: FileText,
    workExperience: Briefcase,
    education: GraduationCap,
    skills: Code,
    resume: FileUp,
    mcqAnswers: HelpCircle
  };

  const sectionLabels = {
    basicInfo: "Basic Information",
    aboutMe: "About Me",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    resume: "Resume",
    mcqAnswers: "Assessment Questions"
  };

  const handleCompleteProfile = () => {
    navigate("/dashboard/profile");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6 text-yellow-500" />
            <DialogTitle>Complete Your Profile</DialogTitle>
          </div>
          <DialogDescription>
            Your profile needs to be at least 50% complete to access job features.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Profile Completion</span>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {completionPercentage < 50 ? `${50 - completionPercentage}% more needed to unlock job features` : 'Your profile is eligible for job features!'}
            </p>
          </div>

          {profileDetails && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Section Breakdown:</h4>
              <div className="space-y-2">
                {Object.entries(profileDetails.sections).map(([key, section]) => {
                  const Icon = sectionIcons[key as keyof typeof sectionIcons];
                  return (
                    <div key={key} className="flex items-center gap-3">
                      {section.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Icon className="h-4 w-4" />
                      <span className="text-sm flex-1">{sectionLabels[key as keyof typeof sectionLabels]}</span>
                      <span className="text-xs font-medium">{section.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {missingRequirements.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Next Steps:</h4>
              <ul className="space-y-2">
                {missingRequirements.map((requirement, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-sm flex-1">{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              onClick={handleCompleteProfile}
              className="flex-1"
            >
              Complete Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}