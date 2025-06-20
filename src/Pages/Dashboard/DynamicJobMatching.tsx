import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Briefcase, Sparkles, CheckCircle, Bookmark } from "lucide-react";
import QuestionBox from "./QuestionBox";
import { jobServices } from "../../services/jobServices";
import { formatDistanceToNow } from "date-fns";
import JobCard, { JobCardProps } from "./InteractiveJobCard";
import {
  getUserProgress,
  getQuestionsForTier,
  submitAnswer,
  getAnswerHistory,
  QuestionResponseDto,
  UserProgressResponseDto,
  GetQuestionsResponseDto,
  AnswerResponseDto,
} from "../../services/questionServices";

interface Insight {
  id: string;
  questionText: string;
  text: string;
  category: string;
  tier: number;
}

interface BackendJob {
  id: string;
  title: string;
  company: string;
  companyDescription?:string;
  location: string;
  logoUrl?: string;
  category?: {
    id: string;
    categoryName: string;
  };
  employmentType: string;
  salaryMin?: number;
  salaryMax?: number;
  matchScore?: string;
  description: string;
  responsibilities: string;
  createdAt: string;
  matchExplanation?: {
    explanation?: string;
    overallScore?: number;
    skillsScore?: number;
    cultureScore?: number;
  };
  isSaved?: boolean;
  hasApplied?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 15, mass: 0.8 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
};

const mapJobToJobCardProps = async (job: BackendJob): Promise<JobCardProps> => {
  let jobDetails;
  let matchExplanation = job.matchExplanation?.explanation || "Your skills and preferences align with this role.";
  
  try {
    const [jobResponse, explanationResponse] = await Promise.all([
      jobServices.getJobById(job.id),
      jobServices.getMatchExplanation(job.id),
    ]);
    jobDetails = jobResponse.data;
    matchExplanation = explanationResponse.explanation || matchExplanation;
  } catch (error) {
    console.error(`Failed to fetch details for job ${job.id}:`, error);
    jobDetails = job;
  }

  const employmentTypeMap: Record<string, string> = {
    full_time: "Full-Time",
    part_time: "Part-Time",
    internship: "Internship",
    contract: "Contract",
  };
  const readableEmploymentType =
    employmentTypeMap[jobDetails.employmentType?.toLowerCase()] || jobDetails.employmentType;

  return {
    id: jobDetails.id,
    logo: jobDetails.company?.logoUrl || "  ",
    title: jobDetails.title,
    company: jobDetails.company?.companyName || job.company,
    location: jobDetails.location,
    tags: [jobDetails.category?.categoryName || "General", readableEmploymentType],
    salaryRange:
      jobDetails.salaryMin && jobDetails.salaryMax
        ? `$${Number(jobDetails.salaryMin) / 1000}k - $${Number(jobDetails.salaryMax) / 1000}k/yr`
        : "Not specified",
    matchPercentage: jobDetails.matchScore !== undefined ? Math.round(Number(jobDetails.matchScore)) || 0 : 0,
    description: jobDetails.description,
    responsibilities: jobDetails.responsibilities || "",
    jobType: readableEmploymentType,
    postedDate: `Posted ${formatDistanceToNow(new Date(jobDetails.createdAt), { addSuffix: true })}`,
    whyYouFit: "You are a great fit for this role because of your skills and preferences.",
    aiSummary: "This job matches your profile based on your skills and preferences.",
    fullJobDescription: jobDetails.description,
    fullResponsibilities: jobDetails.responsibilities || "",
    companyDescription: job.companyDescription || "No company description available.",
    isTargetedRecommendation: jobDetails.matchScore !== undefined ? Number(jobDetails.matchScore) > 40 : undefined,
    applyButtonText: "Apply",
    isSaved: jobDetails.isSaved ?? false,
    isApplied: jobDetails.hasApplied ?? false,
  };
};

