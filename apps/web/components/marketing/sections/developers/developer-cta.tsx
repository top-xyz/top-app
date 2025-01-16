"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Code2, Github, Book } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function DeveloperCTA() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const cardsAnimation = useIntersectionAnimation<HTMLDivElement>()

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
            "text-3xl sm:text-4xl md:text-5xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/50"
          )}>
            Start Building Today
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Join our developer community and create amazing experiences with our platform.
          </p>
        </div>

        {/* Resource Cards */}
        <div 
          ref={cardsAnimation.ref}
          className={cn(
            "mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0",
            cardsAnimation.isVisible && "animate-slide-up"
          )}
        >
          {/* Documentation */}
          <div 
            className={cn(
              "p-6 rounded-lg border border-border/50",
              "bg-background/50 backdrop-blur-sm",
              "opacity-0"
            )}
            style={{
              animation: cardsAnimation.isVisible ? 
                'fade-in 0.5s ease-out forwards' : 'none'
            }}
          >
            <Book className="w-12 h-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Documentation</h3>
            <p className="mt-2 text-muted-foreground">
              Comprehensive guides and API references to help you get started.
            </p>
            <Button className="mt-6" variant="outline">
              View Docs
            </Button>
          </div>

          {/* GitHub */}
          <div 
            className={cn(
              "p-6 rounded-lg border border-border/50",
              "bg-background/50 backdrop-blur-sm",
              "opacity-0"
            )}
            style={{
              animation: cardsAnimation.isVisible ? 
                'fade-in 0.5s ease-out forwards 100ms' : 'none'
            }}
          >
            <Github className="w-12 h-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">GitHub</h3>
            <p className="mt-2 text-muted-foreground">
              Explore our open source projects and contribute to the community.
            </p>
            <Button className="mt-6" variant="outline">
              View GitHub
            </Button>
          </div>

          {/* Examples */}
          <div 
            className={cn(
              "p-6 rounded-lg border border-border/50",
              "bg-background/50 backdrop-blur-sm",
              "opacity-0"
            )}
            style={{
              animation: cardsAnimation.isVisible ? 
                'fade-in 0.5s ease-out forwards 200ms' : 'none'
            }}
          >
            <Code2 className="w-12 h-12 text-primary" />
            <h3 className="mt-4 text-xl font-semibold">Examples</h3>
            <p className="mt-2 text-muted-foreground">
              Ready-to-use examples and templates to kickstart your projects.
            </p>
            <Button className="mt-6" variant="outline">
              View Examples
            </Button>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-16 text-center">
          <Button 
            size="lg"
            className={cn(
              "min-w-[200px] opacity-0",
              cardsAnimation.isVisible && "animate-fade-in"
            )}
            style={{
              animationDelay: '300ms'
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  )
} 