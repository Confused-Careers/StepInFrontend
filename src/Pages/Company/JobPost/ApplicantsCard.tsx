import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Applicant as ImportedApplicant } from "./ApplicationsPage";
import { useNavigate, useParams } from "react-router-dom";
import { ApplicantsService, ProvideFeedbackDto, UpdateFeedbackDto, ApplicationWithFeedbackDto } from "../../../services/applicantServices";
import { ChatService, CreateChatDto } from "../../../services/chatServices";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import companyServices from "../../../services/companyServices";

export interface Applicant extends ImportedApplicant {
  resumeUrl: string | URL;
  imageUrl?: string | null;
  status: string;
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

  const handleOpenPopup = () => {
    setShowPopup(true);
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
    setAcceptLoading(true);
    try {
      await ApplicantsService.acceptApplication(applicationId);
      setIsAccepted(true);
      toast.success(`Accepted ${applicant.name}`);
    } catch (error) {
      toast.error("Failed to accept candidate");
      console.error(error);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setRejectLoading(true);
    try {
      await ApplicantsService.rejectApplication(applicationId);
      setIsRejected(true);
      toast.success(`Rejected ${applicant.name}`);
    } catch (error) {
      toast.error("Failed to reject candidate");
      console.error(error);
    } finally {
      setRejectLoading(false);
    }
  };

  const handleNotSuitable = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotSuitableLoading(true);
    try {
      await ApplicantsService.markNotSuitable(applicationId);
      setIsNotSuitable(true);
      toast.success(`Marked ${applicant.name} as not suitable`);
    } catch (error) {
      toast.error("Failed to mark as not suitable");
      console.error(error);
    } finally {
      setNotSuitableLoading(false);
    }
  };

