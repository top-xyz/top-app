'use client'

import { cn } from '@repo/design-system/lib/utils'
import { useEffect, useRef } from 'react'

// Expanded tech stack to showcase our universal capabilities
const techStack = [
  // Frontend Frameworks
  { name: 'React', icon: '⚛️', category: 'frontend', glow: 'blue' },
  { name: 'Vue', icon: '🟢', category: 'frontend', glow: 'green' },
  { name: 'Svelte', icon: '🟠', category: 'frontend', glow: 'orange' },
  { name: 'Solid', icon: '💠', category: 'frontend', glow: 'blue' },
  
  // Backend
  { name: 'Node.js', icon: '💚', category: 'backend', glow: 'green' },
  { name: 'Rust', icon: '🦀', category: 'backend', glow: 'orange' },
  { name: 'Go', icon: '🔵', category: 'backend', glow: 'blue' },
  { name: 'Python', icon: '🐍', category: 'backend', glow: 'yellow' },
  
  // Frameworks
  { name: 'Next.js', icon: '▲', category: 'framework', glow: 'white' },
  { name: 'Nuxt', icon: '💚', category: 'framework', glow: 'green' },
  { name: 'Astro', icon: '🚀', category: 'framework', glow: 'purple' },
  { name: 'Remix', icon: '💿', category: 'framework', glow: 'blue' },
  
  // Languages
  { name: 'TypeScript', icon: '📘', category: 'language', glow: 'blue' },
  { name: 'JavaScript', icon: '💛', category: 'language', glow: 'yellow' },
  { name: 'Python', icon: '🐍', category: 'language', glow: 'blue' },
  { name: 'Rust', icon: '🦀', category: 'language', glow: 'orange' },
  
  // Databases
  { name: 'Prisma', icon: '💎', category: 'database', glow: 'blue' },
  { name: 'MongoDB', icon: '🍃', category: 'database', glow: 'green' },
  { name: 'PostgreSQL', icon: '🐘', category: 'database', glow: 'blue' },
  { name: 'Neon', icon: '⚡', category: 'database', glow: 'purple' },
  
  // Tools & Services
  { name: 'Vercel', icon: '△', category: 'deployment', glow: 'white' },
  { name: 'Docker', icon: '🐋', category: 'deployment', glow: 'blue' },
  { name: 'AWS', icon: '☁️', category: 'cloud', glow: 'orange' },
  { name: 'GitHub', icon: '🐱', category: 'vcs', glow: 'purple' },
  
  // UI & Design
  { name: 'Tailwind', icon: '🎨', category: 'styling', glow: 'blue' },
  { name: 'Radix UI', icon: '⚫', category: 'components', glow: 'violet' },
  { name: 'Framer', icon: '🎭', category: 'design', glow: 'purple' },
  { name: 'Figma', icon: '🎨', category: 'design', glow: 'purple' },
  
  // Testing & Quality
  { name: 'Jest', icon: '🃏', category: 'testing', glow: 'red' },
  { name: 'Cypress', icon: '⚗️', category: 'testing', glow: 'green' },
  { name: 'Playwright', icon: '🎭', category: 'testing', glow: 'purple' },
  
  // APIs & Integration
  { name: 'tRPC', icon: '🔷', category: 'api', glow: 'blue' },
  { name: 'GraphQL', icon: '⬡', category: 'api', glow: 'pink' },
  { name: 'REST', icon: '🔄', category: 'api', glow: 'green' },
  
  // Auth & Security
  { name: 'Clerk', icon: '🔐', category: 'auth', glow: 'violet' },
  { name: 'Auth.js', icon: '🔒', category: 'auth', glow: 'blue' },
  { name: 'JWT', icon: '🎟️', category: 'auth', glow: 'yellow' },
  
  // Validation & Type Safety
  { name: 'Zod', icon: '✨', category: 'validation', glow: 'blue' },
  { name: 'Yup', icon: '✅', category: 'validation', glow: 'green' },
  
  // UI Enhancement
  { name: 'CMDK', icon: '⌘', category: 'ui', glow: 'white' },
  { name: 'Lucide', icon: '🎯', category: 'icons', glow: 'blue' },
  
  // Payment & Business
  { name: 'Stripe', icon: '💳', category: 'payments', glow: 'purple' },
]

