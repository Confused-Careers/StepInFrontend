import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { 
  MapPin, 
  Clock, 
  MessageCircle, 
  Building2, 
  Users, 
  Briefcase, 
  DollarSign,
  Calendar,
  GraduationCap,
  Award,
  Globe,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Eye,
  UserCheck,
  Code,
  Languages,
  BookOpen,
  Zap,
  Shield,
  Target,
  Loader2
} from "lucide-react";
import { jobServices } from "@/services/jobServices";
import { useParams, useNavigate } from "react-router-dom";

interface Company {
  id: string;
  companyName: string;
  logoUrl: string | null;
  companySize: string;
  industry: string;
  location: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  payPeriod: string;
  salaryCurrency: string;
  location: string;
  isRemote: boolean;
  applicationDeadline: string;
  status: string;
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  company: Company;
  category: string | null;
  requiredSkills: string[];
  requiredLanguages: string[];
  requiredCertifications: string[];
  requiredEducation: string[];
  hasApplied: boolean;
  isSaved: boolean;
  applicationId: string | null;
  matchScore: number | null;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15
    }
  }
};

const glowVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function JobPostingPage() {
  const [isApplying] = useState<boolean>(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("description");
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await jobServices.getJobById(jobId!);
        setJob(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const hasValidImage = (imageUrl?: string | null): boolean => {
    return imageUrl !== null && 
           imageUrl !== undefined && 
           imageUrl.trim() !== "" && 
           imageUrl !== " ";
  };

  const formatSalary = (min: string, max: string, period: string) => {
    const minNum = parseFloat(min);
    const maxNum = parseFloat(max);
    if (isNaN(minNum) || isNaN(maxNum)) return "Competitive Salary";
    
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    
    return `${formatter.format(minNum)} - ${formatter.format(maxNum)}/${period}`;
  };

  const getEmploymentTypeStyle = (type: string) => {
    const styles: Record<string, string> = {
      full_time: "bg-green-500/10 text-green-500 border-green-500/20",
      part_time: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      contract: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      internship: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    };
    return styles[type] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  const getExperienceLevelStyle = (level: string) => {
    const styles: Record<string, string> = {
      entry: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      mid: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      senior: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      lead: "bg-red-500/10 text-red-500 border-red-500/20",
      executive: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    };
    return styles[level] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-gray-400 text-lg">Loading job details...</p>
        </motion.div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-white">Job Not Found</h2>
          <p className="text-gray-400">The job you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          variants={glowVariants}
          initial="initial"
          animate="animate"
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]"
        />
        <motion.div
          variants={glowVariants}
          initial="initial"
          animate="animate"
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.02]" />
      </div>

      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-black/50 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {hasValidImage(job.company.logoUrl) ? (
              <img 
                src={job.company.logoUrl!}
                width={48} 
                height={48} 
                className="rounded-lg object-contain" 
                alt={job.company.companyName}
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-white">{job.company.companyName}</h3>
              <p className="text-sm text-gray-400">{job.company.industry}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{job.viewsCount} views</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <UserCheck className="w-4 h-4" />
              <span className="text-sm">{job.applicationsCount} applicants</span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Title Section */}
            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25" />
              <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-300">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{job.location}{job.isRemote && " • Remote"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {job.matchScore && (
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 relative">
                        <svg className="w-20 h-20 transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-700"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - job.matchScore / 100)}`}
                            className="text-blue-500 transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{job.matchScore}%</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400 mt-2">Match</span>
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getEmploymentTypeStyle(job.employmentType)}`}>
                    {job.employmentType.replace('_', ' ').charAt(0).toUpperCase() + job.employmentType.slice(1).replace('_', ' ')}
                  </span>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getExperienceLevelStyle(job.experienceLevel)}`}>
                    {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
                  </span>
                  {job.category && (
                    <span className="px-4 py-2 rounded-full text-sm font-medium bg-gray-800/50 text-gray-300 border border-gray-700">
                      {job.category}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div variants={itemVariants} className="flex gap-2 p-1 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-white/10">
              {[
                { id: "description", label: "Overview", icon: BookOpen },
                { id: "responsibilities", label: "Responsibilities", icon: Target },
                { id: "requirements", label: "Requirements", icon: CheckCircle },
                { id: "skills", label: "Skills & More", icon: Zap }
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                    activeSection === section.id
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <section.icon className="w-4 h-4" />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </motion.div>

            {/* Content Sections */}
            <AnimatePresence mode="wait">
              {activeSection === "description" && (
                <motion.div
                  key="description"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-blue-400" />
                    </div>
                    About this Role
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                  </div>
                </motion.div>
              )}

              {activeSection === "responsibilities" && (
                <motion.div
                  key="responsibilities"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-purple-400" />
                    </div>
                    What You'll Do
                  </h2>
                  <div className="space-y-4">
                    {job.responsibilities.split('\n').filter(r => r.trim()).map((resp, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3"
                      >
                        <ChevronRight className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-300">{resp.trim()}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === "requirements" && (
                <motion.div
                  key="requirements"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
                >
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    What We're Looking For
                  </h2>
                  <div className="space-y-4">
                    {job.requirements.split('\n').filter(r => r.trim()).map((req, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-3"
                      >
                        <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-300">{req.trim()}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeSection === "skills" && (
                <motion.div
                  key="skills"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="space-y-6"
                >
                  {/* Required Skills */}
                  {job.requiredSkills.length > 0 && (
                    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <Code className="w-5 h-5 text-blue-400" />
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {job.requiredSkills.map((skill, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-4 py-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg font-medium"
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {job.requiredLanguages.length > 0 && (
                    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <Languages className="w-5 h-5 text-purple-400" />
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {job.requiredLanguages.map((lang, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-4 py-2 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-lg font-medium"
                          >
                            {lang}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Certifications */}
                  {job.requiredCertifications.length > 0 && (
                    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <Award className="w-5 h-5 text-amber-400" />
                        Certifications
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {job.requiredCertifications.map((cert, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-4 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg font-medium"
                          >
                            {cert}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {job.requiredEducation.length > 0 && (
                    <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-green-400" />
                        Education
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {job.requiredEducation.map((edu, index) => (
                          <motion.span
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="px-4 py-2 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg font-medium"
                          >
                            {edu}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Company Info */}
            <motion.div
              variants={itemVariants}
              className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Building2 className="w-6 h-6 text-blue-400" />
                About {job.company.companyName}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Industry</p>
                    <p className="font-medium">{job.company.industry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Company Size</p>
                    <p className="font-medium">{job.company.companySize}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="font-medium">{job.company.location}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Apply Card */}
          <div className="lg:col-span-1">
            <motion.div
              variants={itemVariants}
              className="sticky top-24"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25" />
                <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  {/* Company Logo */}
                  <div className="flex justify-center mb-8">
                    {hasValidImage(job.company.logoUrl) ? (
                      <motion.img
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        src={job.company.logoUrl!}
                        width={80} 
                        height={80} 
                        className="rounded-xl object-contain shadow-2xl" 
                        alt={job.company.companyName}
                      />
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-2xl"
                      >
                        <Building2 className="w-10 h-10 text-white" />
                      </motion.div>
                    )}
                  </div>

                  {/* Salary */}
                  <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <span className="text-sm text-gray-400">Salary Range</span>
                    </div>
                    <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                      {formatSalary(job.salaryMin, job.salaryMax, job.payPeriod)}
                    </p>
                  </div>

                  {/* Key Info */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Location</p>
                        <p className="font-medium">{job.location}{job.isRemote && " • Remote"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Application Deadline</p>
                        <p className="font-medium">
                          {job.applicationDeadline
                            ? new Date(job.applicationDeadline).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })
                            : "Rolling Applications"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <div className="flex-1">
                        <p className="text-sm text-gray-400">Competition</p>
                        <p className="font-medium">{job.applicationsCount} applicants</p>
                      </div>
                    </div>
                  </div>

                  {/* Apply Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/individual-login")}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group"
                    disabled={isApplying}
                  >
                    <span>Apply in &lt; 2 minutes</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>

                  {/* AI Assistant */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/individual-login")}
                    className="w-full mt-4 bg-transparent hover:bg-blue-500/10 text-blue-400 py-4 rounded-xl font-semibold border border-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Talk to StepIn AI
                  </motion.button>

                  {/* Trust Badges */}
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span>Secure & Confidential Application</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}