import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Heart, Home, Briefcase } from "lucide-react";

interface PersonalityInsightsProps {
  personalityTraits: string[];
  workPreferences: string[];
  idealEnvironment: string;
}

export function PersonalityInsights({ 
  personalityTraits = [], 
  workPreferences = [], 
  idealEnvironment = ""
}: PersonalityInsightsProps) {

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI-Generated Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Personality Traits */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Personality Traits</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {personalityTraits.length > 0 ? (
              personalityTraits.map((trait, index) => (
                <Badge key={index} variant="secondary">{trait}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Complete more assessments to reveal personality traits</span>
            )}
          </div>
        </div>

        {/* Work Preferences */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Work Preferences</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {workPreferences.length > 0 ? (
              workPreferences.map((preference, index) => (
                <Badge key={index} variant="secondary">{preference}</Badge>
              ))
            ) : (
              <span className="text-sm text-muted-foreground">Complete more assessments to reveal work preferences</span>
            )}
          </div>
        </div>

        {/* Ideal Environment */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Ideal Work Environment</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {idealEnvironment || "Complete more assessments to reveal your ideal work environment"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}