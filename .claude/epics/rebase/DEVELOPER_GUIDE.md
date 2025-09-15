# PandaCSS Developer Guide

## Overview

This guide provides comprehensive documentation for using PandaCSS patterns in the Wibbly Wobblaz project. It covers practical implementation strategies, performance optimization, and common patterns for day-to-day development.

## Quick Start

### Basic Setup

Every component using PandaCSS should import the necessary functions:

```tsx
import { css, cx, cva } from "@/styled-system/css"
import { token } from "@/styled-system/tokens"
```

### Essential Imports
- `css()` - Runtime CSS generation
- `cx()` - Class name merging (replaces `cn()`)
- `cva()` - Class Variance Authority for variants
- `token()` - Direct access to design tokens

## Core Patterns

### 1. Basic Styling with `css()`

The `css()` function is your primary tool for styling:

```tsx
// Simple static styles
const containerStyles = css({
  display: "flex",
  flexDirection: "column",
  gap: "4",
  padding: "6",
  bg: "background",
  border: "1px solid token(colors.border)",
  borderRadius: "md"
})

// Dynamic styles with variables
const progressBar = css({
  width: "full",
  height: "2",
  bg: "secondary",
  borderRadius: "full",
  position: "relative",
  overflow: "hidden"
})

const progressFill = css({
  height: "full",
  bg: "primary",
  borderRadius: "full",
  transition: "width 300ms ease-out",
  width: `${progress}%`
})
```

### 2. Component Variants with `cva()`

Use CVA for components with multiple states or variations:

```tsx
const buttonVariants = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "md",
    fontSize: "sm",
    fontWeight: "medium",
    transition: "all 200ms ease-out",
    cursor: "pointer",
    _disabled: {
      pointerEvents: "none",
      opacity: 0.5
    },
    _focusVisible: {
      outline: "2px solid token(colors.ring)",
      outlineOffset: "2px"
    }
  },
  variants: {
    variant: {
      default: {
        bg: "primary",
        color: "primary.foreground",
        _hover: { bg: "primary/90" }
      },
      destructive: {
        bg: "destructive", 
        color: "destructive.foreground",
        _hover: { bg: "destructive/90" }
      },
      outline: {
        border: "1px solid token(colors.input)",
        bg: "background",
        _hover: { bg: "accent", color: "accent.foreground" }
      },
      secondary: {
        bg: "secondary",
        color: "secondary.foreground", 
        _hover: { bg: "secondary/80" }
      },
      ghost: {
        _hover: { bg: "accent", color: "accent.foreground" }
      },
      link: {
        color: "primary",
        textDecoration: "underline",
        _hover: { textDecoration: "none" }
      }
    },
    size: {
      default: { height: "10", paddingX: "4", paddingY: "2" },
      sm: { height: "9", borderRadius: "md", paddingX: "3" },
      lg: { height: "11", borderRadius: "md", paddingX: "8" },
      icon: { height: "10", width: "10" }
    }
  },
  compoundVariants: [
    {
      variant: "destructive",
      size: "lg",
      css: {
        fontSize: "lg",
        fontWeight: "semibold"
      }
    }
  ],
  defaultVariants: {
    variant: "default",
    size: "default"
  }
})

// Usage in component
interface ButtonProps {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  className?: string
  children: React.ReactNode
}

const Button = ({ variant, size, className, children, ...props }) => {
  return (
    <button
      className={cx(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 3. Advanced Dynamic Styling

For complex dynamic styles, use CSS custom properties:

```tsx
const AnimatedProgress = ({ progress, color = "primary" }) => {
  const styles = css({
    "--progress": `${progress}%`,
    "--color": `token(colors.${color})`,
    
    width: "full",
    height: "8",
    bg: "muted",
    borderRadius: "full",
    overflow: "hidden",
    position: "relative",
    
    "&::before": {
      content: '""',
      position: "absolute",
      top: "0",
      left: "0",
      height: "full",
      width: "var(--progress)",
      bg: "var(--color)",
      borderRadius: "full",
      transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)"
    }
  })

  return <div className={styles} />
}
```

## Animation Patterns

### 1. CSS Keyframe Animations

Define keyframes in `panda.config.ts` and use them:

```tsx
// In panda.config.ts
keyframes: {
  "fade-in": {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" }
  },
  "slide-up": {
    "0%": { transform: "translateY(100%)" },
    "100%": { transform: "translateY(0)" }
  },
  "bounce": {
    "0%, 20%, 53%, 80%, 100%": { transform: "translate3d(0,0,0)" },
    "40%, 43%": { transform: "translate3d(0,-30px,0)" },
    "70%": { transform: "translate3d(0,-15px,0)" },
    "90%": { transform: "translate3d(0,-4px,0)" }
  }
}

// Usage in components
const fadeInAnimation = css({
  animation: "fade-in 300ms ease-out"
})

const bounceOnHover = css({
  _hover: {
    animation: "bounce 1s ease-in-out"
  }
})
```

### 2. Transition-Based Animations

For interactive animations, use transitions:

```tsx
const interactiveCard = css({
  padding: "6",
  bg: "card",
  borderRadius: "lg",
  border: "1px solid token(colors.border)",
  cursor: "pointer",
  transition: "all 200ms ease-out",
  
  _hover: {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    borderColor: "primary"
  },
  
  _active: {
    transform: "translateY(-2px)"
  }
})
```

### 3. Custom Hook Patterns

For complex animations, create reusable hooks:

```tsx
const useRippleEffect = (color = "currentColor", duration = 600) => {
  const [ripples, setRipples] = useState([])
  
  const createRipple = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    const newRipple = { 
      id: Date.now() + Math.random(), 
      x, 
      y 
    }
    
    setRipples(prev => [...prev, newRipple])
    
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id))
    }, duration)
  }, [duration])

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
        bg: color,
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

// Usage
const RippleButton = ({ children, ...props }) => {
  const { createRipple, rippleContainer, rippleElements } = useRippleEffect()
  
  return (
    <button
      className={cx(
        rippleContainer,
        buttonVariants({ variant: "default" })
      )}
      onClick={createRipple}
      {...props}
    >
      {children}
      {rippleElements}
    </button>
  )
}
```

## Responsive Design

### 1. Mobile-First Approach

Always start with mobile styles and progressively enhance:

```tsx
const responsiveLayout = css({
  // Mobile base
  display: "flex",
  flexDirection: "column",
  gap: "4",
  padding: "4",
  
  // Tablet (768px+)
  "@media (min-width: 768px)": {
    flexDirection: "row",
    gap: "6",
    padding: "6"
  },
  
  // Desktop (1024px+)
  "@media (min-width: 1024px)": {
    gap: "8",
    padding: "8"
  },
  
  // Large screens (1280px+)
  "@media (min-width: 1280px)": {
    maxWidth: "1200px",
    marginX: "auto"
  }
})
```

### 2. Breakpoint Tokens

Use standardized breakpoints from the design system:

```tsx
const breakpointStyles = css({
  fontSize: "sm",
  
  // Use predefined breakpoints
  "@media (min-width: token(sizes.breakpoints.md))": {
    fontSize: "base"
  },
  
  "@media (min-width: token(sizes.breakpoints.lg))": {
    fontSize: "lg"
  }
})
```

### 3. Container Queries (When Supported)

For component-based responsive design:

```tsx
const cardGrid = css({
  display: "grid",
  gap: "4",
  
  // Container-based responsive grid
  "@container (min-width: 400px)": {
    gridTemplateColumns: "repeat(2, 1fr)"
  },
  
  "@container (min-width: 600px)": {
    gridTemplateColumns: "repeat(3, 1fr)"
  }
})
```

## Theme Integration

### 1. Using Design Tokens

Always use design tokens instead of hardcoded values:

```tsx
// ✅ Good - uses design tokens
const goodStyles = css({
  bg: "background",
  color: "foreground",
  border: "1px solid token(colors.border)",
  padding: "4",
  borderRadius: "md"
})

// ❌ Bad - hardcoded values
const badStyles = css({
  backgroundColor: "#ffffff",
  color: "#000000", 
  border: "1px solid #e5e5e5",
  padding: "16px",
  borderRadius: "6px"
})
```

### 2. Theme-Aware Components

Components should automatically adapt to theme changes:

```tsx
const themeAwareCard = css({
  bg: "card",
  color: "card.foreground",
  border: "1px solid token(colors.border)",
  
  // Light mode specific (when needed)
  _light: {
    backdropFilter: "blur(10px)"
  },
  
  // Dark mode specific (when needed)
  _dark: {
    borderColor: "border/50"
  }
})
```

### 3. Custom Theme Values

Extend the theme for project-specific needs:

```tsx
// In panda.config.ts
tokens: {
  colors: {
    brand: {
      50: { value: "#f0f9ff" },
      500: { value: "#3b82f6" },
      900: { value: "#1e3a8a" }
    }
  }
}

