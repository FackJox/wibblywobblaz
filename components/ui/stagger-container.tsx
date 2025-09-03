'use client'

import React, { useEffect, useRef } from 'react'
import { motion, Variants } from 'framer-motion'

interface StaggerContainerProps {
  children: React.ReactNode
  staggerDelay?: number
  className?: string
  threshold?: number
  triggerOnce?: boolean
  containerVariants?: Variants
  itemVariants?: Variants
  debugId?: string // Add debug identifier
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
  triggerOnce = true,
  containerVariants = defaultContainerVariants,
  itemVariants = defaultItemVariants,
  debugId = 'unknown'
}) => {
  const mountTime = useRef(Date.now())
  const animationCount = useRef(0)

  useEffect(() => {
    console.log(`[StaggerContainer ${debugId}] MOUNTED at ${new Date(mountTime.current).toISOString()}`)
    
    return () => {
      console.log(`[StaggerContainer ${debugId}] UNMOUNTED after ${Date.now() - mountTime.current}ms`)
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
      className={className}
      variants={updatedContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ 
        once: triggerOnce,
        amount: threshold,
        margin: "-50px"
      }}
      onAnimationStart={(definition) => {
        animationCount.current++
        console.log(`[StaggerContainer ${debugId}] ANIMATION START #${animationCount.current}`, {
          definition,
          timestamp: new Date().toISOString(),
          timeSinceMount: Date.now() - mountTime.current + 'ms'
        })
      }}
      onAnimationComplete={(definition) => {
        console.log(`[StaggerContainer ${debugId}] ANIMATION COMPLETE #${animationCount.current}`, {
          definition,
          timestamp: new Date().toISOString(),
          timeSinceMount: Date.now() - mountTime.current + 'ms'
        })
      }}
      onViewportEnter={(entry) => {
        console.log(`[StaggerContainer ${debugId}] VIEWPORT ENTER`, {
          timestamp: new Date().toISOString(),
          timeSinceMount: Date.now() - mountTime.current + 'ms',
          entry
        })
      }}
      onViewportLeave={(entry) => {
        console.log(`[StaggerContainer ${debugId}] VIEWPORT LEAVE`, {
          timestamp: new Date().toISOString(),
          timeSinceMount: Date.now() - mountTime.current + 'ms',
          entry
        })
      }}
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