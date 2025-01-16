"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Puzzle, Zap, Box, Layers } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function ExtensionSystem() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const previewAnimation = useIntersectionAnimation<HTMLDivElement>()
  const featuresAnimation = useIntersectionAnimation<HTMLDivElement>()

  return (
    <section className={cn(
      "relative py-32 px-4 overflow-hidden",
      "bg-gradient-to-b from-background to-background/50"
    )}>
      {/* Background Grid */}
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
            "text-3xl sm:text-4xl md:text-5xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/50"
          )}>
            Powerful Extension System
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Build and integrate custom extensions to enhance the development experience.
          </p>
        </div>

        {/* Extension Preview */}
        <div 
          ref={previewAnimation.ref}
          className={cn(
            "mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0",
            previewAnimation.isVisible && "animate-scale-up"
          )}
        >
          {/* Extension Builder */}
          <div className={cn(
            "p-6 rounded-lg border border-border/50",
            "bg-background/50 backdrop-blur-sm"
          )}>
            <div className="w-full aspect-video rounded bg-gradient-to-br from-primary/20 to-primary/5 p-4">
              <div className="font-mono text-sm text-muted-foreground">
                <span className="text-primary">export</span> <span className="text-secondary">default</span> {"{"}
                <br />
                &nbsp;&nbsp;name: <span className="text-primary">'my-extension'</span>,
                <br />
                &nbsp;&nbsp;version: <span className="text-primary">'1.0.0'</span>,
                <br />
                &nbsp;&nbsp;hooks: {"{"} ... {"}"},
                <br />
                &nbsp;&nbsp;commands: [...]
                <br />
                {"}"}
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Extension Builder</h3>
            <p className="mt-2 text-muted-foreground">
              Create custom extensions with our powerful builder API.
            </p>
          </div>

          {/* Extension Store */}
          <div className={cn(
            "p-6 rounded-lg border border-border/50",
            "bg-background/50 backdrop-blur-sm"
          )}>
            <div className="w-full aspect-video rounded bg-gradient-to-br from-secondary/20 to-secondary/5 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-background/50">
                  <span className="font-medium">Git Tools</span>
                  <Button size="sm" variant="secondary">Install</Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background/50">
                  <span className="font-medium">Theme Builder</span>
                  <Button size="sm" variant="secondary">Install</Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background/50">
                  <span className="font-medium">Code Metrics</span>
                  <Button size="sm" variant="secondary">Install</Button>
                </div>
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Extension Store</h3>
            <p className="mt-2 text-muted-foreground">
              Discover and install extensions from our curated marketplace.
            </p>
          </div>
        </div>

        {/* Features */}
        <div 
          ref={featuresAnimation.ref}
          className={cn(
            "mt-16 grid grid-cols-1 sm:grid-cols-4 gap-8 opacity-0",
            featuresAnimation.isVisible && "animate-slide-up"
          )}
        >
          {[
            {
              icon: Puzzle,
              title: "Plugin System",
              description: "Modular architecture"
            },
            {
              icon: Zap,
              title: "Hot Reload",
              description: "Instant updates"
            },
            {
              icon: Box,
              title: "Packaging",
              description: "Easy distribution"
            },
            {
              icon: Layers,
              title: "Marketplace",
              description: "Extension store"
            }
          ].map((feature, i) => (
            <div 
              key={feature.title}
              className={cn(
                "p-6 rounded-lg border border-border/50",
                "bg-background/50 backdrop-blur-sm",
                "opacity-0"
              )}
              style={{
                animation: featuresAnimation.isVisible ? 
                  `fade-in 0.5s ease-out forwards ${i * 100}ms` : 'none'
              }}
            >
              <feature.icon className="w-8 h-8 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Documentation Link */}
        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className={cn(
              "min-w-[200px] opacity-0",
              featuresAnimation.isVisible && "animate-fade-in"
            )}
            style={{
              animationDelay: '300ms'
            }}
          >
            Start Building
          </Button>
        </div>
      </div>
    </section>
  )
} 