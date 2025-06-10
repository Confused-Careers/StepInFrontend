import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Edit,
  Plus,
  Trash2,
  X,
  LinkIcon,
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Globe,
  Facebook,
  Youtube,
  Dribbble,
  Figma,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SocialLinkItem {
  id: string
  platform: string
  url: string
  username: string
}

export function SocialLinks() {
  const [isEditing, setIsEditing] = useState(false)
  const [links, setLinks] = useState<SocialLinkItem[]>([
    { id: "1", platform: "LinkedIn", url: "https://linkedin.com/in/alexjohnson", username: "alexjohnson" },
    { id: "2", platform: "Dribbble", url: "https://dribbble.com/alexj", username: "alexj" },
    { id: "3", platform: "GitHub", url: "https://github.com/alexjohnson-ux", username: "alexjohnson-ux" },
    { id: "4", platform: "Behance", url: "https://behance.net/alexjohnson", username: "alexjohnson" },
  ])

  const [newLink, setNewLink] = useState<Omit<SocialLinkItem, "id">>({
    platform: "",
    url: "",
    username: "",
  })

  const handleAddLink = () => {
    if (newLink.platform && newLink.url) {
      setLinks([
        ...links,
        {
          id: Date.now().toString(),
          ...newLink,
        },
      ])
      setNewLink({
        platform: "",
        url: "",
        username: "",
      })
    }
  }

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const handleNewLinkChange = (field: keyof Omit<SocialLinkItem, "id">, value: string) => {
    setNewLink((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "LinkedIn":
        return <Linkedin className="h-5 w-5" />
      case "GitHub":
        return <Github className="h-5 w-5" />
      case "Twitter":
        return <Twitter className="h-5 w-5" />
      case "Instagram":
        return <Instagram className="h-5 w-5" />
      case "Facebook":
        return <Facebook className="h-5 w-5" />
      case "YouTube":
        return <Youtube className="h-5 w-5" />
      case "Dribbble":
        return <Dribbble className="h-5 w-5" />
      case "Behance":
        return <Dribbble className="h-5 w-5" />
      case "Figma":
        return <Figma className="h-5 w-5" />
      default:
        return <Globe className="h-5 w-5" />
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Social Links</CardTitle>
          <CardDescription>Connect your social media profiles and online presence</CardDescription>
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
              Edit Links
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
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={newLink.platform} onValueChange={(value) => handleNewLinkChange("platform", value)}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="GitHub">GitHub</SelectItem>
                      <SelectItem value="Twitter">Twitter</SelectItem>
                      <SelectItem value="Instagram">Instagram</SelectItem>
                      <SelectItem value="Facebook">Facebook</SelectItem>
                      <SelectItem value="YouTube">YouTube</SelectItem>
                      <SelectItem value="Dribbble">Dribbble</SelectItem>
                      <SelectItem value="Behance">Behance</SelectItem>
                      <SelectItem value="Figma">Figma</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={newLink.username}
                    onChange={(e) => handleNewLinkChange("username", e.target.value)}
                    placeholder="Your username"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={newLink.url}
                    onChange={(e) => handleNewLinkChange("url", e.target.value)}
                    placeholder="https://example.com/profile"
                    type="url"
                  />
                </div>
              </div>
              <Button onClick={handleAddLink} disabled={!newLink.platform || !newLink.url} className="self-start">
                <Plus className="h-4 w-4 mr-2" />
                Add Link
              </Button>
            </div>

            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <div>
                      <p className="font-medium">{link.platform}</p>
                      <p className="text-sm text-muted-foreground">{link.username}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      <LinkIcon className="h-4 w-4" />
                      <span className="sr-only">Visit {link.platform}</span>
                    </a>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteLink(link.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {links.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No social links added yet</p>
                <Button variant="link" onClick={() => setIsEditing(true)}>
                  Add your social links
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 border rounded-lg hover:border-primary/20 hover:bg-primary/5 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {getPlatformIcon(link.platform)}
                    </div>
                    <div>
                      <p className="font-medium">{link.platform}</p>
                      <p className="text-sm text-muted-foreground">{link.username}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

