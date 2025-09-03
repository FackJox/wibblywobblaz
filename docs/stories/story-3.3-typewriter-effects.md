# Story: Implement Typewriter Effects

<!-- Source: Microinteractions Epic -->
<!-- Context: Brownfield enhancement to existing Next.js landing page -->

## Status: Draft

## Story

As a user,
I want important text to type out character by character,
so that I focus on key messages with anticipation and engagement.

## Context Source

- Source Document: Epic Microinteractions (docs/epic-microinteractions.md)
- Enhancement Type: Text animation pattern
- Existing System Impact: Enhances headlines and key messages
- Satisfaction Score: 70/100

## Acceptance Criteria

1. Headlines type out on viewport entry
2. Smooth character-by-character reveal
3. Cursor blink animation during typing
4. Variable typing speed for emphasis
5. Support for multi-line text
6. Backspace/correction effects for personality
7. Works with dynamic content
8. Accessible with screen readers
9. Can be paused/skipped by user

## Dev Technical Guidance

### Existing System Context

**Current Implementation:**
- Hero headlines in page
- Event announcements
- CTAs and taglines
- Loading messages

**Text to Enhance:**
- Main hero headline
- Event announcements
- Brand tagline
- Loading/waiting messages
- Error messages with personality

### Integration Approach

1. **Basic Typewriter Hook:**
```typescript
// lib/animations/hooks/useTypewriter.ts
import { useState, useEffect } from 'react'

export const useTypewriter = (
  text: string,
  speed = 50,
  delay = 0
) => {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  useEffect(() => {
    let timeout: NodeJS.Timeout
    let charIndex = 0
    
    const startTyping = () => {
      setIsTyping(true)
      
      const type = () => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1))
          charIndex++
          timeout = setTimeout(type, speed)
        } else {
          setIsTyping(false)
          setIsComplete(true)
        }
      }
      
      timeout = setTimeout(type, delay)
    }
    
    startTyping()
    
    return () => clearTimeout(timeout)
  }, [text, speed, delay])
  
  return { displayText, isTyping, isComplete }
}
```

2. **Advanced Typewriter Component:**
```typescript
// components/ui/typewriter-text.tsx
import { useTypewriter } from '@/lib/animations/hooks/useTypewriter'
import { motion } from 'framer-motion'

export const TypewriterText = ({ 
  text,
  speed = 50,
  delay = 0,
  cursor = true,
  corrections = [],
  className
}) => {
  const { displayText, isTyping } = useTypewriter(text, speed, delay)
  
  return (
    <span className={className}>
      <span aria-label={text} aria-live="polite">
        {displayText}
      </span>
      {cursor && (
        <motion.span
          className="inline-block w-0.5 h-[1.2em] bg-current ml-0.5"
          animate={{ opacity: isTyping ? [1, 0] : 0 }}
          transition={{
            duration: 0.5,
            repeat: isTyping ? Infinity : 0,
            repeatType: "reverse"
          }}
        />
      )}
    </span>
  )
}
```

3. **Multi-line Typewriter:**
```typescript
// components/ui/multi-typewriter.tsx
export const MultiTypewriter = ({ 
  lines,
  speed = 50,
  lineDelay = 500 
}) => {
  const [currentLine, setCurrentLine] = useState(0)
  const [completedLines, setCompletedLines] = useState<string[]>([])
  
  const handleLineComplete = () => {
    if (currentLine < lines.length - 1) {
      setCompletedLines([...completedLines, lines[currentLine]])
      setTimeout(() => {
        setCurrentLine(currentLine + 1)
      }, lineDelay)
    }
  }
  
  return (
    <div>
      {completedLines.map((line, i) => (
        <div key={i}>{line}</div>
      ))}\n      {currentLine < lines.length && (
        <TypewriterText
          text={lines[currentLine]}
          speed={speed}
          onComplete={handleLineComplete}
        />
      )}
    </div>
  )
}
```

