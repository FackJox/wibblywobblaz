# Story: Add Breathing/Pulse Animations

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want subtle animated elements that give life to the interface,
so that the website feels dynamic and engaging without being distracting.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Ambient animation pattern
- Existing System Impact: Enhances key static elements
- Satisfaction Score: 74/100

## Acceptance Criteria

1. Logo has subtle breathing animation (scale 1.0 to 1.02)
2. CTAs have gentle pulse on idle (opacity variation)
3. Active form fields show breathing border
4. Animations are smooth and continuous
5. CPU usage remains under 5% for animations
6. Animations pause when tab is not visible
7. Respects prefers-reduced-motion setting
8. Existing functionality unaffected
9. No layout shift from animations

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Logo likely in header/navigation
- Multiple CTAs in `app/page.tsx`
- Form fields using Radix UI components
- Theme provider for dark/light modes

**Elements to Animate:**
- Main logo/brand mark
- Primary CTA buttons
- Newsletter signup field
- Social media links
- Key navigation items

### Integration Approach

1. **Create Breathing Animation Variants:**
```typescript
// lib/animations/variants/breathing.ts
export const breathingVariants = {
  logo: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 4,
      ease: "easeInOut",
      repeat: Infinity,
    }
  },
  pulse: {
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    }
  },
  border: {
    boxShadow: [
      "0 0 0 0 rgba(59, 130, 246, 0)",
      "0 0 0 4px rgba(59, 130, 246, 0.3)",
      "0 0 0 0 rgba(59, 130, 246, 0)",
    ],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
    }
  }
}
```

2. **Performance Optimization Hook:**
```typescript
// lib/animations/hooks/useBreathing.ts
export const useBreathing = (enabled = true) => {
  const [isVisible, setIsVisible] = useState(true)
  const prefersReducedMotion = usePrefersReducedMotion()
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden)
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])
  
  return enabled && isVisible && !prefersReducedMotion
}
```

### Technical Constraints

- Animations must not cause layout reflow
- Use transform and opacity only for GPU acceleration
- Pause when page not visible to save battery
- Keep animation durations between 2-4 seconds
- Ensure animations don't conflict with hover states

### Implementation Details

```typescript
// components/ui/breathing-element.tsx
import { motion } from 'framer-motion'
import { useBreathing } from '@/lib/animations/hooks/useBreathing'

export const BreathingElement = ({ 
  children, 
  variant = 'pulse',
  className 
}: BreathingElementProps) => {
  const shouldAnimate = useBreathing()
  
  return (
    <motion.div
      animate={shouldAnimate ? variant : false}
      variants={breathingVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

## Tasks / Subtasks

- [ ] Task 1: Setup breathing animation system
  - [ ] Create breathing animation variants
  - [ ] Build useBreathing performance hook
  - [ ] Add visibility change detection
  - [ ] Implement prefers-reduced-motion check

- [ ] Task 2: Apply to logo element
  - [ ] Locate logo component
  - [ ] Wrap with BreathingElement
  - [ ] Fine-tune scale values
  - [ ] Test across breakpoints

- [ ] Task 3: Enhance CTA buttons
  - [ ] Identify primary CTAs
  - [ ] Apply pulse animation
  - [ ] Ensure hover states still work
  - [ ] Adjust timing for subtlety

- [ ] Task 4: Animate form field focus
  - [ ] Create focus breathing variant
  - [ ] Apply to input components
  - [ ] Test with keyboard navigation
  - [ ] Ensure validation states work

- [ ] Task 5: Add to key UI elements
  - [ ] Social media icons
  - [ ] Navigation active states
  - [ ] Loading indicators
  - [ ] Card hover states

- [ ] Task 6: Performance optimization
  - [ ] Implement animation pooling
  - [ ] Add RAF throttling
  - [ ] Monitor CPU usage
  - [ ] Test battery impact on mobile

- [ ] Task 7: Cross-browser testing
  - [ ] Test Safari animation performance
  - [ ] Verify Firefox rendering
  - [ ] Check mobile browsers
  - [ ] Validate reduced motion

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Animation fatigue from too much movement
- **Mitigation**: Keep animations subtle, longer durations
- **Verification**: User testing for comfort levels

### Performance Risks

- **Risk**: Battery drain on mobile devices
- **Mitigation**: Pause when not visible, optimize with CSS where possible
- **Verification**: Battery usage testing on real devices

### UX Risks

- **Risk**: Distraction from content
- **Mitigation**: Very subtle scale/opacity changes
- **Verification**: A/B test with/without animations

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_BREATHING=false`
2. CSS class toggle: `.breathing-disabled`
3. Individual element control via props
4. Can remove wrapper components easily

### Safety Checks

- [ ] No layout shift measured in DevTools
- [ ] CPU usage under 5% with animations
- [ ] Animations pause when tab hidden
- [ ] Reduced motion preference respected
- [ ] All interactive elements still functional
- [ ] No accessibility issues introduced

## Definition of Done

- [ ] Breathing animations applied to specified elements
- [ ] Performance targets met (< 5% CPU)
- [ ] Visibility API integration working
- [ ] Reduced motion support implemented
- [ ] All existing functionality preserved
- [ ] Cross-browser testing completed
- [ ] Mobile performance validated
- [ ] Code reviewed and approved
- [ ] No console errors or warnings

## Notes

- Start with very subtle animations, can increase based on feedback
- Consider adding UI control for users to toggle animations
- These ambient animations set the "living" feel of the site
- Could extend to micro-interactions on scroll later

---

*Story Points: 3*
*Priority: Medium (Ambient enhancement)*
*Sprint: Current*