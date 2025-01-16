"use client"

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@repo/design-system/lib/utils'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'
import { 
  Command, Brain, Users, GitBranch, MessageSquare, 
  Search, Plus, ChevronDown, Hash, Bell, UserCircle,
  Sparkles, Code2, FileCode, Settings, Menu as MenuIcon, Activity
} from 'lucide-react'

interface AppPreviewContext {
  id: string
  name: string
  type: 'feature' | 'design' | 'docs'
  files: string[]
  team: string[]
  activity: string[]
}

interface AppPreviewMessage {
  type: 'user' | 'assistant'
  text: string
  tags?: string[]
  options?: string[]
}

interface AppPreviewProps {
  title?: string
  description?: string
  contexts?: AppPreviewContext[]
  conversation?: AppPreviewMessage[]
  showFeatures?: boolean
  className?: string
}

const defaultContexts: AppPreviewContext[] = [
  {
    id: 'feature-1',
    name: 'Dark Mode',
    type: 'feature',
    files: ['theme.ts', 'config.ts', 'components/theme-switch.tsx'],
    team: ['Alice', 'Bob'],
    activity: [
      'Updated theme configuration',
      'Added dark mode toggle',
      'Fixed color variables'
    ]
  },
  {
    id: 'design-1',
    name: 'Component Library',
    type: 'design',
    files: ['button.tsx', 'input.tsx', 'card.tsx'],
    team: ['Carol', 'Dave'],
    activity: [
      'Added new button variants',
      'Updated input styles',
      'Created card component'
    ]
  },
  {
    id: 'docs-1',
    name: 'API Documentation',
    type: 'docs',
    files: ['api.md', 'endpoints.md', 'examples.md'],
    team: ['Eve', 'Frank'],
    activity: [
      'Added endpoint documentation',
      'Updated examples',
      'Fixed typos'
    ]
  }
]

const defaultConversation: AppPreviewMessage[] = [
  {
    type: 'user',
    text: 'Create a new context for dark mode implementation',
    options: [
      'Start from scratch',
      'Use existing theme',
      'Import from design system'
    ]
  },
  {
    type: 'assistant',
    text: "I'll help set up a new context for the dark mode feature. What would you like to include?",
    tags: ['theme.ts', 'colors.ts', 'components/*'],
    options: [
      'Add team members',
      'Set up branches',
      'Configure preview'
    ]
  }
]

