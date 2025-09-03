# Story: Create Swipe Gesture System

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want to swipe on cards and content to quickly access actions,
so that I can efficiently interact with content using natural mobile gestures.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Mobile gesture pattern
- Existing System Impact: Enhances cards and lists
- Satisfaction Score: 73/100

## Acceptance Criteria

1. Horizontal swipe reveals action buttons
2. Swipe threshold triggers action
3. Smooth elastic animation during swipe
4. Visual indicators for swipe actions
5. Snap points for partial/full reveal
6. Works on touch devices
7. Mouse drag alternative for desktop
8. Prevents accidental triggers
9. Accessibility alternatives provided

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Card lists and grids
- Event cards
- Social media links
- Navigation between pages
- Mobile-responsive design

**Swipeable Elements:**
- Event cards (delete, favorite, share)
- Notification items (dismiss, mark read)
- Image gallery (next/previous)
- Page navigation (between sections)
- List items (archive, delete)

### Integration Approach

1. **Swipe Gesture Hook:**
```typescript
// lib/animations/hooks/useSwipeGesture.ts
import { useState, useRef } from 'react'
import { useGesture } from '@use-gesture/react'

export const useSwipeGesture = (options = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    threshold = 100,
    rubberBand = true
  } = options
  
  const [offset, setOffset] = useState(0)
  const [swiping, setSwiping] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  
  const bind = useGesture({
    onDrag: ({ 
      down, 
      movement: [mx], 
      velocity, 
      direction: [dx],
      cancel 
    }) => {
      setSwiping(down)
      
      if (!down) {
        // Released
        if (Math.abs(mx) > threshold) {
          if (mx > 0 && onSwipeRight) {
            onSwipeRight()
          } else if (mx < 0 && onSwipeLeft) {
            onSwipeLeft()
          }
        }
        setOffset(0)
      } else {
        // Dragging
        const maxOffset = containerRef.current?.offsetWidth || 300
        let newOffset = mx
        
        if (rubberBand) {
          // Apply rubber band effect at boundaries
          if (Math.abs(mx) > maxOffset) {
            const overflow = Math.abs(mx) - maxOffset
            const resistance = 1 - Math.min(overflow / maxOffset, 0.5)
            newOffset = Math.sign(mx) * (maxOffset + overflow * resistance * 0.2)
          }
        }
        
        setOffset(newOffset)
      }
    }
  })\n  \n  return {\n    bind,\n    offset,\n    swiping,\n    containerRef\n  }\n}\n```

2. **Swipeable Card Component:**
```typescript
// components/ui/swipeable-card.tsx
import { animated, useSpring } from '@react-spring/web'
import { useSwipeGesture } from '@/lib/animations/hooks/useSwipeGesture'

export const SwipeableCard = ({ 
  children,
  leftActions = [],
  rightActions = [],
  onSwipeLeft,
  onSwipeRight,
  className
}) => {
  const { bind, offset, swiping, containerRef } = useSwipeGesture({
    onSwipeLeft,
    onSwipeRight,
    threshold: 80
  })
  
  const springProps = useSpring({
    x: offset,
    immediate: swiping,
    config: { tension: 200, friction: 30 }
  })
  
  return (
    <div ref={containerRef} className=\"relative overflow-hidden\">\n      {/* Left actions */}\n      {leftActions.length > 0 && (\n        <div className=\"absolute left-0 top-0 h-full flex items-center\">\n          {leftActions.map((action, i) => (\n            <button\n              key={i}\n              className={`h-full px-4 ${action.className}`}\n              onClick={action.onClick}\n              style={{\n                transform: `translateX(${Math.min(0, offset - 80)}px)`,\n                opacity: Math.min(1, Math.abs(offset) / 80)\n              }}\n            >\n              {action.icon}\n            </button>\n          ))}\n        </div>\n      )}\n      \n      {/* Main content */}\n      <animated.div\n        {...bind()}\n        className={className}\n        style={{\n          x: springProps.x,\n          touchAction: 'pan-y'\n        }}\n      >\n        {children}\n      </animated.div>\n      \n      {/* Right actions */}\n      {rightActions.length > 0 && (\n        <div className=\"absolute right-0 top-0 h-full flex items-center\">\n          {rightActions.map((action, i) => (\n            <button\n              key={i}\n              className={`h-full px-4 ${action.className}`}\n              onClick={action.onClick}\n              style={{\n                transform: `translateX(${Math.max(0, offset + 80)}px)`,\n                opacity: Math.min(1, Math.abs(offset) / 80)\n              }}\n            >\n              {action.icon}\n            </button>\n          ))}\n        </div>\n      )}\n    </div>\n  )\n}\n```

