'use client'

import { cn } from '@repo/design-system'
import { motion } from 'framer-motion'

interface HeroProps {
  title: string
  subtitle: string
  gradient?: string
  className?: string
  children?: React.ReactNode
}

export function Hero({ 
  title, 
  subtitle, 
  gradient = 'from-primary/20 via-muted/20 to-background/20',
  className,
  children 
}: HeroProps) {
  return (
    <div className={cn(
      'relative min-h-[70vh] flex flex-col items-center justify-center px-6 overflow-hidden',
      className
    )}>
      {/* Animated gradient background */}
      <div 
        className={cn(
          'absolute inset-0 bg-gradient-to-r opacity-50',
          gradient
        )}
        style={{
          maskImage: 'radial-gradient(circle at center, black, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(circle at center, black, transparent 80%)'
        }}
      />
      
      {/* Floating grid backdrop */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"
        style={{
          transform: 'perspective(500px) rotateX(30deg) translateY(-50px)',
          maskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 30%, black 70%, transparent)'
        }}
      />

      <motion.div
        className="relative space-y-6 text-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight md:leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground font-light">
          {subtitle}
        </p>

        {children}
      </motion.div>

      {/* Decorative glow */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </div>
  )
} 