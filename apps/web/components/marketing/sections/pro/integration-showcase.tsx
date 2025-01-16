"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Github, Slack, FileText, Code2, Workflow, GitBranch } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function IntegrationShowcase() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const showcaseAnimation = useIntersectionAnimation<HTMLDivElement>()

  const integrations = [
    {
      name: "GitHub",
      description: "Seamless integration with GitHub for code context, PR reviews, and issue tracking.",
      icon: Github,
      color: "#0F6BFF",
      features: [
        "Smart PR reviews",
        "Automated documentation",
        "Context-aware comments"
      ]
    },
    {
      name: "Slack",
      description: "Real-time collaboration and context sharing directly in your Slack workspace.",
      icon: Slack,
      color: "#30D158",
      features: [
        "Context sharing",
        "Team notifications",
        "Command integration"
      ]
    },
    {
      name: "Documentation",
      description: "Export and sync documentation with Notion, Obsidian, and other platforms.",
      icon: FileText,
      color: "#FFD60A",
      features: [
        "Auto-sync docs",
        "Rich formatting",
        "Version control"
      ]
    },
    {
      name: "IDEs",
      description: "Native integration with VS Code, JetBrains, and other popular IDEs.",
      icon: Code2,
      color: "#FF375F",
      features: [
        "Context panel",
        "Smart suggestions",
        "Quick actions"
      ]
    },
    {
      name: "CI/CD",
      description: "Integrate with your CI/CD pipeline for context-aware testing and deployment.",
      icon: Workflow,
      color: "#BF5AF2",
      features: [
        "Smart testing",
        "Impact analysis",
        "Deploy previews"
      ]
    },
    {
      name: "Version Control",
      description: "Support for Git workflows with intelligent branching and merging.",
      icon: GitBranch,
      color: "#5E5CE6",
      features: [
        "Branch analysis",
        "Merge insights",
        "Conflict resolution"
      ]
    }
  ]

  return (
    <section className={cn(
      "relative py-32 px-4 overflow-hidden"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
      <div className={cn(
        "absolute inset-0 bg-grid-white/[0.02]",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      )} />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div 
          ref={headerAnimation.ref}
          className={cn(
            "text-center max-w-3xl mx-auto opacity-0",
            headerAnimation.isVisible && "animate-fade-in"
          )}
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/50"
          )}>
            Seamless Integrations
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Connect with your favorite tools and platforms for a unified development experience
          </p>
        </div>

        {/* Integration Grid */}
        <div 
          ref={showcaseAnimation.ref}
          className={cn(
            "mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
            "opacity-0",
            showcaseAnimation.isVisible && "animate-fade-in"
          )}
        >
          {integrations.map((integration, i) => (
            <div
              key={integration.name}
              className={cn(
                "relative p-6 rounded-xl",
                "bg-[#1D1D20]/80 border border-[#2A2A2D]",
                "backdrop-blur-md backdrop-saturate-150",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                "transition-all duration-300",
                "hover:border-[#404043]",
                "group"
              )}
            >
              {/* Glass Morphism Background */}
              <div className={cn(
                "absolute inset-0 rounded-xl overflow-hidden",
                "bg-gradient-to-br from-white/[0.02] to-transparent",
                "backdrop-blur-md"
              )} />

              {/* Graph Paper Effect */}
              <div className={cn(
                "absolute inset-0 bg-grid-white/[0.02]",
                "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
                "rounded-xl overflow-hidden"
              )} />

              {/* Glow Effect */}
              <div 
                className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at center, ${integration.color}15 0%, transparent 70%)`
                }}
              />

              {/* Icon */}
              <div 
                className={cn(
                  "relative w-12 h-12 rounded-lg",
                  "flex items-center justify-center",
                  "bg-[#2A2A2D]/80 border border-[#404043]",
                  "backdrop-blur-sm",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                  "transition-colors duration-300",
                  "group-hover:border-opacity-100",
                  "after:absolute after:inset-0",
                  "after:rounded-lg after:opacity-0",
                  "after:transition-opacity after:duration-500",
                  "group-hover:after:opacity-100"
                )}
                style={{ 
                  borderColor: integration.color,
                  '--glow-color': integration.color 
                } as any}
              >
                <integration.icon 
                  className={cn(
                    "w-6 h-6 relative z-10",
                    "transition-transform duration-300",
                    "group-hover:scale-110"
                  )}
                  style={{ color: integration.color }}
                />
              </div>

              {/* Content */}
              <div className="relative mt-6">
                <h3 className={cn(
                  "text-lg font-semibold text-white",
                  "transition-colors duration-300",
                  "group-hover:text-[#FFFFFF]"
                )}>
                  {integration.name}
                </h3>
                <p className="mt-2 text-sm text-[#A1A1A6]">
                  {integration.description}
                </p>

                {/* Features */}
                <ul className="mt-4 space-y-2">
                  {integration.features.map((feature) => (
                    <li 
                      key={feature}
                      className={cn(
                        "flex items-center gap-2 text-xs",
                        "text-[#A1A1A6] transition-colors duration-300",
                        "group-hover:text-[#FFFFFF]"
                      )}
                    >
                      <div 
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          "transition-all duration-300",
                          "group-hover:scale-110",
                          "group-hover:shadow-[0_0_8px_rgba(var(--bullet-color),0.5)]"
                        )}
                        style={{ 
                          backgroundColor: integration.color,
                          '--bullet-color': integration.color 
                        } as any}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More */}
                <div className="relative mt-6">
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-9 rounded-lg",
                      "text-sm font-medium",
                      "bg-[#2A2A2D]/80 border-[#404043]",
                      "backdrop-blur-sm",
                      "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                      "transition-all duration-300",
                      "hover:bg-[#404043]/80",
                      "hover:border-[#505055]",
                      "group-hover:border-opacity-100",
                      "after:absolute after:inset-0",
                      "after:rounded-lg after:opacity-0",
                      "after:transition-opacity after:duration-500",
                      "group-hover:after:opacity-100"
                    )}
                    style={{ 
                      '--glow-color': integration.color 
                    } as any}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 