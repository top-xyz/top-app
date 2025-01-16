"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { GitBranch, Network, Share2, Eye, Workflow, Boxes } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function AdvancedPreview() {
  const contentAnimation = useIntersectionAnimation<HTMLDivElement>()
  const previewAnimation = useIntersectionAnimation<HTMLDivElement>()

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div 
            ref={contentAnimation.ref}
            className={cn(
              "space-y-8",
              "opacity-0",
              contentAnimation.isVisible && "animate-slide-up"
            )}
          >
            <div className="space-y-4">
              <h2 className={cn(
                "text-3xl sm:text-4xl font-bold",
                "bg-clip-text text-transparent",
                "bg-gradient-to-b from-foreground to-foreground/70"
              )}>
                Context-Aware Preview
              </h2>
              <p className="text-lg text-muted-foreground">
                Visualize your project's context and dependencies in real-time. 
                Understand relationships and impacts at a glance.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Network,
                  title: "Dependency Graph",
                  description: "Interactive visualization of project dependencies and their relationships"
                },
                {
                  icon: Share2,
                  title: "Context Sharing",
                  description: "Share and sync context across team members and integrations"
                },
                {
                  icon: Eye,
                  title: "Live Context Preview",
                  description: "See how changes affect your project's context in real-time"
                },
                {
                  icon: Workflow,
                  title: "Impact Analysis",
                  description: "Understand how changes impact dependent projects and systems"
                },
                {
                  icon: Boxes,
                  title: "Package Intelligence",
                  description: "Smart insights about your dependencies and their usage"
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title} 
                  className={cn(
                    "flex items-start gap-4 group",
                    "opacity-0",
                    contentAnimation.isVisible && "animate-fade-in"
                  )}
                  style={{
                    animationDelay: `${(index + 1) * 200}ms`
                  }}
                >
                  <div className={cn(
                    "p-2 rounded-lg bg-primary/10",
                    "group-hover:bg-primary/20 transition-colors duration-300"
                  )}>
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium group-hover:text-primary transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className={cn(
                "gap-2 group",
                "opacity-0",
                contentAnimation.isVisible && "animate-fade-in"
              )}
              style={{ animationDelay: '1200ms' }}
            >
              Explore Features
              <span className="text-primary group-hover:translate-x-0.5 transition-transform duration-300">
                →
              </span>
            </Button>
          </div>

          {/* Preview Window */}
          <div 
            ref={previewAnimation.ref}
            className={cn(
              "relative aspect-square rounded-lg overflow-hidden",
              "border border-border/50",
              "bg-background/50 backdrop-blur-xl",
              "opacity-0",
              previewAnimation.isVisible && "animate-scale-up"
            )}
          >
            <div className="absolute inset-0 bg-grid-white/[0.02]" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent" />
            
            {/* Dependency Graph Visualization */}
            <div className="relative h-full p-8 flex flex-col">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="relative w-full max-w-sm aspect-square">
                  {/* Central Node */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                      <GitBranch className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  {/* Orbital Nodes */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <div
                      key={angle}
                      className="absolute w-8 h-8"
                      style={{
                        top: `${50 + 35 * Math.sin(angle * Math.PI / 180)}%`,
                        left: `${50 + 35 * Math.cos(angle * Math.PI / 180)}%`,
                        transform: 'translate(-50%, -50%)',
                        animation: `orbit ${10 + i}s linear infinite`
                      }}
                    >
                      <div className={cn(
                        "w-full h-full rounded-full",
                        "bg-primary/10 flex items-center justify-center",
                        "border border-primary/20"
                      )}>
                        <div className="w-2 h-2 rounded-full bg-primary/50" />
                      </div>
                    </div>
                  ))}
                  
                  {/* Connection Lines */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--primary)_70%)] opacity-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 