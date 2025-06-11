import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Plus, Trash2, Briefcase, Calendar, MapPin } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import workExperienceServices, { CreateWorkExperienceData } from "@/services/workExperienceServices"

interface WorkExperienceItem {
  id: string
  positionTitle: string
  companyName: string
  location?: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  description?: string
  workEnvironmentTags?: string[]
  displayOrder?: number
}

export function WorkExperience() {
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<WorkExperienceItem>({
    id: "",
    positionTitle: "",
    companyName: "",
    location: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
    description: "",
    workEnvironmentTags: [],
    displayOrder: 0
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setIsLoading(true)
      const data = await workExperienceServices.getAllWorkExperiences()
      setExperiences(data)
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch work experiences")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      positionTitle: "",
      companyName: "",
      location: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      workEnvironmentTags: [],
      displayOrder: experiences.length
    })
    setIsAddingNew(true)
  }

  const handleEdit = (id: string) => {
    const experience = experiences.find((exp) => exp.id === id)
    if (experience) {
      setFormData(experience)
      setIsEditing(id)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await workExperienceServices.deleteWorkExperience(id)
      toast.success("Work experience deleted successfully")
      fetchExperiences()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete work experience")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isCurrent: checked,
      endDate: checked ? undefined : prev.endDate
    }))
  }

  const formatDateForApi = (dateString: string) => {
    if (!dateString) return undefined
    return new Date(dateString).toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.startDate) {
      toast.error("Start date is required")
      return
    }

    try {
      const startDate = formatDateForApi(formData.startDate)
      if (!startDate) {
        toast.error("Invalid start date format")
        return
      }

      const submitData: CreateWorkExperienceData = {
        positionTitle: formData.positionTitle,
        companyName: formData.companyName,
        startDate,
        isCurrent: formData.isCurrent,
        ...(formData.location && { location: formData.location }),
        ...(!formData.isCurrent && formData.endDate && { 
          endDate: formatDateForApi(formData.endDate) 
        }),
        ...(formData.description && { description: formData.description }),
        ...(formData.workEnvironmentTags?.length && { 
          workEnvironmentTags: formData.workEnvironmentTags 
        }),
        ...(typeof formData.displayOrder === 'number' && { 
          displayOrder: formData.displayOrder 
        })
      }

    if (isEditing) {
        await workExperienceServices.updateWorkExperience(formData.id, submitData)
        toast.success("Work experience updated successfully")
      } else {
        await workExperienceServices.createWorkExperience(submitData)
        toast.success("Work experience added successfully")
      }

      fetchExperiences()
      setIsEditing(null)
      setIsAddingNew(false)
    } catch (error: any) {
      toast.error(error.message || "Failed to save work experience")
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Your professional work history</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : experiences.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No work experience added yet</p>
                <Button variant="link" onClick={handleAddNew}>
                  Add your first work experience
                </Button>
              </div>
            ) : (
              experiences.map((experience) => (
                <div key={experience.id} className="border rounded-lg p-4 hover:border-primary/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{experience.positionTitle}</h3>
                        <p className="text-muted-foreground">{experience.companyName}</p>
                        <div className="flex flex-wrap gap-x-4 mt-1 text-sm">
                          {experience.location && (
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {experience.location}
                          </div>
                          )}
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {formatDate(experience.startDate)} -{" "}
                            {experience.isCurrent ? "Present" : formatDate(experience.endDate)}
                          </div>
                        </div>
                        {experience.description && (
                        <p className="mt-3 text-sm">{experience.description}</p>
                        )}
                        {experience.workEnvironmentTags && experience.workEnvironmentTags.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-2">
                              {experience.workEnvironmentTags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(experience.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(experience.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={isAddingNew || isEditing !== null}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingNew(false)
            setIsEditing(null)
          }
        }}
      >
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{isAddingNew ? "Add Work Experience" : "Edit Work Experience"}</DialogTitle>
            <DialogDescription>
              {isAddingNew ? "Add details about your work experience" : "Update your work experience details"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="positionTitle">Position Title *</Label>
                <input
                  id="positionTitle"
                  name="positionTitle"
                  value={formData.positionTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter your position title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <input
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Enter location (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.isCurrent}
                    required={!formData.isCurrent}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="isCurrent">I currently work here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Describe your role and responsibilities..."
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddingNew(false)
                  setIsEditing(null)
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isAddingNew ? "Add Experience" : "Update Experience"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

