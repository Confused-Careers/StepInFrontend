import { JSX, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, MapPin, Briefcase, GraduationCap, Download, Share2 } from "lucide-react";
import { EditProfileModal } from "./EditProfileCompletion";

export function ProfileHeader(): JSX.Element {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <>
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background overflow-hidden relative">
        {/* Background mesh gradients */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl" />
        </div>

        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:items-center">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 p-1">
                <div className="rounded-full overflow-hidden w-full h-full">
                  <img
                    src="/placeholder.svg?height=128&width=128"
                    alt="Profile picture"
                    width={128}
                    height={128}
                    className="object-cover"
                  />
                </div>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-md"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit profile picture</span>
              </Button>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Alex Johnson</h1>
                  <p className="text-lg text-muted-foreground">Senior UX Designer</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="h-4 w-4 mr-1" />
                      5+ years experience
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      B.A. Design, Stanford University
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      UX Design
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      User Research
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Figma
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      Prototyping
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                  <Button variant="outline" size="sm" className="hover-lift">
                    <Download className="h-4 w-4 mr-2" />
                    Download CV
                  </Button>
                  <Button variant="outline" size="sm" className="hover-lift">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button size="sm" className="hover-lift" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Profile Modal */}
      <EditProfileModal open={isEditing} onOpenChange={setIsEditing} />
    </>
  );
}

