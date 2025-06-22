import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import JobActionModal from "../../components/Modals/JobActionModal";

export interface JobCardProps {
  id: string;
  logo: string;
  title: string;
  company: string;
  location: string;
  tags: string[];
  salaryRange: string;
  matchPercentage: number;
  description: string;
  responsibilities: string;
  jobType: string;
  postedDate: string;
  whyYouFit: string;
  aiSummary: string;
  fullJobDescription: string;
  fullResponsibilities: string;
  companyDescription: string;
  isTargetedRecommendation?: boolean;
  applyButtonText?: string;
  onClick?: () => void;
  delay?: number;
  expanded?: boolean;
  onAction?: (action: "save" | "apply" | "reject", jobId: string, payload?: { coverLetter?: string; notes?: string }) => void;
  isSaved: boolean;
  isApplied: boolean;
  onApplyComplete?: () => void;
  nextJob?: () => Promise<JobCardProps | undefined>;
}

const modalVariants: Variants = {
  hidden: { scale: 1, y: 0, borderRadius: "12px", opacity: 0 },
  visible: {
    scale: 1,
    y: -10,
    borderRadius: "0px",
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeInOut",
      scale: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
        times: [0, 0.5, 1],
        values: [1, 1.02, 1],
      },
      y: { type: "spring", stiffness: 200, damping: 20 },
      borderRadius: { duration: 0.35, ease: "easeInOut" },
    },
  },
  exit: {
    scale: 0.98,
    y: 0,
    borderRadius: "12px",
    opacity: 0,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.85, transition: { duration: 0.35, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeInOut" } },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut", delay },
  }),
};

const buttonVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 15,
    },
  },
};

const appliedTagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      stiffness: 400,
      damping: 20,
    },
  },
};

const newJobCardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
      delay: 0.7,
    },
  },
};

