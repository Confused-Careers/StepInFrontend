import { useState, useEffect, useRef } from "react";
import React from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Briefcase, Sparkles } from "lucide-react";
import { toast } from "sonner";
import QuestionBox from "./QuestionBox";
import { jobServices } from "../../services/jobServices";
import { formatDistanceToNow } from "date-fns";
import JobCard, { JobCardProps } from "./InteractiveJobCard";
import { ProfileCompletionModal } from "@/components/Modals/ProfileCompletionModal";
import axios from "axios";
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
  jobId?: string; // Some APIs return jobId instead of id
  title: string;
  company: string | {
    id: string;
    name: string;
    logo?: string | null;
  };
  companyDescription?: string;
  location: string;
  logoUrl?: string;
  category?: {
    id: string;
    categoryName: string;
  };
  employmentType: string;
  experienceLevel?: string;
  isRemote?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  matchScore?: number; // Changed from string to number to match API response
  description?: string;
  responsibilities?: string;
  createdAt?: string;
  payPeriod?: string;
  matchExplanation?: {
    explanation?: string;
    overallScore?: number;
    skillsScore?: number;
    cultureScore?: number;
  };
  explanation?: string; // Top-level explanation from API
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
  // Use jobId if available, otherwise fall back to id
  const jobIdentifier = job.jobId || job.id;
  let jobDetails;

  try {
    const jobResponse = await jobServices.getJobById(jobIdentifier);
    jobDetails = jobResponse.data;
  } catch (error) {
    console.error(`Failed to fetch details for job ${jobIdentifier}:`, error);
    jobDetails = job;
  }

  const employmentTypeMap: Record<string, string> = {
    full_time: "Full-Time",
    part_time: "Part-Time",
    internship: "Internship",
    contract: "Contract",
  };

  // Handle salary from either format
  let salary = "Unpaid";
  if (job.salaryRange) {
    salary = `$${job.salaryRange.min.toLocaleString()} - $${job.salaryRange.max.toLocaleString()}/${job.salaryRange.currency}`;
  } else if (jobDetails.salaryMin && jobDetails.salaryMax) {
    const min = parseFloat(String(jobDetails.salaryMin));
    const max = parseFloat(String(jobDetails.salaryMax));
    const period = jobDetails.payPeriod || "mo";
    salary = `$${min.toLocaleString()} - $${max.toLocaleString()}/${period}`;
  }

  const readableEmploymentType =
    employmentTypeMap[jobDetails.employmentType?.toLowerCase()] || jobDetails.employmentType || job.employmentType;

  // Handle company object that can be either string or object
  const companyName = typeof job.company === 'object' ? job.company.name : (jobDetails.company?.companyName || job.company);
  const companyLogo = typeof job.company === 'object' ? job.company.logo : (jobDetails.company?.logoUrl || jobDetails.logoUrl);

  return {
    id: jobIdentifier,
    logo: companyLogo || "  ",
    title: jobDetails.title || job.title,
    company: companyName,
    location: jobDetails.location || job.location,
    tags: [jobDetails.company?.industry || "General", readableEmploymentType],
    salary,
    salaryRange: salary,
    matchPercentage: job.matchScore || (jobDetails.matchScore !== undefined ? Math.round(Number(jobDetails.matchScore)) : 0),
    description: jobDetails.description || job.description || "",
    responsibilities: jobDetails.responsibilities || job.responsibilities || "",
    jobType: readableEmploymentType,
    postedDate: jobDetails.createdAt ? `Posted ${formatDistanceToNow(new Date(jobDetails.createdAt), { addSuffix: true })}` : "Recently posted",
    whyYouFit: "", // Will be loaded on card click
    aiSummary: "This job matches your profile based on your skills and preferences.",
    fullJobDescription: jobDetails.description || job.description || "",
    fullResponsibilities: jobDetails.responsibilities || job.responsibilities || "",
    companyDescription: job.companyDescription || jobDetails.company?.description || "No company description available.",
    isTargetedRecommendation: job.matchScore ? job.matchScore > 40 : undefined,
    applyButtonText: "Apply",
    isSaved: jobDetails.isSaved ?? job.isSaved ?? false,
    isApplied: jobDetails.hasApplied ?? job.hasApplied ?? false,
  };
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">Please try again or contact support.</p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function DynamicJobMatching() {
  const [columnInsights, setColumnInsights] = useState<Insight[]>([]);
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const jobsRef = useRef<HTMLDivElement>(null);
  const questionCache = useRef<Map<number, GetQuestionsResponseDto>>(new Map());
  const hasFetchedQuestions = useRef<boolean>(false);
  const [questionAnswered, setQuestionAnswered] = useState<number>(0);
  const [profileCompletionModal, setProfileCompletionModal] = useState<{
    isOpen: boolean;
    completionPercentage: number;
    missingRequirements: string[];
  }>({
    isOpen: false,
    completionPercentage: 0,
    missingRequirements: []
  });

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
        sortBy: "relevance",
        useVectorSearch: true,
      });
      if (response?.data && Array.isArray(response.data)) {
        if (response.data.length === 0) {
          setMatchedJobs([]);
          return;
        }
        if (response.data.length > 3) {
          response.data = response.data.slice(0, 3);
        }
        const jobs = await Promise.all(response.data.map(mapJobToJobCardProps));
        jobs.sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));
        setMatchedJobs(jobs);
      } else {
        console.warn("Invalid jobs response:", response);
        setMatchedJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      
      // Handle 403 profile completion error
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        const details = error.response.data?.details?.data;
        if (details && details.completionPercentage !== undefined) {
          setProfileCompletionModal({
            isOpen: true,
            completionPercentage: details.completionPercentage,
            missingRequirements: details.missingRequirements || []
          });
          setMatchedJobs([]);
          return;
        }
      }
      
      setMatchedJobs([]);
      toast.error("Failed to fetch jobs");
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
      
      // Handle 403 profile completion error
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        const details = error.response.data?.details?.data;
        if (details && details.completionPercentage !== undefined) {
          setProfileCompletionModal({
            isOpen: true,
            completionPercentage: details.completionPercentage,
            missingRequirements: details.missingRequirements || []
          });
          return;
        }
      }
      
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
      if (questionCache.current.has(tier)) {
        const cached = questionCache.current.get(tier)!;
        distributeQuestions(cached.questions);
        return;
      }
      const response: GetQuestionsResponseDto = await getQuestionsForTier(tier);
      questionCache.current.set(tier, response);
      if (response.questions && Array.isArray(response.questions) && response.questions.length > 0) {
        distributeQuestions(response.questions);
      } else {
        console.warn(`No questions returned for tier ${tier}`);
        setAvailableQuestions([]);
        setColumnQuestions([null, null, null]);
      }
    } catch (error: any) {
      console.error(`Failed to fetch questions for tier ${tier}:`, error);
      setAvailableQuestions([]);
      setColumnQuestions([null, null, null]);
      toast.error(error.response?.data?.message || "Failed to fetch questions");
    }
  };

  const fetchAnswerHistory = async (tier: number) => {
    try {
      const history: AnswerResponseDto[] = await getAnswerHistory(tier);
      if (!Array.isArray(history) || history.length === 0) {
        console.warn(`No answer history for tier ${tier}`);
        setAnsweredQuestionIds(new Set());
        setColumnInsights([]);
        return;
      }

      const response: GetQuestionsResponseDto = await getQuestionsForTier(tier);
      const allQuestions = response.questions && Array.isArray(response.questions) ? response.questions : [];

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
      const newInsights: Insight[] = [];

      history.forEach((answer) => {
        if (!answer.questionId) {
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
          text: answer.selectedOption?.insight || answer.answerText || "No insight available",
          category: question.insightCategory || "preferences",
          tier: answer.tierWhenAnswered,
        };
        newInsights.push(insight);
      });

      setAnsweredQuestionIds(newAnsweredQuestionIds);
      setColumnInsights(newInsights);
    } catch (error: any) {
      console.error(`Failed to fetch answer history for tier ${tier}:`, error);
      setAnsweredQuestionIds(new Set());
      setColumnInsights([]);
      toast.error(error.response?.data?.message || "Failed to fetch answer history");
    }
  };

  const fetchProgress = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const progress: UserProgressResponseDto = await getUserProgress();
      const tier = progress.currentTier || 1;
      setCurrentTier(tier);
      setQuestionAnswered(progress.questionsAnsweredInCurrentTier || 0);

      if (!progress.tiers || !Array.isArray(progress.tiers)) {
        console.error("Invalid tiers data in progress");
        setProfileCompletion(0);
        setCurrentTier(1);
        setColumnInsights([]);
        setAnsweredQuestionIds(new Set());
        questionCache.current.clear();
        hasFetchedQuestions.current = false;
        await fetchQuestions(1);
        await fetchAnswerHistory(1);
        await fetchJobs();
        return;
      }

      const currentTierData = progress.tiers.find((t) => t.tierNumber === tier);
      if (!currentTierData) {
        console.error(`No data found for tier ${tier}`);
        toast.error("Error fetching tier data. Reverting to tier 1.");
        setCurrentTier(1);
        setColumnInsights([]);
        setAnsweredQuestionIds(new Set());
        questionCache.current.clear();
        hasFetchedQuestions.current = false;
        await fetchQuestions(1);
        await fetchAnswerHistory(1);
        await fetchJobs();
        return;
      }

      const tierCompletion =
        currentTierData.questionsRequiredToComplete > 0
          ? (currentTierData.questionsAnsweredInTier / currentTierData.questionsRequiredToComplete) * 100
          : 0;
      setProfileCompletion(tierCompletion);

      if (!hasFetchedQuestions.current || !questionCache.current.has(tier)) {
        await fetchQuestions(tier);
        await fetchAnswerHistory(tier);
        hasFetchedQuestions.current = true;
      }
      await fetchJobs();
    } catch (error) {
      console.error("Failed to fetch progress:", error);
      setProfileCompletion(0);
      setCurrentTier(1);
      setColumnInsights([]);
      setAnsweredQuestionIds(new Set());
      questionCache.current.clear();
      hasFetchedQuestions.current = false;
      await fetchQuestions(1);
      await fetchAnswerHistory(1);
      await fetchJobs();
      toast.error("Failed to fetch progress. Defaulting to tier 1.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchProgress();
      await Promise.all([fetchSavedJobs(), fetchAppliedJobs()]);
    };
    initialize();
  }, []);

  const handleAnswer = async (
    questionId: string,
    optionId: string | null,
    optionText: string | null,
    columnIndex: number,
    questionType: string
  ) => {
    try {
      if (!isValidUUID(questionId)) throw new Error(`Invalid questionId UUID: ${questionId}`);

      const question = availableQuestions.find((q) => q.id === questionId);
      if (!question) throw new Error(`Question ${questionId} not found`);

      const isTextQuestion = !question.options || question.options.length === 0;

      // Prepare payload based on whether options are present
      const payload: { questionId: string; selectedOptionId?: string; answerText?: string } = { questionId };
      if (isTextQuestion) {
        if (!optionText) throw new Error(`Answer text is required for text questions`);
        payload.answerText = optionText;
      } else {
        if (!optionId || !isValidUUID(optionId)) throw new Error(`Invalid optionId UUID: ${optionId}`);
        payload.selectedOptionId = optionId;
      }

      // Submit answer
      await submitAnswer(payload);

      // Update answered question IDs
      setAnsweredQuestionIds((prev) => new Set(prev).add(questionId));

      // Fetch latest answer history to get insight
      const latestAnswer = (await getAnswerHistory(currentTier)).find((a) => a.questionId === questionId);
      const insightText = latestAnswer?.selectedOption?.insight || latestAnswer?.answerText || optionText || "No insight available";

      const insight: Insight = {
        id: questionId,
        questionText: question.questionText,
        text: insightText,
        category: question.insightCategory || "preferences",
        tier: currentTier,
      };

      setColumnInsights((prev) => [...prev, insight]);

      // Update questions display
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

      // Fetch updated progress with retry mechanism
      const maxRetries = 5;
      let retries = 0;

      while (retries < maxRetries) {
        const progress = await getUserProgress();
        const newTier = progress.currentTier || 1;
        setQuestionAnswered(progress.questionsAnsweredInCurrentTier || 0);

        if (!progress.tiers || !Array.isArray(progress.tiers)) {
          console.error("Invalid tiers data in progress");
          setProfileCompletion(0);
          setCurrentTier(1);
          setColumnInsights([]);
          setAnsweredQuestionIds(new Set());
          questionCache.current.clear();
          hasFetchedQuestions.current = false;
          await fetchQuestions(1);
          await fetchAnswerHistory(1);
          await fetchJobs();
          toast.error("Invalid progress data. Reverted to Tier 1.");
          return;
        }

        const currentTierData = progress.tiers.find((t) => t.tierNumber === newTier);
        if (!currentTierData) {
          console.error(`No data found for tier ${newTier}`);
          toast.error(`Error fetching data for Tier ${newTier}. Reverting to Tier 1.`);
          setCurrentTier(1);
          setColumnInsights([]);
          setAnsweredQuestionIds(new Set());
          questionCache.current.clear();
          hasFetchedQuestions.current = false;
          await fetchQuestions(1);
          await fetchAnswerHistory(1);
          await fetchJobs();
          return;
        }

        // Calculate tier completion
        const tierCompletion =
          currentTierData.questionsRequiredToComplete > 0
            ? (currentTierData.questionsAnsweredInTier / currentTierData.questionsRequiredToComplete) * 100
            : 0;
        setProfileCompletion(tierCompletion);

        // Check if current tier is completed
        if (
          currentTierData.questionsAnsweredInTier >= currentTierData.questionsRequiredToComplete &&
          newTier < 5
        ) {
          const nextTier = newTier + 1;
          const nextTierData = progress.tiers.find((t) => t.tierNumber === nextTier);

          if (!nextTierData || !nextTierData.isUnlocked) {
            retries++;
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second before retry
            continue;
          }

          // Move to next tier
          setCurrentTier(nextTier);
          setProfileCompletion(0);
          setColumnInsights([]);
          setAnsweredQuestionIds(new Set());
          setCurrentMobileQuestionIndex(0);
          questionCache.current.clear();
          hasFetchedQuestions.current = false;
          await fetchQuestions(nextTier);
          await fetchAnswerHistory(nextTier);
          await fetchJobs();
          toast.success(`Advanced to Tier ${nextTier}!`);
          return;
        } else {
          // Stay in current tier, refresh questions if needed
          if (!hasFetchedQuestions.current || !questionCache.current.has(newTier)) {
            await fetchQuestions(newTier);
            await fetchAnswerHistory(newTier);
            hasFetchedQuestions.current = true;
          }
          await fetchJobs();
          return;
        }
      }

      // If retries are exhausted
      console.warn(`Max retries reached. Tier progression not confirmed.`);
      toast.info(`Please wait, processing tier ${currentTier} completion...`);
      await fetchJobs();
    } catch (error: any) {
      console.error("Failed to submit answer:", {
        message: error.message,
        response: error.response?.data,
        questionId,
        optionId,
        optionText,
        columnIndex,
        questionType,
      });
      toast.error(error.response?.data?.message || "Failed to submit answer. Please try again.");
    }
  };

  const getNextJob = async () => {
    try {
      const response = await jobServices.getJobs({
        limit: 1,
        sortBy: "relevance",
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

  const handleJobAction = async (jobId: string, action: "save" | "apply" | "reject") => {
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
        await jobServices.markJobAsNotInterested(jobId);
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
      toast.error(`Failed to ${action} job. Please try again.`);
    }
  };

  return (
    <ErrorBoundary>
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
        {isLoading && (
          <div className="text-center py-4">
            <p>Loading...</p>
          </div>
        )}
        <div className="mb-12 px-4 mt-3">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="text-xl font-semibold mb-6 flex items-center justify-between"
          >
            <p className="text-xl font-semibold mb-6 flex items-center">Answer Questions</p>
            <p className="text-xl font-semibold mb-6 flex items-center text-[#6B7280] mr-4">{questionAnswered}</p>
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
                        handleAnswer(currentQuestion.id, optionId, optionText, 0, currentQuestion.questionType)
                      }
                    />
                  </motion.div>
                );
              })()
            ) : (
              [0, 1, 2].map((columnIndex) => (
                <div key={`column-${columnIndex}`} className="space-y-4 min-h-[100px] w-[100%]">
                  <AnimatePresence mode="sync">
                    {columnInsights
                      .filter((_, idx) => idx % 3 === columnIndex)
                      .map((insight, idx) => (
                        <motion.div
                          key={`insight-${insight.id}-${idx}`}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="mb-2"
                        >
                          <Card className="dark:bg-[rgba(17, 8, 21, 1)] bg-[#202536] border-2 border-blue-500 py-3 h-[75.2px] justify-center items-center">
                            <CardContent className="px-2 py-2 dark:bg-[rgba(17, 8, 21, 1)] bg-[#202536] flex justify-center text-center">
                              <p className="text-sm dark:text-gray-300 text-gray-300 flex justify-center text-center">
                                {insight.text}
                              </p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                  <AnimatePresence mode="sync">
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
                            handleAnswer(columnQuestions[columnIndex]!.id, optionId, optionText, columnIndex, columnQuestions[columnIndex]!.questionType)
                          }
                        />
                      </motion.div>
                    )}
                    {!columnQuestions[columnIndex] &&
                      columnInsights.filter((_, idx) => idx % 3 === columnIndex).length > 0 && (
                        <motion.div
                          key={`placeholder-${columnIndex}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 0.5, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                          className="bg-jobcardsecondary rounded-lg p-6 border border-primary/10 h-20 flex items-center justify-center"
                        >
                          <p className="text-muted-foreground text-center">All questions completed!</p>
                        </motion.div>
                      )}
                  </AnimatePresence>
                </div>
              ))
            )}
            {availableQuestions.length === 0 &&
              columnQuestions.every((q) => q === null) &&
              columnInsights.length === 0 && (
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
            <div className="flex items-center gap-4 mt-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Briefcase className="h-5 w-5 text-primary mr-2" />
                Your Jobs
              </h2>
              <p className="text-muted-foreground"></p>
            </div>
          </motion.div>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="flex justify-center gap-2">
              <TabsTrigger value="all">All Jobs</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                <AnimatePresence mode="sync">
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
                    className="text-center py-12 bg-gradient-to-br from-background to-primary/20 rounded-lg border border-primary/10 col-span-full"
                  >
                    <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
                    <p className="text-muted-foreground text-center">Answer a few questions to unlock your job matches.</p>
                  </motion.div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <ProfileCompletionModal
        isOpen={profileCompletionModal.isOpen}
        onClose={() => setProfileCompletionModal({ ...profileCompletionModal, isOpen: false })}
        completionPercentage={profileCompletionModal.completionPercentage}
        missingRequirements={profileCompletionModal.missingRequirements}
        fetchDetails={true}
      />
    </ErrorBoundary>
  );
}

export default DynamicJobMatching;