export function AppPreview({
  title = "Smart Development Environment",
  description,
  contexts = defaultContexts,
  conversation = defaultConversation,
  showFeatures = true,
  className
}: AppPreviewProps) {
  const [activeContext, setActiveContext] = useState(contexts[0])
  const [isTyping, setIsTyping] = useState(false)
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [showCommandBar, setShowCommandBar] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const { ref: containerRef, isVisible } = useIntersectionAnimation()

  useEffect(() => {
    // Simulate typing effect
    const interval = setInterval(() => {
      setCurrentMessageIndex(prev => {
        if (prev < conversation.length) {
          setIsTyping(true)
          setTimeout(() => setIsTyping(false), 1000)
          return prev + 1
        }
        return prev
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [conversation.length])

  return (
    <section 
      className={cn(
        "relative py-24 overflow-hidden scroll-fade",
        className
      )} 
      ref={containerRef}
    >
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

      <div className="max-w-6xl mx-auto relative">
        {/* Header Badge */}
        <div className={cn(
          "flex justify-center mb-8",
          "transform transition-all duration-700 delay-100",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-primary/10 backdrop-blur-sm",
            "border border-primary/20",
            "shadow-glow-subtle"
          )}>
            <Command className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>

        {description && (
          <p className={cn(
            "text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12",
            "transform transition-all duration-700 delay-200",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            {description}
          </p>
        )}

        {/* App Preview */}
        <div className={cn(
          "relative p-8 rounded-2xl overflow-hidden",
          "bg-background/50 backdrop-blur-xl",
          "border border-border/50",
          "shadow-glow-subtle",
          "transform transition-all duration-700 delay-300",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          {/* App Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Command className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Smart Context</span>
              </div>
              <div className="h-4 w-[1px] bg-border" />
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-primary" />
                <span className="text-sm text-muted-foreground">AI-Powered Workspace</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                <Bell className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* App Layout */}
          <div className="grid grid-cols-[240px,1fr] gap-6 h-[400px]">
            {/* Context Panel */}
            <div className="rounded-xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium">Active Contexts</h3>
                <button className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                  <Plus className="w-4 h-4 text-primary" />
                </button>
              </div>
              
              {/* Context List */}
              <div className="space-y-2">
                {contexts.map((ctx, i) => (
                  <button
                    key={ctx.id}
                    onClick={() => setActiveContext(ctx)}
                    className={cn(
                      "w-full p-3 rounded-lg text-left transition-all",
                      "hover:bg-primary/10",
                      ctx.id === activeContext.id ? "bg-primary/10" : "bg-transparent",
                      "transform transition-all duration-300",
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4",
                      `delay-[${(i + 4) * 100}ms]`
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {ctx.type === 'feature' && <Code2 className="w-4 h-4 text-primary" />}
                      {ctx.type === 'design' && <FileCode className="w-4 h-4 text-primary" />}
                      {ctx.type === 'docs' && <FileCode className="w-4 h-4 text-primary" />}
                      <span className="text-sm font-medium">{ctx.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Hash className="w-3 h-3" />
                      <span>{ctx.files.length} files</span>
                      <span>•</span>
                      <span>{ctx.team.length} members</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="rounded-xl border border-border/50 bg-background/50 p-4">
              {/* Content Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium">{activeContext.name}</h2>
                  <div className="flex -space-x-2">
                    {activeContext.team.map((member, i) => (
                      <div
                        key={member}
                        className="w-6 h-6 rounded-full bg-primary/10 border border-border flex items-center justify-center"
                        style={{ zIndex: activeContext.team.length - i }}
                      >
                        <span className="text-xs font-medium">{member[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 rounded-lg text-sm hover:bg-primary/10 transition-colors">
                    Share
                  </button>
                  <button className="px-3 py-1.5 rounded-lg text-sm bg-primary/10 hover:bg-primary/20 transition-colors">
                    <span className="text-primary font-medium">Open</span>
                  </button>
                </div>
              </div>

              {/* Activity Feed */}
              <div className="space-y-3">
                {activeContext.activity.map((activity, i) => (
                  <div
                    key={activity}
                    className={cn(
                      "p-3 rounded-lg bg-background/50",
                      "transform transition-all duration-300",
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
                      `delay-[${(i + 7) * 100}ms]`
                    )}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="w-4 h-4 text-primary" />
                      <span>{activity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Command Bar */}
          {showCommandBar && (
            <div className={cn(
              "absolute inset-x-8 top-24",
              "p-4 rounded-xl",
              "bg-background/80 backdrop-blur-xl",
              "border border-border/50",
              "shadow-glow-subtle",
              "transform transition-all duration-300",
              "animate-in fade-in slide-in-from-top-4"
            )}>
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contexts, files, or team members..."
                  className="flex-1 bg-transparent border-none outline-none text-sm"
                />
                <kbd className="px-2 py-1 text-xs rounded bg-muted">⌘K</kbd>
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        {showFeatures && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: "Smart Context",
                description: "AI-powered workspaces that understand your development workflow"
              },
              {
                icon: Users,
                title: "Real-time Collaboration",
                description: "Work together seamlessly with live presence and instant updates"
              },
              {
                icon: Command,
                title: "Command-Driven",
                description: "Fast and intuitive interface with powerful keyboard shortcuts"
              }
            ].map((feature, i) => (
              <div
                key={feature.title}
                className={cn(
                  "p-6 rounded-xl",
                  "bg-background/50 backdrop-blur-sm",
                  "border border-border/50",
                  "transform transition-all duration-700",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                  `delay-[${(i + 1) * 200}ms]`
                )}
              >
                <feature.icon className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
} 