import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { OnboardingQuestion } from "./OnboardingQuestion";
import { ResumeUpload } from "./ResumeUpload";
import { OnboardingRegister } from "./OnboardingRegister";
import { JobMatches } from "./JobMatches";
import VerifyEmailModal from "../../components/Modals/VerifyEmailModal";
import Logo from "../../assets/StepIn Transparent Logo.png";
import StarryBackground from "@/components/Others/StarryBackground";
import authServices from "@/services/authServices";
import { toast } from "sonner";

type StepType = "intro" | "register" | "resume" | "question" | "matches" | "verify";

interface OnboardingAnswer {
  questionId: string;
  selectedOptionId: string;
}

interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  employmentType: string;
  salary?: string;
  category?: string;
}

interface Step {
  id: string;
  type: StepType;
  content?: string;
  question?: string;
  options?: string[];
  insight?: string;
  progress: number;
  followUp?: string;
  companyMatch?: { name: string; reason: string };
  jobMatches?: JobMatch[];
}

// Predefined steps with static questions
const steps: Step[] = [
  { id: "intro", type: "intro", content: "Let's start small, No résumés, No buzzwords, Just you — and how you actually work best.", progress: 0 },
  { id: "q1", type: "question", question: "When was the last time you completely lost track of time doing something?", options: ["Solving a complex problem", "Creating something new", "Collaborating with others", "Learning a new skill", "Organizing a project", "Relaxing with a hobby"], insight: "You're a deep work thinker — not a surface-level doer.", progress: 10 },
  { id: "q2", type: "question", question: "What kind of energy makes you come alive in a team?", options: ["Calm and quiet", "Fast-paced and collaborative", "Playful and creative", "Structured and focused", "Chaotic but full of ideas", "Independent and self-driven"], insight: "You bring heat to fast-moving teams.", progress: 20 },
  { id: "q3", type: "question", question: "When you've worked with a team that just didn't click, what was the main issue?", options: ["Lack of clear communication", "Too much chaos", "No shared goals", "Poor leadership", "Conflicting personalities", "Not enough autonomy"], insight: "You thrive when people say what they mean.", progress: 30, followUp: "You've answered a few real questions — not just checkbox stuff. Want to see roles that actually match how you think and work? Let's get your info locked in and keep moving." },
  { id: "register", type: "register", content: "Let's save your progress – and send your matches straight to you", progress: 40 },
  { id: "resume", type: "resume", content: "Now let's connect your experience — we'll use it to show matches that actually fit.", progress: 50 },
  { id: "q4", type: "question", question: "How would you describe your career stage?", options: ["High school student", "College student", "Recent grad", "Career switcher", "Mid-career professional", "Other"], insight: "You're at a key inflection point in your journey.", progress: 60 },
  { id: "q5", type: "question", question: "When no one gives direction, what do you naturally do?", options: ["Start building something", "Organize the chaos", "Ask questions", "Check in with others", "Wait and observe", "Get anxious"], insight: "You don't wait — you create.", progress: 70, followUp: "Based on what you've shared so far — and your background — one team stands out", companyMatch: { name: "ExampleCorp", reason: "Why? Collaborative, fast-paced, ownership-heavy. Feels like you" } },
  { id: "q6", type: "question", question: "What kind of pressure actually makes you better?", options: ["A deadline", "A team counting on me", "Owning the whole outcome", "Solving a hard problem", "Competitive stakes", "Minimal pressure — I do better in calm"], insight: "You rise when people count on you.", progress: 80, followUp: "You're almost there — and this next moment is the one that matters." },
  { id: "q7", type: "question", question: "What makes you feel proud at the end of the day?", options: ["Finishing a tough task", "Helping a teammate succeed", "Seeing measurable progress", "Solving a tricky problem", "Leading a project", "Learning something new"], insight: "You're not chasing status. You're chasing progress.", progress: 90, followUp: "Here's where you'd actually thrive. Not just jobs you can do — Roles that match how you think, work, and grow. This is what fit feels like." },
  { id: "verify", type: "verify", content: "Verify your email to continue", progress: 92 },
  { id: "matches", type: "matches", content: "Here are your personalized job matches!", progress: 95 },
];

