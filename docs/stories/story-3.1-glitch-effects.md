# Story: Add Glitch/Distortion Effects

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want edgy glitch effects that match the electronic music aesthetic,
so that the brand personality feels authentic and engaging.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Brand personality enhancement
- Existing System Impact: Enhances brand elements and CTAs
- Satisfaction Score: 78/100

## Acceptance Criteria

1. Logo has subtle glitch effect on hover
2. RGB color split distortion on interactions
3. Digital noise/static elements
4. Text distortion for emphasis
5. Controlled, intentional glitching (not random)
6. Performance at 60fps maintained
7. Can be disabled for accessibility
8. Works across all browsers
9. Mobile-optimized version

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Electronic music brand (Wibbly Wobblaz)
- Existing hover states on elements
- Dark/light theme support
- Hero sections with branding

**Elements for Glitch Effects:**
- Brand logo/wordmark
- Hero headlines
- CTA buttons on hover
- Loading states
- Error states
- Special announcements

### Integration Approach

1. **CSS Glitch Effect:**
```css
/* styles/glitch.css */
@keyframes glitch {
  0%, 100% {
    text-shadow: 
      0.02em 0 0 rgba(255, 0, 0, 0.75),
      -0.02em -0 0 rgba(0, 255, 0, 0.75),
      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  14% {
    text-shadow: 
      0.02em 0 0 rgba(255, 0, 0, 0.75),
      -0.02em -0 0 rgba(0, 255, 0, 0.75),
      0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  15% {
    text-shadow: 
      -0.02em -0.025em 0 rgba(255, 0, 0, 0.75),
      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  49% {
    text-shadow: 
      -0.02em -0.025em 0 rgba(255, 0, 0, 0.75),
      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  50% {
    text-shadow: 
      0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
      0.05em 0 0 rgba(0, 255, 0, 0.75),
      0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  99% {
    text-shadow: 
      0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
      0.05em 0 0 rgba(0, 255, 0, 0.75),
      0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }
}

.glitch {
  position: relative;
  animation: glitch 2s infinite;
}
```

2. **React Glitch Component:**
```typescript
// components/ui/glitch-text.tsx
import { useState, useEffect } from 'react'
import styles from './glitch.module.css'

export const GlitchText = ({ 
  children, 
  trigger = 'hover',
  intensity = 'medium' 
}) => {
  const [isGlitching, setIsGlitching] = useState(false)
  
  const glitchClass = `
    ${styles.glitch} 
    ${styles[`glitch-${intensity}`]}
    ${isGlitching ? styles.active : ''}
  `
  
  const handleTrigger = () => {
    setIsGlitching(true)
    setTimeout(() => setIsGlitching(false), 200)
  }
  
  return (
    <span 
      className={glitchClass}
      onMouseEnter={trigger === 'hover' ? handleTrigger : undefined}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      data-text={children}
    >
      {children}
      <span className={styles.glitchLayer} aria-hidden="true">
        {children}
      </span>
      <span className={styles.glitchLayer} aria-hidden="true">
        {children}
      </span>
    </span>
  )
}
```

3. **Canvas-based Glitch Effect:**
```typescript
// lib/animations/glitch-canvas.ts
export class GlitchCanvas {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private imageData: ImageData
  
  constructor(element: HTMLElement) {
    this.canvas = document.createElement('canvas')
    this.ctx = this.canvas.getContext('2d')!
    this.setupCanvas(element)
  }
  
  glitch() {
    const data = this.imageData.data
    
    // RGB channel shift
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < 0.03) {
        // Shift red channel
        data[i] = data[i + 4]
        // Shift green channel
        data[i + 1] = data[i - 3]
        // Add noise
        data[i + 3] = 255 * Math.random()
      }
    }
    
    // Horizontal slice displacement
    if (Math.random() < 0.1) {
      const y = Math.floor(Math.random() * this.canvas.height)
      const spliceHeight = 1 + Math.floor(Math.random() * 10)
      const offset = -10 + Math.floor(Math.random() * 20)
      
      this.ctx.putImageData(this.imageData, offset, y)
    }
    
    this.ctx.putImageData(this.imageData, 0, 0)
  }
}
```

