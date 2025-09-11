"use client"

import * as React from "react"
import { useScrollAnimations } from "../../hooks/use-scroll-animations"

interface ScrollAnimationsComponentProps {
  children: React.ReactNode
  animations: Array<{
    trigger: 'enter' | 'exit' | 'progress'
    start?: number
    end?: number
    properties: Record<string, any>
  }>
}

/**
 * The actual scroll animations implementation that gets lazy loaded
 */
export default function ScrollAnimationsComponent({ 
  children, 
  animations 
}: ScrollAnimationsComponentProps) {
  const elementRef = React.useRef<HTMLDivElement>(null)
  
  const { bind, progress } = useScrollAnimations(elementRef, {
    animations: animations.map(anim => ({
      trigger: anim.trigger,
      start: anim.start || 0,
      end: anim.end || 100,
      properties: anim.properties
    }))
  })

  return (
    <div ref={elementRef} {...bind}>
      {children}
    </div>
  )
}