"use client"

import { Command, Sparkles } from 'lucide-react'
import { buttonVariants } from '@repo/design-system/components/ui/button'
import { cn } from '@repo/design-system/lib/utils'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'

export function DownloadCTA() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
      <div className={cn(
        "absolute inset-0 bg-grid-white/[0.02]",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      )} />

      <div className="max-w-6xl mx-auto">
        <div className={cn(
          "relative p-12 rounded-2xl overflow-hidden text-center",
          "bg-background/50 backdrop-blur-xl",
          "border border-border/50",
          "shadow-glow-subtle",
          "group"
        )}>
          {/* Graph Paper Background */}
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

          {/* Content */}
          <div className="relative z-10 space-y-12">
            {/* Header */}
            <div className={cn(
              "max-w-2xl mx-auto space-y-4",
              "transform transition-all duration-700",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <h2 className={cn(
                "text-4xl md:text-5xl font-bold",
                "bg-clip-text text-transparent",
                "bg-gradient-to-b from-foreground to-foreground/70"
              )}>
                Take the short way
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the future of software development. Available as a web app and CLI.
              </p>
            </div>

            {/* Keyboard Visual */}
            <div className={cn(
              "relative max-w-3xl mx-auto aspect-[2/1]",
              "transform transition-all duration-700 delay-200",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <div className={cn(
                "absolute inset-0 rounded-xl overflow-hidden",
                "bg-black/40 backdrop-blur-xl",
                "border border-white/10",
                "shadow-2xl"
              )}>
                {/* Command Key */}
                <div className={cn(
                  "absolute left-1/2 bottom-8 -translate-x-1/2",
                  "w-32 h-8 rounded-md",
                  "bg-white/5 backdrop-blur-sm",
                  "border border-white/10",
                  "flex items-center justify-center gap-2",
                  "text-sm text-white/40",
                  "group-hover:text-white/60 group-hover:border-white/20",
                  "transition-all duration-500"
                )}>
                  <Command className="w-4 h-4" />
                  <span>command</span>
                </div>

                {/* Glow Effect */}
                <div className={cn(
                  "absolute inset-0",
                  "bg-gradient-to-t from-primary/10 via-transparent to-transparent",
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
            </div>

            {/* CTA Buttons */}
            <div className={cn(
              "flex flex-col sm:flex-row items-center justify-center gap-4",
              "transform transition-all duration-700 delay-400",
              isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <Link
                href="/beta"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "group/btn relative overflow-hidden"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Apply for Beta Access
                </span>
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r from-primary/50 to-primary",
                  "opacity-0 group-hover/btn:opacity-100",
                  "transition-opacity duration-300",
                  "transform group-hover/btn:scale-110",
                  "group-hover/btn:rotate-2",
                  "transition-transform duration-500"
                )} />
              </Link>

              <Link
                href="https://docs.top.app"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "group/docs"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Read the Docs
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 