import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import StarryBackground from "@/components/Others/StarryBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import authServices from "@/services/authServices";
import ResetPasswordModal from "@/components/Modals/ResetPasswordModal";
import Logo from "../../assets/StepIn Transparent Logo.png";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authServices.forgotPassword({ email });
      setSuccess(response.message); // Backend always returns a success message
      setShowResetModal(true); // Open modal to enter OTP and new password
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to send reset OTP. Please try again.');
      } else {
        setError('Failed to send reset OTP. Please try again.');
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
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email to receive a password reset OTP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              {success && (
                <div className="text-green-500 text-sm text-center">{success}</div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="company@example.com"
                  value={email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Reset OTP"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate("/company-login")}
                disabled={isLoading}
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <ResetPasswordModal
        isOpen={showResetModal}
        onClose={() => {
          setShowResetModal(false);
          navigate("/company/login");
        }}
        email={email}
      />
    </div>
  );
};

export default ForgotPassword;