4. **SVG Filter Glitch:**
```typescript
// components/glitch-filter.tsx
export const GlitchFilter = () => (
  <svg className="hidden">
    <defs>
      <filter id="glitch-filter">
        <feTurbulence 
          type="fractalNoise" 
          baseFrequency="0.04" 
          seed="5" 
          numOctaves="2" 
          result="noise"
        />
        <feColorMatrix 
          in="noise" 
          type="matrix" 
          values="1 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" 
          result="redNoise"
        />
        <feComponentTransfer in="redNoise">
          <feFuncA type="discrete" tableValues="0 1 0 0 1 0 1 0"/>
        </feComponentTransfer>
        <feComposite operator="over" in2="SourceGraphic"/>
      </filter>
    </defs>
  </svg>
)
```

### Technical Constraints

- Must not trigger motion sickness
- Keep glitches brief and controlled
- Ensure text remains readable
- Avoid continuous animations
- Optimize for performance

### Implementation Details

```typescript
// Glitch configurations
const glitchConfig = {
  intensity: {
    subtle: { duration: 100, shift: 2 },
    medium: { duration: 200, shift: 5 },
    intense: { duration: 300, shift: 10 }
  },
  triggers: ['hover', 'click', 'focus', 'auto'],
  frequency: {
    rare: 10000,    // ms between auto glitches
    occasional: 5000,
    frequent: 2000
  }
}
```

## Tasks / Subtasks

- [ ] Task 1: Create glitch CSS animations
  - [ ] Build RGB split keyframes
  - [ ] Add displacement effects
  - [ ] Create noise patterns
  - [ ] Setup animation classes

- [ ] Task 2: Build GlitchText component
  - [ ] Implement text layering
  - [ ] Add trigger mechanisms
  - [ ] Configure intensity levels
  - [ ] Ensure accessibility

- [ ] Task 3: Apply to brand elements
  - [ ] Logo glitch on hover
  - [ ] Hero text effects
  - [ ] Navigation highlights
  - [ ] Loading state glitches

- [ ] Task 4: Create canvas glitch system
  - [ ] Build image manipulation
  - [ ] Add slice displacement
  - [ ] Implement RGB shifting
  - [ ] Optimize performance

- [ ] Task 5: SVG filter effects
  - [ ] Create filter definitions
  - [ ] Add turbulence patterns
  - [ ] Apply to images
  - [ ] Test browser support

- [ ] Task 6: Audio-reactive glitching
  - [ ] Sync with music beats
  - [ ] Intensity based on frequency
  - [ ] Create visualizer integration
  - [ ] Add rhythm patterns

- [ ] Task 7: Performance and accessibility
  - [ ] Add reduced motion support
  - [ ] Create disable toggle
  - [ ] Optimize render performance
  - [ ] Test with screen readers

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Overuse making site feel broken
- **Mitigation**: Subtle, intentional application
- **Verification**: Design review and user testing

### Accessibility Risks

- **Risk**: Triggering photosensitivity issues
- **Mitigation**: Brief durations, reduced motion support
- **Verification**: WCAG compliance testing

### Performance Risks

- **Risk**: Canvas manipulation causing lag
- **Mitigation**: Limit to specific elements, optimize
- **Verification**: Performance profiling

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_GLITCH=false`
2. CSS class override: `.no-glitch`
3. Component prop: `disableGlitch`
4. Easy to remove effect classes

### Safety Checks

- [ ] Text remains readable
- [ ] No continuous flashing
- [ ] Reduced motion respected
- [ ] Performance maintained
- [ ] No accessibility issues
- [ ] Brand consistency preserved

## Definition of Done

- [ ] Glitch effects implemented on brand elements
- [ ] Multiple intensity levels working
- [ ] Trigger mechanisms functional
- [ ] Canvas effects optimized
- [ ] SVG filters cross-browser compatible
- [ ] Accessibility compliance verified
- [ ] Performance targets met
- [ ] Mobile optimization complete
- [ ] Code reviewed and approved
- [ ] Visual QA completed

## Notes

- Key for electronic music brand identity
- Must feel intentional, not broken
- Consider audio-reactive variations
- Can combine with other effects
- Use sparingly for maximum impact

---

*Story Points: 5*
*Priority: Medium (Brand identity)*
*Sprint: Current*