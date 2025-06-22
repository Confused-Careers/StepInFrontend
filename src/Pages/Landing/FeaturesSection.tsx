import { Sparkles, Users, Shield, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Sparkles className="h-10 w-10" />,
    title: "Proprietary AI Matching",
    description: "StepIn's algorithm uses behavior + experience data to predict job fit with unmatched accuracy"
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Behavioral Insights",
    description: "Go beyond resumes — see why each role fits your strengths, style, and preferences"
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Private by Default",
    description: "You stay in control. Employers only see your profile after you apply"
  }
];

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem = ({ icon, title, description }: FeatureItemProps) => (
  <div className="flex flex-col items-center justify-center text-center hover:bg-primary/10 transition-colors rounded-lg p-4 min-w-[200px] max-w-[300px]">
    <div className="text-primary mb-3 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-sm font-semibold mb-2">{title}</h3>
    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const ResponsiveFeatureStrip = () => {
  return (
    <section className="bg-background py-16" id="features">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="text-center max-w-[800px] mx-auto mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                <Zap className="h-3.5 w-3.5" />
                <span>Powerful Features</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Why StepIn Feels Smarter
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Our AI-powered platform offers unique features designed to match you with your ideal job.
              </p>
            </motion.div>
          </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
          {features.map((feature, index) => (
            <FeatureItem key={index} icon={feature.icon} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResponsiveFeatureStrip;