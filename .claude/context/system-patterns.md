---
created: 2025-09-08T19:17:52Z
last_updated: 2025-09-15T14:03:37Z
version: 1.1
author: Claude Code PM System
---

# System Patterns

## Architectural Style

### Current: Monolithic SPA
- **Pattern**: Single Page Application with client-side state
- **Implementation**: All logic in `app/page.tsx` (816 lines)
- **State Management**: Local React hooks (useState, useEffect)
- **Navigation**: Transform-based page transitions (no routing)

### Component Architecture

#### Shadcn/UI Pattern
```typescript
// Component library pattern with Radix primitives
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```
- Pre-built components with consistent API
- Radix UI for accessibility
- PandaCSS for type-safe styling
- Class Variance Authority for variants

#### Theme System Pattern
```css
/* CSS Variables in HSL format */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
}
```
- HSL-based color system
- CSS variables for runtime theming
- Dark/light mode support via next-themes

## Design Patterns Observed

### 1. Page Transition Pattern
```typescript
// Transform-based navigation
const [currentPage, setCurrentPage] = useState('links')
const [isTransitioning, setIsTransitioning] = useState(false)

// CSS transform for sliding
<div style={{ transform: `translateX(${currentPage === 'links' ? '0' : '-100%'})` }}>
```
- No React Router or Next.js navigation
- Manual transition state management
- CSS transforms for animation

### 2. Responsive Design Pattern
```typescript
// Mobile menu state
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

// Conditional rendering
{isMobileMenuOpen && <MobileMenu />}
```
- Separate mobile/desktop components
- Hamburger menu pattern
- Media query-based styling

### 3. Event Handling Pattern
```typescript
// Direct inline handlers
onClick={() => {
  setIsTransitioning(true)
  setTimeout(() => {
    setCurrentPage('parties')
    setIsTransitioning(false)
  }, 500)
}}
```
- Inline event handlers
- setTimeout for animations
- Multiple state updates in sequence

### 4. Data Structure Pattern
```typescript
// Hardcoded data arrays
const events = [
  { date: "2025-08-30", venue: "...", poster: "..." },
  // ...
]
```
- Static data in component
- No external data fetching
- No content management system

## State Management Patterns

### Local State Only
- **useState**: For UI state (menu, transitions, current page)
- **useEffect**: For side effects and cleanup
- **No Context**: No global state management
- **No Redux/Zustand**: Local component state only

### State Flow
```
User Interaction → Event Handler → State Update → Re-render → DOM Update
```

## Styling Patterns

### Utility-First CSS
```jsx
<div className={css({ minH: 'screen', bg: 'black', color: 'white', p: '8' })}>
```
- PandaCSS patterns and recipes
- Type-safe responsive modifiers
- Generated atomic CSS classes

### Animation Patterns
```css
/* Custom keyframes in globals.css */
@keyframes slide-up {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
```
- CSS keyframes for complex animations
- PandaCSS animation patterns
- Transform-based transitions

## Code Organization Patterns

### Import Structure
```typescript
// 1. React/Next imports
import { useState, useEffect } from 'react'
// 2. UI component imports
import { Button } from "@/components/ui/button"
// 3. Icon imports
import { Instagram, Music } from "lucide-react"
// 4. Type imports
import type { Metadata } from 'next'
```

### Component Structure
```typescript
// 1. State declarations
// 2. Effect hooks
// 3. Event handlers
// 4. Sub-component definitions
// 5. Main render
```

## Performance Patterns

### Image Optimization (Disabled)
```javascript
// next.config.mjs
images: { unoptimized: true }
```
- Next.js Image component used but optimization disabled
- Priority loading for above-fold images
- No lazy loading configuration

### Code Splitting
- Automatic via Next.js App Router
- Component-level code splitting
- No manual dynamic imports observed

## Security Patterns

### External Links
```jsx
<a href={url} target="_blank" rel="noopener noreferrer">
```
- Proper rel attributes for security
- No user-generated content
- No API authentication needed

## Anti-Patterns Identified

### 1. Monolithic Component
- 816 lines in single file
- Multiple responsibilities
- Hard to test and maintain

### 2. Memory Leak Risk
```typescript
setTimeout(() => {
  // State updates without cleanup
}, 500)
```
- No cleanup for timeouts
- Potential memory leaks on unmount

### 3. Hardcoded Data
- Event dates and information hardcoded
- Manual updates required
- No dynamic content loading

### 4. Build Safety Disabled
```javascript
ignoreBuildErrors: true
ignoreDuringBuilds: true
```
- Type errors ignored
- Lint errors ignored
- Production risks

### 5. Mixed Concerns
- Business logic in view component
- Data and presentation mixed
- No separation of concerns

## Recommended Pattern Improvements

### 1. Component Decomposition
- Extract Links page component
- Extract Parties page component
- Create shared layout components

### 2. Custom Hooks
```typescript
// Extract logic to custom hooks
usePageTransition()
useMobileMenu()
useEventData()
```

### 3. Data Layer
- Move data to separate files
- Add content management
- Implement data fetching

### 4. Error Boundaries
```typescript
// Add error handling
<ErrorBoundary fallback={<ErrorPage />}>
  <App />
</ErrorBoundary>
```

### 5. Testing Patterns
- Add unit tests for utilities
- Component testing with Testing Library
- E2E tests for user flows