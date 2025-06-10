"use client";

import type React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface QuestionBoxProps {
  question: {
    id: string;
    question: string;
    options: string[];
    category: string;
    icon: React.ReactNode;
  };
  onAnswer: (answer: string) => void;
  featured: boolean;
}

export function QuestionBox({ question, onAnswer}: QuestionBoxProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleSelect = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);

    // Delay to show the selection before transitioning
    setTimeout(() => {
      setIsAnswered(true);

      // Delay the callback to allow for animation
      setTimeout(() => {
        onAnswer(option);
      }, 500);
    }, 300);
  };

  return (
    <Card
      className={`
        overflow-hidden border-primary/10 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10
        
      `}
    >
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center
              
            `}
          >
            {question.icon}
          </div>
          <h3 className="font-medium text-lg text-primary-100">{question.question}</h3>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {!isAnswered ? (
              <motion.div
                key="options"
                className="space-y-3"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {question.options.map((option, index) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Button
                      variant={selectedOption === option ? "default" : "outline"}
                      className={`
                        w-full justify-start text-left h-auto py-3 px-4 text-primary-300
                        ${
                          selectedOption === option
                            ? "bg-blue-500 hover:bg-blue-600 text-white"
                            : "bg-primary-700/50 hover:bg-primary-600/50 border-primary-600/50 text-primary-400 hover:text-blue-400 transition-colors"
                        }
                        ${selectedOption && selectedOption !== option ? "opacity-50" : ""}
                      `}
                      onClick={() => handleSelect(option)}
                    >
                      <span className="flex-1">{option}</span>
                      {selectedOption === option && (
                        <CheckCircle className="h-5 w-5 ml-2 text-white animate-fade-in" />
                      )}
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="answered"
                className="flex items-center justify-center flex-1"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-blue-400" />
                  </div>
                  <p className="text-primary-300">Answer recorded</p>
                  <p className="text-blue-400 font-medium mt-2">{selectedOption}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
}