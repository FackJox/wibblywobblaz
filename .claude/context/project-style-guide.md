---
created: 2025-09-08T19:17:52Z
last_updated: 2025-09-15T14:03:37Z
version: 1.1
author: Claude Code PM System
---

# Project Style Guide

## Code Standards

### File Naming Conventions

#### Components
- **Pattern**: `kebab-case.tsx`
- **Examples**: `theme-provider.tsx`, `mobile-menu.tsx`
- **Location**: `/components/` or `/components/ui/`

#### Utilities
- **Pattern**: `camelCase.ts`
- **Examples**: `utils.ts`, `formatDate.ts`
- **Location**: `/lib/`

#### Styles
- **Pattern**: `kebab-case.css`
- **Examples**: `globals.css`, `animations.css`
- **Location**: `/app/` or `/styles/`

#### Documentation
- **Pattern**: `kebab-case.md`
- **Story Pattern**: `X.Y-feature-name.md`
- **Examples**: `project-overview.md`, `1.1-animation-infrastructure.md`

### TypeScript Conventions

#### Type Definitions
```typescript
// Use interface for objects
interface Event {
  date: string
  venue: string
  location: string
}

// Use type for unions and primitives
type PageType = 'links' | 'parties'
type ID = string
```

#### Component Props
```typescript
// Always define props interface
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  children: React.ReactNode
}

// Use explicit return types
const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children }) => {
  return <button onClick={onClick}>{children}</button>
}
```

#### Import Order
```typescript
// 1. React/Next imports
import { useState, useEffect } from 'react'
import type { Metadata } from 'next'

// 2. Third-party libraries
import { cn } from 'clsx'

// 3. UI components
import { Button } from '@/components/ui/button'

// 4. Local components
import { Header } from './Header'

// 5. Utilities and types
import { formatDate } from '@/lib/utils'
import type { Event } from '@/types'

// 6. Styles (if any)
import styles from './styles.module.css'
```

### React Patterns

#### Component Structure
```typescript
// 1. Type definitions
// 2. Component definition
// 3. Sub-components (if any)
// 4. Exports

const Component = () => {
  // 1. State declarations
  const [state, setState] = useState()
  
  // 2. Refs
  const ref = useRef()
  
  // 3. Context/Redux
  const context = useContext()
  
  // 4. Effects
  useEffect(() => {}, [])
  
  // 5. Handlers
  const handleClick = () => {}
  
  // 6. Render helpers
  const renderItem = () => {}
  
  // 7. Main render
  return <div>...</div>
}
```

#### State Management
```typescript
// Prefer specific state variables
const [isLoading, setIsLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

// Over generic state objects
// Avoid: const [state, setState] = useState({ loading: false, error: null })
```

### CSS/PandaCSS Conventions

#### Style Organization
```jsx
// Use PandaCSS patterns and recipes
import { css } from '@/styled-system/css'
import { stack, hstack } from '@/styled-system/patterns'

// Type-safe styling
<div className={css({ 
  display: 'flex', 
  flexDirection: 'column', 
  gap: '4', 
  p: '6',
  fontSize: 'lg',
  fontWeight: 'bold',
  color: 'white',
  bg: 'black',
  borderRadius: 'lg',
  boxShadow: 'xl'
})}>
```

#### Responsive Design
```jsx
// Mobile-first approach with PandaCSS
<div className={css({
  p: { base: '4', md: '6', lg: '8' }
})}>
  <h1 className={css({
    fontSize: { base: '2xl', md: '4xl', lg: '6xl' }
  })}>
```

#### Custom Properties
```css
/* Use HSL for theme colors */
:root {
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
}

/* Consistent spacing scale */
--spacing-xs: 0.25rem;
--spacing-sm: 0.5rem;
--spacing-md: 1rem;
--spacing-lg: 1.5rem;
--spacing-xl: 2rem;
```

### Component Guidelines

#### Shadcn/UI Usage
```typescript
// Always import from /components/ui
import { Button } from "@/components/ui/button"

// Use the cn utility for class merging
import { cn } from "@/lib/utils"

<Button className={cn("custom-class", someCondition && "conditional-class")}>
```

#### Icon Usage
```typescript
// Use Lucide React consistently
import { Menu, X, Calendar } from "lucide-react"

// Standard icon size
<Menu className="h-6 w-6" />
```

### Git Commit Conventions

#### Commit Message Format
```
type: brief description

- Detailed change 1
- Detailed change 2

Fixes #issue
```

#### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Build process or auxiliary tool changes

### Documentation Standards

#### Code Comments
```typescript
// Use single-line comments for brief explanations
const delay = 500 // Animation duration in ms

/**
 * Use JSDoc for functions and components
 * @param date - The event date in YYYY-MM-DD format
 * @returns Formatted date string
 */
function formatEventDate(date: string): string {
  // Implementation
}
```

#### README Sections
1. Project Title and Description
2. Installation
3. Usage
4. Development
5. Testing
6. Deployment
7. Contributing
8. License

### Testing Conventions

#### Test File Naming
- **Pattern**: `ComponentName.test.tsx` or `ComponentName.spec.tsx`
- **Location**: Same directory as component or `__tests__` folder

#### Test Structure
```typescript
describe('ComponentName', () => {
  it('should render correctly', () => {
    // Test implementation
  })
  
  it('should handle user interaction', () => {
    // Test implementation
  })
})
```

### Performance Guidelines

#### Image Optimization
```jsx
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/images/poster.jpg"
  alt="Event poster"
  width={400}
  height={600}
  priority // For above-fold images
/>
```

#### Code Splitting
```typescript
// Use dynamic imports for heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
})
```

### Accessibility Standards

#### ARIA Labels
```jsx
<button aria-label="Open menu" onClick={openMenu}>
  <Menu />
</button>
```

#### Keyboard Navigation
```jsx
// Ensure all interactive elements are keyboard accessible
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
  onClick={handleClick}
>
```

### Error Handling

#### Try-Catch Blocks
```typescript
try {
  const result = await fetchData()
  setData(result)
} catch (error) {
  console.error('Failed to fetch data:', error)
  setError('Failed to load data. Please try again.')
}
```

#### Error Boundaries
```typescript
// Use error boundaries for component trees
<ErrorBoundary fallback={<ErrorFallback />}>
  <ComponentTree />
</ErrorBoundary>
```

## Design Patterns

### Mobile-First Approach
- Design for mobile screens first
- Progressive enhancement for larger screens
- Touch-friendly interaction targets (min 44px)
- Thumb-zone optimization

### Animation Guidelines
- Keep animations under 500ms
- Use easing functions for natural motion
- Provide reduced-motion alternatives
- Test on low-end devices

### Color Usage
- Maintain high contrast (WCAG AA minimum)
- Use semantic color names
- Limit color palette to 5-7 colors
- Test with color blindness simulators

### Typography
- Use "Hegval" for branding/headers
- System fonts for body text
- Maintain readable line lengths (45-75 characters)
- Consistent type scale

## Quality Standards

### Before Committing
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Tests pass (when available)
- [ ] Images optimized
- [ ] Responsive design tested

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Properly typed (no `any`)
- [ ] Error handling in place
- [ ] Performance considered
- [ ] Accessibility checked
- [ ] Mobile experience tested
- [ ] Documentation updated