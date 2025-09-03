# Story: Add Long-Press Context Actions

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want to long-press elements to reveal quick actions and contextual options,
so that I can access advanced features without cluttering the interface.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Mobile interaction pattern
- Existing System Impact: Adds hidden depth to UI
- Satisfaction Score: 76/100

## Acceptance Criteria

1. Long-press (500ms) triggers context menu
2. Haptic feedback on trigger (mobile)
3. Visual feedback during press hold
4. Context menu appears near press location
5. Works on both touch and mouse (right-click)
6. Dismisses on outside tap/click
7. Keyboard accessible alternative
8. Smooth animations for menu appearance
9. Prevents text selection during long-press

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Links to external platforms
- Event cards with multiple actions
- Image elements that could preview
- Social sharing options
- Copy-to-clipboard functionality

**Elements for Context Actions:**
- Event cards (RSVP, share, save)
- Music links (preview, queue, share)
- Images (view, download, share)
- Text blocks (copy, translate, share)
- Contact info (copy, add to contacts)

### Integration Approach

1. **Long Press Hook:**
```typescript
// lib/animations/hooks/useLongPress.ts
import { useRef, useState, useCallback } from 'react'

export const useLongPress = (
  onLongPress: (e: TouchEvent | MouseEvent) => void,
  onClick?: () => void,
  { delay = 500, preventSelect = true } = {}
) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timeout = useRef<NodeJS.Timeout>()
  const target = useRef<EventTarget>()
  
  const start = useCallback((e: TouchEvent | MouseEvent) => {
    if (preventSelect) {
      e.preventDefault()
    }
    
    target.current = e.target
    timeout.current = setTimeout(() => {
      onLongPress(e)
      setLongPressTriggered(true)
      
      // Trigger haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(10)
      }
    }, delay)
  }, [onLongPress, delay, preventSelect])
  
  const clear = useCallback((e: TouchEvent | MouseEvent, shouldTriggerClick = true) => {
    timeout.current && clearTimeout(timeout.current)
    
    if (shouldTriggerClick && !longPressTriggered && onClick) {
      onClick()
    }
    
    setLongPressTriggered(false)
  }, [onClick, longPressTriggered])
  
  return {
    onMouseDown: (e: MouseEvent) => start(e),
    onTouchStart: (e: TouchEvent) => start(e),
    onMouseUp: (e: MouseEvent) => clear(e),
    onMouseLeave: (e: MouseEvent) => clear(e, false),
    onTouchEnd: (e: TouchEvent) => clear(e),
    onContextMenu: (e: MouseEvent) => {
      e.preventDefault()
      onLongPress(e)
    }
  }
}
```

2. **Context Menu Component:**
```typescript
// components/ui/context-menu-long-press.tsx
import { AnimatePresence, motion } from 'framer-motion'
import { useLongPress } from '@/lib/animations/hooks/useLongPress'

export const ContextMenuLongPress = ({ 
  children, 
  actions,
  className 
}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)
  
  const handleLongPress = (e: TouchEvent | MouseEvent) => {
    const x = 'touches' in e ? e.touches[0].clientX : e.clientX
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    setMenuPosition({ x, y })
    setShowMenu(true)
  }
  
  const longPressHandlers = useLongPress(handleLongPress)
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    
    if (showMenu) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showMenu])
  
  return (
    <>
      <div {...longPressHandlers} className={className}>
        {children}
      </div>
      
      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={menuRef}
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 min-w-[150px]"
            style={{ 
              left: menuPosition.x,
              top: menuPosition.y 
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {actions.map((action, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                onClick={() => {
                  action.onClick()
                  setShowMenu(false)
                }}
              >
                {action.icon && <span>{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
```

