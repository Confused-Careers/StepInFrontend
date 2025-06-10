import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function RelocationInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [relocationInfo, setRelocationInfo] = useState({
    willingToRelocate: "Yes",
    preferredLocations: ["San Francisco, CA", "New York, NY", "Seattle, WA", "Austin, TX"],
    travelPreference: "Up to 25%",
    internationalTravel: true,
    needsVisa: false,
    needsSponsorship: false,
  })

  const [newLocation, setNewLocation] = useState("")

  const handleWillingToRelocateChange = (value: string) => {
    setRelocationInfo((prev) => ({
      ...prev,
      willingToRelocate: value,
    }))
  }

  const handleTravelPreferenceChange = (value: string) => {
    setRelocationInfo((prev) => ({
      ...prev,
      travelPreference: value,
    }))
  }

  const handleInternationalTravelChange = (checked: boolean) => {
    setRelocationInfo((prev) => ({
      ...prev,
      internationalTravel: checked,
    }))
  }

  const handleNeedsVisaChange = (checked: boolean) => {
    setRelocationInfo((prev) => ({
      ...prev,
      needsVisa: checked,
    }))
  }

  const handleNeedsSponsorshipChange = (checked: boolean) => {
    setRelocationInfo((prev) => ({
      ...prev,
      needsSponsorship: checked,
    }))
  }

  const handleAddLocation = () => {
    if (newLocation.trim() && !relocationInfo.preferredLocations.includes(newLocation)) {
      setRelocationInfo((prev) => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, newLocation],
      }))
      setNewLocation("")
    }
  }

  const handleRemoveLocation = (location: string) => {
    setRelocationInfo((prev) => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter((loc) => loc !== location),
    }))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Relocation & Travel</CardTitle>
          <CardDescription>Set your relocation and travel preferences</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Willing to Relocate</Label>
              <RadioGroup
                value={relocationInfo.willingToRelocate}
                onValueChange={handleWillingToRelocateChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="relocate-yes" />
                  <Label htmlFor="relocate-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="relocate-no" />
                  <Label htmlFor="relocate-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="For the right opportunity" id="relocate-maybe" />
                  <Label htmlFor="relocate-maybe">For the right opportunity</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>Preferred Locations</Label>
              <div className="flex gap-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Add a location"
                />
                <Button onClick={handleAddLocation} disabled={!newLocation.trim()}>
                  Add
                </Button>
              </div>
              {relocationInfo.preferredLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {relocationInfo.preferredLocations.map((location) => (
                    <Badge key={location} variant="secondary" className="flex items-center gap-1">
                      {location}
                      <button
                        onClick={() => handleRemoveLocation(location)}
                        className="ml-1 rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {location}</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Label htmlFor="travel-preference">Travel Preference</Label>
              <Select value={relocationInfo.travelPreference} onValueChange={handleTravelPreferenceChange}>
                <SelectTrigger id="travel-preference">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="No travel">No travel</SelectItem>
                  <SelectItem value="Up to 10%">Up to 10%</SelectItem>
                  <SelectItem value="Up to 25%">Up to 25%</SelectItem>
                  <SelectItem value="Up to 50%">Up to 50%</SelectItem>
                  <SelectItem value="50% or more">50% or more</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="international-travel"
                  checked={relocationInfo.internationalTravel}
                  onCheckedChange={(checked) => handleInternationalTravelChange(checked as boolean)}
                />
                <Label htmlFor="international-travel">Willing to travel internationally</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needs-visa"
                  checked={relocationInfo.needsVisa}
                  onCheckedChange={(checked) => handleNeedsVisaChange(checked as boolean)}
                />
                <Label htmlFor="needs-visa">Requires visa for work</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needs-sponsorship"
                  checked={relocationInfo.needsSponsorship}
                  onCheckedChange={(checked) => handleNeedsSponsorshipChange(checked as boolean)}
                />
                <Label htmlFor="needs-sponsorship">Requires sponsorship</Label>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">Willing to Relocate</h3>
                <p>{relocationInfo.willingToRelocate}</p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Travel Preference</h3>
                <p>{relocationInfo.travelPreference}</p>
                <p className="text-sm text-muted-foreground">
                  {relocationInfo.internationalTravel
                    ? "Willing to travel internationally"
                    : "Not willing to travel internationally"}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Preferred Locations</h3>
              <div className="flex flex-wrap gap-2">
                {relocationInfo.preferredLocations.map((location) => (
                  <Badge key={location} variant="outline" className="bg-primary/5">
                    {location}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Visa & Sponsorship</h3>
              <p>
                {relocationInfo.needsVisa ? "Requires visa for work" : "Does not require visa for work"}
                {relocationInfo.needsSponsorship && ", requires sponsorship"}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

