# PandaCSS Animation Patterns Research

## Overview

This document outlines comprehensive patterns for implementing animations in PandaCSS to replace the deleted animation hooks. The research covers runtime CSS generation, performance optimizations, and practical implementation strategies.

## Core PandaCSS Functions

### 1. `css()` Function - Runtime Style Generation

The `css()` function is PandaCSS's primary runtime styling API, allowing dynamic style generation:

```tsx
import { css } from "@/styled-system/css";

// Basic usage with dynamic values
const dynamicStyles = css({
  opacity: isVisible ? 1 : 0,
  transform: `translateY(${offset}px)`,
  transition: "all 300ms ease-out"
});

// CSS custom properties for complex animations
const animatedElement = css({
  "--progress": `${progress}%`,
  "--rotation": `${progress * 3.6}deg`,
  transform: "rotate(var(--rotation))",
  background: `conic-gradient(from 0deg, transparent 0%, primary var(--progress))`
});
```

**Key Benefits:**
- Runtime style generation with TypeScript safety
- Direct integration with design tokens
- Support for CSS custom properties
- Automatic vendor prefixing

### 2. `cva()` Function - Class Variance Authority

CVA provides variant-based styling for component state management:

```tsx
import { cva } from "@/styled-system/css";

const animatedButton = cva({
  base: {
    transition: "all 200ms ease-out",
    cursor: "pointer"
  },
  variants: {
    state: {
      idle: { transform: "scale(1)" },
      hover: { transform: "scale(1.05)" },
      active: { transform: "scale(0.95)" },
      loading: { animation: "spin 1s linear infinite" }
    },
    size: {
      sm: { padding: "2", fontSize: "sm" },
      md: { padding: "4", fontSize: "base" },
      lg: { padding: "6", fontSize: "lg" }
    }
  },
  compoundVariants: [
    {
      state: "hover",
      size: "lg",
      css: { transform: "scale(1.1)" }
    }
  ],
  defaultVariants: {
    state: "idle",
    size: "md"
  }
});
```

**Key Benefits:**
- Type-safe variant combinations
- Compound variant support
- Default variant fallbacks
- Excellent TypeScript inference

### 3. Recipe Patterns

Recipes provide reusable component styling patterns:

```tsx
// In panda.config.ts
recipes: {
  interactiveCard: {
    className: 'interactive-card',
    base: {
      padding: "4",
      borderRadius: "md",
      transition: "all 300ms ease-out",
      cursor: "pointer",
      _hover: { transform: "translateY(-2px)" }
    },
    variants: {
      animation: {
        slide: { _hover: { transform: "translateY(-4px)" } },
        scale: { _hover: { transform: "scale(1.02)" } },
        rotate: { _hover: { transform: "rotate(1deg)" } }
      }
    }
  }
}
```

## Animation Pattern Categories

### 1. Transform-Based Animations

**Best for:** Position, scale, rotation changes
**Performance:** Hardware-accelerated (GPU)

```tsx
// Pattern: Dynamic transforms
const transformAnimation = css({
  transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`,
  transition: "transform 300ms ease-out",
  willChange: isAnimating ? "transform" : "auto"
});

// Pattern: State-based transforms
const stateTransform = cva({
  base: {
    transition: "transform 200ms ease-out"
  },
  variants: {
    state: {
      idle: { transform: "scale(1) rotate(0deg)" },
      hover: { transform: "scale(1.05) rotate(2deg)" },
      active: { transform: "scale(0.95) rotate(-1deg)" }
    }
  }
});
```

### 2. Opacity and Color Animations

**Best for:** Fade effects, theme transitions
**Performance:** Efficient (no layout changes)

```tsx
// Pattern: Fade transitions
const fadeTransition = css({
  opacity: isVisible ? 1 : 0,
  transition: "opacity 300ms ease-out"
});

// Pattern: Color transitions
const colorTransition = css({
  backgroundColor: isActive ? "primary" : "secondary",
  color: isActive ? "primary.foreground" : "secondary.foreground",
  transition: "background-color 200ms ease-out, color 200ms ease-out"
});
```

### 3. Keyframe Animations

**Best for:** Complex, looping animations
**Performance:** Good when using composite properties

```tsx
// Pattern: Predefined keyframes (from panda.config.ts)
const keyframeAnimation = css({
  animation: isActive ? "pulse 2s ease-in-out infinite" : "none"
});

