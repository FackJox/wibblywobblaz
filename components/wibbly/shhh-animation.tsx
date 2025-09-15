"use client";

import React from "react";
import Image from "next/image";
import { css, cx } from "@/styled-system/css";

export interface ShhhAnimationProps {
  /** Current animation state */
  state: "hidden" | "animating" | "visible";
  /** Callback when animation starts */
  onAnimationStart?: () => void;
  /** Callback when animation completes */
  onAnimationEnd?: () => void;
  /** Callback when Instagram should open */
  onInstagramOpen?: () => void;
  /** Custom className for the container */
  className?: string;
}

/**
 * ShhhAnimation - A reusable animated SVG overlay component
 * 
 * Features:
 * - Slide-up bounce animation with Instagram opening
 * - Accessibility support with live region announcements
 * - Reduced motion support for accessibility
 * - GPU-accelerated animation with proper cleanup
 * - Z-index and overlay positioning
 */
export const ShhhAnimation: React.FC<ShhhAnimationProps> = ({
  state,
  onAnimationStart,
  onAnimationEnd,
  onInstagramOpen,
  className,
}) => {
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === "slideUpBounce") {
      onAnimationEnd?.();
      onInstagramOpen?.();
    }
  };

  const handleAnimationStart = () => {
    onAnimationStart?.();
  };

  React.useEffect(() => {
    if (state === "animating") {
      handleAnimationStart();
    }
  }, [state]);

  return (
    <>
      {/* Accessibility live region for animation announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className={css({ srOnly: true })}
      >
        {state === "animating" && "Animation started, opening Instagram..."}
        {state === "visible" && "Animation completed, Instagram opening in new tab"}
      </div>

      {/* Shhh SVG Animation Overlay */}
      <div
        role="img"
        aria-label="Shhh character animation"
        aria-hidden={state === "hidden"}
        className={cx(
          css({
            position: 'absolute',
            inset: '0',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'center',
            willChange: 'transform',
            zIndex: '50',
            pointerEvents: 'none'
          }),
          state === "animating" ? css({ 
            animation: 'slideUpBounce 900ms cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'fadeInReduced 400ms ease-out forwards'
            }
          }) : "",
          className
        )}
        style={{
          transform:
            state === "animating" || state === "visible"
              ? "translateY(0)"
              : "translateY(100vh)",
          transition: state === "animating" ? "none" : "transform 600ms ease-in-out",
          opacity:
            state === "animating" || state === "visible" ? 1 : 0,
        }}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className={css({ 
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%) translateZ(0)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          width: 'auto',
          height: 'auto',
          backfaceVisibility: 'hidden',
          perspective: '1000px'
        })}>
          <Image
            src="/images/shhh.svg"
            alt="Shhh"
            width={1024}
            height={1024}
            className={css({ 
              width: 'auto', 
              height: 'auto', 
              objectFit: 'contain' 
            })}
            priority
          />
        </div>
      </div>
    </>
  );
};