// Usage
const brandStyles = css({
  bg: "brand.500",
  color: "white",
  _hover: { bg: "brand.600" }
})
```

## Performance Best Practices

### 1. Style Memoization

Memoize dynamic styles to prevent unnecessary recalculations:

```tsx
const ExpensiveComponent = ({ position, color, size }) => {
  const styles = useMemo(() => css({
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    backgroundColor: color,
    width: size,
    height: size,
    transition: "all 200ms ease-out"
  }), [position.x, position.y, color, size])
  
  return <div className={styles} />
}
```

### 2. Conditional Class Application

Only apply classes when needed:

```tsx
const ConditionalStyling = ({ isActive, hasError, children }) => {
  return (
    <div
      className={cx(
        // Base styles
        css({
          padding: "4",
          borderRadius: "md"
        }),
        
        // Conditional styles
        isActive && css({
          bg: "primary",
          color: "primary.foreground"
        }),
        
        hasError && css({
          bg: "destructive",
          color: "destructive.foreground"
        })
      )}
    >
      {children}
    </div>
  )
}
```

### 3. Animation Performance

Optimize animations for 60fps performance:

```tsx
const performantAnimation = css({
  // Use transform instead of changing layout properties
  transform: "translateX(0)",
  transition: "transform 300ms ease-out",
  
  // Enable hardware acceleration
  willChange: "transform",
  backfaceVisibility: "hidden",
  
  _hover: {
    transform: "translateX(10px)"
  }
})

