import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Zap, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionResponseDto {
  id: string;
  questionText: string;
  options?: { id: string; optionText: string; optionOrder: number }[];
  insightCategory?: string;
  questionType: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const categoryIcons: Record<string, JSX.Element> = {
  preferences: <Star className="h-4 w-4 text-primary" />,
  personality: <Zap className="h-4 w-4 text-primary" />,
  goals: <Briefcase className="h-4 w-4 text-primary" />,
  work_life_balance: <Star className="h-4 w-4 text-primary" />,
  career_path: <Briefcase className="h-4 w-4 text-primary" />,
};

function QuestionBox({
  question,
  onAnswer,
  columnIndex,
}: {
  question: QuestionResponseDto;
  onAnswer: (optionId: string | null, optionText: string | null, columnIndex: number, questionType: string) => void;
  columnIndex: number;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTextQuestion = !question.options || question.options.length === 0;

  const handleOptionSelect = (optionId: string, optionText: string) => {
    setSelectedAnswer(optionId);
    setIsSubmitted(true);
    setTimeout(() => {
      onAnswer(optionId, optionText, columnIndex, question.questionType);
      setIsSubmitted(false); // Reset to allow re-rendering if reused
    }, 600);
  };

  const handleTextSubmit = () => {
    if (!textAnswer.trim()) {
      setError("Please provide a response.");
      return;
    }
    setError(null);
    setIsSubmitted(true);
    setTimeout(() => {
      onAnswer(null, textAnswer, columnIndex, question.questionType);
      setIsSubmitted(false); // Reset to allow re-rendering if reused
    }, 600);
  };

  return (
    <motion.div
      layout
      animate={isSubmitted ? { height: 80, marginTop: 0, marginBottom: 20 } : { height: "auto" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden"
    >
      <Card className="rounded-lg border-2 border-blue-500 bg-white dark:bg-black">
        <CardContent className="px-6 py-4 relative">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key={`question-${question.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-[16px] font-medium text-center text-gray-900 dark:text-white">
                    {question.questionText}
                  </h3>
                </div>
                {!isTextQuestion && question.options && (
                  <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 gap-2"
                  >
                    {question.options.map((option, index) => (
                      <motion.div
                        key={option.id}
                        className={
                          question.options!.length % 2 === 1 && index === question.options!.length - 1
                            ? "col-span-2 flex justify-center"
                            : ""
                        }
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: { 
                            type: "spring", 
                            stiffness: 120, 
                            damping: 15, 
                            mass: 0.8,
                            delay: index * 0.1 
                          }
                        }}
                        exit={{ 
                          opacity: 0, 
                          y: -20,
                          transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
                        }}
                      >
                        <motion.button
                          className={`w-full h-20 flex items-center justify-center rounded-md transition-all duration-200 text-center text-sm ${
                            selectedAnswer === option.id
                              ? "bg-blue-500 hover:bg-blue-600 text-white"
                              : "border-2 border-blue-500 text-blue-500 dark:text-white bg-transparent hover:bg-blue-100 hover:bg-opacity-15 dark:hover:bg-gray-900"
                          } ${
                            question.options!.length % 2 === 1 && index === question.options!.length - 1 ? "w-1/2" : ""
                          }`}
                          onClick={() => handleOptionSelect(option.id, option.optionText)}
                          style={{
                            boxShadow: selectedAnswer === option.id ? "none" : "0 2px 4px rgba(10, 132, 255, 0.2)",
                            backgroundColor: selectedAnswer === option.id ? "rgba(10, 132, 255, 0.4)" : "",
                            minHeight: "80px",
                          }}
                          whileHover={{ boxShadow: "0 4px 8px rgba(10, 132, 255, 0.2)", scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          animate={{ scale: selectedAnswer === option.id ? 1 : 1, transition: { duration: 0.1 } }}
                        >
                          <span className="w-full text-center px-2 py-2 break-words">{option.optionText}</span>
                        </motion.button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {isTextQuestion && (
                    <div className="space-y-4">
                    <input
                      type="text"
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      placeholder="Enter your response..."
                      className="w-full h-10 p-2 border-2 border-blue-500 rounded-md"
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button
                      onClick={handleTextSubmit}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Submit
                    </Button>
                    </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key={`insight-${question.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
              >
                <div className="flex items-center gap-3 bg-white dark:bg-[#202536]">
                  {categoryIcons[question.insightCategory || "preferences"]}
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {isTextQuestion
                      ? `You answered: ${textAnswer}`
                      : `You selected ${question.options?.find((opt) => opt.id === selectedAnswer)?.optionText || "an option"}`}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default QuestionBox;