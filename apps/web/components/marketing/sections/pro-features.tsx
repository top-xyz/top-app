"use client"

import { Users, GitBranch, Wand2, ArrowRight } from 'lucide-react'
import { buttonVariants } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import Link from 'next/link'

const features = [
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share contexts, collaborate in real-time, and build together seamlessly."
  },
  {
    icon: GitBranch,
    title: "Advanced Context",
    description: "Multiple context branches, merge capabilities, and version control integration."
  },
  {
    icon: Wand2,
    title: "Custom Workflows",
    description: "Create and share your own AI-powered workflows and automations."
  }
]

export function ProFeaturesSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden scroll-fade">
      <div className="max-w-6xl mx-auto relative">
        <div className={cn(
          "p-8 rounded-xl",
          "bg-background/50 backdrop-blur-xl",
          "border border-border/50",
          "shadow-glow-subtle hover:shadow-glow-primary transition-all duration-300",
          "transform hover:scale-[1.02] transition-transform duration-300"
        )}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className={cn(
                "text-3xl md:text-4xl font-bold",
                "bg-clip-text text-transparent",
                "bg-gradient-to-b from-foreground to-foreground/70",
                "animate-fade-in-up"
              )}>
                Unlock the full power of context
              </h2>
              
              <p className={cn(
                "text-lg text-muted-foreground",
                "animate-fade-in-up [animation-delay:200ms]"
              )}>
                Take your creative flow to the next level with advanced features designed for teams and power users.
              </p>

              <div className="space-y-4">
                {features.map((feature, i) => (
                  <div 
                    key={feature.title}
                    className={cn(
                      "flex items-center gap-4",
                      "animate-fade-in-up",
                      `[animation-delay:${(i + 2) * 200}ms]`
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg bg-primary/10 text-primary",
                      "transform hover:rotate-[-10deg] hover:scale-110 transition-transform duration-300"
                    )}>
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={cn(
                "pt-4",
                "animate-fade-in-up [animation-delay:800ms]"
              )}>
                <Link
                  href="/pricing"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group relative overflow-hidden"
                  )}
                >
                  <span className={cn(
                    "relative z-10 flex items-center gap-2",
                    "transform group-hover:translate-x-1 transition-transform duration-300"
                  )}>
                    Upgrade to Pro
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-primary/50 to-primary",
                    "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    "transform group-hover:scale-110 group-hover:rotate-2 transition-transform duration-500"
                  )} />
                </Link>
              </div>
            </div>

            <div className="relative aspect-square animate-fade-in-scale [animation-delay:400ms]">
              <div className={cn(
                "absolute inset-0 bg-gradient-to-tr from-primary/20 to-primary/5 rounded-full blur-3xl",
                "animate-float"
              )} />
              <div className={cn(
                "absolute inset-0 bg-gradient-to-bl from-foreground/10 to-foreground/5 rounded-full blur-2xl",
                "animate-float [animation-delay:1s]"
              )} />
              <div className={cn(
                "relative w-full h-full rounded-xl overflow-hidden border border-border/50",
                "transform hover:scale-105 transition-transform duration-300"
              )}>
                {/* Placeholder for Pro features preview/demo */}
                <div className="absolute inset-0 bg-gradient-to-tr from-background to-background/80 backdrop-blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 