/**
 * PandaCSS Animation Keyframe Patterns Test
 * 
 * This file tests keyframe animation patterns in PandaCSS that can replace
 * complex animation hooks with static and dynamic keyframe definitions.
 */

import { css, cx } from "@/styled-system/css";
import { useState, useEffect } from "react";

// Pattern 1: Using predefined keyframes from panda.config.ts
export function TestPredefinedKeyframes() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Predefined Keyframes Test
      </h3>
      
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
        Toggle Animations
      </button>

      <div className={css({ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "4" })}>
        {/* Slide animations */}
        <div
          className={css({
            padding: "4",
            backgroundColor: "card",
            borderRadius: "md",
            border: "1px solid",
            borderColor: "border",
            animation: isVisible ? "slide-in-from-top 300ms ease-out" : "fade-out 300ms ease-in"
          })}
        >
          <h4 className={css({ fontWeight: "medium", marginBottom: "2" })}>Slide from Top</h4>
          <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
            Uses slide-in-from-top keyframe
          </p>
        </div>

        <div
          className={css({
            padding: "4",
            backgroundColor: "card",
            borderRadius: "md",
            border: "1px solid",
            borderColor: "border",
            animation: isVisible ? "slide-in-from-bottom 300ms ease-out" : "fade-out 300ms ease-in"
          })}
        >
          <h4 className={css({ fontWeight: "medium", marginBottom: "2" })}>Slide from Bottom</h4>
          <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
            Uses slide-in-from-bottom keyframe
          </p>
        </div>

        <div
          className={css({
            padding: "4",
            backgroundColor: "card",
            borderRadius: "md",
            border: "1px solid",
            borderColor: "border",
            animation: isVisible ? "slide-in-from-left 300ms ease-out" : "fade-out 300ms ease-in"
          })}
        >
          <h4 className={css({ fontWeight: "medium", marginBottom: "2" })}>Slide from Left</h4>
          <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
            Uses slide-in-from-left keyframe
          </p>
        </div>

        <div
          className={css({
            padding: "4",
            backgroundColor: "card",
            borderRadius: "md",
            border: "1px solid",
            borderColor: "border",
            animation: isVisible ? "slide-in-from-right 300ms ease-out" : "fade-out 300ms ease-in"
          })}
        >
          <h4 className={css({ fontWeight: "medium", marginBottom: "2" })}>Slide from Right</h4>
          <p className={css({ fontSize: "sm", color: "muted.foreground" })}>
            Uses slide-in-from-right keyframe
          </p>
        </div>
      </div>
    </div>
  );
}

// Pattern 2: Chaining multiple keyframes
export function TestChainedKeyframes() {
  const [stage, setStage] = useState(0);

  const nextStage = () => setStage((s) => (s + 1) % 4);

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Chained Keyframes Test
      </h3>
      
      <button
        onClick={nextStage}
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
        Next Stage ({stage + 1}/4)
      </button>

      <div
        className={css({
          width: "24",
          height: "24",
          backgroundColor: "primary",
          borderRadius: "md",
          margin: "0 auto",
          // Chain different animations based on stage
          animation: stage === 0 
            ? "slide-in-from-top 500ms ease-out"
            : stage === 1
            ? "pulse 1s ease-in-out infinite"
            : stage === 2
            ? "spin 1s linear infinite"
            : "bounce 1s ease-in-out infinite"
        })}
      />
      
      <p className={css({ textAlign: "center", marginTop: "4", fontSize: "sm", color: "muted.foreground" })}>
        Stage {stage + 1}: {
          stage === 0 ? "Slide In" :
          stage === 1 ? "Pulse" :
          stage === 2 ? "Spin" :
          "Bounce"
        }
      </p>
    </div>
  );
}

// Pattern 3: Custom keyframes with CSS-in-JS
export function TestCustomKeyframes() {
  const [isActive, setIsActive] = useState(false);

  // Define custom keyframes as CSS string
  const customKeyframes = `
    @keyframes wiggle {
      0%, 7% { transform: rotateZ(0); }
      15% { transform: rotateZ(-15deg); }
      20% { transform: rotateZ(10deg); }
      25% { transform: rotateZ(-10deg); }
      30% { transform: rotateZ(6deg); }
      35% { transform: rotateZ(-4deg); }
      40%, 100% { transform: rotateZ(0); }
    }

    @keyframes heartbeat {
      0% { transform: scale(1); }
      14% { transform: scale(1.3); }
      28% { transform: scale(1); }
      42% { transform: scale(1.3); }
      70% { transform: scale(1); }
      100% { transform: scale(1); }
    }

    @keyframes rainbow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
  `;

  useEffect(() => {
    // Inject custom keyframes
    const style = document.createElement('style');
    style.textContent = customKeyframes;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Custom Keyframes Test
      </h3>
      
      <button
        onClick={() => setIsActive(!isActive)}
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
        {isActive ? "Stop" : "Start"} Custom Animations
      </button>

      <div className={css({ display: "flex", gap: "6", justifyContent: "center", alignItems: "center" })}>
        <div
          className={css({
            width: "16",
            height: "16",
            backgroundColor: "destructive",
            borderRadius: "md",
            animation: isActive ? "wiggle 1s ease-in-out infinite" : "none"
          })}
        />
        
        <div
          className={css({
            width: "16",
            height: "16",
            backgroundColor: "primary",
            borderRadius: "full",
            animation: isActive ? "heartbeat 1.5s ease-in-out infinite" : "none"
          })}
        />
        
        <div
          className={css({
            width: "16",
            height: "16",
            background: "linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)",
            borderRadius: "md",
            animation: isActive ? "rainbow 2s linear infinite" : "none"
          })}
        />
      </div>
      
      <div className={css({ marginTop: "4", textAlign: "center", fontSize: "sm", color: "muted.foreground" })}>
        <p>Wiggle • Heartbeat • Rainbow</p>
      </div>
    </div>
  );
}

// Pattern 4: Sequential/staggered animations
export function TestStaggeredAnimations() {
  const [trigger, setTrigger] = useState(false);

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Staggered Animations Test
      </h3>
      
      <button
        onClick={() => setTrigger(!trigger)}
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
        Trigger Stagger
      </button>

      <div className={css({ display: "flex", gap: "2", justifyContent: "center" })}>
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className={css({
              width: "8",
              height: "8",
              backgroundColor: "primary",
              borderRadius: "full",
              animation: trigger 
                ? `slide-in-from-bottom 600ms ease-out ${i * 100}ms both`
                : `fade-out 300ms ease-in ${i * 50}ms both`
            })}
          />
        ))}
      </div>
      
      <p className={css({ textAlign: "center", marginTop: "4", fontSize: "sm", color: "muted.foreground" })}>
        Each dot animates with increasing delay
      </p>
    </div>
  );
}

// Pattern 5: Complex multi-step animations
export function TestMultiStepAnimations() {
  const [phase, setPhase] = useState<'idle' | 'expand' | 'rotate' | 'shrink'>('idle');

  // Complex animation sequence
  const multiStepKeyframes = `
    @keyframes complex-sequence {
      0% { 
        transform: scale(1) rotate(0deg);
        background-color: hsl(var(--primary));
        border-radius: 0.375rem;
      }
      25% { 
        transform: scale(1.5) rotate(0deg);
        background-color: hsl(var(--accent));
        border-radius: 50%;
      }
      50% { 
        transform: scale(1.5) rotate(180deg);
        background-color: hsl(var(--destructive));
        border-radius: 50%;
      }
      75% { 
        transform: scale(0.8) rotate(360deg);
        background-color: hsl(var(--secondary));
        border-radius: 0.375rem;
      }
      100% { 
        transform: scale(1) rotate(360deg);
        background-color: hsl(var(--primary));
        border-radius: 0.375rem;
      }
    }
  `;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = multiStepKeyframes;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const startSequence = () => {
    setPhase('expand');
    setTimeout(() => setPhase('rotate'), 1000);
    setTimeout(() => setPhase('shrink'), 2000);
    setTimeout(() => setPhase('idle'), 3000);
  };

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Multi-Step Animation Test
      </h3>
      
      <button
        onClick={startSequence}
        disabled={phase !== 'idle'}
        className={css({
          marginBottom: "4",
          padding: "2 4",
          backgroundColor: phase === 'idle' ? "primary" : "muted",
          color: phase === 'idle' ? "primary.foreground" : "muted.foreground",
          borderRadius: "md",
          border: "none",
          cursor: phase === 'idle' ? "pointer" : "not-allowed"
        })}
      >
        {phase === 'idle' ? 'Start Complex Sequence' : `Phase: ${phase}`}
      </button>

      <div className={css({ display: "flex", justifyContent: "center", alignItems: "center", height: "32" })}>
        <div
          className={css({
            width: "16",
            height: "16",
            backgroundColor: "primary",
            borderRadius: "md",
            animation: phase !== 'idle' ? "complex-sequence 4s ease-in-out" : "none"
          })}
        />
      </div>
      
      <p className={css({ textAlign: "center", marginTop: "4", fontSize: "sm", color: "muted.foreground" })}>
        Expand → Rotate → Shrink → Reset
      </p>
    </div>
  );
}

// Pattern 6: Conditional keyframes with variants
export function TestConditionalKeyframes() {
  const [animationType, setAnimationType] = useState<'bounce' | 'slide' | 'fade' | 'spin'>('bounce');
  const [isActive, setIsActive] = useState(false);

  const getAnimation = () => {
    if (!isActive) return "none";
    
    switch (animationType) {
      case 'bounce':
        return "bounce 1s ease-in-out infinite";
      case 'slide':
        return "slide-in-from-left 500ms ease-out infinite alternate";
      case 'fade':
        return "pulse 1s ease-in-out infinite";
      case 'spin':
        return "spin 1s linear infinite";
      default:
        return "none";
    }
  };

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Conditional Keyframes Test
      </h3>
      
      <div className={css({ marginBottom: "4", display: "flex", gap: "2", flexWrap: "wrap" })}>
        {(['bounce', 'slide', 'fade', 'spin'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setAnimationType(type)}
            className={css({
              padding: "1 3",
              backgroundColor: animationType === type ? "primary" : "secondary",
              color: animationType === type ? "primary.foreground" : "secondary.foreground",
              borderRadius: "md",
              border: "none",
              cursor: "pointer",
              fontSize: "sm"
            })}
          >
            {type}
          </button>
        ))}
      </div>

      <button
        onClick={() => setIsActive(!isActive)}
        className={css({
          marginBottom: "4",
          padding: "2 4",
          backgroundColor: "accent",
          color: "accent.foreground",
          borderRadius: "md",
          border: "none",
          cursor: "pointer"
        })}
      >
        {isActive ? 'Stop' : 'Start'} Animation
      </button>

      <div className={css({ display: "flex", justifyContent: "center", alignItems: "center", height: "24" })}>
        <div
          className={css({
            width: "16",
            height: "16",
            backgroundColor: "primary",
            borderRadius: "md",
            animation: getAnimation()
          })}
        />
      </div>
      
      <p className={css({ textAlign: "center", marginTop: "4", fontSize: "sm", color: "muted.foreground" })}>
        Current: {animationType} {isActive ? '(active)' : '(stopped)'}
      </p>
    </div>
  );
}