import { ProfileProvider } from "@/Contexts/ProfileContext";
import { ProfilePage } from "@/Pages/Profile/ProfilePage";

export default function Page() {
  return (
    <ProfileProvider>
      <ProfilePage />
    </ProfileProvider>
  );
} 