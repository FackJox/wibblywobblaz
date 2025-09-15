/**
 * PandaCSS Recipe Patterns Test
 * 
 * This file tests recipe patterns in PandaCSS that can encapsulate
 * complex component styling with variants, compound variants, and defaults.
 */

import { css, cx } from "@/styled-system/css";
import { cva, type VariantProps } from "@/styled-system/css";
import { useState } from "react";

// Pattern 1: Basic recipe with variants (similar to existing button recipe)
const animatedCard = cva({
  base: {
    padding: "4",
    borderRadius: "lg",
    border: "1px solid",
    borderColor: "border",
    transition: "all 300ms ease-out",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    
    // Hover effects
    _hover: {
      borderColor: "primary",
      boxShadow: "lg"
    },
    
    // Focus effects
    _focus: {
      outline: "none",
      ringWidth: "2px",
      ringColor: "ring",
      ringOffset: "2px"
    }
  },
  variants: {
    variant: {
      default: {
        backgroundColor: "card",
        color: "card.foreground"
      },
      primary: {
        backgroundColor: "primary",
        color: "primary.foreground",
        _hover: {
          backgroundColor: "primary",
          opacity: 0.9
        }
      },
      secondary: {
        backgroundColor: "secondary",
        color: "secondary.foreground"
      },
      destructive: {
        backgroundColor: "destructive",
        color: "destructive.foreground"
      }
    },
    size: {
      sm: {
        padding: "2",
        fontSize: "sm"
      },
      md: {
        padding: "4",
        fontSize: "base"
      },
      lg: {
        padding: "6",
        fontSize: "lg"
      }
    },
    animation: {
      none: {},
      slide: {
        _hover: {
          transform: "translateY(-2px)"
        }
      },
      scale: {
        _hover: {
          transform: "scale(1.02)"
        }
      },
      rotate: {
        _hover: {
          transform: "rotate(1deg)"
        }
      },
      pulse: {
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      }
    },
    state: {
      idle: {},
      loading: {
        opacity: 0.7,
        cursor: "not-allowed",
        animation: "pulse 1s ease-in-out infinite"
      },
      success: {
        borderColor: "green.500",
        backgroundColor: "green.50",
        _dark: {
          backgroundColor: "green.950"
        }
      },
      error: {
        borderColor: "red.500",
        backgroundColor: "red.50",
        _dark: {
          backgroundColor: "red.950"
        }
      }
    }
  },
  // Compound variants - combinations of variants
  compoundVariants: [
    {
      animation: "slide",
      size: "lg",
      css: {
        _hover: {
          transform: "translateY(-4px)"
        }
      }
    },
    {
      variant: "primary",
      animation: "scale",
      css: {
        _hover: {
          transform: "scale(1.05)",
          boxShadow: "xl"
        }
      }
    }
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    animation: "none",
    state: "idle"
  }
});

type AnimatedCardProps = VariantProps<typeof animatedCard>;

export function TestBasicRecipe() {
  const [cardState, setCardState] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleClick = async () => {
    setCardState("loading");
    
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random success/error
    setCardState(Math.random() > 0.5 ? "success" : "error");
    
    // Reset after delay
    setTimeout(() => setCardState("idle"), 2000);
  };

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Basic Recipe Pattern Test
      </h3>
      
      <div className={css({ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "4" })}>
        <div
          className={animatedCard({ variant: "default", animation: "slide" })}
          onClick={handleClick}
        >
          <h4 className={css({ fontWeight: "medium", marginBottom: "2" })}>Default Slide</h4>
          <p className={css({ fontSize: "sm", opacity: 0.8 })}>Slides up on hover</p>
        </div>

        <div
          className={animatedCard({ variant: "primary", animation: "scale", state: cardState })}
          onClick={handleClick}
        >
          <h4 className={css({ fontWeight: "medium", marginBottom: "2" })}>Primary Scale</h4>
          <p className={css({ fontSize: "sm", opacity: 0.8 })}>
            {cardState === "idle" && "Click to test states"}
            {cardState === "loading" && "Loading..."}
            {cardState === "success" && "Success!"}
            {cardState === "error" && "Error occurred"}
          </p>
        </div>

        <div className={animatedCard({ variant: "secondary", animation: "rotate", size: "lg" })}>
          <h4 className={css({ fontWeight: "medium", marginBottom: "2" })}>Secondary Rotate</h4>
          <p className={css({ fontSize: "sm", opacity: 0.8 })}>Rotates slightly on hover</p>
        </div>

        <div className={animatedCard({ variant: "destructive", animation: "pulse" })}>
          <h4 className={css({ fontWeight: "medium", marginBottom: "2" })}>Destructive Pulse</h4>
          <p className={css({ fontSize: "sm", opacity: 0.8 })}>Continuous pulse animation</p>
        </div>
      </div>
    </div>
  );
}

// Pattern 2: Recipe for interactive animations
const interactiveElement = cva({
  base: {
    padding: "4",
    borderRadius: "md",
    border: "none",
    cursor: "pointer",
    transition: "all 200ms ease-out",
    position: "relative",
    overflow: "hidden",
    userSelect: "none",
    
    // Ripple effect pseudo-element
    "&::before": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "0",
      height: "0",
      borderRadius: "50%",
      backgroundColor: "currentColor",
      opacity: 0,
      transform: "translate(-50%, -50%)",
      transition: "width 0.3s ease-out, height 0.3s ease-out, opacity 0.3s ease-out"
    },
    
    // Active state for ripple
    "&:active::before": {
      width: "300px",
      height: "300px",
      opacity: 0.1
    }
  },
  variants: {
    interaction: {
      ripple: {
        "&:active": {
          transform: "scale(0.98)"
        }
      },
      bounce: {
        "&:active": {
          animation: "bounce 0.5s ease-in-out"
        }
      },
      shake: {
        "&:active": {
          animation: "wiggle 0.5s ease-in-out"
        }
      },
      glow: {
        "&:hover": {
          boxShadow: "0 0 20px currentColor",
          filter: "brightness(1.1)"
        }
      }
    },
    feedback: {
      haptic: {
        // Visual feedback for haptic-like effect
        "&:active": {
          transform: "scale(0.95)",
          filter: "brightness(0.9)"
        }
      },
      magnetic: {
        "&:hover": {
          transform: "scale(1.05)",
          zIndex: 10
        }
      },
      elastic: {
        "&:hover": {
          transform: "scale(1.1)"
        },
        "&:active": {
          transform: "scale(0.9)"
        }
      }
    },
    surface: {
      flat: {
        backgroundColor: "secondary",
        color: "secondary.foreground"
      },
      raised: {
        backgroundColor: "card",
        color: "card.foreground",
        boxShadow: "md",
        "&:hover": {
          boxShadow: "lg"
        }
      },
      floating: {
        backgroundColor: "primary",
        color: "primary.foreground",
        boxShadow: "xl",
        "&:hover": {
          boxShadow: "2xl",
          transform: "translateY(-2px)"
        }
      }
    }
  },
  defaultVariants: {
    interaction: "ripple",
    feedback: "haptic",
    surface: "flat"
  }
});

export function TestInteractiveRecipe() {
  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Interactive Recipe Pattern Test
      </h3>
      
      <div className={css({ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "4" })}>
        <button className={interactiveElement({ interaction: "ripple", surface: "flat" })}>
          Ripple Effect
        </button>
        
        <button className={interactiveElement({ interaction: "bounce", surface: "raised" })}>
          Bounce Click
        </button>
        
        <button className={interactiveElement({ interaction: "glow", surface: "floating" })}>
          Glow Hover
        </button>
        
        <button className={interactiveElement({ feedback: "magnetic", surface: "raised" })}>
          Magnetic Hover
        </button>
        
        <button className={interactiveElement({ feedback: "elastic", surface: "floating" })}>
          Elastic Feel
        </button>
        
        <button className={interactiveElement({ interaction: "shake", feedback: "haptic" })}>
          Shake Click
        </button>
      </div>
    </div>
  );
}

// Pattern 3: Complex animation state recipe
const animationStateMachine = cva({
  base: {
    width: "24",
    height: "24",
    borderRadius: "md",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "lg",
    transition: "all 300ms ease-out",
    cursor: "pointer",
    margin: "0 auto"
  },
  variants: {
    phase: {
      idle: {
        backgroundColor: "muted",
        color: "muted.foreground",
        transform: "scale(1) rotate(0deg)"
      },
      preparing: {
        backgroundColor: "yellow.500",
        color: "yellow.950",
        animation: "pulse 1s ease-in-out infinite",
        transform: "scale(1.1)"
      },
      active: {
        backgroundColor: "green.500",
        color: "green.950",
        animation: "spin 2s linear infinite",
        transform: "scale(1.2)"
      },
      completing: {
        backgroundColor: "blue.500",
        color: "blue.950",
        animation: "bounce 0.5s ease-in-out 3",
        transform: "scale(1.1)"
      },
      done: {
        backgroundColor: "primary",
        color: "primary.foreground",
        transform: "scale(1) rotate(360deg)"
      },
      error: {
        backgroundColor: "destructive",
        color: "destructive.foreground",
        animation: "wiggle 0.5s ease-in-out 2"
      }
    },
    type: {
      process: {
        borderRadius: "md"
      },
      circular: {
        borderRadius: "50%"
      },
      diamond: {
        borderRadius: "md",
        transform: "rotate(45deg)",
        "& > *": {
          transform: "rotate(-45deg)"
        }
      }
    }
  },
  defaultVariants: {
    phase: "idle",
    type: "process"
  }
});

