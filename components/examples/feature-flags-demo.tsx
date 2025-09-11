"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { useFeatureFlags, useFeatureFlagsDebug } from "../../hooks/use-feature-flags"
import { LazyParallax, LazyTextReveal, LazyScrollAnimations } from "../lazy"
import { useRipple } from "../../hooks/use-ripple"
import { useMagneticHover } from "../../hooks/use-magnetic-hover"

/**
 * Comprehensive demonstration of the feature flag system
 * Shows how animations adapt to device capabilities and user preferences
 */
export function FeatureFlagsDemo() {
  const { 
    flags, 
    isEnabled, 
    getQuality, 
    getInstanceCounts,
    getDebugInfo 
  } = useFeatureFlags()
  
  const debugTools = useFeatureFlagsDebug()

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Feature Flags & Lazy Loading Demo</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          This demo shows how animations adapt based on device capabilities, 
          user preferences, and performance budgets. Try different device types 
          and reduced motion settings to see the system adapt.
        </p>
      </div>

      {/* Feature Flag Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(flags).map(([type, config]) => (
          <FeatureFlagCard
            key={type}
            animationType={type as any}
            config={config}
            isEnabled={isEnabled(type as any)}
            quality={getQuality(type as any)}
            instanceCount={getInstanceCounts()[type as keyof ReturnType<typeof getInstanceCounts>]}
          />
        ))}
      </div>

      {/* Interactive Examples */}
      <div className="grid gap-6">
        <MicroAnimationExamples />
        <HoverAnimationExamples />
        <ScrollAnimationExamples />
        <ComplexAnimationExamples />
      </div>

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <DebugPanel debugTools={debugTools} getDebugInfo={getDebugInfo} />
      )}
    </div>
  )
}

/**
 * Individual feature flag status card
 */
