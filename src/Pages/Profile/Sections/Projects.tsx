import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Plus, Trash2, FolderKanban, Calendar, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface ProjectItem {
  id: string
  title: string
  description: string
  role: string
  startDate: string
  endDate: string
  url: string
  image: string
  skills: string[]
}

export function Projects() {
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "1",
      title: "E-commerce Redesign",
      description:
        "Redesigned the user interface for a major e-commerce platform, improving conversion rates by 15% and reducing cart abandonment by 23%. Conducted user research, created wireframes, and delivered high-fidelity prototypes.",
      role: "Lead UX Designer",
      startDate: "2021-03",
      endDate: "2021-08",
      url: "https://example.com/project1",
      image: "/placeholder.svg?height=200&width=300",
      skills: ["UX Design", "Wireframing", "Prototyping", "User Research"],
    },
    {
      id: "2",
      title: "Mobile Banking App",
      description:
        "Designed a mobile banking application focused on simplifying financial management for young adults. Created user flows, wireframes, and interactive prototypes. Conducted usability testing with 20+ participants.",
      role: "UX/UI Designer",
      startDate: "2020-09",
      endDate: "2021-01",
      url: "https://example.com/project2",
      image: "/placeholder.svg?height=200&width=300",
      skills: ["Mobile Design", "UI Design", "Usability Testing", "Figma"],
    },
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProjectItem>({
    id: "",
    title: "",
    description: "",
    role: "",
    startDate: "",
    endDate: "",
    url: "",
    image: "",
    skills: [],
  })
  const [skillInput, setSkillInput] = useState("")

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      title: "",
      description: "",
      role: "",
      startDate: "",
      endDate: "",
      url: "",
      image: "/placeholder.svg?height=200&width=300",
      skills: [],
    })
    setSkillInput("")
    setIsAddingNew(true)
  }

  const handleEdit = (id: string) => {
    const project = projects.find((proj) => proj.id === id)
    if (project) {
      setFormData(project)
      setSkillInput("")
      setIsEditing(id)
    }
  }

  const handleDelete = (id: string) => {
    setProjects(projects.filter((proj) => proj.id !== id))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddSkill = () => {
    if (skillInput && !formData.skills.includes(skillInput)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput],
      }))
      setSkillInput("")
    }
  }

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      setProjects(projects.map((proj) => (proj.id === isEditing ? formData : proj)))
      setIsEditing(null)
    } else if (isAddingNew) {
      setProjects([...projects, formData])
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
            <CardTitle>Projects</CardTitle>
            <CardDescription>Showcase your work and achievements</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderKanban className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No projects added yet</p>
                <Button variant="link" onClick={handleAddNew}>
                  Add your first project
                </Button>
              </div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="border rounded-lg overflow-hidden hover:border-primary/20 transition-colors"
                >
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 relative h-48 md:h-full">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4 md:col-span-2">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="font-medium text-lg">{project.title}</h3>
                          <p className="text-muted-foreground">{project.role}</p>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {formatDate(project.startDate)} - {formatDate(project.endDate)}
                          </div>
                          <p className="mt-3 text-sm">{project.description}</p>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {project.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="bg-primary/5">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          {project.url && (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center mt-3 text-sm text-primary hover:underline"
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              View Project
                            </a>
                          )}
                        </div>
                        <div className="flex gap-2 md:flex-col">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(project.id)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
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
            <DialogTitle>{isAddingNew ? "Add Project" : "Edit Project"}</DialogTitle>
            <DialogDescription>
              {isAddingNew ? "Add details about your project" : "Update your project details"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Input id="role" name="role" value={formData.role} onChange={handleChange} required />
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
              <Label htmlFor="url">Project URL (optional)</Label>
              <Input
                id="url"
                name="url"
                type="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com/project"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe your project, your role, and the outcomes..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Skills Used</Label>
              <div className="flex gap-2">
                <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" />
                <Button type="button" onClick={handleAddSkill} disabled={!skillInput}>
                  Add
                </Button>
              </div>

              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Remove {skill}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
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

