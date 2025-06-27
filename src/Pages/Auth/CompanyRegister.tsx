import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import StarryBackground from "@/components/Others/StarryBackground";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import authServices from "@/services/authServices";
import VerifyEmailModal from "@/components/Modals/VerifyEmailModal";
import Logo from "../../assets/StepIn Transparent Logo.png";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface FormData {
  email: string;
  password: string;
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  description: string;
  location: string;
}

const CompanyRegister: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    companyName: "",
    industry: "",
    companySize: "",
    website: "",
    description: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, companySize: value }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (step === 1) {
        if (!formData.email || !formData.password) {
          throw new Error("Email and password are required");
        }
        setStep(2);
      } else {
        await authServices.registerCompany(formData);
        toast.success("Registration successful! Please verify your email.");
        setShowVerifyModal(true); 
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      } else {
        toast.error("Registration failed. Please try again.");
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <StarryBackground />
      <div className="container max-w-md z-10">
        <div className="flex justify-center mb-6 flex-col">
          <div className="flex items-center gap-2 justify-center">
            <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
            <span className="text-xl font-bold">StepIn</span>
          </div>
          <div className="flex justify-center mt-8 mb-3 gap-24">
            <button className="bg-primary text-white px-4 py-2 hover:bg-primary/90 transition-colors rounded-xl">
              <a href="/company/login" className="text-lg text-primary text-white font-semibold">
                Employer
              </a>
            </button>
            <button className="border border-[#0A84FF] text-white px-4 py-2 transition-colors rounded-xl">
              <a href="/individual-login" className="text-lg text-primary text-[#0A84FF] font-semibold">
                Job Seeker
              </a>
            </button>
          </div>
        </div>

        <Card className="border-primary/20 bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Welcome to StepIn
            </CardTitle>
            <CardDescription className="text-center">
              {step === 1 ? "Enter your credentials" : "Enter company details"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              {step === 1 ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="company@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                    <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      />
                      <button
                      type="button"
                      className="absolute inset-y-0 right-2 flex items-center text-sm text-muted-foreground"
                      tabIndex={-1}
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                      {showPassword ? (
                        // Eye-off icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 012.92-4.36m3.1-2.44A9.96 9.96 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.17 5.36M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                        </svg>
                      ) : (
                        // Eye icon
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                      </button>
                    </div>
                    </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="Tech Innovations Inc"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      placeholder="Technology"
                      value={formData.industry}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select onValueChange={handleSelectChange} value={formData.companySize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-500">201-500 employees</SelectItem>
                        <SelectItem value="501-1000">501-1000 employees</SelectItem>
                        <SelectItem value="1000+">1001+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      placeholder="https://techinnovations.com"
                      value={formData.website}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                    <div className="space-y-2">
                    <Label htmlFor="description">Company Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Leading technology company..."
                      value={formData.description}
                      onChange={e => {
                      handleInputChange(e);
                      // Auto-resize textarea
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = "auto";
                      target.style.height = `${target.scrollHeight}px`;
                      }}
                      required
                      className="resize-none overflow-hidden"
                      style={{ minHeight: 80 }}
                    />
                    </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="San Francisco, CA"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : step === 1 ? "Next" : "Register"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <a href="/company/login" className="text-primary hover:underline">
                Already have an account? Sign in here
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      <VerifyEmailModal
        isOpen={showVerifyModal}
        onClose={() => navigate("/company/register")} 
        email={formData.email}
        navigation={() => navigate("/company/login")}
      />
    </div>
  );
};

export default CompanyRegister;