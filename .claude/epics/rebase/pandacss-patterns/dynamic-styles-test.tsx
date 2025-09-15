/**
 * PandaCSS Dynamic Style Generation Test
 * 
 * This file tests various patterns for generating dynamic styles with PandaCSS,
 * focusing on animation and transition patterns that would replace hooks.
 */

import { css, cx } from "@/styled-system/css";
import { cva } from "@/styled-system/css";
import { useState, useEffect, useRef } from "react";

// Pattern 1: Basic css() function for dynamic inline styles
export function TestDynamicCss() {
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(20);

  useEffect(() => {
    setOpacity(1);
    setTranslateY(0);
  }, []);

  return (
    <div
      className={css({
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: "all 0.3s ease-out",
        padding: "4",
        backgroundColor: "primary",
        color: "primary.foreground",
        borderRadius: "md"
      })}
    >
      Dynamic CSS with runtime values
    </div>
  );
}

// Pattern 2: Using CSS custom properties for dynamic values
export function TestCssVariables() {
  const [progress, setProgress] = useState(0);

  return (
    <div
      className={css({
        // CSS custom properties can be set dynamically
        "--progress": `${progress}%`,
        "--rotation": `${progress * 3.6}deg`,
        width: "20",
        height: "20",
        backgroundColor: "secondary",
        borderRadius: "full",
        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0",
          borderRadius: "full",
          background: `conic-gradient(from 0deg, transparent 0%, primary var(--progress), transparent var(--progress))`,
          transform: "rotate(var(--rotation))"
        }
      })}
      style={{
        // Can also set CSS vars via style prop
        "--progress": `${progress}%`,
        "--rotation": `${progress * 3.6}deg`
      } as React.CSSProperties}
    >
      <button onClick={() => setProgress(p => (p + 10) % 100)}>
        Progress: {progress}%
      </button>
    </div>
  );
}

// Pattern 3: CVA (Class Variance Authority) for state-based styling
const animatedBox = cva({
  base: {
    width: "16",
    height: "16",
    borderRadius: "md",
    transition: "all 0.3s ease-out",
    cursor: "pointer"
  },
  variants: {
    state: {
      idle: {
        backgroundColor: "muted",
        transform: "scale(1) rotate(0deg)"
      },
      hover: {
        backgroundColor: "primary",
        transform: "scale(1.1) rotate(5deg)"
      },
      active: {
        backgroundColor: "destructive",
        transform: "scale(0.95) rotate(-5deg)"
      },
      loading: {
        backgroundColor: "accent",
        transform: "scale(1) rotate(180deg)",
        animation: "spin 1s linear infinite"
      }
    },
    size: {
      sm: { width: "12", height: "12" },
      md: { width: "16", height: "16" },
      lg: { width: "20", height: "20" }
    }
  },
  defaultVariants: {
    state: "idle",
    size: "md"
  }
});

export function TestCvaStates() {
  const [state, setState] = useState<"idle" | "hover" | "active" | "loading">("idle");

  return (
    <div>
      <div
        className={animatedBox({ state, size: "lg" })}
        onMouseEnter={() => setState("hover")}
        onMouseLeave={() => setState("idle")}
        onMouseDown={() => setState("active")}
        onMouseUp={() => setState("hover")}
        onClick={() => setState("loading")}
      />
      <p>Current state: {state}</p>
    </div>
  );
}

// Pattern 4: Dynamic keyframe generation
export function TestDynamicKeyframes() {
  const [amplitude, setAmplitude] = useState(10);
  const [duration, setDuration] = useState(1);

  // Generate keyframes as CSS string for complex animations
  const bounceKeyframes = `
    @keyframes dynamic-bounce-${amplitude} {
      0%, 20%, 53%, 80%, 100% {
        transform: translateY(0px);
      }
      40%, 43% {
        transform: translateY(-${amplitude}px);
      }
      70% {
        transform: translateY(-${amplitude / 2}px);
      }
      90% {
        transform: translateY(-${amplitude / 4}px);
      }
    }
  `;

  useEffect(() => {
    // Inject keyframes into document
    const style = document.createElement('style');
    style.textContent = bounceKeyframes;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [amplitude]);

  return (
    <div>
      <div
        className={css({
          width: "16",
          height: "16",
          backgroundColor: "primary",
          borderRadius: "md",
          // Use the dynamically generated animation
          animation: `dynamic-bounce-${amplitude} ${duration}s ease-in-out infinite`
        })}
      />
      <div className={css({ marginTop: "4", display: "flex", gap: "4", flexDirection: "column" })}>
        <label>
          Amplitude: {amplitude}px
          <input
            type="range"
            min="5"
            max="50"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className={css({ display: "block", width: "100%" })}
          />
        </label>
        <label>
          Duration: {duration}s
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className={css({ display: "block", width: "100%" })}
          />
        </label>
      </div>
    </div>
  );
}

// Pattern 5: Transform-based animations with state
export function TestTransformAnimations() {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [skew, setSkew] = useState(0);

  return (
    <div className={css({ padding: "8", textAlign: "center" })}>
      <div
        className={css({
          width: "24",
          height: "24",
          backgroundColor: "gradient-to-br",
          backgroundImage: "linear-gradient(135deg, {colors.primary}, {colors.accent})",
          borderRadius: "md",
          margin: "0 auto",
          transition: "transform 0.3s ease-out",
          transform: `rotate(${rotation}deg) scale(${scale}) skew(${skew}deg)`
        })}
      />
      
      <div className={css({ marginTop: "6", display: "flex", gap: "4", flexDirection: "column" })}>
        <label>
          Rotation: {rotation}°
          <input
            type="range"
            min="0"
            max="360"
            value={rotation}
            onChange={(e) => setRotation(Number(e.target.value))}
            className={css({ display: "block", width: "100%" })}
          />
        </label>
        <label>
          Scale: {scale}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(Number(e.target.value))}
            className={css({ display: "block", width: "100%" })}
          />
        </label>
        <label>
          Skew: {skew}°
          <input
            type="range"
            min="-45"
            max="45"
            value={skew}
            onChange={(e) => setSkew(Number(e.target.value))}
            className={css({ display: "block", width: "100%" })}
          />
        </label>
      </div>
    </div>
  );
}

