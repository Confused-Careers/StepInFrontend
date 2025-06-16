import { useNavigate } from "react-router-dom";

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
    applications?: string;
    responsiblities?: string;
  };
  onActionClick?: (jobId: string) => void;
  onCardClick: (jobId: string) => void;
}

export function JobPostCard({ job, onActionClick, onCardClick }: JobApplicationCardProps) {
  const navigate = useNavigate();

  
  const hasValidImage = (imageUrl?: string | null): boolean => {
    return imageUrl !== null && 
           imageUrl !== undefined && 
           imageUrl.trim() !== "" && 
           imageUrl !== " ";
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onActionClick) {
      onActionClick(job.id);
    } else {
      navigate(`/company/dashboard/${job.id}/applications`);
    }
  };

  const handleCardClick = () => {
    onCardClick(job.id);
  };

  return (
    <div
      className="w-full rounded-2xl overflow-hidden shadow-2xl border h-min bg-black cursor-pointer hover:shadow-[0_0_20px_rgba(10,132,255,0.5)] transition-shadow duration-200"
      style={{ border: '1px solid rgba(10, 132, 255, 0.4)', boxShadow: '0 0 15px rgba(10, 132, 255, 0.3)' }}
      onClick={handleCardClick}
    >
      <div className="py-2 px-5 space-y-4 mb-2 mt-2">
        <div className="flex items-start gap-4">
            {hasValidImage(job.companyLogo) ? (
              <div className="bg-white p-1 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 ml-4 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0">
                <img 
                  src={job.companyLogo!} 
                  width={96} 
                  height={96} 
                  className="object-contain rounded-md w-full h-full" 
                  alt={`${job.companyLogo}'s photo`}
                />
              </div>
            ) : (
              <div className="p-1 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0" />
            )}
          <div className="flex-1 ml-5 justify-center items-center mr-12">
            <h3 className="font-bold text-[18px] text-jobcardtext flex justify-center">{job.jobTitle}</h3>
            <p className="text-sm text-jobcardforeground flex justify-center">{job.location}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-1 justify-evenly px-6 mt-2">
          <span className="px-2 py-0.5 rounded-md bg-jobcardsecondary text-[#ffffff] text-xs font-medium">
            {job.salary}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-[#0A84FF] text-[#ffffff] text-xs font-medium">
            {job.applications} Applicants
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-evenly">
          <div className="flex items-center gap-6">
            <span className="text-[#b0b3b8] text-xs ml-1">Posted {job.appliedDate}</span>
            <span className="px-3 py-0.5 rounded-md bg-jobcardsecondary text-[#ffffff] text-xs">
              {job.department}
            </span>
            <span className="px-3 py-0.5 rounded-md bg-jobcardsecondary text-[#ffffff] text-xs">
              {job.jobType}
            </span>
          </div>
        </div>

        <div className="rounded-lg px-8 py-2 text-center border border-[rgba(42,42,42,1)]" style={{ backgroundColor: 'rgba(17, 17, 19, 1)' }}>
          <p className="text-[rgba(212, 212, 216, 1)] text-sm font-normal">
            {job.feedback}
          </p>
        </div>
        <div className="rounded-lg px-4 py-2 mb-4 border border-gray-400 border-opacity-20" style={{ backgroundColor: 'rgba(17, 17, 19, 1)' }}>
          <p className="text-xs text-jobcardforeground">
            <span className="text-xs font-medium text-jobcardtext mb-1">What You'll Do: </span>{job.responsiblities}
          </p>
        </div>
        <div className="flex items-center justify-around w-full">
          <button
            className="w-[67%] py-1 rounded-lg text-white bg-[rgba(10,132,255,1)] hover:opacity-90 transition-all duration-200 font-[700] text-[20px]"
            onClick={handleActionClick}
          >
            View Applicants
          </button>
        </div>
      </div>
    </div>
  );
}