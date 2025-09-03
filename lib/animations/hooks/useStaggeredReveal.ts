'use client'

import { useState, useRef, useEffect } from 'react'

interface UseStaggeredRevealOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export const useStaggeredReveal = ({
  threshold = 0.1,
  rootMargin = '-50px',
  triggerOnce = true
}: UseStaggeredRevealOptions = {}) => {
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const shouldAnimate = entry.isIntersecting && (!triggerOnce || !hasAnimated)
        
        if (shouldAnimate) {
          setIsInView(true)
          if (triggerOnce) {
            setHasAnimated(true)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(ref.current)

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, hasAnimated])

  return { ref, isInView, hasAnimated }
}