3. **Press Progress Indicator:**
```typescript
// components/ui/press-progress.tsx
export const PressProgress = ({ isPressed, duration = 500 }) => {
  return (
    <AnimatePresence>
      {isPressed && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <svg className="w-full h-full">
            <motion.circle
              cx="50%"
              cy="50%"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: duration / 1000 }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Technical Constraints

- Touch event handling varies by device
- Prevent conflict with scrolling
- Handle both touch and mouse events
- Manage z-index for menu overlay
- Prevent default context menu

### Implementation Details

```typescript
// Context action presets
const contextActions = {
  event: [
    { label: 'RSVP', icon: '📅', onClick: () => {} },
    { label: 'Share', icon: '🔗', onClick: () => {} },
    { label: 'Save', icon: '💾', onClick: () => {} },
    { label: 'Remind Me', icon: '🔔', onClick: () => {} }
  ],
  music: [
    { label: 'Preview', icon: '▶️', onClick: () => {} },
    { label: 'Queue', icon: '📃', onClick: () => {} },
    { label: 'Share', icon: '🔗', onClick: () => {} },
    { label: 'Like', icon: '❤️', onClick: () => {} }
  ],
  image: [
    { label: 'View Full', icon: '🔍', onClick: () => {} },
    { label: 'Download', icon: '⬇️', onClick: () => {} },
    { label: 'Share', icon: '🔗', onClick: () => {} }
  ]
}

// Timing configurations
const timingConfig = {
  shortPress: 200,
  longPress: 500,
  extraLongPress: 1000
}
```

## Tasks / Subtasks

- [ ] Task 1: Create long-press detection
  - [ ] Build useLongPress hook
  - [ ] Handle touch events
  - [ ] Handle mouse events
  - [ ] Add timing logic

- [ ] Task 2: Build context menu system
  - [ ] Create menu component
  - [ ] Position calculation
  - [ ] Animation setup
  - [ ] Dismiss logic

- [ ] Task 3: Add visual feedback
  - [ ] Press progress indicator
  - [ ] Ripple effect on trigger
  - [ ] Menu appear animation
  - [ ] Haptic feedback trigger

- [ ] Task 4: Apply to event cards
  - [ ] RSVP quick action
  - [ ] Share functionality
  - [ ] Calendar integration
  - [ ] Save for later

- [ ] Task 5: Enhance music links
  - [ ] Preview playback
  - [ ] Queue management
  - [ ] Share to social
  - [ ] Like/favorite

- [ ] Task 6: Image interactions
  - [ ] Full view modal
  - [ ] Download action
  - [ ] Share options
  - [ ] Copy image

- [ ] Task 7: Accessibility
  - [ ] Keyboard shortcuts
  - [ ] Screen reader support
  - [ ] Focus management
  - [ ] ARIA labels

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Conflict with scrolling gestures
- **Mitigation**: Proper event handling, scroll detection
- **Verification**: Test on various touch devices

### UX Risks

- **Risk**: Users not discovering feature
- **Mitigation**: Subtle hint animations, onboarding
- **Verification**: User testing for discoverability

### Technical Risks

- **Risk**: Browser inconsistencies
- **Mitigation**: Thorough event normalization
- **Verification**: Cross-browser testing

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_LONG_PRESS=false`
2. Fallback to visible action buttons
3. Right-click menu as alternative
4. Can disable per component

### Safety Checks

- [ ] Scrolling not blocked
- [ ] Text selection works
- [ ] Links still clickable
- [ ] Menu positioning correct
- [ ] Haptic feedback working
- [ ] Keyboard accessible

## Definition of Done

- [ ] Long-press detection working
- [ ] Context menus appearing correctly
- [ ] Visual feedback implemented
- [ ] Haptic feedback on mobile
- [ ] All target elements enhanced
- [ ] Keyboard alternatives provided
- [ ] Cross-device testing complete
- [ ] Performance verified
- [ ] Code reviewed and approved
- [ ] Documentation updated

## Notes

- Power user feature for efficiency
- Good for reducing UI clutter
- Consider tooltip hints for discovery
- May add gesture customization later
- Keep actions contextually relevant

---

*Story Points: 5*
*Priority: Low (Advanced feature)*
*Sprint: Next*