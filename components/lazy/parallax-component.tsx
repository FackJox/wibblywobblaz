"use client"

import * as React from "react"
import { useParallax } from "../../hooks/use-parallax"

interface ParallaxComponentProps {
  children: React.ReactNode
  config: {
    speed?: number
    direction?: 'vertical' | 'horizontal' | 'both'
    threshold?: number
    rootMargin?: string
    throttleMs?: number
  }
}

/**
 * The actual parallax implementation that gets lazy loaded
 * This component is only loaded when parallax is needed and enabled
 */
export default function ParallaxComponent({ children, config }: ParallaxComponentProps) {
  const elementRef = React.useRef<HTMLDivElement>(null)
  
  const { bind, progress } = useParallax(elementRef, {
    speed: config.speed,
    direction: config.direction,
    threshold: config.threshold,
    rootMargin: config.rootMargin,
    throttleMs: config.throttleMs
  })

  return (
    <div ref={elementRef} {...bind}>
      {children}
    </div>
  )
}