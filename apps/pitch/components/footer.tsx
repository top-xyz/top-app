"use client"

import { cn } from '../lib/utils'
import { Github, Twitter } from 'lucide-react'

function GridBackdrop() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Enhanced grid pattern with better contrast and smaller size */}
      <div className={cn(
        "absolute inset-0",
        "bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]",
        "bg-[size:14px_14px]",
        "[mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]"
      )} />
      
      {/* Glowing orbs */}
      <div className="absolute -left-24 top-24 w-48 h-48 bg-primary/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute -right-24 bottom-24 w-48 h-48 bg-primary/5 rounded-full blur-[100px] animate-float-delayed" />
    </div>
  )
}

export function Footer() {
  return (
    <footer className={cn(
      "relative mt-24",
      "before:absolute before:inset-0 before:bg-background/50",
      "before:backdrop-blur-xl before:backdrop-saturate-150",
      "before:border-t before:border-border/50",
      "before:-z-10"
    )}>
      <GridBackdrop />

      <div className={cn(
        "border-t border-border/50",
        "bg-background/50 backdrop-blur-xl"
      )}>
        <div className="max-w-[860px] mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© 2024 top</span>
              <div className="w-1 h-1 rounded-full bg-primary/50" />
              <span>All rights reserved</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-lg",
                  "bg-background/50 backdrop-blur-xl",
                  "border border-border/50",
                  "text-muted-foreground",
                  "hover:text-foreground hover:border-primary/50",
                  "transition-colors duration-300"
                )}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "p-2 rounded-lg",
                  "bg-background/50 backdrop-blur-xl",
                  "border border-border/50",
                  "text-muted-foreground",
                  "hover:text-foreground hover:border-primary/50",
                  "transition-colors duration-300"
                )}
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 