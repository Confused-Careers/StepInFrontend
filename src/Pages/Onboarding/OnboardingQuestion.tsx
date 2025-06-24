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
      }, 3000); // Insight display for 3 seconds
    }, 800); // Delay before showing insight
  };

  const selectedOption = options.find(opt => opt.id === selectedOptionId);
  const insightText = selectedOption?.insight || (selectedOption ? `You are ${selectedOption.personalityTrait.replace(/-/g, ' ')} and ${selectedOption.behavioralIndicator.replace(/-/g, ' ')}.` : '');

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {!showInsight ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {question}
            </motion.h2>
            <div className="grid gap-3">
              {options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                >
                  <Button
                    variant={selectedOptionId === option.id ? "default" : "outline"}
                    className={`w-full justify-start text-left h-auto py-4 px-6 ${selectedOptionId && selectedOptionId !== option.id ? "opacity-50" : ""} hover:bg-primary/10 transition-all duration-300`}
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
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="insight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="text-center text-3xl md:text-3xl font-semibold max-w-lg mx-auto min-w-[400px]"
          >
            {insightText.split(". ").map((line, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: index * 2 + 0.4 }}
              >
                {line}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}