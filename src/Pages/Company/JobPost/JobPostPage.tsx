/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobPostCard } from "./JobPostCard";
import companyServices from "@/services/companyServices";
import { toast } from "sonner";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  companyLogo?: string;
  appliedDate: string;
  status: string;
  nextStep?: string;
  nextStepDate?: string;
  feedback: string;
  department: string;
  jobType: string;
  location: string;
  salary: string;
  matchPercentage: string;
  skills: string[];
  applications: string;
  responsiblities: string;
  payPeriod?: string;
  type: string;
}

function ApplicationDetail({ application, onBackClick }: { application: Application | null; onBackClick: () => void }) {
  if (!application) return null;

  const statusLabels: Record<string, string> = {
    rejected: "Rejected",
    interview: "Interview",
    offer: "Offer Received",
    applied: "Applied",
    "in-progress": "In Progress",
    hired: "Hired",
    withdrawn: "Withdrawn",
    active: "Active",
  };

  const statusColors: Record<string, string> = {
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    interview: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    offer: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    applied: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "in-progress": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    hired: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
    withdrawn: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    active: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <Button variant="ghost" className="mb-4" onClick={onBackClick}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Job Posts
      </Button>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg w-12 h-12 flex items-center justify-center">
            <img
              src={application.companyLogo}
              alt={`${application.company} logo`}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-medium text-lg">{application.jobTitle}</h2>
            <p className="text-sm text-muted-foreground">{application.company}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Status</h3>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status] || statusColors.active}`}>
            {statusLabels[application.status] || "Active"}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Posted Date</h3>
          <p className="text-sm text-muted-foreground">{application.appliedDate}</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Location</h3>
          <p className="text-sm text-muted-foreground">{application.location}</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Department</h3>
          <p className="text-sm text-muted-foreground">{application.department}</p>
        </div>

        {application.nextStep && (
          <div>
            <h3 className="font-semibold text-sm">Next Step</h3>
            <p className="text-sm">{application.nextStep}</p>
            {application.nextStepDate && <p className="text-sm text-muted-foreground">{application.nextStepDate}</p>}
          </div>
        )}

        <div>
          <h3 className="font-semibold text-sm">Feedback</h3>
          <p className="text-sm">{application.feedback}</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Skills</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            {application.skills.map((skill) => (
              <span key={skill} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">{skill}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-1" />
            View Job Description
          </Button>
          {application.status === "offer" && (
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept Offer
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function JobsPostPage() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [jobs, setJobs] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [companyName, setCompanyName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await companyServices.getCompanyJobs();
        const formattedJobs: Application[] = response.map((job) => {
          let salary = "Unpaid";
          if (job.salaryMin && job.salaryMax) {
            const minNum = Number(job.salaryMin);
            const maxNum = Number(job.salaryMax);
            const min = Number.isInteger(minNum) ? minNum.toString() : minNum.toFixed(2).replace(/\.00$/, "");
            const max = Number.isInteger(maxNum) ? maxNum.toString() : maxNum.toFixed(2).replace(/\.00$/, "");
            const period = job.payPeriod === "yearly" ? "yr" : job.payPeriod === "hourly" ? "hr" : job.payPeriod
            salary = `$${min} - $${max}/${period}`;
          }
          return {
            id: job.id,
            jobTitle: job.title,
            company: job.company.companyName,
            companyLogo: job.company.logoUrl,
            appliedDate: new Date(job.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" }),
            status: job.status || "active",
            feedback: "Manage applications for this job posting.",
            department: job.company.industry,
            jobType: job.employmentType === "full_time" ? "Full Time" : 
              job.employmentType === "part_time" ? "Part Time" : 
              job.employmentType === "contract" ? "Contract" : 
              job.employmentType === "internship" ? "Internship" :
              job.employmentType || "Full Time",
            location: job.isRemote ? "Remote" : job.location,
            salary,
            matchPercentage: "N/A",
            payPeriod: job.payPeriod || "Yearly",
            skills: job.requirements ? job.requirements.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0) : [],
            applications: job.totalApplications,
            responsiblities: job.requirements || "No responsibilities provided.",
            type: job.type
          };
        });

        setJobs(formattedJobs);
        setCompanyName(response[0]?.company?.companyName || "Your Company");
      } catch (error) {
        toast.error(
          typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message || "Failed to fetch job postings"
            : "Failed to fetch job postings"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleActionClick = (jobId: string): void => {
    setSelectedApplication(jobId);
    navigate(`/company/dashboard/${jobId}/applications`);
  };

  const handleCardClick = (jobId: string): void => {
    navigate(`/company/dashboard/job/${jobId}`);
  };

  const filteredApplications = jobs.filter((app) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return app.status === "active";
    if (activeTab === "interviews") return app.status === "interview";
    if (activeTab === "offers") return app.status === "offer";
    return true;
  });

  const selectedApplicationDetails = jobs.find((app) => app.id === selectedApplication);

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="w-full px-12 py-8">
      <div className="absolute w-full flex justify-center left-0 right-0">
        <p className="text-[40px] text-white font-[700] text-center">
          <span className="text-[rgba(10,132,255,1)]">{companyName} </span>Job Posts
        </p>
      </div>
      <div className="mt-36">
        <AnimatePresence mode="wait">
          {selectedApplication ? (
            <ApplicationDetail
              key="application-detail"
              application={selectedApplicationDetails || null}
              onBackClick={() => setSelectedApplication(null)}
            />
          ) : (
            <motion.div
              key="application-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsContent value={activeTab}>
                  <div className="grid [@media(max-width:412px)]:grid-cols-1 grid-cols-3 gap-x-10 gap-y-10 [@media(max-width:1024px)]:grid-cols-2">
                    {filteredApplications.length > 0 ? (
                      filteredApplications.map((app) => (
                        <JobPostCard
                          key={app.id}
                          job={app}
                          onActionClick={handleActionClick}
                          onCardClick={handleCardClick}
                        />
                      ))
                    ) : (
                      <p className="text-white text-center col-span-3">No job postings found.</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
