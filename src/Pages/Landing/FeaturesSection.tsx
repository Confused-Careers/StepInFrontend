import { Sparkles, Users, Briefcase, Shield, CheckCircle, Star, Zap } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Sparkles className="h-10 w-10" />,
    title: "AI-Powered Matching"
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Behavioral Insights"
  },
  {
    icon: <Briefcase className="h-10 w-10" />,
    title: "Quick Applications"
  },
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Privacy Protection"
  },
  {
    icon: <CheckCircle className="h-10 w-10" />,
    title: "Skill Assessment"
  },
  {
    icon: <Star className="h-10 w-10" />,
    title: "Career Growth"
  }
];

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
}

const FeatureItem = ({ icon, title }: FeatureItemProps) => (
  <div className="flex flex-col items-center justify-center text-center hover:bg-primary/10 transition-colors rounded-lg p-2 min-w-[100px]">
    <div className="text-primary mb-1 flex items-center justify-center">
      {icon}
    </div>
    <span className="text-xs font-medium max-w-[120px]">{title}</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4 justify-items-center">
          {features.map((feature, index) => (
            <FeatureItem key={index} icon={feature.icon} title={feature.title} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResponsiveFeatureStrip;