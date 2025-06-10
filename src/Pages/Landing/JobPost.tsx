import React, { useState, useRef, useEffect, JSX } from "react";
import { Briefcase, MapPin, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Job {
  icon: React.ReactNode;
  title: string;
  company: string;
  location: string;
  skills: string;
}

const jobs: Job[] = [
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Senior UX Designer",
    company: "TechVision Inc.",
    location: "Remote",
    skills: "UX Design, Figma, User Research",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Product Manager",
    company: "InnovateCorp",
    location: "San Francisco, CA",
    skills: "Agile, Roadmap Planning, Stakeholder Management",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Software Engineer",
    company: "CodeWorks",
    location: "New York, NY",
    skills: "JavaScript, React, Node.js",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Data Analyst",
    company: "AnalyticsPro",
    location: "Austin, TX",
    skills: "SQL, Python, Data Visualization",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "Marketing Specialist",
    company: "BrandForward",
    location: "Chicago, IL",
    skills: "SEO, Content Marketing, Social Media",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-primary" />,
    title: "DevOps Engineer",
    company: "CloudSolutions",
    location: "Seattle, WA",
    skills: "AWS, Docker, CI/CD",
  }
];

export function JobsCarousel(): JSX.Element {
  const [startX, setStartX] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setCurrentX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [translateX, setTranslateX] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [cardWidth, setCardWidth] = useState<number>(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setContainerWidth] = useState<number>(0);
  const [visibleItems, setVisibleItems] = useState<number>(3);
  
  const gapSize = 20;

  useEffect(() => {
    const updateDimensions = (): void => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.clientWidth;
        setContainerWidth(containerWidth);

        let items = 3;
        if (window.innerWidth < 768) {
          items = 1;
        } else if (window.innerWidth < 1024) {
          items = 2;
        }
        setVisibleItems(items);

        const totalGapsWidth = gapSize * (items - 1);
        const width = (containerWidth - totalGapsWidth) / items;
        setCardWidth(width);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent): void => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent): void => {
    if (!isDragging) return;
    
    let clientX: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    
    setCurrentX(clientX);
    
    const diff = clientX - startX;
    const maxTranslate = -((jobs.length - visibleItems) * (cardWidth + gapSize));
    
    let newTranslateX = translateX + diff;
    newTranslateX = Math.max(maxTranslate, Math.min(0, newTranslateX));
    
    setTranslateX(newTranslateX);
    setStartX(clientX);
  };

  const handleDragEnd = (): void => {
    setIsDragging(false);

    const itemWidth = cardWidth + gapSize;
    const itemIndex = Math.round(Math.abs(translateX) / itemWidth);
    const maxIndex = jobs.length - visibleItems;
    const newIndex = Math.max(0, Math.min(maxIndex, itemIndex));
    
    setActiveIndex(newIndex);
    setTranslateX(-newIndex * itemWidth);
  };

  const indicators = Math.ceil(jobs.length / visibleItems);

  return (
    <section id="jobs" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Briefcase className="h-3.5 w-3.5" />
              <span>Job Opportunities</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Explore Your Next Career Move
            </h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Discover job opportunities tailored to your skills and preferences with StepIn.
              <span className="hidden md:inline"> Swipe to explore more positions.</span>
            </p>
          </motion.div>
        </div>

        <div className="relative overflow-hidden touch-pan-x">
          <div 
            ref={carouselRef}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            <motion.div 
              className="flex"
              style={{ 
                transform: `translateX(${translateX}px)`,
                transition: !isDragging ? 'transform 0.3s ease-out' : 'none',
                gap: `${gapSize}px` 
              }}
            >
              {jobs.map((job, index) => (
                <motion.div
                  key={index}
                  className="bg-gradient-to-br from-background to-primary/5 rounded-xl p-6 shadow-lg border border-primary/10 flex-shrink-0"
                  style={{ width: `${cardWidth}px`, padding: '24px' }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="mb-4 bg-gradient-to-br from-primary/20 to-primary/5 w-16 h-16 rounded-lg flex items-center justify-center shadow-inner">
                    {job.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                  <p className="text-muted-foreground">{job.company}</p>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                    <Code className="h-4 w-4" />
                    <span className="text-sm">{job.skills}</span>
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    Apply Now
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <div className="flex justify-center mt-8">
            {Array.from({ length: indicators }).map((_, index) => (
              <button
                key={index}
                className={`mx-1 h-2 w-2 rounded-full transition-all duration-300 ${
                  Math.floor(activeIndex / visibleItems) === index 
                    ? 'bg-primary w-6' 
                    : 'bg-primary/30'
                }`}
                onClick={() => {
                  const newIndex = index * visibleItems;
                  setActiveIndex(newIndex);
                  setTranslateX(-newIndex * (cardWidth + gapSize));
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export const JobsSection = JobsCarousel;

export default JobsCarousel;