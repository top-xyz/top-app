import { cn } from "@repo/design-system"

export function Background({ className }: { className?: string }) {
  return (
    <div className={cn("fixed inset-0 -z-10", className)}>
      {/* Animated gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-pink-500/30 animate-gradient-flow"
        style={{ backgroundSize: "400% 400%" }}
      />

      {/* Mist effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-mist-flow-1" />
        <div className="absolute inset-0 bg-gradient-to-l from-purple-500/10 to-pink-500/10 animate-mist-flow-2" />
      </div>

      {/* Grid backdrop */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '4rem 4rem',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-50%)',
          maskImage: 'linear-gradient(to bottom, transparent, black, transparent)',
        }}
      />

      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-[100px]" />

      {/* Noise texture */}
      <svg className="pointer-events-none fixed isolate z-50 opacity-70 mix-blend-soft-light">
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>
    </div>
  )
} 