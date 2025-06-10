"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface InsightTimelineProps {
  insights: Array<{
    id: string
    text: string
    category: string
  }>
  categoryIcons: Record<string, React.ReactNode>
}

export function InsightTimeline({ insights, categoryIcons }: InsightTimelineProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Auto scroll to bottom when new insights are added
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [insights.length]);

  return (
    <Card className="overflow-hidden border-primary/10 shadow-sm hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-primary/5 dark:from-gray-900 dark:to-primary/10">
      <CardContent className="p-0">
        <ScrollArea className="h-[200px] w-full p-6">
          <div className="relative" ref={scrollRef}>
            {/* Timeline line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-primary-700/50" />

            <div className="space-y-6">
              {insights.map((insight, index) => (
                <div key={insight.id} className="relative pl-12">
                  {/* Timeline dot */}
                  <div className="absolute left-0 top-0 w-[18px] h-[18px] rounded-full bg-primary-800 border-2 border-blue-500 z-10 mt-1" />

                  {/* Category icon */}
                  <div className="absolute left-[28px] top-0 flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary-700/50 flex items-center justify-center">
                      {categoryIcons[insight.category]}
                    </div>
                  </div>

                  {/* Content */}
                  {index === insights.length - 1 ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        mass: 1,
                      }}
                    >
                      <Card className="bg-primary-700/30 border-primary-600/30">
                        <CardContent className="p-4">
                          <p className="text-primary-300">{insight.text}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ) : (
                    <Card className="bg-primary-700/30 border-primary-600/30">
                      <CardContent className="p-4">
                        <p className="text-primary-300">{insight.text}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}