'use client'

import { cn } from '@repo/design-system'

export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className={cn(
        "absolute inset-0",
        "bg-gradient-to-br from-background via-background to-muted",
        "animate-gradient-flow"
      )} />

      {/* Animated mist effects */}
      <div className={cn(
        "absolute inset-0 opacity-30",
        "pointer-events-none select-none"
      )}>
        <div className={cn(
          "absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent",
          "animate-mist-flow-1"
        )} />
        <div className={cn(
          "absolute inset-0 bg-gradient-to-l from-transparent via-foreground/5 to-transparent",
          "animate-mist-flow-2"
        )} />
      </div>

      {/* Floating grid backdrop */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"
        style={{
          transform: 'perspective(500px) rotateX(30deg) translateY(-50px)',
          maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)'
        }}
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[200px]" />

      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
} 