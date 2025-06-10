import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Plus, Trash2, Briefcase, Calendar, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface WorkExperienceItem {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

export function WorkExperience() {
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([
    {
      id: "1",
      title: "Senior UX Designer",
      company: "TechVision Inc.",
      location: "San Francisco, CA",
      startDate: "2020-06",
      endDate: "",
      current: true,
      description:
        "Lead UX design for flagship products, conduct user research, and collaborate with cross-functional teams to deliver intuitive user experiences. Manage a team of 3 designers and implement design systems.",
    },
    {
      id: "2",
      title: "UX Designer",
      company: "InnovateCorp",
      location: "New York, NY",
      startDate: "2018-03",
      endDate: "2020-05",
      current: false,
      description:
        "Designed user interfaces for web and mobile applications. Conducted usability testing and created wireframes, prototypes, and high-fidelity designs.",
    },
    {
      id: "3",
      title: "UI/UX Intern",
      company: "DesignLabs",
      location: "Boston, MA",
      startDate: "2017-06",
      endDate: "2018-02",
      current: false,
      description:
        "Assisted senior designers with research and prototyping. Created visual assets and contributed to design systems.",
    },
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<WorkExperienceItem>({
    id: "",
    title: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  })

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
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

  const handleDelete = (id: string) => {
    setExperiences(experiences.filter((exp) => exp.id !== id))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, current: checked, endDate: checked ? "" : prev.endDate }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      setExperiences(experiences.map((exp) => (exp.id === isEditing ? formData : exp)))
      setIsEditing(null)
    } else if (isAddingNew) {
      setExperiences([...experiences, formData])
      setIsAddingNew(false)
    }
  }

  const formatDate = (dateString: string) => {
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
            {experiences.length === 0 ? (
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
                        <h3 className="font-medium">{experience.title}</h3>
                        <p className="text-muted-foreground">{experience.company}</p>
                        <div className="flex flex-wrap gap-x-4 mt-1 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {experience.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {formatDate(experience.startDate)} -{" "}
                            {experience.current ? "Present" : formatDate(experience.endDate)}
                          </div>
                        </div>
                        <p className="mt-3 text-sm">{experience.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(experience.id)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(experience.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
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
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" value={formData.location} onChange={handleChange} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="month"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="month"
                    value={formData.endDate}
                    onChange={handleChange}
                    disabled={formData.current}
                    required={!formData.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="current" checked={formData.current} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="current">I currently work here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
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
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

