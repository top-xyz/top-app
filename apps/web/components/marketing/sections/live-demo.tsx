"use client"

import { Brain, Command, Rocket, ArrowRight, Sparkles, Terminal, GitBranch } from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'
import { useState, useEffect, useRef } from 'react'

const conversationSteps = [
  {
    user: "I want to build a multiplayer drawing app",
    assistant: "Let's make that happen! I'll help you create a collaborative canvas app with real-time features.",
    context: {
      type: "Project Context",
      elements: [
        "Real-time Canvas API Integration",
        "WebSocket Infrastructure",
        "User Presence System",
        "Drawing Tools & State"
      ]
    },
    preview: "collab-draw.app.top/preview"
  },
  {
    user: "Can we add different brush styles and colors?",
    assistant: "I'll extend the context with brush customization and a color picker component.",
    context: {
      type: "Feature Context",
      elements: [
        "Brush Engine System",
        "Color Picker Component",
        "Tool State Management",
        "Style Persistence"
      ]
    },
    preview: "collab-draw.app.top/preview-v2"
  },
  {
    user: "How about saving drawings and sharing them?",
    assistant: "I'll add cloud storage and sharing capabilities to your context.",
    context: {
      type: "Integration Context",
      elements: [
        "Cloud Storage System",
        "Share Link Generation",
        "Access Control",
        "Real-time Updates"
      ]
    },
    preview: "collab-draw.app.top/preview-v3"
  }
]

export function LiveDemoSection() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  // Smooth step transition
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % conversationSteps.length)
    }, 8000) // Slower transitions for better readability
    return () => clearInterval(timer)
  }, [])

  // Smooth progress animation
  useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.transition = 'width 8000ms linear'
      progressRef.current.style.width = '100%'
      
      const reset = () => {
        progressRef.current!.style.transition = 'none'
        progressRef.current!.style.width = '0%'
        setTimeout(() => {
          progressRef.current!.style.transition = 'width 8000ms linear'
          progressRef.current!.style.width = '100%'
        }, 50)
      }

      reset()
    }
  }, [currentStep])

  return (
    <section className="py-24 px-4 relative overflow-hidden scroll-fade">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90" />
      
      {/* Subtle Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-float-slow [animation-delay:4s]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center space-y-4 mb-16">
          <h2 className={cn(
            "text-3xl md:text-4xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/70"
          )}>
            Natural creation.<br />
            Instant reality.
          </h2>
          <p className={cn(
            "text-lg text-muted-foreground max-w-2xl mx-auto"
          )}>
            Transform thoughts into software through natural conversation.
            Every word builds context, every context shapes reality.
          </p>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Natural Creation Card */}
          <div className={cn(
            "p-6 rounded-xl",
            "bg-background/50 backdrop-blur-xl",
            "border border-border/50",
            "shadow-glow-subtle hover:shadow-glow-primary transition-all duration-500",
            "flex flex-col"
          )}>
            <div className="flex items-center gap-2 mb-6">
              <div className={cn(
                "p-2 rounded-lg bg-primary/10 text-primary"
              )}>
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium">Natural Creation</h3>
                <p className="text-sm text-muted-foreground">Conversation becomes context</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {/* Chat Interface */}
              <div className={cn(
                "flex-1 rounded-lg p-4",
                "bg-background/80 backdrop-blur-xl",
                "border border-border/50"
              )}>
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Terminal className="w-4 h-4" />
                  <span>conversation.top</span>
                </div>

                <div className="space-y-4">
                  {/* User Message */}
                  <div className="flex items-start gap-3 animate-fade-in-up">
                    <div className="w-6 h-6 rounded-full bg-muted/30 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      {conversationSteps[currentStep].user}
                    </p>
                  </div>

                  {/* Assistant Message */}
                  <div className="flex items-start gap-3 animate-fade-in-up [animation-delay:400ms]">
                    <div className="w-6 h-6 rounded-full bg-primary/30 flex-shrink-0" />
                    <p className="text-foreground">
                      {conversationSteps[currentStep].assistant}
                    </p>
                  </div>
                </div>
              </div>

              {/* Smooth Progress Bar */}
              <div className="h-0.5 bg-muted/30 rounded-full overflow-hidden">
                <div 
                  ref={progressRef}
                  className="h-full bg-primary/50 rounded-full w-0"
                />
              </div>
            </div>
          </div>

          {/* Context Generation Card */}
          <div className={cn(
            "p-6 rounded-xl",
            "bg-background/50 backdrop-blur-xl",
            "border border-border/50",
            "shadow-glow-subtle hover:shadow-glow-primary transition-all duration-500",
            "flex flex-col"
          )}>
            <div className="flex items-center gap-2 mb-6">
              <div className={cn(
                "p-2 rounded-lg bg-primary/10 text-primary"
              )}>
                <GitBranch className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium">Context Generation</h3>
                <p className="text-sm text-muted-foreground">Knowledge becomes structure</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              <div className={cn(
                "flex-1 rounded-lg p-4",
                "bg-background/80 backdrop-blur-xl",
                "border border-border/50",
                "space-y-4"
              )}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Command className="w-4 h-4" />
                  <span>{conversationSteps[currentStep].context.type}</span>
                </div>

                <div className="space-y-2">
                  {conversationSteps[currentStep].context.elements.map((element, i) => (
                    <div 
                      key={element}
                      className={cn(
                        "p-2 rounded-md",
                        "bg-primary/5 backdrop-blur-sm",
                        "border border-primary/10",
                        "text-sm text-primary/90",
                        "animate-fade-in-up",
                        `[animation-delay:${i * 200}ms]`
                      )}
                    >
                      {element}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Instant Reality Card */}
          <div className={cn(
            "p-6 rounded-xl",
            "bg-background/50 backdrop-blur-xl",
            "border border-border/50",
            "shadow-glow-subtle hover:shadow-glow-primary transition-all duration-500",
            "flex flex-col"
          )}>
            <div className="flex items-center gap-2 mb-6">
              <div className={cn(
                "p-2 rounded-lg bg-primary/10 text-primary"
              )}>
                <Rocket className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium">Instant Reality</h3>
                <p className="text-sm text-muted-foreground">Context becomes real</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              {/* Preview Window */}
              <div className={cn(
                "flex-1 rounded-lg",
                "bg-background/80 backdrop-blur-xl",
                "border border-border/50",
                "overflow-hidden relative group/preview"
              )}>
                {/* Preview Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                  <Sparkles className={cn(
                    "w-8 h-8 text-primary/50 mb-4",
                    "animate-float-subtle"
                  )} />
                  <div className="text-center space-y-2">
                    <p className="text-sm font-mono text-muted-foreground">
                      {conversationSteps[currentStep].preview}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Context deployed and ready
                    </p>
                  </div>

                  {/* Preview Button */}
                  <button className={cn(
                    "mt-6 px-4 py-2 rounded-lg",
                    "bg-primary/10 text-primary",
                    "flex items-center gap-2",
                    "transform transition-all duration-500",
                    "opacity-0 translate-y-2",
                    "group-hover/preview:opacity-100 group-hover/preview:translate-y-0"
                  )}>
                    <span>Open Preview</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Subtle Border Glow */}
                <div className={cn(
                  "absolute inset-0 rounded-lg",
                  "bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10",
                  "animate-border-glow"
                )} />
              </div>

              {/* Deployment Status */}
              <div className={cn(
                "mt-4 p-3 rounded-lg",
                "bg-background/80 backdrop-blur-xl",
                "border border-border/50",
                "flex items-center justify-between"
              )}>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-subtle" />
                  <span className="text-sm text-muted-foreground">Live Preview</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Updated just now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 