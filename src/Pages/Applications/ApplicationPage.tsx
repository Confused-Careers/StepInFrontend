import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ChevronLeft, X } from "lucide-react";
import { JobApplicationCard } from "./ApplicationsCard";
import applicationServices from "@/services/applicationServices";
import { toast } from "sonner";
import InteractiveJobCard from "../Dashboard/InteractiveJobCard";
import { jobServices } from "@/services/jobServices";

enum ApplicationStatus {
  APPLIED = 'applied',
  IN_PROGRESS = 'in_progress',
  INTERVIEW = 'interview',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  HIRED = 'hired',
}

interface Application {
  id: string;
  job: {
    id: string;
    title: string;
    employmentType: string;
    location: string;
    isRemote: boolean;
    salaryMin?: number;
    salaryMax?: number;
    requiredSkills?: string[];
    department?: string;
    description?: string;
    payPeriod?: string;
  };
  company: {
    companyName: string;
    logoUrl?: string;
    industry?: string;
  };
  applicationDate: string;
  status: ApplicationStatus | 'first-round' | 'under-review' | 'offer';
  nextStep?: string;
  nextStepDate?: string;
  feedback?: string;
  matchScore?: number;
}

function ApplicationDetail({ application, onBackClick }: { application: Application | null; onBackClick: () => void }) {
  const [showJobDescription, setShowJobDescription] = useState(false);
  
  if (!application) return null;

  const formatEmploymentType = (type?: string) => {
    if (!type) return "N/A";
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

  const statusLabels = {
    "rejected": "Rejected",
    "interview": "Interview",
    "offer": "Offer Received",
    "applied": "Applied",
    "first-round": "First Round",
    "under-review": "Under Review"
  };

  const statusColors = {
    "rejected": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "interview": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "offer": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "applied": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "first-round": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
    "under-review": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
      <Button variant="ghost" className="mb-4" onClick={onBackClick}>
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Applications
      </Button>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg w-12 h-12 flex items-center justify-center">
            <img
              src={application.company.logoUrl || ""}
              alt={`${application.company.companyName} logo`}
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-medium text-lg">{application.job.title}</h2>
            <p className="text-sm text-muted-foreground">{application.company.companyName}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Status</h3>
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[application.status as keyof typeof statusColors] || statusColors.applied}`}>
            {statusLabels[application.status as keyof typeof statusLabels] || "Applied"}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Applied Date</h3>
          <p className="text-sm text-muted-foreground">{application.applicationDate}</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Location</h3>
          <p className="text-sm text-muted-foreground">{application.job.location}</p>
        </div>

        <div>
          <h3 className="font-semibold text-sm">Employment Type</h3>
          <p className="text-sm text-muted-foreground">{formatEmploymentType(application.job.employmentType)}</p>
        </div>

        {(application.job.salaryMin || application.job.salaryMax) && (
          <div>
            <h3 className="font-semibold text-sm">Salary Range</h3>
            <p className="text-sm text-muted-foreground">
              {(() => {
                let salary = "Unpaid";
                const min = application.job.salaryMin;
                const max = application.job.salaryMax;
                const period = application.job.payPeriod
                  ? application.job.payPeriod.charAt(0).toUpperCase() + application.job.payPeriod.slice(1)
                  : "Yearly";
                if (min && max) {
                  salary = `$${parseFloat(String(min)).toLocaleString()} - $${parseFloat(String(max)).toLocaleString()}/${period}`;
                }
                return salary;
              })()}
            </p>
          </div>
        )}

        {application.job.requiredSkills && application.job.requiredSkills.length > 0 && (
          <div>
            <h3 className="font-semibold text-sm">Required Skills</h3>
            <div className="flex flex-wrap gap-2 mt-1">
              {application.job.requiredSkills.map((skill: string) => (
                <span key={skill} className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-xs">{skill}</span>
              ))}
            </div>
          </div>
        )}

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

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowJobDescription(true)}>
            <FileText className="h-4 w-4 mr-1" />
            View Job Description
          </Button>
          {application.status === "offer" && (
            <Button
              size="sm"
              onClick={() => applicationServices.acceptOffer(application.id).then(() => toast.success("Offer accepted")).catch((err) => toast.error(err.message))}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Accept Offer
            </Button>
          )}
        </div>
      </div>

      {showJobDescription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Job Description</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Detailed information about the position</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowJobDescription(false)}
                  className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">{application.job.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{application.company.companyName}</p>
                </div>
                
                {application.job.description ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About the Role</h4>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {application.job.description}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No job description available</p>
                    <p className="text-sm mt-2">The company hasn't provided a detailed description for this position.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSavedJobs, setIsLoadingSavedJobs] = useState(false);
  const hasFetched = useRef(false);

  // Define status priority for sorting
  const statusPriority: Record<string, number> = {
    offer: 1,
    interview: 2,
    "first-round": 3,
    "under-review": 4,
    applied: 5,
    in_progress: 6,
    hired: 7,
    rejected: 8,
    withdrawn: 9,
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAllApplications();
      fetchSavedJobs();
      hasFetched.current = true;
    }
  }, []);

  const fetchAllApplications = async () => {
    setIsLoading(true);
    try {
      const { applications } = await applicationServices.getUserApplications({
        page: 1,
        limit: 100,
      });

      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          try {
            const jobDetails = await applicationServices.getJobDetails(app.job.id);
            return {
              ...app,
              job: {
                ...app.job,
                ...jobDetails,
                company: app.job.company ?? app.company,
              },
            };
          } catch (error) {
            console.error(`Error fetching job details for job ${app.job.id}:`, error);
            return app;
          }
        })
      );
      setAllApplications(enrichedApplications);
    } catch (error: unknown) {
      console.error('Fetch applications error:', error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    setIsLoadingSavedJobs(true);
    try {
      const response = await jobServices.getMySavedJobs({
        page: 1,
        limit: 100,
      });
      
      const savedJobsWithExplanations = await Promise.all(
        (response?.savedJobs || []).map(async (savedJob: any) => {
          try {
            const matchExplanation = await jobServices.getMatchExplanation(savedJob.job.id);
            return {
              ...savedJob,
              job: {
                ...savedJob.job,
                matchExplanation: matchExplanation,
              },
            };
          } catch (error) {
            console.error(`Error fetching match explanation for job ${savedJob.job.id}:`, error);
            return savedJob;
          }
        })
      );
      
      setSavedJobs(savedJobsWithExplanations);
    } catch (error: unknown) {
      console.error('Fetch saved jobs error:', error);
      toast.error("Failed to load saved jobs");
    } finally {
      setIsLoadingSavedJobs(false);
    }
  };

  const handleActionClick = (jobId: string): void => {
    setSelectedApplication(jobId);
  };

  const handleJobAction = async (action: "save" | "apply" | "reject", jobId: string) => {
    try {
      if (action === "save") {
        await jobServices.unsaveJob(jobId);
        toast.success("Job removed from saved jobs");
        fetchSavedJobs();
      } else if (action === "apply") {
        toast.success("Application submitted!");
      } else if (action === "reject") {
        toast.success("Job removed from saved jobs");
        fetchSavedJobs();
      }
    } catch (error) {
      console.error(`Failed to ${action} job:`, error);
      toast.error(`Failed to ${action} job`);
    }
  };

  const sortApplicationsByStatus = (applications: Application[]) => {
    return [...applications].sort((a, b) => {
      const priorityA = statusPriority[a.status] || 999;
      const priorityB = statusPriority[b.status] || 999;
      return priorityA - priorityB;
    });
  };

  const filteredApplications = allApplications.filter((app) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return app.status === "applied" || app.status === "under-review";
    if (activeTab === "in_progress") return app.status === "in_progress";
    if (activeTab === "interview") return app.status === "interview" || app.status === "first-round";
    if (activeTab === "hired") return app.status === "offer" || app.status === "hired";
    if (activeTab === "rejected") return app.status === "rejected";
    return true;
  });

  const sortedApplications = sortApplicationsByStatus(filteredApplications);

  const selectedApplicationDetails = allApplications.find((app) => app.id === selectedApplication);

  return (
    <div className="w-full px-6 py-4">
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
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="interview">Interviews</TabsTrigger>
                <TabsTrigger value="hired">Offers/Hired</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="saved">Saved Jobs</TabsTrigger>
              </TabsList>

              {["all", "active", "in_progress", "interview", "hired", "rejected"].map((tab) => (
                <TabsContent key={tab} value={tab}>
                  {isLoading ? (
                    <p>Loading applications...</p>
                  ) : sortedApplications.length === 0 ? (
                    <p className="text-center text-muted-foreground">No applications found</p>
                  ) : (
                    <div className="grid [@media(max-width:744px)]:grid-cols-1 [@media(max-width:1097px)]:grid-cols-2 grid-cols-3 gap-x-8 gap-y-10">
                      {sortedApplications.map((app) => {
                        const formatEmploymentType = (type?: string) => {
                          if (!type) return "N/A";
                          const typeMap: Record<string, string> = {
                            full_time: "Full-Time",
                            part_time: "Part-Time",
                            contract: "Contract",
                            internship: "Internship",
                          };
                          return (
                            typeMap[type] ||
                            type
                              .split("_")
                              .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                              .join("-")
                          );
                        };

                        return (
                          <JobApplicationCard
                            key={app.id}
                            job={{
                              id: app.id,
                              status: app.status,
                              company: app.company.companyName,
                              companyLogo: app.company.logoUrl,
                              jobTitle: app.job.title,
                              location: app.job.location,
                              department: app.company.industry ?? "General",
                              jobType: formatEmploymentType(app.job.employmentType),
                              appliedDate: app.applicationDate,
                              salary:
                                app.job.salaryMin && app.job.salaryMax
                                  ? `$${parseFloat(String(app.job.salaryMin)).toLocaleString()} - $${parseFloat(
                                      String(app.job.salaryMax)
                                    ).toLocaleString()}/${app.job.payPeriod}`
                                  : "Unpaid",
                              matchPercentage: app.matchScore ? `${Math.round(app.matchScore)}%` : "N/A",
                              feedback: app.feedback ?? "",
                              interviewDate: app.nextStepDate,
                            }}
                            onActionClick={handleActionClick}
                          />
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              ))}

              <TabsContent value="saved">
                {isLoadingSavedJobs ? (
                  <p>Loading saved jobs...</p>
                ) : savedJobs.length === 0 ? (
                  <p className="text-center text-muted-foreground">No saved jobs found</p>
                ) : (
                  <div className="grid [@media(max-width:744px)]:grid-cols-1 [@media(max-width:1097px)]:grid-cols-2 grid-cols-3 gap-x-8 gap-y-10">
                    {savedJobs.map((savedJob, index) => {
                      const job = savedJob.job;
                      return (
                        <InteractiveJobCard
                          key={savedJob.id || index}
                          id={job.id}
                          logo={job.company?.logoUrl || ""}
                          title={job.title}
                          company={job.company?.companyName || job.company}
                          location={job.location}
                          tags={job.requiredSkills || []}
                          salary={job.salary}
                          salaryRange={job.salaryMin && job.salaryMax}
                          matchPercentage={job.matchScore ? parseFloat(job.matchScore) : 0}
                          description={job.description || ""}
                          responsibilities={job.responsibilities || ""}
                          jobType={job.employmentType || "Full-Time"}
                          postedDate={new Date(job.createdAt || Date.now()).toLocaleDateString()}
                          whyYouFit={job.matchExplanation?.explanation || "This role aligns well with your background and skills."}
                          aiSummary={
                            job.matchExplanation?.explanation ||
                            "Based on your profile, this position offers a great opportunity for growth and matches your career goals."
                          }
                          fullJobDescription={job.description || ""}
                          fullResponsibilities={job.responsibilities || ""}
                          companyDescription={job.companyDescription || ""}
                          isSaved={true}
                          isApplied={false}
                          onAction={(action, jobId) => {
                            handleJobAction(action, jobId);
                          }}
                        />
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}