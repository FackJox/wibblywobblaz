# Story: Create Liquid Morphing Transitions

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want smooth, organic transitions that morph between states,
so that the interface feels fluid and alive with seamless visual continuity.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Organic animation pattern
- Existing System Impact: Enhances all transitions and state changes
- Satisfaction Score: 89/100 (TOP TIER)

## Acceptance Criteria

1. Page transitions use liquid morphing effects
2. Button hover states morph smoothly
3. Link underlines flow like liquid
4. Loading states use organic blob animations
5. Shape morphing maintains 60fps
6. SVG filter effects work cross-browser
7. Graceful fallback for older browsers
8. Color transitions blend naturally
9. No jarring visual jumps

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Standard CSS transitions
- Hover states on buttons/links
- Loading states in forms
- Page transition with opacity/transform
- SVG support in Next.js

**Elements to Enhance:**
- Page transition overlays
- Button background morphing
- Link underline animations
- Loading spinners → liquid blobs
- Menu open/close transitions
- Card hover effects

### Integration Approach

1. **SVG Filter System:**
```typescript
// components/liquid-filter.tsx
export const LiquidFilter = () => (
  <svg className="hidden">
    <defs>
      <filter id="liquid-morph">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.02" 
          numOctaves="3"
          result="warp" 
          seed="1"
        />
        <feDisplacementMap 
          xChannelSelector="R" 
          yChannelSelector="G" 
          scale="30" 
          in="SourceGraphic" 
          in2="warp" 
        />
        <feGaussianBlur stdDeviation="2" />
      </filter>
      
      <filter id="gooey">
        <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
        <feColorMatrix 
          in="blur" 
          mode="matrix" 
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" 
          result="gooey" 
        />
        <feComposite in="SourceGraphic" in2="gooey" operator="atop"/>
      </filter>
    </defs>
  </svg>
)
```

2. **Liquid Morphing Hook:**
```typescript
// lib/animations/hooks/useLiquidMorph.ts
import { useSpring, animated } from '@react-spring/web'

export const useLiquidMorph = (isActive: boolean) => {
  const springs = useSpring({
    from: { 
      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
      transform: 'rotate(0deg) scale(1)'
    },
    to: async (next) => {
      while (isActive) {
        await next({
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          transform: 'rotate(180deg) scale(1.1)'
        })
        await next({
          borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%',
          transform: 'rotate(360deg) scale(1)'
        })
      }
    },
    config: { 
      duration: 8000,
      easing: t => t < 0.5 
        ? 4 * t * t * t 
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
    }
  })
  
  return springs
}
```

3. **Liquid Link Underline:**
```typescript
// components/ui/liquid-link.tsx
export const LiquidLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <Link 
      href={href}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      <svg 
        className="absolute -bottom-1 left-0 w-full h-2"
        preserveAspectRatio="none"
      >
        <animated.path
          d={isHovered 
            ? "M0,1 Q25,0 50,1 T100,1 L100,2 L0,2 Z"
            : "M0,2 Q25,2 50,2 T100,2 L100,2 L0,2 Z"
          }
          fill="currentColor"
          style={{ 
            filter: 'url(#liquid-morph)',
            transition: 'd 0.3s ease-in-out'
          }}
        />
      </svg>
    </Link>
  )
}
```

4. **Liquid Page Transition:**
```typescript
// components/liquid-transition.tsx
export const LiquidTransition = ({ isTransitioning }) => {
  const morph = useLiquidMorph(isTransitioning)
  
  return (
    <animated.div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        ...morph,
        background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
        filter: 'url(#gooey)',
        opacity: isTransitioning ? 1 : 0,
        transform: morph.transform
      }}
    />
  )
}
```

### Technical Constraints

- SVG filters can impact performance
- Need fallbacks for Safari quirks
- Complex morphing affects paint time
- Must optimize for mobile GPUs
- Color interpolation in correct space

### Implementation Details

```typescript
// Morph timing functions
const morphEasings = {
  organic: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  liquid: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}

// Liquid color transitions
const liquidColors = {
  primary: {
    from: 'hsl(250, 84%, 54%)',
    to: 'hsl(280, 73%, 62%)'
  },
  secondary: {
    from: 'hsl(200, 74%, 54%)',
    to: 'hsl(220, 83%, 62%)'
  }
}
```

## Tasks / Subtasks

- [ ] Task 1: Setup SVG filter infrastructure
  - [ ] Create filter definitions component
  - [ ] Add gooey and morph filters
  - [ ] Test browser compatibility
  - [ ] Optimize filter performance

- [ ] Task 2: Build liquid morphing system
  - [ ] Create useLiquidMorph hook
  - [ ] Implement shape morphing logic
  - [ ] Add color blending utilities
  - [ ] Setup animation loops

- [ ] Task 3: Enhance page transitions
  - [ ] Create liquid overlay component
  - [ ] Integrate with existing routing
  - [ ] Add morph timing controls
  - [ ] Test transition smoothness

- [ ] Task 4: Implement liquid buttons
  - [ ] Add morphing hover states
  - [ ] Create blob background effect
  - [ ] Coordinate with ripple effects
  - [ ] Maintain click accuracy

- [ ] Task 5: Create liquid underlines
  - [ ] Build SVG wave generator
  - [ ] Add hover morph animation
  - [ ] Apply to all links
  - [ ] Test with different font sizes

- [ ] Task 6: Liquid loading states
  - [ ] Replace spinners with blobs
  - [ ] Create organic motion
  - [ ] Add color transitions
  - [ ] Implement skeleton morphing

- [ ] Task 7: Performance optimization
  - [ ] GPU acceleration setup
  - [ ] Reduce filter complexity on mobile
  - [ ] Add will-change hints
  - [ ] Monitor paint performance

## Risk Assessment

### Implementation Risks

- **Primary Risk**: SVG filter performance issues
- **Mitigation**: Progressive enhancement, simpler mobile filters
- **Verification**: Performance profiling across devices

### Browser Compatibility Risks

- **Risk**: Safari SVG filter bugs
- **Mitigation**: Feature detection, CSS fallbacks
- **Verification**: Cross-browser testing matrix

### UX Risks

- **Risk**: Motion sickness from organic movement
- **Mitigation**: Subtle effects, respect reduced motion
- **Verification**: User testing with sensitive users

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_LIQUID=false`
2. CSS-only fallbacks automatically applied
3. Filter effects can be disabled per element
4. Original transitions remain as base

### Safety Checks

- [ ] Performance stays above 60fps
- [ ] Filters don't break in Safari
- [ ] Reduced motion respected
- [ ] No visual artifacts
- [ ] Color contrast maintained
- [ ] Accessibility preserved

## Definition of Done

- [ ] SVG filters implemented and optimized
- [ ] Liquid morphing on all transitions
- [ ] Organic hover states working
- [ ] Loading animations replaced
- [ ] Performance targets met
- [ ] Browser compatibility verified
- [ ] Fallbacks implemented
- [ ] Mobile optimization complete
- [ ] Code reviewed and approved
- [ ] Visual QA completed

## Notes

- Creates unique brand personality
- Combines well with other microinteractions
- May need design team input on morph shapes
- Consider generative variations
- Performance critical on mobile

---

*Story Points: 6*
*Priority: High (Brand differentiation)*
*Sprint: Current*