function FeatureFlagCard({ 
  animationType, 
  config, 
  isEnabled, 
  quality,
  instanceCount 
}: {
  animationType: string
  config: any
  isEnabled: boolean
  quality: string
  instanceCount: number
}) {
  const getStatusColor = () => {
    if (!isEnabled) return "bg-red-500"
    if (quality === 'low') return "bg-yellow-500"
    if (quality === 'high') return "bg-green-500"
    return "bg-blue-500"
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm capitalize">{animationType}</CardTitle>
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Status:</span>
            <Badge variant={isEnabled ? "default" : "destructive"}>
              {isEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="flex justify-between text-xs">
            <span>Quality:</span>
            <Badge variant="outline">{quality}</Badge>
          </div>
          <div className="flex justify-between text-xs">
            <span>Instances:</span>
            <span>{instanceCount}/{config.maxInstances}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>Lazy Load:</span>
            <span>{config.lazyLoad ? "Yes" : "No"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Micro animation examples (buttons, ripples)
 */
function MicroAnimationExamples() {
  const { isEnabled } = useFeatureFlags()
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const rippleEvents = useRipple(buttonRef)

  if (!isEnabled('micro')) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Micro Animations</CardTitle>
          <CardDescription>Micro animations are disabled on this device</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-x-4">
            <Button ref={buttonRef}>Static Button</Button>
            <Button variant="outline">Another Button</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Micro Animations</CardTitle>
        <CardDescription>Quick, subtle animations for immediate feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-x-4">
          <Button 
            ref={buttonRef}
            {...rippleEvents}
            className="relative overflow-hidden"
          >
            Ripple Button
          </Button>
          <Button variant="outline">Hover Button</Button>
          <Button variant="ghost">Ghost Button</Button>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Hover animation examples
 */
function HoverAnimationExamples() {
  const { isEnabled, getQuality } = useFeatureFlags()
  const cardRef = React.useRef<HTMLDivElement>(null)
  
  // Only use magnetic hover if enabled
  const magneticProps = isEnabled('hover') 
    ? useMagneticHover(cardRef, { 
        strength: getQuality('hover') === 'high' ? 0.3 : 0.1,
        radius: getQuality('hover') === 'low' ? 50 : 100 
      })
    : {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hover Animations</CardTitle>
        <CardDescription>
          {isEnabled('hover') 
            ? `Interactive hover effects (${getQuality('hover')} quality)`
            : "Hover animations disabled"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            ref={cardRef}
            className={`p-4 text-center transition-all duration-300 ${
              isEnabled('hover') ? 'hover:shadow-lg cursor-pointer' : ''
            }`}
            {...magneticProps}
          >
            <h4 className="font-semibold">Magnetic Card</h4>
            <p className="text-sm text-muted-foreground">
              {isEnabled('hover') ? 'Hover to see effect' : 'Static card'}
            </p>
          </Card>
          
          <Card className={`p-4 text-center transition-all duration-300 ${
            isEnabled('hover') ? 'hover:scale-105 hover:shadow-lg cursor-pointer' : ''
          }`}>
            <h4 className="font-semibold">Scale Card</h4>
            <p className="text-sm text-muted-foreground">Hover to scale</p>
          </Card>

          <Card className={`p-4 text-center transition-all duration-300 ${
            isEnabled('hover') ? 'hover:-translate-y-1 hover:shadow-lg cursor-pointer' : ''
          }`}>
            <h4 className="font-semibold">Lift Card</h4>
            <p className="text-sm text-muted-foreground">Hover to lift</p>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Scroll animation examples with lazy loading
 */
function ScrollAnimationExamples() {
  const { isEnabled, shouldLazyLoad } = useFeatureFlags()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scroll Animations</CardTitle>
        <CardDescription>
          {isEnabled('scroll')
            ? `Scroll-triggered animations ${shouldLazyLoad('scroll') ? '(lazy loaded)' : ''}`
            : "Scroll animations disabled"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8 min-h-[400px]">
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
            fallback={<div className="p-4 bg-muted rounded-lg">Static content - scroll animations disabled</div>}
          >
            <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
              <h3 className="text-xl font-bold mb-2">Fade In Animation</h3>
              <p>This content animates when scrolled into view</p>
            </div>
          </LazyScrollAnimations>

          <LazyParallax
            config={{ speed: 0.5, direction: 'vertical' }}
            fallback={<div className="p-4 bg-muted rounded-lg">Static parallax content</div>}
          >
            <div className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg">
              <h3 className="text-xl font-bold mb-2">Parallax Element</h3>
              <p>This moves at a different speed when scrolling</p>
            </div>
          </LazyParallax>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Complex animation examples with progressive enhancement
 */
function ComplexAnimationExamples() {
  const { isEnabled, getQuality } = useFeatureFlags()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Complex Animations</CardTitle>
        <CardDescription>
          {isEnabled('complex')
            ? `Advanced animations with ${getQuality('complex')} quality`
            : "Complex animations disabled for this device"
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <LazyTextReveal
            animation="wave"
            duration={2000}
            fallback={<h2 className="text-2xl font-bold">Text Reveal Animation</h2>}
          >
            Text Reveal Animation
          </LazyTextReveal>

          <LazyTextReveal
            animation="typewriter"
            duration={3000}
            fallback={<p className="text-lg">This text would reveal character by character</p>}
          >
            This text would reveal character by character
          </LazyTextReveal>

          {!isEnabled('complex') && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Complex animations are disabled on this device to maintain performance. 
                The system detected limited device capabilities or reduced motion preferences.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Development debug panel
 */
function DebugPanel({ 
  debugTools, 
  getDebugInfo 
}: { 
  debugTools: any
  getDebugInfo: () => any 
}) {
  const [debugInfo, setDebugInfo] = React.useState<any>(null)

  const refreshDebugInfo = () => {
    setDebugInfo(getDebugInfo())
  }

  React.useEffect(() => {
    refreshDebugInfo()
  }, [])

  if (!debugTools) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Debug Information</CardTitle>
        <CardDescription>Development tools for feature flag debugging</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Button size="sm" onClick={debugTools.logFlags}>
              Log Flags to Console
            </Button>
            <Button size="sm" onClick={debugTools.logDebugInfo}>
              Log Debug Info
            </Button>
            <Button size="sm" onClick={debugTools.logInstanceCounts}>
              Log Instance Counts
            </Button>
            <Button size="sm" onClick={refreshDebugInfo}>
              Refresh Info
            </Button>
          </div>

          {debugInfo && (
            <div className="space-y-2">
              <h4 className="font-semibold">Device Capabilities:</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(debugInfo.deviceCaps, null, 2)}
              </pre>

              <h4 className="font-semibold">Instance Counts:</h4>
              <pre className="text-xs bg-muted p-2 rounded">
                {JSON.stringify(debugInfo.instanceCounts, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}