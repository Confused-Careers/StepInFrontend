/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from 'react-router-dom';
import { X } from "lucide-react";
import { OnboardingQuestion } from "./OnboardingQuestion";
import { ResumeUpload } from "./ResumeUpload";
import { OnboardingRegister } from "./OnboardingRegister";
import VerifyEmailModal from "../../components/Modals/VerifyEmailModal";
import Logo from "../../assets/StepIn Transparent Logo.png";
import StarryBackground from "@/components/Others/StarryBackground";
import authServices from "@/services/authServices";
import { getOnboardingQuestions } from "@/services/questionServices";
import { toast } from "sonner";

type StepType = "intro" | "register" | "resume" | "question" | "verify";

interface OnboardingAnswer {
  questionId: string;
  selectedOptionId: string;
}

interface Question {
  id: string;
  questionText: string;
  options: Array<{
    id: string;
    optionText: string;
    personalityTrait: string;
    behavioralIndicator: string;
    insight: string | null;
  }>;
  onboardingOrder: number;
}

interface Step {
  id: string;
  type: StepType;
  content?: string;
  questionId?: string;
  questionText?: string;
  options?: Array<{ id: string; optionText: string; personalityTrait: string; behavioralIndicator: string; insight: string | null }>;
  progress: number;
}

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
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploaded, setResumeUploaded] = useState<boolean>(() => {
    const savedResumeUploaded = localStorage.getItem('onboarding_resumeUploaded');
    return savedResumeUploaded ? JSON.parse(savedResumeUploaded) : false;
  });
  const [progress, setProgress] = useState<number>(0);
  const [, setIsTransitioning] = useState<boolean>(false);
  const [showContent, setShowContent] = useState<boolean>(true);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [, setIsLoading] = useState(false);
  const [dynamicSteps, setDynamicSteps] = useState<Step[]>([
    { id: "intro", type: "intro", content: "Let's start small, No résumés, No buzzwords, Just you — and how you actually work best.", progress: 0 },
  ]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await getOnboardingQuestions();
        const questions: Question[] = response.data.questions.sort(
          (a: { onboardingOrder: number; }, b: { onboardingOrder: number; }) => a.onboardingOrder - b.onboardingOrder
        );
        const totalQuestions = questions.length;
        const questionsBefore = totalQuestions % 2 === 0 ? totalQuestions / 2 : Math.ceil(totalQuestions / 2);
        const newSteps: Step[] = [
          { id: "intro", type: "intro", content: "Let's start small, No résumés, No buzzwords, Just you — and how you actually work best.", progress: 0 },
        ];
        questions.slice(0, questionsBefore).forEach((q, index) => {
          newSteps.push({
            id: `q${index + 1}`,
            type: "question",
            questionId: q.id,
            questionText: q.questionText,
            options: q.options.map(opt => ({ id: opt.id, optionText: opt.optionText, personalityTrait: opt.personalityTrait, behavioralIndicator: opt.behavioralIndicator, insight: opt.insight })),
            progress: ((index + 1) / (totalQuestions + 3)) * 80,
          });
        });
        newSteps.push({
          id: "register",
          type: "register",
          content: "Let's save your progress – and send your matches straight to you",
          progress: (questionsBefore / (totalQuestions + 3)) * 80,
        });
        newSteps.push({
          id: "resume",
          type: "resume",
          content: "Now let's connect your experience — we'll use it to show matches that actually fit.",
          progress: ((questionsBefore + 1) / (totalQuestions + 3)) * 80,
        });
        questions.slice(questionsBefore).forEach((q, index) => {
          newSteps.push({
            id: `q${questionsBefore + index + 1}`,
            type: "question",
            questionId: q.id,
            questionText: q.questionText,
            options: q.options.map(opt => ({ id: opt.id, optionText: opt.optionText, personalityTrait: opt.personalityTrait, behavioralIndicator: opt.behavioralIndicator, insight: opt.insight })),
            progress: ((questionsBefore + 1 + index + 1) / (totalQuestions + 3)) * 80,
          });
        });
        newSteps.push({
          id: "verify",
          type: "verify",
          content: "Verify your email to continue",
          progress: 90,
        });
        setDynamicSteps(newSteps);
      } catch {
        toast.error("Failed to load onboarding questions.");
      }
    };
    fetchQuestions();
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(dynamicSteps[currentStep]?.progress || 0);
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
  }, [currentStep, dynamicSteps]);

  const handleAnswer = async (stepId: string, optionId: string) => {
    const questionId = dynamicSteps.find(step => step.id === stepId)?.questionId;
    if (!questionId) return;
    setAnswers(prev => ({ ...prev, [stepId]: optionId }));
    const newAnswer = { questionId, selectedOptionId: optionId };
    setOnboardingAnswers(prev => [...prev.filter(a => a.questionId !== questionId), newAnswer]);
    setIsTransitioning(true);
    setShowContent(false);
    const questionIndex = dynamicSteps.findIndex(step => step.id === stepId);
    const totalQuestions = dynamicSteps.filter(step => step.type === "question").length;
    const questionCount = dynamicSteps.slice(0, questionIndex + 1).filter(step => step.type === "question").length;
    const isLastQuestion = questionCount === totalQuestions && totalQuestions > 0;
    if (isLastQuestion) {
      setIsLoading(true);
      try {
        const isGoogleAuth = !!localStorage.getItem("google_accessToken");
        const registerData = JSON.parse(localStorage.getItem("registerData") || "{}");
        const updatedAnswers = [...onboardingAnswers.filter(a => a.questionId !== questionId), newAnswer];
        if (isGoogleAuth) {
          const googleAccessToken = localStorage.getItem("google_accessToken");
          await authServices.googleAuth({
            idToken: googleAccessToken!,
            onboardingAnswers: updatedAnswers,
          });
        } else {
          const formData = new FormData();
          formData.append("email", registerData.email || "");
          formData.append("password", registerData.password || "");
          formData.append("firstName", registerData.firstName || "");
          formData.append("lastName", registerData.lastName || "");
          formData.append("phone", registerData.phone || "");
          updatedAnswers.forEach((answer, index) => {
            formData.append(`onboardingAnswers[${index}][questionId]`, answer.questionId);
            formData.append(`onboardingAnswers[${index}][selectedOptionId]`, answer.selectedOptionId);
          });
          if (resumeFile) {
            formData.append("resume", resumeFile);
          } else {
            throw new Error("Resume file is required");
          }
          await authServices.register(formData);
        }
        setUserEmail(registerData.email || localStorage.getItem("google_email") || "");
        setShowVerifyModal(true);
        setCurrentStep(prev => prev + 1);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Registration failed.");
        setIsTransitioning(false);
        setShowContent(true);
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
      }
    } else {
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
          setShowContent(true);
        }, 700);
      }, 3000);
    }
  };

  const handleResumeUpload = (file: File) => {
    setResumeFile(file);
    setResumeUploaded(true);
    setTimeout(() => {
      setIsTransitioning(true);
      setShowContent(false);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
        setShowContent(true);
      }, 1000);
    }, 1500);
  };

  const handleVerifyComplete = () => {
    setShowContent(false);
    localStorage.removeItem('onboarding_currentStep');
    localStorage.setItem('onboarding_answers', JSON.stringify({}));
    localStorage.setItem('onboarding_onboardingAnswers', JSON.stringify([]));
    localStorage.removeItem('onboarding_resumeUploaded');
    localStorage.removeItem('registerData');
    localStorage.removeItem('google_accessToken');
    localStorage.removeItem('google_email');
    navigate("/individual-login");
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
    const step = dynamicSteps[currentStep];
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
              backendQuestionId={step.questionId || ""}
              question={step.questionText || ""}
              options={step.options || []}
              onAnswer={(optionId: string) => handleAnswer(step.id, optionId)}
            />
          </motion.div>
        );
      case "verify":
        return null;
      default:
        return null;
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.4, ease: easeInOut } },
    exit: { opacity: 0, y: -20, transition: { duration: 1, ease: easeInOut } },
  };

  const progressBarVariants = {
    initial: { width: "0%" },
    animate: {
      width: `${progress}%`,
      transition: { duration: 1.9, ease: easeInOut },
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
                Step {currentStep + 1}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  localStorage.removeItem('onboarding_currentStep');
                  localStorage.setItem('onboarding_answers', JSON.stringify({}));
                  localStorage.setItem('onboarding_onboardingAnswers', JSON.stringify([]));
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
          onClose={handleVerifyComplete}
          email={userEmail}
          navigation={handleVerifyComplete}
        />
      </div>
    </div>
  );
}