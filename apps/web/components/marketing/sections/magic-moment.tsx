"use client"

import { CodeHero } from '@/components/marketing/code-hero'
import { cn } from '@repo/design-system/lib/utils'

export function MagicMomentSection() {
  return (
    <section className="py-24 px-4 relative overflow-hidden scroll-fade">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 pointer-events-none opacity-0 animate-fade-in" />
      <div className="max-w-6xl mx-auto relative">
        <h2 className={cn(
          "text-3xl md:text-4xl font-bold text-center mb-16",
          "bg-clip-text text-transparent",
          "bg-gradient-to-b from-foreground to-foreground/70",
          "animate-fade-in-up"
        )}>
          From thought to deployment<br />
          in the time it takes to speak it
        </h2>
        
        <div className={cn(
          "transform hover:scale-[1.02] transition-transform duration-300",
          "animate-fade-in-scale [animation-delay:300ms]"
        )}>
          <CodeHero />
        </div>
      </div>
    </section>
  )
} 