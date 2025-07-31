import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Applicant as ImportedApplicant } from "./ApplicationsPage";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicantsService, ProvideFeedbackDto, UpdateFeedbackDto, ApplicationWithFeedbackDto, StrengthsWeaknessesDto, WhyFitsDto } from "../../../services/applicantServices";
import { ChatService, CreateChatDto } from "../../../services/chatServices";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import companyServices from "../../../services/companyServices";
import { Sparkles, Loader2 } from "lucide-react";

export interface Applicant extends ImportedApplicant {
  resumeUrl: string | URL;
  imageUrl?: string | null;
  status: string;
  jobSeekerId: string;
  // AI search specific fields
  relevanceScore?: number;
  matchingHighlights?: string[];
  skillsScore?: number;
  cultureScore?: number;
  hasCultureData?: boolean;
}

interface ApplicantsCardProps {
  applicant: Applicant;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.5 } },
};

export function ApplicantsCard({ applicant }: ApplicantsCardProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState<string>("");
  const [existingFeedback, setExistingFeedback] = useState<string | null>(null);
  const [applicationId] = useState(applicant.id);
  const [isAccepted, setIsAccepted] = useState(applicant.status === 'accepted');
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [notSuitableLoading, setNotSuitableLoading] = useState(false);
  const [hireLoading, setHireLoading] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [isRejected, setIsRejected] = useState(applicant.status === 'rejected');
  const [isNotSuitable, setIsNotSuitable] = useState(applicant.status === 'not_suitable');
  const [isHired, setIsHired] = useState(applicant.status === 'hired');
  const [isInterviewed, setIsInterviewed] = useState(applicant.status === 'interview');
  const [messageLoading, setMessageLoading] = useState(false);
  const [aiStrengthsWeaknesses, setAiStrengthsWeaknesses] = useState<StrengthsWeaknessesDto | null>(null);
  const [aiWhyFits, setAiWhyFits] = useState<WhyFitsDto | null>(null);
  const [aiDataLoading, setAiDataLoading] = useState(false);
  const [whyFitsLoading, setWhyFitsLoading] = useState(false);
  const [aiDataError, setAiDataError] = useState<string | null>(null);
  const [whyFitsError, setWhyFitsError] = useState<string | null>(null);
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const formatEducation = (education: string) => {
    if (!education || education === "Not specified") return education;
    
    const degreeTypeMap: Record<string, string> = {
      'bachelor': "Bachelor's",
      'bachelors': "Bachelor's",
      'master': "Master's", 
      'masters': "Master's",
      'phd': "PhD",
      'doctorate': "Doctorate",
      'associate': "Associate's",
      'associates': "Associate's",
      'diploma': "Diploma",
      'certificate': "Certificate",
      'high school': "High School",
      'highschool': "High School"
    };

    const parts = education.split(' in ');
    if (parts.length >= 2) {
      const degreeType = parts[0].toLowerCase().trim();
      const rest = parts.slice(1).join(' in ');
      
      const formattedDegreeType = degreeTypeMap[degreeType] || 
        degreeType.charAt(0).toUpperCase() + degreeType.slice(1);
      
      return `${formattedDegreeType} in ${rest}`;
    }
    
    return education.charAt(0).toUpperCase() + education.slice(1);
  };

  const hasValidImage = (imageUrl?: string | null): boolean => {
    return imageUrl !== null && 
           imageUrl !== undefined && 
           imageUrl.trim() !== "" && 
           imageUrl !== " ";
  };

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await ApplicantsService.getApplicationsWithFeedback();
        const feedbacks = Array.isArray(response) ? response : [];
        const applicantFeedback = feedbacks.find((f: ApplicationWithFeedbackDto) => f.applicationId === applicationId);
        if (applicantFeedback) {
          setExistingFeedback(applicantFeedback.feedback);
          setFeedback(applicantFeedback.feedback);
        }
      } catch (error) {
        console.error("Failed to fetch feedback:", error);
        toast.error("Failed to load feedback");
      }
    };
    fetchFeedback();
  }, [applicationId]);

  const loadWhyFits = async (forceRegenerate = false) => {
    if (!jobId) return;
    
    setWhyFitsLoading(true);
    setWhyFitsError(null);
    try {
      if (forceRegenerate) {
        setAiWhyFits(null);
      }
      const data = await ApplicantsService.getApplicantWhyFits(jobId, applicant.jobSeekerId);
      setAiWhyFits(data);
    } catch (error) {
      console.error("Failed to fetch why fits:", error);
      setWhyFitsError("Failed to load AI insights");
    } finally {
      setWhyFitsLoading(false);
    }
  };

  useEffect(() => {
    if (showPopup) {
      if (!aiWhyFits) {
        loadWhyFits();
      }
      if (!aiStrengthsWeaknesses) {
        loadStrengthsWeaknesses();
      }
    }
  }, [jobId, applicant.jobSeekerId, showPopup]);

  const handleRegenerateWhyFits = async () => {
    await loadWhyFits(true);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };


  const loadStrengthsWeaknesses = async (forceRegenerate = false) => {
    if (!jobId) return;
    
    setAiDataLoading(true);
    setAiDataError(null);
    try {
      // If forceRegenerate, clear existing data first
      if (forceRegenerate) {
        setAiStrengthsWeaknesses(null);
      }
      
      const data = await ApplicantsService.getApplicantStrengthsWeaknesses(jobId, applicant.jobSeekerId);
      setAiStrengthsWeaknesses(data);
    } catch (error) {
      console.error("Failed to fetch AI strengths/weaknesses:", error);
      setAiDataError("Failed to load AI insights");
    } finally {
      setAiDataLoading(false);
    }
  };

  const handleRegenerateStrengthsWeaknesses = async () => {
    await loadStrengthsWeaknesses(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleOpenFeedbackModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFeedbackModal(true);
  };

  const handleCloseFeedbackModal = () => {
    setShowFeedbackModal(false);
    setFeedback(existingFeedback || "");
  };

  const handleSubmitFeedback = async () => {
    try {
      if (existingFeedback) {
        const updateFeedback: UpdateFeedbackDto = { feedback };
        await ApplicantsService.updateFeedback(applicationId, updateFeedback);
        toast.success("Feedback updated successfully");
      } else {
        const newFeedback: ProvideFeedbackDto = { applicationId, feedback };
        await ApplicantsService.provideFeedback(newFeedback);
        toast.success("Feedback submitted successfully");
      }
      setExistingFeedback(feedback);
      handleCloseFeedbackModal();
    } catch (error) {
      toast.error("Failed to submit feedback");
      console.error(error);
    }
  };

  const handleRemoveFeedback = async () => {
    try {
      await ApplicantsService.removeFeedback(applicationId);
      setExistingFeedback(null);
      setFeedback("");
      toast.success("Feedback removed successfully");
    } catch (error) {
      toast.error("Failed to remove feedback");
      console.error(error);
    }
  };

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!applicationId) {
      toast.error("Application ID is missing. Cannot update status.");
      console.error("Missing applicationId for applicant:", applicant);
      return;
    }
    
    setAcceptLoading(true);
    try {
      await ApplicantsService.acceptApplication(applicationId);
      setIsAccepted(true);
      toast.success(`Accepted ${applicant.name}`);
    } catch (error) {
      toast.error("Failed to accept candidate");
      console.error("Error accepting application:", error);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!applicationId) {
      toast.error("Application ID is missing. Cannot update status.");
      console.error("Missing applicationId for applicant:", applicant);
      return;
    }
    
    setRejectLoading(true);
    try {
      await ApplicantsService.rejectApplication(applicationId);
      setIsRejected(true);
      toast.success(`Rejected ${applicant.name}`);
    } catch (error) {
      toast.error("Failed to reject candidate");
      console.error("Error rejecting application:", error);
    } finally {
      setRejectLoading(false);
    }
  };

  const handleNotSuitable = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!applicationId) {
      toast.error("Application ID is missing. Cannot update status.");
      console.error("Missing applicationId for applicant:", applicant);
      return;
    }
    
    setNotSuitableLoading(true);
    try {
      await ApplicantsService.markNotSuitable(applicationId);
      setIsNotSuitable(true);
      toast.success(`Marked ${applicant.name} as not suitable`);
    } catch (error) {
      toast.error("Failed to mark as not suitable");
      console.error("Error marking not suitable:", error);
    } finally {
      setNotSuitableLoading(false);
    }
  };

  const handleHire = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!applicationId) {
      toast.error("Application ID is missing. Cannot update status.");
      console.error("Missing applicationId for applicant:", applicant);
      return;
    }
    
    setHireLoading(true);
    try {
      await ApplicantsService.hireApplicant(applicationId);
      setIsHired(true);
      toast.success(`Hired ${applicant.name}`);
    } catch (error) {
      toast.error("Failed to hire candidate");
      console.error("Error hiring applicant:", error);
    } finally {
      setHireLoading(false);
    }
  };

  const handleMoveToInterview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!applicationId) {
      toast.error("Application ID is missing. Cannot update status.");
      console.error("Missing applicationId for applicant:", applicant);
      return;
    }
    
    setInterviewLoading(true);
    try {
      await ApplicantsService.moveToInterview(applicationId);
      setIsInterviewed(true);
      toast.success(`Moved ${applicant.name} to interview stage`);
    } catch (error) {
      toast.error("Failed to move to interview stage");
      console.error("Error moving to interview:", error);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleMessage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessageLoading(true);
    try {
      const profile = await companyServices.getProfile();
      const companyId = profile.userId;
      if (!companyId) {
        toast.error("Company profile not found");
        return;
      }
      const jobSeekerId = applicant.userId;
      let chat = await ChatService.getChatByParticipants({ jobSeekerId, companyId });
      if (!chat) {
        const createChatDto: CreateChatDto = { jobSeekerId, companyId };
        await ChatService.createChat(createChatDto);
      }
      navigate(`/company/dashboard/company-messages`);
    } catch (error) {
      toast.error("Failed to initiate chat");
      console.error("Error initiating chat:", error);
    } finally {
      setMessageLoading(false);
    }
  };

  const whyYouFit = `${applicant.name} is a strong candidate based on their experience as ${applicant.currentPosition} at ${applicant.currentCompany}.`;
  const fullJobDescription = `As a ${applicant.currentPosition}, ${applicant.name} has demonstrated ${applicant.strength.join(", ").toLowerCase() || "various skills"}. Their role at ${applicant.currentCompany} involved key responsibilities that align with this position.`;

  return (
    <>
      <div
        className="w-full rounded-2xl overflow-hidden shadow-xl border bg-[#0A0A0B] hover:bg-[#101114] transition-all duration-200 cursor-pointer group"
        style={{ 
          border: "1px solid rgba(10, 132, 255, 0.3)", 
          boxShadow: "0 0 20px rgba(10, 132, 255, 0.15)" 
        }}
        onClick={handleOpenPopup}
      >
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-[rgba(10,132,255,0.2)] bg-[rgba(10,132,255,0.1)]">
              {hasValidImage(applicant.imageUrl) ? (
                <img 
                  src={applicant.imageUrl!} 
                  width={56} 
                  height={56} 
                  className="object-cover w-full h-full" 
                  alt={`${applicant.name}'s photo`}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-[#0A84FF]">
                    {applicant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-[#0A84FF] transition-colors">{applicant.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <p className="text-sm text-[rgba(209,209,214,0.8)]">{applicant.location}</p>
                    <span className="text-[rgba(209,209,214,0.4)] text-xs hidden sm:inline">•</span>
                    <span className="text-sm text-[rgba(209,209,214,0.8)]">{applicant.currentPosition}</span>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end gap-2">
                  <span className="px-3 py-1 rounded-full bg-[rgba(10,132,255,0.15)] text-[#0A84FF] text-sm font-semibold">
                    {applicant.match}% Match
                  </span>
                  {/* Status Badge */}
                  {(isAccepted || isRejected || isHired || isInterviewed || isNotSuitable) && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isAccepted ? 'bg-[rgba(34,197,94,0.15)] text-[#22C55E]' :
                      isHired ? 'bg-[rgba(168,85,247,0.15)] text-[#A855F7]' :
                      isInterviewed ? 'bg-[rgba(251,146,60,0.15)] text-[#FB923C]' :
                      isRejected ? 'bg-[rgba(239,68,68,0.15)] text-[#EF4444]' :
                      isNotSuitable ? 'bg-[rgba(156,163,175,0.15)] text-[#9CA3AF]' : ''
                    }`}>
                      {isAccepted ? 'Accepted' :
                       isHired ? 'Hired' :
                       isInterviewed ? 'Interview' :
                       isRejected ? 'Rejected' :
                       isNotSuitable ? 'Not Suitable' : ''}
                    </span>
                  )}
                  {applicant.relevanceScore && applicant.relevanceScore > 0.5 && (
                    <span className="text-xs text-[#0A84FF] flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      AI Powered
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-[rgba(10,132,255,0.1)] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#0A84FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[rgba(209,209,214,0.6)] mb-0.5">Experience</p>
                  <p className="text-sm text-white font-medium truncate">{applicant.currentCompany}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-lg bg-[rgba(10,132,255,0.1)] flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-[#0A84FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[rgba(209,209,214,0.6)] mb-0.5">Education</p>
                  <p className="text-sm text-white font-medium truncate">{formatEducation(applicant.education)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Skills and Culture Scores */}
          {(applicant.skillsScore || applicant.cultureScore) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {applicant.skillsScore && (
                <div className="rounded-lg px-3 py-2 bg-[rgba(10,132,255,0.05)] border border-[rgba(10,132,255,0.2)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[rgba(209,209,214,0.7)]">Skills Match</span>
                    <span className="text-xs font-semibold text-[#0A84FF]">{applicant.skillsScore}%</span>
                  </div>
                  <div className="w-full bg-[rgba(10,132,255,0.1)] rounded-full h-1.5">
                    <div 
                      className="bg-[#0A84FF] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${applicant.skillsScore}%` }}
                    />
                  </div>
                </div>
              )}
              {applicant.cultureScore && (
                <div className="rounded-lg px-3 py-2 bg-[rgba(34,197,94,0.05)] border border-[rgba(34,197,94,0.2)]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-[rgba(209,209,214,0.7)]">Culture Fit</span>
                    <span className="text-xs font-semibold text-[#22C55E]">{applicant.cultureScore}%</span>
                  </div>
                  <div className="w-full bg-[rgba(34,197,94,0.1)] rounded-full h-1.5">
                    <div 
                      className="bg-[#22C55E] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${applicant.cultureScore}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {applicant.matchingHighlights && applicant.matchingHighlights.length > 0 && (
            <div className="rounded-xl p-4 bg-gradient-to-r from-[rgba(10,132,255,0.05)] to-[rgba(10,132,255,0.02)] border border-[rgba(10,132,255,0.2)]">
              <p className="text-xs text-[#0A84FF] font-semibold mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                AI Match Insights
              </p>
              <div className="text-sm text-[rgba(209,209,214,0.9)] space-y-1">
                {applicant.matchingHighlights.slice(0, 2).map((highlight, idx) => (
                  <p key={idx} className="line-clamp-1 flex items-start">
                    <span className="text-[#0A84FF] mr-2">•</span>
                    {highlight}
                  </p>
                ))}
                {applicant.matchingHighlights.length > 2 && (
                  <p className="text-[#0A84FF] text-xs font-medium">+{applicant.matchingHighlights.length - 2} more insights...</p>
                )}
              </div>
            </div>
          )}


          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 pt-2">
            <button
              className={`w-full sm:flex-1 bg-[#0A84FF] text-white rounded-xl py-2.5 px-4 text-sm font-semibold transition-all hover:bg-[#0066CC] ${isAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAccept}
              disabled={isAccepted || acceptLoading}
            >
              {isAccepted ? 'Accepted' : acceptLoading ? 'Accepting...' : 'Accept'}
            </button>
            <button
              className={`w-full sm:flex-1 border border-[rgba(10,132,255,0.5)] text-[#0A84FF] rounded-xl py-2.5 px-4 text-sm font-semibold transition-all hover:bg-[rgba(10,132,255,0.1)] ${isInterviewed ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleMoveToInterview}
              disabled={isInterviewed || interviewLoading}
            >
              {isInterviewed ? 'In Interview' : interviewLoading ? 'Moving...' : 'Interview'}
            </button>
            <button
              className={`w-full sm:w-auto px-4 py-2.5 text-[rgba(209,209,214,0.7)] text-sm font-medium hover:text-[rgba(209,209,214,1)] hover:bg-[rgba(255,255,255,0.05)] rounded-xl transition-all ${isNotSuitable ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleNotSuitable}
              disabled={isNotSuitable || notSuitableLoading}
            >
              {isNotSuitable ? 'Not Suitable' : notSuitableLoading ? 'Processing...' : 'Pass'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleClosePopup}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div
                className="bg-black p-6 w-full max-w-4xl h-[90vh] overflow-y-auto relative border border-[rgba(10,132,255,1)] rounded-2xl shadow-[0px_0px_20px_0px_#0A84FF33] no-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 text-[rgba(209,209,214,1)] hover:text-white"
                  title="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <motion.div variants={contentVariants} custom={0.15} initial="hidden" animate="visible">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {hasValidImage(applicant.imageUrl) ? (
                        <div className="bg-white rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
                          <img 
                            src={applicant.imageUrl!} 
                            width={96} 
                            height={96} 
                            className="object-fill rounded-md w-full h-full" 
                            alt={`${applicant.name}'s photo`}
                          />
                        </div>
                      ) : (
                        <div className="p-1 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0" />
                      )}
                      <div className="flex-1 text-center">
                        <h2 className="font-bold text-3xl text-white">{applicant.name}</h2>
                        <p className="text-sm text-[rgba(209,209,214,1)]">{applicant.currentCompany} • {applicant.location}</p>
                      </div>
                      <div className="w-24">
                        <span className="bg-[rgba(10,132,255,1)] text-white text-xs rounded-md px-2 py-1 min-w-[80px] text-center">{applicant.match}% Match</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.2} initial="hidden" animate="visible">
                  <div className="px-6 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-[18px] text-white ml-3">Why <span className="text-[rgba(10,132,255,1)]">{applicant.name}</span> Fits</h3>
                      {aiWhyFits && !whyFitsLoading && (
                        <button
                          onClick={handleRegenerateWhyFits}
                          className="text-[#0A84FF] hover:text-[#3396FF] transition-colors mr-3"
                          title="Regenerate AI insights"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="bg-[rgba(10,132,255,0.05)] rounded-lg p-3 border border-gray-400 border-opacity-20" style={{ boxShadow: "0px 4px 20px 0px #0A84FF26" }}>
                      {whyFitsLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin text-[rgba(10,132,255,1)]" />
                          <span className="ml-2 text-sm text-[rgba(10,132,255,1)]">Analyzing candidate fit...</span>
                        </div>
                      ) : whyFitsError ? (
                        <p className="text-[13px] text-red-400 m-3">{whyFitsError}</p>
                      ) : aiWhyFits ? (
                        <p className="text-[13px] text-white m-3 leading-relaxed">
                          {aiWhyFits.whyFits[0]}
                        </p>
                      ) : applicant.matchingHighlights && applicant.matchingHighlights.length > 0 ? (
                        <ul className="text-[13px] text-white m-3 space-y-2">
                          {applicant.matchingHighlights.map((highlight, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-[rgba(10,132,255,1)] mr-2">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-[13px] text-white m-3">{whyYouFit}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.25} initial="hidden" animate="visible">
                  <div className="px-6 pb-4">
                    <div className="flex justify-start mt-4 mb-4 gap-2">
                      <button 
                        className="bg-[rgba(10,132,255,1)] text-white font-bold text-lg leading-[140%] text-center rounded-lg w-[270px] h-[35px]" 
                        onClick={() => navigate(`/company/dashboard/${jobId}/applications/${applicant.jobSeekerId}`, {
                          state: {
                            matchPercentage: applicant.match ? parseInt(applicant.match) : undefined,
                            skillsScore: applicant.skillsScore,
                            cultureScore: applicant.cultureScore
                          }
                        })}
                      >
                        View Resume
                      </button>
                      <button 
                        className={`bg-[rgba(59,130,246,1)] text-white font-bold text-lg leading-[140%] text-center rounded-lg w-[270px] h-[35px] ${messageLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                        onClick={handleMessage}
                        disabled={messageLoading}
                      >
                        {messageLoading ? 'Loading...' : 'Message'}
                      </button>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.3} initial="hidden" animate="visible">
                  <div className="px-6 pb-4">
                    <h3 className="font-bold text-[18px] text-white mb-0 ml-3">Work Experience</h3>
                    <div className="bg-[rgba(26,31,43,1)] rounded-lg p-3 border border-[rgba(255,255,255,0.03)]">
                      <p className="text-sm text-white m-1">{applicant.currentPosition} at {applicant.currentCompany}</p>
                      <p className="text-sm text-white m-1">{fullJobDescription}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.45} initial="hidden" animate="visible">
                  <div className="px-6 pb-6">
                    <h3 className="font-bold text-[18px] text-white mb-0 ml-3">Education</h3>
                    <div className="rounded-lg p-3 border border-[rgba(255,255,255,0.03)] bg-[rgba(26,31,43,1)]">
                      <p className="text-sm text-white m-1">{formatEducation(applicant.education)}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.5} initial="hidden" animate="visible">
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-[18px] text-white ml-3 flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-[#0A84FF]" />
                        AI-Generated Insights
                      </h3>
                      {aiStrengthsWeaknesses && !aiDataLoading && (
                        <button
                          onClick={handleRegenerateStrengthsWeaknesses}
                          className="text-[#0A84FF] hover:text-[#3396FF] transition-colors mr-3"
                          title="Regenerate AI insights"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {aiDataLoading ? (
                      <div className="bg-[rgba(26,31,43,1)] rounded-lg p-4 border border-[rgba(255,255,255,0.03)] flex items-center justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0A84FF] mr-2" />
                        <span className="text-sm text-[rgba(209,209,214,0.8)]">Analyzing candidate profile...</span>
                      </div>
                    ) : aiDataError ? (
                      <div className="bg-[rgba(26,31,43,1)] rounded-lg p-3 border border-[rgba(255,255,255,0.03)]">
                        <p className="text-sm text-[rgba(209,209,214,0.8)] m-1">{aiDataError}</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-[15px] text-[#0A84FF] mb-2 ml-1">Strengths</h4>
                          <div
                            className="rounded-lg px-3 pb-2 pt-1 border border-[rgba(42,42,42,1)]"
                            style={{ background: "linear-gradient(90deg, rgba(10, 132, 255, 0.18) 0%, rgba(59, 59, 139, 0.25) 100%)" }}
                          >
                            <div className="text-[rgba(209,209,214,1)] text-sm font-normal">
                              {(aiStrengthsWeaknesses?.strengths || applicant.strength).map((item, index) => (
                                <span key={index} className="block mt-2 font-[500]">{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[15px] text-[#FF4444] mb-2 ml-1">Areas for Development</h4>
                          <div
                            className="rounded-lg px-3 pb-2 pt-1 border border-[rgba(42,42,42,1)]"
                            style={{ background: "linear-gradient(90deg, rgba(209, 27, 30, 0.2) 0%, rgba(190, 114, 118, 0.2) 100%)" }}
                          >
                            <div className="text-[rgba(209,209,214,1)] text-sm font-normal">
                              {(aiStrengthsWeaknesses?.weaknesses || applicant.weakness).map((item, index) => (
                                <span key={index} className="block mt-2 font-[500]">{item}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {aiStrengthsWeaknesses && (
                          <div className="text-xs text-[rgba(209,209,214,0.6)] text-right">
                            {aiStrengthsWeaknesses.cached ? 
                              <span>Cached • Generated at {new Date(aiStrengthsWeaknesses.generatedAt).toLocaleString()}</span> : 
                              <span>Fresh analysis • Generated just now</span>
                            }
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
                {existingFeedback && (
                  <motion.div variants={contentVariants} custom={0.55} initial="hidden" animate="visible">
                    <div className="px-6 pb-6">
                      <h3 className="font-bold text-[18px] text-white mb-0 ml-3">Feedback</h3>
                      <div className="bg-[rgba(26,31,43,1)] rounded-lg p-3 border border-[rgba(255,255,255,0.03)]">
                        <p className="text-sm text-white m-1">{existingFeedback}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
                <motion.div variants={buttonVariants} initial="hidden" animate="visible" className="px-6 pb-6 flex flex-wrap justify-center gap-5">
                  <button
                    className={`bg-[rgba(59,130,246,1)] text-white rounded-md py-1 px-6 font-bold text-xl leading-[140%] text-center w-auto h-[35px] ${isHired ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleHire}
                    disabled={isHired || hireLoading}
                  >
                    {isHired ? 'Hired' : hireLoading ? 'Hiring...' : 'Accept'}
                  </button>
                  <button
                    className="border border-[rgba(59,130,246,1)] text-[rgba(59,130,246,1)] rounded-md py-1 px-6 font-bold text-xl text-center w-auto h-[35px] flex items-center justify-center"
                    onClick={handleMoveToInterview}
                    disabled={isInterviewed || interviewLoading}
                  >
                    {isInterviewed ? 'Interview' : interviewLoading ? 'Moving...' : 'Interview'}
                  </button>
                  <button
                    className="text-[rgba(209,209,214,1)] text-xl py-1 px-6 w-auto text-center font-[600]"
                    onClick={handleReject}
                    disabled={isRejected || rejectLoading}
                  >
                    {isRejected ? 'Rejected' : rejectLoading ? 'Processing...' : 'Not Interested'}
                  </button>
                  <button
                    className="bg-[rgba(59,130,246,1)] text-white rounded-md py-1 px-6 font-bold text-xl leading-[140%] text-center w-auto h-[35px]"
                    onClick={handleOpenFeedbackModal}
                  >
                    {existingFeedback ? "Edit Feedback" : "Add Feedback"}
                  </button>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.6} initial="hidden" animate="visible">
                  <div className="px-6 pb-4 border-t border-[rgba(255,255,255,0.1)] pt-4">
                    <p className="text-xs text-[rgba(209,209,214,0.6)] text-center flex items-center justify-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12" y2="8"></line>
                      </svg>
                      AI insights can be regenerated using the refresh buttons above
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
        {showFeedbackModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black z-[1000] backdrop-blur-sm"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={handleCloseFeedbackModal}
            />
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-[1010] p-4"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div
                className="bg-black p-6 w-full max-w-2xl rounded-2xl border border-[rgba(10,132,255,1)] shadow-[0px_0px_20px_rgba(10,132,255,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCloseFeedbackModal}
                  className="absolute top-4 right-4 text-[rgba(209,209,214,1)] hover:text-white"
                  title="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <h3 className="font-bold text-[18px] text-white mb-4">
                  {existingFeedback ? "Edit Feedback" : "Add Feedback"} for {applicant.name}
                </h3>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback here..."
                  className="w-full h-32 mb-4 text-white bg-[rgba(26,31,43,1)] border-[rgba(255,255,255,0.05)]"
                />
                <div className="flex justify-end gap-4">
                  {existingFeedback && (
                    <Button
                      variant="destructive"
                      onClick={handleRemoveFeedback}
                    >
                      Remove Feedback
                    </Button>
                  )}
                  <Button
                    onClick={handleSubmitFeedback}
                    disabled={!feedback.trim()}
                    className="bg-[#0A84FF] text-white hover:bg-[#3396FF]"
                  >
                    {existingFeedback ? "Update Feedback" : "Submit Feedback"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}