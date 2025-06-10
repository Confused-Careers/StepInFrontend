import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; 
import { ArrowRight, Sparkles, CheckCircle, Star } from "lucide-react";
import { TestimonialsSection } from "./TestimonialCarousel";
import { HowItWorksSection } from "./HowItWorks";
import Footer from "@/components/Layout/Footer";
import Navbar from "@/components/Layout/Navbar";
import { JobsSection } from "./JobPost";
import ResponsiveFeatureStrip from "./FeaturesSection";
import mainimage from "@/assets/mainimage.png";

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
        <section className="py-12 md:py-12 overflow-hidden relative">
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
                  Find Your{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                      Perfect
                    </span>
                    <span className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/30 rounded-full"></span>
                  </span>{" "}
                  Job Match
                </h1>

                <p className="text-muted-foreground text-lg md:text-xl max-w-[600px]">
                  StepIn uses advanced AI to match your unique skills, experience, and behavior to the perfect job
                  opportunities.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button
                    size="lg"
                    className="group text-lg relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
                    onClick={() => navigate("/onboarding")}
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer-slow"></span>
                    <span className="relative z-10 flex items-center">
                      Begin
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
                      Post a Job
                      <span className="ml-2 h-5 w-5 relative">
                        <ArrowRight className="absolute transition-all duration-300 group-hover:translate-x-5 group-hover:opacity-0" />
                        <ArrowRight className="absolute transition-all duration-300 -translate-x-5 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                      </span>
                    </span>
                    <span className="absolute inset-0 scale-0 rounded-md bg-white/20 group-active:scale-100 group-active:duration-200"></span>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="group relative overflow-hidden transition-all duration-300"
                  >
                    <span className="relative z-10">Learn More</span>
                    <span className="absolute inset-0 bg-primary/10 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                    <span className="absolute inset-0 scale-0 rounded-md bg-white/20 group-active:scale-100 group-active:duration-200"></span>
                  </Button>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background"
                      >
                        <span className="text-xs font-medium">{i}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">1,000+</span> people found jobs this week
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative h-[400px] lg:h-[600px]"
              >
                <div className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/10 shadow-xl">
                  <div className="absolute inset-0 opacity-30">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white animate-twinkle"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          width: `${Math.random() * 3 + 1}px`,
                          height: `${Math.random() * 3 + 1}px`,
                          animationDelay: `${Math.random() * 4}s`,
                          animationDuration: `${Math.random() * 4 + 2}s`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[80%] h-[80%] relative">
                      <div className="absolute top-0 left-0 w-full h-full rounded-xl overflow-hidden shadow-2xl animate-float">
                        <img
                          src={mainimage}
                          alt="StepIn Dashboard Preview"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div
                        className="absolute -bottom-6 -right-6 bg-background rounded-lg p-4 shadow-lg border animate-float"
                        style={{ animationDelay: "1s" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Perfect Match!</p>
                            <p className="text-sm text-muted-foreground">Senior UX Designer</p>
                          </div>
                        </div>
                      </div>

                      <div
                        className="absolute -top-6 -left-6 bg-background rounded-lg p-4 shadow-lg border animate-float"
                        style={{ animationDelay: "2s" }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                            <Star className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">95% Match</p>
                            <p className="text-sm text-muted-foreground">Based on your profile</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="mt-20">
              <p className="text-center text-sm text-muted-foreground mb-6">TRUSTED BY LEADING COMPANIES</p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="opacity-50 hover:opacity-100 transition-opacity">
                    <img
                      src={`/placeholder.svg?height=30&width=120&text=Company${i}`}
                      alt={`Company ${i}`}
                      className="h-8 w-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <ResponsiveFeatureStrip/>

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Jobs Section */}
        <JobsSection/>

        {/* Testimonials Section */}
        <TestimonialsSection/>

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
                  Ready to Find Your Perfect Job?
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
      </main>
      <Footer/>
    </div>
  );
}