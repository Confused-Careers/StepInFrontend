import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import authServices from "@/services/authServices";
import { toast } from "sonner";

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

interface JobMatchesProps {
  matches: JobMatch[];
  onComplete: () => void;
}

export function JobMatches({ matches, onComplete }: JobMatchesProps) {
  const [explanations, setExplanations] = useState<Record<string, string>>({});

  const formatEmploymentType = (type: string) => {
    const typeMap: Record<string, string> = {
      'full_time': 'Full-Time',
      'part_time': 'Part-Time', 
      'contract': 'Contract',
      'internship': 'Internship'
    };
    
    return typeMap[type] || type
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("-");
  };

  const fetchExplanation = async (jobId: string) => {
    try {
      const response = await authServices.getJobMatchExplanation(jobId);
      setExplanations(prev => ({ ...prev, [jobId]: response.explanation }));
    } catch {
      toast.error("Failed to load match explanation.");
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl md:text-3xl font-bold">Your Top Job Matches</h2>
        <p className="text-muted-foreground">Based on your profile, we've found these opportunities that match your skills and preferences</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        {matches.map((job, index) => (
          <motion.div
            key={job.jobId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <Card className="overflow-hidden">
              <div
                className={`h-1 bg-gradient-to-r from-primary via-primary/80 to-primary/50 animate-gradient-shift`}
                style={{ width: `${Math.round(job.matchPercentage)}%` }}
              />
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 rounded-full p-2 mt-1">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{job.title}</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-3.5 w-3.5" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatEmploymentType(job.employmentType)}</span>
                        </div>
                        {job.salary && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" />
                            <span>{job.salary}</span>
                          </div>
                        )}
                      </div>
                      {explanations[job.jobId] && (
                        <div className="mt-3 border-l-2 border-primary/30 pl-3 py-1 italic text-sm">
                          <strong className="not-italic font-semibold text-primary">Why this match?</strong> {explanations[job.jobId]}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/20"
                    >
                      {Math.round(job.matchPercentage)}% Match
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => fetchExplanation(job.jobId)}
                    >
                      Explain
                    </Button>
                    <Button size="sm" className="whitespace-nowrap">
                      Quick Apply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex justify-center"
      >
        <Button
          onClick={onComplete}
          className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 hover:shadow-[0_0_20px_rgba(var(--primary),0.5)]"
          size="lg"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></span>
          Complete Setup & Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}