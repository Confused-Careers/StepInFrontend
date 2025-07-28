import { useState } from "react";
import { Search, Sparkles, Loader2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import companyServices from "@/services/companyServices";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ApplicantSearchResult {
  applicationId: string;
  jobSeekerId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  resumeUrl: string | null;
  currentPosition: string | null;
  currentCompany: string | null;
  location: string | null;
  applicationDate: Date | null;
  applicationStatus: string | null;
  matchPercentage: number;
  relevanceScore: number;
  matchingHighlights: string[];
  latestEducation: {
    degreeType: string;
    fieldOfStudy: string;
    institutionName: string;
    endDate: Date | null;
  } | null;
  latestExperience: {
    positionTitle: string;
    companyName: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
  } | null;
  strengths: string[];
  weaknesses: string[];
  skillsScore?: number;
  cultureScore?: number;
  hasCultureData?: boolean;
}

interface SearchFilters {
  experienceYears?: {
    min?: number;
    max?: number;
  };
  location?: string;
  skills?: string[];
  education?: string[];
}

export function AIApplicantSearch({ jobId }: { jobId?: string }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<ApplicantSearchResult[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [limit, setLimit] = useState(10);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a search query");
      return;
    }

    setIsSearching(true);
    try {
      const response = await companyServices.searchApplicants({
        query: searchQuery,
        jobId,
        limit,
        filters: filters.experienceYears || filters.location || filters.skills?.length || filters.education?.length ? filters : undefined,
      });

      setSearchResults(response.data);
      setTotalMatches(response.totalMatches);
      
      if (response.data.length === 0) {
        toast.info("No matching candidates found. Try adjusting your search query.");
      }
    } catch (error: any) {
      console.error("Search error:", error);
      toast.error(error.message || "Failed to search applicants");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "default";
    const statusMap: Record<string, string> = {
      PENDING: "secondary",
      REVIEWING: "blue",
      SHORTLISTED: "yellow",
      INTERVIEW: "purple",
      OFFERED: "green",
      REJECTED: "destructive",
      WITHDRAWN: "muted",
      ACCEPTED: "green",
      HIRED: "green",
      NOT_INTERESTED: "orange",
      NOT_SUITABLE: "red",
    };
    return statusMap[status] || "default";
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI-Powered Candidate Search
          </CardTitle>
          <CardDescription>
            Use natural language to find the perfect candidates. For example: "experienced marketing manager with leadership skills" or "frontend developer who has worked with React"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your ideal candidate..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="min-h-[100px]"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dialog open={showFilters} onOpenChange={setShowFilters}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {(filters.experienceYears || filters.location || filters.skills?.length || filters.education?.length) && (
                        <Badge variant="secondary" className="ml-2">Active</Badge>
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Search Filters</DialogTitle>
                      <DialogDescription>Refine your search with additional filters</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Experience Years</label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={filters.experienceYears?.min || ""}
                            onChange={(e) => setFilters({
                              ...filters,
                              experienceYears: {
                                ...filters.experienceYears,
                                min: e.target.value ? Number(e.target.value) : undefined,
                              },
                            })}
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={filters.experienceYears?.max || ""}
                            onChange={(e) => setFilters({
                              ...filters,
                              experienceYears: {
                                ...filters.experienceYears,
                                max: e.target.value ? Number(e.target.value) : undefined,
                              },
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Location</label>
                        <Input
                          placeholder="e.g., San Francisco, CA"
                          value={filters.location || ""}
                          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={clearFilters}>Clear</Button>
                        <Button onClick={() => setShowFilters(false)}>Apply</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSearch} disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Found {totalMatches} matching candidates
            </h3>
          </div>

          <div className="grid gap-4">
            {searchResults.map((applicant) => (
              <Card key={applicant.applicationId} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={applicant.profilePictureUrl || undefined} />
                        <AvatarFallback>
                          {applicant.firstName[0]}{applicant.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-semibold">
                            {applicant.firstName} {applicant.lastName}
                          </h4>
                          {applicant.applicationStatus && (
                            <Badge variant={getStatusColor(applicant.applicationStatus) as any}>
                              {applicant.applicationStatus.replace(/_/g, " ")}
                            </Badge>
                          )}
                        </div>
                        {applicant.currentPosition && (
                          <p className="text-sm text-muted-foreground">
                            {applicant.currentPosition} {applicant.currentCompany && `at ${applicant.currentCompany}`}
                          </p>
                        )}
                        {applicant.location && (
                          <p className="text-sm text-muted-foreground">📍 {applicant.location}</p>
                        )}
                        
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="font-semibold">
                              {applicant.matchPercentage}% Match
                            </Badge>
                            {applicant.skillsScore && (
                              <Badge variant="outline">Skills: {applicant.skillsScore}%</Badge>
                            )}
                            {applicant.cultureScore && (
                              <Badge variant="outline">Culture: {applicant.cultureScore}%</Badge>
                            )}
                          </div>

                          {applicant.matchingHighlights.length > 0 && (
                            <Accordion type="single" collapsible className="w-full">
                              <AccordionItem value="highlights" className="border-none">
                                <AccordionTrigger className="text-sm text-primary hover:no-underline py-2">
                                  Why they match
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {applicant.matchingHighlights.map((highlight, idx) => (
                                      <li key={idx}>{highlight}</li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            {applicant.latestEducation && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Education</p>
                                <p className="text-sm text-muted-foreground">
                                  {applicant.latestEducation.degreeType} in {applicant.latestEducation.fieldOfStudy}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {applicant.latestEducation.institutionName}
                                </p>
                              </div>
                            )}
                            {applicant.latestExperience && (
                              <div className="space-y-1">
                                <p className="text-sm font-medium">Latest Experience</p>
                                <p className="text-sm text-muted-foreground">
                                  {applicant.latestExperience.positionTitle}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {applicant.latestExperience.companyName}
                                  {applicant.latestExperience.isCurrent && " (Current)"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/company/dashboard/applicants/${applicant.applicationId}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}