import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

export function JobPreferences() {
  const [isEditing, setIsEditing] = useState(false)
  const [preferences, setPreferences] = useState({
    jobTypes: ["Full-time", "Contract"],
    desiredRoles: ["UX Designer", "Product Designer", "UI Designer", "UX Researcher"],
    industries: ["Technology", "Healthcare", "Education", "E-commerce"],
    minSalary: 100000,
    maxSalary: 150000,
    remotePreference: "Hybrid",
    openToRelocate: true,
  })

  const [newRole, setNewRole] = useState("")
  const [newIndustry, setNewIndustry] = useState("")

  const handleJobTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPreferences((prev) => ({
        ...prev,
        jobTypes: [...prev.jobTypes, type],
      }))
    } else {
      setPreferences((prev) => ({
        ...prev,
        jobTypes: prev.jobTypes.filter((t) => t !== type),
      }))
    }
  }

  const handleAddRole = () => {
    if (newRole.trim() && !preferences.desiredRoles.includes(newRole)) {
      setPreferences((prev) => ({
        ...prev,
        desiredRoles: [...prev.desiredRoles, newRole],
      }))
      setNewRole("")
    }
  }

  const handleRemoveRole = (role: string) => {
    setPreferences((prev) => ({
      ...prev,
      desiredRoles: prev.desiredRoles.filter((r) => r !== role),
    }))
  }

  const handleAddIndustry = () => {
    if (newIndustry.trim() && !preferences.industries.includes(newIndustry)) {
      setPreferences((prev) => ({
        ...prev,
        industries: [...prev.industries, newIndustry],
      }))
      setNewIndustry("")
    }
  }

  const handleRemoveIndustry = (industry: string) => {
    setPreferences((prev) => ({
      ...prev,
      industries: prev.industries.filter((i) => i !== industry),
    }))
  }

  const handleSalaryChange = (value: number[]) => {
    setPreferences((prev) => ({
      ...prev,
      minSalary: value[0],
      maxSalary: value[1],
    }))
  }

  const handleRemotePreferenceChange = (value: string) => {
    setPreferences((prev) => ({
      ...prev,
      remotePreference: value,
    }))
  }

  const handleRelocateChange = (checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      openToRelocate: checked,
    }))
  }

  const formatSalary = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Job Preferences</CardTitle>
          <CardDescription>Set your preferences for job opportunities</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Employment Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Full-time", "Part-time", "Contract", "Freelance", "Internship"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`job-type-${type}`}
                      checked={preferences.jobTypes.includes(type)}
                      onCheckedChange={(checked) => handleJobTypeChange(type, checked as boolean)}
                    />
                    <Label htmlFor={`job-type-${type}`}>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Desired Roles</Label>
              <div className="flex gap-2">
                <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Add a role" />
                <Button onClick={handleAddRole} disabled={!newRole.trim()}>
                  Add
                </Button>
              </div>
              {preferences.desiredRoles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {preferences.desiredRoles.map((role) => (
                    <Badge key={role} variant="secondary" className="flex items-center gap-1">
                      {role}
                      <button onClick={() => handleRemoveRole(role)} className="ml-1 rounded-full hover:bg-muted p-0.5">
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {role}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label>Preferred Industries</Label>
              <div className="flex gap-2">
                <Input
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  placeholder="Add an industry"
                />
                <Button onClick={handleAddIndustry} disabled={!newIndustry.trim()}>
                  Add
                </Button>
              </div>
              {preferences.industries.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {preferences.industries.map((industry) => (
                    <Badge key={industry} variant="secondary" className="flex items-center gap-1">
                      {industry}
                      <button
                        onClick={() => handleRemoveIndustry(industry)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {industry}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Label>Salary Range</Label>
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>{formatSalary(preferences.minSalary)}</span>
                  <span>{formatSalary(preferences.maxSalary)}</span>
                </div>
                <Slider
                  value={[preferences.minSalary, preferences.maxSalary]}
                  min={30000}
                  max={250000}
                  step={5000}
                  onValueChange={handleSalaryChange}
                  className="my-4"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="remote-preference">Remote Work Preference</Label>
              <Select value={preferences.remotePreference} onValueChange={handleRemotePreferenceChange}>
                <SelectTrigger id="remote-preference">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="On-site">On-site</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="No Preference">No Preference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="relocate"
                checked={preferences.openToRelocate}
                onCheckedChange={(checked) => handleRelocateChange(checked as boolean)}
              />
              <Label htmlFor="relocate">I am open to relocation</Label>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">Employment Type</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.jobTypes.map((type) => (
                    <Badge key={type} variant="outline" className="bg-primary/5">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Remote Work Preference</h3>
                <p>{preferences.remotePreference}</p>
                <p className="text-sm text-muted-foreground">
                  {preferences.openToRelocate ? "Open to relocation" : "Not open to relocation"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Desired Roles</h3>
              <div className="flex flex-wrap gap-2">
                {preferences.desiredRoles.map((role) => (
                  <Badge key={role} variant="outline" className="bg-primary/5">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Preferred Industries</h3>
              <div className="flex flex-wrap gap-2">
                {preferences.industries.map((industry) => (
                  <Badge key={industry} variant="outline" className="bg-primary/5">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Salary Expectation</h3>
              <p>
                {formatSalary(preferences.minSalary)} - {formatSalary(preferences.maxSalary)} per year
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