const JobCard = ({
  id,
  logo,
  title,
  company,
  location,
  tags,
  salaryRange,
  matchPercentage,
  description,
  responsibilities,
  postedDate,
  whyYouFit,
  aiSummary,
  fullJobDescription,
  fullResponsibilities,
  companyDescription,
  isTargetedRecommendation = false,
  applyButtonText = "Apply",
  onClick,
  onAction,
  isSaved,
  isApplied,
  onApplyComplete,
  nextJob,
}: JobCardProps) => {
  const [showPopup, setShowPopup] = useState(false);
  const [readMoreJobDesc, setReadMoreJobDesc] = useState(false);
  const [readMoreResp, setReadMoreResp] = useState(false);
  const [readMoreCompanyDesc, setReadMoreCompanyDesc] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [cardVisible, setCardVisible] = useState(true);
  const [showAppliedTag, setShowAppliedTag] = useState(false);
  const [showNextCard, setShowNextCard] = useState(false);
  const [questionShifted, setQuestionShifted] = useState(false);
  const [nextJobData, setNextJobData] = useState<JobCardProps | undefined>(undefined);
  const [modalState, setModalState] = useState<{ open: boolean; action: "save" | "apply" }>({ open: false, action: "save" });

  const hasValidImage = (imageUrl?: string | null): boolean => {
    return imageUrl !== null && 
           imageUrl !== undefined && 
           imageUrl.trim() !== "" && 
           imageUrl !== " ";
  };

  const handleCardClick = () => {
    setShowPopup(true);
    if (onClick) onClick();
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setReadMoreJobDesc(false);
    setReadMoreResp(false);
    setReadMoreCompanyDesc(false);
  };

  const handleAction = (action: "save" | "apply" | "reject") => {
    if (action === "save" || action === "apply") {
      setModalState({ open: true, action });
    } else if (action === "reject" && onAction) {
      onAction(action, id);
    }
  };

  const handleModalClose = (payload: { coverLetter?: string; notes?: string } | null) => {
    if (modalState.action && onAction) {
      if (modalState.action === "apply" && !isApplied) {
        setIsApplying(true);
        setTimeout(() => {
          setCardVisible(false);
        }, 300);
        setTimeout(() => {
          setQuestionShifted(true);
          setShowAppliedTag(true);
        }, 500);
        setTimeout(async () => {
          setShowAppliedTag(false);
          setQuestionShifted(false);
          if (nextJob) {
            try {
              const job = await nextJob();
              setNextJobData(job);
              if (job) {
                setShowNextCard(true);
              }
            } catch (error) {
              console.error("Failed to fetch next job:", error);
            }
          }
          setIsApplying(false);
          onAction(modalState.action, id, payload || undefined);
          if (onApplyComplete && modalState.action === "apply") {
            onApplyComplete();
          }
          setModalState({ open: false, action: "save" });
        }, 800);
      } else {
        onAction(modalState.action, id, payload || undefined);
        setModalState({ open: false, action: "save" });
      }
    } else {
      setModalState({ open: false, action: "save" });
    }
  };

  useEffect(() => {
    return () => {
      setShowNextCard(false);
      setNextJobData(undefined);
    };
  }, []);

  return (
    <>
      <div className="relative">
        <AnimatePresence>
          {showAppliedTag && (
            <motion.div
              key="applied-tag"
              className="bg-green-100 border border-green-300 rounded-lg p-3 mb-4 text-green-700"
              variants={appliedTagVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <span className="font-medium">Applied Successfully</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative"
          animate={{ y: questionShifted ? 15 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          whileTap={{ scale: 0.97, transition: { duration: 0.08 } }}
        >
          <AnimatePresence>
            {cardVisible && (
              <motion.div
                key="current-card"
                className="bg-jobcard1 rounded-xl p-6 pt-0 mt-0 relative shadow cursor-pointer border border-[#0A84FF66]"
                onClick={handleCardClick}
                initial={{ opacity: 1, x: 0 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                }}
                exit={{
                  opacity: 0,
                  x: -50,
                  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                }}
              >
                <div className="flex items-center gap-4 justify-around">
                  <div className="rounded-md p-1 pt-4 w-24 h-24 flex items-center justify-items-start">
                    {hasValidImage(logo) ? (
                      <div className="p-1 sm:p-2 rounded-lg w-20 h-20 flex place-items-start justify-center flex-shrink-0">
                        <img 
                          src={logo!} 
                          width={96} 
                          height={96} 
                          className="object-contain rounded-md w-full h-full" 
                          alt={`${logo}'s photo`}
                        />
                      </div>
                    ) : (
                      <div className="p-1 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 text-center mt-2 mr-3">
                    <h3 className="font-bold text-xl text-jobcardtext flex justify-center">{title}</h3>
                    <p className="text-sm text-jobcardforeground flex justify-center">
                      {company} • {location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mb-2 justify-end">
                  {tags.map((tag, index) => (
                    <span key={index} className="bg-jobcardsecondary text-jobcardforeground text-xs rounded-md px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end items-center mb-4 gap-3 mt-2">
                  {salaryRange && salaryRange !== "Not specified" && (
                  <span className="text-jobcardforeground bg-jobcardsecondary text-xs rounded-md px-3 py-1">{salaryRange}</span>
                  )}
                  <span className="bg-primary text-white text-xs rounded-md px-2 py-1">{Math.round(matchPercentage)}% Match</span>
                </div>
                <div className="bg-jobcardsecondary1 rounded-lg p-3 mb-4 border border-gray-400 border-opacity-20">
                  <p className="text-sm text-jobcardtext">{description}</p>
                </div>
                <div className="bg-jobcardsecondary1 rounded-lg p-3 mb-4 border border-gray-400 border-opacity-20">
                  <p className="text-xs text-jobcardforeground">
                    <span className="text-xs font-medium text-jobcardtext mb-1">What You'll Do: </span>
                    {responsibilities}
                  </p>
                </div>
                <div className="flex flex-col justify-between gap-3 [@media(min-width:1248px)]:flex-row" onClick={(e) => e.stopPropagation()} px-3>
                  <Button
                    className={`
                      bg-primary text-white rounded-[6px] py-2 px-6
                      [@media(min-width:1248px)]:w-auto w-full h-[35px]
                      font-bold text-[18px]
                      text-center align-middle
                      transition-all duration-300
                      ${isApplying ? "opacity-50 cursor-default" : ""}
                    `}
                    onClick={() => handleAction("apply")}
                    disabled={isApplied || isApplying}
                  >
                    {isApplied ? "Applied" : applyButtonText}
                  </Button>
                  <button
                    className={`
                      [@media(min-width:1248px)]:w-auto w-full h-[35px]
                      border ${isSaved ? "border-primary bg-primary/10" : "border-primary"}
                      text-primary
                      rounded-[6px]
                      w-min-[150px] px-6 
                      font-bold text-[18px] leading-[140%]
                      text-center align-middle
                      transition-all duration-300
                    `}
                    onClick={() => handleAction("save")}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <button className="text-jobcardforeground text-[14px] [@media(min-width:1248px)]:w-auto w-full py-2" onClick={() => handleAction("reject")}>
                    Not Interested
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {showNextCard && nextJobData && (
            <motion.div
              key="next-card"
              className="absolute top-0 left-0 w-full"
              variants={newJobCardVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="bg-jobcard rounded-xl p-6 relative shadow cursor-pointer">
                <div className="flex items-center gap-4 justify-around">
                  <div className="rounded-md p-1 w-24 h-24 flex items-center justify-center">
                    {hasValidImage(nextJobData.logo) ? (
                      <div className="p-1 sm:p-2 rounded-lg w-20 h-20 flex items-start justify-center flex-shrink-0">
                        <img 
                          src={nextJobData.logo!} 
                          width={96} 
                          height={96} 
                          className="object-contain rounded-md w-full h-full" 
                          alt={`${nextJobData.logo}'s photo`}
                        />
                      </div>
                    ) : (
                      <div className="p-1 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-jobcardtext flex justify-center">{nextJobData.title}</h3>
                    <p className="text-sm text-jobcardforeground flex justify-center">
                      {nextJobData.company} • {nextJobData.location}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 mb-2 justify-end">
                  {nextJobData.tags.map((tag, index) => (
                    <span key={index} className="bg-jobcardsecondary text-jobcardforeground text-xs rounded-md px-3 py-1">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end items-center mb-4 gap-3 mt-0">
                  {nextJobData.salaryRange && nextJobData.salaryRange !== "Not specified" && (
                  <span className="text-jobcardforeground bg-jobcardsecondary text-xs rounded-md px-3 py-1">{nextJobData.salaryRange}</span>
                  )}
                  <span className="bg-primary text-white text-xs rounded-md px-2 py-1">{Math.round(nextJobData.matchPercentage)}% Match</span>
                </div>
                <div className="bg-jobcardsecondary rounded-lg p-3 mb-4 border border-gray-400 border-opacity-20">
                  <p className="text-sm text-jobcardtext">{nextJobData.description}</p>
                </div>
                <div className="bg-jobcardsecondary rounded-lg p-3 mb-4 border border-gray-400 border-opacity-20">
                  <p className="text-xs text-jobcardforeground">
                    <span className="text-xs font-medium text-jobcardtext mb-1">What You'll Do: </span>
                    {nextJobData.responsibilities}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    className="bg-primary text-white rounded-md py-2 px-6 font-bold flex-1"
                    onClick={() => handleAction("apply")}
                    disabled={nextJobData.isApplied || isApplying}
                  >
                    {nextJobData.isApplied ? "Applied" : nextJobData.applyButtonText || "Apply"}
                  </Button>
                  <button
                    className={`border ${nextJobData.isSaved ? "border-primary bg-primary/10" : "border-primary"} text-primary rounded-md py-2 px-6 text-sm font-bold flex-1`}
                    onClick={() => handleAction("save")}
                  >
                    {nextJobData.isSaved ? "Saved" : "Save"}
                  </button>
                  <button
                    className="text-jobcardforeground text-sm py-2 whitespace-nowrap"
                    onClick={() => handleAction("reject")}
                  >
                    Not Interested
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
                className="bg-jobcard p-6 w-full max-w-4xl h-[90vh] overflow-y-auto relative border border-blue-500 rounded-2xl shadow-[0px_0px_20px_0px_#0A84FF33] no-scrollbar"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleClosePopup}
                  className="absolute top-4 right-4 text-jobcardforeground hover:text-white"
                  title="Close"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
                <motion.div variants={contentVariants} custom={0.15} initial="hidden" animate="visible">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-md p-1 w-24 h-24 flex items-center justify-start">
                        {hasValidImage(logo) ? (
                          <div className="p-1 sm:p-2 rounded-lg w-32 h-32 flex items-center justify-center flex-shrink-0 flex-col mb-0">
                            <img 
                              src={logo!} 
                              width={96} 
                              height={96} 
                              className="object-contain rounded-md w-full h-full" 
                              alt={`${logo}'s photo`}
                            />
                            <div>&nbsp;</div>
                          </div>
                        ) : (
                          <div className="p-1 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex-1 text-center mt-2 mb-3">
                        <h2 className="font-bold text-3xl text-jobcardtext">{title}</h2>
                        <p className="text-sm text-jobcardforeground">
                          {company} • {location}
                        </p>
                      </div>
                      <div className="w-24"></div>
                    </div>
                    <div className="flex justify-center items-center gap-7 mt-0 flex-wrap">
                      {salaryRange && salaryRange !== "Not specified" && (
                      <span className="text-jobcardforeground bg-jobcardsecondary text-xs rounded-md px-3 py-1 min-w-[80px] text-center">{salaryRange}</span>
                      )}
                      {tags.map((tag, index) => (
                        <span key={index} className="bg-jobcardsecondary text-jobcardforeground text-xs rounded-md px-3 py-1 min-w-[80px] text-center">
                          {tag}
                        </span>
                      ))}
                      <span className="text-jobcardforeground text-sm min-w-[80px] text-center">{postedDate}</span>
                      <span className="bg-primary text-white text-xs rounded-md px-2 py-1 min-w-[80px] text-center">{Math.round(matchPercentage)}% Match</span>
                      {isTargetedRecommendation && (
                        <span className="bg-green-500 text-white text-xs rounded-md px-2 py-1 min-w-[80px] text-center">Targeted</span>
                      )}
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.2} initial="hidden" animate="visible">
                  <div className="px-6 pb-4">
                    <h3 className="font-bold text-[18px] text-jobcardtext mb-0 ml-3">Why You Fit</h3>
                    <div className="bg-jobcardsummary rounded-lg p-3 border border-gray-400 border-opacity-20" style={{ boxShadow: "0px 4px 20px 0px #0A84FF26" }}>
                      <p className="text-sm text-jobcardtext m-3">{whyYouFit}</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.25} initial="hidden" animate="visible">
                  <div className="px-6 pb-4">
                    <h3 className="font-bold text-[18px] text-jobcardtext mb-0 ml-3">AI Agent Conversation Summary</h3>
                    <div className="bg-jobcardsummary rounded-lg p-3 border border-gray-400 border-opacity-20" style={{ boxShadow: "0px 4px 20px 0px #0A84FF26" }}>
                      <p className="text-sm text-jobcardtext m-3">{aiSummary}</p>
                    </div>
                    <hr className="mt-3 border-blue-500 border-opacity-100" />
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.3} initial="hidden" animate="visible">
                  <div className="px-6 pb-4">
                    <h3 className="font-bold text-[18px] text-jobcardtext mb-0 ml-3">Job Description</h3>
                    <div className="bg-jobcardsummary2 rounded-lg p-3 border border-gray-400 border-opacity-20">
                      <p className="text-sm text-jobcardtext m-1">
                        {readMoreJobDesc ? fullJobDescription : fullJobDescription?.split(" ").slice(0, 15).join(" ") + "..."}
                        <button
                          className="text-primary text-sm mt-0 underline italic"
                          onClick={() => setReadMoreJobDesc(!readMoreJobDesc)}
                        >
                          {readMoreJobDesc ? "Read Less" : "Read More"}
                        </button>
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.35} initial="hidden" animate="visible">
                  <div className="px-6 pb-4">
                    <h3 className="font-bold text-[18px] text-jobcardtext mb-0 ml-3">Responsibilities</h3>
                    <div className="bg-jobcardsummary2 rounded-lg p-3 border border-gray-400 border-opacity-20">
                      <p className="text-sm text-jobcardtext m-1">
                        {readMoreResp ? fullResponsibilities : fullResponsibilities?.split(" ").slice(0, 15).join(" ") + "..."}
                        <button
                          className="text-primary text-sm mt-0 underline italic"
                          onClick={() => setReadMoreResp(!readMoreResp)}
                        >
                          {readMoreResp ? "Read Less" : "Read More"}
                        </button>
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={contentVariants} custom={0.4} initial="hidden" animate="visible">
                  <div className="px-6 pb-6">
                    <h3 className="font-bold text-[18px] text-jobcardtext mb-0 ml-3">Company Description</h3>
                    <div className="bg-jobcardsummary2 rounded-lg p-3 border border-gray-400 border-opacity-20">
                       <p className="text-sm text-jobcardtext m-1">
                        {readMoreCompanyDesc ? companyDescription : companyDescription?.split(" ").slice(0, 15).join(" ") + "..."}
                        <button
                          className="text-primary text-sm mt-0 underline italic"
                          onClick={() => setReadMoreCompanyDesc(!readMoreCompanyDesc)}
                        >
                          {readMoreCompanyDesc ? "Read Less" : "Read More"}
                        </button>
                      </p>
                    </div>
                  </div>
                </motion.div>
                <motion.div variants={buttonVariants} initial="hidden" animate="visible" className="px-6 pb-6 flex justify-center gap-20">
                  <Button
                    className={`bg-primary text-white rounded-[6px] py-2 px-6 font-bold text-xl leading-[140%] text-center w-auto h-[35px] shadow-[0_0_10px_rgba(59,130,246,0.5)]
                      ${isApplying ? "opacity-50 cursor-default" : ""}`}
                    onClick={() => handleAction("apply")}
                    disabled={isApplied || isApplying}
                  >
                    {isApplied ? "Applied" : applyButtonText}
                  </Button>
                  <button
                    className={`border ${isSaved ? "border-primary bg-primary/10" : "border-primary"} text-primary rounded-[6px] px-6 font-bold text-xl leading-none text-center w-[98px] h-[35px] flex items-center justify-center`}
                    onClick={() => handleAction("save")}
                  >
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <button
                    className="text-jobcardforeground text-sm py-2 w-[150px] text-center"
                    onClick={() => handleAction("reject")}
                  >
                    Not Interested
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <JobActionModal
        open={modalState.open}
        onClose={handleModalClose}
        action={modalState.action}
        jobTitle={title}
      />
    </>
  );
};

export default JobCard;