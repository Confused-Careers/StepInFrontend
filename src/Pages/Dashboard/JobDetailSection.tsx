import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JobDetailView } from "./JobDetailView";
import { Briefcase, Bookmark, Share2, ArrowLeft } from "lucide-react";

interface JobDetailSectionProps {
  selectedJob: any | null;
  relatedJobs: any[];
  onBackClick: () => void;
  onJobClick: (id: string) => void;
}

export function JobDetailSection({ selectedJob, relatedJobs, onBackClick, onJobClick }: JobDetailSectionProps) {
  if (!selectedJob) return null;

  return (
    <motion.div
      key="job-detail"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="grid md:grid-cols-3 gap-6"
    >
      <div className="md:col-span-2">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-2" onClick={onBackClick}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h2 className="text-xl font-bold">Job Details</h2>
        </div>
        <JobDetailView job={selectedJob} />
      </div>

      <div>
        <div className="sticky top-24 space-y-6">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Similar Jobs</CardTitle>
              <CardDescription>Based on your current selection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {relatedJobs.length > 0 ? (
                relatedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-lg bg-gradient-to-br from-background to-primary/5 border border-primary/10 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => onJobClick(job.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-md bg-muted flex-shrink-0 w-10 h-10 flex items-center justify-center">
                        <Briefcase className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{job.title}</h3>
                        <p className="text-xs text-muted-foreground">{job.company}</p>
                        <div className="flex items-center mt-1">
                          <Badge
                            variant="outline"
                            className="text-xs bg-primary/10 text-primary border-primary/20"
                          >
                            {job.matchPercentage}% Match
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No similar jobs found</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Bookmark className="mr-2 h-4 w-4" />
                Save Job
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Share2 className="mr-2 h-4 w-4" />
                Share Job
              </Button>
              <Button className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300">
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></span>
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}