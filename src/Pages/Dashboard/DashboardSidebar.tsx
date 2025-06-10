import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Briefcase,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
} from "lucide-react";

interface DashboardSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  useInteractiveMode: boolean;
  setUseInteractiveMode: (mode: boolean) => void;
}

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  useInteractiveMode,
  setUseInteractiveMode,
}: DashboardSidebarProps) {
  return (
    <aside className="md:w-[240px] flex-shrink-0 hidden md:block">
      <div className="sticky top-24 space-y-6">
        <div className="flex flex-col gap-2">
          <Button
            variant={activeTab === "matches" ? "default" : "ghost"}
            className="justify-start hover-lift"
            onClick={() => setActiveTab("matches")}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Job Matches
          </Button>
          <Button
            variant={activeTab === "applications" ? "default" : "ghost"}
            className="justify-start hover-lift"
            onClick={() => setActiveTab("applications")}
          >
            <Briefcase className="mr-2 h-5 w-5" />
            Applications
          </Button>
          <Button
            variant={activeTab === "interviews" ? "default" : "ghost"}
            className="justify-start hover-lift"
            onClick={() => setActiveTab("interviews")}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Interviews
          </Button>
          <Button
            variant={activeTab === "messages" ? "default" : "ghost"}
            className="justify-start hover-lift"
            onClick={() => setActiveTab("messages")}
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Messages
          </Button>
          <Button
            variant={activeTab === "insights" ? "default" : "ghost"}
            className="justify-start hover-lift"
            onClick={() => setActiveTab("insights")}
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Insights
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="justify-start hover-lift"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-5 w-5" />
            Settings
          </Button>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-background shadow-[0_5px_15px_rgba(var(--primary),0.07)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>75% Complete</span>
                <span className="text-muted-foreground">3/4 Steps</span>
              </div>
              <Progress value={75} className="h-2 bg-gradient-to-r from-primary/20 to-primary/5">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 animate-gradient-shift"
                  style={{ width: "75%" }}
                />
              </Progress>
              <Button variant="link" className="p-0 h-auto text-xs text-primary">
                Complete your profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-background shadow-[0_5px_15px_rgba(var(--primary),0.07)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Job Matching Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Choose between standard or interactive job matching experience
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={useInteractiveMode ? "outline" : "default"}
                  onClick={() => setUseInteractiveMode(false)}
                  className="flex-1"
                >
                  Standard
                </Button>
                <Button
                  size="sm"
                  variant={useInteractiveMode ? "default" : "outline"}
                  onClick={() => setUseInteractiveMode(true)}
                  className="flex-1"
                >
                  Interactive
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}