"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Terminal, Code2, GitBranch, Command, Braces, Blocks } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'
import { useState } from 'react'

export function DevTools() {
  const [activeTab, setActiveTab] = useState<'cli' | 'ide'>('cli')
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const previewAnimation = useIntersectionAnimation<HTMLDivElement>()
  const featuresAnimation = useIntersectionAnimation<HTMLDivElement>()

  const cliCommands = [
    { cmd: 'top init my-project', output: 'Initializing new project...\nCreating project structure...\nDone! ✨' },
    { cmd: 'top dev', output: 'Starting development server...\nReady on http://localhost:3000 🚀' },
    { cmd: 'top generate types', output: 'Analyzing project...\nGenerating TypeScript definitions...\nTypes updated! 📦' }
  ]

  const ideCommands = [
    { title: 'Smart Context', description: 'Analyzing workspace dependencies...' },
    { title: 'Generate API Types', description: 'Creating type definitions from schema...' },
    { title: 'Preview Deployment', description: 'Building and deploying preview...' }
  ]

  return (
    <section className={cn(
      "relative py-32 px-4 overflow-hidden",
      "bg-gradient-to-b from-background via-background/90 to-background/50"
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
            "text-center opacity-0",
            headerAnimation.isVisible && "animate-fade-in"
          )}
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl md:text-5xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/50"
          )}>
            Developer Tools & Extensions
          </h2>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful CLI tools and IDE integrations for seamless development workflows.
          </p>
        </div>

        {/* Tools Preview */}
        <div 
          ref={previewAnimation.ref}
          className={cn(
            "mt-16 opacity-0",
            previewAnimation.isVisible && "animate-fade-in"
          )}
        >
          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab('cli')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "transition-all duration-200",
                activeTab === 'cli' ? [
                  "bg-[#1D1D20]/80 text-white",
                  "border border-[#2A2A2D]",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                  "backdrop-blur-md backdrop-saturate-150"
                ] : "text-muted-foreground hover:text-white"
              )}
            >
              <Terminal className="w-4 h-4 inline-block mr-2" />
              Command Line
            </button>
            <button
              onClick={() => setActiveTab('ide')}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "transition-all duration-200",
                activeTab === 'ide' ? [
                  "bg-[#1D1D20]/80 text-white",
                  "border border-[#2A2A2D]",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                  "backdrop-blur-md backdrop-saturate-150"
                ] : "text-muted-foreground hover:text-white"
              )}
            >
              <Code2 className="w-4 h-4 inline-block mr-2" />
              IDE Integration
            </button>
          </div>

          {/* Preview Window */}
          <div className={cn(
            "w-full rounded-xl overflow-hidden",
            "bg-[#1D1D20]/80 border border-[#2A2A2D]",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
            "backdrop-blur-md backdrop-saturate-150"
          )}>
            {/* Window Header */}
            <div className="px-4 py-3 border-b border-[#2A2A2D] flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="ml-4 text-xs text-muted-foreground font-mono">
                {activeTab === 'cli' ? '~/my-project' : 'Top Extension'}
              </div>
            </div>

            {/* Window Content */}
            <div className="p-6 font-mono text-sm">
              {activeTab === 'cli' ? (
                <div className="space-y-6">
                  {cliCommands.map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-[#0F6BFF]">$</span>
                        <span>{item.cmd}</span>
                      </div>
                      <div className="pl-6 text-[#A1A1A6] whitespace-pre">{item.output}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {ideCommands.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={cn(
                        "w-3 h-3 mt-1 rounded-full animate-pulse",
                        i === 0 ? "bg-[#28C840]" :
                        i === 1 ? "bg-[#FFBD2E]" :
                        "bg-[#FF5F57]"
                      )} />
                      <div>
                        <div className="text-white">{item.title}</div>
                        <div className="text-[#A1A1A6]">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div 
          ref={featuresAnimation.ref}
          className={cn(
            "mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 opacity-0",
            featuresAnimation.isVisible && "animate-fade-in"
          )}
        >
          {[
            {
              icon: Terminal,
              title: "Command Line Tools",
              description: "Powerful CLI for project management, development, and deployment workflows",
              color: "#0F6BFF"
            },
            {
              icon: Braces,
              title: "Type Generation",
              description: "Automatic TypeScript definitions from your API schemas and database models",
              color: "#30D158"
            },
            {
              icon: Blocks,
              title: "Smart Integrations",
              description: "Seamless integration with your existing tools and development workflow",
              color: "#FFD60A"
            }
          ].map((feature, i) => (
            <div 
              key={feature.title}
              className={cn(
                "group p-6 rounded-xl",
                "bg-[#1D1D20]/80 border border-[#2A2A2D]",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                "backdrop-blur-md backdrop-saturate-150",
                "transition-all duration-300",
                "hover:shadow-[0_0_30px_rgba(0,0,0,0.2)]",
                "hover:border-opacity-100"
              )}
              style={{
                animation: featuresAnimation.isVisible ? 
                  `fade-in 0.5s ease-out forwards ${i * 100}ms` : 'none',
                borderColor: feature.color,
                opacity: 0.8,
                '--hover-opacity': '1'
              } as any}
            >
              <feature.icon 
                className="w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                style={{ color: feature.color }}
              />
              <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="mt-12 text-center">
          <Button 
            size="lg"
            className={cn(
              "rounded-xl",
              "bg-[#0F6BFF] hover:bg-[#0F6BFF]/90",
              "text-white font-medium",
              "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
              "transition-all duration-300",
              "hover:shadow-[0_0_20px_rgba(15,107,255,0.3)]"
            )}
          >
            <Terminal className="w-4 h-4 mr-2" />
            Get Started with CLI
          </Button>
        </div>
      </div>
    </section>
  )
} 