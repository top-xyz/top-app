"use client"

import { Users, GitBranch, Wand2, ArrowRight, Sparkles, Command, Workflow } from 'lucide-react'
import { buttonVariants } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

const features = [
  {
    icon: Command,
    title: "Team Collaboration",
    description: "Share contexts, collaborate in real-time, and build together seamlessly.",
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20"
  },
  {
    icon: GitBranch,
    title: "Advanced Context",
    description: "Multiple context branches, merge capabilities, and version control integration.",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20"
  },
  {
    icon: Workflow,
    title: "Custom Workflows",
    description: "Create and share your own AI-powered workflows and automations.",
    gradient: "from-orange-500/20 via-rose-500/20 to-pink-500/20"
  }
]

const codeSnippet = `// Example of team collaboration
const project = await context.create({
  team: "design-system",
  branch: "feature/new-components"
});

// Real-time collaboration
project.on("change", ({ author, changes }) => {
  console.log(\`\${author} made changes: \${changes}\`);
});

// Deploy preview
const preview = await project.deploy();
console.log(\`Preview URL: \${preview.url}\`);`

export function ProFeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

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
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[128px] animate-float-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-violet-500/10 rounded-full blur-[128px] animate-float-slow [animation-delay:2s]" />
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
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Pro Experience</span>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
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
                  Unlock the power of context
                </h2>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Take your creative flow to the next level with advanced features designed for teams and power users.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-6">
                {features.map((feature, i) => (
                  <div 
                    key={feature.title}
                    className={cn(
                      "group/feature relative",
                      "transform transition-all duration-700",
                      isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                      `[transition-delay:${(i + 1) * 100}ms]`
                    )}
                  >
                    <div className={cn(
                      "relative z-10 flex items-start gap-4 p-4 rounded-xl",
                      "transition-all duration-500 ease-out",
                      "hover:bg-white/[0.02]",
                      "border border-transparent",
                      "hover:border-white/10",
                      "bg-background/20 backdrop-blur-sm"
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

              {/* CTA Button */}
              <div className={cn(
                "transform transition-all duration-700",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                "[transition-delay:800ms]"
              )}>
                <Link
                  href="/pricing"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "group/btn relative overflow-hidden"
                  )}
                >
                  <span className={cn(
                    "relative z-10 flex items-center gap-2",
                    "transform group-hover/btn:translate-x-1 transition-transform duration-300"
                  )}>
                    Upgrade to Pro
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-r from-primary/50 to-primary",
                    "opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300",
                    "transform group-hover/btn:scale-110 group-hover/btn:rotate-2 transition-transform duration-500"
                  )} />
                </Link>
              </div>
            </div>

            {/* Preview Side */}
            <div className={cn(
              "relative aspect-square lg:aspect-auto lg:h-[600px]",
              "transform transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
              "[transition-delay:400ms]"
            )}>
              {/* Code Preview */}
              <div className={cn(
                "absolute inset-0 rounded-xl overflow-hidden",
                "bg-black/40 backdrop-blur-xl",
                "border border-white/10",
                "shadow-2xl",
                "transform group-hover:scale-[1.02] transition-transform duration-500"
              )}>
                {/* Code Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                  </div>
                  <div className="text-xs text-white/40 font-mono">team-collaboration.ts</div>
                </div>
                {/* Code Content */}
                <div className="p-4 font-mono text-sm text-white/70 overflow-hidden">
                  <pre className="whitespace-pre-wrap">{codeSnippet}</pre>
                </div>
                {/* Code Reflection */}
                <div className={cn(
                  "absolute inset-0",
                  "bg-gradient-to-t from-primary/5 to-transparent",
                  "opacity-0 group-hover:opacity-100",
                  "transition-opacity duration-500"
                )} />
              </div>

              {/* Background Gradients */}
              <div className={cn(
                "absolute -inset-1/4 bg-gradient-to-tr from-blue-500/30 to-violet-500/30 rounded-full blur-3xl",
                "animate-float opacity-30",
                "mix-blend-soft-light"
              )} />
              <div className={cn(
                "absolute -inset-1/4 bg-gradient-to-bl from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl",
                "animate-float [animation-delay:1s] opacity-20",
                "mix-blend-soft-light"
              )} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 