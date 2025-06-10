import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, ChevronLeft } from "lucide-react";
import { JobApplicationCard } from "./ApplicationsCard";
import applicationServices from "@/services/applicationServices";
import { toast } from "sonner";

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
  };
  company: {
    companyName: string;
    logoUrl?: string;
  };
  applicationDate: string;
  status: ApplicationStatus | 'first-round' | 'under-review' | 'offer';
  nextStep?: string;
  nextStepDate?: string;
  feedback?: string;
  matchScore?: number;
}

function ApplicationDetail({ application, onBackClick }: { application: Application | null; onBackClick: () => void }) {
  if (!application) return null;

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
          <div className="bg-white p-2 rounded-lg w-12 h-12 flex items-center justify-center">
            <img
              src={application.company.logoUrl || "/placeholder-logo.png"}
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
          <p className="text-sm text-muted-foreground">{application.job.employmentType}</p>
        </div>

        {(application.job.salaryMin || application.job.salaryMax) && (
          <div>
            <h3 className="font-semibold text-sm">Salary Range</h3>
            <p className="text-sm text-muted-foreground">
              {application.job.salaryMin && application.job.salaryMax
                ? `$${application.job.salaryMin.toLocaleString()} - $${application.job.salaryMax.toLocaleString()} USD`
                : application.job.salaryMin
                ? `$${application.job.salaryMin.toLocaleString()} USD`
                : `$${application.job.salaryMax?.toLocaleString()} USD`}
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
          <Button variant="outline" size="sm">
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
    </motion.div>
  );
}

export default function ApplicationsPage() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchAllApplications();
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
      // Fetch job details for each application
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          try {
            const jobDetails = await applicationServices.getJobDetails(app.job.id);
            return {
              ...app,
              job: {
                ...app.job,
                ...jobDetails, // Override with detailed job data
              },
            };
          } catch (error) {
            console.error(`Error fetching job details for job ${app.job.id}:`, error);
            return app; // Fallback to original application data
          }
        })
      );
      setAllApplications(enrichedApplications);
      toast.success("Applications loaded successfully");
    } catch (error: unknown) {
      console.error('Fetch applications error:', error);
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (jobId: string): void => {
    setSelectedApplication(jobId);
  };

  const filteredApplications = allApplications.filter(app => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return app.status === "applied" || app.status === "under-review";
    if (activeTab === "interviews") return app.status === "interview" || app.status === "first-round";
    if (activeTab === "offers") return app.status === "offer";
    return true;
  });

  const selectedApplicationDetails = allApplications.find(app => app.id === selectedApplication);

  return (
    <div className="w-full px-6 py-4">
      <AnimatePresence mode="wait">
        {selectedApplication ? (
          <ApplicationDetail key="application-detail" application={selectedApplicationDetails || null} onBackClick={() => setSelectedApplication(null)} />
        ) : (
          <motion.div key="application-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="interviews">Interviews</TabsTrigger>
                <TabsTrigger value="offers">Offers</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {isLoading ? (
                  <p>Loading applications...</p>
                ) : filteredApplications.length === 0 ? (
                  <p className="text-center text-muted-foreground">No applications found</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-16 gap-y-10">
                    {filteredApplications.map(app => (
                      <JobApplicationCard
                        key={app.id}
                        job={{
                          id: app.id,
                          status: app.status,
                          company: app.company.companyName,
                          companyLogo: app.company.logoUrl,
                          jobTitle: app.job.title,
                          location: app.job.location,
                          department: app.job.department ?? "General",
                          jobType: app.job.employmentType,
                          appliedDate: app.applicationDate,
                          salary: app.job.salaryMin && app.job.salaryMax
                            ? `$${app.job.salaryMin.toLocaleString()} - $${app.job.salaryMax.toLocaleString()}`
                            : "N/A",
                          matchPercentage: app.matchScore ? `${app.matchScore}%` : "N/A",
                          feedback: app.feedback ?? "",
                          interviewDate: app.nextStepDate,
                        }}
                        onActionClick={handleActionClick}
                      />
                    ))}
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