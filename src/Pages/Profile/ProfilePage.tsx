import { useState } from "react"
import { ProfileHeader } from "@/Pages/Profile/ProfileHeader"
import { ProfileSidebar } from "@/Pages/Profile/ProfileSidebar"
import { PersonalInfo } from "@/Pages/Profile/Sections/PersonalInfo"
import { WorkExperience } from "@/Pages/Profile/Sections/WorkExperience"
import { Education } from "@/Pages/Profile/Sections/Education"
import { AboutMe } from "@/Pages/Profile/Sections/AboutMe"
import { Projects } from "@/Pages/Profile/Sections/Projects"
import { Certifications } from "@/Pages/Profile/Sections/Certifications"
import { Skills } from "@/Pages/Profile/Sections/Skills"
import { SocialLinks } from "@/Pages/Profile/Sections/SocialLinks"
import { Languages } from "@/Pages/Profile/Sections/Languages"
import { JobPreferences } from "@/Pages/Profile/Sections/JobPreferences"
import { RelocationInfo } from "@/Pages/Profile/Sections/Relocation"
import { VisaInfo } from "@/Pages/Profile/Sections/VisaInfo"
import { ProfileCompletion } from "@/Pages/Profile/ProfileCompletion"
import { ModeToggle } from "@/components/Others/ModeToggle"
import { Sparkles, Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ProfilePage() {
  const [activeSection, setActiveSection] = useState("personal-info")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const renderSection = () => {
    switch (activeSection) {
      case "personal-info":
        return <PersonalInfo />
      case "work-experience":
        return <WorkExperience />
      case "education":
        return <Education />
      case "about-me":
        return <AboutMe />
      case "projects":
        return <Projects />
      case "certifications":
        return <Certifications />
      case "skills":
        return <Skills />
      case "social-links":
        return <SocialLinks />
      case "languages":
        return <Languages />
      case "job-preferences":
        return <JobPreferences />
      case "relocation-info":
        return <RelocationInfo />
      case "visa-info":
        return <VisaInfo />
      default:
        return <PersonalInfo />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary animate-pulse-slow" />
            <span className="text-xl font-bold">StepIn</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </Button>
            <ModeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container py-4 flex flex-col space-y-2 border-t">
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveSection("personal-info")
                  setMobileMenuOpen(false)
                }}
              >
                Personal Information
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveSection("work-experience")
                  setMobileMenuOpen(false)
                }}
              >
                Work Experience
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveSection("education")
                  setMobileMenuOpen(false)
                }}
              >
                Education
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveSection("skills")
                  setMobileMenuOpen(false)
                }}
              >
                Skills
              </Button>
              <Button
                variant="ghost"
                className="justify-start"
                onClick={() => {
                  setActiveSection("job-preferences")
                  setMobileMenuOpen(false)
                }}
              >
                Job Preferences
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      <div className="container py-8 flex-1">
        <ProfileHeader />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="space-y-6">
              <ProfileSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
              <ProfileCompletion />
            </div>
          </div>

          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderSection()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export { ProfileSidebar }

