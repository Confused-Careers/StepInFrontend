import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"

export function ProfileCompletion() {
  const completionPercentage = 85

  const incompleteItems = ["Add certification details", "Complete visa information"]

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-background shadow-[0_5px_15px_rgba(var(--primary),0.07)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-primary" />
          Profile Completion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{completionPercentage}% Complete</span>
              <span className="text-muted-foreground">10/12 Sections</span>
            </div>
            <Progress value={completionPercentage} className="h-2 bg-gradient-to-r from-primary/20 to-primary/5">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 animate-gradient-shift"
                style={{ width: `${completionPercentage}%` }}
              />
            </Progress>
          </div>

          {incompleteItems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium">Complete these items:</p>
              <ul className="space-y-1">
                {incompleteItems.map((item, index) => (
                  <li key={index} className="text-xs flex items-start gap-1.5">
                    <AlertCircle className="h-3 w-3 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button variant="link" className="p-0 h-auto text-xs text-primary">
            Complete your profile for better job matches
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

