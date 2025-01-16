"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Brain, Share2, Sparkles, Users } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function ContextSharing() {
  const contentAnimation = useIntersectionAnimation()
  const previewAnimation = useIntersectionAnimation()

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div 
            ref={contentAnimation.ref as any}
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
                Share context effortlessly
              </h2>
              <p className="text-lg text-muted-foreground">
                Keep your team aligned with powerful context sharing and management features.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: Brain,
                  title: "Smart Context Management",
                  description: "AI-powered system that understands and organizes your team's knowledge"
                },
                {
                  icon: Share2,
                  title: "Real-time Sharing",
                  description: "Instantly share context across your team with live updates"
                },
                {
                  icon: Sparkles,
                  title: "Intelligent Suggestions",
                  description: "Get smart recommendations based on team activity and context"
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title} 
                  className={cn(
                    "flex items-start gap-4",
                    "opacity-0",
                    contentAnimation.isVisible && "animate-fade-in"
                  )}
                  style={{
                    animationDelay: `${(index + 1) * 200}ms`
                  }}
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button 
              variant="outline" 
              className={cn(
                "gap-2",
                "opacity-0",
                contentAnimation.isVisible && "animate-fade-in"
              )}
              style={{ animationDelay: '800ms' }}
            >
              Learn More
              <span className="text-primary">→</span>
            </Button>
          </div>

          {/* Preview Window */}
          <div 
            ref={previewAnimation.ref as any}
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
            
            {/* Context Sharing Preview */}
            <div className="relative h-full p-8 flex flex-col">
              <div className="flex gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                    <Share2 className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">Context Sharing Preview</p>
                </div>
              </div>

              {/* Animated Sharing Indicators */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex justify-between items-center">
                  {[...Array(3)].map((_, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center",
                        "animate-pulse"
                      )}
                      style={{
                        animationDelay: `${i * 200}ms`
                      }}
                    >
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 