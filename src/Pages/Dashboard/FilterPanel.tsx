import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface FilterPanelProps {
  filters: {
    jobType: string[]
    industry: string[]
    datePosted: string
    salaryType: string
    salaryRange: number[]
    skills: string[]
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      jobType: string[]
      industry: string[]
      datePosted: string
      salaryType: string
      salaryRange: number[]
      skills: string[]
    }>
  >
  jobTypes: string[]
  industries: string[]
  skills: string[]
}

export function FilterPanel({ filters, setFilters, jobTypes, industries, skills }: FilterPanelProps) {
  const [selectedSkill, setSelectedSkill] = useState("")

  const handleJobTypeChange = (jobType: string) => {
    setFilters((prev) => ({
      ...prev,
      jobType: prev.jobType.includes(jobType) ? prev.jobType.filter((t) => t !== jobType) : [...prev.jobType, jobType],
    }))
  }

  const handleIndustryChange = (industry: string) => {
    setFilters((prev) => ({
      ...prev,
      industry: prev.industry.includes(industry)
        ? prev.industry.filter((i) => i !== industry)
        : [...prev.industry, industry],
    }))
  }

  const handleDatePostedChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      datePosted: value,
    }))
  }

  const handleSalaryTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      salaryType: value,
    }))
  }

  const handleSalaryRangeChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      salaryRange: value,
    }))
  }

  const handleAddSkill = () => {
    if (selectedSkill && !filters.skills.includes(selectedSkill)) {
      setFilters((prev) => ({
        ...prev,
        skills: [...prev.skills, selectedSkill],
      }))
      setSelectedSkill("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFilters((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleClearFilters = () => {
    setFilters({
      jobType: [],
      industry: [],
      datePosted: "",
      salaryType: "",
      salaryRange: [0, 200000],
      skills: [],
    })
  }

  // Format salary for display
  const formatSalary = (value: number) => {
    return value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`
  }

  return (
    <Card className="mb-6 border-primary/10 bg-gradient-to-br from-background to-primary/5 shadow-lg">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Job Type */}
          <div>
            <h3 className="font-medium mb-3">Job Type</h3>
            <div className="space-y-2">
              {jobTypes.map((jobType) => (
                <div key={jobType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`job-type-${jobType}`}
                    checked={filters.jobType.includes(jobType)}
                    onCheckedChange={() => handleJobTypeChange(jobType)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`job-type-${jobType}`} className="cursor-pointer">
                    {jobType}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Industry */}
          <div>
            <h3 className="font-medium mb-3">Industry</h3>
            <div className="space-y-2">
              {industries.map((industry) => (
                <div key={industry} className="flex items-center space-x-2">
                  <Checkbox
                    id={`industry-${industry}`}
                    checked={filters.industry.includes(industry)}
                    onCheckedChange={() => handleIndustryChange(industry)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor={`industry-${industry}`} className="cursor-pointer">
                    {industry}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Date Posted & Salary Type */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-3">Date Posted</h3>
              <Select value={filters.datePosted} onValueChange={handleDatePostedChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_time">Any time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Past week</SelectItem>
                  <SelectItem value="month">Past month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-3">Compensation Type</h3>
              <Select value={filters.salaryType} onValueChange={handleSalaryTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Any type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any_type">Any type</SelectItem>
                  <SelectItem value="yearly">Yearly salary</SelectItem>
                  <SelectItem value="hourly">Hourly rate</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range & Skills */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-3">
                <h3 className="font-medium">Salary Range</h3>
                <span className="text-sm text-muted-foreground">
                  {formatSalary(filters.salaryRange[0])} - {formatSalary(filters.salaryRange[1])}
                </span>
              </div>
              <Slider
                value={filters.salaryRange}
                min={0}
                max={200000}
                step={5000}
                onValueChange={handleSalaryRangeChange}
                className="my-6"
              />
            </div>

            <div>
              <h3 className="font-medium mb-3">Skills</h3>
              <div className="flex gap-2 mb-3">
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {skills.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={handleAddSkill}
                  disabled={!selectedSkill || filters.skills.includes(selectedSkill)}
                >
                  Add
                </Button>
              </div>

              {filters.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {skill}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter actions */}
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={handleClearFilters} className="mr-2">
            Clear All
          </Button>
          <Button>Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default FilterPanel;