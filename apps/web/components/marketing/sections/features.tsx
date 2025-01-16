"use client"

import { Sparkles } from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ChatPreview } from '../chat-preview'
import { LivePreview } from '../live-preview'
import { CollabPreview } from '../collab-preview'

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const features = [
  {
    title: "Natural Creation",
    description: "Transform your ideas into reality through natural conversation. No complex commands or syntax required.",
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
    glowColor: "blue",
    preview: {
      type: 'chat' as const,
      title: "AI Analytics Dashboard",
      chat: [
        { role: "user" as const, content: "I want to build an AI-powered analytics dashboard with real-time data visualization" },
        { role: "assistant" as const, content: "I'll help you create a sophisticated analytics platform. Here's what we'll include:\n- Real-time data streaming\n- AI-driven insights\n- Interactive visualizations\n- Anomaly detection\n\nI'll set up a Next.js app with TailwindCSS and D3.js for visualizations. Would you like to see a preview?" },
        { role: "user" as const, content: "Yes, show me a preview" },
        { role: "assistant" as const, content: "Here's your dashboard preview: https://analytics-preview.vercel.app\n\nI've created:\n- Real-time data pipeline\n- Dynamic chart components\n- AI insight generation\n- Dark mode interface\n\nShall we customize the visualization types?" }
      ] as ChatMessage[]
    }
  },
  {
    title: "Instant Reality",
    description: "See your ideas come to life instantly with real-time previews and deployments.",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    glowColor: "emerald",
    preview: {
      type: 'live' as const,
      title: "preview-7x9f2k"
    }
  },
  {
    title: "Instant Sharing",
    description: "Share your creations instantly with teammates and stakeholders through live previews.",
    gradient: "from-orange-500/20 via-rose-500/20 to-pink-500/20",
    glowColor: "orange",
    preview: {
      type: 'collab' as const,
      title: "#ai-analytics",
      team: [
        { id: "AC", name: "Alice Chen", status: "Implementing real-time data pipeline", time: "2m ago" },
        { id: "BW", name: "Bob Wilson", status: "Training anomaly detection model", time: "5m ago" },
        { id: "CJ", name: "Carol Johnson", status: "Optimizing visualization performance", time: "12m ago" },
        { id: "DK", name: "David Kim", status: "Adding custom chart components", time: "18m ago" }
      ],
      activity: [
        { type: "deployment", message: "Deployed v2.3.0 with improved ML pipeline", time: "1m ago" },
        { type: "feature", message: "Added predictive analytics module", time: "10m ago" },
        { type: "optimization", message: "Reduced inference latency by 40%", time: "15m ago" },
        { type: "integration", message: "Connected to enterprise data sources", time: "25m ago" }
      ]
    }
  }
]

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section className="py-24 px-4 relative overflow-hidden scroll-fade" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 pointer-events-none opacity-0 animate-fade-in" />
      <div className={cn(
        "absolute inset-0 bg-grid-white/[0.02]",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      )} />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] animate-float-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] animate-float-slow [animation-delay:2s]" />
      </div>

      <div className="max-w-6xl mx-auto">
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
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Creative Development</span>
          </div>
        </div>

        {/* Main Header */}
        <div className={cn(
          "text-center space-y-6 mb-16",
          "transform transition-all duration-700 delay-200",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/70",
            "animate-gradient-flow"
          )}>
            The poetry of creation
          </h2>
          <p className={cn(
            "text-lg text-muted-foreground max-w-2xl mx-auto",
            "animate-fade-in [animation-delay:300ms]"
          )}>
            Transform how you think about software creation. Every conversation is a verse, every preview a stanza, and every deployment a completed poem in your digital anthology.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                "group relative",
                "transform transition-all duration-700",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                `[transition-delay:${(i + 1) * 200}ms]`
              )}
            >
              {/* Feature Card */}
              <div className={cn(
                "relative z-10 overflow-hidden",
                "p-8 rounded-xl h-full",
                "bg-background/50 backdrop-blur-xl",
                "border border-border/50",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
                "transition-all duration-500",
                "group-hover:shadow-[0_0_30px_-5px_var(--glow-color)]",
                "hover:scale-[1.02]"
              )}
              style={{
                ['--glow-color' as string]: `rgb(var(--${feature.glowColor}))`
              }}>
                {/* Feature Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn(
                    "p-2 rounded-lg",
                    "bg-gradient-to-br",
                    feature.gradient,
                    "transform transition-all duration-500",
                    "group-hover:scale-110 group-hover:rotate-[-8deg]"
                  )}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className={cn(
                    "font-semibold",
                    "transform transition-all duration-500",
                    "group-hover:translate-x-2"
                  )}>{feature.title}</h3>
                </div>

                <p className={cn(
                  "text-muted-foreground mb-6",
                  "transform transition-all duration-500",
                  "group-hover:translate-y-[-4px]"
                )}>
                  {feature.description}
                </p>

                {/* Feature Preview */}
                <div className="mt-6">
                  {feature.preview.type === 'chat' && (
                    <ChatPreview
                      title={feature.preview.title}
                      chat={feature.preview.chat}
                      className="w-full aspect-video"
                    />
                  )}
                  {feature.preview.type === 'live' && (
                    <LivePreview
                      title={feature.preview.title}
                      className="w-full aspect-video"
                    />
                  )}
                  {feature.preview.type === 'collab' && (
                    <CollabPreview
                      title={feature.preview.title}
                      className="w-full aspect-video"
                    />
                  )}
                </div>
              </div>

              {/* Feature Background Glow */}
              <div className={cn(
                "absolute inset-0 -z-10",
                "rounded-xl",
                `bg-gradient-to-br ${feature.gradient}`,
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-500",
                "blur-2xl"
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 