import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Building,
  Clock,
  Briefcase,
  GraduationCap,
  Award,
  CheckCircle,
  Heart,
  DollarSign,
  Globe,
  Zap,
  // Bookmark,
  // Share2,
} from "lucide-react";

interface JobDetailViewProps {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    salaryType: string;
    posted: string;
    matchPercentage: number;
    logo: string;
    jobType: string;
    industry: string;
    skills: string[];
    description: string;
    basicQualifications: string[];
    preferredQualifications: string[];
    preparationItems: string[];
    benefits: string[];
  };
}

export function JobDetailView({ job }: JobDetailViewProps) {
  return (
    <div className="space-y-8">
      {/* Header card with job title and company */}
      <Card className="border-primary/20 overflow-hidden relative">
        {/* Enhanced background mesh gradients */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl" />
        </div>

        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            {/* Company logo */}
            <div className="rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 p-1.5 flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-md overflow-hidden bg-background flex items-center justify-center">
                <Briefcase className="h-10 w-10 md:h-12 md:w-12 text-primary" />
                {/* Optional: Uncomment to use Next.js Image if in Next.js */}
                {/* <Image
                  src={job.logo || "/placeholder.svg"}
                  alt={job.company}
                  width={96}
                  height={96}
                  className="object-cover"
                /> */}
              </div>
            </div>

            {/* Job title and company */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold">{job.title}</h1>
                  <p className="text-xl text-muted-foreground mt-1">{job.company}</p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge
                      variant="outline"
                      className="bg-gradient-to-r from-primary/20 to-primary/10 text-primary border-primary/20 px-3 py-1 text-sm"
                    >
                      {Math.round(job.matchPercentage)}% Match
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 text-sm">
                      {job.jobType}
                    </Badge>
                    <Badge variant="outline" className="px-3 py-1 text-sm">
                      {job.industry}
                    </Badge>
                  </div>
                </div>

                <Button
                  className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 mt-4 md:mt-0 px-6"
                  size="lg"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></span>
                  Apply Now
                </Button>
              </div>

              {/* Job details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">
                      {job.salary} {job.salaryType === "yearly" ? "per year" : "per hour"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="font-medium">{job.posted}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Job description with integrated company info */}
          <Card className="bg-gradient-to-br from-background via-background to-primary/5 border-primary/10 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-6">
              <div className="space-y-4">
                <p className="whitespace-pre-line leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {job.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/10">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Integrated company info */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Building className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">About {job.company}</h3>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-md overflow-hidden bg-gradient-to-br from-primary/10 to-background p-1 w-14 h-14 flex-shrink-0">
                    <Briefcase className="h-8 w-8 text-primary m-auto" />
                    {/* Optional: Uncomment to use Next.js Image if in Next.js */}
                    {/* <Image
                      src={job.logo || "/placeholder.svg"}
                      alt={job.company}
                      width={56}
                      height={56}
                      className="object-cover rounded-sm"
                    /> */}
                  </div>
                  <div>
                    <p className="text-muted-foreground leading-relaxed">
                      {job.company} is a leading company in the {job.industry} industry, focused on innovation and
                      growth. We're committed to creating an inclusive workplace where all employees can thrive.
                    </p>
                  </div>
                </div>

                <Button variant="outline" className="relative overflow-hidden" size="sm">
                  <span className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 -translate-x-full hover:translate-x-0 transition-transform duration-1000"></span>
                  <Globe className="mr-2 h-4 w-4" />
                  <span className="relative z-10">Visit Company Website</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Consolidated qualifications card */}
          <Card className="bg-gradient-to-br from-background via-background to-primary/5 border-primary/10 shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                Qualifications
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Basic qualifications */}
                <div>
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Basic Qualifications
                  </h3>
                  <ul className="space-y-3">
                    {job.basicQualifications.map((qualification, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <CheckCircle className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="leading-relaxed">{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Preferred qualifications */}
                <div>
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Preferred Qualifications
                  </h3>
                  <ul className="space-y-3">
                    {job.preferredQualifications.map((qualification, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Zap className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <span className="leading-relaxed">{qualification}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preparation items */}
          <Card className="bg-gradient-to-br from-background via-background to-primary/5 border-primary/10 shadow-lg overflow-hidden">
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-primary" />
                </div>
                Preparation Items
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-4">
                {job.preparationItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Benefits */}
          <Card className="bg-gradient-to-br from-background via-background to-primary/10 border-primary/10 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Heart className="h-4 w-4 text-primary" />
                </div>
                Benefits
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-4">
                {job.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quick actions card */}
          {/* <Card className="bg-gradient-to-br from-background via-background to-primary/10 border-primary/10 shadow-lg overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Button className="w-full justify-start relative overflow-hidden" variant="outline" size="lg">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 -translate-x-full hover:translate-x-0 transition-transform duration-1000"></span>
                <Bookmark className="mr-3 h-4 w-4" />
                <span className="relative z-10">Save Job</span>
              </Button>
              <Button className="w-full justify-start relative overflow-hidden" variant="outline" size="lg">
                <span className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 -translate-x-full hover:translate-x-0 transition-transform duration-1000"></span>
                <Share2 className="mr-3 h-4 w-4" />
                <span className="relative z-10">Share Job</span>
              </Button>
              <Button
                className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 mt-2"
                size="lg"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></span>
                Apply Now
              </Button>
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}

export default JobDetailView;