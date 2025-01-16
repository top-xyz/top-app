"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Users, ArrowRight, Check } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function TeamsCTA() {
  const animation = useIntersectionAnimation()

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
      <div 
        ref={animation.ref as any}
        className={cn(
          "relative z-10 max-w-5xl mx-auto",
          "opacity-0",
          animation.isVisible && "animate-fade-in"
        )}
      >
        <div className={cn(
          "p-8 md:p-12 rounded-2xl",
          "bg-background/50 backdrop-blur-xl",
          "border border-border/50",
          "shadow-glow-subtle hover:shadow-glow-primary transition-all duration-300"
        )}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className={cn(
                  "text-3xl md:text-4xl font-bold",
                  "bg-clip-text text-transparent",
                  "bg-gradient-to-b from-foreground to-foreground/70"
                )}>
                  Ready to transform your team?
                </h2>
                <p className="text-lg text-muted-foreground">
                  Get started with Top today and see how our powerful team features
                  can help your organization work better together.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "14-day free trial",
                  "No credit card required",
                  "Cancel anytime",
                  "Full team features"
                ].map((feature, index) => (
                  <div 
                    key={feature}
                    className={cn(
                      "flex items-center gap-2",
                      "opacity-0",
                      animation.isVisible && "animate-fade-in"
                    )}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <Check className="w-5 h-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className={cn(
                "flex flex-wrap gap-4",
                "opacity-0",
                animation.isVisible && "animate-fade-in"
              )}
              style={{ animationDelay: '400ms' }}>
                <Button size="lg" className="gap-2">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" className="gap-2">
                  Schedule Demo
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right Content - Stats */}
            <div className={cn(
              "grid grid-cols-2 gap-6",
              "opacity-0",
              animation.isVisible && "animate-scale-up"
            )}
            style={{ animationDelay: '200ms' }}>
              {[
                {
                  value: "10k+",
                  label: "Active Teams",
                  trend: "+20%"
                },
                {
                  value: "99.9%",
                  label: "Uptime",
                  trend: "SLA"
                },
                {
                  value: "24/7",
                  label: "Support",
                  trend: "Global"
                },
                {
                  value: "500k+",
                  label: "Users",
                  trend: "+15%"
                }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className={cn(
                    "p-6 rounded-lg",
                    "bg-background/50 backdrop-blur-sm",
                    "border border-border/50",
                    "transform hover:scale-105 transition-all duration-300"
                  )}
                  style={{
                    animationDelay: `${index * 100 + 300}ms`
                  }}
                >
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-xs text-primary mt-1">{stat.trend}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 