export function OnboardingFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const savedStep = localStorage.getItem('onboarding_currentStep');
    return savedStep ? parseInt(savedStep, 10) : 0;
  });
  const [answers, setAnswers] = useState<Record<string, string>>(() => {
    const savedAnswers = localStorage.getItem('onboarding_answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });
  const [onboardingAnswers, setOnboardingAnswers] = useState<OnboardingAnswer[]>(() => {
    const savedOnboardingAnswers = localStorage.getItem('onboarding_onboardingAnswers');
    return savedOnboardingAnswers ? JSON.parse(savedOnboardingAnswers) : [];
  });
  const [, setResumeFile] = useState<File | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState<boolean>(() => {
    const savedResumeUploaded = localStorage.getItem('onboarding_resumeUploaded');
    return savedResumeUploaded ? JSON.parse(savedResumeUploaded) : false;
  });
  const [progress, setProgress] = useState<number>(0);
  const [, setIsTransitioning] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([]);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [, setIsLoading] = useState(false);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding_currentStep', currentStep.toString());
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem('onboarding_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('onboarding_onboardingAnswers', JSON.stringify(onboardingAnswers));
  }, [onboardingAnswers]);

  useEffect(() => {
    localStorage.setItem('onboarding_resumeUploaded', JSON.stringify(resumeUploaded));
  }, [resumeUploaded]);

  // Update progress and handle intro auto-advance
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(steps[currentStep]?.progress || 0);
    }, 300);
    if (currentStep === 0) {
      const introTimer = setTimeout(() => {
        handleContinue();
      }, 3500);
      return () => {
        clearTimeout(timer);
        clearTimeout(introTimer);
      };
    }
    return () => clearTimeout(timer);
  }, [currentStep]);

  // Fetch job matches at the matches step
  useEffect(() => {
    if (steps[currentStep]?.type === 'matches' && onboardingAnswers.length > 0) {
      const fetchMatches = async () => {
        try {
          const data = await authServices.getJobMatches({
            k: 20,
            salaryMin: 80000,
            salaryMax: 150000,
            employmentType: 'full_time',
            isRemote: true,
          });
          setJobMatches(data.matches);
        } catch {
          toast.error("Failed to load job matches.");
        }
      };
      fetchMatches();
    }
  }, [currentStep, onboardingAnswers]);

  const handleAnswer = async (stepId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [stepId]: answer }));
    const questionId = stepId;
    const selectedOptionId = `option-${answer.toLowerCase().replace(/\s/g, '-')}`;
    const newAnswer = { questionId, selectedOptionId };
    setOnboardingAnswers(prev => [...prev, newAnswer]);

    setIsTransitioning(true);
    setShowContent(false);

    if (stepId === "q7") {
      setIsLoading(true);
      try {
        const isGoogleAuth = !!localStorage.getItem("google_accessToken");
        const registerData = JSON.parse(localStorage.getItem("registerData") || "{}");
        const updatedAnswers = [...onboardingAnswers, newAnswer];

        if (isGoogleAuth) {
          const googleAccessToken = localStorage.getItem("google_accessToken");
          await authServices.googleAuth({
            idToken: googleAccessToken!,
            onboardingAnswers: updatedAnswers,
          });
        } else {
          await authServices.register({
            email: registerData.email,
            password: registerData.password,
            firstName: registerData.firstName,
            lastName: registerData.lastName,
            phone: registerData.phone,
            onboardingAnswers: updatedAnswers,
          });
        }
        setUserEmail(registerData.email || localStorage.getItem("google_email") || "");
        setShowVerifyModal(true);
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Registration failed.");
      } finally {
        setIsLoading(false);
        setIsTransitioning(false);
        setShowContent(true);
      }
    } else {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
          setShowContent(true);
        }, 700);
      }, 1400);
    }
  };

  const handleResumeUpload = async (file?: File) => {
    setResumeFile(file || null);
    setResumeUploaded(true);
    if (!file) {
      setIsTransitioning(true);
      setShowContent(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
        setShowContent(true);
      }, 1000);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file);
      await authServices.uploadResume(formData);
      setTimeout(() => {
        setIsTransitioning(true);
        setShowContent(false);
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
          setIsTransitioning(false);
          setShowContent(true);
        }, 1000);
      }, 2000);
    } catch {
      toast.error("Failed to upload resume. Please try again.");
      setResumeUploaded(false);
    }
  };

  const handleMatchesComplete = () => {
    setShowContent(false);
    // Clear localStorage on completion
    localStorage.removeItem('onboarding_currentStep');
    localStorage.removeItem('onboarding_answers');
    localStorage.removeItem('onboarding_onboardingAnswers');
    localStorage.removeItem('onboarding_resumeUploaded');
    localStorage.removeItem('registerData');
    localStorage.removeItem('google_accessToken');
    localStorage.removeItem('google_email');
    navigate("/dashboard");
  };

  const handleContinue = () => {
    setIsTransitioning(true);
    setShowContent(false);
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setTimeout(() => {
        setIsTransitioning(false);
        setShowContent(true);
      }, 700);
    }, 1000);
  };

  const renderStep = () => {
    const step = steps[currentStep];
    if (!step) return null;

    switch (step.type) {
      case "intro":
        return (
          <motion.div
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            exit="exit"
            variants={contentVariants}
            className="text-center text-4xl"
          >
            {step.content?.split(". ").map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, delay: index * 1.4 + 0.5 }}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        );
      case "register":
        return (
          <motion.div
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            exit="exit"
            variants={contentVariants}
          >
            <OnboardingRegister
              onComplete={handleContinue}
              onboardingAnswers={onboardingAnswers}
            />
          </motion.div>
        );
      case "resume":
        return (
          <motion.div
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            exit="exit"
            variants={contentVariants}
          >
            <ResumeUpload onUpload={handleResumeUpload} uploaded={resumeUploaded} />
          </motion.div>
        );
      case "question":
        return (
          <motion.div
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            exit="exit"
            variants={contentVariants}
          >
            <OnboardingQuestion
              questionId={step.id}
              question={step.question || ""}
              options={step.options || []}
              onAnswer={(answer: string) => handleAnswer(step.id, answer)}
            />
          </motion.div>
        );
      case "matches":
        return (
          <motion.div
            initial="hidden"
            animate={showContent ? "visible" : "hidden"}
            exit="exit"
            variants={contentVariants}
          >
            <JobMatches matches={jobMatches} onComplete={handleMatchesComplete} />
          </motion.div>
        );
      case "verify":
        return null; // Handled by VerifyEmailModal
      default:
        return null;
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: "easeInOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 1, ease: "easeInOut" } },
  };

  const progressBarVariants = {
    initial: { width: "0%" },
    animate: {
      width: `${progress}%`,
      transition: { duration: 1.9, ease: "easeInOut" },
    },
  };

  return (
    <div className="min-h-screen flex flex-col dark:starry-background">
      <StarryBackground />
      <div className="container max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-2">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
              <span className="font-bold">StepIn</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {steps.length - 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  // Clear localStorage on manual exit
                  localStorage.removeItem('onboarding_currentStep');
                  localStorage.removeItem('onboarding_answers');
                  localStorage.removeItem('onboarding_onboardingAnswers');
                  localStorage.removeItem('onboarding_resumeUploaded');
                  localStorage.removeItem('registerData');
                  localStorage.removeItem('google_accessToken');
                  localStorage.removeItem('google_email');
                  navigate("/");
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-gradient-to-r from-primary/20 to-primary/5"
          >
            <motion.div
              initial="initial"
              animate="animate"
              variants={progressBarVariants}
              className="h-full bg-gradient-to-r from-primary to-primary/80 animate-gradient-shift"
            />
          </Progress>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </div>
        <VerifyEmailModal
          isOpen={showVerifyModal}
          onClose={() => setShowVerifyModal(false)}
          email={userEmail}
          navigation={() => navigate("/individual-login")}
        />
      </div>
    </div>
  );
}