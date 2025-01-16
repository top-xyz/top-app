"use client"

import { cn } from '@repo/design-system/lib/utils'
import { useEffect, useRef } from 'react'

interface StarryBackgroundProps {
  className?: string
  density?: number
  speed?: number
  starSize?: number
  starColor?: string
  glowColor?: string
  glowIntensity?: number
}

export function StarryBackground({
  className,
  density = 50,
  speed = 1,
  starSize = 2,
  starColor = "rgba(255, 255, 255, 0.8)",
  glowColor = "rgba(120, 120, 255, 0.15)",
  glowIntensity = 30,
}: StarryBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const starsRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number }[]>([])
  const frameRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    contextRef.current = context

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      starsRef.current = Array.from({ length: density }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * starSize + 1,
      }))
    }

    const animate = () => {
      if (!context || !canvas) return

      context.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw stars
      starsRef.current.forEach(star => {
        // Update position
        star.x += star.vx
        star.y += star.vy

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0

        // Draw star
        context.beginPath()
        context.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        context.fillStyle = starColor
        context.fill()

        // Add glow effect
        const gradient = context.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * glowIntensity
        )
        gradient.addColorStop(0, glowColor)
        gradient.addColorStop(1, 'transparent')

        context.beginPath()
        context.arc(star.x, star.y, star.size * glowIntensity, 0, Math.PI * 2)
        context.fillStyle = gradient
        context.fill()
      })

      frameRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [density, speed, starSize, starColor, glowColor, glowIntensity])

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(10,10,30,0.4) 0%, transparent 70%)'
        }}
      />
    </div>
  )
} 