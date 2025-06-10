import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Save, Flag, Globe } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function VisaInfo() {
  const [isEditing, setIsEditing] = useState(false)
  const [visaInfo, setVisaInfo] = useState({
    nationality: "United States",
    residenceCountry: "United States",
    workAuthorization: "US Citizen",
    visaType: "",
    visaExpiryDate: "",
    requiresSponsorship: false,
    additionalInfo: "",
  })

  const handleChange = (field: keyof typeof visaInfo, value: string | boolean) => {
    setVisaInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleWorkAuthorizationChange = (value: string) => {
    setVisaInfo((prev) => ({
      ...prev,
      workAuthorization: value,
      visaType: value === "Work Visa" ? prev.visaType : "",
      visaExpiryDate: value === "Work Visa" ? prev.visaExpiryDate : "",
      requiresSponsorship: value === "Work Visa" ? prev.requiresSponsorship : false,
    }))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Visa & Nationality</CardTitle>
          <CardDescription>Provide information about your work authorization status</CardDescription>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality</Label>
                <Input
                  id="nationality"
                  value={visaInfo.nationality}
                  onChange={(e) => handleChange("nationality", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="residenceCountry">Country of Residence</Label>
                <Input
                  id="residenceCountry"
                  value={visaInfo.residenceCountry}
                  onChange={(e) => handleChange("residenceCountry", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label>Work Authorization Status</Label>
              <RadioGroup
                value={visaInfo.workAuthorization}
                onValueChange={handleWorkAuthorizationChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="US Citizen" id="auth-citizen" />
                  <Label htmlFor="auth-citizen">US Citizen</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="US Permanent Resident" id="auth-resident" />
                  <Label htmlFor="auth-resident">US Permanent Resident (Green Card)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Work Visa" id="auth-visa" />
                  <Label htmlFor="auth-visa">Work Visa</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EAD" id="auth-ead" />
                  <Label htmlFor="auth-ead">Employment Authorization Document (EAD)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Not Authorized" id="auth-none" />
                  <Label htmlFor="auth-none">Not Authorized to Work in the US</Label>
                </div>
              </RadioGroup>
            </div>

            {visaInfo.workAuthorization === "Work Visa" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="visaType">Visa Type</Label>
                  <Input
                    id="visaType"
                    value={visaInfo.visaType}
                    onChange={(e) => handleChange("visaType", e.target.value)}
                    placeholder="e.g., H-1B, L-1, O-1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visaExpiryDate">Visa Expiry Date</Label>
                  <Input
                    id="visaExpiryDate"
                    type="date"
                    value={visaInfo.visaExpiryDate}
                    onChange={(e) => handleChange("visaExpiryDate", e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="requiresSponsorship"
                    checked={visaInfo.requiresSponsorship}
                    onCheckedChange={(checked) => handleChange("requiresSponsorship", checked as boolean)}
                  />
                  <Label htmlFor="requiresSponsorship">I require sponsorship for employment visa status</Label>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
              <Input
                id="additionalInfo"
                value={visaInfo.additionalInfo}
                onChange={(e) => handleChange("additionalInfo", e.target.value)}
                placeholder="Any additional information about your work authorization"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-medium">Nationality</h3>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-primary" />
                  <span>{visaInfo.nationality}</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Country of Residence</h3>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  <span>{visaInfo.residenceCountry}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium">Work Authorization Status</h3>
              <p>{visaInfo.workAuthorization}</p>

              {visaInfo.workAuthorization === "Work Visa" && (
                <div className="space-y-2 mt-2">
                  <p>
                    <span className="text-muted-foreground">Visa Type:</span> {visaInfo.visaType}
                  </p>
                  {visaInfo.visaExpiryDate && (
                    <p>
                      <span className="text-muted-foreground">Expiry Date:</span>{" "}
                      {new Date(visaInfo.visaExpiryDate).toLocaleDateString()}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {visaInfo.requiresSponsorship
                      ? "Requires sponsorship for employment visa status"
                      : "Does not require sponsorship"}
                  </p>
                </div>
              )}
            </div>

            {visaInfo.additionalInfo && (
              <div className="space-y-3">
                <h3 className="font-medium">Additional Information</h3>
                <p>{visaInfo.additionalInfo}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

