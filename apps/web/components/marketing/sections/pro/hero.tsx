"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Brain, Sparkles, Workflow, GitBranch, Layers, Code2, Palette, LucideIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

interface Feature {
  title: string
  description: string
  icon: LucideIcon
  color: string
  preview: string
}

export function ProHero() {
  const [activeFeature, setActiveFeature] = useState(0)
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const contentAnimation = useIntersectionAnimation<HTMLDivElement>()
  const ctaAnimation = useIntersectionAnimation<HTMLDivElement>()

  const features: Feature[] = [
    {
      title: "Smart Context",
      description: "AI understands your entire codebase",
      icon: Brain,
      color: "#FF2D55",
      preview: "Semantic code analysis & intelligent suggestions"
    },
    {
      title: "Pro Workflows",
      description: "Automate complex development tasks",
      icon: Workflow,
      color: "#30D158",
      preview: "Custom automation & advanced pipelines"
    },
    {
      title: "Multi-Repo",
      description: "Work across multiple repositories",
      icon: GitBranch,
      color: "#0A84FF",
      preview: "Seamless context switching & dependencies"
    },
    {
      title: "Pro Themes",
      description: "Create custom development environments",
      icon: Palette,
      color: "#BF5AF2",
      preview: "Personalized themes & UI customization"
    }
  ]

  // Auto-rotate features every 4s
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const ActiveIcon = features[activeFeature].icon

  return (
    <section className={cn(
      "relative min-h-screen flex flex-col items-center justify-center",
      "px-4 py-32 overflow-hidden"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
      <div className={cn(
        "absolute inset-0 bg-grid-white/[0.02]",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      )} />
      
      {/* Floating Badge */}
      <div 
        ref={headerAnimation.ref}
        className={cn(
          "relative z-10 mb-8 opacity-0",
          headerAnimation.isVisible && "animate-scale-up"
        )}
      >
        <div className={cn(
          "px-4 py-2 rounded-full",
          "bg-[#1D1D20]/80 border border-[#2A2A2D]",
          "backdrop-blur-md backdrop-saturate-150",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
          "flex items-center gap-2",
          "animate-shimmer",
          "bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
        )}>
          <Sparkles className="w-4 h-4 text-[#FFD60A] animate-pulse" />
          <span className="text-sm font-medium text-[#A1A1A6]">
            Pro Experience
          </span>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentAnimation.ref}
        className={cn(
          "relative z-10 max-w-5xl mx-auto text-center opacity-0",
          contentAnimation.isVisible && "animate-slide-up"
        )}
      >
        <h1 className={cn(
          "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
          "font-bold bg-clip-text text-transparent",
          "bg-gradient-to-b from-foreground to-foreground/50"
        )}>
          Unlock the full power
          <br />
          of development
        </h1>

        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Advanced features, custom workflows, and seamless collaboration
        </p>

        {/* Feature Orbit */}
        <div className="mt-16 relative w-full max-w-4xl mx-auto aspect-square">
          {/* Central Preview */}
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
            "w-96 h-96 rounded-3xl",
            "bg-[#1D1D20]/80 border border-[#2A2A2D]",
            "backdrop-blur-md backdrop-saturate-150",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
            "flex flex-col items-center justify-center gap-4 p-8",
            "transition-all duration-500"
          )}
          style={{
            borderColor: features[activeFeature].color,
            boxShadow: `0 0 40px ${features[activeFeature].color}10`
          }}
          >
            <ActiveIcon 
              className="w-16 h-16"
              style={{ color: features[activeFeature].color }}
            />
            <h2 className="text-2xl font-bold">{features[activeFeature].title}</h2>
            <p className="text-muted-foreground text-center">
              {features[activeFeature].description}
            </p>
            <div className={cn(
              "mt-4 px-6 py-4 rounded-xl w-full",
              "bg-background/50 border border-[#2A2A2D]",
              "font-mono text-sm text-[#A1A1A6]"
            )}>
              {features[activeFeature].preview}
            </div>
          </div>

          {/* Orbital Features */}
          {features.map((feature, i) => {
            const isActive = i === activeFeature
            const angle = (i * 360 / features.length + 45) * (Math.PI / 180)
            const radius = 280
            const x = Math.cos(angle) * radius
            const y = Math.sin(angle) * radius
            const FeatureIcon = feature.icon

            return (
              <button
                key={feature.title}
                className={cn(
                  "absolute w-24 h-24 rounded-2xl",
                  "bg-[#1D1D20]/80 border border-[#2A2A2D]",
                  "backdrop-blur-md backdrop-saturate-150",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                  "flex flex-col items-center justify-center gap-2",
                  "transition-all duration-500 hover:scale-110",
                  isActive && "border-2 scale-110"
                )}
                style={{
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: isActive ? feature.color : undefined,
                  boxShadow: isActive ? `0 0 20px ${feature.color}20` : undefined
                }}
                onClick={() => setActiveFeature(i)}
              >
                <FeatureIcon 
                  className="w-8 h-8"
                  style={{ color: feature.color }}
                />
                <span className="text-xs font-medium text-center px-2">
                  {feature.title}
                </span>
              </button>
            )
          })}

          {/* Connection Lines */}
          {features.map((feature, i) => {
            const isActive = i === activeFeature
            const angle = (i * 360 / features.length + 45) * (Math.PI / 180)
            const radius = 280
            
            return (
              <div
                key={`line-${i}`}
                className={cn(
                  "absolute top-1/2 left-1/2 w-px",
                  "bg-gradient-to-b from-[#2A2A2D] to-transparent",
                  "transition-all duration-500",
                  isActive && "from-[#404043]"
                )}
                style={{
                  height: `${radius}px`,
                  transform: `rotate(${angle}rad)`,
                  transformOrigin: 'top',
                  opacity: isActive ? 0.8 : 0.3
                }}
              />
            )
          })}
        </div>
      </div>

      {/* CTA Buttons */}
      <div 
        ref={ctaAnimation.ref}
        className={cn(
          "relative z-10 mt-12 flex flex-wrap items-center justify-center gap-4"
        )}
      >
        <Button 
          size="lg" 
          className={cn(
            "min-w-[200px] rounded-xl opacity-0",
            "bg-white hover:bg-white/90 text-black",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
            "transition-all duration-300",
            "hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
            ctaAnimation.isVisible && "animate-scale-up"
          )}
        >
          Upgrade to Pro
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className={cn(
            "min-w-[200px] rounded-xl opacity-0",
            "bg-[#1D1D20]/80 border-[#2A2A2D]",
            "backdrop-blur-md backdrop-saturate-150",
            "text-foreground font-medium",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
            "transition-all duration-300",
            "hover:bg-[#2A2A2D]/80 hover:border-[#404043]",
            ctaAnimation.isVisible && "animate-scale-up"
          )}
          style={{
            animationDelay: '100ms'
          }}
        >
          Compare Plans
        </Button>
      </div>

      {/* Version Info */}
      <div className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2",
        "flex items-center gap-4 text-xs text-[#A1A1A6]",
        "opacity-0 animate-fade-in"
      )}
      style={{
        animationDelay: '800ms'
      }}
      >
        <span>v0.1.0</span>
        <span>•</span>
        <span>Early Access</span>
        <span>•</span>
        <span>Context-First</span>
      </div>
    </section>
  )
} 