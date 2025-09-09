---
name: utopia
description: Implementation of Utopia.fyi fluid responsive design system with centralized configuration
status: backlog
created: 2025-09-08T20:04:52Z
---

# PRD: Utopia Fluid Design System

## Executive Summary

Implement the Utopia.fyi fluid responsive design system to replace fixed breakpoint-based styling with smooth, mathematical scaling of typography and spacing. This will create a more harmonious responsive experience while maintaining the existing visual design language of Wibbly Wobblaz. All fluid design parameters will be centralized in a single configuration file for easy tweaking and maintenance.

## Problem Statement

### Current Challenges
The current implementation uses traditional breakpoint-based responsive design with Tailwind CSS classes like `text-2xl md:text-4xl lg:text-6xl`. This approach creates:

1. **Jarring transitions** - Typography and spacing "jump" at breakpoints rather than scaling smoothly
2. **Maintenance burden** - Multiple size declarations across components for different breakpoints
3. **Inconsistent scaling** - Different elements scale at different rates, breaking visual harmony
4. **Limited flexibility** - Fixed breakpoints don't adapt well to all viewport sizes
5. **Scattered configuration** - Responsive values are spread throughout components

### Why Now?
- The site is still relatively small (monolithic page.tsx), making this the ideal time for systematic refactoring
- Upcoming features (Decks, Microinteractions) will benefit from a consistent scaling system
- Mobile-first approach aligns perfectly with fluid design principles
- Centralized configuration will accelerate future development

## User Stories

### As a Developer
- **I want** centralized fluid design configuration
- **So that** I can adjust the entire design system from one location
- **Acceptance Criteria:**
  - All fluid calculations reference central configuration
  - Parameters are clearly documented
  - Changes propagate automatically across all components

### As a Designer
- **I want** smooth scaling between all viewport sizes
- **So that** the design maintains visual harmony at any screen size
- **Acceptance Criteria:**
  - No visible "jumps" when resizing browser
  - Proportions remain consistent across scales
  - Typography and spacing scale in harmony

### As an End User
- **I want** optimal readability and usability on my device
- **So that** I can easily navigate and interact with the site
- **Acceptance Criteria:**
  - Text is readable without zooming on all devices
  - Touch targets remain appropriately sized
  - Layout adapts smoothly to any screen size

### As a Site Administrator
- **I want** easy adjustment of design parameters
- **So that** I can fine-tune the visual experience without deep CSS knowledge
- **Acceptance Criteria:**
  - Configuration uses plain values (not complex formulas)
  - Changes can be previewed immediately
  - Documentation explains each parameter's impact

## Requirements

### Functional Requirements

#### FR1: Fluid Typography System
- Implement CSS `clamp()` functions for all text sizes
- Support minimum, preferred, and maximum values for each type scale
- Maintain existing visual hierarchy (Hegval font for headers, system fonts for body)
- Preserve current approximate sizes at common breakpoints

#### FR2: Fluid Spacing System
- Create fluid spacing scale using CSS custom properties
- Apply to padding, margins, gaps, and component spacing
- Ensure consistent rhythm throughout the design
- Support both linear and modular scales

#### FR3: Centralized Configuration
- Create single configuration file (`/lib/utopia-config.ts` or similar)
- Export CSS custom properties and Tailwind extensions
- Include:
  - Viewport range (min/max widths)
  - Type scale configuration
  - Space scale configuration
  - Optional: fluid grid settings

#### FR4: Tailwind Integration
- Extend Tailwind config to use Utopia calculations
- Create utility classes for fluid values
- Maintain compatibility with existing Tailwind classes
- Support gradual migration (both systems work during transition)

#### FR5: Developer Tools
- Provide calculator functions for custom fluid values
- Include TypeScript types for configuration
- Create documentation with examples
- Optional: Visual configuration tool/preview

### Non-Functional Requirements

#### NFR1: Performance
- No increase in CSS bundle size beyond 10KB
- CSS calculations must not impact rendering performance
- Support CSS-only implementation (no JavaScript required)
- Maintain or improve Core Web Vitals scores

#### NFR2: Browser Compatibility
- Support all browsers currently supported by the site
- Graceful fallback for browsers without `clamp()` support
- Test on actual devices, not just browser DevTools

#### NFR3: Maintainability
- Clear documentation of all parameters
- Consistent naming conventions
- Commented calculations explaining ratios
- Migration guide from current system

#### NFR4: Accessibility
- Maintain WCAG AA compliance
- Support user zoom up to 200% without horizontal scroll
- Respect user font size preferences
- Ensure touch targets remain accessible (min 44px)

## Implementation Details

### Configuration Structure
```typescript
// /lib/utopia-config.ts
export const utopiaConfig = {
  // Viewport boundaries
  viewport: {
    min: 320,    // Mobile minimum
    max: 1440    // Desktop maximum
  },
  
  // Type scale (in rem)
  typeScale: {
    xs: { min: 0.75, max: 0.875 },
    sm: { min: 0.875, max: 1 },
    base: { min: 1, max: 1.125 },
    lg: { min: 1.125, max: 1.25 },
    xl: { min: 1.25, max: 1.5 },
    '2xl': { min: 1.5, max: 2 },
    '3xl': { min: 1.875, max: 2.5 },
    '4xl': { min: 2.25, max: 3 },
    '5xl': { min: 3, max: 4 },
    '6xl': { min: 3.75, max: 5 }
  },
  
  // Space scale (in rem)
  spaceScale: {
    xs: { min: 0.25, max: 0.375 },
    sm: { min: 0.5, max: 0.75 },
    md: { min: 1, max: 1.5 },
    lg: { min: 1.5, max: 2.25 },
    xl: { min: 2, max: 3 },
    '2xl': { min: 3, max: 4.5 },
    '3xl': { min: 4, max: 6 }
  }
}
```

