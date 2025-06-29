import { JSX, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Zap, Briefcase } from "lucide-react";

interface QuestionResponseDto {
  id: string;
  questionText: string;
  options: { id: string; optionText: string; optionOrder: number }[];
  insightCategory?: string;
  questionType?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

{/**const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 120, damping: 15, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
}; */}

const categoryIcons: Record<string, JSX.Element> = {
  preferences: <Star className="h-4 w-4 text-primary" />,
  personality: <Zap className="h-4 w-4 text-primary" />,
  goals: <Briefcase className="h-4 w-4 text-primary" />,
};

function QuestionBox({ question, onAnswer }: { question: QuestionResponseDto; onAnswer: (optionId: string, optionText: string) => void }) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionSelect = (optionId: string, option: string) => {
    setSelectedAnswer(optionId);
    setIsSubmitted(true);
    setTimeout(() => onAnswer(optionId, option), 600);
  };

  return (
    <motion.div
      layout
      animate={isSubmitted ? { height: 80, marginTop: 0, marginBottom: 20 } : { height: "auto" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className="relative overflow-hidden"
    >
      <Card className="rounded-lg border-2 border-blue-500 bg-white dark:bg-black">
        <CardContent className="px-6 py-1 relative">
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.div
                key="question"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-[16px] font-medium text-center text-gray-900 dark:text-white">{question.questionText}</h3>
                </div>
                <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-2 gap-2">
                  {question.options.map((option, index) => (
                    <motion.div
                      key={option.id}
                      className={question.options.length % 2 === 1 && index === question.options.length - 1 ? "col-span-2 flex justify-center" : ""}
                    >
                      <motion.button
                        className={`w-full h-20 flex items-center justify-center rounded-md transition-all duration-200 text-center text-sm ${
                          selectedAnswer === option.id
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "border-2 border-blue-500 text-blue-500 dark:text-white bg-transparent hover:bg-blue-100 hover:bg-opacity-15 dark:hover:bg-gray-900"
                        } ${question.options.length % 2 === 1 && index === question.options.length - 1 ? "w-1/2" : ""}`}
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
              </motion.div>
            ) : (
              <motion.div
                key="insight"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], delay: 0.2 }}
              >
                <div className="flex items-center gap-3 bg-white dark:bg-[#202536]">
                  {categoryIcons[question.insightCategory || "preferences"]}
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    You selected {question.options.find((opt) => opt.id === selectedAnswer)?.optionText}
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