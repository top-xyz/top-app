"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Share, Layers, Palette } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function CustomThemes() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const previewAnimation = useIntersectionAnimation<HTMLDivElement>()
  const featuresAnimation = useIntersectionAnimation<HTMLDivElement>()

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
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div 
          ref={headerAnimation.ref}
          className={cn(
            "text-center opacity-0",
            headerAnimation.isVisible && "animate-fade-in"
          )}
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
            "font-bold bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/50"
          )}>
            Custom Themes & Styling
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Create your perfect development environment with customizable themes,
            styles, and visual preferences.
          </p>
        </div>

        {/* Theme Preview */}
        <div 
          ref={previewAnimation.ref}
          className={cn(
            "mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0",
            previewAnimation.isVisible && "animate-slide-up"
          )}
        >
          {/* Theme Builder */}
          <div className={cn(
            "p-6 rounded-lg border border-border/50",
            "bg-background/50 backdrop-blur-sm"
          )}>
            <h3 className="text-xl font-semibold mb-4">Theme Builder</h3>
            <div className="space-y-4">
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
            </div>
          </div>

          {/* Style System */}
          <div className={cn(
            "p-6 rounded-lg border border-border/50",
            "bg-background/50 backdrop-blur-sm"
          )}>
            <h3 className="text-xl font-semibold mb-4">Style System</h3>
            <div className="space-y-4">
              <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div 
          ref={featuresAnimation.ref}
          className={cn(
            "mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0",
            featuresAnimation.isVisible && "animate-slide-up"
          )}
        >
          {[
            {
              icon: Palette,
              title: 'Theme Builder',
              description: 'Create and customize themes with an intuitive interface'
            },
            {
              icon: Layers,
              title: 'Style System',
              description: 'Comprehensive styling system with design tokens'
            },
            {
              icon: Share,
              title: 'Theme Sharing',
              description: 'Share and import themes with your team'
            }
          ].map((feature, i) => (
            <div 
              key={feature.title}
              className={cn(
                "p-6 rounded-lg border border-border/50",
                "bg-background/50 backdrop-blur-sm",
                "transform hover:scale-105 transition-all duration-300"
              )}
            >
              <feature.icon className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button size="lg" className="min-w-[200px]">
            Explore Themes
          </Button>
        </div>
      </div>
    </section>
  )
} 