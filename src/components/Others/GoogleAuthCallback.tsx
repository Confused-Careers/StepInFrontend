import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import StarryBackground from "@/components/Others/StarryBackground";
import Logo from "../../assets/StepIn Transparent Logo.png";
import { toast } from "sonner";
import axios from "axios";

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.replace('#', ''));
    const accessToken = hashParams.get('access_token');
    const errorParam = hashParams.get('error');

    if (errorParam) {
      setError("Authentication failed. Please try again.");
      toast.error("Google authentication failed. Please try again.");
      setTimeout(() => {
        navigate("/onboarding", { replace: true });
      }, 3000);
      return;
    }

    if (accessToken) {
      const fetchUserEmail = async () => {
        try {
          const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          localStorage.setItem("google_email", response.data.email);
          localStorage.setItem("google_accessToken", accessToken);
          const storedAnswers = sessionStorage.getItem('onboardingAnswers');
          if (storedAnswers) {
            const parsedAnswers = JSON.parse(storedAnswers);
            const currentOnboardingAnswers = localStorage.getItem('onboarding_onboardingAnswers');
            const updatedOnboardingAnswers = currentOnboardingAnswers
              ? [...JSON.parse(currentOnboardingAnswers), ...parsedAnswers]
              : parsedAnswers;
            localStorage.setItem('onboarding_onboardingAnswers', JSON.stringify(updatedOnboardingAnswers));
          }
          sessionStorage.removeItem('onboardingAnswers');
          const currentStep = parseInt(localStorage.getItem('onboarding_currentStep') || '4', 10);
          localStorage.setItem('onboarding_currentStep', (currentStep + 1).toString());
          navigate("/onboarding", { replace: true });
        } catch {
          setError("Failed to fetch user info. Redirecting...");
          toast.error("Authentication error: Failed to fetch user info.");
          setTimeout(() => {
            navigate("/onboarding", { replace: true });
          }, 3000);
        }
      };
      fetchUserEmail();
    } else {
      setError("No access token received. Redirecting...");
      toast.error("Authentication error: No access token received.");
      setTimeout(() => {
        navigate("/onboarding", { replace: true });
      }, 3000);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex flex-col dark:starry-background">
      <StarryBackground />
      <div className="container max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="text-center"
        >
          <div className="flex items-center gap-2 mb-4">
            <img src={Logo} alt="StepIn Logo" className="h-6 w-6" />
            <span className="font-bold text-2xl">StepIn</span>
          </div>
          {error ? (
            <p className="text-red-500 text-lg">{error}</p>
          ) : (
            <p className="text-lg">Authenticating with Google...</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}