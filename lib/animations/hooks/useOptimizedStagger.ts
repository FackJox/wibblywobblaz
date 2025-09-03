'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useReducedMotion } from './useReducedMotion'

interface UseOptimizedStaggerOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  maxElements?: number
  throttleMs?: number
}

export const useOptimizedStagger = ({
  threshold = 0.1,
  rootMargin = '50px 0px', // Pre-load elements before they're visible
  triggerOnce = true,
  maxElements = 20, // Limit simultaneous animations
  throttleMs = 16 // ~60fps
}: UseOptimizedStaggerOptions = {}) => {
  const [visibleElements, setVisibleElements] = useState<Set<Element>>(new Set())
  const [animatedElements, setAnimatedElements] = useState<Set<Element>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null)
  const shouldReduceMotion = useReducedMotion()

  const throttledUpdate = useCallback((entries: IntersectionObserverEntry[]) => {
    if (throttleTimeout.current) return
    
    throttleTimeout.current = setTimeout(() => {
      throttleTimeout.current = null
      
      const newVisible = new Set(visibleElements)
      const newAnimated = new Set(animatedElements)
      
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Limit number of simultaneous animations
          if (newVisible.size >= maxElements) return
          
          newVisible.add(entry.target)
          if (triggerOnce) {
            newAnimated.add(entry.target)
          }
        } else if (!triggerOnce && !newAnimated.has(entry.target)) {
          newVisible.delete(entry.target)
        }
      })
      
      setVisibleElements(newVisible)
      setAnimatedElements(newAnimated)
    }, throttleMs)
  }, [visibleElements, animatedElements, triggerOnce, maxElements, throttleMs])

  useEffect(() => {
    if (shouldReduceMotion) return

    observerRef.current = new IntersectionObserver(
      throttledUpdate,
      { threshold, rootMargin }
    )

    return () => {
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current)
      }
      observerRef.current?.disconnect()
    }
  }, [threshold, rootMargin, throttledUpdate, shouldReduceMotion])

  const observe = useCallback((element: Element | null) => {
    if (!element || shouldReduceMotion) return
    observerRef.current?.observe(element)
  }, [shouldReduceMotion])

  const unobserve = useCallback((element: Element | null) => {
    if (!element) return
    observerRef.current?.unobserve(element)
    
    setVisibleElements(prev => {
      const next = new Set(prev)
      next.delete(element)
      return next
    })
  }, [])

  const isInView = useCallback((element: Element | null) => {
    if (!element || shouldReduceMotion) return true
    return visibleElements.has(element)
  }, [visibleElements, shouldReduceMotion])

  return {
    observe,
    unobserve,
    isInView,
    shouldReduceMotion
  }
}