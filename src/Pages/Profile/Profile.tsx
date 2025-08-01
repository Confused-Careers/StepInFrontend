import { useState, useEffect } from 'react';
import {
  Plus,
  FileText,
  Edit,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  Trash2,
  Loader2,
  Upload,
  X,
  Mail,
  Code,
} from "lucide-react";
import { PageHeader } from "@/components/Layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jobSeekerServices from "@/services/jobSeekerServices";
import workExperienceServices from "@/services/workExperienceServices";
import educationServices from '@/services/educationServices';
import certificationServices from '@/services/certificationServices';
import projectServices from '@/services/projectServices';
import userServices from '@/services/userServices';
import { toast } from "sonner";
import { WorkExperienceForm } from "@/components/forms/WorkExperienceForm";
import { EducationForm } from '@/components/forms/EducationForm';
import { CertificationForm } from '@/components/forms/CertificationForm';
import { ProjectForm } from '@/components/forms/ProjectForm';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { JobSeekerProfile } from "@/Contexts/ProfileContext";
import { ResumeUploadModal } from '@/components/Modals/ResumeUploadModal';
import { ProfilePictureUploadModal } from '@/components/Modals/ProfilePictureUploadModal';
import { PersonalityInsights } from './Sections/PersonalityInsights';

interface ContactData {
  location: string;
  phone: string;
}

interface UploadResponse {
  message: string;
  fileUrl?: string;
  fileId?: string;
}

const getCurrentExperience = (experiences: any[]) => {
  if (!experiences || experiences.length === 0) return null;
  const sortedExperiences = [...experiences].sort((a, b) => {
    if (!a.endDate && !b.endDate) return 0;
    if (!a.endDate) return -1;
    if (!b.endDate) return 1;
    return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
  });
  return sortedExperiences.find(exp => !exp.endDate) || sortedExperiences[0];
};

