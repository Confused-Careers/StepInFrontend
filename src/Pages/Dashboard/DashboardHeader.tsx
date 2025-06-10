import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/Others/ModeToggle";
import {
  User,
  Search,
  Menu,
  X,
  Sparkles,
  Briefcase,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import Logo from "../../assets/StepIn Transparent Logo.png";

interface DashboardHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function DashboardHeader({ activeTab, setActiveTab }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
          <span className="text-xl font-bold">StepIn</span>
        </div>

        <div className="hidden md:flex items-center space-x-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search jobs..." className="w-[200px] lg:w-[300px] pl-8" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <ModeToggle />
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="h-5 w-5" />
          </Button>
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

      {mobileMenuOpen && (
        <motion.div
          className="md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container py-4 flex flex-col space-y-2 border-t">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search jobs..." className="pl-8" />
            </div>
            <Button
              variant={activeTab === "matches" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                setActiveTab("matches");
                setMobileMenuOpen(false);
              }}
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Job Matches
            </Button>
            <Button
              variant={activeTab === "applications" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                setActiveTab("applications");
                setMobileMenuOpen(false);
              }}
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Applications
            </Button>
            <Button
              variant={activeTab === "interviews" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                setActiveTab("interviews");
                setMobileMenuOpen(false);
              }}
            >
              <Calendar className="mr-2 h-5 w-5" />
              Interviews
            </Button>
            <Button
              variant={activeTab === "messages" ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                setActiveTab("messages");
                setMobileMenuOpen(false);
              }}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Messages
            </Button>
          </div>
        </motion.div>
      )}
    </header>
  );
}