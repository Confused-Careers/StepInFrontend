import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import authServices from "@/services/authServices";
import { toast } from "sonner";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

interface ResetPasswordFormData {
  otpCode: string;
  newPassword: string;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ isOpen, onClose, email }) => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    otpCode: "",
    newPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData((prev: ResetPasswordFormData) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response: { message: string } = await authServices.resetPassword({
        email,
        otpCode: formData.otpCode,
        newPassword: formData.newPassword,
      });
      setSuccess(response.message);
      toast.success("Password reset successful!", {
        description: "You can now log in with your new password.",
      });
      setTimeout(onClose, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Password reset failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="container max-w-md">
        <Card className="border-primary/20 bg-background/90 backdrop-blur-md">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Enter the OTP sent to your email and your new password.
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
                <Label htmlFor="otpCode">OTP Code</Label>
                <Input
                  id="otpCode"
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={formData.otpCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordModal;