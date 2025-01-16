"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Users, UserPlus, Settings, Shield, Building2, Layers } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function TeamManagement() {
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
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div 
          ref={headerAnimation.ref}
          className={cn(
            "text-center max-w-2xl mx-auto opacity-0",
            headerAnimation.isVisible && "animate-fade-in"
          )}
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/50"
          )}>
            Powerful team management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Organize your team, manage permissions, and scale with confidence using our
            comprehensive team management features.
          </p>
        </div>

        {/* Features Grid */}
        <div 
          ref={featuresAnimation.ref}
          className={cn(
            "mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8",
            "opacity-0",
            featuresAnimation.isVisible && "animate-slide-up"
          )}
        >
          {[
            {
              icon: Users,
              title: "Team Organization",
              description: "Create and manage teams with flexible hierarchies",
              features: [
                "Team hierarchies",
                "Department organization",
                "Custom team roles"
              ]
            },
            {
              icon: UserPlus,
              title: "Member Management",
              description: "Easily add, remove, and manage team members",
              features: [
                "Invite system",
                "Role assignment",
                "Access management"
              ]
            },
            {
              icon: Settings,
              title: "Team Settings",
              description: "Configure team preferences and defaults",
              features: [
                "Team preferences",
                "Default settings",
                "Notification rules"
              ]
            },
            {
              icon: Shield,
              title: "Access Control",
              description: "Fine-grained control over team permissions",
              features: [
                "Role-based access",
                "Custom permissions",
                "Security policies"
              ]
            },
            {
              icon: Building2,
              title: "Organization Tools",
              description: "Tools for managing large organizations",
              features: [
                "Org structure",
                "Resource allocation",
                "Team analytics"
              ]
            },
            {
              icon: Layers,
              title: "Context Management",
              description: "Manage and organize team knowledge",
              features: [
                "Knowledge bases",
                "Context sharing",
                "Version control"
              ]
            }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className={cn(
                "p-6 rounded-lg",
                "bg-background/50 backdrop-blur-sm",
                "border border-border/50",
                "transform hover:scale-105 transition-all duration-300",
                "opacity-0"
              )}
              style={{
                animation: featuresAnimation.isVisible ? 
                  `fade-in 0.5s ease-out forwards ${index * 100}ms` : 'none'
              }}
            >
              <feature.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <ul className="space-y-2">
                {feature.features.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className={cn(
              "min-w-[200px] opacity-0",
              featuresAnimation.isVisible && "animate-fade-in"
            )}
            style={{
              animationDelay: '800ms'
            }}
          >
            Start Managing Teams
          </Button>
        </div>
      </div>
    </section>
  )
} 