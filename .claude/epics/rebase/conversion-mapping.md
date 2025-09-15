# Animation Hooks to PandaCSS Conversion Mapping

## Overview

This document provides comprehensive mapping and conversion strategies for migrating 19 animation hooks from the main branch to PandaCSS patterns. The mapping is organized by complexity and provides concrete implementation strategies for each hook type.

## Hook Categories by Complexity

### Simple Utility Hooks (Low Complexity)
- `use-mobile.tsx` - Device detection utility
- `use-feature-flags.tsx` - Feature flag management
- `use-haptics.ts` - Haptic feedback utility

### Dynamic Style Hooks (Medium Complexity) 
- `use-ripple.tsx` - Click ripple effects
- `use-magnetic-hover.tsx` - Magnetic hover interactions
- `use-gradient-follow.tsx` - Mouse-following gradients

### Complex Animation Hooks (High Complexity)
- `use-parallax.tsx` - Scroll-based parallax effects
- `use-scroll-animations.tsx` - Scroll-triggered animations
- `use-stagger-reveal.tsx` - Staggered reveal animations
- `use-text-reveal.tsx` - Text reveal animations

### DOM Management Hooks (Medium-High Complexity)
- `use-animation.tsx` - General animation utilities
- `use-batched-dom.ts` - DOM batch operations
- `use-gestures.ts` - Gesture handling
- `use-long-press.ts` - Long press detection
- `use-swipe.ts` - Swipe detection
- `use-performance-monitor.ts` - Performance monitoring
- `use-performance.tsx` - Performance utilities
- `use-toast.ts` - Toast notifications

## Detailed Conversion Mappings

### 1. use-ripple.tsx → PandaCSS Ripple Pattern

**Original Pattern:**
```tsx
const ripple = useRipple({ preset: 'button' })
return (
  <button 
    ref={ripple.rippleRef}
    {...ripple.getRippleProps()}
  >
    Click me
  </button>
)
```

**PandaCSS Pattern:**
```tsx
import { css } from "@/styled-system/css"

const useRippleEffect = (color = "currentColor", duration = 600) => {
  const [ripples, setRipples] = useState<Array<{id: string, x: number, y: number}>>([])

  const createRipple = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const newRipple = { id: Date.now().toString(), x, y }
    
    setRipples(prev => [...prev, newRipple])
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, duration)
  }

  const rippleStyles = css({
    position: "relative",
    overflow: "hidden"
  })

  const rippleElements = ripples.map(ripple => (
    <span
      key={ripple.id}
      className={css({
        position: "absolute",
        borderRadius: "50%",
        backgroundColor: color,
        opacity: 0.3,
        width: "0",
        height: "0",
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        transform: "translate(-50%, -50%)",
        animation: `ripple-expand ${duration}ms ease-out`,
        pointerEvents: "none"
      })}
    />
  ))

  return { createRipple, rippleStyles, rippleElements }
}
```

**Conversion Strategy:**
- Replace ref-based DOM manipulation with state-managed elements
- Use CSS animations instead of imperative style changes
- Leverage `css()` function for dynamic positioning
- Add custom keyframes to panda.config.ts for ripple animation

**Challenges & Solutions:**
- **Challenge:** Dynamic ripple positioning
- **Solution:** Use CSS custom properties and React state for coordinates
- **Challenge:** Cleanup of old ripples
- **Solution:** State-based management with setTimeout cleanup

---

### 2. use-parallax.tsx → PandaCSS Parallax Pattern

**Original Pattern:**
```tsx
const parallax = useParallax({ speed: 0.5, direction: 'vertical' })
return <div ref={parallax.ref} style={parallax.styles}>Background</div>
```

**PandaCSS Pattern:**
```tsx
import { css } from "@/styled-system/css"

const useParallaxEffect = (speed = 0.5, direction = 'vertical') => {
  const [scrollY, setScrollY] = useState(0)
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!isInView) return
      setScrollY(window.scrollY)
    }, 16)

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isInView])

  const offset = scrollY * speed
  const parallaxStyles = css({
    transform: direction === 'vertical' 
      ? `translate3d(0, ${offset}px, 0)`
      : `translate3d(${offset}px, 0, 0)`,
    willChange: isInView ? "transform" : "auto",
    backfaceVisibility: "hidden"
  })

  return { ref, parallaxStyles, offset, isInView }
}
```

