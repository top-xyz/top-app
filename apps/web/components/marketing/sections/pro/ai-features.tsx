"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Brain, GitBranch, Workflow } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function AIFeatures() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const cardsAnimation = useIntersectionAnimation<HTMLDivElement>()

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div 
          ref={headerAnimation.ref}
          className={cn(
            "text-center space-y-4 mb-16",
            "opacity-0",
            headerAnimation.isVisible && "animate-fade-in"
          )}
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/70"
          )}>
            Intelligent Context Management
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Seamlessly manage project context and dependencies with AI-powered understanding.
            Let our system handle the complexity while you focus on creation.
          </p>
        </div>

        <div 
          ref={cardsAnimation.ref}
          className={cn(
            "grid grid-cols-1 md:grid-cols-3 gap-8",
            "opacity-0",
            cardsAnimation.isVisible && "animate-slide-up"
          )}
        >
          {[
            {
              icon: Brain,
              title: "Smart Context",
              description: "Automatically understand and manage project context across your entire codebase.",
              features: [
                "Semantic dependency analysis",
                "Automatic context generation",
                "Cross-project understanding",
                "Intelligent code navigation"
              ]
            },
            {
              icon: GitBranch,
              title: "Dependency Intelligence",
              description: "Effortlessly manage external dependencies with AI-powered insights and automation.",
              features: [
                "Dependency version tracking",
                "Breaking change detection",
                "Update impact analysis",
                "Security vulnerability checks"
              ]
            },
            {
              icon: Workflow,
              title: "Context Workflows",
              description: "Streamline development with automated context-aware workflows and integrations.",
              features: [
                "Documentation sync",
                "Context-aware testing",
                "Integration management",
                "Automated context updates"
              ]
            }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className={cn(
                "p-6 rounded-lg",
                "bg-background/50 backdrop-blur-xl",
                "border border-border/50",
                "group hover:border-primary/50 transition-colors duration-300",
                "opacity-0",
                cardsAnimation.isVisible && "animate-scale-up",
              )}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "p-2 rounded-lg bg-primary/10",
                  "group-hover:bg-primary/20 transition-colors duration-300"
                )}>
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              
              <p className="text-muted-foreground mb-6">
                {feature.description}
              </p>

              <ul className="space-y-3">
                {feature.features.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full bg-primary/70",
                      "group-hover:bg-primary transition-colors duration-300"
                    )} />
                    <span className="group-hover:text-foreground transition-colors duration-300">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 