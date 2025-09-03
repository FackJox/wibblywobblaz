export const ANIMATION_TOKENS = {
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 0.8,
  },
  easing: {
    smooth: [0.4, 0, 0.2, 1] as const,
    bounce: [0.68, -0.55, 0.265, 1.55] as const,
    elastic: [0.5, 1.5, 0.4, 1] as const,
    linear: [0, 0, 1, 1] as const,
    easeIn: [0.4, 0, 1, 1] as const,
    easeOut: [0, 0, 0.2, 1] as const,
    easeInOut: [0.4, 0, 0.2, 1] as const,
  },
  spring: {
    smooth: {
      type: "spring" as const,
      stiffness: 120,
      damping: 14,
      mass: 1,
    },
    bouncy: {
      type: "spring" as const,
      stiffness: 300,
      damping: 10,
      mass: 0.8,
    },
    stiff: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
    slow: {
      type: "spring" as const,
      stiffness: 60,
      damping: 20,
      mass: 1,
    },
  },
  scale: {
    shrink: 0.95,
    normal: 1,
    grow: 1.05,
    expand: 1.1,
  },
} as const;

export const PERFORMANCE_THRESHOLDS = {
  fps: {
    target: 60,
    warning: 45,
    critical: 30,
  },
  animationDuration: {
    max: 1000,
    warning: 800,
  },
} as const;