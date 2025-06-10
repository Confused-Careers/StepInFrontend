import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight } from "lucide-react";

interface PersonalityInsightProps {
  insights: string[];
  onContinue: () => void;
}

export function PersonalityInsight({ insights, onContinue }: PersonalityInsightProps) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl md:text-3xl font-bold">Your Professional Profile</h2>
        <p className="text-muted-foreground">Based on your responses, we've created a personalized profile</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-primary/20 bg-background/80 backdrop-blur-md">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-primary/20 rounded-full p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-lg mb-3">Your Professional Insights</h3>
                <ul className="space-y-4">
                  {insights.map((insight, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.2 }}
                      className="flex items-start gap-3"
                    >
                      <div className="bg-primary rounded-full p-1 mt-0.5 flex-shrink-0">
                        <div className="h-2 w-2 rounded-full bg-white" />
                      </div>
                      <p>{insight}</p>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="flex justify-center"
      >
        <Button
          onClick={onContinue}
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/80 hover:to-primary"
        >
          View Your Dashboard
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </motion.div>
    </div>
  );
}