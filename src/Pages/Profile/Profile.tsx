import { useState, useEffect } from 'react';
import {
  Globe,
  ExternalLink,
  Plus,
  FileText,
  Edit,
  MapPin,
  Eye,
  Link2,
  Linkedin,
  Github,
  Twitter,
  Briefcase,
  GraduationCap,
  Award,
  Calendar,
  CheckCircle,
  X,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react"
import { PageHeader } from "@/components/Layout/PageHeader"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SkillsCard } from "@/components/Others/SkillsCard"
import { LanguagesCard } from "@/components/Others/LanguagesCard"
import { SocialsCard } from "@/components/Others/SocialCard"
import jobSeekerServices from '@/services/jobSeekerServices';
import { toast } from 'sonner';
import workExperienceServices from '@/services/workExperienceServices';
import educationServices from '@/services/educationServices';
import userServices from '@/services/userServices';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfilePictureUploadModal } from '@/components/Modals/ProfilePictureUploadModal';
import { ResumeUploadModal } from '@/components/Modals/ResumeUploadModal';
import { EducationForm } from '@/components/forms/EducationForm';
import { WorkExperienceForm } from '@/components/forms/WorkExperienceForm';
import { Input } from '@/components/ui/input';

interface UploadResponse {
  message: string;
  fileUrl?: string;
  fileId?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loadingExperiences, setLoadingExperiences] = useState(true);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);
  const [educations, setEducations] = useState<any[]>([]);
  const [loadingEducations, setLoadingEducations] = useState(true);
  const [isEducationFormOpen, setIsEducationFormOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<any>(null);
  const [uploadType, setUploadType] = useState<'resume' | 'profilePicture' | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isProfilePictureModalOpen, setIsProfilePictureModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchExperiences();
    fetchEducations();
    return () => {
      if (resumePreview) URL.revokeObjectURL(resumePreview);
      if (profilePicturePreview) URL.revokeObjectURL(profilePicturePreview);
    };
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await jobSeekerServices.getProfile();
      console.log('Profile data:', data);
      setProfile(data);
      if (data.resumeUrl) setResumePreview(data.resumeUrl);
      if (data.profilePictureUrl) setProfilePicturePreview(data.profilePictureUrl);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      setLoadingExperiences(true);
      const data = await workExperienceServices.getAllWorkExperiences();
      setExperiences(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch work experiences');
    } finally {
      setLoadingExperiences(false);
    }
  };

  const fetchEducations = async () => {
    try {
      setLoadingEducations(true);
      const data = await educationServices.getAllEducation();
      setEducations(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch education records');
    } finally {
      setLoadingEducations(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      await workExperienceServices.deleteWorkExperience(id);
      toast.success('Work experience deleted successfully');
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete work experience');
    }
  };

  const handleCreateExperience = async (data: any) => {
    try {
      await workExperienceServices.createWorkExperience(data);
      toast.success('Work experience created successfully');
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create work experience');
    }
  };

  const handleUpdateExperience = async (data: any) => {
    try {
      if (!selectedExperience) return;
      await workExperienceServices.updateWorkExperience(selectedExperience.id, data);
      toast.success('Work experience updated successfully');
      fetchExperiences();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update work experience');
    }
  };

  const openCreateForm = () => {
    setSelectedExperience(null);
    setIsExperienceFormOpen(true);
  };

  const openEditForm = (experience: any) => {
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
      toast.success('Education record deleted successfully');
      fetchEducations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete education record');
    }
  };

  const handleCreateEducation = async (data: any) => {
    try {
      await educationServices.createEducation(data);
      toast.success('Education record created successfully');
      fetchEducations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create education record');
    }
  };

  const handleUpdateEducation = async (data: any) => {
    try {
      if (!selectedEducation) return;
      await educationServices.updateEducation(selectedEducation.id, data);
      toast.success('Education record updated successfully');
      fetchEducations();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update education record');
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit.');
        return;
      }
      if (uploadType === 'resume') {
        setResumeFile(file);
        setResumePreview(URL.createObjectURL(file));
        setIsResumeModalOpen(true);
      } else if (uploadType === 'profilePicture') {
        setProfilePictureFile(file);
        setProfilePicturePreview(URL.createObjectURL(file));
        setIsProfilePictureModalOpen(true);
      }
    }
  };

  const handleUploadResume = async (file: File) => {
    try {
      setUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          const response: UploadResponse = await userServices.uploadResume({ file: base64String });
          setProfile((prev: any) => ({ ...prev, resumeUrl: response.fileUrl }));
          setResumePreview(response.fileUrl || URL.createObjectURL(file));
          toast.success(response.message || 'Resume uploaded successfully');
          setIsResumeModalOpen(false);
          setResumeFile(null);
        }
      };
      reader.onerror = () => toast.error('Failed to read file');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadProfilePicture = async (file: File) => {
    try {
      setUploading(true);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result?.toString().split(',')[1];
        if (base64String) {
          const response: UploadResponse = await userServices.uploadProfilePicture({ file: base64String });
          setProfile((prev: any) => ({ ...prev, profilePictureUrl: response.fileUrl }));
          setProfilePicturePreview(response.fileUrl || URL.createObjectURL(file));
          toast.success(response.message || 'Profile picture uploaded successfully');
          setIsProfilePictureModalOpen(false);
          setProfilePictureFile(null);
        }
      };
      reader.onerror = () => toast.error('Failed to read file');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const removeResumePreview = () => {
    setResumeFile(null);
    setResumePreview(null);
    setProfile((prev: any) => ({ ...prev, resumeUrl: null }));
  };

  const removeProfilePicturePreview = () => {
    setProfilePictureFile(null);
    setProfilePicturePreview(null);
    setProfile((prev: any) => ({ ...prev, profilePictureUrl: null }));
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
        actions={
          <div className="flex gap-2">
            <Button variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              Export Profile
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
            <CardContent className="pt-0 relative">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-background -mt-12 mb-4">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt="John Doe" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-muted-foreground">Senior UX Designer</p>
                <div className="flex items-center mt-2 text-muted-foreground text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center mt-1 text-muted-foreground text-sm">
                  <Eye className="h-4 w-4 mr-1" />
                  <span>42 profile views this month</span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    Resume
                  </Button>
                  <Button size="sm">
                    <Link2 className="h-4 w-4 mr-1" />
                    Portfolio
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Profile Completion</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>85% Complete</span>
                    <span className="text-muted-foreground">17/20 Sections</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <p>Complete your profile to improve job matches</p>
                </div>
              </div>

              <SocialsCard />
            </CardContent>
          </Card>

          <SkillsCard />

          <LanguagesCard />

          <Card className="overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
            <CardContent className="pt-0 relative">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 border-4 border-background -mt-12 mb-4">
                  <AvatarImage src={profilePicturePreview || profile.profilePictureUrl || '/placeholder.svg?height=96&width=96'} alt={`${profile.firstName} ${profile.lastName}`} />
                  <AvatarFallback>{profile.firstName?.[0]}{profile.lastName?.[0]}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h2>
                <p className="text-muted-foreground">{profile.headline || 'Add a headline'}</p>
                {profile.currentLocation && (
                  <div className="flex items-center mt-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profile.currentLocation}</span>
                  </div>
                )}
                <div className="flex gap-2 mt-4">
                  {profile.resumeUrl && (
                    <Button variant="outline" size="sm" onClick={() => window.open(profile.resumeUrl, '_blank')}>
                      <FileText className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Upload Files</h3>
                <div className="space-y-4">
                  <Select onValueChange={(value) => setUploadType(value as 'resume' | 'profilePicture')}>
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
                          <p className="text-slate-400 text-sm">Click to view</p>
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
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600/50 flex-shrink-0">
                          <img src={profilePicturePreview} alt="Profile Picture Preview" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">Current Profile Picture</p>
                          <p className="text-slate-400 text-sm">Click to view</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title='Remove Preview'
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
                <h3 className="font-medium mb-2">Profile Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {profile.summary || 'Add a summary to tell others about yourself'}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-3">Social Profiles</h3>
                <div className="space-y-3">
                  <a href="#" className="flex items-center text-sm hover:text-primary transition-colors">
                    <Linkedin className="h-4 w-4 mr-2" />
                    linkedin.com/in/johndoe
                  </a>
                  <a href="#" className="flex items-center text-sm hover:text-primary transition-colors">
                    <Github className="h-4 w-4 mr-2" />
                    github.com/johndoe
                  </a>
                  <a href="#" className="flex items-center text-sm hover:text-primary transition-colors">
                    <Twitter className="h-4 w-4 mr-2" />
                    twitter.com/johndoe
                  </a>
                  <a href="#" className="flex items-center text-sm hover:text-primary transition-colors">
                    <Globe className="h-4 w-4 mr-2" />
                    johndoe.design
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Skills</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  'UX Design',
                  'User Research',
                  'Figma',
                  'Prototyping',
                  'Wireframing',
                  'UI Design',
                  'Design Systems',
                  'User Testing',
                  'Accessibility',
                  'Design Thinking',
                  'Adobe XD',
                  'Sketch',
                ].map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-2.5 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Languages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">English</span>
                  <span className="text-sm text-muted-foreground">Native</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Spanish</span>
                  <span className="text-sm text-muted-foreground">Professional</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">French</span>
                  <span className="text-sm text-muted-foreground">Basic</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>About Me</span>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Experienced UX Designer with a passion for creating intuitive and engaging user experiences. I
                specialize in user research, wireframing, and prototyping to deliver designs that meet both user needs
                and business goals. With 5+ years of experience across various industries, I've developed a keen eye for
                detail and a user-centered approach to design.
              </p>
              <p className="mt-4">
                I'm currently seeking opportunities where I can leverage my skills to create meaningful digital
                experiences that solve real user problems while driving business value.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="experience" className="space-y-6">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="education">Education</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
            </TabsList>

            <TabsContent value="experience" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Work Experience</h3>
                <Button variant="outline" size="sm" onClick={openCreateForm}>
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
                              <h3 className="font-medium text-lg">{experience.position}</h3>
                              <p className="text-muted-foreground">{experience.companyName}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="self-start sm:self-center"
                                onClick={() => openEditForm(experience)}
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
                                  month: 'short',
                                  year: 'numeric',
                                })}
                                {experience.isCurrentRole
                                  ? ' - Present'
                                  : experience.endDate
                                  ? ` - ${new Date(experience.endDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      year: 'numeric',
                                    })}`
                                  : ''}
                              </span>
                            </div>
                          </div>

                          {experience.description && <p className="mt-3">{experience.description}</p>}

                          {experience.achievements && experience.achievements.length > 0 && (
                            <div className="mt-3">
                              <p className="font-medium text-sm">Key Achievements:</p>
                              <ul className="list-disc list-inside mt-1 space-y-1">
                                {experience.achievements.map((achievement: string, i: number) => (
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

              <WorkExperienceForm
                isOpen={isExperienceFormOpen}
                onClose={closeExperienceForm}
                onSubmit={selectedExperience ? handleUpdateExperience : handleCreateExperience}
                initialData={selectedExperience}
              />
            </TabsContent >

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
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-lg">{education.degree}</h3>
                              <p className="text-muted-foreground">{education.school}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="self-start sm:self-center"
                                onClick={() => openEditEducationForm(education)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="self-start sm:self-center text-destructive hover:text-destructive"
                                onClick={() => handleDeleteEducation(education.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{education.location || 'Location not specified'}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>
                                {new Date(education.startDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  year: 'numeric',
                                })}
                                {education.isCurrentlyStudying
                                  ? ' - Present'
                                  : education.endDate
                                  ? ` - ${new Date(education.endDate).toLocaleDateString('en-US', {
                                      month: 'short',
                                      year: 'numeric',
                                    })}`
                                  : ''}
                              </span>
                            </div>
                            {education.grade && (
                              <div className="flex items-center">
                                <Award className="h-4 w-4 mr-1" />
                                <span>{education.grade}</span>
                              </div>
                            )}
                          </div>

                          {education.description && <p className="mt-3">{education.description}</p>}

                          {education.coursework && education.coursework.length > 0 && (
                            <div className="mt-3">
                              <p className="font-medium text-sm">Relevant Coursework:</p>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {education.coursework.map((course: string, i: number) => (
                                  <Badge key={i} variant="outline">
                                    {course}
                                  </Badge>
                                ))}
                              </div>
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

            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Projects</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Project
                </Button>
              </div>

              {[
                {
                  title: 'Healthcare Patient Portal Redesign',
                  role: 'Lead UX Designer',
                  period: '2022',
                  description:
                    'Redesigned a healthcare patient portal to improve usability and accessibility. Conducted user research, created wireframes and prototypes, and worked with developers to implement the design.',
                  link: '#',
                  skills: ['UX Design', 'User Research', 'Prototyping', 'Accessibility'],
                  impact: 'Improved user satisfaction scores by 40% and reduced support tickets by 25%',
                },
                {
                  title: 'E-commerce Mobile App',
                  role: 'UX/UI Designer',
                  period: '2021',
                  description:
                    'Designed a mobile shopping experience for a fashion retailer, focusing on product discovery and checkout optimization. Increased conversion rate by 15% through improved navigation and simplified checkout.',
                  link: '#',
                  skills: ['Mobile Design', 'UI Design', 'Usability Testing', 'Figma'],
                  impact: 'Increased conversion rate by 15% and average order value by 10%',
                },
                {
                  title: 'Financial Dashboard',
                  role: 'UX Designer',
                  period: '2020',
                  description:
                    'Created a data visualization dashboard for financial analysts, simplifying complex data into intuitive charts and actionable insights.',
                  link: '#',
                  skills: ['Data Visualization', 'Dashboard Design', 'Information Architecture'],
                  impact: 'Reduced time spent on data analysis by 30% for end users',
                },
              ].map((project, index) => (
      <Card key={index}>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-muted rounded-full p-2 mt-0.5">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div >
      <div className="flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
                            <h3 className="font-medium text-lg">{project.title}</h3>
                            <p className="text-muted-foreground">{project.role}</p>
                          </div >
      <Button variant="ghost" size="sm" className="self-start sm:self-center">
        <Edit className="h-4 w-4" />
      </Button>
                        </div >

                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{project.period}</span>
                  </div>

                  <p className="mt-3">{project.description}</p>

                  {project.impact && (
                    <div className="mt-3">
                      <p className="font-medium text-sm">Impact:</p>
                      <p className="text-sm mt-1">{project.impact}</p>
                    </div>
                  )}

                  {project.skills && (
                    <div className="mt-3">
                      <p className="font-medium text-sm">Skills Used:</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                        <div className="mt-3">
                          <Button variant="link" className="p-0 h-auto">
                            View Project
                            <ExternalLink className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div >
                  </CardContent >
                </Card >
              ))
  }
            </TabsContent >

            <TabsContent value="certifications" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Certifications</h3>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Certification
                </Button>
              </div>

              {[
                {
                  title: 'Google UX Design Professional Certificate',
                  issuer: 'Google',
                  date: '2022',
                  description:
                    'Comprehensive UX design program covering the design process from research to high-fidelity prototyping and testing.',
                  skills: ['UX Research', 'Wireframing', 'Prototyping', 'Usability Testing'],
                  credentialId: 'GUXD-2022-12345',
                },
                {
                  title: 'Certified Usability Analyst (CUA)',
                  issuer: 'Human Factors International',
                  date: '2020',
                  description:
                    'Professional certification in user-centered design methodologies and usability testing.',
                  skills: ['Usability Testing', 'User-Centered Design', 'Heuristic Evaluation'],
                  credentialId: 'CUA-2020-67890',
                },
                {
                  title: 'Accessibility in UX Design',
                  issuer: 'Interaction Design Foundation',
                  date: '2019',
                  description:
                    'Specialized training in designing accessible digital experiences for users with disabilities.',
                  skills: ['Accessibility', 'Inclusive Design', 'WCAG Standards'],
                  credentialId: 'IDF-2019-54321',
                },
              ].map((certification, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-muted rounded-full p-2 mt-0.5">
                        <Award className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-lg">{certification.title}</h3>
                            <p className="text-muted-foreground">{certification.issuer}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="self-start sm:self-center">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="flex items-center mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{certification.date}</span>
                        </div>

                        <p className="mt-3">{certification.description}</p>

                        {certification.credentialId && (
                          <div className="mt-3">
                            <p className="font-medium text-sm">Credential ID:</p>
                            <p className="text-sm mt-1">{certification.credentialId}</p>
                          </div>
                        )}

                        {certification.skills && (
                          <div className="mt-3">
                            <p className="font-medium text-sm">Skills:</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {certification.skills.map((skill, i) => (
                                <Badge key={i} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-3">
                          <Button variant="link" className="p-0 h-auto">
                            Verify Credential
                            <ExternalLink className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs >
        </div >
      </div >

    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Job Preferences</CardTitle>
          <CardDescription>Your preferences for job matching</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Desired Roles</h3>
              <div className="flex flex-wrap gap-2">
                  {['UX Designer', 'Product Designer', 'UI Designer', 'UX Researcher', 'Design Lead'].map((role, index) => (
                <Badge key={index} variant="outline" className="px-2.5 py-1">
                  {role}
                </Badge>
              ))}
            </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Preferred Locations</h3>
                <div className="flex flex-wrap gap-2">
                  {['San Francisco, CA', 'Remote', 'New York, NY', 'Seattle, WA', 'Austin, TX'].map((location, index) => (
                    <Badge key={index} variant="outline" className="px-2.5 py-1">
                      {location}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <h3 className="font-medium mb-3">Salary Expectations</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>$100,000 - $130,000 per year</span>
                    <span className="text-muted-foreground">Negotiable</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <p className="text-xs text-muted-foreground">Based on market rates for your experience level</p>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Employment Type</h3>
                <div className="flex flex-wrap gap-2">
                  {['Full-time', 'Contract', 'Remote', 'Hybrid'].map((type, index) => (
                    <Badge key={index} variant="outline" className="px-2.5 py-1">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </div >

    <div className="pt-4 border-t">
      <h3 className="font-medium mb-3">Work Culture Preferences</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Work Environment</h4>
          <div className="flex flex-wrap gap-2">
                    {['Remote-first', 'Flexible hours', 'Async communication'].map((pref, index) => (
      <span
        key={index}
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent-foreground"
      >
        {pref}
      </span>
    ))
  }
                  </div >
                </div >

    <div className="space-y-2">
      <h4 className="text-sm font-medium">Team Structure</h4>
      <div className="flex flex-wrap gap-2">
                    {['Cross-functional', 'Small teams', 'Flat hierarchy'].map((pref, index) => (
      <span
        key={index}
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent-foreground"
      >
        {pref}
      </span>
    ))
  }
                  </div >
                </div >

    <div className="space-y-2">
      <h4 className="text-sm font-medium">Work Style</h4>
      <div className="flex flex-wrap gap-2">
                    {['Agile', 'User-centered', 'Data-driven'].map((pref, index) => (
      <span
        key={index}
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent-foreground"
      >
        {pref}
      </span>
    ))
  }
                  </div >
                </div >

    <div className="space-y-2">
      <h4 className="text-sm font-medium">Company Size</h4>
      <div className="flex flex-wrap gap-2">
                    {['Startup', 'Mid-size', 'Enterprise'].map((pref, index) => (
      <span
        key={index}
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent-foreground"
      >
        {pref}
      </span>
    ))
  }
                  </div >
                </div >

    <div className="space-y-2">
      <h4 className="text-sm font-medium">Company Values</h4>
      <div className="flex flex-wrap gap-2">
                    {['Innovation', 'Work-life balance', 'Diversity'].map((pref, index) => (
      <span
        key={index}
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent-foreground"
      >
        {pref}
      </span>
    ))
  }
                  </div >
                </div >

    <div className="space-y-2">
      <h4 className="text-sm font-medium">Industry Preferences</h4>
      <div className="flex flex-wrap gap-2">
                    {['Tech', 'Healthcare', 'Education', 'Fintech'].map((pref, index) => (
      <span
        key={index}
        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-accent/20 text-accent-foreground"
      >
        {pref}
      </span>
    ))
  }
                  </div >
                </div >
              </div >
            </div >

    <div className="pt-4 border-t">
      <h3 className="font-medium mb-3">Additional Preferences</h3>
      <ul className="space-y-2 text-muted-foreground">
        <li className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
          <span>Open to startups and established companies</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
          <span>Prefer companies with strong design culture</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
          <span>Interested in healthcare, fintech, and education sectors</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
          <span>Looking for opportunities to mentor junior designers</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-4 w-4 text-green-500 mt-1" />
          <span>Prefer companies with professional development opportunities</span>
        </li>
      </ul>
    </div>
          </CardContent >
        </Card >

    <Card>
      <CardHeader>
        <CardTitle>Availability & Relocation</CardTitle>
        <CardDescription>Your availability and relocation preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-3">Availability</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Available to start</span>
                <Badge>Immediately</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Notice period</span>
                <span>2 weeks</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Interview availability</span>
                <span>Weekdays, 9am-5pm PST</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Relocation Preferences</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Willing to relocate</span>
                <Badge variant="outline">Yes, for the right opportunity</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Preferred locations</span>
                <span>West Coast, East Coast</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Relocation assistance needed</span>
                <span>Yes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="font-medium mb-3">Travel Preferences</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Willing to travel</span>
              <Badge variant="outline">Up to 25%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>International travel</span>
              <span>Yes</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Passport/Visa status</span>
              <span>US Citizen, valid passport</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
      </div >

      <ResumeUploadModal
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setResumeFile(null);
          if (resumePreview && !profile.resumeUrl) URL.revokeObjectURL(resumePreview);
          setResumePreview(profile.resumeUrl || null);
        }}
        onUpload={handleUploadResume}
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
          if (profilePicturePreview && !profile.profilePictureUrl) URL.revokeObjectURL(profilePicturePreview);
          setProfilePicturePreview(profile.profilePictureUrl || null);
        }}
        onUpload={handleUploadProfilePicture}
        filePreview={profilePicturePreview}
        setFilePreview={setProfilePicturePreview}
        selectedFile={profilePictureFile}
        setSelectedFile={setProfilePictureFile}
      />
    </div>
  );
}
