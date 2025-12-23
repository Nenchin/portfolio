"use client";

import { motion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Figma, Code2 } from 'lucide-react';

export function ProjectsHeader() {
  return (
    <div className="text-center mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Badge variant="outline" className="mb-6 bg-primary/5 text-primary border-primary/20">
          <Code2 className="mr-1 h-3 w-3" />
          Design Projects
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl mb-6">
          My{' '}
          <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Design Work
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Each project showcases how I blend graphic design, product design, and UI/UX to solve real problems, elevate brands, and create experiences that feel intuitive, purposeful, and memorable.
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex items-center justify-center gap-4 mt-8"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Figma className="h-4 w-4" />
          <span>Fetched from Figma</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>Updated in real-time</span>
        </div>
      </motion.div>
    </div>
  );
}
