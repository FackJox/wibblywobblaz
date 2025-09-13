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
  
  const textReveal = useTextReveal<HTMLSpanElement>({
    type: config.animation === 'typewriter' ? 'fade' : 'slide',
    by: config.useSimpleChars ? 'word' : 'character',
    stagger: config.characterDelay,
    duration: config.duration,
    triggerOn: 'manual',
    preserveContent: true
  })

  // Set the text content and trigger reveal after delay
  React.useEffect(() => {
    if (elementRef.current) {
      elementRef.current.textContent = text
      
      const timer = setTimeout(() => {
        textReveal.reveal()
      }, delay)
      
      return () => clearTimeout(timer)
    }
  }, [text, delay, textReveal])

  return (
    <span ref={(el) => {
      if (elementRef.current !== el) {
        elementRef.current = el
        if (textReveal.ref) {
          (textReveal.ref as React.MutableRefObject<HTMLSpanElement | null>).current = el
        }
      }
    }} className={className}>
      {text}
    </span>
  )
}