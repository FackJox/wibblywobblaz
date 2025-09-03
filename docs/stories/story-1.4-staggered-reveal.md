# Story: Create Staggered Content Reveal System

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

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

- [ ] Task 1: Create stagger reveal infrastructure
  - [ ] Build useStaggeredReveal hook
  - [ ] Create StaggerContainer component
  - [ ] Define animation variants library
  - [ ] Add TypeScript types

- [ ] Task 2: Implement for hero section
  - [ ] Wrap hero title in reveal animation
  - [ ] Stagger hero description and CTAs
  - [ ] Fine-tune timing and easing
  - [ ] Test on mobile viewport

- [ ] Task 3: Apply to content cards
  - [ ] Identify all card grid sections
  - [ ] Wrap in StaggerContainer
  - [ ] Adjust stagger delay for optimal effect
  - [ ] Handle dynamic card counts

- [ ] Task 4: Enhance navigation elements
  - [ ] Stagger mobile menu items
  - [ ] Add to desktop nav dropdowns
  - [ ] Coordinate with page transitions
  - [ ] Maintain keyboard navigation

- [ ] Task 5: Form and interactive elements
  - [ ] Stagger form field appearance
  - [ ] Apply to modal content
  - [ ] Newsletter signup sequence
  - [ ] Social links reveal

- [ ] Task 6: Performance optimization
  - [ ] Implement element pooling
  - [ ] Add viewport margin for pre-loading
  - [ ] Throttle observer callbacks
  - [ ] Monitor frame rate

- [ ] Task 7: Accessibility and testing
  - [ ] Test with screen readers
  - [ ] Verify reduced motion behavior
  - [ ] Check SEO/SSR rendering
  - [ ] Cross-browser testing

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

*Story Points: 4*
*Priority: High (Core UX pattern)*
*Sprint: Current*