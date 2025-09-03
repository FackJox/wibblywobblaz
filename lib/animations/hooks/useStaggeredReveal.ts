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
  const observerRef = useRef<IntersectionObserver | null>(null)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    
    // If we've already triggered and triggerOnce is true, don't create observer
    if (triggerOnce && hasTriggeredRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          // Mark as triggered immediately
          hasTriggeredRef.current = true
          setIsInView(true)
          setHasAnimated(true)
          
          // If triggerOnce, immediately disconnect to prevent any retriggering
          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect()
            observerRef.current = null
          }
        } else if (!triggerOnce && !entry.isIntersecting) {
          setIsInView(false)
          hasTriggeredRef.current = false
        }
      },
      { threshold, rootMargin }
    )

    observerRef.current = observer
    observer.observe(ref.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
    }
  }, [threshold, rootMargin, triggerOnce])

  return { ref, isInView, hasAnimated }
}