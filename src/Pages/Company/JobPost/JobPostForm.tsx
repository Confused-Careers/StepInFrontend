import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import companyServices from "@/services/companyServices";
import Logo from "../../../assets/StepIn Transparent Logo.png";

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  isRemote: boolean;
  unpaid: boolean;
  salaryMin: string;
  salaryMax: string;
  payPeriod: string;
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
  type: string; // 'public' | 'private'; // Cumpolsory field for job type
}

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
  isLoading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
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

const useAutoResize = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return { textareaRef, adjustHeight };
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
    responsibilities: "",
    employmentType: "full_time",
    experienceLevel: "senior",
    location: "",
    isRemote: false,
    unpaid: false,
    salaryMin: "",
    salaryMax: "",
    payPeriod: "/yr",
    applicationDeadline: "",
    requiredSkills: [],
    requiredLanguages: [{ languageId: "", proficiencyLevel: "fluent", isRequired: true }],
    requiredCertifications: [{ certificationId: "", isRequired: false, minimumYears: undefined }],
    requiredEducation: [{ educationLevel: "bachelor", fieldOfStudy: "", isRequired: true }],
    department: "",
    type: "", 
  });

  const titleResize = useAutoResize(job.title);
  const descriptionResize = useAutoResize(job.description);
  const requirementsResize = useAutoResize(job.requirements);
  const responsibilitiesResize = useAutoResize(job.responsibilities);
  const locationResize = useAutoResize(job.location);

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
            responsibilities: jobData.responsibilities || "",
            employmentType: jobData.employmentType || "full_time",
            experienceLevel: jobData.experienceLevel || "senior",
            location: jobData.location || "",
            isRemote: jobData.isRemote || false,
            unpaid: jobData.salaryMin === undefined && jobData.salaryMax === undefined,
            salaryMin: jobData.salaryMin ? jobData.salaryMin.toString() : "",
            salaryMax: jobData.salaryMax ? jobData.salaryMax.toString() : "",
            payPeriod: jobData.payPeriod || "annually",
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
            type: jobData.type, 
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setJob((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setJob((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, checked: boolean) => {
    if (field === "isRemote") {
      setJob((prev) => ({
        ...prev,
        isRemote: checked,
        location: checked ? "" : prev.location,
      }));
    } else if (field === "unpaid") {
      setJob((prev) => ({
        ...prev,
        unpaid: checked,
        salaryMin: checked ? "" : prev.salaryMin,
        salaryMax: checked ? "" : prev.salaryMax,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      employmentType: job.employmentType,
      experienceLevel: job.experienceLevel,
      location: job.location,
      isRemote: job.isRemote,
      unpaid: job.unpaid,
      salaryMin: job.unpaid ? undefined : (job.salaryMin ? parseInt(job.salaryMin) : undefined),
      salaryMax: job.unpaid ? undefined : (job.salaryMax ? parseInt(job.salaryMax) : undefined),
      payPeriod: job.unpaid ? undefined : job.payPeriod,
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
      type: job.type, // 'public' | 'private'
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
                    <textarea
                      ref={titleResize.textareaRef}
                      id="title"
                      value={job.title}
                      onChange={handleInputChange}
                      onInput={titleResize.adjustHeight}
                      required
                      className="bg-black border border-[rgba(209,209,214,0.2)] text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden"
                      rows={1}
                      style={{ height: 'auto', minHeight: '40px' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Job Description</Label>
                    <textarea
                      ref={descriptionResize.textareaRef}
                      id="description"
                      value={job.description}
                      onChange={handleInputChange}
                      onInput={descriptionResize.adjustHeight}
                      required
                      className="bg-black border border-[rgba(209,209,214,0.2)] text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden"
                      rows={1}
                      style={{ height: 'auto', minHeight: '40px' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requirements" className="text-white">Job Requirements</Label>
                    <textarea
                      ref={requirementsResize.textareaRef}
                      id="requirements"
                      value={job.requirements}
                      onChange={handleInputChange}
                      onInput={requirementsResize.adjustHeight}
                      required
                      className="bg-black border border-[rgba(209,209,214,0.2)] text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden"
                      rows={1}
                      style={{
                        height: 'auto',
                        minHeight: '40px',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="responsibilities" className="text-white">Job Responsibilities</Label>
                    <textarea
                      ref={responsibilitiesResize.textareaRef}
                      id="responsibilities"
                      value={job.responsibilities}
                      onChange={handleInputChange}
                      onInput={responsibilitiesResize.adjustHeight}
                      required
                      className="bg-black border border-[rgba(209,209,214,0.2)] text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden"
                      rows={1}
                      style={{
                        height: 'auto',
                        minHeight: '40px',
                        whiteSpace: 'pre wrap',
                        wordBreak: 'break-word'
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentType" className="text-white">Employment Type</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("employmentType", value)}
                      value={job.employmentType}
                    >
                      <SelectTrigger className="bg-black border border-[rgba(209,209,214,0.2)] text-white">
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
                    <Label htmlFor="jobPostingType" className="text-white">Job Posting Type</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("type", value)}
                      value={job.type}
                    >
                      <SelectTrigger className="bg-black border border-[rgba(209,209,214,0.2)] text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-black text-white border-[rgba(209,209,214,0.2)]">
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experienceLevel" className="text-white">Experience Level</Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("experienceLevel", value)}
                      value={job.experienceLevel}
                    >
                      <SelectTrigger className="bg-black border border-[rgba(209,209,214,0.2)] text-white">
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
                    <Label htmlFor="location" className="text-white">Location (City, State)</Label>
                    <textarea
                      ref={locationResize.textareaRef}
                      id="location"
                      value={job.location}
                      onChange={handleInputChange}
                      onInput={locationResize.adjustHeight}
                      required={!job.isRemote}
                      disabled={job.isRemote}
                      placeholder={job.isRemote ? "Not required for remote positions" : "Enter city and state"}
                      className={`bg-black border border-[rgba(209,209,214,0.2)] text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden ${
                        job.isRemote ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      rows={1}
                      style={{ height: 'auto', minHeight: '40px' }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isRemote"
                      checked={job.isRemote}
                      onCheckedChange={(checked) => handleCheckboxChange("isRemote", Boolean(checked))}
                      className="border border-[rgba(209,209,214,0.2)]"
                    />
                    <Label htmlFor="isRemote" className="text-white">Remote</Label>
                  </div>
                  <AnimatePresence>
                    {!job.unpaid && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        <div className="grid [grid-template-columns:41%_41%_16%] gap-4 w-full">
                          <div className="space-y-2">
                            <Label htmlFor="salaryMin" className="text-white">Min Salary</Label>
                            <Input
                              id="salaryMin"
                              type="number"
                              value={job.salaryMin}
                              onChange={handleInputChange}
                              className="bg-black border border-[rgba(209,209,214,0.2)] text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="salaryMax" className="text-white">Max Salary</Label>
                            <Input
                              id="salaryMax"
                              type="number"
                              value={job.salaryMax}
                              onChange={handleInputChange}
                              className="bg-black border border-[rgba(209,209,214,0.2)] text-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="payPeriod" className="text-white">Pay Period</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("payPeriod", value)}
                              value={job.payPeriod}
                            >
                              <SelectTrigger className="bg-black border border-[rgba(209,209,214,0.2)] text-white">
                                <SelectValue placeholder="Select pay period" />
                              </SelectTrigger>
                              <SelectContent className="bg-black text-white border-[rgba(209,209,214,0.2)]">
                                <SelectItem value="hr">/hr</SelectItem>
                                <SelectItem value="yr">/yr</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unpaid"
                      checked={job.unpaid}
                      onCheckedChange={(checked) => handleCheckboxChange("unpaid", Boolean(checked))}
                      className="border border-[rgba(209,209,214,0.2)]"
                    />
                    <Label htmlFor="unpaid" className="text-white">Unpaid Position</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="applicationDeadline" className="text-white">Application Deadline</Label>
                    <Input
                      id="applicationDeadline"
                      type="date"
                      value={job.applicationDeadline}
                      onChange={handleInputChange}
                      className="bg-black border border-[rgba(209,209,214,0.2)] text-white"
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