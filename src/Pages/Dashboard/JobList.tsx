import { JobCard } from "./JobCard";

interface JobListProps {
  jobs: any[];
  onJobClick: (id: string) => void;
}

export function JobList({ jobs, onJobClick }: JobListProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job, index) => (
        <JobCard key={job.id} job={job} onClick={() => onJobClick(job.id)} delay={index * 0.1} />
      ))}
    </div>
  );
}