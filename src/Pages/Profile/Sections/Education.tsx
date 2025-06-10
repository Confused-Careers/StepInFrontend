"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Plus, Trash2, GraduationCap, Calendar, MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EducationItem {
  id: string
  degree: string
  fieldOfStudy: string
  institution: string
  location: string
  startDate: string
  endDate: string
  gpa: string
  description: string
}

export function Education() {
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: "1",
      degree: "Bachelor of Arts",
      fieldOfStudy: "Design",
      institution: "Stanford University",
      location: "Stanford, CA",
      startDate: "2013-09",
      endDate: "2017-05",
      gpa: "3.8",
      description:
        "Focused on user experience design and human-computer interaction. Completed senior thesis on designing for accessibility.",
    },
    {
      id: "2",
      degree: "Certificate",
      fieldOfStudy: "UX Design",
      institution: "Nielsen Norman Group",
      location: "Online",
      startDate: "2018-01",
      endDate: "2018-03",
      gpa: "",
      description:
        "Completed comprehensive UX certification program covering research methods, information architecture, and interaction design.",
    },
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<EducationItem>({
    id: "",
    degree: "",
    fieldOfStudy: "",
    institution: "",
    location: "",
    startDate: "",
    endDate: "",
    gpa: "",
    description: "",
  })

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      degree: "",
      fieldOfStudy: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    })
    setIsAddingNew(true)
  }

  const handleEdit = (id: string) => {
    const education = educations.find((edu) => edu.id === id)
    if (education) {
      setFormData(education)
      setIsEditing(id)
    }
  }

  const handleDelete = (id: string) => {
    setEducations(educations.filter((edu) => edu.id !== id))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      setEducations(educations.map((edu) => (edu.id === isEditing ? formData : edu)))
      setIsEditing(null)
    } else if (isAddingNew) {
      setEducations([...educations, formData])
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
            <CardTitle>Education</CardTitle>
            <CardDescription>Your academic background and qualifications</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {educations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No education added yet</p>
                <Button variant="link" onClick={handleAddNew}>
                  Add your first education
                </Button>
              </div>
            ) : (
              educations.map((education) => (
                <div key={education.id} className="border rounded-lg p-4 hover:border-primary/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">
                          {education.degree} in {education.fieldOfStudy}
                        </h3>
                        <p className="text-muted-foreground">{education.institution}</p>
                        <div className="flex flex-wrap gap-x-4 mt-1 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {education.location}
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {formatDate(education.startDate)} - {formatDate(education.endDate)}
                          </div>
                          {education.gpa && <div className="text-muted-foreground">GPA: {education.gpa}</div>}
                        </div>
                        {education.description && <p className="mt-3 text-sm">{education.description}</p>}
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(education.id)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(education.id)}>
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
            <DialogTitle>{isAddingNew ? "Add Education" : "Edit Education"}</DialogTitle>
            <DialogDescription>
              {isAddingNew ? "Add details about your education" : "Update your education details"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="degree">Degree</Label>
                <Select value={formData.degree} onValueChange={(value) => handleSelectChange("degree", value)}>
                  <SelectTrigger id="degree">
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Associate's">Associate's</SelectItem>
                    <SelectItem value="Bachelor of Arts">Bachelor of Arts</SelectItem>
                    <SelectItem value="Bachelor of Science">Bachelor of Science</SelectItem>
                    <SelectItem value="Master of Arts">Master of Arts</SelectItem>
                    <SelectItem value="Master of Science">Master of Science</SelectItem>
                    <SelectItem value="MBA">MBA</SelectItem>
                    <SelectItem value="Ph.D.">Ph.D.</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fieldOfStudy">Field of Study</Label>
                <Input
                  id="fieldOfStudy"
                  name="fieldOfStudy"
                  value={formData.fieldOfStudy}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="institution">Institution</Label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                />
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
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gpa">GPA (optional)</Label>
              <Input id="gpa" name="gpa" value={formData.gpa} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Describe your studies, achievements, or activities..."
              />
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

