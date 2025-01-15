"use client"

import { Layers, Workflow } from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'

const features = [
  {
    icon: Layers,
    title: "Smart Context Management",
    description: "Your entire codebase, understood and managed through natural conversation. AI builds and maintains a living knowledge graph of your project.",
    features: [
      "Semantic understanding of your entire project",
      "Automatic documentation and knowledge graphs",
      "Intelligent suggestions and insights"
    ]
  },
  {
    icon: Workflow,
    title: "Context Generation",
    description: "Transform ideas into fully-realized projects in minutes. AI understands your vision and generates everything needed to bring it to life.",
    features: [
      "Complete project scaffolding from conversation",
      "Intelligent architecture decisions",
      "Instant preview deployments"
    ]
  }
]

export function ContextManagementSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden scroll-fade">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 pointer-events-none opacity-0 animate-fade-in" />
      <div className="max-w-6xl mx-auto relative">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold text-center mb-6",
          "bg-clip-text text-transparent",
          "bg-gradient-to-b from-foreground to-foreground/70",
          "animate-fade-in-up"
        )}>
          Context is the new code
        </h2>
        
        <p className={cn(
          "text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-16",
          "animate-fade-in-up [animation-delay:200ms]"
        )}>
          Transform how you think about software creation. Context becomes your codebase, 
          conversations become your commits, and every thought shapes your digital universe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((item, i) => (
            <div
              key={item.title}
              className={cn(
                "p-8 rounded-xl",
                "bg-background/50 backdrop-blur-xl",
                "border border-border/50",
                "shadow-glow-subtle group hover:shadow-glow-primary transition-all duration-300",
                "transform hover:scale-[1.02] transition-transform duration-300",
                "animate-fade-in-up",
                `[animation-delay:${(i + 2) * 200}ms]`
              )}
            >
              <div className={cn(
                "flex items-center gap-4 mb-6",
                "transform group-hover:translate-x-1 transition-transform duration-300"
              )}>
                <div className={cn(
                  "p-3 rounded-lg bg-primary/10 text-primary",
                  "transform hover:rotate-[-10deg] transition-transform duration-300"
                )}>
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  {item.description}
                </p>
                <ul className="space-y-2">
                  {item.features.map((feature, j) => (
                    <li 
                      key={j}
                      className={cn(
                        "flex items-center gap-2 text-sm text-muted-foreground",
                        "opacity-0 animate-fade-in",
                        `[animation-delay:${(i * 3 + j) * 100 + 600}ms]`
                      )}
                    >
                      <div className={cn(
                        "w-1 h-1 rounded-full bg-primary",
                        "transform hover:scale-150 transition-transform duration-300"
                      )} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 