"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Brain, GitBranch, Network, Share2, Database, Code2, FileText } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'
import { useState } from 'react'

export function SmartContextDemo() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const demoAnimation = useIntersectionAnimation<HTMLDivElement>()
  const [activeContext, setActiveContext] = useState<string>('web')
  const [activeNode, setActiveNode] = useState<string | null>(null)

  const contextTypes = {
    web: {
      title: "Web Application",
      nodes: [
        { id: 'app', label: 'Next.js App', type: 'core', x: 20, y: 20 },
        { id: 'api', label: 'API Routes', type: 'service', x: 40, y: 30 },
        { id: 'db', label: 'Database', type: 'data', x: 60, y: 40 },
        { id: 'auth', label: 'Auth Service', type: 'service', x: 35, y: 50 },
        { id: 'docs', label: 'Documentation', type: 'resource', x: 70, y: 60 }
      ],
      edges: [
        { from: 'app', to: 'api' },
        { from: 'api', to: 'db' },
        { from: 'app', to: 'auth' },
        { from: 'api', to: 'auth' },
        { from: 'app', to: 'docs' }
      ]
    },
    mobile: {
      title: "Mobile App",
      nodes: [
        { id: 'app', label: 'React Native', type: 'core', x: 20, y: 20 },
        { id: 'state', label: 'State Management', type: 'service', x: 40, y: 30 },
        { id: 'storage', label: 'Local Storage', type: 'data', x: 60, y: 40 },
        { id: 'push', label: 'Push Notifications', type: 'service', x: 35, y: 50 },
        { id: 'analytics', label: 'Analytics', type: 'resource', x: 70, y: 60 }
      ],
      edges: [
        { from: 'app', to: 'state' },
        { from: 'state', to: 'storage' },
        { from: 'app', to: 'push' },
        { from: 'app', to: 'analytics' }
      ]
    },
    backend: {
      title: "Backend Service",
      nodes: [
        { id: 'server', label: 'Express Server', type: 'core', x: 20, y: 20 },
        { id: 'queue', label: 'Message Queue', type: 'service', x: 40, y: 30 },
        { id: 'cache', label: 'Redis Cache', type: 'data', x: 60, y: 40 },
        { id: 'worker', label: 'Worker Service', type: 'service', x: 35, y: 50 },
        { id: 'logs', label: 'Logging System', type: 'resource', x: 70, y: 60 }
      ],
      edges: [
        { from: 'server', to: 'queue' },
        { from: 'queue', to: 'worker' },
        { from: 'server', to: 'cache' },
        { from: 'worker', to: 'logs' }
      ]
    }
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'core': return Brain
      case 'service': return Network
      case 'data': return Database
      case 'resource': return FileText
      default: return Code2
    }
  }

  const getColorForType = (type: string) => {
    switch (type) {
      case 'core': return "#0F6BFF"
      case 'service': return "#30D158"
      case 'data': return "#FFD60A"
      case 'resource': return "#FF375F"
      default: return "#A1A1A6"
    }
  }

  return (
    <section className={cn(
      "relative py-32 px-4 overflow-hidden"
    )}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
      <div className={cn(
        "absolute inset-0 bg-grid-white/[0.02]",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      )} />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div 
          ref={headerAnimation.ref}
          className={cn(
            "text-center max-w-3xl mx-auto opacity-0",
            headerAnimation.isVisible && "animate-fade-in"
          )}
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/50"
          )}>
            Smart Context Management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Experience our intelligent context system that understands your entire development workflow
          </p>
        </div>

        {/* Context Type Selector */}
        <div className="mt-12 flex justify-center gap-4">
          {Object.entries(contextTypes).map(([key, value]) => (
            <Button
              key={key}
              variant={activeContext === key ? "default" : "outline"}
              className={cn(
                "px-6 py-2 rounded-xl",
                "border-[#2A2A2D] hover:border-[#404043]",
                "transition-all duration-200",
                activeContext === key && "bg-[#0F6BFF] hover:bg-[#0F6BFF]/90"
              )}
              onClick={() => setActiveContext(key)}
            >
              {value.title}
            </Button>
          ))}
        </div>

        {/* Interactive Demo */}
        <div 
          ref={demoAnimation.ref}
          className={cn(
            "mt-12 opacity-0",
            demoAnimation.isVisible && "animate-fade-in"
          )}
        >
          {/* Knowledge Graph Visualization */}
          <div className={cn(
            "relative aspect-video rounded-xl",
            "bg-[#1D1D20] border border-[#2A2A2D]",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
            "p-8"
          )}>
            {/* Graph Paper Effect */}
            <div className={cn(
              "absolute inset-0 bg-grid-white/[0.02]",
              "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
              "rounded-xl overflow-hidden"
            )} />

            {/* Nodes */}
            <div className="relative h-full">
              {contextTypes[activeContext as keyof typeof contextTypes].nodes.map((node) => {
                const Icon = getIconForType(node.type)
                const color = getColorForType(node.type)

                return (
                  <div
                    key={node.id}
                    className={cn(
                      "absolute p-4 rounded-lg",
                      "bg-[#2A2A2D] border border-[#404043]",
                      "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                      "transition-all duration-300",
                      "cursor-pointer group",
                      "hover:border-[#0F6BFF]",
                      activeNode === node.id && [
                        "border-[#0F6BFF]",
                        "ring-2 ring-[#0F6BFF]/20"
                      ]
                    )}
                    style={{
                      top: `${node.y}%`,
                      left: `${node.x}%`,
                      borderColor: activeNode === node.id ? color : undefined
                    }}
                    onClick={() => setActiveNode(node.id)}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" style={{ color }} />
                      <span className="text-sm font-medium text-white">
                        {node.label}
                      </span>
                    </div>

                    {/* Hover Info */}
                    <div className={cn(
                      "absolute top-full left-1/2 -translate-x-1/2 mt-2",
                      "w-48 p-2 rounded-lg",
                      "bg-[#1D1D20] border border-[#2A2A2D]",
                      "shadow-lg backdrop-blur-sm",
                      "opacity-0 translate-y-2",
                      "transition-all duration-200",
                      "pointer-events-none z-10",
                      "group-hover:opacity-100 group-hover:translate-y-0"
                    )}>
                      <div className="text-xs text-[#A1A1A6]">
                        <div className="font-medium text-white">{node.label}</div>
                        <div className="mt-1">Type: {node.type}</div>
                        <div>Connected: {
                          contextTypes[activeContext as keyof typeof contextTypes].edges
                            .filter(e => e.from === node.id || e.to === node.id).length
                        } nodes</div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Edges */}
              {contextTypes[activeContext as keyof typeof contextTypes].edges.map((edge, i) => {
                const fromNode = contextTypes[activeContext as keyof typeof contextTypes].nodes
                  .find(n => n.id === edge.from)
                const toNode = contextTypes[activeContext as keyof typeof contextTypes].nodes
                  .find(n => n.id === edge.to)
                if (!fromNode || !toNode) return null

                return (
                  <svg
                    key={i}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{ zIndex: -1 }}
                  >
                    <line
                      x1={`${fromNode.x}%`}
                      y1={`${fromNode.y}%`}
                      x2={`${toNode.x}%`}
                      y2={`${toNode.y}%`}
                      className={cn(
                        "stroke-[#404043] stroke-2",
                        "transition-colors duration-300",
                        (activeNode === edge.from || activeNode === edge.to) && "stroke-[#0F6BFF]"
                      )}
                    />
                  </svg>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 