import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { ArrowRight, Sparkles } from "lucide-react";
import { HowItWorksSection } from "./HowItWorks";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import ResponsiveFeatureStrip from "./FeaturesSection";
import { TestimonialsSection } from "./TestimonialCarousel";

export default function LandingPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-1">
        <section className="py-12 md:py-12 overflow-hidden relative min-h-[600px] lg:min-h-[800px] flex items-center">
          {/* Video Background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover -z-20"
            src="/src/assets/hero-bg.mp4"
          />
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent" />
            <div className="absolute top-1/4 -left-64 w-96 h-96 bg-gradient-to-r from-primary/30 to-primary/10 rounded-full blur-3xl animate-pulse-slow" />
            <div
              className="absolute bottom-1/3 -right-64 w-96 h-96 bg-gradient-to-l from-primary/30 to-primary/10 rounded-full blur-3xl animate-pulse-slow"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl animate-float"
              style={{ animationDuration: "8s" }}
            />
            <div
              className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-to-bl from-primary/15 to-transparent rounded-full blur-3xl animate-float"
              style={{ animationDuration: "10s", animationDelay: "1s" }}
            />
          </div>

          <div className="container">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI-Powered Job Matching</span>
                </div>

                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Companies That Want{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    You
                    </span>
                    <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/30 rounded-full"></span>
                  </span>{" "}
                  for Who You Are!
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl max-w-[600px]">
                Smarter job matching based on your personality, goals, and work style — not just your resume.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className="group text-lg relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                    onClick={() => navigate("/onboarding")}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></span>
                    <span className="relative z-10 flex items-center">
                      Find my match
                      <span className="ml-2 h-5 w-5 relative">
                        <ArrowRight className="absolute transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-0" />
                        <ArrowRight className="absolute transition-all duration-300 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                      </span>
                    </span>
                    <span className="absolute inset-0 scale-0 rounded-md bg-white/20 group-active:scale-100 group-active:duration-200"></span>
                  </Button>
                  <Button
                    size="lg"
                    className="group text-lg relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                    onClick={() => navigate("/company/login")}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></span>
                    <span className="relative z-10 flex items-center">
                      Hire Talent
                      <span className="ml-2 h-5 w-5 relative">
                        <ArrowRight className="absolute transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-0" />
                        <ArrowRight className="absolute transition-all duration-300 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                      </span>
                    </span>
                    <span className="absolute inset-0 scale-0 rounded-md bg-white/20 group-active:scale-100 group-active:duration-200"></span>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <ResponsiveFeatureStrip/>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        <section id="cta" className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-blue opacity-10" />
            <div className="absolute top-1/4 -left-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/3 -right-64 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          </div>

          <div className="container">
            <div className="max-w-[800px] mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
                Stop Applying. Start Getting Offers.
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Join thousands of professionals who have found their dream jobs through StepIn.
                </p>
                <Button
                  size="lg"
                  className="group text-lg px-8 relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                  onClick={() => navigate("/onboarding")}
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></span>
                  <span className="relative z-10 flex items-center">
                    Begin Your Journey
                    <span className="ml-2 h-5 w-5 relative">
                      <ArrowRight className="absolute transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-0" />
                      <ArrowRight className="absolute transition-all duration-300 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                    </span>
                  </span>
                  <span className="absolute inset-0 scale-0 rounded-md bg-white/20 group-active:scale-100 group-active:duration-200"></span>
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        <Footer/>
      </main>
    </div>
  );
}