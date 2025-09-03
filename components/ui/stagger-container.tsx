'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { useStaggeredReveal } from '@/lib/animations/hooks/useStaggeredReveal'

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  containerVariants?: Variants
  itemVariants?: Variants
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
}

const defaultItemVariants: Variants = {
  hidden: { 
    y: 20, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12
    }
  }
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 0.1,
  className = '',
  threshold = 0.1,
  rootMargin = '-50px',
  triggerOnce = true,
  containerVariants = defaultContainerVariants,
  itemVariants = defaultItemVariants
}) => {
  const { ref, isInView } = useStaggeredReveal({ threshold, rootMargin, triggerOnce })
  
  const shouldReduceMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (shouldReduceMotion) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
        {children}
      </div>
    )
  }

  const updatedContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...containerVariants.visible?.transition,
        staggerChildren: staggerDelay
      }
    }
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      variants={updatedContainerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          custom={index}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}