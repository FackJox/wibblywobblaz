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
  const parallax = useParallax<HTMLDivElement>({
    speed: config.speed,
    direction: config.direction,
    threshold: config.threshold,
    rootMargin: config.rootMargin,
    throttleMs: config.throttleMs
  })

  return (
    <div ref={parallax.ref} style={parallax.styles}>
      {children}
    </div>
  )
}