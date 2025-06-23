import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Building,
  Clock,
  Bookmark,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  Star,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { BsBriefcaseFill } from "react-icons/bs"

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location: string
    salary: string
    salaryType: string
    posted: string
    matchPercentage: number
    logo: string
    jobType: string
    industry: string
    skills: string[]
    description?: string
    matchReasons?: string[]
  }
  onClick: () => void
  delay?: number
  expanded?: boolean
  onAction?: (action: "save" | "apply" | "reject") => void
  isSaved?: boolean
  isApplied?: boolean
}

export function JobCard({
  job,
  onClick,
  delay = 0,
  expanded = false,
  onAction,
  isSaved = false,
  isApplied = false,
}: JobCardProps) {
  return (
    <motion.div
      className="p-4"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="overflow-hidden border-primary/10 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10">
        <div className="h-1 bg-gradient-to-r from-primary to-primary/40" style={{ width: `${Math.round(job.matchPercentage)}%` }} />
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 p-1">
              <BsBriefcaseFill className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="font-bold text-lg mb-1 line-clamp-1">{job.title}</h3>
              <p className="text-muted-foreground text-sm">{job.company}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 ${isSaved ? "text-primary" : ""}`}
              onClick={(e) => {
                e.stopPropagation()
                if (onAction) {
                  onAction("save")
                }
              }}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary/70" />
              <span>{job.location}</span>
            </div>
            {job.salary && job.salary !== "N/A" && job.salary.trim() !== "" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building className="h-4 w-4 text-primary/70" />
                <span>
                  {job.salary} {job.salaryType === "yearly" ? "per year" : "per hour"}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 text-primary/70" />
              <span>Posted {job.posted}</span>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-primary/10">
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 mr-2">
                {Math.round(job.matchPercentage)}% Match
              </Badge>
              <div className="flex flex-wrap gap-1">
                {job.skills.slice(0, 2).map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-muted/50 text-xs">
                    {skill}
                  </Badge>
                ))}
                {job.skills.length > 2 && (
                  <Badge variant="secondary" className="bg-muted/50 text-xs">
                    +{job.skills.length - 2}
                  </Badge>
                )}
              </div>
            </div>

            {expanded && (
              <Button variant="ghost" size="sm" className="mt-4 text-muted-foreground hover:text-primary">
                {expanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    Show More
                  </>
                )}
              </Button>
            )}
          </div>

          <AnimatePresence>
            {expanded && job.description && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-primary/10"
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-primary mb-2">Job Description</h4>
                    <p className="text-muted-foreground mb-4">{job.description}</p>

                    <div className="flex gap-2 mt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-primary/10 hover:bg-primary/10 hover:text-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onAction) {
                            onAction("reject")
                          }
                        }}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        Not Interested
                      </Button>

                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        disabled={isApplied}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (onAction) onAction("apply")
                        }}
                      >
                        {isApplied ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Applied
                          </>
                        ) : (
                          <>
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Apply Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {job.matchReasons && (
                    <div>
                      <h4 className="font-medium text-primary mb-2">Why This Matches You</h4>
                      <ul className="space-y-2">
                        {job.matchReasons.map((reason, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Star className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  )
}
