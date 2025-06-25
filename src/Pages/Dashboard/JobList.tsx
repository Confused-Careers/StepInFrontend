import { useState } from "react";
import { jobServices } from "@/services/jobServices";
import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: any[];
  onJobClick: (id: string) => void;
}

export function JobList({ jobs: initialJobs, onJobClick }: JobListProps) {
  const [jobs, setJobs] = useState(initialJobs);

  const handleJobAction = async (jobId: string, action: "reject" | "save" | "apply") => {
    if (action === "reject") {
      try {
        await jobServices.markJobAsNotInterested(jobId);
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
      } catch (error) {
        // Optionally show a toast or error
      }
    }
    // Handle other actions if needed
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <JobCard
          key={job.id}
          job={job}
          onClick={() => onJobClick(job.id)}
          delay={index * 0.1}
          onAction={(action) => handleJobAction(job.id, action)}
        />
      ))}
    </div>
  );
}