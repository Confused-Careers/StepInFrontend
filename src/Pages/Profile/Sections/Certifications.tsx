"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Plus, Trash2, Award, Calendar, ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface CertificationItem {
  id: string
  name: string
  organization: string
  issueDate: string
  expirationDate: string
  noExpiration: boolean
  credentialId: string
  credentialURL: string
}

export function Certifications() {
  const [certifications, setCertifications] = useState<CertificationItem[]>([
    {
      id: "1",
      name: "UX Design Professional Certificate",
      organization: "Nielsen Norman Group",
      issueDate: "2020-03",
      expirationDate: "2023-03",
      noExpiration: false,
      credentialId: "UX-2020-03-15-AJ",
      credentialURL: "https://example.com/cert1",
    },
    {
      id: "2",
      name: "Certified Usability Analyst",
      organization: "Human Factors International",
      issueDate: "2019-06",
      expirationDate: "",
      noExpiration: true,
      credentialId: "CUA-19-06-123",
      credentialURL: "https://example.com/cert2",
    },
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [formData, setFormData] = useState<CertificationItem>({
    id: "",
    name: "",
    organization: "",
    issueDate: "",
    expirationDate: "",
    noExpiration: false,
    credentialId: "",
    credentialURL: "",
  })

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      name: "",
      organization: "",
      issueDate: "",
      expirationDate: "",
      noExpiration: false,
      credentialId: "",
      credentialURL: "",
    })
    setIsAddingNew(true)
  }

  const handleEdit = (id: string) => {
    const certification = certifications.find((cert) => cert.id === id)
    if (certification) {
      setFormData(certification)
      setIsEditing(id)
    }
  }

  const handleDelete = (id: string) => {
    setCertifications(certifications.filter((cert) => cert.id !== id))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      noExpiration: checked,
      expirationDate: checked ? "" : prev.expirationDate,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditing) {
      setCertifications(certifications.map((cert) => (cert.id === isEditing ? formData : cert)))
      setIsEditing(null)
    } else if (isAddingNew) {
      setCertifications([...certifications, formData])
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
            <CardTitle>Certifications</CardTitle>
            <CardDescription>Showcase your professional certifications and credentials</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleAddNew}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {certifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No certifications added yet</p>
                <Button variant="link" onClick={handleAddNew}>
                  Add your first certification
                </Button>
              </div>
            ) : (
              certifications.map((certification) => (
                <div key={certification.id} className="border rounded-lg p-4 hover:border-primary/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{certification.name}</h3>
                        <p className="text-muted-foreground">{certification.organization}</p>
                        <div className="flex flex-wrap gap-x-4 mt-1 text-sm">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Issued: {formatDate(certification.issueDate)}
                            {!certification.noExpiration && certification.expirationDate && (
                              <> · Expires: {formatDate(certification.expirationDate)}</>
                            )}
                            {certification.noExpiration && <> · No Expiration</>}
                          </div>
                        </div>
                        {certification.credentialId && (
                          <p className="text-sm mt-1">
                            <span className="text-muted-foreground">Credential ID:</span> {certification.credentialId}
                          </p>
                        )}
                        {certification.credentialURL && (
                          <a
                            href={certification.credentialURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center mt-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5 mr-1" />
                            View Credential
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 md:flex-col">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(certification.id)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(certification.id)}>
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
            <DialogTitle>{isAddingNew ? "Add Certification" : "Edit Certification"}</DialogTitle>
            <DialogDescription>
              {isAddingNew ? "Add details about your certification" : "Update your certification details"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Certification Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Issuing Organization</Label>
              <Input
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date</Label>
                <Input
                  id="issueDate"
                  name="issueDate"
                  type="month"
                  value={formData.issueDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Expiration Date</Label>
                <Input
                  id="expirationDate"
                  name="expirationDate"
                  type="month"
                  value={formData.expirationDate}
                  onChange={handleChange}
                  disabled={formData.noExpiration}
                  required={!formData.noExpiration}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="noExpiration" checked={formData.noExpiration} onCheckedChange={handleCheckboxChange} />
              <Label htmlFor="noExpiration">This certification does not expire</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialId">Credential ID (optional)</Label>
              <Input id="credentialId" name="credentialId" value={formData.credentialId} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="credentialURL">Credential URL (optional)</Label>
              <Input
                id="credentialURL"
                name="credentialURL"
                type="url"
                value={formData.credentialURL}
                onChange={handleChange}
                placeholder="https://example.com/credential"
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

