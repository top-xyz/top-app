"use client"

import { Brain, Code, Share } from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'

const features = [
  {
    icon: Brain,
    title: "Think it",
    description: "Your vision becomes reality through natural conversation. No technical barriers, just pure creative flow."
  },
  {
    icon: Code,
    title: "Preview it",
    description: "See your creation come alive instantly. Every conversation generates a live deployment you can interact with."
  },
  {
    icon: Share,
    title: "Share it",
    description: 'From "It\'ll take weeks" to "Here\'s a link" in minutes. Share your universe with anyone, anywhere.'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-24 px-4 scroll-fade">
      <div className="max-w-6xl mx-auto">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold text-center mb-16",
          "bg-clip-text text-transparent",
          "bg-gradient-to-b from-foreground to-foreground/70",
          "animate-fade-in-up"
        )}>
          The poetry of creation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                "p-8 rounded-xl",
                "bg-background/50 backdrop-blur-xl",
                "border border-border/50",
                "shadow-glow-subtle group hover:shadow-glow-primary transition-all duration-300",
                "transform hover:scale-[1.05] transition-transform duration-300",
                "animate-fade-in-up",
                `[animation-delay:${(i + 1) * 200}ms]`
              )}
            >
              <div className={cn(
                "flex items-center gap-4 mb-4",
                "transform group-hover:translate-x-1 transition-transform duration-300"
              )}>
                <div className={cn(
                  "p-3 rounded-lg bg-primary/10 text-primary",
                  "transform hover:rotate-[-10deg] transition-transform duration-300"
                )}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 