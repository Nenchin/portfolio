"use client";

import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import {siteConfig} from '@/config/site.config'


export function AboutContent() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="space-y-8"
    >
      <Card className="relative bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-0 overflow-hidden">

        <CardHeader className="relative z-10 flex flex-col items-center justify-center gap-4 pt-8 pb-2">
          <div className="relative w-48 h-48 overflow-hidden border-4 border-primary shadow-xl bg-background">
            <Image
              src={siteConfig.author_img}
              alt={`${siteConfig.author} profile`}
              width={192}
              height={192}
              className="object-cover w-full h-full rounded-lg"
              priority
            />
            {/* SaaS-style background effect */}
            <div className="absolute inset-0 pointer-events-none z-0">
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[340px] h-[340px] bg-gradient-radial from-primary/30 to-transparent rounded-lg blur-2xl opacity-40 dark:opacity-60" />
              <div className="absolute bottom-0 right-0 w-[180px] h-[180px] bg-gradient-to-br from-secondary/30 to-transparent rounded-lg blur-xl opacity-30 dark:opacity-50" />
            </div>
          </div>
          <div className="text-center text-3xl font-extrabold text-primary mt-4">Gloria Augustine</div>
        </CardHeader>
        <CardContent className="space-y-4 relative z-10">
          <p className="text-muted-foreground leading-relaxed">
            Hi, I&apos;m Gloria Oyale Augustine, a passionate Graphic Designer and UI/UX Designer dedicated to creating clean, modern, and meaningful visuals that make brands stand out and help people connect with digital products effortlessly.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            My journey in design started with a simple curiosity: How do visuals influence the way people feel and interact? That curiosity grew into a calling. Over the years, I&apos;ve worked with individuals, small businesses, and growing brands, helping them transform their ideas into designs that are clear, beautiful, and purpose-driven.
          </p>
          <p>
            I love blending creativity with strategy, whether I&apos;m designing brand visuals, crafting user-friendly interfaces, or refining digital experiences that feel natural and easy to use. For me, design is not just about looking good, it&apos;s about solving problems, telling stories, and bringing ideas to life.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            When I&apos;m not designing, I&apos;m exploring new design trends, learning better tools, teaching upcoming designers, or sharing ideas with the creative community.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Let&apos;s connect and create something impactful together.
          </p>
        </CardContent>
    </Card>

    </motion.div>
  );
}
