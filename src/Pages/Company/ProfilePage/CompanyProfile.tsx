import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { toast } from "sonner";
import companyServices from "@/services/companyServices";
import Logo from "../../../assets/StepIn Transparent Logo.png";
import { Globe, MapPin, Users, Building2, Upload, X, Camera, Check } from "lucide-react";

interface CompanyProfileData {
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  description: string;
  location: string;
  logoUrl: string;
}

interface UpdateProfilePayload {
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  description: string;
  location: string;
}

interface LogoResponse {
  logoUrl: string;
}

const industries = [
  "Accounting", "Advertising", "Aerospace", "Agriculture", "Architecture",
  "Automotive", "Banking", "Biotechnology", "Construction", "Consulting",
  "Consumer Goods", "Education", "Energy", "Engineering", "Entertainment",
  "Environmental Services", "Fashion", "Finance", "Food & Beverage", "Government",
  "Healthcare", "Hospitality", "Human Resources", "Information Technology", "Insurance",
  "Legal Services", "Logistics", "Manufacturing", "Marketing", "Media",
  "Mining", "Non-Profit", "Pharmaceuticals", "Public Relations", "Real Estate",
  "Retail", "Security", "Sports", "Technology", "Telecommunications", "Tourism",
  "Transportation", "Utilities", "Venture Capital", "Waste Management", "Wholesale", "Other"
];

