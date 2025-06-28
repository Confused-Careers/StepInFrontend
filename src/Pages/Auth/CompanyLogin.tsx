import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import StarryBackground from "@/components/Others/StarryBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import authServices from "@/services/authServices";
import Logo from "../../assets/StepIn Transparent Logo.png";
import { toast } from "sonner";

interface FormData {
  email: string;
  password: string;
}

const CompanyLogin: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await authServices.companyLogin(formData);
      localStorage.setItem('accessToken', response.accessToken || '');
      toast.success("Login successful!", {
        description: "Welcome back to your company dashboard!",
      });
      localStorage.setItem('userType', 'company');
      navigate("/company/dashboard/jobposts");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message || 'Login failed. Please check your credentials.');
        setError(err.message || 'Login failed. Please check your credentials.');
      } else {
        toast.error('Login failed. Please check your credentials.');
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <StarryBackground />
      <div className="container max-w-[470px] z-10">
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
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Access your dashboard to review applicants, post roles, and manage interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="/company/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                  </a>
                </div>
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
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                  {showPassword ? (
                    // Eye-off SVG
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-11-7.5a11.72 11.72 0 012.89-4.36m3.11-2.14A9.956 9.956 0 0112 5c5 0 9.27 3.11 11 7.5a11.72 11.72 0 01-4.17 5.37M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                    </svg>
                  ) : (
                    // Eye SVG
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                  </button>
                </div>
                </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <a href="/company/register" className="text-primary hover:underline">
                New to StepIn? Set up your free employer account
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyLogin;
