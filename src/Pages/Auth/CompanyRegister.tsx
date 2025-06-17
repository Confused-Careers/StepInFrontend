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
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
            <span className="text-xl font-bold">StepIn</span>
          </div>
        </div>

        <Card className="border-primary/20 bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Company Registration
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
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
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
              <span className="text-muted-foreground">Already have an account? </span>
              <a href="/company/login" className="text-primary hover:underline">
                Sign in here
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