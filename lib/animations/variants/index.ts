import { Variants } from "framer-motion";
import { ANIMATION_TOKENS } from "../constants";

export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.normal,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.fast,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
};

export const slideVariants: Variants = {
  hidden: {
    x: -20,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.normal,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.fast,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
};

export const scaleVariants: Variants = {
  hidden: {
    scale: ANIMATION_TOKENS.scale.shrink,
    opacity: 0,
  },
  visible: {
    scale: ANIMATION_TOKENS.scale.normal,
    opacity: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.normal,
      ease: ANIMATION_TOKENS.easing.bounce,
    },
  },
  exit: {
    scale: ANIMATION_TOKENS.scale.shrink,
    opacity: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.fast,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
};

export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.normal,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
};

export const rotateVariants: Variants = {
  hidden: {
    rotate: -180,
    opacity: 0,
  },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.slow,
      ease: ANIMATION_TOKENS.easing.elastic,
    },
  },
  exit: {
    rotate: 180,
    opacity: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.normal,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
};

export const blurVariants: Variants = {
  hidden: {
    filter: "blur(10px)",
    opacity: 0,
  },
  visible: {
    filter: "blur(0px)",
    opacity: 1,
    transition: {
      duration: ANIMATION_TOKENS.duration.normal,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
  exit: {
    filter: "blur(10px)",
    opacity: 0,
    transition: {
      duration: ANIMATION_TOKENS.duration.fast,
      ease: ANIMATION_TOKENS.easing.smooth,
    },
  },
};