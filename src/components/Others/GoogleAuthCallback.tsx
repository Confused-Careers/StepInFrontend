import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import StarryBackground from "@/components/Others/StarryBackground";
import Logo from "../../assets/StepIn Transparent Logo.png";
import { toast } from "sonner";
import authServices from "@/services/authServices";
import {jwtDecode} from "jwt-decode";

interface GoogleIdTokenPayload {
  email: string;
  given_name?: string;
  family_name?: string;
}

export function GoogleAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.replace("#", ""));
    const idToken = hashParams.get("id_token");
    const errorParam = hashParams.get("error");
    // Removed nonce logic
    const state = hashParams.get("state");
    let flow = "login";
    let onboardingAnswers: Array<{ questionId: string; selectedOptionId: string }> = [];

    // Parse state
    try {
      const parsedState = state ? JSON.parse(decodeURIComponent(state)) : {};
      flow = parsedState.flow || "login";
      onboardingAnswers = parsedState.onboardingAnswers || [];
    } catch {
      console.warn("Invalid state parameter");
    }

    if (errorParam) {
      setError("Authentication failed. Please try again.");
      toast.error("Google authentication failed. Please try again.");
      setTimeout(() => {
        navigate(flow === "register" ? "/onboarding" : "/login", { replace: true });
      }, 3000);
      return;
    }

    if (idToken) {
      const handleAuth = async () => {
        try {
          let response;
          if (flow === "login") {
            response = await authServices.googleLogin({ idToken });
            localStorage.setItem("accessToken", response.accessToken || "");
            localStorage.setItem("userType", "individual");
            toast.success("Login successful!", { description: "Welcome back!" });
            navigate("/dashboard/interactive", { replace: true });
          } else {
            // Decode the ID token to extract user information
            const decoded: GoogleIdTokenPayload = jwtDecode(idToken);
            const email = decoded.email;
            const firstName = decoded.given_name || "";
            const lastName = decoded.family_name || "";
            localStorage.setItem("google_accessToken", idToken);
            localStorage.setItem("google_email", email);
            localStorage.setItem("google_firstName", firstName);
            localStorage.setItem("google_lastName", lastName);
            localStorage.setItem("onboarding_onboardingAnswers", JSON.stringify(onboardingAnswers));
            const currentStep = parseInt(localStorage.getItem("onboarding_currentStep") || "4", 10);
            localStorage.setItem("onboarding_currentStep", (currentStep + 1).toString());
            navigate("/onboarding", { replace: true });
          }
        } catch (error: unknown) {
          setError("Authentication failed. Please try again.");
          let errorMessage = "Authentication error.";
          if (error && typeof error === "object" && "message" in error) {
            errorMessage = (error as { message: string }).message;
          }
          toast.error(errorMessage, { description: "Please try again." });
          setTimeout(() => {
            navigate(flow === "register" ? "/onboarding" : "/login", { replace: true });
          }, 3000);
        }
      };
      handleAuth();
    } else {
      setError("No ID token received. Redirecting...");
      toast.error("Authentication error: No ID token received.");
      setTimeout(() => {
        navigate(flow === "register" ? "/onboarding" : "/login", { replace: true });
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