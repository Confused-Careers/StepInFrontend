/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ApplicantsCard } from "./ApplicantsCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ApplicantsService, ApplicantCardDto, ListApplicantsRequestDto, SearchApplicantsRequestDto } from "../../../services/applicantServices";
import debounce from "lodash/debounce";
import { Sparkles, Loader2 } from "lucide-react";

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
  // AI search specific fields
  relevanceScore?: number;
  matchingHighlights?: string[];
  skillsScore?: number;
  cultureScore?: number;
  hasCultureData?: boolean;
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [openSchedule, ] = useState<boolean>(false);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [allApplicants, setAllApplicants] = useState<Applicant[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
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
          currentCompany: dto.currentCompany || dto.latestExperience?.companyName || "Not specified",
          currentPosition: dto.currentPosition || dto.latestExperience?.positionTitle || "Not specified",
          strength: dto.strengths || [],
          weakness: dto.weaknesses || [],
          match: dto.matchPercentage ? Math.round(dto.matchPercentage).toString() : "0",
          location: dto.location || "Not specified",
          imageUrl: dto.profilePictureUrl || null,
          resumeUrl: dto.resumeUrl ?? "",
          status: dto.applicationStatus || "Pending",
          relevanceScore: dto.relevanceScore,
          matchingHighlights: dto.matchingHighlights,
          skillsScore: dto.skillsScore,
          cultureScore: dto.cultureScore,
          hasCultureData: dto.hasCultureData,
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

  const searchApplicants = useCallback(
    async (query: string, tags: string[]) => {
      if (!query && tags.length === 0) {
        // If no search query or tags, show all applicants
        setApplicants(allApplicants);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const searchRequest: SearchApplicantsRequestDto = {
          query,
          jobId,
          limit: 50,
          filters: {
            skills: tags.length > 0 ? tags : undefined,
          },
        };

        const response = await ApplicantsService.searchJobApplicants(searchRequest);
        
        // Map the search results to the Applicant interface
        const mappedApplicants: Applicant[] = response.data.map((dto: ApplicantCardDto) => ({
          latestExperience: dto.latestExperience || {},
          id: dto.applicationId || dto.jobSeekerId || "",
          userId: dto.userId,
          name: `${dto.firstName} ${dto.lastName}`,
          education: dto.latestEducation
            ? `${dto.latestEducation.degreeType} in ${dto.latestEducation.fieldOfStudy}, ${dto.latestEducation.institutionName}`
            : "Not specified",
          currentCompany: dto.currentCompany || dto.latestExperience?.companyName || "Not specified",
          currentPosition: dto.currentPosition || dto.latestExperience?.positionTitle || "Not specified",
          strength: dto.strengths || [],
          weakness: dto.weaknesses || [],
          match: dto.matchPercentage ? Math.round(dto.matchPercentage).toString() : "0",
          location: dto.location || "Not specified",
          imageUrl: dto.profilePictureUrl || null,
          resumeUrl: dto.resumeUrl ?? "",
          status: dto.applicationStatus || "Pending",
          relevanceScore: dto.relevanceScore,
          matchingHighlights: dto.matchingHighlights,
          skillsScore: dto.skillsScore,
          cultureScore: dto.cultureScore,
          hasCultureData: dto.hasCultureData,
        }));

        setApplicants(mappedApplicants);
        
        if (mappedApplicants.length === 0) {
          toast.info("No matching candidates found. Try adjusting your search query.");
        }
      } catch (error: any) {
        console.error("Error searching applicants:", error);
        
        // Check if it's a timeout error
        if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
          toast.info("AI search is taking longer than expected. Please wait...", {
            duration: 5000,
          });
          // Don't fall back to client-side filtering for timeout errors
        } else {
          toast.error("Failed to search applicants. Falling back to basic search.");
          // Fallback to client-side filtering only for other errors
          const filtered = filterApplicants(query, tags, allApplicants);
          setApplicants(filtered);
        }
      } finally {
        setIsSearching(false);
      }
    },
    [jobId, allApplicants]
  );

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
      searchApplicants(query, tags);
    }, 300),
    [searchApplicants]
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
          <div className="flex items-center justify-center gap-2 flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className={`h-5 w-5 text-[rgba(10,132,255,1)] ${isSearching ? 'animate-pulse' : ''}`} />
              <span className="text-sm text-gray-400">
                {isSearching ? 'AI is analyzing candidates...' : 'AI-Powered Search'}
              </span>
            </div>
            <Input
              type="search"
              placeholder="Try: 'experienced developer with React skills' or 'marketing manager with leadership experience'"
              className="rounded-full h-[45px] border border-[rgba(209,209,214,1)] text-white bg-[rgba(26,31,43,1)] w-full max-w-2xl"
              value={searchQuery}
              onChange={handleSearchInputChange}
              disabled={isSearching}
            />
            <div className="flex gap-2 mt-2">
              <span className="text-xs text-gray-500">Examples:</span>
              <button
                className={`text-xs transition-colors ${isSearching ? 'text-gray-500 cursor-not-allowed' : 'text-[rgba(10,132,255,0.8)] hover:text-[rgba(10,132,255,1)]'}`}
                onClick={() => {
                  if (!isSearching) {
                    setSearchQuery("frontend developer with 3+ years experience");
                    debouncedSearch("frontend developer with 3+ years experience", selectedTags);
                  }
                }}
                disabled={isSearching}
              >
                "frontend developer with 3+ years"
              </button>
              <span className="text-xs text-gray-500">•</span>
              <button
                className={`text-xs transition-colors ${isSearching ? 'text-gray-500 cursor-not-allowed' : 'text-[rgba(10,132,255,0.8)] hover:text-[rgba(10,132,255,1)]'}`}
                onClick={() => {
                  if (!isSearching) {
                    setSearchQuery("data scientist with machine learning background");
                    debouncedSearch("data scientist with machine learning background", selectedTags);
                  }
                }}
                disabled={isSearching}
              >
                "data scientist with ML"
              </button>
              <span className="text-xs text-gray-500">•</span>
              <button
                className={`text-xs transition-colors ${isSearching ? 'text-gray-500 cursor-not-allowed' : 'text-[rgba(10,132,255,0.8)] hover:text-[rgba(10,132,255,1)]'}`}
                onClick={() => {
                  if (!isSearching) {
                    setSearchQuery("team leader who has managed remote teams");
                    debouncedSearch("team leader who has managed remote teams", selectedTags);
                  }
                }}
                disabled={isSearching}
              >
                "team leader with remote experience"
              </button>
            </div>
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
                {isSearching && searchQuery && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 text-[rgba(10,132,255,1)] animate-spin mb-4" />
                    <p className="text-white text-lg font-medium mb-2">AI is searching for candidates...</p>
                    <p className="text-gray-400 text-sm">This may take up to 30 seconds for complex queries</p>
                  </div>
                )}
                {!isSearching && (
                  <div className="grid [@media(max-width:412px)]:grid-cols-1 grid-cols-3 gap-x-11 gap-y-11 [@media(max-width:1024px)]:grid-cols-2">
                    {applicants.length > 0 ? (
                      applicants.map((app) => <ApplicantsCard key={app.id} applicant={app} />)
                    ) : (
                      <div className="text-white text-center col-span-3">
                        {searchQuery ? 'No matching candidates found. Try a different search query.' : 'No candidates found.'}
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </AnimatePresence>
      </div>    </div>
  );
}