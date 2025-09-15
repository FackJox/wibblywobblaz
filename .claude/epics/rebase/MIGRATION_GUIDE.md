# Tailwind CSS to PandaCSS Migration Guide

## Overview

This guide documents the complete migration from Tailwind CSS to PandaCSS in the Wibbly Wobblaz project. This migration provides better TypeScript integration, runtime CSS generation, and improved performance optimization while maintaining the utility-first approach.

## Migration Summary

### What Changed
- **Styling System**: Migrated from Tailwind CSS 3.4.17 to PandaCSS
- **Component Library**: All 43 shadcn/ui components migrated to PandaCSS patterns
- **Build Process**: Updated configuration and tooling
- **Type Safety**: Enhanced TypeScript integration with design tokens
- **Performance**: Better tree-shaking and runtime optimization

### What Stayed the Same
- **Design System**: All color tokens, spacing, and typography preserved
- **Component API**: Component interfaces remain unchanged
- **Responsive Design**: Mobile-first approach maintained
- **Theme System**: Dark/light mode support preserved
- **Next.js Integration**: App Router and SSR compatibility

## Key Migration Patterns

### 1. Basic Class Migration

**Before (Tailwind CSS):**
```tsx
<div className="bg-background text-foreground p-4 rounded-md border">
  Content
</div>
```

**After (PandaCSS):**
```tsx
import { css } from "@/styled-system/css"

<div className={css({
  bg: "background",
  color: "foreground", 
  padding: "4",
  borderRadius: "md",
  border: "1px solid token(colors.border)"
})}>
  Content
</div>
```

### 2. Component with Variants (CVA Pattern)

**Before (Tailwind + cn utility):**
```tsx
import { cn } from "@/lib/utils"

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Button = ({ variant = 'primary', size = 'md', className, ...props }) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium",
        "transition-colors focus-visible:outline-none focus-visible:ring-2",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === 'primary',
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === 'secondary',
          "h-10 px-4 py-2": size === 'md',
          "h-9 px-3": size === 'sm',
          "h-11 px-8": size === 'lg'
        },
        className
      )}
      {...props}
    />
  )
}
```

**After (PandaCSS CVA):**
```tsx
import { cva } from "@/styled-system/css"
import { cx } from "@/styled-system/css"

const buttonVariants = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "md",
    fontSize: "sm",
    fontWeight: "medium",
    transition: "colors",
    _focusVisible: {
      outline: "2px solid",
      outlineColor: "ring",
      outlineOffset: "2px"
    }
  },
  variants: {
    variant: {
      primary: {
        bg: "primary",
        color: "primary.foreground",
        _hover: { bg: "primary/90" }
      },
      secondary: {
        bg: "secondary", 
        color: "secondary.foreground",
        _hover: { bg: "secondary/80" }
      }
    },
    size: {
      sm: { height: "9", paddingX: "3" },
      md: { height: "10", paddingX: "4", paddingY: "2" },
      lg: { height: "11", paddingX: "8" }
    }
  },
  defaultVariants: {
    variant: "primary",
    size: "md"
  }
})

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Button = ({ variant, size, className, ...props }) => {
  return (
    <button
      className={cx(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### 3. Dynamic Styling with Runtime CSS

**Before (Tailwind with style objects):**
```tsx
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-secondary rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
```

**After (PandaCSS runtime CSS):**
```tsx
import { css } from "@/styled-system/css"

const ProgressBar = ({ progress }) => {
  return (
    <div className={css({
      width: "full",
      bg: "secondary", 
      borderRadius: "full",
      height: "2"
    })}>
      <div className={css({
        bg: "primary",
        height: "2",
        borderRadius: "full", 
        transition: "all 500ms ease-out",
        width: `${progress}%`
      })} />
    </div>
  )
}
```

### 4. Complex Animations with CSS Custom Properties

**Before (Tailwind with CSS variables):**
```css
.ripple-effect {
  @apply relative overflow-hidden;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.3;
  animation: ripple-expand 600ms ease-out;
}

@keyframes ripple-expand {
  from {
    width: 0;
    height: 0;
  }
  to {
    width: 100px;
    height: 100px;
  }
}
```

**After (PandaCSS with custom properties):**
```tsx
import { css } from "@/styled-system/css"

const useRippleEffect = () => {
  const [ripples, setRipples] = useState([])
  
  const createRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple = { id: Date.now(), x, y }
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, 600)
  }

  const rippleContainer = css({
    position: "relative",
    overflow: "hidden"
  })

  const rippleElements = ripples.map(ripple => (
    <span
      key={ripple.id}
      className={css({
        position: "absolute",
        borderRadius: "50%",
        bg: "currentColor",
        opacity: 0.3,
        width: "0",
        height: "0",
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        transform: "translate(-50%, -50%)",
        animation: "ripple-expand 600ms ease-out",
        pointerEvents: "none"
      })}
    />
  ))

  return { createRipple, rippleContainer, rippleElements }
}
```

## Configuration Migration

### PandaCSS Configuration

The `panda.config.ts` file replaces Tailwind's configuration:

```typescript
import { defineConfig } from "@pandacss/dev"
import { FLUID_TYPOGRAPHY, FLUID_SPACING, FLUID_PAIRS } from "./utils/utopia"

export default defineConfig({
  preflight: true,
  include: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}"
  ],
  exclude: [],
  theme: {
    extend: {
      tokens: {
        colors: {
          // Preserved from Tailwind - CSS variable based
          background: { value: 'hsl(var(--background))' },
          foreground: { value: 'hsl(var(--foreground))' },
          primary: {
            DEFAULT: { value: 'hsl(var(--primary))' },
            foreground: { value: 'hsl(var(--primary-foreground))' }
          },
          // ... other color tokens
        },
        fonts: {
          sans: { value: ["var(--font-geist-sans)", "sans-serif"] },
          mono: { value: ["var(--font-geist-mono)", "monospace"] },
          heading: { value: ["Hegval", "sans-serif"] }
        },
        // Fluid typography and spacing from Utopia
        ...FLUID_TYPOGRAPHY,
        ...FLUID_SPACING
      },
      keyframes: {
        // Custom animations preserved and enhanced
        "shhh-slide-up": {
          "0%": { transform: "translateY(100vh)", opacity: "0" },
          "60%": { transform: "translateY(-2vh)", opacity: "1" }, 
          "80%": { transform: "translateY(1vh)" },
          "100%": { transform: "translateY(0)", opacity: "1" }
        },
        // ... other keyframes
      }
    }
  },
  // Global CSS integration
  globalCss: {
    "@import": "./app/globals.css"
  }
})
```

### Build Configuration Updates

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "panda codegen && next build",
    "panda:watch": "panda codegen --watch",
    "panda:build": "panda codegen"
  }
}
```

**Next.js Configuration:**
```javascript
// next.config.mjs - No changes needed
export default {
  // PandaCSS works with existing Next.js setup
}
```

## Component Migration Examples

### Migrated Components (43 total)

All shadcn/ui components have been successfully migrated:

#### Button Component
- **File**: `components/ui/button.tsx`
- **Pattern**: CVA with multiple variants
- **Features**: Responsive sizing, state variants, accessibility

#### Card Component  
- **File**: `components/ui/card.tsx`
- **Pattern**: Compositional with CSS modules
- **Features**: Nested components, flexible layouts

#### Form Components
- **Files**: `input.tsx`, `label.tsx`, `textarea.tsx`, etc.
- **Pattern**: Consistent form styling with validation states
- **Features**: Error handling, focus states, accessibility

#### Navigation Components
- **Files**: `navigation-menu.tsx`, `breadcrumb.tsx`, `menubar.tsx`
- **Pattern**: Complex interactive states
- **Features**: Keyboard navigation, ARIA support

#### Data Display
- **Files**: `table.tsx`, `chart.tsx`, `calendar.tsx`
- **Pattern**: Data-driven styling
- **Features**: Responsive layouts, dynamic content

### Example: Skeleton Component Migration

**Before:**
```tsx
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
```

**After:**
```tsx
import { cx, css } from "@/styled-system/css"

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cx(css({
        animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        borderRadius: "md",
        bg: "muted"
      }), className)}
      {...props}
    />
  )
}
```

## Styling Patterns

### 1. Token-Based Design System

All design tokens are preserved from the original Tailwind configuration:

```tsx
// Colors use CSS variables for theme support
const cardStyles = css({
  bg: "card",           // hsl(var(--card))
  color: "card.foreground", // hsl(var(--card-foreground))
  border: "1px solid token(colors.border)"
})

// Spacing follows the original scale
const containerStyles = css({
  padding: "4",     // 1rem (16px)
  margin: "6",      // 1.5rem (24px)
  gap: "2"          // 0.5rem (8px)
})
```

### 2. Responsive Design

Mobile-first responsive design is maintained:

