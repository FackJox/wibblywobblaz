"use client";

import { useReducedMotion } from "./useReducedMotion";
import { ANIMATION_TOKENS } from "../constants";
import { AnimationControls, useAnimationControls } from "framer-motion";
import { useEffect, useMemo } from "react";

interface UseAnimationOptions {
  skipAnimation?: boolean;
  respectReducedMotion?: boolean;
  duration?: keyof typeof ANIMATION_TOKENS.duration | number;
  easing?: keyof typeof ANIMATION_TOKENS.easing | number[];
}

export function useAnimation({
  skipAnimation = false,
  respectReducedMotion = true,
  duration = "normal",
  easing = "smooth",
}: UseAnimationOptions = {}) {
  const prefersReducedMotion = useReducedMotion();
  const controls = useAnimationControls();
  
  const shouldAnimate = useMemo(() => {
    if (skipAnimation) return false;
    if (respectReducedMotion && prefersReducedMotion) return false;
    return true;
  }, [skipAnimation, respectReducedMotion, prefersReducedMotion]);

  const animationDuration = useMemo(() => {
    if (!shouldAnimate) return 0;
    if (typeof duration === "number") return duration;
    return ANIMATION_TOKENS.duration[duration];
  }, [duration, shouldAnimate]);

  const animationEasing = useMemo(() => {
    if (Array.isArray(easing)) return easing;
    return ANIMATION_TOKENS.easing[easing as keyof typeof ANIMATION_TOKENS.easing];
  }, [easing]);

  const getAnimationProps = useMemo(() => {
    return (customProps = {}) => {
      if (!shouldAnimate) {
        return {
          initial: false,
          animate: false,
          exit: false,
          transition: { duration: 0 },
        };
      }

      return {
        animate: controls,
        transition: {
          duration: animationDuration,
          ease: animationEasing,
          ...customProps,
        },
      };
    };
  }, [shouldAnimate, controls, animationDuration, animationEasing]);

  return {
    controls,
    shouldAnimate,
    duration: animationDuration,
    easing: animationEasing,
    getAnimationProps,
  };
}