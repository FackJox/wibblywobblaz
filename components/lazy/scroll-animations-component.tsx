"use client"

import * as React from "react"
import { useScrollProgress } from "../../hooks/use-scroll-animations"

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
  const scrollProgress = useScrollProgress<HTMLDivElement>()
  
  // Calculate styles based on scroll progress and animations
  const animatedStyles = React.useMemo(() => {
    const styles: React.CSSProperties = {}
    
    animations.forEach(animation => {
      if (animation.trigger === 'progress') {
        const progress = scrollProgress.scrollProgress
        Object.entries(animation.properties).forEach(([prop, value]: [string, any]) => {
          if (typeof value === 'object' && value.from !== undefined && value.to !== undefined) {
            const interpolated = value.from + (value.to - value.from) * progress
            // @ts-ignore - dynamic style assignment
            styles[prop] = interpolated
          }
        })
      }
    })
    
    return styles
  }, [animations, scrollProgress.scrollProgress])

  return (
    <div ref={scrollProgress.ref} style={animatedStyles}>
      {children}
    </div>
  )
}