// Pattern 6: Gesture-based animations
export function TestGestureAnimations() {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPosition.x,
      y: e.clientY - startPosition.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className={css({
        width: "100%",
        height: "300px",
        position: "relative",
        border: "2px dashed",
        borderColor: "border",
        borderRadius: "md",
        overflow: "hidden"
      })}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        ref={elementRef}
        className={css({
          width: "16",
          height: "16",
          backgroundColor: "primary",
          borderRadius: "md",
          position: "absolute",
          cursor: isDragging ? "grabbing" : "grab",
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: isDragging ? "none" : "transform 0.2s ease-out",
          userSelect: "none",
          // Add visual feedback
          boxShadow: isDragging ? "lg" : "md",
          scale: isDragging ? "1.1" : "1"
        })}
        onMouseDown={handleMouseDown}
      >
        <span className={css({ 
          fontSize: "xs", 
          color: "primary.foreground",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        })}>
          📱
        </span>
      </div>
    </div>
  );
}

// Pattern 7: Responsive animations
export function TestResponsiveAnimations() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={css({ padding: "4" })}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={css({
          marginBottom: "4",
          padding: "2 4",
          backgroundColor: "primary",
          color: "primary.foreground",
          borderRadius: "md",
          border: "none",
          cursor: "pointer"
        })}
      >
        Toggle Animation
      </button>
      
      <div
        className={css({
          width: "100%",
          height: "20",
          backgroundColor: "muted",
          borderRadius: "md",
          overflow: "hidden",
          // Responsive animation - different on mobile vs desktop
          transform: isVisible ? "scaleX(1)" : "scaleX(0)",
          transformOrigin: "left center",
          transition: "transform 0.5s ease-out",
          "@media (max-width: 768px)": {
            // Different animation on mobile
            transform: isVisible ? "translateY(0)" : "translateY(-100%)",
            transition: "transform 0.3s ease-out"
          }
        })}
      >
        <div
          className={css({
            width: "100%",
            height: "100%",
            background: "linear-gradient(90deg, {colors.primary}, {colors.accent})",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "primary.foreground"
          })}
        >
          Responsive Animation
        </div>
      </div>
    </div>
  );
}

// Pattern 8: Performance-optimized animations
export function TestPerformanceAnimations() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className={css({ padding: "4" })}>
      <button
        onClick={() => setIsAnimating(!isAnimating)}
        className={css({
          marginBottom: "4",
          padding: "2 4",
          backgroundColor: "primary",
          color: "primary.foreground",
          borderRadius: "md",
          border: "none",
          cursor: "pointer"
        })}
      >
        {isAnimating ? "Stop" : "Start"} Performance Animation
      </button>
      
      <div
        className={css({
          width: "16",
          height: "16",
          backgroundColor: "primary",
          borderRadius: "md",
          // Use transform and opacity for hardware acceleration
          transform: isAnimating ? "translateX(200px) rotate(360deg)" : "translateX(0) rotate(0deg)",
          opacity: isAnimating ? 0.7 : 1,
          transition: "transform 2s ease-in-out, opacity 2s ease-in-out",
          // Force hardware acceleration
          willChange: isAnimating ? "transform, opacity" : "auto",
          // Use transform3d for better performance
          backfaceVisibility: "hidden",
          perspective: "1000px"
        })}
      />
      
      <p className={css({ marginTop: "2", fontSize: "sm", color: "muted.foreground" })}>
        Uses hardware-accelerated transforms for better performance
      </p>
    </div>
  );
}