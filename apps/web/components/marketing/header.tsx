"use client"

import { ModeToggle } from '@repo/design-system/components/mode-toggle'
import { cn } from '@repo/design-system/lib/utils'

export function Header() {
  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50",
      "animate-fade-in-down [animation-duration:600ms]"
    )}>
      <nav className={cn(
        "mx-auto my-4 max-w-[860px] rounded-lg",
        "bg-background/50 backdrop-blur-xl border border-border/50",
        "px-4 py-3 flex items-center justify-between",
        "shadow-glow hover:shadow-glow-primary transition-all duration-500",
        "transform hover:-translate-y-0.5 hover:scale-[1.01]",
        "will-change-transform"
      )}>
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-2 group cursor-pointer",
          "transition-transform duration-200 hover:scale-105 active:scale-95"
        )}>
          <div className="text-2xl relative">
            <div className="relative">🧠</div>
          </div>
          <div className="font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
            top
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          {['Store', 'Pro', 'Teams', 'Developers', 'Blog', 'Pricing'].map((link, i) => (
            <a 
              key={link}
              href="#" 
              className={cn(
                "text-sm text-muted-foreground relative group",
                "transition-all duration-200 hover:text-foreground hover:-translate-y-0.5",
                "animate-fade-in-up",
                `[animation-delay:${i * 100}ms]`
              )}
            >
              <span className="relative z-10">{link}</span>
              <div className={cn(
                "absolute inset-0 bg-primary/10 rounded-md opacity-0 scale-90",
                "transition-all duration-200",
                "group-hover:opacity-100 group-hover:scale-110"
              )} />
            </a>
          ))}
          <div className="pl-2">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  )
}