**Conversion Strategy:**
- Replace will-change manager with conditional CSS properties
- Use intersection observer for performance optimization
- Implement throttling for scroll events
- Leverage transform3d for hardware acceleration

**Challenges & Solutions:**
- **Challenge:** Performance optimization
- **Solution:** Intersection observer + conditional will-change
- **Challenge:** Smooth animations
- **Solution:** RequestAnimationFrame-based throttling

---

### 3. use-stagger-reveal.tsx → PandaCSS Stagger Pattern

**Original Pattern:**
```tsx
const stagger = useStaggerReveal(4, { staggerDelay: 150 })
return (
  <div ref={stagger.containerRef}>
    {items.map((item, index) => (
      <div style={{
        opacity: stagger.items[index]?.opacity ?? 0,
        transform: stagger.items[index]?.transform ?? 'translateY(20px)'
      }}>
        {item.content}
      </div>
    ))}
  </div>
)
```

**PandaCSS Pattern:**
```tsx
import { css, cva } from "@/styled-system/css"

const staggerItem = cva({
  base: {
    transition: "all 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)"
  },
  variants: {
    state: {
      hidden: { 
        opacity: 0, 
        transform: "translateY(20px) scale(0.95)" 
      },
      visible: { 
        opacity: 1, 
        transform: "translateY(0) scale(1)" 
      }
    }
  }
})

const useStaggerReveal = (itemCount: number, staggerDelay = 150) => {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [isTriggered, setIsTriggered] = useState(false)
  const containerRef = useRef<HTMLElement>(null)

  const trigger = useCallback(() => {
    if (isTriggered) return
    setIsTriggered(true)
    
    Array.from({ length: itemCount }, (_, i) => i).forEach((index) => {
      setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, index]))
      }, index * staggerDelay)
    })
  }, [itemCount, staggerDelay, isTriggered])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && trigger(),
      { threshold: 0.1 }
    )

    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [trigger])

  const getItemStyles = (index: number) => 
    staggerItem({ state: visibleItems.has(index) ? "visible" : "hidden" })

  return { containerRef, getItemStyles, trigger, visibleItems }
}
```

**Conversion Strategy:**
- Replace complex state arrays with Set-based visibility tracking
- Use CVA for clean state-based styling
- Implement intersection observer for auto-triggering
- Use setTimeout for stagger timing instead of animation delays

**Challenges & Solutions:**
- **Challenge:** Complex state management for multiple items
- **Solution:** Simplified Set-based approach with CVA variants
- **Challenge:** Precise timing control
- **Solution:** setTimeout-based approach with cleanup

---

### 4. use-magnetic-hover.tsx → PandaCSS Magnetic Pattern

**Original Pattern:**
```tsx
const magnetic = useMagneticHover({ strength: 0.3 })
return <div ref={magnetic.ref} style={magnetic.styles}>Magnetic Element</div>
```

**PandaCSS Pattern:**
```tsx
import { css } from "@/styled-system/css"

const useMagneticHover = (strength = 0.3, maxDistance = 100) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const handleMouseMove = useCallback(
    throttle((event: MouseEvent) => {
      if (!ref.current || !isHovered) return

      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const deltaX = (event.clientX - centerX) * strength
      const deltaY = (event.clientY - centerY) * strength
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      if (distance <= maxDistance) {
        setMousePosition({ x: deltaX, y: deltaY })
      }
    }, 16),
    [strength, maxDistance, isHovered]
  )

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => document.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  const magneticStyles = css({
    transform: isHovered
      ? `translate3d(${mousePosition.x}px, ${mousePosition.y}px, 0)`
      : "translate3d(0, 0, 0)",
    transition: isHovered ? "none" : "transform 0.3s ease-out",
    willChange: isHovered ? "transform" : "auto"
  })

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => {
      setIsHovered(false)
      setMousePosition({ x: 0, y: 0 })
    }
  }

  return { ref, magneticStyles, handlers, isHovered }
}
```

**Conversion Strategy:**
- Replace style object manipulation with state-driven CSS generation
- Use throttled mouse events for performance
- Implement conditional transitions for smooth enter/exit
- Leverage will-change for performance hints

---

### 5. use-mobile.tsx → PandaCSS Responsive Pattern

**Original Pattern:**
```tsx
const { isMobile, isTablet, isDesktop } = useMobile()
```