const getCurrentPosition = (experiences: any[]) => {
  const currentExperience = getCurrentExperience(experiences);
  return currentExperience ? `${currentExperience.positionTitle} at ${currentExperience.companyName}` : null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [educations, setEducations] = useState<any[]>([]);
  const [loadingEducations, setLoadingEducations] = useState(true);
  const [isEducationFormOpen, setIsEducationFormOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<any>(null);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loadingCertifications, setLoadingCertifications] = useState(true);
  const [isCertificationFormOpen, setIsCertificationFormOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [aboutMeText, setAboutMeText] = useState('');
  const [contactData, setContactData] = useState<ContactData>({
    location: '',
    phone: '',
  });
  const [uploadType, setUploadType] = useState<'resume' | 'profilePicture' | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchExperiences();
    fetchEducations();
    fetchCertifications();
    fetchProjects();
    return () => {
      if (resumePreview && !profile?.resumeUrl) URL.revokeObjectURL(resumePreview);
      if (profilePicturePreview && !profile?.profilePictureUrl) URL.revokeObjectURL(profilePicturePreview);
    };
  }, []);

  useEffect(() => {
    if (profile) {
      if (profile.resumeUrl) setResumePreview(profile.resumeUrl);
      if (profile.profilePictureUrl) setProfilePicturePreview(profile.profilePictureUrl);
      setAboutMeText(profile.aboutMe || '');
      setContactData({
        location: profile.location || '',
        phone: profile.phone || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (experiences.length > 0) {
      updateProfileWithCurrentExperience();
    }
  }, [experiences]);

  const fetchProfile = async () => {
    try {
      const data = await jobSeekerServices.getProfile();
      setProfile(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      setLoadingExperiences(true);
      const data = await workExperienceServices.getAllWorkExperiences();
      const sortedExperiences = data.sort((a, b) => {
        if (a.isCurrent && !b.isCurrent) return -1;
        if (!a.isCurrent && b.isCurrent) return 1;
        if (a.isCurrent && b.isCurrent) {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
        const aEndDate = a.endDate ? new Date(a.endDate).getTime() : 0;
        const bEndDate = b.endDate ? new Date(b.endDate).getTime() : 0;
        return bEndDate - aEndDate;
      });
      setExperiences(sortedExperiences);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch work experiences");
    } finally {
      setLoadingExperiences(false);
    }
  };

  const fetchEducations = async () => {
    try {
      setLoadingEducations(true);
      const data = await educationServices.getAllEducation();
      const sortedEducations = data.sort((a, b) => {
        if (!a.endDate && b.endDate) return -1;
        if (a.endDate && !b.endDate) return 1;
        if (!a.endDate && !b.endDate) {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        }
        const aEndDate = a.endDate ? new Date(a.endDate).getTime() : 0;
        const bEndDate = b.endDate ? new Date(b.endDate).getTime() : 0;
        return bEndDate - aEndDate;
      });
      setEducations(sortedEducations);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch education records");
    } finally {
      setLoadingEducations(false);
    }
  };

  const fetchCertifications = async () => {
    try {
      setLoadingCertifications(true);
      const data = await certificationServices.getAllCertifications();
      const sortedCertifications = data.sort((a, b) => {
        const aIssueDate = a.issueDate ? new Date(a.issueDate).getTime() : 0;
        const bIssueDate = b.issueDate ? new Date(b.issueDate).getTime() : 0;
        return bIssueDate - aIssueDate;
      });
      setCertifications(sortedCertifications);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch certifications");
    } finally {
      setLoadingCertifications(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const data = await projectServices.getAllProjects();
      const sortedProjects = data.sort((a, b) => {
        const aYear = a.completionYear || 0;
        const bYear = b.completionYear || 0;
        return bYear - aYear;
      });
      setProjects(sortedProjects);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await workExperienceServices.deleteWorkExperience(id);
      toast.success("Work experience deleted successfully");
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete work experience");
    }
  };

  const handleExperienceSubmit = async (data: any) => {
    try {
      if (!profile?.id) {
        toast.error("Profile ID is required");
        return;
      }
      const experienceData = {
        ...data,
        jobSeekerId: profile.id,
        profileId: profile.id,
        displayOrder: experiences.length,
        workEnvironmentTags: data.workEnvironmentTags || [],
        achievements: data.achievements || [],
      };
      const response = await workExperienceServices.createWorkExperience(experienceData);
      setExperiences([...experiences, response]);
      setIsExperienceFormOpen(false);
      toast.success("Work experience added successfully");
    } catch (error: any) {
      console.error('Error creating experience:', error);
      toast.error(error.message || "Failed to add work experience");
    }
  };

  const handleUpdateExperience = async (data: any) => {
    try {
      if (!selectedExperience) return;
      await workExperienceServices.updateWorkExperience(selectedExperience.id, data);
      toast.success("Work experience updated successfully");
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message || "Failed to update work experience");
    }
  };

  const openCreateExperienceForm = () => {
    setSelectedExperience(null);
    setIsExperienceFormOpen(true);
  };

  const openEditExperienceForm = (experience: any) => {
    setSelectedExperience(experience);
    setIsExperienceFormOpen(true);
  };

  const closeExperienceForm = () => {
    setSelectedExperience(null);
    setIsExperienceFormOpen(false);
  };

  const handleDeleteEducation = async (id: string) => {
    try {
      await educationServices.deleteEducation(id);
      toast.success("Education record deleted successfully");
      fetchEducations();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete education record");
    }
  };

  const handleCreateEducation = async (data: any) => {
    try {
      const submitData = {
        ...data,
        displayOrder: educations.length,
      };
      await educationServices.createEducation(submitData);
      toast.success("Education record created successfully");
      fetchEducations();
      closeEducationForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create education record");
    }
  };

  const handleUpdateEducation = async (data: any) => {
    try {
      if (!selectedEducation) return;
      await educationServices.updateEducation(selectedEducation.id, data);
      toast.success("Education record updated successfully");
      fetchEducations();
    } catch (error: any) {
      toast.error(error.message || "Failed to update education record");
    }
  };

  const openCreateEducationForm = () => {
    setSelectedEducation(null);
    setIsEducationFormOpen(true);
  };

  const openEditEducationForm = (education: any) => {
    setSelectedEducation(education);
    setIsEducationFormOpen(true);
  };

  const closeEducationForm = () => {
    setSelectedEducation(null);
    setIsEducationFormOpen(false);
  };

  const handleDeleteCertification = async (id: string) => {
    try {
      await certificationServices.deleteCertification(id);
      toast.success("Certification deleted successfully");
      fetchCertifications();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete certification");
    }
  };

  const handleCreateCertification = async (data: any) => {
    try {
      const submitData = {
        ...data,
        displayOrder: certifications.length,
      };
      await certificationServices.createCertification(submitData);
      toast.success("Certification created successfully");
      fetchCertifications();
      closeCertificationForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create certification");
    }
  };

  const handleUpdateCertification = async (data: any) => {
    try {
      if (!selectedCertification) return;
      await certificationServices.updateCertification(selectedCertification.id, data);
      toast.success("Certification updated successfully");
      fetchCertifications();
    } catch (error: any) {
      toast.error(error.message || "Failed to update certification");
    }
  };

  const openCreateCertificationForm = () => {
    setSelectedCertification(null);
    setIsCertificationFormOpen(true);
  };

  const openEditCertificationForm = (certification: any) => {
    setSelectedCertification(certification);
    setIsCertificationFormOpen(true);
  };

  const closeCertificationForm = () => {
    setSelectedCertification(null);
    setIsCertificationFormOpen(false);
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await projectServices.deleteProject(id);
      toast.success("Project deleted successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete project");
    }
  };

  const handleCreateProject = async (data: any) => {
    try {
      const submitData = {
        ...data,
        displayOrder: projects.length,
      };
      await projectServices.createProject(submitData);
      toast.success("Project created successfully");
      fetchProjects();
      closeProjectForm();
    } catch (error: any) {
      toast.error(error.message || "Failed to create project");
    }
  };

  const handleUpdateProject = async (data: any) => {
    try {
      if (!selectedProject) return;
      await projectServices.updateProject(selectedProject.id, data);
      toast.success("Project updated successfully");
      fetchProjects();
    } catch (error: any) {
      toast.error(error.message || "Failed to update project");
    }
  };

  const openCreateProjectForm = () => {
    setSelectedProject(null);
    setIsProjectFormOpen(true);
  };

  const openEditProjectForm = (project: any) => {
    setSelectedProject(project);
    setIsProjectFormOpen(true);
  };

  const closeProjectForm = () => {
    setSelectedProject(null);
    setIsProjectFormOpen(false);
  };

  const handleSaveAboutMe = async () => {
    try {
      const updatedProfile = await jobSeekerServices.updateProfile({
        aboutMe: aboutMeText,
      });
      setProfile(updatedProfile);
      setIsEditingAbout(false);
      toast.success("About me updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update about me");
    }
  };

  const handleSaveContact = async () => {
    try {
      const phoneRegex = /^\+?[\d\s-]{8,}$/;
      if (contactData.phone && !phoneRegex.test(contactData.phone)) {
        toast.error("Please enter a valid phone number");
        return;
      }
      const updatedProfile = await jobSeekerServices.updateProfile({
        location: contactData.location || undefined,
        phone: contactData.phone || undefined,
      });
      setProfile(updatedProfile);
      setIsEditingContact(false);
      toast.success("Contact information updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update contact information");
    }
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const updateProfileWithCurrentExperience = async () => {
    try {
      const currentExperience = getCurrentExperience(experiences);
      if (currentExperience) {
        const updatedProfile = await jobSeekerServices.updateProfile({
          currentPosition: currentExperience.positionTitle,
          currentCompany: currentExperience.companyName,
          location: currentExperience.location,
        });
        setProfile(updatedProfile);
      }
    } catch (error: any) {
      console.error('Failed to update profile with current experience:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
        return;
      }
      if (uploadType === 'resume') {
        setResumeFile(file);
        setResumePreview(URL.createObjectURL(file));
        handleUploadResume(file);
      } else if (uploadType === 'profilePicture') {
        setProfilePictureFile(file);
        setProfilePicturePreview(URL.createObjectURL(file));
        handleUploadProfilePicture(file);
      }
    }
  };

  const handleUploadResume = async (file: File) => {
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit.');
      }
      const response: UploadResponse = await userServices.uploadResume({ file });
      setProfile((prev: any) => (prev ? { ...prev, resumeUrl: response.fileUrl } : prev));
      setResumePreview(response.fileUrl || URL.createObjectURL(file));
      toast.success(response.message || 'Resume uploaded successfully');
      setResumeFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload resume");
    }
  };

  const handleUploadProfilePicture = async (file: File) => {
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size exceeds 5MB limit.');
      }
      const response: UploadResponse = await userServices.uploadProfilePicture({ file });
      setProfile((prev: any) => (prev ? { ...prev, profilePictureUrl: response.fileUrl } : prev));
      setProfilePicturePreview(response.fileUrl || URL.createObjectURL(file));
      toast.success(response.message || 'Profile picture uploaded successfully');
      setProfilePictureFile(null);
    } catch (error: any) {
      toast.error(error.message || "Failed to upload profile picture");
    }
  };

  const removeResumePreview = () => {
    setResumeFile(null);
    setResumePreview(null);
    setProfile((prev: any) => prev ? ({ ...prev, resumeUrl: undefined }) : prev);
  };

  const removeProfilePicturePreview = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview(null);
    setProfile((prev: any) => prev ? ({ ...prev, profilePictureUrl: undefined }) : prev);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Profile not found</div>;
  }

  return (
    <div>
      <PageHeader
        title="Profile"
        description="View and manage your professional profile"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
            <CardContent className="pt-0 relative">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-background -mt-12 mb-4" onClick={() => setIsProfilePictureModalOpen(true)} style={{ cursor: 'pointer' }}>
                  <AvatarImage src={profilePicturePreview || profile.profilePictureUrl || "/placeholder.svg?height=96&width=96"} alt={`${profile.firstName} ${profile.lastName}`} />
                  <AvatarFallback>{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
                <p className="text-muted-foreground">
                  {getCurrentPosition(experiences) || profile.currentPosition || "Add current position"}
                </p>
                {profile.location && (
                  <div className="flex items-center mt-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  {profile.resumeUrl && (
                    <Button variant="outline" size="sm" onClick={() => profile.resumeUrl && window.open(profile.resumeUrl, '_blank')}>
                      <FileText className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Upload Files</h3>
                <div className="space-y-4">
                  <Select onValueChange={(value: 'resume' | 'profilePicture') => setUploadType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select file type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resume">Resume</SelectItem>
                      <SelectItem value="profilePicture">Profile Picture</SelectItem>
                    </SelectContent>
                  </Select>
                  {uploadType && (
                    <div
                      className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4 transition-all hover:border-blue-400/50 group cursor-pointer"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <div className="flex items-center justify-center gap-3 py-8 text-slate-400 group-hover:text-blue-400 transition-colors">
                        <Upload className="w-6 h-6" />
                        <div className="text-center">
                          <p className="font-medium">Select {uploadType === 'resume' ? 'Resume' : 'Profile Picture'}</p>
                          <p className="text-sm">
                            {uploadType === 'resume' ? 'PDF, DOC, DOCX, TXT' : 'JPG, JPEG, PNG, GIF, WEBP'} (Max 5MB)
                          </p>
                        </div>
                      </div>
                      <Input
                        id="file-upload"
                        type="file"
                        accept={uploadType === 'resume' ? '.pdf,.doc,.docx,.txt' : 'image/jpeg,image/png,image/gif,image/webp'}
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </div>
                  )}
                  {resumePreview && (
                    <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4 transition-all hover:border-blue-400/50 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600/50 flex-shrink-0">
                          <FileText className="w-full h-full p-2 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">Current Resume</p>
                          <p className="text-slate-400 text-sm">
                            <a href={profile.resumeUrl || resumePreview} target="_blank" rel="noopener noreferrer">Click to view</a>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeResumePreview();
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  {profilePicturePreview && (
                    <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4 transition-all hover:border-blue-400/50 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <a href={profile.profilePictureUrl || profilePicturePreview} target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600/50 flex-shrink-0 block">
                          <img src={profilePicturePreview} alt="Profile Picture Preview" className="w-full h-full object-cover" />
                        </a>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">Current Profile Picture</p>
                          <p className="text-slate-400 text-sm">
                            <a href={profile.profilePictureUrl || profilePicturePreview} target="_blank" rel="noopener noreferrer">Click to view</a>
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title="Remove Preview"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeProfilePicturePreview();
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Contact Information</h3>
                  {!isEditingContact ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => setIsEditingContact(true)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setIsEditingContact(false);
                          setContactData({
                            location: profile.location || '',
                            phone: profile.phone || '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveContact}
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
                {isEditingContact ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Enter your location"
                        value={contactData.location}
                        onChange={handleContactInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={contactData.phone}
                        onChange={handleContactInputChange}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.email || "Add Email"}</span>
                    </div>
                    {/* <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.phone || "Add phone number"}</span>
                    </div> */}
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{profile.location || "Add location"}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>About Me</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setIsEditingAbout(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditingAbout ? (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Tell us about yourself..."
                    value={aboutMeText}
                    onChange={(e) => setAboutMeText(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingAbout(false);
                        setAboutMeText(profile.aboutMe || '');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveAboutMe}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">
                  {profile.aboutMe || "Add a description about yourself..."}
                </p>
              )}
            </CardContent>
          </Card>
          
          {/* AI-Generated Insights */}
          {profile && (
            <PersonalityInsights
              personalityTraits={profile.personalityTraits || []}
              workPreferences={profile.workPreferences || []}
              idealEnvironment={profile.idealEnvironment || ""}
            />
          )}
          
          <Tabs defaultValue="experience" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="experience" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Work Experience</h3>
                <Button variant="outline" size="sm" onClick={openCreateExperienceForm}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Experience
                </Button>
              </div>
              {loadingExperiences ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : experiences.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-muted-foreground">
                      <p>No work experience added yet.</p>
                      <p className="text-sm mt-1">Add your work history to showcase your professional journey.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                experiences.map((experience) => (
                  <Card key={experience.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-muted rounded-full p-2 mt-0.5">
                          <Briefcase className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{experience.positionTitle}</h3>
                              <p className="text-muted-foreground">{experience.companyName}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-start sm:self-center"
                                onClick={() => openEditExperienceForm(experience)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-start sm:self-center text-destructive hover:text-destructive"
                                onClick={() => handleDeleteExperience(experience.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                            {experience.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{experience.location}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(experience.startDate).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                                {experience.isCurrent 
                                  ? " - Present"
                                  : experience.endDate 
                                    ? ` - ${new Date(experience.endDate).toLocaleDateString('en-US', { 
                                        month: 'long', 
                                        year: 'numeric' 
                                      })}`
                                    : ""
                                }
                              </span>
                            </div>
                          </div>
                          {experience.description && (
                            <p className="mt-3">{experience.description}</p>
                          )}
                          {experience.achievements && experience.achievements.length > 0 && (
                            <div className="mt-4">
                              <p className="font-medium text-sm mb-2">Key Achievements:</p>
                              <ul className="list-disc list-inside space-y-2">
                                {experience.achievements.map((achievement: any, i: number) => (
                                  <li key={i} className="text-sm">
                                    <span className="font-medium">{achievement.achievementText}</span>
                                    {achievement.impactDescription && (
                                      <span className="text-muted-foreground"> - {achievement.impactDescription}</span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {experience.workEnvironmentTags && experience.workEnvironmentTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {experience.workEnvironmentTags.map((tag: string, i: number) => (
                                <Badge key={i} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <WorkExperienceForm 
                isOpen={isExperienceFormOpen}
                onClose={closeExperienceForm}
                onSubmit={selectedExperience ? handleUpdateExperience : handleExperienceSubmit}
                initialData={selectedExperience}
              />
            </TabsContent>
            <TabsContent value="education" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Education</h3>
                <Button variant="outline" size="sm" onClick={openCreateEducationForm}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Education
                </Button>
              </div>
              {loadingEducations ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : educations.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-muted-foreground">
                      <p>No education records added yet.</p>
                      <p className="text-sm mt-1">Add your educational background to showcase your qualifications.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                educations.map((education) => (
                  <Card key={education.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-muted rounded-full p-2 mt-0.5">
                          <GraduationCap className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{education.degree}</h3>
                              <p className="text-base text-muted-foreground">{education.institution}</p>
                              {education.fieldOfStudy && (
                                <p className="text-base">{education.fieldOfStudy}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-start"
                                onClick={() => openEditEducationForm(education)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-start text-destructive hover:text-destructive"
                                onClick={() => handleDeleteEducation(education.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            {education.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{education.location}</span>
                              </div>
                            )}
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(education.startDate).toLocaleDateString('en-US', { 
                                  month: 'long', 
                                  year: 'numeric' 
                                })}
                                {education.isCurrentlyStudying 
                                  ? " - Present"
                                  : education.endDate 
                                    ? ` - ${new Date(education.endDate).toLocaleDateString('en-US', { 
                                        month: 'long', 
                                        year: 'numeric' 
                                      })}`
                                    : ""
                                }
                              </span>
                            </div>
                            {education.grade && (
                              <div className="flex items-center">
                                <span>Grade: {education.grade}</span>
                              </div>
                            )}
                          </div>
                          {education.description && (
                            <p className="mt-4 text-sm">{education.description}</p>
                          )}
                          {education.coursework && education.coursework.length > 0 && (
                            <div className="mt-4">
                              <p className="font-medium text-sm mb-2">Relevant Coursework:</p>
                              <div className="flex flex-wrap gap-2">
                                {education.coursework.map((course: string, i: number) => (
                                  <Badge key={i} variant="secondary">
                                    {course}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {education.achievements && education.achievements.length > 0 && (
                            <div className="mt-4">
                              <p className="font-medium text-sm mb-2">Academic Achievements:</p>
                              <ul className="list-disc list-inside space-y-2">
                                {education.achievements.map((achievement: string, i: number) => (
                                  <li key={i} className="text-sm">
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <EducationForm 
                isOpen={isEducationFormOpen}
                onClose={closeEducationForm}
                onSubmit={selectedEducation ? handleUpdateEducation : handleCreateEducation}
                initialData={selectedEducation}
              />
            </TabsContent>
            <TabsContent value="certifications" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Certifications</h3>
                <Button variant="outline" size="sm" onClick={openCreateCertificationForm}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Certification
                </Button>
              </div>
              {loadingCertifications ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : certifications.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-muted-foreground">
                      <p>No certifications added yet.</p>
                      <p className="text-sm mt-1">Add your certifications to highlight your skills and qualifications.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                certifications.map((certification) => (
                  <Card key={certification.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-muted rounded-full p-2 mt-0.5">
                          <Award className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{certification.certificationName}</h3>
                              <p className="text-base text-muted-foreground">{certification.issuingOrganization}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-start"
                                onClick={() => openEditCertificationForm(certification)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-start text-destructive hover:text-destructive"
                                onClick={() => handleDeleteCertification(certification.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            {certification.issueDate && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  Issued: {new Date(certification.issueDate).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </span>
                              </div>
                            )}
                            {certification.expiryDate && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>
                                  Expires: {new Date(certification.expiryDate).toLocaleDateString('en-US', { 
                                    month: 'long', 
                                    year: 'numeric' 
                                  })}
                                </span>
                              </div>
                            )}
                            {certification.credentialId && (
                              <div className="flex items-center">
                                <span>Credential ID: {certification.credentialId}</span>
                              </div>
                            )}
                          </div>
                          {certification.credentialUrl && (
                            <p className="mt-4 text-sm">
                              <a href={certification.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View Credential
                              </a>
                            </p>
                          )}
                          {certification.description && (
                            <p className="mt-4 text-sm">{certification.description}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <CertificationForm 
                isOpen={isCertificationFormOpen}
                onClose={closeCertificationForm}
                onSubmit={selectedCertification ? handleUpdateCertification : handleCreateCertification}
                initialData={selectedCertification}
              />
            </TabsContent>
            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Projects</h3>
                <Button variant="outline" size="sm" onClick={openCreateProjectForm}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Project
                </Button>
              </div>
              {loadingProjects ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : projects.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center text-muted-foreground">
                      <p>No projects added yet.</p>
                      <p className="text-sm mt-1">Add your projects to showcase your practical experience.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                projects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-muted rounded-full p-2 mt-0.5">
                          <Code className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{project.projectName}</h3>
                              {project.role && (
                                <p className="text-base text-muted-foreground">{project.role}</p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-start"
                                onClick={() => openEditProjectForm(project)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="self-start text-destructive hover:text-destructive"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
                            {project.completionYear && (
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>Completed: {project.completionYear}</span>
                              </div>
                            )}
                          </div>
                          {project.description && (
                            <p className="mt-4 text-sm">{project.description}</p>
                          )}
                          {project.impactDescription && (
                            <div className="mt-4">
                              <p className="font-medium text-sm mb-2">Impact:</p>
                              <p className="text-sm">{project.impactDescription}</p>
                            </div>
                          )}
                          {project.projectUrl && (
                            <p className="mt-4 text-sm">
                              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View Project
                              </a>
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
              <ProjectForm 
                isOpen={isProjectFormOpen}
                onClose={closeProjectForm}
                onSubmit={selectedProject ? handleUpdateProject : handleCreateProject}
                initialData={selectedProject}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ResumeUploadModal
        isOpen={resumeFile !== null}
        onClose={() => {
          setResumeFile(null);
          if (resumePreview && !profile?.resumeUrl) {
            URL.revokeObjectURL(resumePreview);
          }
          setResumePreview(profile?.resumeUrl || null);
        }}
        onUpload={() => resumeFile ? handleUploadResume(resumeFile) : Promise.resolve()}
        filePreview={resumePreview}
        setFilePreview={setResumePreview}
        selectedFile={resumeFile}
        setSelectedFile={setResumeFile}
      />
      <ProfilePictureUploadModal
        isOpen={isProfilePictureModalOpen}
        onClose={() => {
          setIsProfilePictureModalOpen(false);
          setProfilePictureFile(null);
          if (profilePicturePreview && !profile?.profilePictureUrl) {
            URL.revokeObjectURL(profilePicturePreview);
          }
          setProfilePicturePreview(profile?.profilePictureUrl || null);
        }}
        onUpload={() => profilePictureFile ? handleUploadProfilePicture(profilePictureFile) : Promise.resolve()}
        filePreview={profilePicturePreview}
        setFilePreview={setProfilePicturePreview}
        selectedFile={profilePictureFile}
        setSelectedFile={setProfilePictureFile}
      />
    </div>
  );
}