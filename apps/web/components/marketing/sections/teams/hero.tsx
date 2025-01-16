"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { 
  Users, Share2, GitBranch, MessageSquare, Command, 
  Sparkles, ArrowRight, Code2, Workflow, Activity,
  Laptop, Smartphone, Tablet, FileCode, Figma, FileText,
  Brain, History, Lock
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function TeamsHero() {
  const [activeFeature, setActiveFeature] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      id: "collab",
      title: "Real-time Collaboration",
      description: "Work together seamlessly with your team in real-time",
      icon: Users,
      preview: {
        title: "Live Collaboration",
        content: "Multiple team members working together in perfect sync",
        devices: [Laptop, Smartphone, Tablet]
      },
      color: "#30D158"
    },
    {
      id: "context",
      title: "Smart Context",
      description: "Share and manage development contexts across your team",
      icon: Brain,
      preview: {
        title: "Context Management",
        content: "Branching and merging development contexts intelligently",
        devices: [Laptop]
      },
      color: "#0A84FF"
    },
    {
      id: "chat",
      title: "Team Communication",
      description: "Built-in chat and discussions tied to your codebase",
      icon: MessageSquare,
      preview: {
        title: "Contextual Chat",
        content: "Discuss code, design, and docs in context",
        devices: [Laptop, Smartphone]
      },
      color: "#FF375F"
    }
  ]

  const ActiveIcon = features[activeFeature].icon

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/80" />
      <div className={cn(
        "absolute inset-0 bg-grid-white/[0.02]",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      )} />
      
      {/* Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div 
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 mb-6",
              "rounded-full bg-primary/10 border border-primary/20"
            )}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Team Collaboration</span>
          </motion.div>

          <motion.h1 
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6",
              "bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Build Together,{' '}
            <br className="hidden sm:block" />
            <span className="text-primary">In Perfect Sync</span>
          </motion.h1>

          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Experience the future of collaborative development with real-time presence,
            shared contexts, and seamless team communication.
          </motion.p>
        </motion.div>

        {/* Main Feature Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feature Selection */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.id}
                className={cn(
                  "group/feature relative",
                  "transform transition-all duration-500"
                )}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
              >
                <div 
                  className={cn(
                    "relative z-10 flex items-start gap-4 p-4 rounded-xl cursor-pointer",
                    "transition-all duration-500 ease-out",
                    "hover:bg-white/[0.02]",
                    "border border-transparent",
                    "hover:border-white/10",
                    "bg-background/20 backdrop-blur-sm",
                    activeFeature === i && "border-primary/20 bg-white/[0.02]"
                  )}
                  onClick={() => setActiveFeature(i)}
                >
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-primary/10",
                    "border border-primary/20",
                    "transform transition-all duration-500",
                    "group-hover/feature:rotate-[-8deg] group-hover/feature:scale-110",
                    "relative"
                  )}>
                    <feature.icon className="w-5 h-5 text-primary" />
                    <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover/feature:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="transform transition-all duration-500 group-hover/feature:translate-x-1">
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                  
                  {/* Graph Paper Background */}
                  <div className={cn(
                    "absolute inset-0 bg-grid-white/[0.02] opacity-0",
                    "transition-all duration-500 ease-out",
                    "group-hover/feature:opacity-100",
                    "[mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]"
                  )} />
                </div>
                
                {/* Feature Highlight Gradient */}
                <div className={cn(
                  "absolute inset-0 -z-10 rounded-xl",
                  "opacity-0 group-hover/feature:opacity-100",
                  "transition-opacity duration-500",
                  "blur-xl scale-[0.95]"
                )}
                style={{
                  background: `linear-gradient(to right, ${feature.color}20, ${feature.color}10)`
                }}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Preview Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className={cn(
              "relative aspect-square lg:aspect-auto lg:h-[500px]",
              "rounded-2xl overflow-hidden",
              "bg-background/50 backdrop-blur-xl",
              "border border-border/50",
              "p-8",
              "group"
            )}>
              {/* Preview Content */}
              <motion.div
                className="relative h-full flex flex-col"
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="space-y-2">
                    <h3 className="text-xl font-medium">{features[activeFeature].preview.title}</h3>
                    <p className="text-sm text-muted-foreground">{features[activeFeature].preview.content}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {features[activeFeature].preview.devices.map((Device, i) => (
                      <Device key={i} className="w-4 h-4 text-muted-foreground" />
                    ))}
                  </div>
                </div>

                {/* Interactive Preview Area */}
                <div className="flex-1 rounded-xl border border-border/50 bg-background/50 p-4">
                  <div className="h-full flex items-center justify-center">
                    <ActiveIcon 
                      className="w-16 h-16" 
                      style={{ color: features[activeFeature].color + "33" }}
                    />
                  </div>
                </div>
              </motion.div>

              {/* Preview Reflection */}
              <div className={cn(
                "absolute inset-0",
                "bg-gradient-to-t from-primary/5 to-transparent",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-500"
              )} />
            </div>
          </motion.div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: GitBranch,
              title: "Context Branching",
              description: "Create and merge development contexts for different projects or experiments"
            },
            {
              icon: History,
              title: "Activity Tracking",
              description: "Monitor team progress and track changes across all contexts"
            },
            {
              icon: Lock,
              title: "Access Control",
              description: "Manage permissions and roles for secure team collaboration"
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              className={cn(
                "p-4 rounded-xl",
                "bg-background/50 backdrop-blur-xl",
                "border border-border/50",
                "group hover:border-primary/20 hover:shadow-glow-sm",
                "transition-all duration-300"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              <feature.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-base font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
        >
          <Button size="lg" className="min-w-[180px] gap-2 group">
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 