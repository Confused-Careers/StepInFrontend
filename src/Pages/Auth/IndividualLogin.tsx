import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StarryBackground from "@/components/Others/StarryBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "../../assets/StepIn Transparent Logo.png";
import authServices from "@/services/authServices";
import { toast } from "sonner";

const IndividualLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authServices.login({
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("accessToken", response.accessToken || "");
      localStorage.setItem("userType", "individual");
      setIsLoading(false);
      toast.success("Login successful!", {
        description: "Welcome back!",
      });
      navigate("/dashboard/interactive");
    } catch (error: unknown) {
      setIsLoading(false);
      let errorMessage = "Login failed. Please try again.";
      if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as { message: string }).message;
      }
      toast.error(errorMessage, { description: "Error" });
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = "profile email";
      const state = JSON.stringify({ flow: "login" });
      const nonce = crypto.randomUUID(); 
      sessionStorage.setItem("google_nonce", nonce);
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&state=${encodeURIComponent(state)}&nonce=${nonce}`;
      window.location.href = googleAuthUrl;
    } catch (error) {
      setIsLoading(false);
      toast.error("Failed to initiate Google Sign-In", {
        description: "Please try again",
      });
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
            <button className="border border-[#0A84FF] text-white px-4 py-2 transition-colors rounded-xl">
              <a href="/company/login" className="text-lg text-primary text-[#0A84FF] font-semibold">
                Employer
              </a>
            </button>
            <button className="bg-primary text-white px-4 py-2 hover:bg-primary/90 transition-colors rounded-xl">
              <a href="/individual-login" className="text-lg text-primary text-white font-semibold">
                Job Seeker
              </a>
            </button>
          </div>
        </div>
        <Card className="border-primary/20 bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to continue your job search journey and track your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              className="w-full mb-4 flex items-center gap-2"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Sign in with Google
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted-foreground/20"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="/individual-forget-password" className="text-sm text-primary hover:underline">
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
                  className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
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
              <Button type="submit" className="w-full text-white" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <a href="/onboarding" className="text-primary hover:underline">
                New to StepIn? Create a free profile
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndividualLogin;