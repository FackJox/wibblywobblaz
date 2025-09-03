# Story: Integrate Haptic Feedback

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want to feel subtle vibrations when interacting with the interface,
so that I get immediate tactile confirmation of my actions.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Multi-sensory feedback pattern
- Existing System Impact: Enhances all interactions
- Satisfaction Score: 88/100 (TOP TIER)

## Acceptance Criteria

1. Haptic feedback on button presses
2. Different patterns for different actions
3. Success/error vibration patterns
4. Gesture completion feedback
5. Works on supported devices
6. Can be disabled by user
7. Fallback visual feedback when unavailable
8. Battery-conscious implementation
9. Synchronized with visual animations

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Visual-only feedback currently
- Button interactions
- Form submissions
- Navigation changes
- Gesture interactions

**Haptic Enhancement Targets:**
- Button clicks (light tap)
- Form submissions (success pattern)
- Errors (warning pattern)
- Long press triggers (medium tap)
- Swipe actions (light tap)
- Page transitions (soft pattern)
- Celebrations (custom pattern)

### Integration Approach

1. **Haptic Service:**
```typescript
// lib/haptics/haptic-service.ts
export class HapticService {
  private enabled: boolean = true
  private supported: boolean = false
  
  constructor() {
    this.supported = 'vibrate' in navigator
    this.enabled = this.loadPreference()
  }
  
  // Predefined patterns
  patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 10, 50, 10],
    error: [50, 100, 50],
    warning: [25, 25, 25],
    notification: [10, 20, 10],
    selection: [5],
    impact: {
      light: [10],
      medium: [15],
      heavy: [20]
    }
  }
  
  trigger(pattern: keyof typeof this.patterns | number[]) {
    if (!this.enabled || !this.supported) {
      this.visualFallback()
      return
    }
    
    const vibrationPattern = Array.isArray(pattern) 
      ? pattern 
      : this.patterns[pattern]
    
    try {
      navigator.vibrate(vibrationPattern)
    } catch (error) {
      console.warn('Haptic feedback failed:', error)
      this.visualFallback()
    }
  }
  
  visualFallback() {
    // Trigger visual feedback as fallback
    document.body.classList.add('haptic-visual-feedback')
    setTimeout(() => {
      document.body.classList.remove('haptic-visual-feedback')
    }, 100)
  }
  
  setEnabled(enabled: boolean) {
    this.enabled = enabled
    this.savePreference(enabled)
  }
  
  private loadPreference(): boolean {
    return localStorage.getItem('haptics') !== 'false'
  }
  
  private savePreference(enabled: boolean) {
    localStorage.setItem('haptics', String(enabled))
  }
}

export const haptics = new HapticService()
```

2. **Haptic Hook:**
```typescript
// lib/haptics/hooks/useHaptic.ts
import { useCallback, useContext } from 'react'
import { haptics } from '../haptic-service'

export const useHaptic = () => {
  const trigger = useCallback((pattern: string | number[]) => {
    haptics.trigger(pattern)
  }, [])
  
  const success = useCallback(() => {
    haptics.trigger('success')
  }, [])
  
  const error = useCallback(() => {
    haptics.trigger('error')
  }, [])
  
  const impact = useCallback((intensity: 'light' | 'medium' | 'heavy' = 'medium') => {
    haptics.trigger(haptics.patterns.impact[intensity])
  }, [])
  
  return {
    trigger,
    success,
    error,
    impact,
    patterns: haptics.patterns
  }
}
```

3. **Haptic Button Component:**
```typescript
// components/ui/haptic-button.tsx
import { Button, ButtonProps } from './button'
import { useHaptic } from '@/lib/haptics/hooks/useHaptic'

export const HapticButton = ({ 
  onClick,
  hapticPattern = 'light',
  children,
  ...props 
}: ButtonProps & { hapticPattern?: string }) => {
  const { trigger } = useHaptic()
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    trigger(hapticPattern)
    onClick?.(e)
  }
  
  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  )
}
```

4. **Form Haptic Integration:**
```typescript
// components/haptic-form.tsx
export const HapticForm = ({ onSubmit, children }) => {
  const { success, error } = useHaptic()
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await onSubmit(e)
      success() // Success pattern
    } catch (err) {
      error() // Error pattern
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  )
}
```