// Pattern: Custom keyframes
const customKeyframes = `
  @keyframes custom-bounce {
    0%, 20%, 53%, 80%, 100% { transform: translateY(0px); }
    40%, 43% { transform: translateY(-30px); }
    70% { transform: translateY(-15px); }
    90% { transform: translateY(-4px); }
  }
`;

// Inject and use custom keyframes
useEffect(() => {
  const style = document.createElement('style');
  style.textContent = customKeyframes;
  document.head.appendChild(style);
  return () => document.head.removeChild(style);
}, []);
```

### 4. Gesture-Based Animations

**Best for:** Interactive elements, drag/swipe
**Performance:** Use transform for smooth interaction

```tsx
// Pattern: Gesture tracking
const gestureAnimation = css({
  transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  transition: isDragging ? "none" : "transform 200ms ease-out",
  cursor: isDragging ? "grabbing" : "grab",
  userSelect: "none"
});

// Pattern: Momentum-based animations
const momentumAnimation = css({
  transform: `translateX(${offset}px)`,
  transition: `transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
});
```

### 5. Responsive Animations

**Best for:** Cross-device consistency
**Performance:** Media query optimization

```tsx
// Pattern: Responsive animation behavior
const responsiveAnimation = css({
  // Mobile-first approach
  transform: isActive ? "translateY(-10px)" : "translateY(0)",
  transition: "transform 300ms ease-out",
  
  // Desktop enhancements
  "@media (min-width: 768px)": {
    transform: isActive ? "translateY(-20px) scale(1.02)" : "translateY(0) scale(1)"
  },
  
  // Respect user preferences
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
    transition: "none"
  }
});
```

## Performance Optimization Patterns

### 1. Hardware Acceleration

**Force GPU compositing for smooth animations:**

```tsx
const optimizedAnimation = css({
  // Use transform3d to force hardware acceleration
  transform: `translate3d(${x}px, ${y}px, 0)`,
  
  // Indicate what will change
  willChange: isAnimating ? "transform, opacity" : "auto",
  
  // Prevent flickering
  backfaceVisibility: "hidden",
  perspective: "1000px"
});
```

### 2. CSS Containment

**Isolate animation effects to prevent layout thrashing:**

```tsx
const containedAnimation = css({
  // Contain layout, style, and paint changes
  contain: "layout style paint",
  
  // Animation properties
  transform: isActive ? "scale(1.1)" : "scale(1)",
  transition: "transform 300ms ease-out"
});
```

### 3. Batched Animations

**Use requestAnimationFrame for coordinated updates:**

```tsx
const useBatchedAnimation = () => {
  const [values, setValues] = useState([]);
  const frameRef = useRef<number>();

  const animate = useCallback(() => {
    setValues(prev => prev.map(updateFunction));
    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
};
```

### 4. Memory Management

**Proper cleanup of animations and timers:**

```tsx
const useAnimationCleanup = () => {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const cleanup = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    intervalsRef.current.forEach(clearInterval);
    timeoutsRef.current.clear();
    intervalsRef.current.clear();
  }, []);

  useEffect(() => cleanup, [cleanup]);

  return { timeoutsRef, intervalsRef, cleanup };
};
```

## Migration Patterns for Common Hooks

### From `use-animation.tsx`

**Before (Hook):**
```tsx
const { animate, isAnimating } = useAnimation({
  duration: 300,
  easing: 'ease-out'
});
```

**After (PandaCSS):**
```tsx
const [isAnimating, setIsAnimating] = useState(false);
const animationStyles = css({
  transform: isAnimating ? "scale(1.1)" : "scale(1)",
  transition: "transform 300ms ease-out"
});
```

### From `use-ripple.tsx`

**Before (Hook):**
```tsx
const { createRipple } = useRipple();
```

**After (PandaCSS):**
```tsx
const rippleStyles = css({
  position: "relative",
  overflow: "hidden",
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
    transition: "width 0.3s, height 0.3s, opacity 0.3s"
  },
  "&:active::before": {
    width: "300px",
    height: "300px",
    opacity: 0.1
  }
});
```

### From `use-parallax.tsx`

**Before (Hook):**
```tsx
const { ref, style } = useParallax({ speed: 0.5 });
```

**After (PandaCSS):**
```tsx
const [scrollY, setScrollY] = useState(0);
const parallaxStyles = css({
  transform: `translate3d(0, ${scrollY * 0.5}px, 0)`,
  willChange: "transform"
});

useEffect(() => {
  const handleScroll = () => setScrollY(window.scrollY);
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

## Best Practices

### 1. Performance Guidelines

- **Use `transform` and `opacity`** for animations when possible
- **Avoid animating layout properties** (width, height, margin, padding)
- **Set `willChange`** only when animating, remove afterward
- **Use hardware acceleration** with `translate3d()` and `perspective`
- **Implement proper cleanup** for timers and event listeners

### 2. Accessibility Considerations

```tsx
const accessibleAnimation = css({
  // Respect user motion preferences
  "@media (prefers-reduced-motion: reduce)": {
    animation: "none",
    transition: "none"
  },
  
  // Provide fallbacks
  "@media (prefers-reduced-motion: no-preference)": {
    animation: "slide-in 300ms ease-out"
  }
});
```

### 3. TypeScript Integration

```tsx
// Define animation state types
type AnimationState = 'idle' | 'loading' | 'success' | 'error';

// Use with CVA for type safety
const animatedComponent = cva({
  variants: {
    state: {
      idle: { opacity: 1 },
      loading: { opacity: 0.7, animation: "pulse 1s infinite" },
      success: { opacity: 1, backgroundColor: "green.100" },
      error: { opacity: 1, backgroundColor: "red.100" }
    }
  }
});

type ComponentProps = VariantProps<typeof animatedComponent>;
```

### 4. Testing Animations

```tsx
// Test animation states
const TestAnimation = () => {
  const [state, setState] = useState<AnimationState>('idle');
  
  return (
    <div className={animatedComponent({ state })}>
      <button onClick={() => setState('loading')}>Test Loading</button>
      <button onClick={() => setState('success')}>Test Success</button>
      <button onClick={() => setState('error')}>Test Error</button>
    </div>
  );
};
```

## Gotchas and Limitations

### 1. Dynamic Keyframes

**Problem:** PandaCSS doesn't support truly dynamic keyframe generation at runtime.

**Solution:** Pre-define keyframe variations or inject CSS dynamically:

```tsx
// Pre-define variations
const bounceKeyframes = {
  small: "bounce-small 1s ease-in-out infinite",
  medium: "bounce-medium 1s ease-in-out infinite",
  large: "bounce-large 1s ease-in-out infinite"
};

// Or inject dynamically
const injectKeyframes = (amplitude: number) => {
  const css = `@keyframes dynamic-bounce-${amplitude} { /* keyframes */ }`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};
```

### 2. Complex Animation Sequences

**Problem:** Multi-step animations require careful state management.

**Solution:** Use state machines or animation libraries for complex sequences:

```tsx
const useAnimationSequence = () => {
  const [phase, setPhase] = useState('idle');
  
  const runSequence = async () => {
    setPhase('prepare');
    await delay(500);
    setPhase('execute');
    await delay(1000);
    setPhase('complete');
    await delay(500);
    setPhase('idle');
  };
  
  return { phase, runSequence };
};
```

### 3. Animation Performance

**Problem:** Too many simultaneous animations can cause jank.

**Solution:** Implement animation budgeting and virtualization:

```tsx
const useAnimationBudget = (maxConcurrent = 10) => {
  const [activeAnimations, setActiveAnimations] = useState(0);
  
  const requestAnimation = () => {
    if (activeAnimations < maxConcurrent) {
      setActiveAnimations(prev => prev + 1);
      return true;
    }
    return false;
  };
  
  const releaseAnimation = () => {
    setActiveAnimations(prev => Math.max(0, prev - 1));
  };
  
  return { requestAnimation, releaseAnimation };
};
```

## Conclusion

PandaCSS provides robust patterns for replacing animation hooks through:

1. **Runtime CSS generation** with the `css()` function
2. **Variant-based styling** with CVA patterns
3. **Recipe definitions** for reusable components
4. **Performance optimizations** through proper CSS usage
5. **TypeScript integration** for type-safe animations

The key is leveraging CSS-first approaches while maintaining the flexibility and performance that the original hooks provided. Each pattern should be chosen based on the specific animation requirements, performance constraints, and maintainability needs.

## Implementation Files

- `/pandacss-patterns/dynamic-styles-test.tsx` - Runtime CSS generation patterns
- `/pandacss-patterns/keyframe-patterns-test.tsx` - Animation keyframe implementations
- `/pandacss-patterns/recipe-patterns-test.tsx` - Component recipe patterns
- `/pandacss-patterns/performance-patterns-test.tsx` - Performance optimization techniques