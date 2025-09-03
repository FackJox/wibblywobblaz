# Animation Infrastructure

This directory contains the animation infrastructure for the Wibbly Wobblaz landing page, built with Framer Motion and React.

## Structure

```
lib/animations/
├── constants.ts      # Animation tokens and performance thresholds
├── hooks/           # Custom animation hooks
│   ├── useAnimation.ts
│   ├── usePerformanceMonitor.ts
│   └── useReducedMotion.ts
├── variants/        # Reusable animation variants
│   └── index.ts
└── utils/          # Utility functions
    └── index.ts
```

## Usage

### Basic Animation

```tsx
import { useAnimation, fadeVariants } from "@/lib/animations";
import { motion } from "framer-motion";

function MyComponent() {
  const { shouldAnimate, getAnimationProps } = useAnimation();
  
  if (!shouldAnimate) {
    return <div>Content</div>;
  }
  
  return (
    <motion.div
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      {...getAnimationProps()}
    >
      Content
    </motion.div>
  );
}
```

### Performance Monitoring

```tsx
import { usePerformanceMonitor } from "@/lib/animations";

function MyPage() {
  const { metrics } = usePerformanceMonitor({
    onLowPerformance: (metrics) => {
      console.warn("Low FPS detected:", metrics.fps);
    }
  });
  
  return <div>FPS: {metrics.fps}</div>;
}
```

### Accessibility

The infrastructure automatically respects the user's `prefers-reduced-motion` setting. Use the `useReducedMotion` hook to check this preference:

```tsx
import { useReducedMotion } from "@/lib/animations";

function MyComponent() {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    // Render without animations
  }
}
```

## Animation Tokens

Available duration tokens:
- `instant`: 0.1s
- `fast`: 0.2s
- `normal`: 0.3s
- `slow`: 0.5s
- `slower`: 0.8s

Available easing curves:
- `smooth`: [0.4, 0, 0.2, 1]
- `bounce`: [0.68, -0.55, 0.265, 1.55]
- `elastic`: [0.5, 1.5, 0.4, 1]
- `linear`: [0, 0, 1, 1]
- `easeIn`: [0.4, 0, 1, 1]
- `easeOut`: [0, 0, 0.2, 1]
- `easeInOut`: [0.4, 0, 0.2, 1]

## Available Variants

- `fadeVariants`: Fade in/out
- `slideVariants`: Slide from left/right
- `scaleVariants`: Scale in/out
- `staggerContainerVariants`: Container for staggered children
- `staggerItemVariants`: Individual staggered items
- `rotateVariants`: Rotate in/out
- `blurVariants`: Blur in/out

## Performance Thresholds

- Target FPS: 60
- Warning FPS: 45
- Critical FPS: 30
- Max Animation Duration: 1000ms
- Warning Animation Duration: 800ms

## Testing

Visit `/animation-test` to see the animation infrastructure in action and test different animation types.