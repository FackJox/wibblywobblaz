import { Variants } from 'framer-motion'

export interface StaggerConfig {
  delay?: number
  duration?: number
  staggerChildren?: number
  delayChildren?: number
  ease?: string | number[]
}

export interface RevealConfig {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  amount?: number | 'some' | 'all'
}

export interface AnimationProps {
  variants?: Variants
  initial?: string
  animate?: string
  exit?: string
  whileInView?: string
  viewport?: {
    once?: boolean
    amount?: number | 'some' | 'all'
    margin?: string
  }
}

export type StaggerDirection = 'up' | 'down' | 'left' | 'right' | 'none'

export interface StaggeredRevealProps extends AnimationProps {
  children: React.ReactNode
  className?: string
  stagger?: StaggerConfig
  reveal?: RevealConfig
  direction?: StaggerDirection
}