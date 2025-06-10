import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobTabs } from "./JobTabs";
import { JobDetailSection } from "./JobDetailSection";
import { DynamicJobMatching } from "./DynamicJobMatching";

const jobsData = [
  { id: "job1", title: "Senior UX Designer", company: "TechVision Inc.", location: "Remote", salary: "$120,000 - $150,000", salaryType: "yearly", posted: "2 days ago", matchPercentage: 95, logo: "/placeholder.svg?height=40&width=40", jobType: "Full-time", industry: "Technology", skills: ["UX Design", "User Research", "Figma", "Prototyping"], description: "TechVision is seeking a Senior UX Designer to join our product team. You'll be responsible for creating intuitive user experiences for our flagship products, conducting user research, and collaborating with cross-functional teams.", basicQualifications: ["5+ years of experience in UX design", "Strong portfolio demonstrating user-centered design process", "Experience with design systems and component libraries", "Proficiency in design tools such as Figma, Sketch, or Adobe XD"], preferredQualifications: ["Experience in SaaS or enterprise products", "Knowledge of accessibility standards", "Experience with design tokens and design systems", "Background in user research methodologies"], preparationItems: ["Review our product and be prepared to discuss potential improvements", "Prepare to share examples of your design process", "Be ready to discuss how you collaborate with developers"], benefits: ["Comprehensive health, dental, and vision insurance", "Unlimited PTO", "Remote-first culture", "Professional development budget"] },
  { id: "job2", title: "Product Manager", company: "InnovateCorp", location: "San Francisco, CA", salary: "$130,000 - $160,000", salaryType: "yearly", posted: "1 day ago", matchPercentage: 92, logo: "/placeholder.svg?height=40&width=40", jobType: "Full-time", industry: "Technology", skills: ["Product Strategy", "Agile", "User Stories", "Roadmapping"], description: "InnovateCorp is looking for a Product Manager to drive the strategy and execution of our digital products. You'll work closely with design, engineering, and marketing teams to deliver exceptional user experiences.", basicQualifications: ["3+ years of product management experience", "Experience with agile methodologies", "Strong analytical and problem-solving skills", "Excellent communication and stakeholder management"], preferredQualifications: ["Experience in B2B SaaS products", "Technical background or understanding", "Experience with product analytics tools", "MBA or relevant advanced degree"], preparationItems: ["Research our product offerings", "Prepare examples of products you've launched", "Be ready to discuss your approach to prioritization"], benefits: ["Competitive salary and equity", "Flexible work arrangements", "Health and wellness benefits", "401(k) matching"] },
  { id: "job3", title: "UI/UX Researcher", company: "DesignLabs", location: "New York, NY", salary: "$110,000 - $140,000", salaryType: "yearly", posted: "3 days ago", matchPercentage: 88, logo: "/placeholder.svg?height=40&width=40", jobType: "Full-time", industry: "Design", skills: ["User Research", "Usability Testing", "Data Analysis", "Interviewing"], description: "DesignLabs is seeking a UI/UX Researcher to help us understand user behaviors, needs, and motivations through methodical research techniques. You'll work with designers and product managers to inform product decisions with user insights.", basicQualifications: ["3+ years of experience in user research", "Experience with qualitative and quantitative research methods", "Strong analytical and communication skills", "Ability to synthesize research findings into actionable insights"], preferredQualifications: ["Master's degree in HCI, Psychology, or related field", "Experience with research tools like UserTesting, Lookback, or Optimal Workshop", "Background in experimental design and statistical analysis", "Experience in a fast-paced product environment"], preparationItems: ["Prepare to discuss research methodologies you've used", "Bring examples of how your research has influenced product decisions", "Be ready to discuss how you balance research rigor with time constraints"], benefits: ["Competitive salary", "Flexible work hours", "Professional development opportunities", "Collaborative work environment"] },
];

export function Dashboard() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({ jobType: [] as string[], industry: [] as string[], datePosted: "", salaryType: "", salaryRange: [0, 200000], skills: [] as string[] });
  const [useInteractiveMode] = useState(false);
  const jobTypes = Array.from(new Set(jobsData.map(job => job.jobType)));
  const industries = Array.from(new Set(jobsData.map(job => job.industry)));
  const allSkills = Array.from(new Set(jobsData.flatMap(job => job.skills)));
  const filteredJobs = jobsData.filter(job => {
    if (filters.jobType.length > 0 && !filters.jobType.includes(job.jobType)) return false;
    if (filters.industry.length > 0 && !filters.industry.includes(job.industry)) return false;
    if (filters.datePosted) {
      const daysAgo = Number.parseInt(job.posted.split(" ")[0]);
      if (filters.datePosted === "today" && daysAgo !== 0) return false;
      if (filters.datePosted === "week" && daysAgo > 7) return false;
      if (filters.datePosted === "month" && daysAgo > 30) return false;
    }
    if (filters.salaryType && job.salaryType !== filters.salaryType) return false;
    const minSalary = Number.parseInt(job.salary.replace(/[^0-9]/g, "").substring(0, 6));
    if (minSalary < filters.salaryRange[0] || minSalary > filters.salaryRange[1]) return false;
    if (filters.skills.length > 0 && !filters.skills.some(skill => job.skills.includes(skill))) return false;
    return true;
  });
  const selectedJobDetails = selectedJob ? jobsData.find(job => job.id === selectedJob) : null;
  const relatedJobs = selectedJob ? jobsData.filter(job => job.id !== selectedJob && (job.industry === selectedJobDetails?.industry || job.skills.some(skill => selectedJobDetails?.skills.includes(skill)))).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, 3) : [];
  return (
    <main className="flex-1 pb-8">
      <AnimatePresence mode="wait">
        {selectedJob ? (
          <JobDetailSection selectedJob={selectedJobDetails} relatedJobs={relatedJobs} onBackClick={() => setSelectedJob(null)} onJobClick={setSelectedJob} />
        ) : (
          <motion.div key="job-list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            {useInteractiveMode ? (
              <DynamicJobMatching />
            ) : (
              <JobTabs filteredJobs={filteredJobs} filtersOpen={filtersOpen} setFiltersOpen={setFiltersOpen} filters={filters} setFilters={setFilters} jobTypes={jobTypes} industries={industries} skills={allSkills} onJobClick={setSelectedJob} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
export default Dashboard;