**PandaCSS Pattern:**
```tsx
import { css } from "@/styled-system/css"

// Convert to CSS-first responsive approach
const responsiveStyles = css({
  // Mobile-first base styles
  fontSize: "sm",
  padding: "2",
  
  // Tablet breakpoint
  "@media (min-width: 768px)": {
    fontSize: "base",
    padding: "4"
  },
  
  // Desktop breakpoint  
  "@media (min-width: 1024px)": {
    fontSize: "lg",
    padding: "6"
  }
})

// For JavaScript-based detection (when needed)
const useResponsiveDetection = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth
      if (width < 768) setScreenSize('mobile')
      else if (width < 1024) setScreenSize('tablet') 
      else setScreenSize('desktop')
    }

    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => window.removeEventListener('resize', updateScreenSize)
  }, [])

  return { screenSize, isMobile: screenSize === 'mobile' }
}
```

**Conversion Strategy:**
- Prefer CSS media queries over JavaScript detection
- Use PandaCSS responsive syntax for breakpoints
- Keep JS detection for conditional logic only
- Follow mobile-first responsive design

---

### 6. use-feature-flags.tsx → Context + PandaCSS Pattern

**Original Pattern:**
```tsx
const { isEnabled } = useFeatureFlags()
```

**PandaCSS Pattern:**
```tsx
import { css, cva } from "@/styled-system/css"

// Feature flag context remains largely the same
const FeatureFlagContext = createContext<{
  flags: Record<string, boolean>
  isEnabled: (flag: string) => boolean
}>({ flags: {}, isEnabled: () => false })

// Visual states with PandaCSS
const featureStateStyles = cva({
  variants: {
    enabled: {
      true: { opacity: 1, pointerEvents: "auto" },
      false: { opacity: 0.5, pointerEvents: "none" }
    },
    state: {
      beta: { 
        position: "relative",
        "&::after": {
          content: '"BETA"',
          position: "absolute",
          top: "0",
          right: "0",
          fontSize: "xs",
          backgroundColor: "warning",
          color: "warning.foreground",
          padding: "1",
          borderRadius: "sm"
        }
      },
      experimental: {
        border: "2px dashed",
        borderColor: "destructive"
      }
    }
  }
})

const useFeatureFlag = (flag: string) => {
  const { isEnabled } = useContext(FeatureFlagContext)
  const enabled = isEnabled(flag)
  
  const getFeatureStyles = (state?: 'beta' | 'experimental') =>
    featureStateStyles({ enabled, state })

  return { enabled, getFeatureStyles }
}
```

**Conversion Strategy:**
- Keep context logic unchanged
- Add visual state management with CVA
- Provide styling helpers for feature states
- Support beta/experimental visual indicators

---

## Common Conversion Patterns

### Pattern 1: State-Driven CSS Generation
```tsx
// Instead of: useRef + imperative style manipulation
const [animationState, setAnimationState] = useState('idle')
const styles = css({
  transform: animationState === 'active' ? 'scale(1.1)' : 'scale(1)',
  transition: 'transform 0.3s ease-out'
})
```

### Pattern 2: CVA for Multi-State Components
```tsx
const componentStyles = cva({
  base: { transition: "all 0.3s ease-out" },
  variants: {
    state: {
      idle: { /* styles */ },
      hover: { /* styles */ },
      active: { /* styles */ }
    }
  }
})
```

### Pattern 3: CSS Custom Properties for Dynamic Values
```tsx
const dynamicStyles = css({
  "--progress": `${progress}%`,
  "--rotation": `${rotation}deg`,
  transform: "rotate(var(--rotation))",
  background: `conic-gradient(from 0deg, transparent 0%, primary var(--progress))`
})
```

### Pattern 4: Performance-Optimized Transforms
```tsx
const performantStyles = css({
  transform: `translate3d(${x}px, ${y}px, 0)`,
  willChange: isAnimating ? "transform" : "auto",
  backfaceVisibility: "hidden"
})
```

## Performance Considerations

### Hardware Acceleration
- Always use `translate3d()` instead of `translateX/Y`
- Set `backfaceVisibility: "hidden"` for complex animations
- Use `will-change` conditionally, not permanently

### Animation Budgeting
```tsx
const useAnimationBudget = (maxConcurrent = 10) => {
  const [activeCount, setActiveCount] = useState(0)
  
  const requestAnimation = () => activeCount < maxConcurrent
  const releaseAnimation = () => setActiveCount(prev => Math.max(0, prev - 1))
  
  return { requestAnimation, releaseAnimation }
}
```

