import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { useProfile } from "@/Contexts/ProfileContext"

export function JobPreferences() {
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [preferences, setPreferences] = useState({
    currentPosition: "",
    currentCompany: "",
    expectedSalaryMin: 0,
    expectedSalaryMax: 0,
    availability: "one_month",
    preferredLocation: "",
  });

  useEffect(() => {
    if (profile) {
      setPreferences({
        currentPosition: profile.currentPosition || "",
        currentCompany: profile.currentCompany || "",
        expectedSalaryMin: profile.expectedSalaryMin || 0,
        expectedSalaryMax: profile.expectedSalaryMax || 0,
        availability: profile.availability || "one_month",
        preferredLocation: profile.preferredLocation || "",
      });
    }
  }, [profile]);

  const handleSalaryChange = (value: number[]) => {
    setPreferences(prev => ({
      ...prev,
      expectedSalaryMin: value[0],
      expectedSalaryMax: value[1],
    }));
  };

  const handleAvailabilityChange = (value: string) => {
    setPreferences(prev => ({
      ...prev,
      availability: value,
    }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences(prev => ({
      ...prev,
      preferredLocation: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      await updateProfile(preferences);
      setIsEditing(false);
    } catch (error) {
      // Error is already handled by the context
    }
  };

  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Job Preferences</CardTitle>
          <CardDescription>Set your preferences for job opportunities</CardDescription>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Current Position</Label>
              <Input
                value={preferences.currentPosition}
                onChange={(e) => setPreferences(prev => ({ ...prev, currentPosition: e.target.value }))}
                placeholder="Enter your current position"
              />
            </div>

            <div className="space-y-3">
              <Label>Current Company</Label>
              <Input
                value={preferences.currentCompany}
                onChange={(e) => setPreferences(prev => ({ ...prev, currentCompany: e.target.value }))}
                placeholder="Enter your current company"
              />
            </div>

            <div className="space-y-3">
              <Label>Preferred Location</Label>
              <Input
                value={preferences.preferredLocation}
                onChange={handleLocationChange}
                placeholder="Enter your preferred location"
              />
            </div>

            <div className="space-y-3">
              <div>
                <Label>Expected Salary Range</Label>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{formatSalary(preferences.expectedSalaryMin)}</span>
                  <span>{formatSalary(preferences.expectedSalaryMax)}</span>
                </div>
                <Slider
                  value={[preferences.expectedSalaryMin, preferences.expectedSalaryMax]}
                  min={30000}
                  max={250000}
                  step={5000}
                  onValueChange={handleSalaryChange}
                  className="my-4"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Availability</Label>
              <Select value={preferences.availability} onValueChange={handleAvailabilityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediate">Immediate</SelectItem>
                  <SelectItem value="one_week">One Week</SelectItem>
                  <SelectItem value="two_weeks">Two Weeks</SelectItem>
                  <SelectItem value="one_month">One Month</SelectItem>
                  <SelectItem value="two_months">Two Months</SelectItem>
                  <SelectItem value="three_months">Three Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">Current Position</h3>
                <p>{preferences.currentPosition || "Not specified"}</p>
                <p className="text-sm text-muted-foreground">{preferences.currentCompany}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Preferred Location</h3>
                <p>{preferences.preferredLocation || "Not specified"}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Expected Salary</h3>
              <p>
                {formatSalary(preferences.expectedSalaryMin)} - {formatSalary(preferences.expectedSalaryMax)} per year
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Availability</h3>
              <p>{preferences.availability.replace("_", " ")}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