3. **Swipe Navigation:**
```typescript
// components/swipe-navigation.tsx
export const SwipeNavigation = ({ pages, currentPage, onPageChange }) => {
  const [offset, setOffset] = useState(0)\n  \n  const bind = useGesture({\n    onDrag: ({ down, movement: [mx], last }) => {\n      setOffset(down ? mx : 0)\n      \n      if (last && Math.abs(mx) > 100) {\n        const direction = mx > 0 ? -1 : 1\n        const newPage = currentPage + direction\n        \n        if (newPage >= 0 && newPage < pages.length) {\n          onPageChange(newPage)\n        }\n      }\n    }\n  })\n  \n  return (\n    <div {...bind()} className=\"overflow-hidden\">\n      <div \n        className=\"flex transition-transform\"\n        style={{\n          transform: `translateX(calc(-${currentPage * 100}% + ${offset}px))`\n        }}\n      >\n        {pages.map((page, index) => (\n          <div key={index} className=\"w-full flex-shrink-0\">\n            {page}\n          </div>\n        ))}\n      </div>\n    </div>\n  )\n}\n```

### Technical Constraints

- Touch event normalization across devices
- Prevent conflict with scroll
- Handle edge cases (fast swipes)
- Memory management for gesture tracking
- Performance on lists with many items

### Implementation Details

```typescript
// Swipe configurations
const swipeConfig = {\n  thresholds: {\n    action: 80,    // px to trigger action\n    dismiss: 150,  // px to dismiss entirely\n    velocity: 0.5  // minimum swipe velocity\n  },\n  resistance: {\n    rubberBand: 0.2,\n    maxOverflow: 100\n  },\n  animation: {\n    tension: 200,\n    friction: 30\n  }\n}\n\n// Action presets\nconst swipeActions = {\n  delete: { \n    icon: '🗑️', \n    className: 'bg-red-500 text-white',\n    confirmRequired: true \n  },\n  archive: { \n    icon: '📦', \n    className: 'bg-blue-500 text-white' \n  },\n  favorite: { \n    icon: '⭐', \n    className: 'bg-yellow-500 text-white' \n  },\n  share: { \n    icon: '🔗', \n    className: 'bg-green-500 text-white' \n  }\n}\n```

## Tasks / Subtasks

- [ ] Task 1: Setup gesture library
  - [ ] Install @use-gesture/react
  - [ ] Configure for project
  - [ ] Create gesture utilities
  - [ ] Setup TypeScript types

- [ ] Task 2: Build swipe detection
  - [ ] Create useSwipeGesture hook
  - [ ] Handle drag events
  - [ ] Calculate thresholds
  - [ ] Add velocity detection

- [ ] Task 3: Create swipeable components
  - [ ] SwipeableCard component
  - [ ] Action reveal animations
  - [ ] Rubber band effects
  - [ ] Snap point logic

- [ ] Task 4: Implement card actions
  - [ ] Delete with confirmation
  - [ ] Archive functionality
  - [ ] Favorite toggling
  - [ ] Share integration

- [ ] Task 5: Add navigation swipes
  - [ ] Page-to-page swiping
  - [ ] Section navigation
  - [ ] Gallery swiping
  - [ ] Tab switching

- [ ] Task 6: Visual feedback
  - [ ] Action color coding
  - [ ] Progress indicators
  - [ ] Haptic feedback
  - [ ] Success animations

- [ ] Task 7: Optimization
  - [ ] List virtualization
  - [ ] Gesture pooling
  - [ ] Memory management
  - [ ] Performance monitoring

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Scroll gesture conflicts
- **Mitigation**: Proper touch-action CSS, threshold tuning
- **Verification**: Test on various devices

### Performance Risks

- **Risk**: Lag with many swipeable items
- **Mitigation**: Virtual scrolling, gesture throttling
- **Verification**: Stress test with large lists

### UX Risks

- **Risk**: Accidental swipe triggers
- **Mitigation**: Appropriate thresholds, undo options
- **Verification**: User testing for false positives

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_SWIPE=false`
2. Show action buttons as fallback
3. Desktop hover alternatives
4. Can disable per component

### Safety Checks

- [ ] Scroll not interrupted
- [ ] No accidental triggers
- [ ] Undo available for destructive
- [ ] Visual feedback clear
- [ ] Performance maintained
- [ ] Accessibility preserved

## Definition of Done

- [ ] Swipe gesture detection working
- [ ] Action reveals implemented
- [ ] Rubber band effects smooth
- [ ] All target cards enhanced
- [ ] Navigation swipes functional
- [ ] Haptic feedback integrated
- [ ] Performance optimized
- [ ] Cross-device tested
- [ ] Code reviewed and approved
- [ ] User testing completed

## Notes

- Essential for mobile-first experience
- Keep actions consistent across cards
- Consider swipe tutorials for users
- May add custom gesture patterns
- Coordinate with other touch gestures

---

*Story Points: 5*
*Priority: Medium (Mobile UX)*
*Sprint: Next*