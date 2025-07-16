/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ApplicantsCard } from "./ApplicantsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { ApplicantsService, ApplicantCardDto, ListApplicantsRequestDto } from "../../../services/applicantServices";
import debounce from "lodash/debounce";

export interface Applicant {
  latestExperience: any;
  id: string;
  userId: string;
  name: string;
  education: string;
  currentCompany: string;
  currentPosition: string;
  strength: string[];
  weakness: string[];
  match: string;
  location: string;
  resumeUrl: string | URL;
  imageUrl?: string | null;
  status: string;
}

interface Tag {
  id: string;
  label: string;
}

interface Schedule {
  id: string;
  name: string;
  month: string;
  date: string;
  time: string;
}

// Mock schedule data
const mockSchedules: Schedule[] = [
  {
    id: "1",
    name: "John Smith",
    month: "Jun",
    date: "15",
    time: "10:00 AM"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    month: "Jun",
    date: "16",
    time: "2:30 PM"
  },
  {
    id: "3",
    name: "Michael Brown",
    month: "Jun",
    date: "17",
    time: "11:15 AM"
  },
  {
    id: "4",
    name: "Emily Davis",
    month: "Jun",
    date: "18",
    time: "3:45 PM"
  },
  {
    id: "5",
    name: "David Wilson",
    month: "Jun",
    date: "19",
    time: "9:30 AM"
  },
  {
    id: "6",
    name: "Lisa Garcia",
    month: "Jun",
    date: "20",
    time: "1:00 PM"
  }
];

