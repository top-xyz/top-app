"use client"

import { ArrowRight, Github, Twitter } from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'
import { useState } from 'react'

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const footerLinks = {
  product: {
    title: "Product",
    links: [
      { label: "Store", href: "#" },
      { label: "Pro", href: "#" },
      { label: "Teams", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "Changelog", href: "#" },
    ] as FooterLink[]
  },
  features: {
    title: "Core Features",
    links: [
      { label: "Context Management", href: "#" },
      { label: "Project Generation", href: "#" },
      { label: "Live Preview", href: "#" },
      { label: "Team Collaboration", href: "#" },
    ] as FooterLink[]
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ] as FooterLink[]
  },
  community: {
    title: "Community",
    links: [
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "Twitter", href: "https://twitter.com", external: true },
      { label: "Discord", href: "https://discord.com", external: true },
    ] as FooterLink[]
  }
}

// Add this new component for the grid backdrop
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
  const [email, setEmail] = useState("")
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubscribeStatus("loading")
    
    // TODO: Implement newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSubscribeStatus("success")
  }

  return (
    <footer className={cn(
      "relative mt-24",
      // Enhanced glass effect
      "before:absolute before:inset-0 before:bg-background/50",
      "before:backdrop-blur-xl before:backdrop-saturate-150",
      "before:border-t before:border-border/50",
      "before:-z-10"
    )}>
      <GridBackdrop />

      {/* Context Banner */}
      <div className={cn(
        "py-12 relative overflow-hidden",
        "border-b border-border/50",
        "bg-gradient-to-b from-transparent to-background/5"
      )}>
        <div className="max-w-6xl mx-auto px-4">
          <div className={cn(
            "text-center font-mono text-4xl md:text-5xl",
            "bg-gradient-to-r from-primary/70 via-primary to-primary/70",
            "bg-clip-text text-transparent",
            "animate-gradient-flow"
          )}>
            context is everything
          </div>
        </div>
      </div>

      {/* Main Footer - Improved Layout */}
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12",
          "relative"
        )}>
          {/* Newsletter Section - Refined Proportions */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4 max-w-md">
              <h3 className={cn(
                "text-lg font-semibold",
                "bg-gradient-to-r from-foreground to-foreground/80",
                "bg-clip-text text-transparent"
              )}>
                Subscribe to our newsletter
              </h3>
              <p className="text-sm text-muted-foreground">
                Get product updates and news in your inbox. No spam.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-4 max-w-md">
              <div className={cn(
                "flex gap-2 p-1 rounded-lg",
                "bg-background/50 backdrop-blur-xl",
                "border border-border/50",
                "shadow-glass",
                "transform-gpu transition-transform hover:scale-[1.01]"
              )}>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "flex-1 px-3 py-2 text-sm",
                    "bg-transparent",
                    "focus:outline-none",
                    "placeholder:text-muted-foreground/50"
                  )}
                  required
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === "loading"}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium",
                    "bg-foreground text-background",
                    "hover:opacity-90 transition-opacity",
                    "flex items-center gap-2 whitespace-nowrap",
                    "disabled:opacity-50"
                  )}
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {subscribeStatus === "success" && (
                <p className="text-sm text-primary animate-fade-in">
                  Thanks for subscribing! Check your inbox to confirm.
                </p>
              )}
              {subscribeStatus === "error" && (
                <p className="text-sm text-destructive animate-fade-in">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          </div>

          {/* Navigation Links - Enhanced */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key} className={cn(
              "space-y-4",
              "transform-gpu transition-transform hover:translate-y-[-2px]"
            )}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={cn(
                        "text-sm text-muted-foreground",
                        "hover:text-foreground transition-colors",
                        "flex items-center gap-2"
                      )}
                    >
                      {link.label}
                      {link.external && (
                        <div className="w-1 h-1 rounded-full bg-primary/50" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar - Enhanced */}
      <div className={cn(
        "border-t border-border/50",
        "bg-background/50 backdrop-blur-xl"
      )}>
        <div className="max-w-6xl mx-auto px-4 py-6">
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
                  "hover:text-foreground hover:border-primary/50 transition-colors",
                  "group"
                )}
              >
                <Github className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
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
                  "hover:text-foreground hover:border-primary/50 transition-colors",
                  "group"
                )}
              >
                <Twitter className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 