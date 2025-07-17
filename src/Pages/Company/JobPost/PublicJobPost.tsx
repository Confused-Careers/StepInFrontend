import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, MessageCircle } from "lucide-react";
import { jobServices } from "@/services/jobServices";
import { useParams, useNavigate } from "react-router-dom";

interface Company {
  id: string;
  companyName: string;
  logoUrl: string | null;
  companySize: string;
  industry: string;
  location: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities: string;
  employmentType: string;
  experienceLevel: string;
  salaryMin: string;
  salaryMax: string;
  payPeriod: string;
  salaryCurrency: string;
  location: string;
  isRemote: boolean;
  applicationDeadline: string;
  status: string;
  viewsCount: number;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
  company: Company;
  category: string | null;
  requiredSkills: string[];
  requiredLanguages: string[];
  requiredCertifications: string[];
  requiredEducation: string[];
  hasApplied: boolean;
  isSaved: boolean;
  applicationId: string | null;
  matchScore: number | null;
}


export function JobPostingPage() {
  const [isApplying] = useState<boolean>(false);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true);
      try {
        const response = await jobServices.getJobById(jobId!);
        setJob(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const hasValidImage = (imageUrl?: string | null): boolean => {
    return imageUrl !== null && 
           imageUrl !== undefined && 
           imageUrl.trim() !== "" && 
           imageUrl !== " ";
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen mt-16">
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-[#0a0a0a] text-white min-h-screen mt-16">
        <div className="min-h-screen bg-[#0a0a0a] text-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p>Job not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen mt-16">
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <p className="text-xl text-gray-400">{job.company.companyName} · {job.location}</p>
              </div>

              <div className="rounded-lg p-6 bg-gradient-to-r from-[#050B1A] to-[#0F172A] border border-[#2A2F40]">
                <h2 className="text-xl font-semibold mb-4">Why this role</h2>
                <div className="space-y-3 text-gray-300">
                  <p>· {job.description}</p>
                </div>
              </div>

              <div className="rounded-lg p-6 bg-gradient-to-r from-[#050B1A] to-[#0F172A] border border-[#2A2F40]">
                <h2 className="text-xl font-semibold mb-4">Responsibilities</h2>
                <div className="space-y-3 text-gray-300">
                  <p>· {job.responsibilities}</p>
                  <p className="text-blue-400 cursor-pointer hover:underline">see more</p>
                </div>
              </div>

              <div className="rounded-lg p-6 bg-gradient-to-r from-[#050B1A] to-[#0F172A] border border-[#2A2F40]">
                <h2 className="text-xl font-semibold mb-4">Qualifications</h2>
                <div className="space-y-3 text-gray-300">
                  <p>· {job.requirements}</p>
                  <p className="text-blue-400 cursor-pointer hover:underline">see more</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1 flex justify-center lg:justify-start">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="rounded-2xl p-6 sticky top-8 bg-gradient-to-b from-[#050B1A] to-[#0F172A] border relative overflow-hidden flex flex-col"
                style={{
                  width: '100%',
                  maxWidth: '326px',
                  height: '547px',
                  boxShadow: '0px 0px 12px 0px #0A84FF80',
                  border: '1px solid #0A84FF'
                }}
              >
                <div className="flex justify-center mb-12">
                  {hasValidImage(job.company.logoUrl) ? (
                    <div className="p-1 sm:p-2 rounded-lg w-20 h-20 flex items-center justify-center flex-shrink-0">
                      <img 
                        src={job.company.logoUrl ?? undefined}
                        width={96} 
                        height={96} 
                        className="object-contain rounded-md w-full h-full" 
                        alt={`${job.company.logoUrl ?? ""}'s photo`}
                      />
                    </div>
                  ) : (
                    <div className="p-1 sm:p-2 rounded-lg w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center flex-shrink-0" />
                  )}
                </div>

                <button
                  onClick={() => navigate("/individual-login")}
                  className="w-full bg-[#0A84FF] text-white h-12 rounded-xl font-[600] text-[22px] leading-none transition-all duration-200 hover:bg-[#0876E8] disabled:opacity-50 mb-12"
                  disabled={isApplying}
                >
                  {"Apply in < 2 minutes"}
                </button>

                <div className="flex flex-col gap-10">
                  <div className="flex justify-center">
                    <div 
                      className="rounded-lg h-[31px] px-4 py-2 text-white bg-gradient-to-r from-[rgba(26,52,78,0.5)] to-[#03284D] flex items-center justify-center"
                      style={{
                        width: '168px',
                        height: '31px',
                        fontWeight: 600,
                        fontSize: '20px',
                        lineHeight: '100%',
                        textAlign: 'center'
                      }}
                    >
                      ${parseFloat(job.salaryMin).toLocaleString()} - ${parseFloat(job.salaryMax).toLocaleString()} /{job.payPeriod}
                    </div>
                  </div>

                  <div className="space-y-8 px-4">
                    <div className="flex items-center gap-3 font-medium text-xl leading-none">
                      <MapPin className="w-5 h-5 text-blue-400" />
                      <span>{job.location}{job.isRemote ? " (Remote)" : ""}</span>
                    </div>

                    <div className="flex items-center gap-3 font-medium text-xl whitespace-nowrap leading-none">
                      <Clock className="w-5 h-5 text-blue-400" />
                      <span>
                        {job.applicationDeadline
                          ? `Apply by ${new Date(job.applicationDeadline).toLocaleDateString()}`
                          : "Rolling Applications"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <button
                    className="w-full h-[45px] bg-transparent text-blue-400 hover:bg-blue-600/10 rounded-md border border-[#0A84FF] font-bold text-[24px] leading-[140%] flex items-center justify-center gap-2 transition-all duration-200"
                    onClick={() => navigate("/individual-login")}
                  >
                    <MessageCircle className="w-5 h-5" />
                    Talk to StepIn AI
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}