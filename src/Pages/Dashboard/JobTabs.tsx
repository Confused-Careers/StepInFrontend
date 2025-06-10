import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FilterPanel } from "./FilterPanel";
import { JobCard } from "./JobCard";
import { Briefcase, Star, Filter, ChevronDown, ChevronUp } from "lucide-react";

interface JobTabsProps {
  filteredJobs: any[];
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  filters: any;
  setFilters: (filters: any) => void;
  jobTypes: string[];
  industries: string[];
  skills: string[];
  onJobClick: (id: string) => void;
}

export function JobTabs({
  filteredJobs,
  filtersOpen,
  setFiltersOpen,
  filters,
  setFilters,
  jobTypes,
  industries,
  skills,
  onJobClick,
}: JobTabsProps) {
  return (
    <Tabs defaultValue="recommended" className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Job Matches</h1>
          <p className="text-muted-foreground">Discover opportunities tailored to your profile</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Filter className="h-4 w-4" />
            Filters
            {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <TabsList>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
            <TabsTrigger value="all">All Jobs</TabsTrigger>
          </TabsList>
        </div>
      </div>

      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              jobTypes={jobTypes}
              industries={industries}
              skills={skills}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <TabsContent value="recommended" className="space-y-6">
        {filteredJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job, index) => (
              <JobCard key={job.id} job={job} onClick={() => onJobClick(job.id)} delay={index * 0.1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No jobs match your filters</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Try adjusting your filter criteria or explore all available jobs.
            </p>
            <Button
              onClick={() =>
                setFilters({
                  jobType: [],
                  industry: [],
                  datePosted: "",
                  salaryType: "",
                  salaryRange: [0, 200000],
                  skills: [],
                })
              }
            >
              Clear Filters
            </Button>
          </div>
        )}
        {filteredJobs.length > 0 && (
          <div className="flex justify-center">
            <Button variant="outline" className="hover-lift">
              Load More Jobs
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="saved" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Saved Jobs</CardTitle>
            <CardDescription>Jobs you've saved for later.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>You haven't saved any jobs yet.</p>
              <p className="text-sm">Jobs you save will appear here.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="all" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>All Available Jobs</CardTitle>
            <CardDescription>Browse all jobs that match your profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Explore all available positions</p>
              <p className="text-sm">Use filters to narrow down your search.</p>
              <Button className="mt-4 hover-glow bg-gradient-blue">Browse All Jobs</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}