4. **Correction Effect:**
```typescript
// lib/animations/typewriter-corrections.ts
export const typeWithCorrections = async (
  setText: (text: string) => void,
  finalText: string,
  corrections: Array<{at: number, typo: string, correction: string}>\n) => {
  let currentText = ''
  let charIndex = 0
  
  for (const char of finalText) {
    const correction = corrections.find(c => c.at === charIndex)
    
    if (correction) {
      // Type the typo
      currentText += correction.typo
      setText(currentText)
      await delay(100)
      
      // Backspace
      for (let i = 0; i < correction.typo.length; i++) {
        currentText = currentText.slice(0, -1)
        setText(currentText)
        await delay(50)
      }
      
      // Type correction
      currentText += correction.correction
      setText(currentText)
      await delay(100)
    } else {
      currentText += char
      setText(currentText)
      await delay(50 + Math.random() * 50) // Natural variation
    }
    
    charIndex++
  }
}
```

### Technical Constraints

- Must handle React re-renders properly
- Clean up timeouts to prevent memory leaks
- Support SSR (show full text initially)
- Work with screen readers properly
- Handle component unmounting

### Implementation Details

```typescript
// Typing configurations
const typingConfigs = {
  slow: { speed: 100, variation: 20 },
  normal: { speed: 50, variation: 10 },
  fast: { speed: 30, variation: 5 },
  instant: { speed: 0, variation: 0 }
}

// Cursor styles
const cursorStyles = {
  block: 'bg-current w-2',
  line: 'bg-current w-0.5',
  underscore: 'border-b-2 border-current'
}

// Effect presets
const effectPresets = {
  dramatic: { speed: 100, cursor: true, sound: true },
  casual: { speed: 50, cursor: false, sound: false },
  glitchy: { speed: 30, corrections: true, sound: true }
}
```

## Tasks / Subtasks

- [ ] Task 1: Create typewriter infrastructure
  - [ ] Build useTypewriter hook
  - [ ] Handle timing and cleanup
  - [ ] Add pause/resume functionality
  - [ ] Create TypeScript types

- [ ] Task 2: Build TypewriterText component
  - [ ] Implement character reveal
  - [ ] Add cursor animation
  - [ ] Support variable speed
  - [ ] Ensure accessibility

- [ ] Task 3: Add advanced features
  - [ ] Multi-line support
  - [ ] Correction effects
  - [ ] Speed variation
  - [ ] Word-by-word mode

- [ ] Task 4: Apply to hero content
  - [ ] Hero headline typewriter
  - [ ] Tagline animation
  - [ ] Coordinate with page load
  - [ ] Add viewport trigger

- [ ] Task 5: Enhance loading states
  - [ ] Loading message rotation
  - [ ] Progress indicators
  - [ ] Error message personality
  - [ ] Success confirmations

- [ ] Task 6: Sound effects (optional)
  - [ ] Keyboard click sounds
  - [ ] Ding on complete
  - [ ] Error sound for corrections
  - [ ] Volume controls

- [ ] Task 7: Performance and polish
  - [ ] Optimize for long text
  - [ ] Handle rapid navigation
  - [ ] Mobile performance
  - [ ] Memory leak prevention

## Risk Assessment

### Implementation Risks

- **Primary Risk**: Text jumping/layout shifts
- **Mitigation**: Reserve space, use monospace for numbers
- **Verification**: CLS monitoring

### Performance Risks

- **Risk**: Multiple timers affecting performance
- **Mitigation**: Limit concurrent typewriters, use RAF
- **Verification**: Performance profiling

### Accessibility Risks

- **Risk**: Screen reader confusion
- **Mitigation**: Proper ARIA labels, complete text available
- **Verification**: Screen reader testing

### Rollback Plan

1. Feature flag: `NEXT_PUBLIC_ENABLE_TYPEWRITER=false`
2. Show full text immediately as fallback
3. Component prop: `instant` mode
4. CSS class override available

### Safety Checks

- [ ] No layout shifts occur
- [ ] Screen readers work correctly
- [ ] Text is selectable
- [ ] Can be paused/skipped
- [ ] Memory properly cleaned up
- [ ] SSR shows full text

## Definition of Done

- [ ] Typewriter effect implemented
- [ ] Multiple speed options working
- [ ] Cursor animation functional
- [ ] Multi-line support complete
- [ ] Corrections effect available
- [ ] Applied to key content
- [ ] Accessibility verified
- [ ] Performance optimized
- [ ] Code reviewed and approved
- [ ] Documentation updated

## Notes

- Creates focus and anticipation
- Good for announcements and reveals
- Consider skip animation button
- May add sound effects later
- Keep speeds reasonable for readability

---

*Story Points: 3*
*Priority: Low (Nice to have)*
*Sprint: Current*