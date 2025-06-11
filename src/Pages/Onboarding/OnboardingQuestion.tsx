import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Option {
  id: string;
  optionText: string;
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

  useEffect(() => {
    setSelectedOptionId(null);
    setIsTransitioning(false);
  }, [questionId]);

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
    setIsTransitioning(true);
    setTimeout(() => {
      onAnswer(optionId);
      setIsTransitioning(false);
      setSelectedOptionId(null);
    }, 1000);
  };

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
      <div className="grid gap-3">
        {options.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.35 }}
          >
            <Button
              variant={selectedOptionId === option.id ? "default" : "outline"}
              className={`w-full justify-start text-left h-auto py-4 px-6 ${
                selectedOptionId && selectedOptionId !== option.id ? "opacity-50" : ""
              } hover:bg-primary/10`}
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
    </div>
  );
}