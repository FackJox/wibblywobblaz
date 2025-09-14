---
name: rebase
description: Rebase PandaCSS migration to main branch and adapt existing animation system to PandaCSS
status: backlog
created: 2025-09-14T21:41:45Z
---

# PRD: Rebase PandaCSS Migration with Animation System Adaptation

## Executive Summary

This PRD outlines the strategy for rebasing the `epic/tailwindcss-to-pandacss-migration` branch onto main, which includes adapting the existing animation hooks and system from main branch to work seamlessly with PandaCSS instead of Tailwind CSS. The goal is to preserve all animation functionality while completing the migration to PandaCSS as the single styling solution.

## Problem Statement

### What problem are we solving?
The main branch contains a comprehensive animation system with custom hooks (use-animation, use-parallax, use-ripple, etc.) that are built to work with Tailwind CSS. When rebasing the PandaCSS migration branch:
- These animation hooks will conflict with the new PandaCSS system
- The animations rely on Tailwind utility classes that no longer exist
- We need to preserve the animation functionality while adapting it to PandaCSS patterns
- Must ensure zero regression in user experience

### Why is this important now?
- The PandaCSS migration is complete for static styles but needs animation integration
- Two styling systems cannot coexist efficiently
- The longer we wait, the more the branches diverge
- Team needs unified development environment

## User Stories

### Primary User Personas

**1. Frontend Developer**
- As a developer, I need all existing animation hooks to work with PandaCSS
- I want to use the same animation APIs without learning new patterns
- I need smooth migration without breaking existing features

**2. End User**
- As a user, I expect all animations to work as before
- I want smooth, performant interactions
- I need consistent visual experience

**3. Design Team**
- As a designer, I need animation capabilities preserved
- I want to add new animations using the same system
- I need predictable animation behavior

### Detailed User Journeys

**Animation Hook Usage:**
1. Developer imports existing hook (e.g., `useParallax`)
2. Hook works with PandaCSS styled components
3. Animation applies correct styles via PandaCSS
4. Performance remains optimal
5. No visual difference from Tailwind version

## Requirements

### Functional Requirements

**1. Animation Hook Adaptation**
Convert each animation hook to use PandaCSS:
- `use-animation` → PandaCSS keyframe utilities
- `use-parallax` → CSS transform recipes
- `use-ripple` → Dynamic style generation with PandaCSS
- `use-magnetic-hover` → PandaCSS hover state recipes
- `use-gradient-follow` → CSS variable manipulation with PandaCSS
- `use-scroll-animations` → Intersection Observer + PandaCSS classes
- `use-stagger-reveal` → Animation delay tokens
- `use-text-reveal` → Text animation recipes
- `use-gesture` → Touch event handling with PandaCSS
- `use-swipe` → Swipe detection with transform utilities
- `use-long-press` → Press state with PandaCSS variants
- `use-haptics` → Haptic feedback (no CSS changes needed)
- `use-performance` → Performance monitoring with PandaCSS
- `use-performance-monitor` → Metrics tracking
- `use-batched-dom` → DOM batching utilities
- `use-mobile` → Responsive utilities with PandaCSS
- `use-feature-flags` → Feature toggling (minimal CSS impact)

**2. Style Generation Strategy**
- Replace Tailwind class concatenation with PandaCSS `css()` function
- Convert utility classes to recipe patterns
- Implement dynamic style generation where needed
- Maintain runtime performance

**3. Migration Approach**
- Preserve hook API signatures
- Internal implementation changes only
- Backward compatibility where possible
- Clear migration documentation

**4. Tailwind Removal**
- Complete removal of all Tailwind classes
- Delete Tailwind configuration
- Remove PostCSS Tailwind plugins
- Clean up package dependencies

### Non-Functional Requirements

**Performance:**
- Animation frame rate: 60fps minimum
- No increased bundle size
- Reduced CSS output through PandaCSS optimization
- Efficient runtime style generation

**Compatibility:**
- All existing components continue working
- No breaking changes to hook APIs
- Support for SSR/SSG in Next.js
- Cross-browser animation support

**Developer Experience:**
- Clear error messages for migration issues
- TypeScript support maintained
- Intuitive PandaCSS patterns
- Comprehensive examples

## Success Criteria

### Measurable Outcomes

1. **Functionality Preserved:**
   - 100% of animation hooks working
   - All animations visually identical
   - No console errors or warnings

2. **Performance Metrics:**
   - Bundle size reduced by 15-30%
   - CSS file size decreased
   - Animation performance maintained

3. **Code Quality:**
   - Zero Tailwind dependencies
   - All TypeScript types satisfied
   - ESLint passing

4. **Testing:**
   - Animation tests passing
   - Visual regression tests clean
   - Manual QA approved

## Constraints & Assumptions

### Technical Constraints
- Must maintain Next.js 15 compatibility
- Cannot modify hook public APIs
- Must support all browsers currently supported
- PandaCSS v0.40.1 capabilities

### Assumptions
- PandaCSS can handle all animation patterns
- Dynamic style generation is performant enough
- Team familiar with PandaCSS patterns
- Existing tests cover animation functionality

## Out of Scope

- Creating new animation capabilities
- Refactoring hook architecture
- Adding animation libraries (Framer Motion, etc.)
- Performance optimizations beyond migration
- New component development

## Dependencies

### External Dependencies
- PandaCSS runtime and build tools
- PostCSS ecosystem
- Next.js build pipeline

### Internal Dependencies
- Completed PandaCSS migration for static styles
- Understanding of all animation hook implementations
- Access to main branch animation system
- Testing infrastructure

## Implementation Strategy

### Phase 1: Analysis & Planning
1. Audit all animation hooks in main branch
2. Map each hook to PandaCSS equivalent approach
3. Identify challenging conversions
4. Create conversion templates

### Phase 2: Hook Conversion
1. Start with simple hooks (use-mobile, use-feature-flags)
2. Progress to medium complexity (use-animation, use-ripple)
3. Tackle complex hooks (use-parallax, use-scroll-animations)
4. Test each conversion thoroughly

### Phase 3: Integration & Testing
1. Rebase migration branch onto main
2. Apply hook conversions
3. Fix integration issues
4. Run comprehensive tests

### Phase 4: Cleanup & Optimization
1. Remove all Tailwind artifacts
2. Optimize PandaCSS configuration
3. Document migration patterns
4. Performance profiling

## Risk Mitigation

### High-Risk Areas

1. **Dynamic Style Generation**
   - Risk: Runtime performance impact
   - Mitigation: Use PandaCSS recipes where possible
   - Fallback: Inline styles for complex cases

2. **Complex Animations**
   - Risk: PandaCSS limitations for complex scenarios
   - Mitigation: Custom CSS with PandaCSS tokens
   - Fallback: Raw CSS for specific animations

3. **Rebase Conflicts**
   - Risk: Merge conflicts in adapted hooks
   - Mitigation: Incremental rebasing
   - Fallback: Manual conflict resolution

## Technical Approach Examples

### Hook Conversion Pattern
```typescript
// Before (Tailwind)
const useRipple = () => {
  return {
    className: 'hover:bg-gray-100 active:bg-gray-200 transition-colors'
  }
}

// After (PandaCSS)
const useRipple = () => {
  return {
    className: css({
      _hover: { bg: 'gray.100' },
      _active: { bg: 'gray.200' },
      transition: 'colors'
    })
  }
}
```

### Dynamic Animation Pattern
```typescript
// Complex animation with PandaCSS
const useParallax = (offset: number) => {
  return {
    style: {
      transform: `translateY(${offset}px)`,
    },
    className: css({
      transition: 'transform',
      transitionDuration: '300ms',
      willChange: 'transform'
    })
  }
}
```

## Success Validation

The rebase and adaptation will be considered successful when:

1. ✅ All animation hooks adapted to PandaCSS
2. ✅ Zero Tailwind classes remaining
3. ✅ All animations functioning identically
4. ✅ Performance metrics maintained or improved
5. ✅ Clean rebase with main branch
6. ✅ Build process succeeds
7. ✅ No visual regressions
8. ✅ Developer documentation complete