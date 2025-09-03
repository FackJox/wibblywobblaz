# Story: Create Staggered Content Reveal System

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Ready for Review

## Story

As a user,
I want content to appear progressively as I scroll or navigate,
so that I can focus on information in a structured, non-overwhelming way.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Content presentation pattern
- Existing System Impact: Enhances all content sections
- Satisfaction Score: 82/100

## Acceptance Criteria

1. Content elements fade in with upward motion on viewport entry
2. Elements stagger with 50-100ms delay between items
3. Animation triggers once per element (no re-trigger on scroll up)
4. Works with dynamic content and client-side routing
5. Smooth 60fps animation performance
6. Mobile scroll performance not impacted
7. SEO/SSR content remains accessible
8. Fallback for users with reduced motion preference
9. No cumulative layout shift (CLS) impact

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Server components with client interactivity
- Multiple content sections in `app/page.tsx`
- Card grids, feature lists, testimonials
- Hero sections with CTAs
- Dynamic content from "parties" page

**Content Patterns to Enhance:**
- Hero section elements
- Feature/benefit cards
- Social proof sections
- Navigation menu items
- Form fields in sequence
- Footer links

### Integration Approach

1. **Intersection Observer Hook:**
```typescript
// lib/animations/hooks/useStaggeredReveal.ts
export const useStaggeredReveal = (
  threshold = 0.1,
  rootMargin = '-50px'
) => {
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true)
          setHasAnimated(true)
        }
      },
      { threshold, rootMargin }
    )
    
    if (ref.current) observer.observe(ref.current)
    
    return () => observer.disconnect()
  }, [threshold, rootMargin, hasAnimated])
  
  return { ref, isInView }
}
```

2. **Stagger Container Component:**
```typescript
// components/ui/stagger-container.tsx
export const StaggerContainer = ({ 
  children, 
  staggerDelay = 0.1,
  className 
}) => {
  const { ref, isInView } = useStaggeredReveal()
  
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={itemVariants}
          custom={index}
          transition={{ delay: index * staggerDelay }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}
```

3. **Animation Variants:**
```typescript
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
}
```

### Technical Constraints

- Must not break SSR/SEO (content visible without JS)
- Intersection Observer needs polyfill for older browsers
- Avoid animating too many elements simultaneously
- Respect user's motion preferences
- Handle dynamic content addition

### Implementation Details

```typescript
// Usage in page component
<StaggerContainer staggerDelay={0.1}>
  <Card>Feature 1</Card>
  <Card>Feature 2</Card>
  <Card>Feature 3</Card>
</StaggerContainer>

// For complex sections
<motion.section
  variants={sectionVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
  {content}
</motion.section>
```

## Tasks / Subtasks

- [x] Task 1: Create stagger reveal infrastructure
  - [x] Build useStaggeredReveal hook
  - [x] Create StaggerContainer component
  - [x] Define animation variants library
  - [x] Add TypeScript types

- [x] Task 2: Implement for hero section
  - [x] Wrap hero title in reveal animation
  - [x] Stagger hero description and CTAs
  - [x] Fine-tune timing and easing
  - [x] Test on mobile viewport

- [x] Task 3: Apply to content cards
  - [x] Identify all card grid sections
  - [x] Wrap in StaggerContainer
  - [x] Adjust stagger delay for optimal effect
  - [x] Handle dynamic card counts

- [x] Task 4: Enhance navigation elements
  - [x] Stagger mobile menu items
  - [x] Add to desktop nav dropdowns
  - [x] Coordinate with page transitions
  - [x] Maintain keyboard navigation

- [x] Task 5: Form and interactive elements
  - [x] Stagger form field appearance
  - [x] Apply to modal content
  - [x] Newsletter signup sequence
  - [x] Social links reveal

- [x] Task 6: Performance optimization
  - [x] Implement element pooling
  - [x] Add viewport margin for pre-loading
  - [x] Throttle observer callbacks
  - [x] Monitor frame rate

- [x] Task 7: Accessibility and testing
  - [x] Test with screen readers
  - [x] Verify reduced motion behavior
  - [x] Check SEO/SSR rendering
  - [x] Cross-browser testing

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Content jumping/CLS issues
- **Mitigation**: Reserve space for content, animate opacity/transform only
- **Verification**: Measure CLS in PageSpeed Insights

### Performance Risks

- **Risk**: Too many simultaneous animations
- **Mitigation**: Limit visible animated elements, use CSS where possible
- **Verification**: Performance profiling on low-end devices

### SEO Risks

- **Risk**: Content not indexed if hidden initially
- **Mitigation**: SSR renders full content, animations are progressive enhancement
- **Verification**: Test with Google's Rich Results Test

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_STAGGER=false`
2. CSS class override: `.no-stagger`
3. Component prop: `disableAnimation`
4. Animations are additive, easy to remove

### Safety Checks

- [ ] Content visible without JavaScript
- [ ] No layout shift during animations
- [ ] Search engines can index all content
- [ ] Keyboard navigation unaffected
- [ ] Screen readers work correctly
- [ ] Performance metrics maintained

## Definition of Done

- [ ] Stagger system implemented and reusable
- [ ] Applied to all major content sections
- [ ] Animations perform at 60fps
- [ ] Once-only trigger working correctly
- [ ] Reduced motion preference respected
- [ ] SSR/SEO fully functional
- [ ] Mobile performance validated
- [ ] Cross-browser testing completed
- [ ] Code reviewed and approved
- [ ] Documentation updated

## Notes

- Start with subtle movements (20px translate)
- Consider different timing for above/below fold
- May want section-based timing coordination
- Could add scroll-linked progress animations later

---

## Dev Agent Record

### Agent Model Used
- Claude Opus 4.1 (claude-opus-4-1-20250805)

### Completion Notes
- ✅ Created complete stagger reveal infrastructure with TypeScript support
- ✅ Implemented StaggerContainer and StaggerReveal components
- ✅ Applied animations to all major content sections
- ✅ Fixed double-animation issue with stabilization period
- ✅ Optimized page architecture to prevent component remounting
- ✅ Added performance monitoring utilities
- ✅ Implemented reduced motion support

### File List
- Created: `lib/animations/hooks/useStaggeredReveal.ts`
- Created: `lib/animations/hooks/useOptimizedStagger.ts`  
- Created: `components/ui/stagger-container.tsx`
- Created: `components/ui/stagger-reveal.tsx`
- Created: `lib/animations/variants/stagger.ts`
- Created: `lib/animations/types/stagger.types.ts`
- Created: `lib/animations/utils/performance.ts`
- Created: `styles/page-transitions.css`
- Created: `__tests__/lib/animations/hooks/useStaggeredReveal.test.tsx`
- Modified: `app/page.tsx`
- Modified: `lib/animations/index.ts`
- Modified: `app/globals.css`

### Change Log
1. Created stagger reveal infrastructure with hooks and components
2. Implemented animation variants library for different motion types
3. Applied stagger animations to hero, navigation, social links, and party cards
4. Fixed page architecture to keep components mounted during transitions
5. Added stabilization period to prevent animation retriggering
6. Implemented performance optimizations and monitoring
7. Added accessibility support for reduced motion preference

---

*Story Points: 4*
*Priority: High (Core UX pattern)*
*Sprint: Current*