  const handleHire = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setHireLoading(true);
    try {
      await ApplicantsService.hireApplicant(applicationId);
      setIsHired(true);
      toast.success(`Hired ${applicant.name}`);
    } catch (error) {
      toast.error("Failed to hire candidate");
      console.error(error);
    } finally {
      setHireLoading(false);
    }
  };

  const handleMoveToInterview = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setInterviewLoading(true);
    try {
      await ApplicantsService.moveToInterview(applicationId);
      setIsInterviewed(true);
      toast.success(`Moved ${applicant.name} to interview stage`);
    } catch (error) {
      toast.error("Failed to move to interview stage");
      console.error(error);
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
        chat = await ChatService.createChat(createChatDto);
      }
      navigate(`/company/dashboard/company-messages`);
    } catch (error) {
      toast.error("Failed to initiate chat");
      console.error("Error initiating chat:", error);
    } finally {
      setMessageLoading(false);
    }
  };

  const whyYouFit = `${applicant.name} is a strong fit due to their skills in ${applicant.strength[0]?.toLowerCase() || "relevant areas"} and experience as a ${applicant.currentPosition} at ${applicant.currentCompany}.`;
  const aiSummary = `Based on analysis, ${applicant.name} excels in ${applicant.strength[1]?.toLowerCase() || "key areas"}, but may need support in ${applicant.weakness[0]?.toLowerCase() || "certain areas"}.`;
  const fullJobDescription = `As a ${applicant.currentPosition}, ${applicant.name} has demonstrated ${applicant.strength.join(", ").toLowerCase()}. Their role at ${applicant.currentCompany} involved key responsibilities that align with this position.`;

  return (
    <>
      <div
        className="w-full rounded-2xl overflow-hidden shadow-2xl border h-min bg-black p-3 cursor-pointer"
        style={{ border: "1px solid rgba(10, 132, 255, 0.4)", boxShadow: "0 0 15px rgba(10, 132, 255, 0.3)" }}
        onClick={handleOpenPopup}
      >
        <div className="py-2 px-5 space-y-4 mb-2 mt-2">
          <div className="flex items-start gap-4 [@media(max-width:1072px)]:gap-0">
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
            <div className="flex-1 ml-5 flex flex-col justify-center">
              <div className="flex justify-center items-center gap-2 pr-9 [@media(max-width:1240px)]:pr-0">
                <h3 className="font-[700] text-[20px] text-white flex justify-start ml-3 [@media(max-width:1240px)]:ml-0">{applicant.name}</h3>
              </div>
                <div className="flex flex-col [@media(min-width:1248px)]:flex-row items-center justify-center gap-2">
                  <p className="text-sm text-[rgba(209,209,214,1)]">{applicant.location}</p>
                  <span className="text-[rgba(209,209,214,1)] text-sm [@media(min-width:1248px)]:block hidden">•</span>
                  <p className="px-1 py-0.5 rounded-md bg-[#0A84FF] text-white text-xs font-medium flex items-center justify-center">
                    {applicant.match}% Match
                  </p>
                </div>
            </div>
          </div>

          <div className="rounded-lg px-4 py-2 text-center border border-[rgba(42,42,42,1)]" style={{ backgroundColor: "rgba(17, 17, 19, 1)" }}>
            <p className="text-[rgba(212, 212, 216, 1)] text-sm font-[500]">{formatEducation(applicant.education)}</p>
            <p className="text-[rgba(212, 212, 216, 1)] text-sm font-[500]">{applicant.currentPosition} @ {applicant.currentCompany}</p>
          </div>

          <div
            className="rounded-lg px-3 pb-2 text-center border border-[rgba(42,42,42,1)]"
            style={{ background: "linear-gradient(90deg, rgba(10, 132, 255, 0.18) 0%, rgba(59, 59, 139, 0.25) 100%)" }}
          >
            <div className="text-[rgba(209,209,214,1)] text-sm font-normal">
              {applicant.strength.map((item, index) => (
                <span key={index} className="block mt-2 font-[500]">{item}</span>
              ))}
            </div>
          </div>

          <div
            className="rounded-lg px-3 pb-2 text-center border border-[rgba(42,42,42,1)]"
            style={{ background: "linear-gradient(90deg, rgba(209, 27, 30, 0.2) 0%, rgba(190, 114, 118, 0.2) 100%)" }}
          >
            <div className="text-[rgba(209,209,214,1)] text-sm font-normal">
              {applicant.weakness.map((item, index) => (
                <span key={index} className="block mt-2 font-[500]">{item}</span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-evenly w-full gap-2 flex-col [@media(min-width:1248px)]:flex-row">
            <button
              className={`bg-[rgba(59,130,246,1)] text-white rounded-md py-1 px-2 text-[17px] font-[700] h-min [@media(min-width:1248px)]:w-auto w-full ${isAccepted ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={handleAccept}
              disabled={isAccepted || acceptLoading}
            >
              {isAccepted ? 'Accepted' : acceptLoading ? 'Accepting...' : 'Accept'}
            </button>
            <button
              className="border border-[rgba(59,130,246,1)] text-[rgba(59,130,246,1)] rounded-md py-1 px-2 text-[17px] font-[700] h-min [@media(min-width:1248px)]:w-auto w-full"
              onClick={handleMoveToInterview}
              disabled={isInterviewed || interviewLoading}
            >
              {isInterviewed ? 'Interview' : interviewLoading ? 'Moving...' : 'Interview'}
            </button>
            <button
              className="text-[rgba(209,209,214,1)] text-[14px] font-[500] py-2 whitespace-nowrap [@media(min-width:1248px)]:w-auto w-full"
              onClick={handleNotSuitable}
              disabled={isNotSuitable || notSuitableLoading}
            >
              {isNotSuitable ? 'Not Suitable' : notSuitableLoading ? 'Processing...' : 'Not Interested'}
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
                    <h3 className="font-bold text-[18px] text-white mb-0 ml-3">Why <span className="text-[rgba(10,132,255,1)]">{applicant.name}</span> Fits</h3>
                    <div className="bg-[rgba(10,132,255,0.05)] rounded-lg p-3 border border-gray-400 border-opacity-20" style={{ boxShadow: "0px 4px 20px 0px #0A84FF26" }}>
                      <p className="text-[13px] text-white m-3">{whyYouFit}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.25} initial="hidden" animate="visible">
                  <div className="px-6 pb-4">
                    <h3 className="font-bold text-[18px] text-white mb-0 ml-3">AI Agent Conversation Summary</h3>
                    <div className="bg-[rgba(10,132,255,0.05)] rounded-lg p-3 border border-gray-400 border-opacity-20" style={{ boxShadow: "0px 4px 20px 0px #0A84FF26" }}>
                      <p className="text-[13px] text-white m-3">{aiSummary}</p>
                    </div>
                    <div className="flex justify-start mt-4 mb-4 gap-2">
                      <button 
                        className="bg-[rgba(10,132,255,1)] text-white font-bold text-lg leading-[140%] text-center rounded-lg w-[270px] h-[35px]" 
                        onClick={() => navigate(`/company/dashboard/${jobId}/applications/${applicant.id}`)}
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
                {existingFeedback && (
                  <motion.div variants={contentVariants} custom={0.5} initial="hidden" animate="visible">
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