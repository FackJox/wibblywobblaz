'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
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
  viewport = { once: true, amount: 0.1, margin: "-50px" },
  debugId = 'unknown'
}) => {
  const mountTime = useRef(Date.now())
  const animationCount = useRef(0)

  useEffect(() => {
    console.log(`[StaggerReveal ${debugId}] MOUNTED at ${new Date(mountTime.current).toISOString()}`)
    
    return () => {
      console.log(`[StaggerReveal ${debugId}] UNMOUNTED after ${Date.now() - mountTime.current}ms`)
    }
  }, [debugId])
  const shouldReduceMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (shouldReduceMotion) {
    return (
      <div className={className}>
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

  if (React.Children.count(children) === 1) {
    return (
      <motion.div
        className={className}
        variants={itemVars}
        initial={initial}
        whileInView="visible"
        viewport={viewport}
        onAnimationStart={() => {
          animationCount.current++
          console.log(`[StaggerReveal ${debugId}] SINGLE ANIMATION START #${animationCount.current}`, {
            timestamp: new Date().toISOString(),
            timeSinceMount: Date.now() - mountTime.current + 'ms'
          })
        }}
        onViewportEnter={() => {
          console.log(`[StaggerReveal ${debugId}] SINGLE VIEWPORT ENTER`, {
            timestamp: new Date().toISOString(),
            timeSinceMount: Date.now() - mountTime.current + 'ms'
          })
        }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={className}
      variants={updatedContainerVariants}
      initial={initial}
      whileInView="visible"
      viewport={viewport}
      onAnimationStart={() => {
        animationCount.current++
        console.log(`[StaggerReveal ${debugId}] MULTI ANIMATION START #${animationCount.current}`, {
          timestamp: new Date().toISOString(),
          timeSinceMount: Date.now() - mountTime.current + 'ms'
        })
      }}
      onViewportEnter={() => {
        console.log(`[StaggerReveal ${debugId}] MULTI VIEWPORT ENTER`, {
          timestamp: new Date().toISOString(),
          timeSinceMount: Date.now() - mountTime.current + 'ms'
        })
      }}
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