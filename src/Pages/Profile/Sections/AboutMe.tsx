"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X } from "lucide-react"
import { useProfile } from "@/Contexts/ProfileContext"

export function AboutMe() {
  const { profile, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (profile) {
      setAboutText(profile.aboutMe || "");
      setEditText(profile.aboutMe || "");
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({ aboutMe: editText });
      setAboutText(editText);
      setIsEditing(false);
    } catch (error) {
      // Error is already handled by the context
    }
  };

  const handleCancel = () => {
    setEditText(aboutText);
    setIsEditing(false);
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
  );
}

