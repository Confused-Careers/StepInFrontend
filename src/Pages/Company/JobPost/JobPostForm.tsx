import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import companyServices from "@/services/companyServices";
import Logo from "../../../assets/StepIn Transparent Logo.png";

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  isRemote: boolean;
  salaryMin: string;
  salaryMax: string;
  applicationDeadline: string;
  requiredSkills: string[];
  requiredLanguages: Array<{
    languageId: string;
    proficiencyLevel: string;
    isRequired: boolean;
  }>;
  requiredCertifications: Array<{
    certificationId: string;
    isRequired: boolean;
    minimumYears?: number; 
  }>;
  requiredEducation: Array<{
    educationLevel: string;
    fieldOfStudy: string;
    isRequired: boolean;
  }>;
  department: string;
}

// Custom Confirmation Modal Component
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Delete", 
  cancelText = "Cancel",
  isLoading = false 
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <Card className="border-primary/20 bg-background/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-center text-white">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-300 text-center">
              {message}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant="outline"
                className="bg-transparent border-[rgba(209,209,214,0.2)] text-white hover:bg-white/10"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : confirmText}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default function JobPostForm() {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [job, setJob] = useState<JobFormData>({
    title: "",
    description: "",
    requirements: "",
    employmentType: "full_time",
    experienceLevel: "senior",
    location: "",
    isRemote: false,
    salaryMin: "",
    salaryMax: "",
    applicationDeadline: "",
    requiredSkills: [],
    requiredLanguages: [{ languageId: "", proficiencyLevel: "fluent", isRequired: true }],
    requiredCertifications: [{ certificationId: "", isRequired: false, minimumYears: undefined }],
    requiredEducation: [{ educationLevel: "bachelor", fieldOfStudy: "", isRequired: true }],
    department: "",
  });

  useEffect(() => {
    if (jobId) {
      const fetchJob = async () => {
        try {
          const response = await companyServices.getJob(jobId);
          const jobData = response;
          
          setJob({
            title: jobData.title || "",
            description: jobData.description || "",
            requirements: jobData.requirements || "",
            employmentType: jobData.employmentType || "full_time",
            experienceLevel: jobData.experienceLevel || "senior",
            location: jobData.location || "",
            isRemote: jobData.isRemote || false,
            salaryMin: jobData.salaryMin ? jobData.salaryMin.toString() : "",
            salaryMax: jobData.salaryMax ? jobData.salaryMax.toString() : "",
            applicationDeadline: jobData.applicationDeadline ? jobData.applicationDeadline.split("T")[0] : "",
            requiredSkills: jobData.requiredSkills || [],
            requiredLanguages: jobData.requiredLanguages || [{ languageId: "", proficiencyLevel: "fluent", isRequired: true }],
            requiredCertifications: jobData.requiredCertifications?.map((cert) => ({
              certificationId: cert.certificationId,
              isRequired: cert.isRequired,
              minimumYears: cert.minimumYears,
            })) || [{ certificationId: "", isRequired: false, minimumYears: undefined }],
            requiredEducation: jobData.requiredEducation || [{ educationLevel: "bachelor", fieldOfStudy: "", isRequired: true }],
            department: jobData.department || "",
          });
        } catch (error) {
          console.error("Error fetching job:", error);
          toast.error(
            typeof error === "object" && error !== null && "message" in error
              ? (error as { message?: string }).message || "Failed to load job details"
              : "Failed to load job details"
          );
        }
      };
      fetchJob();
    }
  }, [jobId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setJob((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setJob((prev) => ({ ...prev, isRemote: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      location: job.location,
      isRemote: job.isRemote,
      salaryMin: job.salaryMin ? parseInt(job.salaryMin) : undefined,
      salaryMax: job.salaryMax ? parseInt(job.salaryMax) : undefined,
      applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline).toISOString() : undefined,
      requiredSkills: job.requiredSkills,
      requiredLanguages: job.requiredLanguages.filter((lang) => lang.languageId),
      requiredCertifications: job.requiredCertifications
        .filter((cert) => cert.certificationId)
        .map((cert) => ({
          certificationId: cert.certificationId,
          isRequired: cert.isRequired,
          minimumYears: cert.minimumYears, 
        })),
      requiredEducation: job.requiredEducation.filter((edu) => edu.fieldOfStudy),
      department: job.department,
    };

    try {
      if (jobId) {
        await companyServices.updateJob(jobId, payload);
        toast.success("Job updated successfully");
      } else {
        await companyServices.createJob(payload);
        toast.success("Job created successfully");
      }
      navigate("/company/dashboard/jobposts");
    } catch (error) {
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || `Failed to ${jobId ? "update" : "create"} job`
          : `Failed to ${jobId ? "update" : "create"} job`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobId) return;

    setIsLoading(true);
    try {
      await companyServices.deleteJob(jobId);
      toast.success("Job deleted successfully");
      setShowDeleteModal(false);
      navigate("/company/dashboard/jobposts");
    } catch (error) {
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || "Failed to delete job"
          : "Failed to delete job"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col dark:starry-background">
        <div className="container max-w-4xl mx-auto px-4 py-8 flex-1">
          <div className="flex items-center gap-2 mb-6">
            <img src={Logo} alt="StepIn Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">StepIn</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-primary/20 bg-background/80 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center text-white">
                  {jobId ? "Edit Job Posting" : "Create Job Posting"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white">Job Title</Label>
                    <Input
                      id="title"
                      value={job.title}
                      onChange={handleInputChange}
                      required
                      className="bg-black border-[rgba(209,209,214,0.2)] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Input
                      id="description"
                      value={job.description}
                      onChange={handleInputChange}
                      required
                      className="bg-black border-[rgba(209,209,214,0.2)] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-white">Requirements</Label>
                    <Input
                      id="requirements"
                      value={job.requirements}
                      onChange={handleInputChange}
                      required
                      className="bg-black border-[rgba(209,209,214,0.2)] text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentType" className="text-white">Employment Type</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("employmentType", value)}
                      value={job.employmentType}
                    >
                      <SelectTrigger className="bg-black border-[rgba(209,209,214,0.2)] text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white border-[rgba(209,209,214,0.2)]">
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel" className="text-white">Experience Level</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("experienceLevel", value)}
                      value={job.experienceLevel}
                    >
                      <SelectTrigger className="bg-black border-[rgba(209,209,214,0.2)] text-white">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white border-[rgba(209,209,214,0.2)]">
                        <SelectItem value="entry">Entry</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="executive">Executive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">Location</Label>
                    <Input
                      id="location"
                      value={job.location}
                      onChange={handleInputChange}
                      required
                      className="bg-black border-[rgba(209,209,214,0.2)] text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRemote"
                      checked={job.isRemote}
                      onCheckedChange={handleCheckboxChange}
                      className="border-[rgba(209,209,214,0.2)]"
                    />
                    <Label htmlFor="isRemote" className="text-white">Remote</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-white">Department</Label>
                    <Input
                      id="department"
                      value={job.department}
                      onChange={handleInputChange}
                      required
                      className="bg-black border-[rgba(209,209,214,0.2)] text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryMin" className="text-white">Min Salary</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={job.salaryMin}
                        onChange={handleInputChange}
                        className="bg-black border-[rgba(209,209,214,0.2)] text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salaryMax" className="text-white">Max Salary</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={job.salaryMax}
                        onChange={handleInputChange}
                        className="bg-black border-[rgba(209,209,214,0.2)] text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline" className="text-white">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={job.applicationDeadline}
                      onChange={handleInputChange}
                      className="bg-black border-[rgba(209,209,214,0.2)] text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      type="submit"
                      className="bg-[rgba(10,132,255,1)] hover:opacity-90 text-white font-bold"
                      disabled={isLoading}
                    >
                      {isLoading ? "Saving..." : jobId ? "Update Job" : "Create Job"}
                    </Button>
                    {jobId && (
                      <Button
                        type="button"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        onClick={handleDeleteClick}
                        disabled={isLoading}
                      >
                        Delete Job
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isLoading}
      />
    </>
  );
}