5. **Gesture Haptics:**
```typescript
// lib/haptics/gesture-haptics.ts
export const gestureHaptics = {
  onSwipeStart: () => haptics.trigger([5]),
  onSwipeThreshold: () => haptics.trigger([10]),
  onSwipeComplete: () => haptics.trigger([15, 10, 15]),
  onLongPressStart: () => haptics.trigger([5]),
  onLongPressReady: () => haptics.trigger([20]),
  onPinchChange: () => haptics.trigger([3]),
  onRotate: () => haptics.trigger([5])
}
```

### Technical Constraints

- Vibration API limited browser support
- No haptics on desktop (except some touchpads)
- iOS requires user interaction first
- Battery consumption considerations
- Pattern timing limitations

### Implementation Details

```typescript
// Haptic patterns by action type
const actionPatterns = {
  // UI interactions
  tap: [10],
  doubleTap: [10, 50, 10],
  hold: [20],
  release: [5],
  
  // Navigation
  pageChange: [15, 30, 15],
  tabSwitch: [10],
  back: [20, 10],
  
  // Feedback
  success: [10, 30, 10, 30, 10],
  error: [50, 100, 50],
  warning: [30, 30, 30],
  info: [20],
  
  // Special
  celebration: [10, 20, 10, 20, 30, 20, 10],
  achievement: [50, 100, 50, 100, 50],
  milestone: [100, 200, 100]
}

// Visual fallback styles
const visualFeedback = `
  .haptic-visual-feedback {
    animation: haptic-pulse 0.1s ease-out;
  }
  
  @keyframes haptic-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.01); }
    100% { transform: scale(1); }
  }
`
```

## Tasks / Subtasks

- [ ] Task 1: Create haptic service
  - [ ] Build HapticService class
  - [ ] Define vibration patterns
  - [ ] Add browser support detection
  - [ ] Implement preference storage

- [ ] Task 2: Build haptic hooks
  - [ ] Create useHaptic hook
  - [ ] Add pattern helpers
  - [ ] Handle unsupported devices
  - [ ] Add visual fallbacks

- [ ] Task 3: Enhance buttons
  - [ ] Wrap Button components
  - [ ] Add haptic triggers
  - [ ] Different patterns per variant
  - [ ] Test across devices

- [ ] Task 4: Form feedback
  - [ ] Success vibrations
  - [ ] Error patterns
  - [ ] Field validation haptics
  - [ ] Submit confirmations

- [ ] Task 5: Gesture haptics
  - [ ] Swipe feedback
  - [ ] Long press vibration
  - [ ] Pinch/zoom haptics
  - [ ] Drag feedback

- [ ] Task 6: Navigation haptics
  - [ ] Page transition feedback
  - [ ] Tab switching
  - [ ] Menu open/close
  - [ ] Scroll boundaries

- [ ] Task 7: Settings and control
  - [ ] User preference toggle
  - [ ] Intensity settings
  - [ ] Pattern customization
  - [ ] Battery saver mode

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Limited browser/device support
- **Mitigation**: Progressive enhancement, visual fallbacks
- **Verification**: Device capability testing

### UX Risks

- **Risk**: Overwhelming or annoying vibrations
- **Mitigation**: Subtle patterns, user control
- **Verification**: User preference testing

### Performance Risks

- **Risk**: Battery drain from frequent vibrations
- **Mitigation**: Efficient patterns, battery monitoring
- **Verification**: Battery usage testing

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_HAPTICS=false`
2. Visual feedback as default
3. User preference in settings
4. Can disable globally or per-component

### Safety Checks

- [ ] Browser support detected
- [ ] Fallbacks working
- [ ] User preference respected
- [ ] No performance impact
- [ ] Battery efficient
- [ ] Synchronized with visuals

## Definition of Done

- [ ] Haptic service implemented
- [ ] Pattern library complete
- [ ] All interactions enhanced
- [ ] Visual fallbacks working
- [ ] User settings functional
- [ ] Device testing complete
- [ ] Battery impact measured
- [ ] Performance verified
- [ ] Code reviewed and approved
- [ ] Documentation complete

## Notes

- High impact for mobile experience
- Creates premium feel
- Must be subtle and appropriate
- Consider accessibility implications
- Coordinate with visual and audio feedback

---

*Story Points: 4*
*Priority: High (Mobile enhancement)*
*Sprint: Current*