### CSS Custom Properties Generation
```css
:root {
  /* Viewport variables */
  --viewport-min: 320;
  --viewport-max: 1440;
  
  /* Fluid type scale */
  --text-xs: clamp(0.75rem, calc(...), 0.875rem);
  --text-sm: clamp(0.875rem, calc(...), 1rem);
  --text-base: clamp(1rem, calc(...), 1.125rem);
  /* ... etc */
  
  /* Fluid space scale */
  --space-xs: clamp(0.25rem, calc(...), 0.375rem);
  --space-sm: clamp(0.5rem, calc(...), 0.75rem);
  /* ... etc */
}
```

### Migration Strategy
1. Phase 1: Set up configuration and generate CSS properties
2. Phase 2: Create Tailwind plugin for fluid utilities
3. Phase 3: Migrate typography (highest visual impact)
4. Phase 4: Migrate spacing system
5. Phase 5: Remove old breakpoint utilities

## Success Criteria

### Quantitative Metrics
- **Zero visual regressions** at current breakpoints (768px, 1024px)
- **CSS bundle size** increase < 10KB
- **Performance metrics** maintain or improve:
  - First Contentful Paint < 1.5s
  - Cumulative Layout Shift < 0.1
- **100% of text elements** using fluid scaling
- **Configuration changes** apply in < 5 seconds

### Qualitative Metrics
- Smooth scaling verified on 5+ real devices
- Developer satisfaction with configuration simplicity
- No user complaints about readability
- Positive feedback on visual consistency

### Testing Criteria
- Visual regression tests at multiple viewports
- Performance benchmarks before/after
- Accessibility audit maintains AA rating
- Cross-browser testing on target browsers

## Constraints & Assumptions

### Constraints
- Must maintain existing visual design at current breakpoints
- Cannot break existing Tailwind utilities during migration
- Must work within Next.js 15 and Tailwind CSS framework
- Limited to CSS-based solutions (no runtime JavaScript)

### Assumptions
- Modern browser support for CSS `clamp()` function
- Developers familiar with CSS custom properties
- Existing breakpoints (768px, 1024px) remain as reference points
- Hegval custom font continues to be used

## Out of Scope

The following items are explicitly NOT included in this implementation:
- Redesigning the visual language or aesthetics
- Changing the current color system
- Implementing container queries
- Creating a visual configuration UI (future enhancement)
- Migrating away from Tailwind CSS
- Responsive images (separate concern)
- Animation timing adjustments
- Component architecture refactoring

## Dependencies

### Technical Dependencies
- Tailwind CSS 3.4+ (for custom plugin support)
- PostCSS for processing custom properties
- Modern browser with `clamp()` support

### Knowledge Dependencies
- Understanding of Utopia.fyi principles
- CSS custom properties expertise
- Tailwind plugin development

### External Dependencies
- Utopia.fyi calculator for initial values
- Browser testing tools/devices

## Risks & Mitigation

### Risk 1: Visual Regression
**Mitigation:** 
- Comprehensive visual testing before deployment
- Gradual rollout with feature flags
- Maintain ability to quickly revert

### Risk 2: Performance Impact
**Mitigation:**
- Benchmark before/after implementation
- Use CSS-only calculations
- Monitor Core Web Vitals

### Risk 3: Developer Adoption
**Mitigation:**
- Comprehensive documentation
- Clear migration guide
- Training session for team

## Timeline Estimate

### Phase 1: Setup & Configuration (Day 1)
- Create configuration structure
- Generate CSS custom properties
- Set up Tailwind plugin

### Phase 2: Typography Migration (Day 2)
- Convert all text elements
- Test across viewports
- Adjust calculations as needed

### Phase 3: Spacing Migration (Day 3)
- Convert padding/margins
- Update component spacing
- Verify visual consistency

### Phase 4: Testing & Refinement (Day 4)
- Cross-browser testing
- Performance validation
- Documentation completion

### Phase 5: Cleanup & Deployment (Day 5)
- Remove old utilities
- Final testing
- Deploy to production

## Appendix

### Reference Links
- [Utopia.fyi Documentation](https://utopia.fyi/)
- [CSS Clamp Calculator](https://utopia.fyi/type/calculator)
- [Fluid Space Calculator](https://utopia.fyi/space/calculator)
- [Tailwind CSS Plugin API](https://tailwindcss.com/docs/plugins)

### Example Calculations
```css
/* Fluid calculation formula */
/* clamp(MIN, PREFERRED, MAX) */
/* PREFERRED = MIN + (MAX - MIN) * ((100vw - VIEWPORT_MIN) / (VIEWPORT_MAX - VIEWPORT_MIN)) */

/* Example for base text (16px to 18px) */
--text-base: clamp(
  1rem,                                           /* 16px minimum */
  1rem + (18 - 16) * ((100vw - 320px) / 1120),  /* Fluid calculation */
  1.125rem                                        /* 18px maximum */
);
```

### Configuration Best Practices
1. Use rem units for better accessibility
2. Maintain golden ratio or modular scale
3. Test on actual devices, not just browser DevTools
4. Document the reasoning behind chosen values
5. Keep min/max ranges reasonable (1.5-2x maximum)