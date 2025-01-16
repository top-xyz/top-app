"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Code2, Webhook, Database, Lock } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function APIReference() {
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
            Comprehensive API
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Build powerful integrations with our well-documented and flexible API.
          </p>
        </div>

        {/* API Preview */}
        <div 
          ref={previewAnimation.ref}
          className={cn(
            "mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-0",
            previewAnimation.isVisible && "animate-scale-up"
          )}
        >
          {/* REST API */}
          <div className={cn(
            "p-6 rounded-lg border border-border/50",
            "bg-background/50 backdrop-blur-sm"
          )}>
            <div className="w-full aspect-video rounded bg-gradient-to-br from-primary/20 to-primary/5 p-4">
              <div className="font-mono text-sm text-muted-foreground">
                <span className="text-primary">POST</span> /api/v1/contexts
                <br />
                {"{"}
                <br />
                &nbsp;&nbsp;"name": "my-context",
                <br />
                &nbsp;&nbsp;"type": "development",
                <br />
                &nbsp;&nbsp;"content": "..."
                <br />
                {"}"}
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">REST API</h3>
            <p className="mt-2 text-muted-foreground">
              Simple and intuitive REST API for managing contexts and actions.
            </p>
          </div>

          {/* WebSocket API */}
          <div className={cn(
            "p-6 rounded-lg border border-border/50",
            "bg-background/50 backdrop-blur-sm"
          )}>
            <div className="w-full aspect-video rounded bg-gradient-to-br from-secondary/20 to-secondary/5 p-4">
              <div className="font-mono text-sm text-muted-foreground">
                <span className="text-secondary">socket</span>.on(<span className="text-primary">'context.update'</span>, {"{"}
                <br />
                &nbsp;&nbsp;type: <span className="text-primary">'development'</span>,
                <br />
                &nbsp;&nbsp;action: <span className="text-primary">'create'</span>,
                <br />
                &nbsp;&nbsp;data: {"{ /* ... */ }"}
                <br />
                {"}"})
              </div>
            </div>
            <h3 className="mt-4 text-xl font-semibold">Real-time Events</h3>
            <p className="mt-2 text-muted-foreground">
              WebSocket API for real-time updates and collaborative features.
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
              icon: Code2,
              title: "REST API",
              description: "RESTful endpoints"
            },
            {
              icon: Webhook,
              title: "WebSockets",
              description: "Real-time events"
            },
            {
              icon: Database,
              title: "GraphQL",
              description: "Flexible queries"
            },
            {
              icon: Lock,
              title: "Security",
              description: "OAuth & API keys"
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
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  )
} 