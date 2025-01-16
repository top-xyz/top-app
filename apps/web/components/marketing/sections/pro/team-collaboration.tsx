"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Users, Share2, GitBranch } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function TeamCollaboration() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const visualAnimation = useIntersectionAnimation<HTMLDivElement>()
  const featuresAnimation = useIntersectionAnimation<HTMLDivElement>()

  return (
    <section className={cn(
      "relative min-h-screen flex flex-col items-center justify-center",
      "px-4 py-32 overflow-hidden"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
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
            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
            "font-bold bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/50"
          )}>
            Team Collaboration
          </h2>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
            Work seamlessly with your team using powerful collaboration features
            designed for modern development workflows.
          </p>
        </div>

        {/* Collaboration Visualization */}
        <div 
          ref={visualAnimation.ref}
          className={cn(
            "mt-20 relative h-[300px] opacity-0",
            visualAnimation.isVisible && "animate-fade-in"
          )}
        >
          {/* Central Node */}
          <div className={cn(
            "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
            "w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm",
            "flex items-center justify-center border border-primary/50"
          )}>
            <Users className="w-12 h-12 text-primary" />
          </div>

          {/* Satellite Nodes */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <div
              key={angle}
              className={cn(
                "absolute w-16 h-16 rounded-full",
                "bg-background/50 backdrop-blur-sm",
                "flex items-center justify-center",
                "border border-border/50",
                "transition-all duration-500"
              )}
              style={{
                top: `${50 + Math.sin(angle * Math.PI / 180) * 35}%`,
                left: `${50 + Math.cos(angle * Math.PI / 180) * 35}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 100}ms`
              }}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20" />
            </div>
          ))}
        </div>

        {/* Features */}
        <div 
          ref={featuresAnimation.ref}
          className={cn(
            "mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0",
            featuresAnimation.isVisible && "animate-slide-up"
          )}
        >
          {[
            {
              icon: Users,
              title: 'Real-time Collaboration',
              description: 'Work together in real-time with live updates and presence'
            },
            {
              icon: Share2,
              title: 'Context Sharing',
              description: 'Share development context and insights with your team'
            },
            {
              icon: GitBranch,
              title: 'Version Control',
              description: 'Integrated version control for collaborative development'
            }
          ].map((feature, i) => (
            <div 
              key={feature.title}
              className={cn(
                "p-6 rounded-lg border border-border/50",
                "bg-background/50 backdrop-blur-sm",
                "transform hover:scale-105 transition-all duration-300"
              )}
            >
              <feature.icon className="w-8 h-8 mb-4 text-primary" />
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button size="lg" className="min-w-[200px]">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
} 