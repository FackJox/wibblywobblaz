"use client"

import * as React from "react"
import { useTextReveal } from "../../hooks/use-text-reveal"

interface TextRevealComponentProps {
  text: string
  config: {
    animation: 'typewriter' | 'fadeIn' | 'slideUp' | 'wave'
    duration: number
    characterDelay: number
    useSimpleChars: boolean
  }
  delay: number
  className?: string
}

/**
 * The actual text reveal implementation that gets lazy loaded
 */
export default function TextRevealComponent({ 
  text, 
  config, 
  delay, 
  className 
}: TextRevealComponentProps) {
  const elementRef = React.useRef<HTMLSpanElement>(null)
  
  const { animatedText, isComplete, restart } = useTextReveal(text, {
    animation: config.animation,
    duration: config.duration,
    characterDelay: config.characterDelay,
    delay: delay,
    // Optimization: use simpler character processing on low-end devices
    splitByWords: config.useSimpleChars
  })

  return (
    <span ref={elementRef} className={className}>
      {animatedText}
    </span>
  )
}