// For scroll-based animations
const useScrollAnimation = () => {
  const [scrollY, setScrollY] = useState(0)
  
  useEffect(() => {
    const handleScroll = throttle(() => {
      setScrollY(window.scrollY)
    }, 16) // ~60fps
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  
  return scrollY
}
```

## Common Patterns

### 1. Loading States

```tsx
const loadingButton = cva({
  base: {
    position: "relative",
    transition: "all 200ms ease-out"
  },
  variants: {
    loading: {
      true: {
        color: "transparent",
        pointerEvents: "none",
        
        "&::after": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "16px",
          height: "16px",
          marginTop: "-8px",
          marginLeft: "-8px",
          border: "2px solid currentColor",
          borderRightColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }
      }
    }
  }
})
```

### 2. Form Validation States

```tsx
const inputVariants = cva({
  base: {
    display: "flex",
    height: "10",
    width: "full",
    borderRadius: "md",
    border: "1px solid token(colors.input)",
    bg: "background",
    paddingX: "3",
    paddingY: "2",
    fontSize: "sm",
    transition: "all 200ms ease-out",
    
    _placeholder: {
      color: "muted.foreground"
    },
    
    _focusVisible: {
      outline: "2px solid token(colors.ring)",
      outlineOffset: "2px"
    },
    
    _disabled: {
      cursor: "not-allowed",
      opacity: 0.5
    }
  },
  variants: {
    state: {
      default: {},
      error: {
        borderColor: "destructive",
        _focusVisible: {
          outline: "2px solid token(colors.destructive)"
        }
      },
      success: {
        borderColor: "green.500",
        _focusVisible: {
          outline: "2px solid green.500"
        }
      }
    }
  }
})
```

### 3. Data Visualization

```tsx
const ChartBar = ({ value, maxValue, label, color = "primary" }) => {
  const percentage = (value / maxValue) * 100
  
  return (
    <div className={css({
      display: "flex",
      alignItems: "center",
      gap: "3",
      padding: "2"
    })}>
      <span className={css({
        minWidth: "20",
        fontSize: "sm",
        color: "muted.foreground"
      })}>
        {label}
      </span>
      
      <div className={css({
        flex: "1",
        height: "6",
        bg: "muted",
        borderRadius: "full",
        overflow: "hidden"
      })}>
        <div className={css({
          height: "full",
          bg: color,
          borderRadius: "full",
          transition: "width 500ms cubic-bezier(0.4, 0, 0.2, 1)",
          width: `${percentage}%`
        })} />
      </div>
      
      <span className={css({
        minWidth: "12",
        fontSize: "sm",
        fontWeight: "medium",
        textAlign: "right"
      })}>
        {value}
      </span>
    </div>
  )
}
```

### 4. Modal/Dialog Patterns

```tsx
const dialogOverlay = css({
  position: "fixed",
  inset: "0",
  zIndex: "50",
  bg: "black/80",
  backdropFilter: "blur(4px)",
  
  // Animation
  opacity: "0",
  animation: "fade-in 200ms ease-out forwards"
})

const dialogContent = css({
  position: "fixed",
  left: "50%",
  top: "50%",
  zIndex: "50",
  maxHeight: "85vh",
  maxWidth: "450px",
  width: "90%",
  transform: "translate(-50%, -50%)",
  
  bg: "background",
  border: "1px solid token(colors.border)",
  borderRadius: "lg",
  padding: "6",
  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
  
  // Animation
  scale: "0.95",
  opacity: "0",
  animation: "scale-in 200ms ease-out 100ms forwards"
})
```

## Testing Patterns

### 1. Testing Styled Components

```tsx
import { render, screen } from '@testing-library/react'
import { Button } from './button'

test('button renders with correct variant styles', () => {
  render(<Button variant="destructive">Delete</Button>)
  
  const button = screen.getByRole('button')
  expect(button).toHaveClass(expect.stringContaining('destructive'))
})

test('button applies custom className', () => {
  render(<Button className="custom-class">Click me</Button>)
  
  const button = screen.getByRole('button')
  expect(button).toHaveClass('custom-class')
})
```

### 2. Testing Animations

```tsx
test('button shows loading state', () => {
  render(<Button loading>Loading</Button>)
  
  const button = screen.getByRole('button')
  expect(button).toHaveClass(expect.stringContaining('loading'))
  expect(button).toHaveStyle('pointer-events: none')
})
```

### 3. Visual Regression Testing

```tsx
// playwright.config.ts
test('button visual regression', async ({ page }) => {
  await page.goto('/storybook/?path=/story/button--all-variants')
  await expect(page).toHaveScreenshot('button-variants.png')
})
```

## Debugging and Development Tools

### 1. Development Environment

```bash
# Watch mode for CSS regeneration
npm run panda:watch

# Build CSS for production
npm run panda:build

# Analyze bundle
npm run analyze
```

### 2. CSS Inspection

Check the generated CSS in the `styled-system` directory:

```
styled-system/
├── css/
│   ├── index.css      # Generated CSS
│   └── tokens.css     # Design tokens
├── tokens/
│   └── index.ts       # Token definitions
└── types/
    └── style-props.d.ts # TypeScript definitions
```

### 3. Performance Monitoring

```tsx
// Performance measurement
const useRenderPerformance = (componentName) => {
  useEffect(() => {
    performance.mark(`${componentName}-start`)
    
    return () => {
      performance.mark(`${componentName}-end`)
      performance.measure(
        `${componentName}-render`,
        `${componentName}-start`,
        `${componentName}-end`
      )
    }
  })
}
```

## Migration from Tailwind

### Quick Reference

| Tailwind | PandaCSS |
|----------|-----------|
| `className="bg-blue-500"` | `className={css({ bg: "blue.500" })}` |
| `className="text-lg font-bold"` | `className={css({ fontSize: "lg", fontWeight: "bold" })}` |
| `className="hover:bg-red-500"` | `className={css({ _hover: { bg: "red.500" } })}` |
| `className="md:flex-row"` | `className={css({ "@media (min-width: 768px)": { flexDirection: "row" } })}` |

### Converting Complex Classes

```tsx
// Tailwind
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">

// PandaCSS
<div className={css({
  display: "flex",
  alignItems: "center", 
  justifyContent: "space-between",
  padding: "4",
  bg: "white",
  borderRadius: "lg",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  transition: "box-shadow 300ms ease-out",
  _hover: {
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
  }
})}>
```

## Resources

- [PandaCSS Documentation](https://panda-css.com/)
- [Design Token Reference](./tokens.md)
- [Animation Examples](./examples/animations.md)
- [Performance Guidelines](./performance.md)

## Support

For questions or issues:
1. Check the [Troubleshooting Guide](./MIGRATION_GUIDE.md#troubleshooting)
2. Review [Common Patterns](#common-patterns)
3. Consult the [Migration Guide](./MIGRATION_GUIDE.md)
4. Open an issue in the project repository

---

This developer guide should serve as your primary reference for working with PandaCSS in the Wibbly Wobblaz project. Keep it bookmarked and refer to it regularly as you build new features and components.