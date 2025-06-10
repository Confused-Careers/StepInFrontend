import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Plus, Trash2, X, Globe } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

interface LanguageItem {
  id: string
  name: string
  proficiency: "Elementary" | "Limited Working" | "Professional Working" | "Full Professional" | "Native/Bilingual"
}

export function Languages() {
  const [isEditing, setIsEditing] = useState(false)
  const [languages, setLanguages] = useState<LanguageItem[]>([
    { id: "1", name: "English", proficiency: "Native/Bilingual" },
    { id: "2", name: "Spanish", proficiency: "Professional Working" },
    { id: "3", name: "French", proficiency: "Limited Working" },
  ])

  const [newLanguage, setNewLanguage] = useState<Omit<LanguageItem, "id">>({
    name: "",
    proficiency: "Limited Working",
  })

  const handleAddLanguage = () => {
    if (newLanguage.name.trim()) {
      setLanguages([
        ...languages,
        {
          id: Date.now().toString(),
          ...newLanguage,
        },
      ])
      setNewLanguage({
        name: "",
        proficiency: "Limited Working",
      })
    }
  }

  const handleDeleteLanguage = (id: string) => {
    setLanguages(languages.filter((language) => language.id !== id))
  }

  const handleNewLanguageChange = (field: keyof Omit<LanguageItem, "id">, value: string) => {
    setNewLanguage((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getProficiencyPercentage = (proficiency: LanguageItem["proficiency"]) => {
    switch (proficiency) {
      case "Elementary":
        return 20
      case "Limited Working":
        return 40
      case "Professional Working":
        return 60
      case "Full Professional":
        return 80
      case "Native/Bilingual":
        return 100
      default:
        return 0
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Languages</CardTitle>
          <CardDescription>Add languages you speak and your proficiency level</CardDescription>
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
              Edit Languages
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language-name">Language</Label>
                  <Input
                    id="language-name"
                    value={newLanguage.name}
                    onChange={(e) => handleNewLanguageChange("name", e.target.value)}
                    placeholder="Add a language"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language-proficiency">Proficiency</Label>
                  <Select
                    value={newLanguage.proficiency}
                    onValueChange={(value) =>
                      handleNewLanguageChange("proficiency", value as LanguageItem["proficiency"])
                    }
                  >
                    <SelectTrigger id="language-proficiency">
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Elementary">Elementary</SelectItem>
                      <SelectItem value="Limited Working">Limited Working</SelectItem>
                      <SelectItem value="Professional Working">Professional Working</SelectItem>
                      <SelectItem value="Full Professional">Full Professional</SelectItem>
                      <SelectItem value="Native/Bilingual">Native/Bilingual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddLanguage} disabled={!newLanguage.name.trim()} className="self-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </div>

            <div className="space-y-3">
              {languages.map((language) => (
                <div
                  key={language.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/20 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{language.name}</span>
                      <span className="text-sm text-muted-foreground">{language.proficiency}</span>
                    </div>
                    <Progress value={getProficiencyPercentage(language.proficiency)} className="h-2">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 animate-gradient-shift"
                        style={{ width: `${getProficiencyPercentage(language.proficiency)}%` }}
                      />
                    </Progress>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-2 flex-shrink-0"
                    onClick={() => handleDeleteLanguage(language.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {languages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No languages added yet</p>
                <Button variant="link" onClick={() => setIsEditing(true)}>
                  Add languages you speak
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {languages.map((language) => (
                  <div key={language.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{language.name}</span>
                      <span className="text-sm text-muted-foreground">{language.proficiency}</span>
                    </div>
                    <Progress value={getProficiencyPercentage(language.proficiency)} className="h-2">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/80 animate-gradient-shift"
                        style={{ width: `${getProficiencyPercentage(language.proficiency)}%` }}
                      />
                    </Progress>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

