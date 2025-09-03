"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "./button";
import { useAnimation, fadeVariants, ANIMATION_TOKENS } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  animationVariant?: "fade" | "scale" | "slide";
  animationDuration?: keyof typeof ANIMATION_TOKENS.duration;
  whileHover?: boolean;
  whileTap?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    animationVariant = "fade",
    animationDuration = "fast",
    whileHover = true,
    whileTap = true,
    children,
    ...props 
  }, ref) => {
    const { shouldAnimate, getAnimationProps } = useAnimation({
      duration: animationDuration,
      respectReducedMotion: true,
    });

    const hoverAnimation = whileHover && shouldAnimate ? {
      scale: ANIMATION_TOKENS.scale.grow,
      transition: {
        duration: ANIMATION_TOKENS.duration.fast,
        ease: ANIMATION_TOKENS.easing.smooth,
      },
    } : {};

    const tapAnimation = whileTap && shouldAnimate ? {
      scale: ANIMATION_TOKENS.scale.shrink,
      transition: {
        duration: ANIMATION_TOKENS.duration.instant,
        ease: ANIMATION_TOKENS.easing.smooth,
      },
    } : {};

    if (!shouldAnimate) {
      return (
        <Button ref={ref} className={className} {...props}>
          {children}
        </Button>
      );
    }

    return (
      <motion.div
        variants={fadeVariants}
        initial="hidden"
        animate="visible"
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        className="inline-block"
      >
        <Button ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };