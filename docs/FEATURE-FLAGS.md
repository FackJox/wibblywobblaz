# Feature Flags & Lazy Loading System

A comprehensive animation control system that adapts animations based on device capabilities, user preferences, and performance budgets.

## Overview

The feature flag system provides intelligent animation management through:

- **Device Detection**: Automatic capability detection (CPU, memory, GPU, network)
- **Progressive Enhancement**: Graceful degradation for low-end devices
- **Lazy Loading**: Viewport-based animation loading with performance optimization
- **Instance Management**: Budget-controlled animation instances
- **Quality Adaptation**: Three quality levels (low/medium/high) based on device performance

## Quick Start

### Basic Usage

```tsx
import { useFeatureFlags } from './hooks/use-feature-flags'

function MyComponent() {
  const { isEnabled, getQuality } = useFeatureFlags()
  
  if (!isEnabled('hover')) {
    return <StaticButton>Click me</StaticButton>
  }
  
  return <AnimatedButton quality={getQuality('hover')}>Click me</AnimatedButton>
}
```

### Lazy Loading

```tsx
import { LazyParallax } from './components/lazy'

function HeroSection() {
  return (
    <LazyParallax
      config={{ speed: 0.5, direction: 'vertical' }}
      fallback={<div>Static content</div>}
    >
      <HeroContent />
    </LazyParallax>
  )
}
```

## Environment Configuration

### Production Control

```bash
# .env.local or deployment environment
NEXT_PUBLIC_ENABLE_ALL_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_COMPLEX_ANIMATIONS=true  
NEXT_PUBLIC_ENABLE_SCROLL_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_HOVER_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_MICRO_ANIMATIONS=true
NEXT_PUBLIC_FORCE_REDUCED_MOTION=false
NEXT_PUBLIC_ANIMATION_DEBUG=false
```

### Local Storage Overrides (Development)

```javascript
// Browser console
localStorage.setItem('animation-feature-flags', JSON.stringify({
  enableComplexAnimations: false,
  forceReducedMotion: true
}))
```

## Animation Types & Budgets

| Type | Description | Target FPS | Max Frame Time | Max Instances |
|------|-------------|------------|----------------|---------------|
| **micro** | Button ripples, small UI feedback | 60 | 16.67ms | 10 |
| **hover** | Interactive hover effects | 60 | 16.67ms | 5 |
| **transition** | Page transitions, reveals | 30 | 33.33ms | 8 |
| **scroll** | Scroll-triggered animations | 60 | 16.67ms | 4 |
| **complex** | Multi-step, resource-intensive | 30 | 33.33ms | 2 |

## Device Quality Levels

### High Performance
- CPU: >2 cores
- Memory: >2GB
- GPU: Hardware accelerated
- Network: Good connection
- **Result**: Full animation fidelity

### Medium Performance  
- CPU: 2-4 cores
- Memory: 1-2GB
- GPU: Basic acceleration
- **Result**: Balanced animations with some optimizations

### Low Performance
- CPU: ≤2 cores  
- Memory: <1GB
- GPU: Software rendering
- Network: Slow connection
- **Result**: Simplified animations, reduced complexity

## API Reference

### Core Hooks

#### `useFeatureFlags()`

```tsx
const {
  flags,           // Current flag configuration
  isEnabled,       // Check if animation type is enabled
  getQuality,      // Get quality level for animation type
  shouldLazyLoad,  // Check if type should be lazy loaded
  canCreateInstance,     // Check instance availability
  registerInstance,      // Register new animation instance
  unregisterInstance,    // Cleanup animation instance
  getInstanceCounts,     // Get current instance counts
  getDebugInfo          // Get debug information
} = useFeatureFlags()
```

#### `useAnimationInstance(type)`

```tsx
// Automatic registration and cleanup
const isActive = useAnimationInstance('hover')
```

#### `useAnimationConfig(type, baseConfig)`

```tsx
// Quality-aware configuration
const config = useAnimationConfig('complex', {
  duration: 1000,
  complexity: 1,
  frameRate: 60
})
// Returns adjusted config based on device quality
```

#### `useProgressiveAnimation(type, enhanced, fallback)`

```tsx
// Progressive enhancement
const animation = useProgressiveAnimation(
  'complex',
  () => <ComplexAnimation />,
  () => <SimpleAnimation />
)
```

### Lazy Components

#### `<LazyParallax>`

```tsx
<LazyParallax
  config={{
    speed: 0.5,              // Parallax speed multiplier
    direction: 'vertical',   // Direction of effect
    threshold: 0.1,          // Intersection threshold
    rootMargin: '50px'       // Intersection margin
  }}
  fallback={<StaticContent />}  // Fallback when disabled
  preload={false}              // Load immediately
>
  <Content />
</LazyParallax>
```

#### `<LazyScrollAnimations>`

```tsx
<LazyScrollAnimations
  animations={[
    {
      trigger: 'enter',
      start: 0,
      end: 100,
      properties: {
        opacity: { from: 0, to: 1 },
        translateY: { from: 50, to: 0 }
      }
    }
  ]}
  fallback={<StaticContent />}
>
  <Content />
</LazyScrollAnimations>
```

#### `<LazyTextReveal>`

```tsx
<LazyTextReveal
  animation="typewriter"    // Animation type
  duration={2000}          // Animation duration  
  delay={500}              // Start delay
  fallback={<span>Static text</span>}
>
  Animated text content
</LazyTextReveal>
```

### Utility Functions

#### Device Detection

```tsx
import { isLowEndDevice, getDeviceInfo } from './lib/performance-utils'

const isLowEnd = isLowEndDevice()
const deviceInfo = getDeviceInfo()
```

#### Performance Monitoring

```tsx
import { useIntersectionObserver } from './lib/performance-utils'

useIntersectionObserver(elementRef, (entries) => {
  // Handle intersection
}, {
  threshold: 0.1,
  rootMargin: '50px'
})
```

## Integration Examples

### With Existing Hooks

```tsx
function IntegratedComponent() {
  const { isEnabled } = useFeatureFlags()
  const isActive = useAnimationInstance('hover')
  const elementRef = useRef<HTMLDivElement>(null)
  
  // Only setup animation if enabled and instance available
  const magneticProps = (isEnabled('hover') && isActive)
    ? useMagneticHover(elementRef, { strength: 0.3 })
    : {}
    
  return <div ref={elementRef} {...magneticProps}>Content</div>
}
```

### Quality-Based Adaptation

```tsx
function QualityAwareComponent() {
  const { getQuality } = useFeatureFlags()
  const quality = getQuality('complex')
  
  const animationConfig = {
    duration: quality === 'high' ? 1000 : 500,
    complexity: quality === 'low' ? 0.3 : 1.0,
    updateRate: quality === 'high' ? 16 : 32
  }
  
  return <Animation config={animationConfig} />
}
```

## Development Tools

### Debug Overlay

```tsx
// Keyboard shortcuts (development only)
// Ctrl+Shift+P - Performance overlay
// Ctrl+Shift+A - Animation overlay  
// Ctrl+Shift+D - Both overlays

import { useFeatureFlagsDebug } from './hooks/use-feature-flags'

function DebugComponent() {
  const debug = useFeatureFlagsDebug()
  
  return (
    <button onClick={debug?.logFlags}>
      Log Feature Flags
    </button>
  )
}
```

### Console Utilities

```javascript
// Available in development mode
window.animationFlags.logFlags()
window.animationFlags.logDebugInfo()
window.animationFlags.toggleAnimation('complex')
```

## Performance Considerations

### Bundle Size Impact
- Core system: ~36KB (minified)
- Lazy loading saves initial bundle size
- Development tools are tree-shaken in production

### Runtime Performance
- Device detection: <5ms initialization
- Feature flag checks: <1ms per check
- Quality adjustments: Near-zero cost
- Instance management: Minimal overhead

### Memory Usage
- Instance tracking: <1MB for typical usage
- Lazy loading prevents memory bloat
- Automatic cleanup on component unmount

## Best Practices

### 1. Use Progressive Enhancement
```tsx
// Good: Fallback for disabled animations
const animation = useProgressiveAnimation(
  'complex',
  () => <ComplexAnimation />,
  () => <SimpleAnimation />
)

// Avoid: Assuming animations are always available
```

### 2. Respect Instance Limits
```tsx
// Good: Check instance availability
const isActive = useAnimationInstance('hover')
if (isActive) {
  // Setup animation
}

// Avoid: Creating animations without checking
```

### 3. Use Appropriate Animation Types
```tsx
// Good: Use correct type for animation complexity
useAnimationInstance('micro')    // For button feedback
useAnimationInstance('complex')  // For multi-step animations

// Avoid: Using wrong complexity level
```

### 4. Handle Loading States
```tsx
// Good: Provide meaningful fallbacks
<LazyParallax fallback={<StaticImage />}>
  <ParallaxImage />
</LazyParallax>

// Avoid: Empty fallbacks or loading states
```

## Troubleshooting

### Common Issues

**Animations not loading**
- Check if animation type is enabled: `isEnabled('type')`
- Verify instance availability: `useAnimationInstance('type')`
- Check device capabilities in debug info

**Performance issues**
- Monitor instance counts: `getInstanceCounts()`
- Check if hitting budget limits
- Use performance overlay for diagnostics

**SSR hydration mismatches**
- Device detection is SSR-safe with fallbacks
- Use `suppressHydrationWarning` if needed for animations

### Debug Commands

```javascript
// Console debugging
window.animationFlags.getDebugInfo()
window.animationFlags.manager.getInstanceCounts()

// Toggle specific animation types
window.animationFlags.toggleAnimation('complex')
```

## Production Deployment

### Recommended Settings

```bash
# Production environment
NEXT_PUBLIC_ENABLE_ALL_ANIMATIONS=true
NEXT_PUBLIC_ENABLE_COMPLEX_ANIMATIONS=true
NEXT_PUBLIC_FORCE_REDUCED_MOTION=false
NEXT_PUBLIC_ANIMATION_DEBUG=false
```

### Performance Monitoring

The system includes built-in performance monitoring:
- Frame rate tracking
- Memory usage monitoring  
- Instance count limits
- Automatic quality adjustment

### A/B Testing Support

```tsx
// Environment-based feature toggling
const complexAnimationsEnabled = 
  process.env.NEXT_PUBLIC_ENABLE_COMPLEX_ANIMATIONS === 'true'
```

## Migration Guide

### From Manual Animation Control

```tsx
// Before
const [animationsEnabled, setAnimationsEnabled] = useState(true)

// After  
const { isEnabled } = useFeatureFlags()
const enabled = isEnabled('hover')
```

### From Static Animations

```tsx
// Before
<ParallaxComponent always />

// After
<LazyParallax fallback={<StaticComponent />}>
  <ParallaxComponent />
</LazyParallax>
```

This system provides comprehensive control over animation performance while maintaining excellent developer experience and user accessibility.