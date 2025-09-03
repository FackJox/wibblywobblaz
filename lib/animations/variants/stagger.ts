import { Variants } from 'framer-motion'

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
}

export const staggerItemVariants: Variants = {
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

export const fadeUpVariants: Variants = {
  hidden: { 
    y: 30, 
    opacity: 0 
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
}

export const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
}

export const scaleUpVariants: Variants = {
  hidden: { 
    scale: 0.95,
    opacity: 0 
  },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut'
    }
  }
}

export const slideInLeftVariants: Variants = {
  hidden: { 
    x: -50, 
    opacity: 0 
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15
    }
  }
}

export const slideInRightVariants: Variants = {
  hidden: { 
    x: 50, 
    opacity: 0 
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15
    }
  }
}

export const sectionVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
}