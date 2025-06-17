import React, { useState, FormEvent, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import authServices from "@/services/authServices";
import { toast } from "sonner";

interface VerifyEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  navigation: () => void;
}

interface FormData {
  otpCode: string;
}

const VerifyEmailModal: React.FC<VerifyEmailModalProps> = ({ isOpen, onClose, email, navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    otpCode: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string): void => {
    // Only allow single digit
    if (value.length > 1) return;
    
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);
    
    // Update the main form data
    const otpCode = newOtpDigits.join("");
    setFormData((prev) => ({ ...prev, otpCode }));
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };


  const handleResendOtp = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authServices.resendOtp({
        email,
        otpType: "email_verification",
      });
      setSuccess(response.message);
      toast.success("Authentication Code resent successfully!", {
        description: "Please check your email for the new authentication code.",
      });
    } catch (err: unknown) {
      type ErrorWithMessage = { message: string };
      if (err && typeof err === "object" && "message" in err && typeof (err as ErrorWithMessage).message === "string") {
        setError((err as ErrorWithMessage).message);
      } else {
        setError('Failed to resend Authentication Code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await authServices.verifyEmail({
        email,
        otpCode: formData.otpCode,
      });
      setSuccess(response.message);
      toast.success("Email verified successfully!", {
        description: "You can now log in to your account.",
      });
      navigation();
    } catch (err: unknown) {
      type ErrorWithMessage = { message: string };
      if (err && typeof err === "object" && "message" in err && typeof (err as ErrorWithMessage).message === "string") {
        setError((err as ErrorWithMessage).message);
      } else {
        setError('Email verification failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = (): void => {
    // Reset form data and close modal without form validation
    setFormData({ otpCode: "" });
    setOtpDigits(["", "", "", "", "", ""]);
    setError(null);
    setSuccess(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="border-primary/20 bg-background/80 backdrop-blur-md max-w-md w-full">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify Email</CardTitle>
          <CardDescription className="text-center">
            Enter the Authentication Code sent to {email} to complete registration
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
              <Label htmlFor="otpCode">Authentication Code</Label>
              <div className="flex gap-2 justify-center">
                {otpDigits.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-bold"
                    required
                  />
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              Resend Authentication Code
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailModal;