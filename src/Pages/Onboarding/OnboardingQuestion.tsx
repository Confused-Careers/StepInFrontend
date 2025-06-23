import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Option {
  id: string;
  optionText: string;
  personalityTrait: string;
  behavioralIndicator: string;
  insight: string | null;
}

interface OnboardingQuestionProps {
  questionId: string;
  backendQuestionId: string;
  question: string;
  options: Option[];
  onAnswer: (optionId: string) => void;
}

export function OnboardingQuestion({
  questionId,
  question,
  options,
  onAnswer,
}: OnboardingQuestionProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showInsight, setShowInsight] = useState(false);

  useEffect(() => {
    setSelectedOptionId(null);
    setIsTransitioning(false);
    setShowInsight(false);
  }, [questionId]);

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
    setIsTransitioning(true);
    setTimeout(() => {
      setShowInsight(true);
      setTimeout(() => {
        onAnswer(optionId);
        setIsTransitioning(false);
        setShowInsight(false);
        setSelectedOptionId(null);
      }, 2000);
    }, 1000);
  };

  const selectedOption = options.find(opt => opt.id === selectedOptionId);
  const insightText = selectedOption?.insight || (selectedOption ? `You are ${selectedOption.personalityTrait.replace(/-/g, ' ')} and ${selectedOption.behavioralIndicator.replace(/-/g, ' ')}.` : '');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <motion.h2
        className="text-2xl md:text-3xl font-bold text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {question}
      </motion.h2>
      <AnimatePresence mode="wait">
        {!showInsight ? (
          <motion.div
            key="options"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-3"
          >
            {options.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.35 }}
              >
                <Button
                  variant={selectedOptionId === option.id ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto py-4 px-6 ${selectedOptionId && selectedOptionId !== option.id ? "opacity-50" : ""} hover:bg-primary/10`}
                  onClick={() => handleSelect(option.id)}
                  disabled={isTransitioning}
                >
                  <span className="flex-1">{option.optionText}</span>
                  {selectedOptionId === option.id && (
                    <CheckCircle className="h-5 w-5 ml-2 text-primary-foreground animate-pulse" />
                  )}
                </Button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="insight"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6"
          >
            <motion.p
              className="text-lg font-semibold"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Insight
            </motion.p>
            <motion.p
              className="text-base text-muted-foreground mt-2"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {insightText}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}