export default function CompanyApplicationsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openSchedule, ] = useState<boolean>(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [allApplicants, setAllApplicants] = useState<Applicant[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const { jobId } = useParams<{ jobId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!jobId) {
        toast.error("Job ID is missing");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // Fetch applicants
        const request: ListApplicantsRequestDto = {
          jobId,
          page: 1,
          limit: 20,
          sortBy: "applicationDate",
          sortOrder: "desc",
        };
        const response = await ApplicantsService.getJobApplicants(request);
        const applicantData = Array.isArray(response.data) ? response.data : [];
        const mappedApplicants: Applicant[] = applicantData.map((dto: ApplicantCardDto) => ({
          latestExperience: dto.latestExperience || {},
          id: dto.applicationId || dto.jobSeekerId || "",
          userId: dto.userId,
          name: `${dto.firstName} ${dto.lastName}`,
          education: dto.latestEducation
            ? `${dto.latestEducation.degreeType} in ${dto.latestEducation.fieldOfStudy}, ${dto.latestEducation.institutionName}`
            : "Not specified",
          currentCompany: dto.latestExperience?.companyName || "Not specified",
          currentPosition: dto.currentPosition || "Not specified",
          strength: dto.strengths || [],
          weakness: dto.weaknesses || [],
          match: dto.matchPercentage ? Math.round(dto.matchPercentage).toString() : "0",
          location: dto.location || "Not specified",
          imageUrl: dto.profilePictureUrl || null,
          resumeUrl: dto.resumeUrl ?? "",
          status: dto.applicationStatus || "Pending",
        }));
        setApplicants(mappedApplicants);
        setAllApplicants(mappedApplicants);

        // Extract tags
        const allTags = mappedApplicants.flatMap((app) => [...app.strength, ...app.weakness]);
        const uniqueTags = Array.from(new Set(allTags)).map((label, index) => ({
          id: `tag-${index}`,
          label,
        }));
        setTags(uniqueTags);

        // Use mock schedules instead of API call
        setSchedules(mockSchedules);
      } catch (error) {
        toast.error("Failed to fetch data");
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [jobId]);

  const filterApplicants = useCallback(
    (query: string, tags: string[], applicants: Applicant[]) => {
      return applicants.filter((app) => {
        const queryLower = query.toLowerCase();
        const matchesQuery =
          !query ||
          app.name?.toLowerCase().includes(queryLower) ||
          app.education?.toLowerCase().includes(queryLower) ||
          app.latestExperience.companyName?.toLowerCase().includes(queryLower) ||
          app.currentPosition?.toLowerCase().includes(queryLower) ||
          app.location?.toLowerCase().includes(queryLower) ||
          app.strength?.some((s) => s.toLowerCase().includes(queryLower)) ||
          app.weakness?.some((w) => w.toLowerCase().includes(queryLower));

        const matchesTags =
          tags.length === 0 ||
          tags.every((tag) => app.strength.includes(tag) || app.weakness.includes(tag));

        return matchesQuery && matchesTags;
      });
    },
    []
  );

  const debouncedSearch = useCallback(
    debounce((query: string, tags: string[]) => {
      const filtered = filterApplicants(query, tags, allApplicants);
      setApplicants(filtered);
    }, 300),
    [allApplicants, filterApplicants]
  );

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value, selectedTags);
  };

  const handleTagClick = (tagLabel: string) => {
    const newSelectedTags = selectedTags.includes(tagLabel) 
      ? selectedTags.filter((t) => t !== tagLabel) 
      : [...selectedTags, tagLabel];
    
    setSelectedTags(newSelectedTags);
    debouncedSearch(searchQuery, newSelectedTags);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setApplicants(allApplicants);
  };

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="w-full px-12 py-8">
      <div className="relative w-full flex justify-center">
        <h1 className="text-[40px] text-white font-[700] text-center">
          <span className="text-[rgba(10,132,255,1)]">Candidates</span>
        </h1>
      </div>
      <div className="relative w-full flex justify-center flex-row mt-16 gap-7">
        <div className="relative w-full flex justify-center flex-col">
          <div className="flex items-center justify-center">
            <Input
              type="search"
              placeholder="Search candidates..."
              className="rounded-full h-[45px] border border-[rgba(209,209,214,1)] text-white bg-[rgba(26,31,43,1)]"
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
          </div>
          <div className="flex flex-wrap flex-row items-center gap-2 mt-6 mr-4 justify-center">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className={`text-[14px] font-medium px-3 py-1.5 rounded-[10px] border cursor-pointer ${
                  selectedTags.includes(tag.label)
                    ? "bg-[rgba(10,132,255,0.2)] text-white"
                    : "text-[rgba(10,132,255,1)] bg-black"
                }`}
                style={{ border: "1px solid rgba(10, 132, 255, 0.4)", boxShadow: "0 0 15px rgba(10, 132, 255, 0.3)" }}
                onClick={() => handleTagClick(tag.label)}
              >
                {tag.label}
              </span>
            ))}
            {(searchQuery || selectedTags.length > 0) && (
              <Button
                variant="outline"
                className="text-[rgba(10,132,255,1)] text-[14px] border-[rgba(10,132,255,0.4)] rounded-[10px] px-3 py-1.5"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
      {openSchedule && (
        <div className="relative w-full flex justify-center flex-col mt-10">
          <h3 className="pl-16 font-bold text-[rgba(10,132,255,1)] text-[24px] mb-2">Upcoming Interviews</h3>
          <div
            className="w-full rounded-2xl overflow-hidden border bg-black px-16 py-5 grid grid-cols-3 gap-y-7 gap-x-7"
            style={{ border: "1px solid rgba(10, 132, 255, 0.4)", boxShadow: "0 0 15px rgba(20, 132, 255, 0.3)" }}
          >
            {schedules.length > 0 ? (
              schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="text-[20px] text-white font-bold flex justify-center items-center"
                >
                  {schedule.name}{" "}
                  <span className="text-[rgba(10,132,255,1)]">
                    {" "}
                    - {schedule.month} {schedule.date} @ {schedule.time}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-white text-center col-span-3">No interviews scheduled.</div>
            )}
          </div>
        </div>
      )}
      <div className="mt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key="application-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsContent value={activeTab}>
                <div className="grid [@media(max-width:412px)]:grid-cols-1 grid-cols-3 gap-x-11 gap-y-11 [@media(max-width:1024px)]:grid-cols-2">
                  {applicants.length > 0 ? (
                    applicants.map((app) => <ApplicantsCard key={app.id} applicant={app} />)
                  ) : (
                    <div className="text-white text-center col-span-3">No candidates found.</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </div>    </div>
  );
}