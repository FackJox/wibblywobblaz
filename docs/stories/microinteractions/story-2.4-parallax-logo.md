# Story: Implement Parallax Logo Movement

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want the logo to move at a different speed when scrolling,
so that the interface has depth and a premium, dimensional feel.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Depth perception pattern
- Existing System Impact: Enhances header/hero sections
- Satisfaction Score: 80/100

## Acceptance Criteria

1. Logo moves at 0.5x scroll speed creating depth
2. Smooth parallax without stuttering
3. Works on both scroll up and down
4. Reduced effect on mobile for performance
5. No layout shift or content jumping
6. Respects reduced motion preference
7. Logo remains clickable/functional
8. Performance maintains 60fps
9. Effect boundaries prevent logo from leaving viewport

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Logo likely in header or hero section
- Fixed/sticky positioning possible
- Scroll handling in main layout
- Mobile responsive design

**Parallax Targets:**
- Main brand logo
- Hero background elements
- Section dividers
- Background patterns
- Decorative elements

### Integration Approach

1. **Parallax Hook Implementation:**
```typescript
// lib/animations/hooks/useParallax.ts
import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export const useParallax = (rate = 0.5, offset = [0, 1]) => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any
  })
  
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `${rate * 100}%`]
  )
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1, 1, 0.3]
  )
  
  return { ref, y, opacity, scrollYProgress }
}
```

2. **Parallax Logo Component:**
```typescript
// components/ui/parallax-logo.tsx
import { motion } from 'framer-motion'
import { useParallax } from '@/lib/animations/hooks/useParallax'

export const ParallaxLogo = ({ 
  src, 
  alt,
  rate = 0.5,
  className 
}) => {
  const { ref, y } = useParallax(rate)
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.img
        src={src}
        alt={alt}
        className={className}
        style={{
          y: isMobile ? 0 : y,
        }}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring" }}
      />
    </div>
  )
}
```

3. **Advanced Parallax System:**
```typescript
// lib/animations/parallax-controller.ts
export class ParallaxController {
  private elements: Map<string, ParallaxElement> = new Map()
  private raf: number | null = null
  
  register(id: string, element: HTMLElement, options: ParallaxOptions) {
    this.elements.set(id, {
      element,
      options,
      bounds: element.getBoundingClientRect()
    })
  }
  
  private update = () => {
    const scrollY = window.scrollY
    const windowHeight = window.innerHeight
    
    this.elements.forEach(({ element, options, bounds }) => {
      const { rate = 0.5, max = 100 } = options
      const progress = (scrollY - bounds.top) / windowHeight
      const offset = Math.min(Math.max(progress * rate * 100, -max), max)
      
      element.style.transform = `translateY(${offset}px)`
    })
    
    this.raf = requestAnimationFrame(this.update)
  }
  
  start() {
    this.update()
  }
  
  stop() {
    if (this.raf) cancelAnimationFrame(this.raf)
  }
}
```

### Technical Constraints

- Must handle dynamic content height changes
- Prevent parallax from breaking fixed headers
- Account for iOS bounce scrolling
- Optimize for smooth 60fps scrolling
- Handle resize events properly

### Implementation Details

```typescript
// Parallax configurations
const parallaxRates = {
  subtle: 0.3,
  normal: 0.5,
  dramatic: 0.8,
  inverse: -0.3
}

// Performance optimizations
const parallaxConfig = {
  throttle: 16, // ms (60fps)
  boundaries: true,
  mobileDisabled: true,
  gpuAcceleration: true
}

// Viewport detection
const viewportTriggers = {
  start: "top bottom",
  center: "center center", 
  end: "bottom top"
}
```

## Tasks / Subtasks

- [ ] Task 1: Create parallax infrastructure
  - [ ] Build useParallax hook
  - [ ] Setup scroll tracking
  - [ ] Add performance throttling
  - [ ] Create boundary system

- [ ] Task 2: Implement logo parallax
  - [ ] Locate logo component
  - [ ] Apply parallax effect
  - [ ] Set appropriate rate
  - [ ] Test scroll performance

- [ ] Task 3: Add depth layers
  - [ ] Background layer (slowest)
  - [ ] Content layer (normal)
  - [ ] Foreground layer (faster)
  - [ ] Coordinate layer speeds

- [ ] Task 4: Mobile optimization
  - [ ] Detect device capabilities
  - [ ] Reduce or disable on mobile
  - [ ] Test iOS elastic scrolling
  - [ ] Verify touch scroll smoothness

- [ ] Task 5: Enhance hero section
  - [ ] Apply to hero background
  - [ ] Add to decorative elements
  - [ ] Create depth composition
  - [ ] Fine-tune rates

- [ ] Task 6: Performance optimization
  - [ ] Implement RAF throttling
  - [ ] Use transform3d for GPU
  - [ ] Add will-change hints
  - [ ] Monitor scroll performance

- [ ] Task 7: Boundary and edge cases
  - [ ] Prevent logo escape
  - [ ] Handle rapid scrolling
  - [ ] Test with dynamic content
  - [ ] Verify resize behavior

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Scroll jank on complex pages
- **Mitigation**: Throttle updates, use GPU acceleration
- **Verification**: Performance profiling during scroll

### Performance Risks

- **Risk**: Frame drops on low-end devices
- **Mitigation**: Progressive enhancement, mobile disable
- **Verification**: Test on various devices

### UX Risks

- **Risk**: Disorientation from too much movement
- **Mitigation**: Subtle rates, respect reduced motion
- **Verification**: User testing for comfort

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_PARALLAX=false`
2. CSS class: `.no-parallax`
3. Rate adjustment: Can set to 0 for static
4. Component prop: `disableParallax`

### Safety Checks

- [ ] No layout shifts occur
- [ ] Logo remains interactive
- [ ] Scroll performance maintained
- [ ] Boundaries working correctly
- [ ] Mobile experience preserved
- [ ] Accessibility unaffected

## Definition of Done

- [ ] Parallax effect on logo working
- [ ] Smooth 60fps scrolling maintained
- [ ] Mobile optimization implemented
- [ ] Boundaries preventing escape
- [ ] Reduced motion respected
- [ ] Multiple depth layers coordinated
- [ ] Cross-browser testing completed
- [ ] Performance profiling passed
- [ ] Code reviewed and approved
- [ ] Visual QA completed

## Notes

- Creates premium feel with minimal effort
- Can extend to other elements later
- Consider parallax intensity settings
- May combine with scroll-triggered animations
- Good foundation for scroll storytelling

---

*Story Points: 4*
*Priority: Medium (Visual enhancement)*
*Sprint: Current*