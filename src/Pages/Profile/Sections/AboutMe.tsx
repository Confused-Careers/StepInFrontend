"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X } from "lucide-react"

export function AboutMe() {
  const [isEditing, setIsEditing] = useState(false)
  const [aboutText, setAboutText] = useState(
    "I'm a passionate UX designer with 5+ years of experience creating user-centered digital experiences for various industries. My approach combines empathy, creativity, and analytical thinking to solve complex problems and deliver intuitive interfaces.\n\nI specialize in user research, wireframing, prototyping, and usability testing. I'm particularly interested in accessibility and inclusive design, ensuring that digital products are usable by everyone regardless of their abilities.\n\nOutside of work, I enjoy hiking, photography, and volunteering for design mentorship programs. I'm always looking to connect with like-minded professionals and explore new opportunities in the UX field.",
  )
  const [editText, setEditText] = useState(aboutText)

  const handleSave = () => {
    setAboutText(editText)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditText(aboutText)
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>About Me</CardTitle>
          <CardDescription>Tell employers about yourself and your career journey</CardDescription>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
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
          <Textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="min-h-[300px]"
            placeholder="Write about your professional background, interests, and career goals..."
          />
        ) : (
          <div className="prose max-w-none dark:prose-invert">
            {aboutText.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

