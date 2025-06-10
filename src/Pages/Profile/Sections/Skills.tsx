import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Plus, Trash2, X, Lightbulb } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface SkillItem {
  id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  category: "Design" | "Development" | "Soft Skills" | "Tools" | "Other"
}

export function Skills() {
  const [isEditing, setIsEditing] = useState(false)
  const [skills, setSkills] = useState<SkillItem[]>([
    { id: "1", name: "UX Design", level: "Expert", category: "Design" },
    { id: "2", name: "UI Design", level: "Expert", category: "Design" },
    { id: "3", name: "Figma", level: "Expert", category: "Tools" },
    { id: "4", name: "User Research", level: "Advanced", category: "Design" },
    { id: "5", name: "Wireframing", level: "Expert", category: "Design" },
    { id: "6", name: "Prototyping", level: "Expert", category: "Design" },
    { id: "7", name: "HTML/CSS", level: "Intermediate", category: "Development" },
    { id: "8", name: "JavaScript", level: "Intermediate", category: "Development" },
    { id: "9", name: "Sketch", level: "Advanced", category: "Tools" },
    { id: "10", name: "Adobe XD", level: "Advanced", category: "Tools" },
    { id: "11", name: "Photoshop", level: "Intermediate", category: "Tools" },
    { id: "12", name: "Illustrator", level: "Intermediate", category: "Tools" },
    { id: "13", name: "Project Management", level: "Advanced", category: "Soft Skills" },
    { id: "14", name: "Team Leadership", level: "Advanced", category: "Soft Skills" },
    { id: "15", name: "Communication", level: "Expert", category: "Soft Skills" },
  ])

  const [newSkill, setNewSkill] = useState<Omit<SkillItem, "id">>({
    name: "",
    level: "Intermediate",
    category: "Other",
  })

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setSkills([
        ...skills,
        {
          id: Date.now().toString(),
          ...newSkill,
        },
      ])
      setNewSkill({
        name: "",
        level: "Intermediate",
        category: "Other",
      })
    }
  }

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter((skill) => skill.id !== id))
  }

  const handleNewSkillChange = (field: keyof Omit<SkillItem, "id">, value: string) => {
    setNewSkill((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getLevelPercentage = (level: SkillItem["level"]) => {
    switch (level) {
      case "Beginner":
        return 25
      case "Intermediate":
        return 50
      case "Advanced":
        return 75
      case "Expert":
        return 100
      default:
        return 0
    }
  }

  const getLevelColor = (level: SkillItem["level"]) => {
    switch (level) {
      case "Beginner":
        return "from-blue-500 to-blue-400"
      case "Intermediate":
        return "from-green-500 to-green-400"
      case "Advanced":
        return "from-purple-500 to-purple-400"
      case "Expert":
        return "from-primary to-primary/80"
      default:
        return "from-gray-500 to-gray-400"
    }
  }

  // Group skills by category
  const skillsByCategory = skills.reduce<Record<string, SkillItem[]>>((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = []
    }
    acc[skill.category].push(skill)
    return acc
  }, {})

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Showcase your professional skills and expertise</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <>
              <X className="h-4 w-4 mr-2" />
              Done
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit Skills
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skill-name">Skill Name</Label>
                  <Input
                    id="skill-name"
                    value={newSkill.name}
                    onChange={(e) => handleNewSkillChange("name", e.target.value)}
                    placeholder="Add a new skill"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-level">Proficiency Level</Label>
                  <Select
                    value={newSkill.level}
                    onValueChange={(value) => handleNewSkillChange("level", value as SkillItem["level"])}
                  >
                    <SelectTrigger id="skill-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skill-category">Category</Label>
                  <Select
                    value={newSkill.category}
                    onValueChange={(value) => handleNewSkillChange("category", value as SkillItem["category"])}
                  >
                    <SelectTrigger id="skill-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Development">Development</SelectItem>
                      <SelectItem value="Tools">Tools</SelectItem>
                      <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddSkill} disabled={!newSkill.name.trim()} className="self-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>

            <div className="space-y-6">
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-medium text-lg">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/20 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium">{skill.name}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}</span>
                          </div>
                          <Progress value={getLevelPercentage(skill.level)} className="h-2">
                            <div
                              className={`h-full bg-gradient-to-r ${getLevelColor(skill.level)} animate-gradient-shift`}
                              style={{ width: `${getLevelPercentage(skill.level)}%` }}
                            />
                          </Progress>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-2 flex-shrink-0"
                          onClick={() => handleDeleteSkill(skill.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(skillsByCategory).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No skills added yet</p>
                <Button variant="link" onClick={() => setIsEditing(true)}>
                  Add your skills
                </Button>
              </div>
            ) : (
              Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div key={category} className="space-y-3">
                  <h3 className="font-medium text-lg">{category}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.id} className="p-3 border rounded-lg">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}</span>
                        </div>
                        <Progress value={getLevelPercentage(skill.level)} className="h-2">
                          <div
                            className={`h-full bg-gradient-to-r ${getLevelColor(skill.level)} animate-gradient-shift`}
                            style={{ width: `${getLevelPercentage(skill.level)}%` }}
                          />
                        </Progress>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

