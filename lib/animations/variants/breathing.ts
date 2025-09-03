import { Variants } from "framer-motion";

export const breathingVariants: Variants = {
  logo: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    }
  },
  pulse: {
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    }
  },
  border: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0)",
      "0 0 0 4px rgba(59, 130, 246, 0.3)",
      "0 0 0 0 rgba(59, 130, 246, 0)",
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    }
  },
  glow: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0)",
      "0 0 20px 5px rgba(59, 130, 246, 0.4)",
      "0 0 0 0 rgba(59, 130, 246, 0)",
    ],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    }
  },
  subtle: {
    scale: [1, 1.01, 1],
    opacity: [1, 0.95, 1],
    transition: {
      duration: 3,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    }
  }
};

export const breathingStates = {
  idle: "idle",
  active: "active",
  paused: "paused",
} as const;

export type BreathingState = typeof breathingStates[keyof typeof breathingStates];