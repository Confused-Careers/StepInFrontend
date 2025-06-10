import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create Profile",
    description: "Begin your journey and answer a few questions about your preferences.",
  },
  {
    step: "02",
    title: "Upload Resume",
    description: "Our AI analyzes your skills and experience from your resume.",
  },
  {
    step: "03",
    title: "Get Matched",
    description: "Receive personalized job recommendations based on your profile.",
  },
  {
    step: "04",
    title: "Apply & Connect",
    description: "Apply to jobs with one click and connect with employers.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-background">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4" />
              <span>Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              How StepIn Works
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto">
              A streamlined process designed to match you with your ideal job quickly and efficiently.
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="mb-4">
                  <div className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg mb-6 mx-auto z-10 relative shadow-lg animate-pulse-slow">
                    {step.step}
                  </div>
                </div>

                <div className="w-full bg-card rounded-lg p-5 shadow-sm border border-muted flex-1 flex flex-col items-center text-center">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}