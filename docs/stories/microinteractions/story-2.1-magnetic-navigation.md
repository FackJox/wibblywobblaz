# Story: Implement Magnetic Navigation Elements

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want navigation elements to subtly follow my cursor movement,
so that I feel a playful, engaging connection with the interface.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Premium interaction pattern
- Existing System Impact: Enhances navigation and buttons
- Satisfaction Score: 92/100 (TOP TIER)

## Acceptance Criteria

1. Navigation items shift subtly toward cursor on proximity (within 100px)
2. Magnetic effect scales with distance (stronger when closer)
3. Smooth spring physics for natural movement
4. Returns to original position when cursor leaves proximity
5. Works for both desktop mouse and touch devices
6. Effect disabled on mobile devices under 768px width
7. No impact on click target areas or accessibility
8. Performance maintains 60fps during interaction
9. Can be disabled via user preference

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Navigation in header component
- Menu component with mobile/desktop variants
- Button components throughout page
- Links in navigation and footer

**Elements to Enhance:**
- Main navigation links
- CTA buttons
- Social media icons
- Menu hamburger/close button
- Footer navigation items

### Integration Approach

1. **Magnetic Hook Implementation:**
```typescript
// lib/animations/hooks/useMagnetic.ts
export const useMagnetic = (strength = 0.5) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLElement>(null)
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      
      const distanceX = e.clientX - centerX
      const distanceY = e.clientY - centerY
      const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)
      
      const maxDistance = 100
      if (distance < maxDistance) {
        const power = (maxDistance - distance) / maxDistance
        setPosition({
          x: distanceX * strength * power * 0.5,
          y: distanceY * strength * power * 0.5
        })
      } else {
        setPosition({ x: 0, y: 0 })
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [strength])
  
  return { ref, position }
}
```

2. **Magnetic Component Wrapper:**
```typescript
// components/ui/magnetic-element.tsx
import { motion, useSpring, useTransform } from 'framer-motion'
import { useMagnetic } from '@/lib/animations/hooks/useMagnetic'

export const MagneticElement = ({ 
  children, 
  strength = 0.5,
  className 
}) => {
  const { ref, position } = useMagnetic(strength)
  const springConfig = { damping: 15, stiffness: 150 }
  const x = useSpring(position.x, springConfig)
  const y = useSpring(position.y, springConfig)
  
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

### Technical Constraints

- Must not affect actual click areas (visual only)
- Disable on touch devices for performance
- Smooth spring animation without lag
- Handle rapid cursor movements
- Maintain original hover states

### Implementation Details

```typescript
// Boundary detection
const magneticBoundary = {
  desktop: 100, // pixels
  tablet: 0,    // disabled
  mobile: 0     // disabled
}

// Strength variants
const magneticStrength = {
  subtle: 0.3,
  normal: 0.5,
  strong: 0.8
}

// Touch device detection
const isTouchDevice = 'ontouchstart' in window
```

## Tasks / Subtasks

- [ ] Task 1: Create magnetic interaction system
  - [ ] Build useMagnetic hook with distance calculation
  - [ ] Implement spring physics for smooth movement
  - [ ] Add boundary detection logic
  - [ ] Create touch device detection

- [ ] Task 2: Build MagneticElement component
  - [ ] Create wrapper component with motion
  - [ ] Add strength configuration
  - [ ] Implement position reset on leave
  - [ ] Add TypeScript types

- [ ] Task 3: Apply to navigation elements
  - [ ] Wrap main nav links
  - [ ] Apply to mobile menu button
  - [ ] Test with keyboard navigation
  - [ ] Verify accessibility maintained

- [ ] Task 4: Enhance CTA buttons
  - [ ] Apply to primary CTAs
  - [ ] Fine-tune strength values
  - [ ] Coordinate with ripple effects
  - [ ] Test click accuracy

- [ ] Task 5: Add to icon elements
  - [ ] Social media icons
  - [ ] Interactive badges
  - [ ] Close/menu buttons
  - [ ] Settings toggles

- [ ] Task 6: Performance optimization
  - [ ] Implement RAF throttling
  - [ ] Use passive event listeners
  - [ ] GPU acceleration with will-change
  - [ ] Monitor with Performance API

- [ ] Task 7: User preference system
  - [ ] Add settings toggle
  - [ ] Store preference in localStorage
  - [ ] Respect reduced motion
  - [ ] Document for users

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Interfering with precise clicking
- **Mitigation**: Visual movement only, click targets unchanged
- **Verification**: Click accuracy testing

### Performance Risks

- **Risk**: Continuous mousemove listener impact
- **Mitigation**: Throttle events, boundary detection
- **Verification**: CPU profiling during interaction

### UX Risks

- **Risk**: Motion sickness or distraction
- **Mitigation**: Subtle movement, user preference toggle
- **Verification**: User testing with various sensitivities

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_MAGNETIC=false`
2. Component prop: `disableMagnetic`
3. CSS class override: `.no-magnetic`
4. Wrapper component easy to remove

### Safety Checks

- [ ] Click targets remain accurate
- [ ] Keyboard navigation unaffected
- [ ] Touch scrolling works normally
- [ ] No layout shifts occur
- [ ] Accessibility tools function correctly
- [ ] Performance targets met

## Definition of Done

- [ ] Magnetic effect working on specified elements
- [ ] Spring physics feel natural
- [ ] Distance-based strength working
- [ ] Touch device detection functional
- [ ] Performance at 60fps maintained
- [ ] User preference system implemented
- [ ] Accessibility verified
- [ ] Cross-browser testing completed
- [ ] Code reviewed and approved
- [ ] Documentation updated

## Notes

- This is the highest-scoring interaction (92/100)
- Creates premium, playful feel
- Consider A/B testing different strength values
- May extend to card hover effects later
- Coordinate with other cursor-based effects

---

*Story Points: 5*
*Priority: Critical (Top satisfaction score)*
*Sprint: Current*