```tsx
const responsiveLayout = css({
  // Mobile base
  flexDirection: "column",
  padding: "4",
  
  // Tablet and up
  "@media (min-width: 768px)": {
    flexDirection: "row",
    padding: "6"
  },
  
  // Desktop and up  
  "@media (min-width: 1024px)": {
    padding: "8",
    gap: "8"
  }
})
```

### 3. Theme Integration

Dark/light mode support is preserved:

```tsx
const themeAwareStyles = css({
  bg: "background",
  color: "foreground",
  
  // Automatic theme switching via CSS variables
  borderColor: "border",
  
  // Conditional theming when needed
  _dark: {
    backdropFilter: "blur(10px)"
  }
})
```

### 4. Animation Patterns

Enhanced animation capabilities:

```tsx
// Simple animations
const fadeIn = css({
  animation: "fadeIn 300ms ease-out"
})

// Complex animations with custom properties
const progressAnimation = css({
  "--progress": `${progress}%`,
  background: `conic-gradient(
    from 0deg, 
    transparent 0%, 
    token(colors.primary) var(--progress)
  )`
})

// State-based animations
const interactiveElement = css({
  transition: "all 200ms ease-out",
  _hover: { transform: "scale(1.05)" },
  _active: { transform: "scale(0.95)" }
})
```

## Performance Optimizations

### Tree Shaking
PandaCSS only includes used styles in the final bundle:

```tsx
// Only the styles actually used are included
const usedStyles = css({
  display: "flex",  // ✅ Included
  gap: "4"          // ✅ Included
})

// Unused utilities are automatically excluded
```

### Runtime Optimization
Runtime CSS generation is optimized:

```tsx
// Styles are cached and reused
const memoizedStyles = useMemo(() => css({
  transform: `translateX(${position}px)`
}), [position])
```

### Build-Time Analysis
The bundle now includes better analysis:

```bash
# Bundle size analysis
npm run analyze

# PandaCSS specific analysis
npm run panda:analyze
```

## Testing Migration

### Visual Regression Testing
Visual regression tests ensure the migration maintains the exact same appearance:

```bash
# Run visual tests
npm run test:visual

# Update snapshots if intentional changes
npm run test:visual:update
```

### Component Testing
All component functionality is preserved:

```tsx
// Tests work the same way
test('button renders with correct styling', () => {
  render(<Button variant="primary">Click me</Button>)
  expect(screen.getByRole('button')).toBeInTheDocument()
})
```

## Troubleshooting

### Common Issues

#### 1. Missing Styles
**Problem**: Component styles not appearing
**Solution**: Ensure the component file is included in `panda.config.ts` include paths

#### 2. TypeScript Errors
**Problem**: TypeScript errors with CSS properties
**Solution**: Regenerate PandaCSS types:
```bash
npm run panda:build
```

#### 3. Build Errors
**Problem**: Build failing due to CSS generation
**Solution**: Check that panda codegen runs before Next.js build:
```json
{
  "scripts": {
    "build": "panda codegen && next build"
  }
}
```

#### 4. Runtime Performance
**Problem**: Slow runtime CSS generation
**Solution**: Use memoization for dynamic styles:
```tsx
const styles = useMemo(() => css({
  transform: `translateX(${x}px)`
}), [x])
```

### Debugging Tools

#### Development Mode
```bash
# Watch mode for development
npm run panda:watch
```

#### CSS Output Inspection
Check generated CSS in the `styled-system` directory.

#### Performance Monitoring
```bash
# Performance benchmarks
npm run perf:benchmark

# Lighthouse auditing
npm run perf:lighthouse
```

## Migration Benefits

### 1. Better TypeScript Integration
- Type-safe design tokens
- IntelliSense for all CSS properties
- Compile-time validation

### 2. Improved Performance
- Tree-shaking of unused styles
- Runtime optimization
- Better caching

### 3. Enhanced Developer Experience
- Better error messages
- Cleaner code patterns
- Easier debugging

### 4. Future-Proof Architecture
- Framework agnostic
- Better maintainability
- Easier customization

## Next Steps

1. **Team Training**: All team members should familiarize themselves with PandaCSS patterns
2. **Style Guide Updates**: Update internal style guides to reflect new patterns
3. **Performance Monitoring**: Establish baseline metrics for the new system
4. **Gradual Adoption**: Use PandaCSS patterns for all new components

## Resources

- [PandaCSS Documentation](https://panda-css.com/)
- [Migration Patterns](./pandacss-patterns.md)
- [Component Examples](../examples/)
- [Performance Guidelines](./DEVELOPER_GUIDE.md#performance)

---

This migration represents a significant step forward in the project's architecture, providing better type safety, performance, and developer experience while maintaining all existing functionality and design.