### Intersection Observer Pattern
```tsx
const useIntersectionTrigger = (callback: () => void, options = {}) => {
  const ref = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && callback(),
      { threshold: 0.1, ...options }
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [callback])
  
  return ref
}
```

## Testing Strategies

### Animation State Testing
```tsx
// Test animation states with explicit state management
const { getByTestId } = render(<AnimatedComponent />)
const element = getByTestId('animated-element')

fireEvent.click(element)
expect(element).toHaveClass(expect.stringContaining('scale'))
```

### Performance Testing
```tsx
// Test will-change optimization
const { container } = render(<ParallaxComponent />)
const parallaxElement = container.querySelector('[data-testid="parallax"]')

fireEvent.scroll(window, { target: { scrollY: 100 } })
expect(parallaxElement).toHaveStyle('will-change: transform')
```

### Accessibility Testing
```tsx
// Test reduced motion compliance
Object.defineProperty(window, 'matchMedia', {
  value: jest.fn(() => ({
    matches: true, // prefers-reduced-motion: reduce
    addListener: jest.fn(),
    removeListener: jest.fn()
  }))
})

const { container } = render(<AnimatedComponent />)
expect(container.firstChild).toHaveStyle('animation: none')
```

## Migration Utilities

### Reusable Conversion Templates

#### Basic Animation Hook Template
```tsx
const useBasicAnimation = (config: AnimationConfig) => {
  const [state, setState] = useState('idle')
  
  const animationStyles = css({
    transition: `all ${config.duration}ms ${config.easing}`,
    transform: getTransformForState(state),
    opacity: getOpacityForState(state)
  })
  
  const trigger = () => setState('active')
  const reset = () => setState('idle')
  
  return { animationStyles, trigger, reset, state }
}
```

#### Intersection-Triggered Animation Template
```tsx
const useIntersectionAnimation = (config: IntersectionAnimationConfig) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      config.observerOptions
    )
    
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  
  const animationStyles = css({
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: `all ${config.duration}ms ${config.easing}`
  })
  
  return { ref, animationStyles, isVisible }
}
```

## Implementation Priority

### Phase 1: Simple Utility Hooks
1. `use-mobile.tsx` → CSS-first responsive patterns
2. `use-feature-flags.tsx` → Context + visual states
3. `use-haptics.ts` → No conversion needed (remains as-is)

### Phase 2: Dynamic Style Hooks  
1. `use-ripple.tsx` → State-managed ripple effects
2. `use-magnetic-hover.tsx` → Mouse-following transforms
3. `use-gradient-follow.tsx` → CSS custom property gradients

### Phase 3: Complex Animation Hooks
1. `use-parallax.tsx` → Intersection + scroll-based transforms
2. `use-stagger-reveal.tsx` → CVA + setTimeout staggering
3. `use-scroll-animations.tsx` → Intersection + CSS animations
4. `use-text-reveal.tsx` → Character-based reveal animations

### Phase 4: DOM Management Hooks
1. `use-animation.tsx` → General animation utilities
2. `use-gestures.ts` → Event-based interaction patterns
3. `use-performance-monitor.ts` → Performance tracking utilities
4. Remaining utility hooks

## Validation Checklist

### Technical Validation
- [ ] All 19 hooks have conversion strategies
- [ ] PandaCSS patterns are performance-optimized
- [ ] TypeScript types are properly defined
- [ ] Responsive design is mobile-first
- [ ] Accessibility considerations are included

### Performance Validation
- [ ] Hardware acceleration is utilized
- [ ] will-change is used conditionally
- [ ] Intersection observers prevent unnecessary work
- [ ] Animation budgeting is implemented
- [ ] Memory leaks are prevented

### Testing Validation
- [ ] Animation states are testable
- [ ] Performance optimizations are verifiable
- [ ] Reduced motion preferences are respected
- [ ] Cross-browser compatibility is ensured
- [ ] Mobile performance is optimized

## Next Steps

This mapping document provides the foundation for Issues #65, #66, and #67:

- **Issue #65**: Implement Phase 1 & 2 conversions (Simple + Dynamic hooks)
- **Issue #66**: Implement Phase 3 conversions (Complex animation hooks)  
- **Issue #67**: Implement Phase 4 conversions (DOM management hooks)

Each implementation phase should:
1. Follow the patterns defined in this document
2. Include comprehensive tests for all converted hooks
3. Maintain performance characteristics of original hooks
4. Ensure backward compatibility where possible
5. Document any breaking changes or migration notes