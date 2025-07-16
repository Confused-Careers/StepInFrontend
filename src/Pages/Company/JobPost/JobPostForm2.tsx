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
  personalityTraits: string[];
  type?: string; // Added type for job posting
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
                className="bg-transparent border-white text-white hover:bg-white/10"
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
    payPeriod: "annually",
    applicationDeadline: "",
    requiredSkills: [],
    requiredLanguages: [{ languageId: "", proficiencyLevel: "fluent", isRequired: true }],
    requiredCertifications: [{ certificationId: "", isRequired: false, minimumYears: undefined }],
    requiredEducation: [{ educationLevel: "bachelor", fieldOfStudy: "", isRequired: true }],
    department: "",
    personalityTraits: [],
    type: "public", // Default job posting type
    
  });
  const [step, setStep] = useState(1);

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
            personalityTraits: jobData.personalityTraits || [],
            type: jobData.type || "public", // Ensure type is set
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

  // const handleTraitChange = (trait: string) => {
  //   setJob((prev) => {
  //     const traits = prev.personalityTraits.includes(trait)
  //       ? prev.personalityTraits.filter((t) => t !== trait)
  //       : [...prev.personalityTraits, trait].slice(0, 4);
  //     return { ...prev, personalityTraits: traits };
  //   });
  // };

  // const handleCustomTraitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   setJob((prev) => {
  //     const traits = prev.personalityTraits.filter((t) => !t.startsWith("custom:"));
  //     if (value && !traits.includes(value)) {
  //       return { ...prev, personalityTraits: [...traits, `custom:${value}`].slice(0, 4) };
  //     }
  //     return { ...prev, personalityTraits: traits.slice(0, 4) };
  //   });
  // };

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
      personalityTraits: job.personalityTraits,
      type: job.type, // Include job posting type
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

  // const nextStep = () => setStep(2);
  // const prevStep = () => setStep(1);

  return (
    <>
      <div className="min-h-screen flex flex-col dark:starry-background">
        <div className="container max-w-7xl mx-auto px-4 py-2 flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-background/80 border-[0px] justify-center items-center">
              <CardHeader>
                {step===1 && (
                  <CardTitle className="text-[36px] font-bold text-center text-white">
                    Tell us <span className="text-textPrimary">about the role</span> – we’ll handle the matching
                    <div className="w-screen px-[100px] relative left-0">
                      <div className="w-full border-b border-[#0A84FF]/40 mt-12 mb-4" />
                    </div>
                  </CardTitle>
                )}
                {step===2 && (
                  <CardTitle className="text-[36px] font-bold text-center text-white">
                    Pick up to <span className="text-textPrimary">4 personality traits</span> that matter most
                    <div className="w-screen px-[100px] relative left-0">
                      <div className="w-full border-b border-[#0A84FF]/40 mt-12 mb-4" />
                    </div>
                  </CardTitle>
                )}
              </CardHeader>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <CardContent className="w-full max-w-3xl">
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* 
                      <div className="text-left text-textPrimary mb-8 text-[20px]">
                        Step 1 of 2: Define the Role
                      </div>
                      */}
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="title" className="text-white text-[20px] font-[400]">Job Title</Label>
                          <textarea
                            ref={titleResize.textareaRef}
                            id="title"
                            value={job.title}
                            onChange={handleInputChange}
                            onInput={titleResize.adjustHeight}
                            required
                            className="bg-black border border-white text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden"
                            rows={1}
                            style={{ height: 'auto', minHeight: '40px' }}
                          />
                        </div>
                        <div className="flex flex-row gap-48 w-full justify-between">
                          <div className="w-full">
                            <Label htmlFor="employmentType" className="text-white text-[20px] font-[400]">Job Type</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("employmentType", value)}
                              value={job.employmentType}
                            >
                              <SelectTrigger className="bg-black border border-white text-white w-full">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent className="bg-black text-white border-white">
                                <SelectItem value="full_time">Full Time</SelectItem>
                                <SelectItem value="part_time">Part Time</SelectItem>
                                <SelectItem value="contract">Contract</SelectItem>
                                <SelectItem value="internship">Internship</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-full">
                            <Label htmlFor="experienceLevel" className="text-white text-[20px] font-[400]">Seniority</Label>
                            <Select
                              onValueChange={(value) => handleSelectChange("experienceLevel", value)}
                              value={job.experienceLevel}
                            >
                              <SelectTrigger className="bg-black border border-white text-white w-full">
                                <SelectValue placeholder="Select level" />
                              </SelectTrigger>
                              <SelectContent className="bg-black text-white border-white">
                                <SelectItem value="entry">Entry</SelectItem>
                                <SelectItem value="mid">Mid</SelectItem>
                                <SelectItem value="senior">Senior</SelectItem>
                                <SelectItem value="lead">Lead</SelectItem>
                                <SelectItem value="executive">Executive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-white text-[20px] font-[400]">Location (City, State)</Label>
                          <textarea
                            ref={locationResize.textareaRef}
                            id="location"
                            value={job.location}
                            onChange={handleInputChange}
                            onInput={locationResize.adjustHeight}
                            required={!job.isRemote}
                            disabled={job.isRemote}
                            placeholder={job.isRemote ? "Not required for remote positions" : "Enter city and state"}
                            className={`bg-black border border-white text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden ${
                              job.isRemote ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            rows={1}
                            style={{ height: 'auto', minHeight: '40px' }}
                          />
                        </div>
                        <div className="flex items-center space-x-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              className="border border-white"
                            />
                            <Label htmlFor="isRemote" className="text-white">On-Site</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              className="border border-white"
                            />
                            <Label htmlFor="isRemote" className="text-white">Hybrid</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="isRemote"
                              checked={job.isRemote}
                              onCheckedChange={(checked) => handleCheckboxChange("isRemote", Boolean(checked))}
                              className="border border-white"
                            />
                            <Label htmlFor="isRemote" className="text-white">Fully Remote</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="jobPostingType" className="text-white text-[20px] font-[400]">Job Posting Type</Label>
                          <Select
                            onValueChange={(value) => handleSelectChange("type", value)}
                            value={job.type}
                          >
                            <SelectTrigger className="bg-black border border-white text-white">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-black border border-white text-white">
                              <SelectItem value="public">Public</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                          </Select>
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
                              <div className="grid [grid-template-columns:35%_4%_35%_26%] gap-4 w-full">
                                <div className="space-y-2">
                                  <Label htmlFor="salaryMin" className="text-white text-[20px] font-[400]">Pay Range</Label>
                                  <Input
                                    id="salaryMin"
                                    type="number"
                                    value={job.salaryMin}
                                    onChange={handleInputChange}
                                    className="bg-black border border-white text-white"
                                  />
                                </div> 
                                <div className="flex items-center justify-center text-white text-[20px] font-[400]">
                                  <div className="border-b-2 w-full text-white border-white justify-center items-center mt-9"/>
                                </div>
                                <div className="space-y-2 ">
                                  <Label htmlFor="salaryMax" className="text-white text-[20px] font-[400]"> </Label>
                                  <Input
                                    id="salaryMax"
                                    type="number"
                                    value={job.salaryMax}
                                    onChange={handleInputChange}
                                    className="bg-black border border-white text-white"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="payPeriod" className="text-white text-[20px] font-[400]">Pay Period</Label>
                                  <Select
                                    onValueChange={(value) => handleSelectChange("payPeriod", value)}
                                    value={job.payPeriod}
                                  >
                                    <SelectTrigger className="bg-black border border-white text-white w-[74%]">
                                      <SelectValue placeholder="Select pay period" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-black text-white text-[20px] font-[400] border-white">
                                      <SelectItem value="hr">/hr</SelectItem>
                                      <SelectItem value="yr">/yr</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <div className="flex items-center space-x-2 gap-4">
                          <div className="flex items-center space-x-1">
                            <Checkbox
                              id="unpaid"
                              checked={job.unpaid}
                              onCheckedChange={(checked) => handleCheckboxChange("unpaid", Boolean(checked))}
                              className="border border-white"
                            />
                            <Label htmlFor="unpaid" className="text-white font-[400]">This is not paid position</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Checkbox
                              className="border border-white"
                            />
                            <Label htmlFor="unpaid" className="text-white font-[400]">Range</Label>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description" className="text-white text-[20px] font-[400]">Job Description</Label>
                          <textarea
                            ref={descriptionResize.textareaRef}
                            id="description"
                            value={job.description}
                            onChange={handleInputChange}
                            onInput={descriptionResize.adjustHeight}
                            required
                            className="bg-black border border-white text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden"
                            rows={1}
                            style={{ height: 'auto', minHeight: '40px' }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="responsibilities" className="text-white text-[20px] font-[400]"> Responsibilities</Label>
                          <textarea
                            ref={responsibilitiesResize.textareaRef}
                            id="responsibilities"
                            value={job.responsibilities}
                            onChange={handleInputChange}
                            onInput={responsibilitiesResize.adjustHeight}
                            required
                            className="bg-black border border-white text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden"
                            rows={1}
                            style={{
                              height: 'auto',
                              minHeight: '80px',
                              whiteSpace: 'pre wrap',
                              wordBreak: 'break-word'
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="requirements" className="text-white text-[20px] font-[400]">Prefered Qualifications</Label>
                          <textarea
                            ref={requirementsResize.textareaRef}
                            id="requirements"
                            value={job.requirements}
                            onChange={handleInputChange}
                            onInput={requirementsResize.adjustHeight}
                            required
                            className="bg-black border border-white text-white w-full px-3 py-2 rounded-md resize-none overflow-hidden"
                            rows={1}
                            style={{
                              height: 'auto',
                              minHeight: '80px',
                              whiteSpace: 'pre-wrap',
                              wordBreak: 'break-word'
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="applicationDeadline" className="text-white text-[20px] font-[400]">Application Deadline</Label>
                          <Input
                            id="applicationDeadline"
                            type="date"
                            value={job.applicationDeadline}
                            onChange={handleInputChange}
                            className="bg-black border border-white text-white"
                          />
                        </div>
                        <div className="flex flex-row items-center justify-center mb-12 gap-4 h-[60px]">
                          <Button
                            type="submit"
                            className="bg-[rgba(10,132,255,1)] h-[50px] rounded-xl hover:opacity-90 text-white text-[20px] font-[500] w-[200px]"
                            disabled={isLoading}
                          >
                            {isLoading ? "Saving..." : jobId ? "Update Job" : "Create Job"}
                          </Button>
                          {jobId && (
                            <Button
                              type="button"
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600 h-[50px] rounded-xl text-white text-[20px] font-[500] w-[200px]"
                              onClick={handleDeleteClick}
                              disabled={isLoading}
                            >
                              Delete Job
                            </Button>
                          )}
                        </div>
                      </form>
                    </motion.div>
                  </CardContent>
                )}
                {/* {step === 2 && (
                  <CardContent className="w-full max-w-7xl">
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="text-center text-textPrimary mb-14 text-[20px] max-w-[50%] items-center">
                        Step 2 of 2: Define the Person
                      </div>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-wrap gap-5 justify-center mb-12">
                          {[
                            {
                              label: "Analytical",
                              desc: "Solves problems with logic and data",
                            },
                            {
                              label: "Empathetic",
                              desc: "Reads people and builds strong team trust",
                            },
                            {
                              label: "Fast-paced",
                              desc: "Moves quickly, handles pressure well",
                            },
                            {
                              label: "Detail-oriented",
                              desc: "Catches mistakes others miss",
                            },
                            {
                              label: "Self-driven",
                              desc: "Works independently without micromanagement",
                            },
                            {
                              label: "Collaborative",
                              desc: "Thrives in team environments",
                            },
                          ].map((trait) => {
                            const isSelected = job.personalityTraits.includes(trait.label);
                            return (
                              <Button
                                key={trait.label}
                                type="button"
                                className={`flex flex-col gap-0 rounded-[10px] h-[48px] shadow-[#3B82F6]/50 text-white/50 border border-white/40 bg-white/10
                                  ${isSelected ? "border-[#0A84FF]/40 bg-[#0A84FF]/10 shadow-[#0A84FF]/50 text-[#0A84FF]" : ""}
                                `}
                                onClick={() => handleTraitChange(trait.label)}
                              >
                                <span className={`text-[20px]`}>{trait.label}</span>
                                {trait.desc}
                              </Button>
                            );
                          })}
                          <Button
                            type="button"
                            className="bg-black border border-white/40 bg-white/10 rounded-[10px] shadow-[#3B82F6]/50 h-[48px] text-white/50 text-[20px] italic"
                            onClick={() => {
                              const customTrait = prompt("Enter custom personality trait:");
                              if (customTrait) handleTraitChange(`custom:${customTrait}`);
                            }}
                          >
                            + Add Your Own
                          </Button>
                        </div>
                        <div className="flex flex-row items-center justify-center w-full mb-12">
                          <div className="max-w-4xl items-center w-full">
                            <Input
                              id="customTraits"
                              value={job.personalityTraits.filter((t) => t.startsWith("custom:")).map((t) => t.replace("custom:", ""))?.[0] || ""}
                              onChange={handleCustomTraitChange}
                              placeholder="Type personality traits like “High Ambition” or “Loves to Learn”"
                              className="w-full bg-black border border-[#D1D1D6] text-[#D1D1D6] rounded-[20px] h-[50px] mb-7 px-6 "
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button
                            type="submit"
                            className="bg-[rgba(10,132,255,1)] hover:opacity-90 text-white font-bold"
                            disabled={isLoading}
                          >
                            {isLoading ? "Saving..." : jobId ? "Update Job" : "Post Job"}
                          </Button>
                          <Button
                            type="button"
                            className="bg-[rgba(10,132,255,1)] hover:opacity-90 text-white font-bold"
                            onClick={prevStep}
                          >
                            Back
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
                    </motion.div>
                  </CardContent>
                )} */}
              </AnimatePresence>
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