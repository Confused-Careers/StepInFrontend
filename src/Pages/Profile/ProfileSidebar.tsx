import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  User,
  Briefcase,
  GraduationCap,
  FileText,
  FolderKanban,
  Award,
  Lightbulb,
  Link,
  Globe,
  Bookmark,
  MapPin,
  Flag,
} from "lucide-react"

interface ProfileSidebarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

export function ProfileSidebar({ activeSection, setActiveSection }: ProfileSidebarProps) {
  const sections = [
    { id: "personal-info", label: "Personal Information", icon: <User className="h-4 w-4" /> },
    { id: "work-experience", label: "Work Experience", icon: <Briefcase className="h-4 w-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "about-me", label: "About Me", icon: <FileText className="h-4 w-4" /> },
    { id: "projects", label: "Projects", icon: <FolderKanban className="h-4 w-4" /> },
    { id: "certifications", label: "Certifications", icon: <Award className="h-4 w-4" /> },
    { id: "skills", label: "Skills", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "social-links", label: "Social Links", icon: <Link className="h-4 w-4" /> },
    { id: "languages", label: "Languages", icon: <Globe className="h-4 w-4" /> },
    { id: "job-preferences", label: "Job Preferences", icon: <Bookmark className="h-4 w-4" /> },
    { id: "relocation-info", label: "Relocation & Travel", icon: <MapPin className="h-4 w-4" /> },
    { id: "visa-info", label: "Visa & Nationality", icon: <Flag className="h-4 w-4" /> },
  ]

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardContent className="p-4">
        <div className="space-y-1">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                activeSection === section.id ? "bg-gradient-to-r from-primary to-primary/80 animate-gradient-shift" : ""
              }`}
              onClick={() => setActiveSection(section.id)}
            >
              {section.icon}
              <span className="ml-2">{section.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

