"use client"

import { useEffect, useRef, useState, RefObject } from 'react'

interface UseIntersectionAnimationResult<T extends HTMLElement> {
  ref: RefObject<T | null>
  isVisible: boolean
}

export function useIntersectionAnimation<T extends HTMLElement>(): UseIntersectionAnimationResult<T> {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return { ref, isVisible }
} 