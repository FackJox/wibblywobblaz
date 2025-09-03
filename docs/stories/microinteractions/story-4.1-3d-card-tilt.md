# Story: Implement 3D Card Tilt Effects

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want cards to tilt in 3D space when I hover over them,
so that the interface feels interactive and dimensional.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: 3D interaction pattern
- Existing System Impact: Enhances card components
- Satisfaction Score: 68/100

## Acceptance Criteria

1. Cards tilt based on mouse position within card
2. Smooth 3D rotation with perspective
3. Highlight/shine effect follows cursor
4. Returns to flat on mouse leave
5. Touch-friendly alternative on mobile
6. Respects reduced motion preference
7. No impact on card content functionality
8. Performance at 60fps maintained
9. Works with different card sizes

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Card components in `components/ui/card.tsx`
- Used for event cards, feature cards
- Radix UI based components
- Various card sizes and layouts

**Cards to Enhance:**
- Event/party cards
- Feature showcase cards
- Social media embed cards
- Testimonial cards
- Image gallery cards

### Integration Approach

1. **3D Tilt Hook:**
```typescript
// lib/animations/hooks/use3DTilt.ts
import { useRef, useState, useEffect } from 'react'

export const use3DTilt = (options = {}) => {
  const {
    maxTilt = 20,
    perspective = 1000,
    scale = 1.05,
    speed = 1000,
    glare = true,
    maxGlare = 0.5
  } = options
  
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [glareStyle, setGlareStyle] = useState({})
  const ref = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const tiltX = ((y - centerY) / centerY) * maxTilt
    const tiltY = ((centerX - x) / centerX) * maxTilt
    
    setTilt({ x: tiltX, y: tiltY })
    
    if (glare) {
      const glareAngle = Math.atan2(y - centerY, x - centerX) * 180 / Math.PI
      const glareOpacity = (Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2) / 
        Math.sqrt(centerX ** 2 + centerY ** 2)) * maxGlare
      
      setGlareStyle({
        transform: `rotate(${glareAngle}deg) translate(-50%, -50%)`,
        opacity: glareOpacity
      })
    }
  }
  
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setGlareStyle({ opacity: 0 })
  }
  
  const style = {
    transform: `
      perspective(${perspective}px)
      rotateX(${tilt.x}deg)
      rotateY(${tilt.y}deg)
      scale3d(${scale}, ${scale}, ${scale})
    `,
    transition: `transform ${speed}ms cubic-bezier(0.03, 0.98, 0.52, 0.99)`
  }
  
  return {
    ref,
    style,
    glareStyle,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave
  }
}
```

2. **3D Card Component:**
```typescript
// components/ui/card-3d.tsx
import { use3DTilt } from '@/lib/animations/hooks/use3DTilt'
import { Card, CardProps } from './card'

export const Card3D = ({ 
  children, 
  className,
  glare = true,
  ...props 
}: CardProps & { glare?: boolean }) => {
  const tilt = use3DTilt({ glare })
  
  return (
    <div 
      ref={tilt.ref}
      className="relative"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <Card 
        className={className} 
        style={tilt.style}
        {...props}
      >
        {glare && (
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.7) 50%, transparent 60%)',
              ...tilt.glareStyle
            }}
          />
        )}
        <div style={{ transform: 'translateZ(50px)' }}>
          {children}
        </div>
      </Card>
    </div>
  )
}
```

3. **Mobile Touch Alternative:**
```typescript
// lib/animations/hooks/useTiltTouch.ts
export const useTiltTouch = () => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const { beta, gamma } = e
      if (beta !== null && gamma !== null) {
        setTilt({
          x: Math.min(Math.max(beta - 30, -20), 20),
          y: Math.min(Math.max(gamma, -20), 20)
        })
      }
    }
    
    window.addEventListener('deviceorientation', handleOrientation)
    return () => window.removeEventListener('deviceorientation', handleOrientation)
  }, [])
  
  return tilt
}
```

### Technical Constraints

- CSS 3D transforms browser support
- Performance on complex cards
- Touch device alternatives
- Z-index stacking contexts
- Preserve-3d compatibility

### Implementation Details

```typescript
// Tilt configurations
const tiltPresets = {
  subtle: { maxTilt: 10, scale: 1.02 },
  normal: { maxTilt: 20, scale: 1.05 },
  dramatic: { maxTilt: 30, scale: 1.1 }
}

// Performance settings
const performanceConfig = {
  throttle: 16, // 60fps
  gpuAcceleration: true,
  willChange: 'transform'
}

// Glare effects
const glareStyles = {
  subtle: { maxGlare: 0.3 },
  normal: { maxGlare: 0.5 },
  intense: { maxGlare: 0.8 }
}
```

## Tasks / Subtasks

- [ ] Task 1: Create 3D tilt infrastructure
  - [ ] Build use3DTilt hook
  - [ ] Calculate mouse position math
  - [ ] Implement rotation logic
  - [ ] Add transition smoothing

- [ ] Task 2: Build Card3D component
  - [ ] Wrap existing Card component
  - [ ] Add 3D transform styles
  - [ ] Implement glare effect
  - [ ] Handle different card sizes

- [ ] Task 3: Add mobile support
  - [ ] Device orientation API
  - [ ] Touch gesture alternative
  - [ ] Gyroscope integration
  - [ ] Fallback for unsupported

- [ ] Task 4: Apply to existing cards
  - [ ] Event cards enhancement
  - [ ] Feature cards
  - [ ] Gallery cards
  - [ ] Test all card variants

- [ ] Task 5: Performance optimization
  - [ ] GPU acceleration
  - [ ] Transform caching
  - [ ] Throttle mouse events
  - [ ] Monitor frame rate

- [ ] Task 6: Visual polish
  - [ ] Fine-tune tilt angles
  - [ ] Adjust glare intensity
  - [ ] Shadow depth effects
  - [ ] Parallax card layers

- [ ] Task 7: Accessibility
  - [ ] Reduced motion support
  - [ ] Keyboard navigation
  - [ ] Screen reader testing
  - [ ] Focus indicators

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Performance on many cards
- **Mitigation**: Limit to viewport visible cards
- **Verification**: Stress test with card grids

### Browser Compatibility Risks

- **Risk**: 3D transform support varies
- **Mitigation**: Feature detection, 2D fallback
- **Verification**: Cross-browser testing

### UX Risks

- **Risk**: Motion sickness from tilting
- **Mitigation**: Subtle angles, user preference
- **Verification**: User comfort testing

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_3D_CARDS=false`
2. Fallback to standard Card component
3. Progressive enhancement approach
4. Can disable per card

### Safety Checks

- [ ] Cards remain clickable
- [ ] Content stays readable
- [ ] Performance maintained
- [ ] No z-index issues
- [ ] Mobile experience works
- [ ] Accessibility preserved

## Definition of Done

- [ ] 3D tilt effect working on cards
- [ ] Smooth mouse tracking implemented
- [ ] Glare effect following cursor
- [ ] Mobile alternative functional
- [ ] Performance at 60fps
- [ ] All card types enhanced
- [ ] Reduced motion supported
- [ ] Cross-browser tested
- [ ] Code reviewed and approved
- [ ] Visual QA completed

## Notes

- Creates premium, interactive feel
- Good for showcasing important content
- Consider depth layering for richer effect
- May add shadow dynamics later
- Keep tilt subtle to avoid distraction

---

*Story Points: 4*
*Priority: Low (Polish enhancement)*
*Sprint: Next*