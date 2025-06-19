import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "UX Designer at TechVision",
    image: "/placeholder.svg?height=80&width=80",
    quote: "StepIn matched me with my dream job in just two weeks. The behavioral insights were spot on!",
  },
  {
    name: "Sarah Miller",
    role: "Product Manager at InnovateCorp",
    image: "/placeholder.svg?height=80&width=80",
    quote:
      "The AI matching technology is incredible. Every job recommendation was relevant to my skills and interests.",
  },
  {
    name: "Michael Chen",
    role: "Software Engineer at CodeWorks",
    image: "/placeholder.svg?height=80&width=80",
    quote: "I was skeptical at first, but StepIn found me opportunities I wouldn't have discovered on my own.",
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director at BrandForward",
    image: "/placeholder.svg?height=80&width=80",
    quote: "The personalized insights about my work style helped me find a company culture that truly fits me.",
  },
  {
    name: "David Kim",
    role: "Data Scientist at AnalyticsPro",
    image: "/placeholder.svg?height=80&width=80",
    quote: "StepIn's AI understood my technical skills better than any other platform I've used before.",
  },
];

export function TestimonialsCarousel() {
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
  
  const gapSize = 24;
  
  const displayTestimonials = [...testimonials, ...testimonials, ...testimonials];
  const totalItems = testimonials.length;
  
  // Calculate the number of indicator dots based on visible items
  const indicatorCount = Math.ceil(totalItems / visibleItems);
  
  useEffect(() => {
    const updateDimensions = (): void => {
      if (carouselRef.current) {
        const containerWidth = carouselRef.current.clientWidth;
        setContainerWidth(containerWidth);

        let items = 3;
        if (window.innerWidth < 640) {
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
    const maxTranslate = -((totalItems - visibleItems) * (cardWidth + gapSize));
    
    let newTranslateX = translateX + diff;
    newTranslateX = Math.max(maxTranslate, Math.min(0, newTranslateX));
    
    setTranslateX(newTranslateX);
    setStartX(clientX);
  };

  const handleDragEnd = (): void => {
    setIsDragging(false);

    const itemWidth = cardWidth + gapSize;
    const itemIndex = Math.round(Math.abs(translateX) / itemWidth);
    const maxIndex = totalItems - visibleItems;
    const newIndex = Math.max(0, Math.min(maxIndex, itemIndex));
    
    setActiveIndex(newIndex);
    setTranslateX(-newIndex * itemWidth);
  };

  const handleNext = (): void => {
    const itemWidth = cardWidth + gapSize;
    const maxIndex = totalItems - visibleItems;
    const newIndex = Math.min(maxIndex, activeIndex + 1);
    setActiveIndex(newIndex);
    setTranslateX(-newIndex * itemWidth);
  };

  const handlePrev = (): void => {
    const itemWidth = cardWidth + gapSize;
    const newIndex = Math.max(0, activeIndex - 1);
    setActiveIndex(newIndex);
    setTranslateX(-newIndex * itemWidth);
  };

  const handleIndicatorClick = (indicatorIndex: number): void => {
    const itemWidth = cardWidth + gapSize;
    const newIndex = indicatorIndex * visibleItems;
    const maxIndex = totalItems - visibleItems;
    const clampedIndex = Math.min(newIndex, maxIndex);
    
    setActiveIndex(clampedIndex);
    setTranslateX(-clampedIndex * itemWidth);
  };

  // Calculate which indicator dot should be active
  const activeIndicatorIndex = Math.floor(activeIndex / visibleItems);

  return (
    <div className="relative px-4 sm:px-6">
      <div 
        className="overflow-hidden py-4"
        ref={carouselRef}
      >
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{ 
            transform: `translateX(${translateX}px)`,
            transition: !isDragging ? 'transform 0.3s ease-out' : 'none',
            gap: `${gapSize}px` 
          }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {displayTestimonials.slice(0, totalItems * 2).map((testimonial, index) => (
            <motion.div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${cardWidth}px` }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2 },
              }}
            >
              <Card className="h-full bg-background shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-full overflow-hidden w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 p-0.5">
                    <div className="rounded-full overflow-hidden w-full h-full">
                      <img
                        src={'/src/assets/avatar.png'}
                        alt={testimonial.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="italic">"{testimonial.quote}"</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrev}
          className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Previous</span>
        </Button>

        <div className="flex gap-1 items-center">
          {/* Generate dots based on how many groups of visible items we have */}
          {Array.from({ length: indicatorCount }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndicatorIndex ? "bg-primary w-4" : "bg-primary/30"
              }`}
              onClick={() => handleIndicatorClick(index)}
              aria-label={`Go to testimonial group ${index + 1}`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 -right-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-64 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="container">
        <div className="text-center max-w-[800px] mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Star className="h-3.5 w-3.5" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">What Real Users Say About StepIn</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Hear from professionals who found their dream jobs through StepIn.
              <span className="hidden md:inline"> Swipe to explore more testimonials.</span>
            </p>
          </motion.div>
        </div>

        <TestimonialsCarousel />
      </div>
    </section>
  );
}