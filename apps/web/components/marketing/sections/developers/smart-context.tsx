"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Brain, GitBranch, History, Sparkles } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function SmartContext() {
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
            Smart Context System
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Leverage our intelligent context system to enhance code understanding and productivity.
          </p>
        </div>

        {/* Context Preview */}
        <div 
          ref={previewAnimation.ref}
          className={cn(
            "mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0",
            previewAnimation.isVisible && "animate-scale-up"
          )}
        >
          {/* Context Analysis */}
          <div className={cn(
            "p-6 rounded-lg border border-border/50",
            "bg-background/50 backdrop-blur-sm"
          )}>
            <div className="w-full aspect-video rounded bg-gradient-to-br from-primary/20 to-primary/5 p-4">
              <div className="font-mono text-sm text-muted-foreground">
                <span className="text-primary">const</span> context = <span className="text-secondary">await</span> analyze({"{"}
                <br />
                &nbsp;&nbsp;file: <span className="text-primary">'app.tsx'</span>,
                <br />
                &nbsp;&nbsp;dependencies: <span className="text-primary">true</span>,
                <br />
                &nbsp;&nbsp;history: <span className="text-primary">true</span>
                <br />
                {"}"})
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Context Analysis</h3>
            <p className="mt-2 text-muted-foreground">
              Deep code analysis with dependency and history tracking.
            </p>
          </div>

          {/* Context Actions */}
          <div className={cn(
            "p-6 rounded-lg border border-border/50",
            "bg-background/50 backdrop-blur-sm"
          )}>
            <div className="w-full aspect-video rounded bg-gradient-to-br from-secondary/20 to-secondary/5 p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-background/50">
                  <span className="font-medium">Generate Tests</span>
                  <Button size="sm" variant="secondary">Run</Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background/50">
                  <span className="font-medium">Refactor Code</span>
                  <Button size="sm" variant="secondary">Run</Button>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-background/50">
                  <span className="font-medium">Add Documentation</span>
                  <Button size="sm" variant="secondary">Run</Button>
                </div>
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Context Actions</h3>
            <p className="mt-2 text-muted-foreground">
              Intelligent actions based on code context and analysis.
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
              icon: Brain,
              title: "Smart Analysis",
              description: "Deep code insights"
            },
            {
              icon: GitBranch,
              title: "Dependencies",
              description: "Track relationships"
            },
            {
              icon: History,
              title: "History",
              description: "Code evolution"
            },
            {
              icon: Sparkles,
              title: "AI Actions",
              description: "Smart suggestions"
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
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
} 