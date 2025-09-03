import { ANIMATION_TOKENS, PERFORMANCE_THRESHOLDS } from "../constants";

export function getDurationValue(
  duration: keyof typeof ANIMATION_TOKENS.duration | number
): number {
  if (typeof duration === "number") return duration;
  return ANIMATION_TOKENS.duration[duration];
}

export function getEasingValue(
  easing: keyof typeof ANIMATION_TOKENS.easing | number[]
): number[] | readonly number[] {
  if (Array.isArray(easing)) return easing;
  return ANIMATION_TOKENS.easing[easing];
}

export function shouldReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isAnimationPerformant(fps: number): boolean {
  return fps >= PERFORMANCE_THRESHOLDS.fps.warning;
}

export function createAnimationVariant(
  from: Record<string, any>,
  to: Record<string, any>,
  options: {
    duration?: keyof typeof ANIMATION_TOKENS.duration | number;
    easing?: keyof typeof ANIMATION_TOKENS.easing | number[];
    delay?: number;
  } = {}
) {
  const { duration = "normal", easing = "smooth", delay = 0 } = options;

  return {
    hidden: from,
    visible: {
      ...to,
      transition: {
        duration: getDurationValue(duration),
        ease: getEasingValue(easing),
        delay,
      },
    },
  };
}

export function withReducedMotion<T extends Record<string, any>>(
  variants: T,
  reducedVariants?: Partial<T>
): T {
  if (!shouldReduceMotion()) return variants;
  
  return {
    ...variants,
    ...reducedVariants,
    hidden: reducedVariants?.hidden || { opacity: 0 },
    visible: reducedVariants?.visible || { 
      opacity: 1,
      transition: { duration: 0 },
    },
    exit: reducedVariants?.exit || {
      opacity: 0,
      transition: { duration: 0 },
    },
  } as T;
}

export function measureAnimationTime<T>(
  animationFn: () => T | Promise<T>,
  label?: string
): T | Promise<T> {
  const startTime = performance.now();
  const result = animationFn();
  
  if (result instanceof Promise) {
    return result.then((value) => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (duration > PERFORMANCE_THRESHOLDS.animationDuration.warning) {
        console.warn(
          `[Animation Performance] ${label || "Animation"} took ${duration.toFixed(2)}ms`
        );
      }
      
      return value;
    });
  }
  
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration > PERFORMANCE_THRESHOLDS.animationDuration.warning) {
    console.warn(
      `[Animation Performance] ${label || "Animation"} took ${duration.toFixed(2)}ms`
    );
  }
  
  return result;
}