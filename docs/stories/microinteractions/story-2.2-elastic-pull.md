# Story: Add Elastic Pull Gestures

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want elastic, spring-based animations when transitioning between pages or sections,
so that navigation feels fluid and responsive to my actions.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Physics-based navigation pattern
- Existing System Impact: Enhances page transitions and scroll
- Satisfaction Score: 90/100 (TOP TIER)

## Acceptance Criteria

1. Page transitions use elastic spring physics
2. Pull-to-refresh gesture with rubber band effect
3. Elastic overscroll on content boundaries
4. Swipe navigation between sections with spring-back
5. Natural physics feel (not too bouncy)
6. Mobile-first implementation
7. Fallback for non-touch devices
8. Performance at 60fps during gestures
9. Gesture cancellation handled smoothly

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Two pages: "links" and "parties" in `app/page.tsx`
- Page state managed with `useState`
- Existing transition timing (800ms)
- Mobile menu with open/close states
- Scroll container refs already in place

**Transition Points:**
- Page switches (links ↔ parties)
- Mobile menu open/close
- Section scrolling
- Modal/overlay appearances
- Tab switches

### Integration Approach

1. **Gesture Detection System:**
```typescript
// lib/animations/hooks/useElasticGesture.ts
import { useSpring } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'

export const useElasticGesture = (onComplete: (direction: string) => void) => {
  const [{ x, y }, api] = useSpring(() => ({ 
    x: 0, 
    y: 0,
    config: {
      tension: 200,
      friction: 25,
      clamp: false
    }
  }))
  
  const bind = useGesture({
    onDrag: ({ down, movement: [mx, my], velocity, direction }) => {
      if (!down && Math.abs(mx) > 100) {
        onComplete(mx > 0 ? 'right' : 'left')
      }
      
      api.start({
        x: down ? mx : 0,
        y: down ? my : 0,
        immediate: down,
        config: {
          velocity: velocity[0],
          decay: !down
        }
      })
    },
    onWheel: ({ direction: [, dy] }) => {
      // Handle overscroll
      if (dy < 0 && window.scrollY === 0) {
        api.start({ y: -dy * 0.5 })
        setTimeout(() => api.start({ y: 0 }), 300)
      }
    }
  })
  
  return { bind, x, y }
}
```

2. **Elastic Page Transition:**
```typescript
// components/elastic-page-transition.tsx
import { animated, useTransition } from '@react-spring/web'

export const ElasticPageTransition = ({ 
  currentPage,
  children 
}) => {
  const transitions = useTransition(currentPage, {
    from: { transform: 'translate3d(100%,0,0)', opacity: 0 },
    enter: { transform: 'translate3d(0%,0,0)', opacity: 1 },
    leave: { transform: 'translate3d(-100%,0,0)', opacity: 0 },
    config: {
      tension: 180,
      friction: 25,
      mass: 1
    }
  })
  
  return transitions((style, item) => (
    <animated.div style={style}>
      {children}
    </animated.div>
  ))
}
```

3. **Pull-to-Refresh Implementation:**
```typescript
// components/pull-to-refresh.tsx
export const PullToRefresh = ({ onRefresh, children }) => {
  const [{ y }, api] = useSpring(() => ({ y: 0 }))
  const threshold = 80
  
  const bind = useGesture({
    onDrag: ({ down, movement: [, my], memo = y.get() }) => {
      if (window.scrollY === 0 && my > 0) {
        api.start({
          y: down ? Math.min(my, threshold * 1.5) : 0,
          config: { tension: 300, friction: 30 }
        })
        
        if (!down && my > threshold) {
          onRefresh()
        }
      }
      return memo
    }
  })
  
  return (
    <animated.div {...bind()} style={{ y }}>
      {children}
    </animated.div>
  )
}
```

### Technical Constraints

- Must handle gesture cancellation gracefully
- Prevent conflicting with native scroll
- Account for iOS rubber band scrolling
- Maintain 60fps during gestures
- Handle edge cases (rapid gestures)

### Implementation Details

```typescript
// Spring configurations
const springConfigs = {
  wobbly: { tension: 180, friction: 12 },
  stiff: { tension: 210, friction: 20 },
  slow: { tension: 280, friction: 60 },
  elastic: { tension: 200, friction: 25 }
}

// Gesture thresholds
const gestureThresholds = {
  swipe: 100,  // px to trigger navigation
  pull: 80,    // px to trigger refresh
  velocity: 0.5 // minimum velocity
}
```

## Tasks / Subtasks

- [ ] Task 1: Setup gesture libraries
  - [ ] Install @react-spring/web
  - [ ] Install @use-gesture/react
  - [ ] Configure TypeScript types
  - [ ] Create gesture utilities

- [ ] Task 2: Implement elastic page transitions
  - [ ] Replace current transition system
  - [ ] Add spring physics configuration
  - [ ] Handle transition interruption
  - [ ] Test with existing pages

- [ ] Task 3: Add swipe navigation
  - [ ] Detect horizontal swipe gestures
  - [ ] Trigger page changes on swipe
  - [ ] Add visual feedback during swipe
  - [ ] Implement gesture cancellation

- [ ] Task 4: Create pull-to-refresh
  - [ ] Build pull gesture detection
  - [ ] Add elastic pull animation
  - [ ] Show refresh indicator
  - [ ] Integrate with data fetching

- [ ] Task 5: Implement elastic overscroll
  - [ ] Detect scroll boundaries
  - [ ] Add rubber band effect
  - [ ] Coordinate with native iOS behavior
  - [ ] Test on various devices

- [ ] Task 6: Enhance mobile menu
  - [ ] Add swipe-to-close gesture
  - [ ] Elastic menu slide animation
  - [ ] Spring-based backdrop fade
  - [ ] Handle gesture conflicts

- [ ] Task 7: Performance and polish
  - [ ] Optimize for 60fps
  - [ ] Add haptic feedback triggers
  - [ ] Fine-tune spring values
  - [ ] Cross-device testing

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Gesture conflicts with native scrolling
- **Mitigation**: Proper gesture zones and thresholds
- **Verification**: Extensive device testing

### Performance Risks

- **Risk**: Frame drops during complex gestures
- **Mitigation**: Use transform3d, optimize spring calculations
- **Verification**: Performance profiling on low-end devices

### UX Risks

- **Risk**: Over-elastic feeling unnatural
- **Mitigation**: Conservative spring values, user testing
- **Verification**: A/B test different configurations

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_ELASTIC=false`
2. Fallback to original transitions
3. Progressive enhancement approach
4. Can disable per-gesture type

### Safety Checks

- [ ] Native scroll not blocked
- [ ] Back button navigation works
- [ ] Gesture cancellation handled
- [ ] No infinite spring oscillation
- [ ] Accessibility maintained
- [ ] Touch targets unchanged

## Definition of Done

- [ ] Elastic transitions implemented
- [ ] Swipe navigation functional
- [ ] Pull-to-refresh working
- [ ] Overscroll effects added
- [ ] All gestures cancelable
- [ ] 60fps performance achieved
- [ ] Mobile testing completed
- [ ] Haptic feedback integrated
- [ ] Code reviewed and approved
- [ ] Documentation updated

## Notes

- Critical for mobile-first experience
- Sets foundation for gesture-based UI
- Spring values need fine-tuning per device
- Consider gesture tutorials for users
- May conflict with browser gestures

---

*Story Points: 6*
*Priority: Critical (Mobile experience)*
*Sprint: Current*