---
name: tailwindcss-to-pandacss-migration
status: backlog
created: 2025-09-12T20:57:35Z
updated: 2025-09-12T21:22:18Z
progress: 0%
prd: .claude/prds/tailwindcss-to-pandacss-migration.md
github: https://github.com/FackJox/wibblywobblaz/issues/45
---

# Epic: TailwindCSS to PandaCSS Migration with Utopia Fluid Design System

## Overview

Migrate the Wibbly Wobblaz landing page from TailwindCSS to PandaCSS while implementing the Utopia.fyi fluid design system. This creates a type-safe, performant styling solution with dramatic fluid scaling that ensures the "WIBBLY WOBBLAZ" brand text never wraps and provides smooth mathematical transitions across all viewport sizes (320px to 1920px+).

## Architecture Decisions

### Core Technology Stack
- **PandaCSS**: Zero-runtime CSS-in-JS with full TypeScript support
- **Utopia.fyi**: Fluid design system for mathematical scaling
- **CSS Custom Properties**: For runtime theming and fluid values
- **PostCSS**: Build-time processing and optimization

### Key Technical Decisions

1. **Incremental Migration Strategy**
   - Parallel operation of Tailwind and PandaCSS during transition
   - Component-by-component migration to minimize risk
   - Maintain visual parity throughout migration

2. **Fluid Design Implementation**
   - Use CSS clamp() for all fluid values
   - Type scale: 1.5x (mobile) to 2.5x (desktop) for dramatic effect
   - Prevent text wrapping through calculated min sizes
   - Mathematical relationships between all spacing values

3. **Design System Architecture**
   - Centralized token system in `/styles/system/`
   - TypeScript types generated from design tokens
   - Component recipes for consistent variants
   - Shared patterns for layout primitives

4. **Performance Optimization**
   - Zero runtime overhead (all CSS at build time)
   - Tree-shaking unused styles
   - Optimized critical CSS extraction
   - Reduced bundle size target: 30%+ reduction

## Technical Approach

### Frontend Components

#### UI Component Migration
- Convert 43 shadcn/ui components to PandaCSS recipes
- Preserve all existing component APIs
- Implement fluid sizing for all components
- Maintain accessibility features (ARIA, focus states)

#### State Management
- No changes to React state patterns
- CSS variables for theme switching
- Client-side theme persistence via next-themes

#### User Interaction Patterns
- Maintain all existing animations with PandaCSS keyframes
- Preserve hamburger menu and page transitions
- Enhance with fluid scaling effects

### Styling Infrastructure

#### Design Token System
```typescript
// Token structure
tokens: {
  typography: utopiaFluidScale,
  spacing: utopiaSpaceScale,
  colors: existingHSLVariables,
  animations: existingKeyframes
}
```

#### Fluid Value Generation
- Utopia calculator integration for precise clamp() values
- Custom "WIBBLY WOBBLAZ" sizing to prevent wrapping
- Proportional scaling for all spacing
- Viewport-based calculations (320px min, 1920px max)

### Build System

#### Configuration Updates
- PandaCSS integration with Next.js 15
- PostCSS pipeline configuration
- TypeScript path aliases for new structure
- Development/production optimization splits

## Implementation Strategy

### Phase 1: Foundation (Days 1-3)
- Set up PandaCSS and Utopia configuration
- Create centralized design token system
- Implement fluid value generators
- Test "WIBBLY WOBBLAZ" no-wrap solution

### Phase 2: Core Migration (Days 4-11)
- Migrate UI components in dependency order
- Convert page.tsx styles to PandaCSS
- Apply fluid design system throughout
- Maintain parallel Tailwind operation

### Phase 3: Polish & Optimization (Days 12-16)
- Remove Tailwind dependencies
- Performance optimization and testing
- Documentation and design system site
- Visual regression testing

## Task Breakdown Preview

Simplified into 8 essential tasks for efficient execution:

- [ ] **Task 1: Foundation Setup** - Install PandaCSS, configure Utopia scales, create token system
- [ ] **Task 2: Fluid System Implementation** - Generate clamp() functions, test no-wrap typography, validate scaling
- [ ] **Task 3: Component Recipe Creation** - Define recipes for Button, Card, Form, Navigation groups
- [ ] **Task 4: Core Component Migration** - Migrate 20 most-used components first
- [ ] **Task 5: Page & Layout Migration** - Convert page.tsx, layout.tsx, and global styles
- [ ] **Task 6: Remaining Component Migration** - Complete migration of remaining 23 components
- [ ] **Task 7: Testing & Optimization** - Visual regression, performance benchmarks, bundle analysis
- [ ] **Task 8: Cleanup & Documentation** - Remove Tailwind, create migration guide, document design system

## Dependencies

### External Dependencies
- @pandacss/dev (latest stable)
- PostCSS and plugins
- Utopia calculation utilities (can be implemented inline)

### Internal Dependencies
- All 43 UI components in /components/ui/
- Theme provider integration
- Next.js configuration
- Existing animation keyframes

### Prerequisite Work
- None - can begin immediately

## Success Criteria (Technical)

### Performance Benchmarks
- CSS bundle size reduced by ≥30%
- Build time increase ≤10%
- Lighthouse score maintained ≥90
- First Contentful Paint ≤1.5s

### Quality Gates
- Zero visual regressions
- 100% TypeScript coverage for styles
- All components migrated successfully
- "WIBBLY WOBBLAZ" never wraps at any viewport

### Acceptance Criteria
- Fluid scaling works from 320px to 1920px+
- Type scale creates dramatic visual impact
- Smooth mathematical transitions
- Theme switching maintains functionality
- All animations perform at 60fps

## Estimated Effort

### Timeline
- **Total Duration**: 16 days
- **Developer Resources**: 1 frontend developer
- **Daily Commitment**: Full-time focus

### Critical Path Items
1. Utopia configuration (must be correct from start)
2. Component recipe patterns (sets migration standard)
3. Visual regression testing (ensures no breakage)

### Risk Factors
- Complex animations in globals.css
- Custom Hegval font sizing
- Theme switching integration
- Build pipeline modifications

## Simplification Opportunities

### Leverage Existing Tools
1. **Use PandaCSS Presets**: Many shadcn patterns already exist as PandaCSS presets
2. **Automated Migration**: Codemods can handle 60-70% of utility class conversion
3. **Reuse Tailwind Config**: Direct translation of spacing/color scales
4. **Keep CSS Variables**: Maintain existing HSL system for easy transition

### Reduce Complexity
1. **Batch Similar Components**: Migrate similar components together (all buttons, all cards)
2. **Delay Non-Critical Features**: Focus on visual parity, enhance later
3. **Use Utopia Defaults**: Start with recommended scales, customize if needed
4. **Progressive Enhancement**: Basic migration first, fluid enhancement second

### Implementation Optimizations
1. **Parallel Development**: Keep Tailwind during migration for comparison
2. **Component Library Approach**: Create recipe library once, apply everywhere
3. **Automated Testing**: Set up visual regression early to catch issues
4. **Incremental Deployment**: Deploy component groups as completed

## Tasks Created
- [ ] #46 - Foundation Setup (parallel: false)
- [ ] #47 - Fluid System Implementation (parallel: false)
- [ ] #48 - Component Recipe Creation (parallel: false)
- [ ] #49 - Core Component Migration (parallel: true)
- [ ] #50 - Page & Layout Migration (parallel: true)
- [ ] #51 - Remaining Component Migration (parallel: false)
- [ ] #52 - Testing & Optimization (parallel: false)
- [ ] #53 - Cleanup & Documentation (parallel: false)

Total tasks: 8
Parallel tasks: 2
Sequential tasks: 6
Estimated total effort: 82 hours
