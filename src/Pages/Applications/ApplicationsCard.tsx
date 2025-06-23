const statusConfig = {
  rejected: {
    badge: "bg-red-600 text-white",
    buttonText: "View Feedback",
    buttonColor: "bg-[#0a84ff] text-white"
  },
  interview: {
    badge: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    buttonText: "Schedule Interview",
    buttonColor: "bg-[#0a84ff] text-white"
  },
  offer: {
    badge: "bg-[#2ecc71] text-white",
    buttonText: "View Offer",
    buttonColor: "bg-[#0a84ff] text-white"
  },
  applied: {
    badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    buttonText: "View Application",
    buttonColor: "bg-[#0a84ff] text-white"
  },
  "first-round": {
    badge: "border border-[#0a84ff] text-[#0a84ff]",
    buttonText: "View Details",
    buttonColor: "border border-[#0a84ff] text-white"
  },
  "under-review": {
    badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    buttonText: "Sharpen Your Edge",
    buttonColor: "bg-[#0a84ff] text-white"
  }
};

interface JobApplicationCardProps {
  job: {
    id: string;
    status: string;
    company: string;
    companyLogo?: string;
    jobTitle: string;
    location: string;
    department: string;
    jobType?: string;
    appliedDate: string;
    salary: string;
    matchPercentage: string;
    feedback: string;
    interviewDate?: string;
  };
  onActionClick: (jobId: string) => void;
}

export function JobApplicationCard({ job, onActionClick }: JobApplicationCardProps) {

  const hasValidImage = (imageUrl?: string | null): boolean => {
    return imageUrl !== null && 
           imageUrl !== undefined && 
           imageUrl.trim() !== "" && 
           imageUrl !== " ";
  };
  
  const status: keyof typeof statusLabels = job.status as keyof typeof statusLabels || "applied";
  const config = statusConfig[status] || statusConfig["applied"];
  
  const statusLabels = {
    "rejected": "Rejected",
    "interview": "Interview",
    "offer": "Offer Received",
    "applied": "Applied",
    "first-round": "First Round",
    "under-review": "Under Review"
  };
  
  const hasScheduledInterview = status === "first-round" && job.interviewDate;
  
  return (
    <div className="w-full rounded-2xl overflow-hidden shadow-xl border border-[rgba(47,51,54,1)] h-min bg-[rgba(17,20,24,1)]">
      <div className="py-2 px-5 space-y-4 mb-2 mt-2">
        <div className="flex items-start gap-4">
          { hasValidImage(job.companyLogo) ? (
              <img 
                src={job.companyLogo} 
                alt={`${job.company} logo`} 
                className="w-12 h-12 rounded-lg object-cover" 
              />       
          ) : (
            <div className="w-12 h-12 rounded-lg flex items-center justify-center">
            </div>
          )}

          <div className="flex-1 mr-7">
            <h3 className="font-bold text-[18px] text-jobcardtext flex justify-center">{job.jobTitle}</h3>
            <p className="text-sm text-jobcardforeground flex justify-center">{job.company} • {job.location}</p>
          </div>
        </div>

        <div className="flex flex-row gap-1 justify-around items-center px-7 mt-2 ">
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${config.badge}`}>
            {statusLabels[status]}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-jobcardsecondary text-[#ffffff] text-xs font-medium">
            {job.department}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-jobcardsecondary text-[#ffffff] text-xs font-medium">
            {job.jobType || "Full Time"}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-around">
          <div className="flex items-center gap-6">
            <span className="text-[#b0b3b8] text-xs ml-1">Applied {job.appliedDate}</span>
            {job.salary && job.salary !== "N/A" && job.salary.trim() !== "" && (
            <span className="px-1 py-0.5 rounded-md bg-jobcardsecondary text-[#ffffff] text-xs">
              {job.salary}
            </span>
            )}
            <span className="px-1 py-0.5 rounded-md bg-[#0A84FF] text-[#ffffff] text-xs">
              {job.matchPercentage} Match
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#111316] to-[#0D0F10] rounded-lg px-2 py-1 text-center border border-[rgba(42,42,42,1)]">
          <p className="text-jobcardtext text-sm font-normal">
            {job.feedback}
          </p>
        </div>
        { statusLabels[status] !== "Offer Received" && (
          <div className="flex items-center justify-around w-full">
            {hasScheduledInterview ? (
              <button className="border w-[77%] border-[#0A84FF] bg-transparent text-white rounded-lg px-2 py-1.5 text-[16px] font-[500] ">
                {job.interviewDate}
              </button>
            ) : (
              <button 
                className="w-[77%] py-1.5 rounded-lg text-white bg-[rgba(10,132,255,1)] hover:opacity-90 transition-all duration-200 font-[500] text-[16px]"
                onClick={() => onActionClick(job.id)}
              >
                {config.buttonText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}