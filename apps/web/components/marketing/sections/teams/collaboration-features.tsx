"use client"

import { cn } from '@repo/design-system/lib/utils'
import { 
  Users, GitBranch, MessageSquare, Brain, Sparkles, Command,
  Settings, Layers, Share2, History, Lock, Menu, Search, Plus,
  ChevronDown, Hash, Bell, UserCircle
} from 'lucide-react'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

type Message = {
  type: string;
  text: string;
  options?: string[];
  tags?: string[];
  isNew?: boolean;
};

const features = [
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together seamlessly with live cursors, presence indicators, and instant updates.",
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
    preview: {
      title: "team-collaboration.top",
      messages: [
        { type: "user", text: "Add Sarah to the design system team" },
        { type: "assistant", text: "I'll help you add Sarah to the team. What's their GitHub username?", options: [
          "Enter username",
          "Send invite link",
          "Add from organization"
        ]},
        { type: "user", text: "@sarahdesign" },
        { type: "assistant", text: "Great! I'll add @sarahdesign to:", options: [
          "Design System Team",
          "Frontend Team",
          "All Teams"
        ]},
        { type: "user", text: "Design System Team" },
        { type: "assistant", text: "Added @sarahdesign to the Design System team with default permissions", tags: ["team:design-system", "role:member", "access:write"]}
      ] as Message[]
    }
  },
  {
    icon: Brain,
    title: "Smart Context",
    description: "Share and manage development contexts across your team with AI-powered insights.",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    preview: {
      title: "context-management.top",
      messages: [
        { type: "user", text: "Create a new context for dark mode" },
        { type: "assistant", text: "I'll help set up a new context. Which type would you like?", options: [
          "Feature Branch",
          "Design System",
          "Documentation",
          "Custom Context"
        ]},
        { type: "user", text: "Feature Branch" },
        { type: "assistant", text: "Created feature/dark-mode context with smart suggestions:", tags: [
          "theme.ts",
          "colors.ts",
          "components/*"
        ], options: [
          "Share with team",
          "Open in IDE",
          "View changes"
        ]}
      ]
    }
  },
  {
    icon: MessageSquare,
    title: "Team Communication",
    description: "Built-in chat and discussions tied directly to your codebase and contexts.",
    gradient: "from-orange-500/20 via-rose-500/20 to-pink-500/20",
    preview: {
      title: "team-chat.top",
      messages: [
        { type: "user", text: "Review the new button component" },
        { type: "assistant", text: "Opening button.tsx for review. Who should I notify?", options: [
          "Design Team",
          "Frontend Team",
          "Specific Members"
        ]},
        { type: "user", text: "Design Team" },
        { type: "assistant", text: "Created review thread in #design-system", tags: [
          "components/ui/button.tsx",
          "3 team members active",
          "Changes: +42 -17"
        ], options: [
          "Schedule review",
          "Add comment",
          "View changes"
        ]}
      ]
    }
  }
]

