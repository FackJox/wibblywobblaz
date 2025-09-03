'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useStaggeredReveal } from '@/lib/animations/hooks/useStaggeredReveal'
import { StaggeredRevealProps, StaggerDirection } from '@/lib/animations/types/stagger.types'
import {
  staggerContainerVariants,
  staggerItemVariants,
  fadeUpVariants,
  slideInLeftVariants,
  slideInRightVariants
} from '@/lib/animations/variants/stagger'

const getDirectionVariants = (direction: StaggerDirection) => {
  switch (direction) {
    case 'left':
      return slideInLeftVariants
    case 'right':
      return slideInRightVariants
    case 'up':
    default:
      return fadeUpVariants
  }
}

export const StaggerReveal: React.FC<StaggeredRevealProps> = ({
  children,
  className = '',
  stagger = {},
  reveal = {},
  direction = 'up',
  variants,
  initial = 'hidden',
  animate,
  whileInView,
  viewport = { once: true, amount: 0.3 }
}) => {
  const {
    threshold = 0.1,
    rootMargin = '-50px',
    triggerOnce = true
  } = reveal

  const { ref, isInView } = useStaggeredReveal({ 
    threshold, 
    rootMargin, 
    triggerOnce 
  })

  const shouldReduceMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (shouldReduceMotion) {
    return (
      <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
        {children}
      </div>
    )
  }

  const containerVars = variants || staggerContainerVariants
  const itemVars = direction === 'none' ? staggerItemVariants : getDirectionVariants(direction)
  
  const updatedContainerVariants = {
    ...containerVars,
    visible: {
      ...containerVars.visible,
      transition: {
        staggerChildren: stagger.staggerChildren || 0.1,
        delayChildren: stagger.delayChildren || 0.05,
        ...containerVars.visible?.transition
      }
    }
  }

  const animateState = animate || (isInView ? 'visible' : initial)

  if (React.Children.count(children) === 1) {
    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={className}
        variants={itemVars}
        initial={initial}
        animate={animateState}
        whileInView={whileInView}
        viewport={viewport}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      variants={updatedContainerVariants}
      initial={initial}
      animate={animateState}
      whileInView={whileInView}
      viewport={viewport}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVars}
          custom={index}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}