"use client"

import * as React from "react"
import { ThemeProvider } from "../components/theme-provider"
import { FeatureFlagsProvider } from "../hooks/use-feature-flags"
import { Toaster } from "../components/ui/sonner"

/**
 * Root providers for the application
 * 
 * Combines all context providers needed for the app:
 * - Theme provider for light/dark mode
 * - Feature flags provider for animation control
 * - Toast notifications
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <FeatureFlagsProvider>
        {children}
        <Toaster />
      </FeatureFlagsProvider>
    </ThemeProvider>
  )
}

/**
 * Development-only providers for debugging and performance monitoring
 * Only loaded in development mode to avoid bundle bloat
 */
export function DevProviders({ children }: { children: React.ReactNode }) {
  // Only load dev tools in development
  if (process.env.NODE_ENV !== 'development') {
    return <>{children}</>
  }

  // Lazy load dev components to avoid including them in production bundle
  const PerformanceOverlay = React.lazy(() => 
    import('../components/dev/performance-overlay').then(module => ({
      default: module.PerformanceOverlay
    }))
  )

  const AnimationPerformanceOverlay = React.lazy(() =>
    import('../components/dev/animation-performance-overlay').then(module => ({
      default: module.AnimationPerformanceOverlay
    }))
  )

  const [showPerformanceOverlay, setShowPerformanceOverlay] = React.useState(false)
  const [showAnimationOverlay, setShowAnimationOverlay] = React.useState(false)

  // Keyboard shortcuts for dev tools
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey) {
        switch (event.key) {
          case 'P':
            event.preventDefault()
            setShowPerformanceOverlay(prev => !prev)
            break
          case 'A':
            event.preventDefault()
            setShowAnimationOverlay(prev => !prev)
            break
          case 'D':
            event.preventDefault()
            // Toggle both overlays
            setShowPerformanceOverlay(prev => !prev)
            setShowAnimationOverlay(prev => !prev)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      {children}
      
      {/* Performance Overlays */}
      {showPerformanceOverlay && (
        <React.Suspense fallback={null}>
          <PerformanceOverlay 
            visible={showPerformanceOverlay}
            position="top-right"
            showDetailed={true}
          />
        </React.Suspense>
      )}
      
      {showAnimationOverlay && (
        <React.Suspense fallback={null}>
          <AnimationPerformanceOverlay 
            visible={showAnimationOverlay}
            position="top-left"
          />
        </React.Suspense>
      )}

      {/* Development hints */}
      {(showPerformanceOverlay || showAnimationOverlay) && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs p-2 rounded pointer-events-none z-50">
          <div>Ctrl+Shift+P: Toggle Performance</div>
          <div>Ctrl+Shift+A: Toggle Animation</div>
          <div>Ctrl+Shift+D: Toggle Both</div>
        </div>
      )}
    </>
  )
}