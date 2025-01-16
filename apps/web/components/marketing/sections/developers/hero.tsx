"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Terminal, GitBranch } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function DevelopersHero() {
  const [text, setText] = useState("powerful")
  const [showCursor, setShowCursor] = useState(true)
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const contentAnimation = useIntersectionAnimation<HTMLDivElement>()
  const ctaAnimation = useIntersectionAnimation<HTMLDivElement>()

  // Standardize timing to 500ms to match our animation system
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  // Keep word rotation at 2s to match shimmer/pulse duration
  useEffect(() => {
    const words = ["powerful", "flexible", "extensible", "seamless"]
    let index = 0
    const interval = setInterval(() => {
      index = (index + 1) % words.length
      setText(words[index])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

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
      
      {/* Floating Badge */}
      <div 
        ref={headerAnimation.ref}
        className={cn(
          "relative z-10 mb-8 opacity-0",
          headerAnimation.isVisible && "animate-scale-up"
        )}
      >
        <div className={cn(
          "px-4 py-2 rounded-full",
          "bg-[#1D1D20]/80 border border-[#2A2A2D]",
          "backdrop-blur-md backdrop-saturate-150",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
          "flex items-center gap-2",
          "animate-shimmer",
          "bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
        )}>
          <Terminal className="w-4 h-4 text-[#30D158] animate-pulse" />
          <span className="text-sm font-medium text-[#A1A1A6]">
            Developer Tools & APIs
          </span>
        </div>
      </div>

      {/* Content */}
      <div 
        ref={contentAnimation.ref}
        className={cn(
          "relative z-10 max-w-5xl mx-auto text-center opacity-0",
          contentAnimation.isVisible && "animate-slide-up"
        )}
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-2 h-2 rounded-full bg-[#28C840] animate-pulse" />
          <span className="text-sm font-mono text-[#A1A1A6]">Build anything, anywhere.</span>
        </div>

        <h1 className={cn(
          "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-mono",
          "tracking-tight leading-none"
        )}>
          APIs are {text}
          <span 
            className={cn(
              "ml-2 opacity-0 transition-opacity duration-100",
              showCursor && "opacity-100"
            )}
          >
            _
          </span>
        </h1>

        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          Context-aware coding with intelligent suggestions
        </p>

        {/* Command Examples */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {[
            "top init my-app",
            "top dev",
            "top generate types",
            "top deploy"
          ].map((cmd, i) => (
            <button
              key={cmd}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-mono opacity-0",
                "bg-[#1D1D20]/80 border border-[#2A2A2D]",
                "backdrop-blur-md backdrop-saturate-150",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                "transition-all duration-300",
                "hover:bg-[#2A2A2D]/80 hover:border-[#404043]",
                "hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]",
                contentAnimation.isVisible && "animate-scale-up"
              )}
              style={{
                animationDelay: `${i * 100}ms`
              }}
            >
              $ {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Preview */}
        <div className={cn(
          "mt-12 w-full max-w-3xl mx-auto rounded-lg overflow-hidden opacity-0",
          "bg-[#1D1D20]/80 border border-[#2A2A2D]",
          "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
          "backdrop-blur-md backdrop-saturate-150",
          contentAnimation.isVisible && "animate-slide-up"
        )}
        style={{
          animationDelay: '400ms'
        }}
        >
          <div className="px-4 py-3 border-b border-[#2A2A2D] flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="ml-4 text-xs text-muted-foreground font-mono">
              ~/my-app
            </div>
          </div>
          <div className="p-6 font-mono text-sm text-[#A1A1A6]">
            <div className="flex items-start gap-3">
              <GitBranch className="w-5 h-5 mt-1 text-[#30D158]" />
              <div>
                $ top init my-app
                <div className="mt-2">
                  <span className="text-[#30D158]">✓</span> Created project structure
                  <br />
                  <span className="text-[#30D158]">✓</span> Initialized Git repository
                  <br />
                  <span className="text-[#30D158]">✓</span> Added TypeScript config
                  <br />
                  <span className="text-[#30D158]">✓</span> Installed dependencies
                  <br />
                  <div className="mt-2 text-white">
                    Ready! Run 'cd my-app && top dev' to start coding
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div 
        ref={ctaAnimation.ref}
        className={cn(
          "relative z-10 mt-12 flex flex-wrap items-center justify-center gap-4"
        )}
      >
        <Button 
          size="lg" 
          className={cn(
            "min-w-[200px] rounded-xl opacity-0",
            "bg-white hover:bg-white/90 text-black",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
            "transition-all duration-300",
            "hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]",
            ctaAnimation.isVisible && "animate-scale-up"
          )}
        >
          Get Started
        </Button>
        <Button 
          size="lg" 
          variant="outline" 
          className={cn(
            "min-w-[200px] rounded-xl opacity-0",
            "bg-[#1D1D20]/80 border-[#2A2A2D]",
            "backdrop-blur-md backdrop-saturate-150",
            "text-foreground font-medium",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
            "transition-all duration-300",
            "hover:bg-[#2A2A2D]/80 hover:border-[#404043]",
            ctaAnimation.isVisible && "animate-scale-up"
          )}
          style={{
            animationDelay: '100ms'
          }}
        >
          View Documentation
        </Button>
      </div>

      {/* Version Info */}
      <div className={cn(
        "absolute bottom-8 left-1/2 -translate-x-1/2",
        "flex items-center gap-4 text-xs text-[#A1A1A6]",
        "opacity-0 animate-fade-in"
      )}
      style={{
        animationDelay: '800ms'
      }}
      >
        <span>v0.1.0</span>
        <span>•</span>
        <span>Early Access</span>
        <span>•</span>
        <span>Context-First</span>
      </div>
    </section>
  )
} 