// Enhanced animation keyframes for more subtle and professional motion
const floatingKeyframes = `
@keyframes float {
  0%, 100% {
    transform: translate3d(0, 0, 0) rotate(0deg);
  }
  25% {
    transform: translate3d(5px, -5px, 10px) rotate(0.5deg);
  }
  50% {
    transform: translate3d(-3px, -8px, -5px) rotate(-0.5deg);
  }
  75% {
    transform: translate3d(-5px, -3px, 8px) rotate(0.25deg);
  }
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 0.9; }
}

@keyframes glow {
  0%, 100% { filter: brightness(1) blur(0px); }
  50% { filter: brightness(1.2) blur(1px); }
}
`

export function TechBubbles() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Add keyframe styles
    const styleSheet = document.createElement('style')
    styleSheet.textContent = floatingKeyframes
    document.head.appendChild(styleSheet)

    // Create floating bubbles with improved positioning and animation
    const bubbles = techStack.map((tech, index) => {
      const bubble = document.createElement('div')
      bubble.className = cn(
        'absolute flex items-center gap-2 px-3 py-1.5 rounded-full',
        'bg-background/30 backdrop-blur-sm border border-border/20',
        'shadow-[0_0_15px_rgba(0,0,0,0.1)]',
        'transition-all duration-500 ease-out',
        'cursor-default select-none'
      )

      bubble.innerHTML = `
        <span class="text-base">${tech.icon}</span>
        <span class="text-sm font-medium">${tech.name}</span>
      `

      // Create a more organic, spherical distribution pattern
      const phi = Math.acos(-1 + (2 * index) / techStack.length)
      const theta = Math.sqrt(techStack.length * Math.PI) * phi

      const radius = 250 // Increased radius for more spread
      const x = radius * Math.cos(theta) * Math.sin(phi)
      const y = radius * Math.sin(theta) * Math.sin(phi)
      const z = radius * Math.cos(phi)

      // Position with 3D transform
      bubble.style.left = `${container.clientWidth / 2 + x}px`
      bubble.style.top = `${container.clientHeight / 2 + y}px`
      bubble.style.transform = `translate3d(0, 0, ${z}px)`
      
      // Add glow effect based on category
      bubble.style.boxShadow = `0 0 20px rgba(var(--${tech.glow}-rgb, 255, 255, 255), 0.1)`

      // Add smooth animations with varying speeds and delays
      const floatDuration = 15 + Math.random() * 10
      const fadeInDuration = 8 + Math.random() * 6
      const glowDuration = 4 + Math.random() * 3
      
      bubble.style.animation = `
        float ${floatDuration}s infinite ease-in-out,
        fadeInOut ${fadeInDuration}s infinite ease-in-out,
        glow ${glowDuration}s infinite ease-in-out
      `
      bubble.style.animationDelay = `${-index * 0.2}s, ${-index * 0.3}s, ${-index * 0.1}s`

      // Enhanced hover effect with glow
      bubble.addEventListener('mouseenter', () => {
        bubble.style.transform = `translate3d(0, -5px, ${z + 10}px) scale(1.05)`
        bubble.style.boxShadow = `0 0 30px rgba(var(--${tech.glow}-rgb, 255, 255, 255), 0.2)`
        bubble.style.backgroundColor = 'rgba(var(--background-rgb), 0.4)'
      })

      bubble.addEventListener('mouseleave', () => {
        bubble.style.transform = `translate3d(0, 0, ${z}px) scale(1)`
        bubble.style.boxShadow = `0 0 20px rgba(var(--${tech.glow}-rgb, 255, 255, 255), 0.1)`
        bubble.style.backgroundColor = 'rgba(var(--background-rgb), 0.3)'
      })

      return bubble
    })

    // Add bubbles to container
    bubbles.forEach(bubble => container.appendChild(bubble))

    return () => {
      styleSheet.remove()
      bubbles.forEach(bubble => bubble.remove())
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[600px] overflow-hidden perspective-[1000px]"
      aria-label="Universal technology stack showcase"
    />
  )
} 