export function CollaborationFeatures() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [activeFeature, setActiveFeature] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

  // Simulate typing effect when active feature changes
  useEffect(() => {
    setCurrentMessageIndex(0)
    const conversation = features[activeFeature].preview.messages
    let index = 0

    const interval = setInterval(() => {
      if (index < conversation.length) {
        setIsTyping(true)
        setTimeout(() => {
          setCurrentMessageIndex(prev => prev + 1)
          setIsTyping(false)
        }, 1000)
        index++
      } else {
        clearInterval(interval)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [activeFeature])

  return (
    <section className="py-24 px-4 relative overflow-hidden scroll-fade">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
      <div className={cn(
        "absolute inset-0 bg-grid-white/[0.02]",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      )} />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px] animate-float-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[128px] animate-float-slow [animation-delay:2s]" />
      </div>

      <div className="max-w-6xl mx-auto relative" ref={ref}>
        {/* Header Badge */}
        <div className={cn(
          "flex justify-center mb-8",
          "transform transition-all duration-700 delay-100",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-primary/10 backdrop-blur-sm",
            "border border-primary/20",
            "shadow-glow-subtle"
          )}>
            <Command className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Collaboration Features</span>
          </div>
        </div>

        <div className={cn(
          "relative p-8 md:p-12 rounded-2xl overflow-hidden",
          "bg-background/50 backdrop-blur-xl",
          "border border-border/50",
          "shadow-glow-subtle transition-all duration-300",
          "group"
        )}>
          {/* Background Graph Paper */}
          <div className={cn(
            "absolute inset-0 bg-grid-white/[0.02]",
            "transition-opacity duration-500",
            "opacity-40 group-hover:opacity-100"
          )}>
            {/* Animated Glow Lines */}
            <div className={cn(
              "absolute inset-0",
              "bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_70%)]",
              "animate-glow-lines"
            )} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start relative">
            {/* Content Side */}
            <div className="space-y-8">
              <div className={cn(
                "space-y-4",
                "transform transition-all duration-700",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              )}>
                <h2 className={cn(
                  "text-4xl md:text-5xl font-bold",
                  "bg-clip-text text-transparent",
                  "bg-gradient-to-b from-foreground to-foreground/70"
                )}>
                  Built for modern teams
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Powerful collaboration features that help your team work better together.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-6">
                {features.map((feature, i) => (
                  <div 
                    key={feature.title}
                    className={cn(
                      "group/feature relative cursor-pointer",
                      "transform transition-all duration-700",
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                      `[transition-delay:${(i + 1) * 100}ms]`
                    )}
                    onClick={() => setActiveFeature(i)}
                  >
                    <div className={cn(
                      "relative z-10 flex items-start gap-4 p-4 rounded-xl",
                      "transition-all duration-500 ease-out",
                      "hover:bg-white/[0.02]",
                      "border border-transparent",
                      "hover:border-white/10",
                      "bg-background/20 backdrop-blur-sm",
                      activeFeature === i && "border-primary/20 bg-white/[0.02]"
                    )}>
                      <div className={cn(
                        "p-2 rounded-lg",
                        "bg-primary/10",
                        "border border-primary/20",
                        "transform transition-all duration-500",
                        "group-hover/feature:rotate-[-8deg] group-hover/feature:scale-110",
                        "relative"
                      )}>
                        <feature.icon className="w-5 h-5 text-primary" />
                        <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover/feature:opacity-100 transition-opacity duration-500" />
                      </div>
                      <div className="transform transition-all duration-500 group-hover/feature:translate-x-1">
                        <h3 className="font-medium mb-1">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                      
                      {/* Graph Paper Background */}
                      <div className={cn(
                        "absolute inset-0 bg-grid-white/[0.02] opacity-0",
                        "transition-all duration-500 ease-out",
                        "group-hover/feature:opacity-100",
                        "[mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]"
                      )} />
                    </div>
                    
                    {/* Feature Highlight Gradient */}
                    <div className={cn(
                      "absolute inset-0 -z-10 rounded-xl",
                      `bg-gradient-to-r ${feature.gradient}`,
                      "opacity-0 group-hover/feature:opacity-100",
                      "transition-opacity duration-500",
                      "blur-xl scale-[0.95]"
                    )} />
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Side */}
            <div className={cn(
              "relative aspect-square lg:aspect-auto lg:h-[600px]",
              "transform transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              "[transition-delay:400ms]"
            )}>
              {/* App Preview */}
              <div className={cn(
                "absolute inset-0 rounded-xl overflow-hidden",
                "bg-background/50 backdrop-blur-xl",
                "border border-border/50",
                "shadow-glow-subtle",
                isTyping && "shadow-glow-primary",
                "transition-all duration-700",
                "flex flex-col"
              )}>
                {/* App Header */}
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
                    </div>
                    <span className="font-mono text-sm text-muted-foreground">
                      {features[activeFeature].preview.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Bell className="w-4 h-4" />
                    <UserCircle className="w-4 h-4" />
                  </div>
                </div>

                {/* App Layout */}
                <div className="flex flex-1 h-full">
                  {/* Context Sidebar */}
                  <div className="w-10 border-r border-border/50 flex flex-col items-center py-3 gap-3">
                    <Menu className="w-4 h-4 text-muted-foreground" />
                    <div className="w-6 h-[1px] bg-border/50" />
                    <Brain className="w-4 h-4 text-primary" />
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <GitBranch className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Context Panel */}
                  <div className="w-56 border-r border-border/50 flex flex-col">
                    <div className="flex items-center gap-2 p-3 border-b border-border/50">
                      <Search className="w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search contexts..."
                        className="bg-transparent text-sm flex-1 outline-none"
                      />
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 p-2 space-y-1">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-primary/10 text-primary text-sm">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          <span>design-system</span>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                      <div className="flex items-center justify-between p-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          <span>frontend</span>
                        </div>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="flex-1 flex flex-col">
                    <div 
                      className="flex-1 p-4 space-y-4 overflow-y-auto"
                    >
                      {features[activeFeature].preview.messages.slice(0, currentMessageIndex).map((message, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "flex items-start gap-3",
                            "transition-opacity duration-500",
                            message.isNew && "animate-slide-up"
                          )}
                        >
                          <div className={cn(
                            "w-6 h-6 rounded-full flex-shrink-0",
                            message.type === 'user' ? "bg-muted/30" : "bg-primary/30"
                          )} />
                          <div className="space-y-2 flex-1">
                            <p className={cn(
                              message.type === 'user' ? "text-muted-foreground" : "text-foreground"
                            )}>
                              {message.text}
                              {isTyping && i === currentMessageIndex - 1 && (
                                <span className="inline-block w-1 h-4 ml-1 bg-primary animate-pulse">_</span>
                              )}
                            </p>
                            {message.tags && (
                              <div className="flex flex-wrap gap-2 text-xs">
                                {message.tags.map((tag, i) => (
                                  <span
                                    key={tag}
                                    className={cn(
                                      "px-2 py-1 rounded-md",
                                      "bg-primary/10 text-primary font-mono",
                                      "opacity-0 animate-fade-in"
                                    )}
                                    style={{
                                      animationDelay: `${i * 100}ms`
                                    }}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            {message.options && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {message.options.map((option, i) => (
                                  <button
                                    key={option}
                                    className={cn(
                                      "px-3 py-1.5 rounded-md text-sm",
                                      "bg-background/50 backdrop-blur-sm",
                                      "border border-border/50",
                                      "hover:bg-primary/5 hover:border-primary/50",
                                      "transition-colors duration-300",
                                      "opacity-0 animate-fade-in"
                                    )}
                                    style={{
                                      animationDelay: `${i * 100}ms`
                                    }}
                                  >
                                    {option}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0.2s]" />
                          <div className="w-2 h-2 rounded-full bg-primary/50 animate-bounce [animation-delay:0.4s]" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Animated Gradient Line */}
                <div className={cn(
                  "absolute bottom-0 left-0 right-0 h-1",
                  "bg-gradient-to-r from-primary/50 via-primary to-primary/50",
                  "bg-[length:200%_100%]",
                  isTyping ? "animate-shimmer" : "opacity-0",
                  "transition-opacity duration-700"
                )} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 