export function TestAnimationStateMachine() {
  const [phase, setPhase] = useState<"idle" | "preparing" | "active" | "completing" | "done" | "error">("idle");
  const [type, setType] = useState<"process" | "circular" | "diamond">("process");

  const runSequence = async () => {
    setPhase("preparing");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setPhase("active");
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPhase("completing");
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Random success/error
    if (Math.random() > 0.3) {
      setPhase("done");
      setTimeout(() => setPhase("idle"), 2000);
    } else {
      setPhase("error");
      setTimeout(() => setPhase("idle"), 2000);
    }
  };

  const getIcon = () => {
    switch (phase) {
      case "idle": return "⏸️";
      case "preparing": return "⏳";
      case "active": return "⚡";
      case "completing": return "✨";
      case "done": return "✅";
      case "error": return "❌";
      default: return "❓";
    }
  };

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Animation State Machine Test
      </h3>
      
      <div className={css({ marginBottom: "6", display: "flex", gap: "2", justifyContent: "center" })}>
        {(["process", "circular", "diamond"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={css({
              padding: "1 3",
              backgroundColor: type === t ? "primary" : "secondary",
              color: type === t ? "primary.foreground" : "secondary.foreground",
              borderRadius: "md",
              border: "none",
              cursor: "pointer",
              fontSize: "sm"
            })}
          >
            {t}
          </button>
        ))}
      </div>

      <div 
        className={animationStateMachine({ phase, type })}
        onClick={phase === "idle" ? runSequence : undefined}
      >
        <span>{getIcon()}</span>
      </div>
      
      <div className={css({ textAlign: "center", marginTop: "4" })}>
        <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
          Phase: {phase}
        </p>
        {phase === "idle" && (
          <p className={css({ fontSize: "xs", color: "muted.foreground", marginTop: "1" })}>
            Click to start sequence
          </p>
        )}
      </div>
    </div>
  );
}

// Pattern 4: Responsive animation recipe
const responsiveAnimation = cva({
  base: {
    padding: "4",
    borderRadius: "md",
    backgroundColor: "primary",
    color: "primary.foreground",
    transition: "all 300ms ease-out",
    margin: "0 auto",
    cursor: "pointer"
  },
  variants: {
    responsive: {
      mobile: {
        // Mobile-first animations
        width: "full",
        transform: "translateY(0)",
        "@media (min-width: 768px)": {
          width: "auto",
          transform: "translateX(0)"
        }
      },
      desktop: {
        // Desktop-first animations
        width: "auto",
        transform: "scale(1)",
        "@media (max-width: 767px)": {
          width: "full",
          transform: "scale(0.9)"
        }
      },
      adaptive: {
        // Adaptive based on screen size
        fontSize: "sm",
        padding: "2",
        "@media (min-width: 640px)": {
          fontSize: "base",
          padding: "3"
        },
        "@media (min-width: 1024px)": {
          fontSize: "lg",
          padding: "4"
        }
      }
    },
    motion: {
      reduced: {
        // Respect prefers-reduced-motion
        "@media (prefers-reduced-motion: reduce)": {
          animation: "none",
          transition: "none"
        }
      },
      normal: {
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "lg"
        }
      },
      enhanced: {
        "&:hover": {
          transform: "translateY(-4px) scale(1.02)",
          boxShadow: "xl",
          filter: "brightness(1.1)"
        }
      }
    }
  },
  defaultVariants: {
    responsive: "adaptive",
    motion: "normal"
  }
});

export function TestResponsiveAnimationRecipe() {
  const [motionLevel, setMotionLevel] = useState<"reduced" | "normal" | "enhanced">("normal");

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Responsive Animation Recipe Test
      </h3>
      
      <div className={css({ marginBottom: "6", display: "flex", gap: "2", justifyContent: "center", flexWrap: "wrap" })}>
        {(["reduced", "normal", "enhanced"] as const).map((level) => (
          <button
            key={level}
            onClick={() => setMotionLevel(level)}
            className={css({
              padding: "1 3",
              backgroundColor: motionLevel === level ? "primary" : "secondary",
              color: motionLevel === level ? "primary.foreground" : "secondary.foreground",
              borderRadius: "md",
              border: "none",
              cursor: "pointer",
              fontSize: "sm"
            })}
          >
            {level}
          </button>
        ))}
      </div>

      <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
        <div className={responsiveAnimation({ responsive: "mobile", motion: motionLevel })}>
          Mobile-First Animation
        </div>
        
        <div className={responsiveAnimation({ responsive: "desktop", motion: motionLevel })}>
          Desktop-First Animation
        </div>
        
        <div className={responsiveAnimation({ responsive: "adaptive", motion: motionLevel })}>
          Adaptive Animation
        </div>
      </div>
      
      <p className={css({ textAlign: "center", marginTop: "4", fontSize: "sm", color: "muted.foreground" })}>
        Motion level: {motionLevel} • Resize window to see responsive behavior
      </p>
    </div>
  );
}