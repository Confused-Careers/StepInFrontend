import { JSX } from "react";
import { motion } from "framer-motion";
import { MapPin, Eye, FileText, Link2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ProfileData } from "./types";

interface ProfileHeaderProps {
  profile: ProfileData;
  handleEdit: (section: string) => void;
}

export function ProfileHeader({ profile, handleEdit }: ProfileHeaderProps): JSX.Element {
  return (
    <div>
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>
        <div className="pt-0 relative">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
        >
            <Avatar className="h-24 w-24 border-4 border-background -mt-12 mb-4">
            <AvatarImage src={profile.profilePicture} alt={profile.name} />
            <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold">{profile.name}</h2>
            <p className="text-muted-foreground">{profile.title}</p>
            <div className="flex items-center mt-2 text-muted-foreground text-sm">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{profile.location}</span>
            </div>
            <div className="flex items-center mt-1 text-muted-foreground text-sm">
            <Eye className="h-4 w-4 mr-1" />
            <span>{profile.views} profile views this month</span>
            </div>
            <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" asChild>
                <a href={profile.resume}>
                <FileText className="h-4 w-4 mr-1" />Resume
                </a>
            </Button>
            <Button size="sm" asChild>
                <a href={profile.portfolio}>
                <Link2 className="h-4 w-4 mr-1" />Portfolio
                </a>
            </Button>
            <Button size="sm" onClick={() => handleEdit("basic")}>
                <Edit className="h-4 w-4 mr-1" />Edit
            </Button>
            </div>
        </motion.div>
        </div>
    </div>
  );
}