export default function CompanyProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [profile, setProfile] = useState<CompanyProfileData>({
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    description: "",
    location: "",
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isIndustryOpen, setIsIndustryOpen] = useState(false);
  const [newIndustry, setNewIndustry] = useState("");

  const fetchProfile = useCallback(async (signal: AbortSignal) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No token found");
      }
      const data = await companyServices.getProfile();
      setProfile({
        companyName: data.companyName || "",
        industry: data.industry || "",
        companySize: data.companySize || "",
        website: data.website || "",
        description: data.description || "",
        location: data.location || "",
        logoUrl: data.logoUrl || "",
      });
      setNewIndustry(data.industry || "");
    } catch (error) {
      if (signal.aborted) return;
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || "Failed to load company profile"
          : "Failed to load company profile"
      );
    } finally {
      if (!signal.aborted) setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProfile(controller.signal);
    return () => controller.abort();
  }, [fetchProfile]);

  useEffect(() => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(logoFile);
    } else {
      setLogoPreview(null);
    }
  }, [logoFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    const fieldMap: { [key: string]: string } = {
      websiteUrl: "website",
      companyDescription: "description",
      city: "location",
    };
    setProfile((prev) => ({ ...prev, [fieldMap[id] || id]: value }));
  };

  const handleSelectChange = (value: string) => {
    setProfile((prev) => ({ ...prev, companySize: value }));
  };

  const handleIndustryChange = (value: string) => {
    setProfile((prev) => ({ ...prev, industry: value }));
    setNewIndustry(value);
    setIsIndustryOpen(false);
  };

  useEffect(() => {
    if (newIndustry) {
      setProfile((prev) => ({ ...prev, industry: newIndustry }));
    }
  }, [newIndustry]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit");
        return;
      }
      if (!/(jpg|jpeg|png|gif|svg)$/.test(file.type)) {
        toast.error("Invalid file type. Use JPG, PNG, GIF, or SVG");
        return;
      }
      setLogoFile(file);
    }
  };

  const removeLogoPreview = () => {
    setLogoFile(null);
    setLogoPreview(null);
    const fileInput = document.getElementById('logo') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await companyServices.updateProfile({
        companyName: profile.companyName,
        industry: profile.industry,
        companySize: profile.companySize,
        website: profile.website,
        description: profile.description,
        location: profile.location,
      } as UpdateProfilePayload);
      if (logoFile) {
        const logoResponse: LogoResponse = await companyServices.uploadLogo(logoFile);
        if (logoResponse.logoUrl) {
          setProfile((prev) => ({ ...prev, logoUrl: logoResponse.logoUrl }));
          setLogoFile(null);
          setLogoPreview(null);
          const updatedProfile = await companyServices.getProfile();
          setProfile(prev => ({
            ...prev,
            logoUrl: updatedProfile.logoUrl || prev.logoUrl
          }));
        }
      }
      toast.success("Profile updated successfully");
    } catch (error) {
      const errorMessage =
        typeof error === "object" && error !== null && "message" in error
          ? (error as { message?: string }).message || "Failed to update profile"
          : "Failed to update profile";
      if (errorMessage.includes("invalid input value for enum companies_companysize_enum")) {
        toast.error("Invalid company size selected. Please choose a valid option.");
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2 text-white">
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex items-center justify-center gap-3 mb-12">
          <img src={Logo} alt="StepIn Logo" className="h-12 w-12" />
          <span className="text-3xl font-bold text-white tracking-tight">StepIn</span>
        </div>
        <div className="">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="xl:col-span-2"
          >
            <Card className="border border-blue-500/20 backdrop-blur-xl shadow-2xl">
              <CardHeader className="relative pb-8">
                <div className="flex justify-center mb-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-2 border-blue-400/40 flex items-center justify-center overflow-hidden hover:border-blue-400/60 transition-colors bg-slate-800/50">
                      {profile.logoUrl ? (
                        <img
                          src={profile.logoUrl}
                          alt="Company Logo"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder.svg?height=96&width=96";
                            e.currentTarget.alt = "Default Logo";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <Camera className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-center text-white">
                  Company Profile
                </CardTitle>
                <p className="text-center text-slate-400 mt-2">
                  Update your company information
                </p>
              </CardHeader>
              <CardContent className="px-6 lg:px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white font-medium flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company Name
                    </Label>
                    <Input id="companyName" value={profile.companyName} onChange={handleInputChange} required className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all" placeholder="Enter your company name" />
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-10 gap-4">
                      <div className="col-span-10 md:col-span-3 space-y-2">
                        <Label htmlFor="industry" className="text-white font-medium flex items-center gap-2">
                          Industry
                        </Label>
                        <Select open={isIndustryOpen} onOpenChange={setIsIndustryOpen} value={profile.industry} onValueChange={handleIndustryChange}>
                          <SelectTrigger className="bg-black border border-[rgba(209,209,214,0.2)] text-white w-full">
                            <SelectValue placeholder="Select industry">
                              {profile.industry || "Select industry"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-[rgba(209,209,214,0.2)] max-h-60 no-scrollbar w-full">
                            <Command className="bg-black text-white">
                              <CommandInput placeholder="Search industries..." className="bg-black border-[rgba(209,209,214,0.2)] text-white placeholder:text-slate-400 no-scrollbar" />
                              <CommandList className="no-scrollbar">
                                <CommandEmpty className="text-slate-400 py-2 text-center no-scrollbar">No industries found.</CommandEmpty>
                                <CommandGroup className="no-scrollbar">
                                  {industries.map((industry) => (
                                    <CommandItem
                                      key={industry}
                                      value={industry}
                                      onSelect={() => handleIndustryChange(industry)}
                                      className="text-white hover:bg-[rgba(209,209,214,0.1)] data-[selected=true]:bg-[rgba(209,209,214,0.2)] no-scrollbar"
                                    >
                                      <Check
                                        className={`mr-2 h-4 w-4 ${profile.industry === industry ? "opacity-100" : "opacity-0"}`}
                                      />
                                      {industry}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-10 md:col-span-3 space-y-2">
                        <Label htmlFor="companySize" className="text-white font-medium flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Company Size
                        </Label>
                        <Select onValueChange={handleSelectChange} value={profile.companySize}>
                          <SelectTrigger className="bg-black border border-[rgba(209,209,214,0.2)] text-white w-full">
                            <SelectValue placeholder="Select company size" />
                          </SelectTrigger>
                          <SelectContent className="bg-black text-white border-[rgba(209,209,214,0.2)]">
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="501-1000">501-1000 employees</SelectItem>
                            <SelectItem value="1000+">1001+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-10 md:col-span-4 space-y-2">
                        <Label htmlFor="city" className="text-white font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </Label>
                        <Input id="city" value={profile.location} onChange={handleInputChange} className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all w-full" placeholder="City, State/Country" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl" className="text-white font-medium flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Website
                    </Label>
                    <Input id="websiteUrl" value={profile.website} onChange={handleInputChange} type="url" className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all" placeholder="https://your-company.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyDescription" className="text-white font-medium">Company Description</Label>
                    <Textarea id="companyDescription" value={profile.description} onChange={handleInputChange} className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 transition-all min-h-[100px] resize-none" placeholder="Tell us about your company, mission, and values..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-white font-medium flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      Company Logo
                    </Label>
                    <div className="relative">
                      <div className="bg-slate-800/50 border border-slate-600/50 rounded-lg p-4 transition-all hover:border-blue-400/50 group cursor-pointer" onClick={() => document.getElementById('logo')?.click()}>
                        {logoPreview ? (
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600/50 flex-shrink-0">
                              <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-medium truncate">{logoFile?.name || "Current Logo"}</p>
                              <p className="text-slate-400 text-sm">{logoFile ? `${(logoFile.size / 1024 / 1024).toFixed(2)} MB` : "Click to change logo"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button type="button" title="Remove logo" onClick={(e) => { e.stopPropagation(); removeLogoPreview(); }} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors">
                                <X className="w-4 h-4" />
                              </button>
                              <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                                <Upload className="w-5 h-5" />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3 py-8 text-slate-400 group-hover:text-blue-400 transition-colors">
                            <Upload className="w-6 h-6" />
                            <div className="text-center">
                              <p className="font-medium">Upload Company Logo</p>
                              <p className="text-sm">JPG, PNG, GIF, or SVG (Max 5MB)</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <Input id="logo" type="file" accept="image/jpeg,image/png,image/gif,image/svg+xml" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 text-lg rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none" disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving Profile...
                      </div>
                    ) : (
                      "Save Profile"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}