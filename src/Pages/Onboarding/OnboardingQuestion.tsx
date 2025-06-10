import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";

interface OnboardingQuestionProps {
  questionId: string;
  question: string;
  options: string[];
  onAnswer: (answer: string) => void;
}

export function OnboardingQuestion({
  questionId,
  question,
  options,
  onAnswer,
}: OnboardingQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const needsTextInput = ["q1", "q3"].includes(questionId);
  const onlyTextInput = ["q7"].includes(questionId);

  const keywords = [
    "problem-solving",
    "coding",
    "designing",
    "writing",
    "organizing",
    "learning",
    "teaching",
    "collaborating",
    "researching",
    "analyzing",
    "planning",
    "creating",
    "building",
    "leading",
    "exploring",
    "thinking",
    "reflecting",
    "communicating",
    "motivating",
    "innovating",
  ];

  useEffect(() => {
    setSelectedOption(null);
    setTextInput("");
    setSelectedKeywords([]);
    setIsTransitioning(false);
  }, [question]);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setIsTransitioning(true);
    setTimeout(() => {
      onAnswer(option);
      setIsTransitioning(false);
      setSelectedOption(null);
    }, 1000);
  };

  const handleTextSubmit = () => {
    const finalAnswer = onlyTextInput
      ? textInput
      : [...selectedKeywords, textInput].filter(Boolean).join(", ");
    setIsTransitioning(true);
    setTimeout(() => {
      onAnswer(finalAnswer);
      setIsTransitioning(false);
      setTextInput("");
      setSelectedKeywords([]);
    }, 1000);
  };

  const handleKeywordSelect = (keyword: string) => {
    if (!selectedKeywords.includes(keyword)) {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    setSelectedKeywords(selectedKeywords.filter((k) => k !== keyword));
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
      {!needsTextInput && !onlyTextInput ? (
        <div className="grid gap-3">
          {options?.map((option, index) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.35 }}
            >
              <Button
                variant={selectedOption === option ? "default" : "outline"}
                className={`w-full justify-start text-left h-auto py-4 px-6 ${
                  selectedOption && selectedOption !== option ? "opacity-50" : ""
                } hover:bg-primary/10`}
                onClick={() => handleSelect(option)}
                disabled={isTransitioning}
              >
                <span className="flex-1">{option}</span>
                {selectedOption === option && (
                  <CheckCircle className="h-5 w-5 ml-2 text-primary-foreground animate-pulse" />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
      ) : onlyTextInput ? (
        <div className="bg-background/40 backdrop-blur-sm rounded-lg p-3 border border-border">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type your response here..."
              className="bg-transparent border-none focus-visible:ring-0"
              disabled={isTransitioning}
            />
            <Button
              onClick={handleTextSubmit}
              disabled={isTransitioning || !textInput.trim()}
            >
              Submit
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {keywords.map((keyword, index) => (
              <motion.div
                key={keyword}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.15 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-sm hover:bg-primary/10"
                  onClick={() => handleKeywordSelect(keyword)}
                  disabled={isTransitioning}
                >
                  {keyword}
                </Button>
              </motion.div>
            ))}
          </div>
          <div className="bg-background/40 backdrop-blur-sm rounded-lg p-3 border border-border">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedKeywords.map((keyword) => (
                <div
                  key={keyword}
                  className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm flex items-center gap-1"
                >
                  {keyword}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeKeyword(keyword)}
                    disabled={isTransitioning}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type your own response..."
                className="bg-transparent border-none focus-visible:ring-0"
                disabled={isTransitioning}
              />
              <Button
                onClick={handleTextSubmit}
                disabled={
                  isTransitioning ||
                  (!selectedKeywords.length && !textInput.trim())
                }
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}