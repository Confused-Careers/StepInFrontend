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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Logo from "../../assets/StepIn Transparent Logo.png";
import authServices from "@/services/authServices";
import { toast } from "sonner";

const IndividualLogin: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
            <span className="text-xl font-bold">StepIn</span>
          </div>
        </div>
        <Card className="border-primary/20 bg-background/80 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Sign in to continue your job search journey</CardDescription>
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
              <span className="text-muted-foreground">Don't have an account? </span>
              <a href="/onboarding" className="text-primary hover:underline">
                Register here
              </a>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <a href="/company/login" className="text-sm text-muted-foreground hover:text-primary">
              Hiring? Sign in as a company
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default IndividualLogin;