export function DynamicJobMatching() {
  const [columnInsights, setColumnInsights] = useState<Insight[][]>([[], [], []]);
  const [columnQuestions, setColumnQuestions] = useState<(QuestionResponseDto | null)[]>([null, null, null]);
  const [availableQuestions, setAvailableQuestions] = useState<QuestionResponseDto[]>([]);
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<string>>(new Set());
  const [currentTier, setCurrentTier] = useState<number>(1);
  const [, setProfileCompletion] = useState<number>(0);
  const [matchedJobs, setMatchedJobs] = useState<JobCardProps[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [rejectedJobs, setRejectedJobs] = useState<string[]>([]);
  const [currentMobileQuestionIndex, setCurrentMobileQuestionIndex] = useState<number>(0);
  const jobsRef = useRef<HTMLDivElement>(null);

  const isValidUUID = (str: string): boolean => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const distributeQuestions = (questions: QuestionResponseDto[]) => {
    const filteredQuestions = questions.filter((q) => !answeredQuestionIds.has(q.id));
    const newColumnQuestions: (QuestionResponseDto | null)[] = [null, null, null];
    filteredQuestions.slice(0, 3).forEach((q, i) => {
      newColumnQuestions[i] = q;
    });
    setColumnQuestions(newColumnQuestions);
    setAvailableQuestions(filteredQuestions);
  };

  const fetchJobs = async () => {
    try {
      const response = await jobServices.getJobs({
        limit: 3,
        sortBy: 'relevance',
        useVectorSearch: true,
      });
      if (response?.data && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setMatchedJobs([]);
          return;
        } else if (response.data.length > 3) {
          console.warn("More than 3 jobs returned, truncating to 3.");
          response.data = response.data.slice(0, 3);
        }
        const jobs = await Promise.all(response.data.map(mapJobToJobCardProps));
        setMatchedJobs(jobs);
      } else {
        setMatchedJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setMatchedJobs([]);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const response = await jobServices.getMySavedJobs();
      if (response?.savedJobs && Array.isArray(response.savedJobs)) {
        setSavedJobs(response.savedJobs.map((sj: { job: { id: string } }) => sj.job.id));
      } else {
        setSavedJobs([]);
      }
    } catch (error) {
      console.error("Failed to fetch saved jobs:", error);
      setSavedJobs([]);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const response = await jobServices.getMyApplications();
      if (response?.applications && Array.isArray(response.applications)) {
        setAppliedJobs(response.applications.map((app: { job: { id: string } }) => app.job.id));
      } else {
        setAppliedJobs([]);
      }
    } catch (error) {
      console.error("Failed to fetch applied jobs:", error);
      setAppliedJobs([]);
    }
  };

  const fetchQuestions = async (tier: number) => {
    try {
      const response: GetQuestionsResponseDto = await getQuestionsForTier(tier);
      if (response.questions && Array.isArray(response.questions) && response.questions.length > 0) {
        distributeQuestions(response.questions);
      } else {
        console.warn(`No questions returned for tier ${tier}`);
        setAvailableQuestions([]);
        setColumnQuestions([null, null, null]);
      }
    } catch (error) {
      console.error(`Failed to fetch questions for tier ${tier}:`, error);
      setAvailableQuestions([]);
      setColumnQuestions([null, null, null]);
    }
  };

  const fetchProgress = async () => {
    try {
      const progress: UserProgressResponseDto = await getUserProgress();
      const tier = progress.currentTier || 1;
      setCurrentTier(tier);

      if (progress.tiers && Array.isArray(progress.tiers)) {
        const currentTierData = progress.tiers[tier - 1];
        const tierCompletion =
          currentTierData && currentTierData.questionsRequiredToComplete > 0
            ? (currentTierData.questionsAnsweredInTier / currentTierData.questionsRequiredToComplete) * 100
            : 0;
        setProfileCompletion(tierCompletion);
        if (currentTierData.isCompleted && tier < 5) {
          setCurrentTier(tier + 1);
          setProfileCompletion(0);
          setColumnInsights([[], [], []]);
          setAnsweredQuestionIds(new Set());
          await fetchQuestions(tier + 1);
          await fetchAnswerHistory();
          await fetchJobs();
        } else {
          await fetchQuestions(tier);
          await fetchAnswerHistory();
        }
      } else {
        setProfileCompletion(0);
        await fetchQuestions(1);
        await fetchAnswerHistory();
      }
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      setProfileCompletion(0);
      setCurrentTier(1);
      await fetchQuestions(1);
      await fetchAnswerHistory();
    }
  };

  const fetchAnswerHistory = async () => {
    try {
      const history: AnswerResponseDto[] = await getAnswerHistory(currentTier);
      if (!Array.isArray(history) || history.length === 0) {
        console.warn(`No answer history for tier ${currentTier}`);
        setAnsweredQuestionIds(new Set());
        setColumnInsights([[], [], []]);
        return;
      }

      // Collect all tiers from answer history
      const tiers = [...new Set(history.map((answer) => answer.tierWhenAnswered))];

      // Fetch questions for all relevant tiers
      let allQuestions: QuestionResponseDto[] = [];
      for (const tier of tiers) {
        const response: GetQuestionsResponseDto = await getQuestionsForTier(tier);
        if (response.questions && Array.isArray(response.questions)) {
          allQuestions = [...allQuestions, ...response.questions];
        }
      }

      // Build question map, prioritizing question data from answer history
      const questionMap = new Map<string, QuestionResponseDto>();
      history.forEach((answer) => {
        if (answer.question && answer.questionId) {
          questionMap.set(answer.questionId, answer.question);
        }
      });
      allQuestions.forEach((q) => {
        if (!questionMap.has(q.id)) {
          questionMap.set(q.id, q);
        }
      });

      const newAnsweredQuestionIds = new Set<string>();
      const newInsights: Insight[][] = [[], [], []];

      history.forEach((answer, index) => {
        if (!answer.questionId || !answer.selectedOption) {
          console.warn(`Invalid answer data for tier ${answer.tierWhenAnswered}:`, answer);
          return;
        }

        const question = questionMap.get(answer.questionId);
        if (!question) {
          console.warn(`Question ${answer.questionId} not found in question map`);
          return;
        }

        newAnsweredQuestionIds.add(answer.questionId);
        const insight: Insight = {
          id: answer.questionId,
          questionText: question.questionText,
          text: `${answer.selectedOption.insight || "No insight available"}`,
          category: question.insightCategory || "preferences",
          tier: answer.tierWhenAnswered,
        };
        newInsights[index % 3].push(insight);
      });

      setAnsweredQuestionIds(newAnsweredQuestionIds);
      setColumnInsights(newInsights);
    } catch (error) {
      console.error("Failed to fetch answer history:", error);
      setAnsweredQuestionIds(new Set());
      setColumnInsights([[], [], []]);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([fetchJobs(), fetchSavedJobs(), fetchAppliedJobs(), fetchProgress()]);
    };
    initialize();
  }, []);

  const handleAnswer = async (questionId: string, optionId: string, optionText: string, columnIndex: number) => {
    try {
      if (!isValidUUID(questionId)) throw new Error(`Invalid questionId UUID: ${questionId}`);
      if (!isValidUUID(optionId)) throw new Error(`Invalid optionId UUID: ${optionId}`);

      const payload = { questionId, selectedOptionId: optionId };
      await submitAnswer(payload);

      setAnsweredQuestionIds((prev) => new Set(prev).add(questionId));
      const question = availableQuestions.find((q) => q.id === questionId);
      if (!question) {
        console.warn(`Question ${questionId} not found`);
        return;
      }

      // Fetch the latest answer to get the insight
      const latestAnswer = (await getAnswerHistory(currentTier)).find((a) => a.questionId === questionId);
      console.log("Latest answer for question:", latestAnswer);
      const insightText = latestAnswer?.selectedOption?.insight || "No insight available";

      const insight: Insight = {
        id: questionId,
        questionText: question.questionText,
        text: insightText,
        category: question.insightCategory || "preferences",
        tier: currentTier,
      };

      setColumnInsights((prev) => {
        const newInsights = [...prev];
        newInsights[columnIndex] = [...newInsights[columnIndex], insight];
        return newInsights;
      });

      setColumnQuestions((prev) => {
        const newQuestions = [...prev];
        const nextQuestionIndex = availableQuestions.findIndex((q) => q.id === questionId) + 1;
        if (nextQuestionIndex < availableQuestions.length) {
          newQuestions[columnIndex] = availableQuestions[nextQuestionIndex];
          setAvailableQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
        } else {
          newQuestions[columnIndex] = null;
          setAvailableQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== questionId));
        }
        return newQuestions;
      });

      if (window.innerWidth < 640) {
        setCurrentMobileQuestionIndex((prev) => prev + 1);
      }

      const progress = await getUserProgress();
      setCurrentTier(progress.currentTier || 1);
      if (progress.tiers && Array.isArray(progress.tiers)) {
        const currentTierData = progress.tiers[progress.currentTier - 1];
        const tierCompletion =
          currentTierData && currentTierData.questionsRequiredToComplete > 0
            ? (currentTierData.questionsAnsweredInTier / currentTierData.questionsRequiredToComplete) * 100
            : 0;
        setProfileCompletion(tierCompletion);
        if (currentTierData.isCompleted && progress.currentTier < 5) {
          setCurrentTier(progress.currentTier + 1);
          setProfileCompletion(0);
          setColumnInsights([[], [], []]);
          setAnsweredQuestionIds(new Set());
          await fetchQuestions(progress.currentTier + 1);
          await fetchAnswerHistory();
          await fetchJobs();
        } else {
          await fetchQuestions(progress.currentTier);
          await fetchAnswerHistory();
          await fetchJobs();
        }
      } else {
        setProfileCompletion(0);
        await fetchQuestions(1);
        await fetchAnswerHistory();
        await fetchJobs();
      }
    } catch (error) {
      console.error("Failed to submit answer:", {
        message: (error as Error)?.message,
        response: (typeof error === "object" && error !== null && "response" in error && typeof (error as { response?: { data?: unknown } }).response === "object"
          ? (error as { response?: { data?: unknown } }).response?.data
          : undefined),
        questionId,
        optionId,
        optionText,
        columnIndex,
      });
    }
  };

  const getNextJob = async () => {
    try {
      const response = await jobServices.getJobs({
        limit: 1,
        sortBy: 'relevance',
        useVectorSearch: true,
      });
      if (response?.jobs && Array.isArray(response.jobs) && response.jobs.length > 0) {
        const availableJobs = response.jobs.filter(
          (job: BackendJob) =>
            !savedJobs.includes(job.id) &&
            !appliedJobs.includes(job.id) &&
            !rejectedJobs.includes(job.id) &&
            !matchedJobs.some((j) => j.id === job.id)
        );
        return availableJobs.length > 0 ? await mapJobToJobCardProps(availableJobs[0]) : undefined;
      }
      return undefined;
    } catch (error) {
      console.error("Failed to get next job:", error);
      return undefined;
    }
  };

  const handleJobAction = async (
    jobId: string,
    action: "save" | "apply" | "reject"
  ) => {
    try {
      if (action === "save") {
        await jobServices.saveJob(jobId);
        setSavedJobs((prev) => [...prev, jobId]);
      } else if (action === "apply") {
        await jobServices.applyToJob(jobId);
        setAppliedJobs((prev) => [...prev, jobId]);
        setMatchedJobs((prev) => {
          const filteredJobs = prev.filter((job) => job.id !== jobId);
          getNextJob().then((nextJob) => {
            if (nextJob) setMatchedJobs([...filteredJobs, nextJob]);
          });
          return filteredJobs;
        });
      } else if (action === "reject") {
        setRejectedJobs((prev) => [...prev, jobId]);
        setMatchedJobs((prev) => {
          const filteredJobs = prev.filter((job) => job.id !== jobId);
          getNextJob().then((nextJob) => {
            if (nextJob) setMatchedJobs([...filteredJobs, nextJob]);
          });
          return filteredJobs;
        });
      }
      await fetchJobs();
    } catch (error) {
      console.error(`Failed to ${action} job:`, error);
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="flex justify-center items-center mb-3"
      >
        <div className="space-y-0 flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold">Jobs Dashboard</h1>
          <p className="text-muted-foreground">Answer questions to unlock better matches, then apply in one click</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
      >
      </motion.div>
      <div className="mb-12 px-4 mt-3">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="text-xl font-semibold mb-6 flex items-center"
        >
          Answer Questions
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 gap-6"
        >
          {window.innerWidth < 640 ? (
            (() => {
              const currentQuestion = availableQuestions[currentMobileQuestionIndex];
              if (!currentQuestion || answeredQuestionIds.has(currentQuestion.id)) return null;
              return (
                <motion.div
                  key={currentQuestion.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <QuestionBox
                    question={currentQuestion}
                    onAnswer={(optionId, optionText) =>
                      handleAnswer(currentQuestion.id, optionId, optionText, 0)
                    }
                  />
                </motion.div>
              );
            })()
          ) : (
            [0, 1, 2].map((columnIndex) => (
              <div key={`column-${columnIndex}`} className="space-y-4 min-h-[200px] w-[95%] ">
                <AnimatePresence mode="wait">
                  {columnInsights[columnIndex].map((insight, idx) => (
                    <motion.div
                      key={`insight-${insight.id}-${idx}`}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="mb-2"
                    >
                      <Card className="dark:bg-[rgba(17, 8,21,1)] bg-[#202536] border-2 border-blue-500 items-center custom-bg-dark">
                        <CardContent className="px-2 py-1 dark:bg-[rgba(17, 8,21,1)] bg-[#202536] custom-bg-dark">
                            <p className="text-sm dark:text-gray-300 text-gray-300 bg-[#202536] items-center text-center custom-bg-dark">
                              {insight.text}
                            </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <AnimatePresence mode="wait">
                  {columnQuestions[columnIndex] && !answeredQuestionIds.has(columnQuestions[columnIndex]!.id) && (
                    <motion.div
                      key={columnQuestions[columnIndex]!.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <QuestionBox
                        question={columnQuestions[columnIndex]!}
                        onAnswer={(optionId, optionText) =>
                          handleAnswer(columnQuestions[columnIndex]!.id, optionId, optionText, columnIndex)
                        }
                      />
                    </motion.div>
                  )}
                  {!columnQuestions[columnIndex] && columnInsights[columnIndex].length > 0 && (
                    <motion.div
                      key={`placeholder-${columnIndex}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 0.5, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="bg-jobcardsecondary rounded-lg p-6 border border-primary/10 h-48 flex items-center justify-center"
                    >
                      <p className="text-muted-foreground text-center">All questions completed!</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
          {availableQuestions.length === 0 && columnQuestions.every((q) => q === null) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="text-center py-12 bg-gradient-to-br from-background to-primary/5 rounded-lg border border-primary/10 col-span-full"
            >
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No questions available</h3>
              <p className="text-muted-foreground text-center">
                Please try again later or contact support.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
      <div ref={jobsRef} className="mt-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col md:flex-row-reverse md:items-center justify-between mb-6 mt-6"
        >
          <div className="flex items-center gap-4 mt-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Briefcase className="h-5 w-5 text-primary mr-2" />Your Jobs
            </h2>
            <p className="text-muted-foreground"></p>
          </div>
        </motion.div>
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="flex justify-center gap-2">
            <TabsTrigger value="all">All Jobs</TabsTrigger>
            <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
            <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {matchedJobs.map((job, index) => (
                  <motion.div key={job.id} variants={itemVariants} initial="hidden" animate="visible" exit="exit">
                    <JobCard
                      {...job}
                      onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                      delay={index * 0.1}
                      expanded={expandedJob === job.id}
                      onAction={(action, jobId) => handleJobAction(jobId, action)}
                      isSaved={savedJobs.includes(job.id)}
                      isApplied={appliedJobs.includes(job.id)}
                      nextJob={getNextJob}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {matchedJobs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center py-12 bg-gradient-to-br from-background to-primary/5 rounded-lg border border-primary/10 col-span-3"
                >
                  <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No jobs found</h3>
                  <p className="text-muted-foreground text-center">Answer a few questions to unlock your job matches</p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
          <TabsContent value="saved" className="mt-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {matchedJobs
                  .filter((job) => savedJobs.includes(job.id))
                  ?.map((job, index) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <JobCard
                        {...job}
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        delay={index * 0.1}
                        expanded={expandedJob === job.id}
                        onAction={(action, jobId) => handleJobAction(jobId, action)}
                        isSaved={true}
                        isApplied={appliedJobs.includes(job.id)}
                        nextJob={getNextJob}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
              {savedJobs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center py-12 bg-gradient-to-br from-background to-primary/5 rounded-lg border border-primary/10 col-span-3"
                >
                  <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No saved jobs</h3>
                  <p className="text-muted-foreground text-center">
                    Answer a few questions to unlock your job matches
                  </p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
          <TabsContent value="applied" className="mt-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {matchedJobs
                  .filter((job) => appliedJobs.includes(job.id))
                  .map((job, index) => (
                    <motion.div
                      key={job.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <JobCard
                        {...job}
                        onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                        delay={index * 0.1}
                        expanded={expandedJob === job.id}
                        onAction={(action, jobId) => handleJobAction(jobId, action)}
                        isSaved={savedJobs.includes(job.id)}
                        isApplied={true}
                        nextJob={getNextJob}
                      />
                    </motion.div>
                  ))}
              </AnimatePresence>
              {appliedJobs.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className="text-center py-12 bg-gradient-to-br from-background to-primary/5 rounded-lg border border-primary/10 col-span-3"
                >
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No applied jobs</h3>
                  <p className="text-muted-foreground text-center">Answer a few questions to unlock your job matches</p>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default DynamicJobMatching;