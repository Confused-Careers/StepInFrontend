import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import StarryBackground from "@/components/Others/StarryBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <div className="container max-w-md z-10">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
            <span className="text-xl font-bold">StepIn</span>
          </div>
        </div>

        <Card className="border-primary/20 bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Company Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your company dashboard
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
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Don't have a company account? </span>
              <a href="/company/register" className="text-primary hover:underline">
                Register here
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <a href="/individual-login" className="text-sm text-muted-foreground hover:text-primary">
              Looking for a job? Sign in as an individual
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CompanyLogin;
