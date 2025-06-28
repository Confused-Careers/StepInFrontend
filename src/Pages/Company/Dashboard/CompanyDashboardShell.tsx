import { useState, type ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Menu, X, LogOut, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { ModeToggle } from "@/components/Others/ModeToggle";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "../../../assets/StepIn Transparent Logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";
import companyServices from "@/services/companyServices";

interface DashboardShellProps {
  children: ReactNode;
}

interface CompanyProfile {
  companyName: string;
  logoUrl: string;
}

export function CompanyDashboardShell({ children }: DashboardShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile | null>(null);

  const navigation = [
    { name: "Job Postings", href: "/company/dashboard/jobposts" },
    { name: "Post a Job", href: "/company/dashboard/job/new" },
    { name: "Messages", href: "/company/dashboard/company-messages" },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await companyServices.getProfile();
        setProfile({
          companyName: data.companyName || "",
          logoUrl: data.logoUrl || "",
        });
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("google_email");
    localStorage.removeItem("userType");
    localStorage.removeItem("google_accessToken");
    navigate("/company/login", { replace: true });
  };

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") {
      return true;
    }
    if (path !== "/dashboard" && location.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container px-4 md:px-6 flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
              <span className="text-xl font-bold">StepIn</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Button key={item.name} variant={isActive(item.href) ? "default" : "ghost"} size="sm" className="flex items-center gap-1" onClick={() => navigate(item.href)}>
                  <span>{item.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <NotificationDropdown />
            {/* <ModeToggle /> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 hidden md:flex">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.logoUrl || "/placeholder.svg?height=32&width=32"} alt={profile?.companyName || "Company"} />
                    <AvatarFallback>{profile?.companyName?.[0] || "C"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{profile?.companyName || "My Account"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/company/dashboard/profile")} className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/company/forgot-password")} className="cursor-pointer">
                  <Key className="mr-2 h-4 w-4" />
                  Change Password
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <motion.div className="md:hidden" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
            <div className="container px-4 py-4 flex flex-col space-y-3 border-t">
              {navigation.map((item) => (
                <Button key={item.name} variant={isActive(item.href) ? "default" : "ghost"} className="justify-start h-12 text-base" onClick={() => { navigate(item.href); setMobileMenuOpen(false); }}>
                  {item.name}
                </Button>
              ))}

              <Button variant="ghost" className="justify-start h-12 text-base" onClick={() => { navigate("/company/dashboard/profile"); setMobileMenuOpen(false); }}>
                <User className="mr-3 h-5 w-5" />
                Profile
              </Button>

              <Button variant="ghost" className="justify-start h-12 text-base text-destructive hover:text-destructive" onClick={() => handleLogout()}>
                <LogOut className="mr-3 h-5 w-5" />
                Log out
              </Button>
            </div>
          </motion.div>
        )}
      </header>

      <div className="container px-2 md:px-3 py-6 flex-1">
        {children}
      </div>
    </div>
  );
}