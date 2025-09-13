"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useFeatureFlags, useAnimationInstance, useAnimationConfig } from "../../hooks/use-feature-flags"
import { useRipple } from "../../hooks/use-ripple"
import { useMagneticHover } from "../../hooks/use-magnetic-hover"
import { useGradientFollow } from "../../hooks/use-gradient-follow"
import { LazyParallax } from "../lazy"

/**
 * Examples showing how to integrate feature flags with existing animation hooks
 */
export function IntegrationExamples() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Integration Examples</h2>
        <p className="text-muted-foreground">
          How to use feature flags with existing animation hooks
        </p>
      </div>

      <div className="grid gap-6">
        <FeatureGatedRippleButton />
        <AdaptiveMagneticCard />
        <QualityAwareGradientFollow />
        <ConditionalParallaxSection />
      </div>
    </div>
  )
}

/**
 * Example: Ripple button with feature flag integration
 */
function FeatureGatedRippleButton() {
  const { isEnabled } = useFeatureFlags()
  const isActive = useAnimationInstance('micro')
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  
  // Only setup ripple if micro animations are enabled and instance is active
  const rippleHook = (isEnabled('micro') && isActive) 
    ? useRipple({
        color: 'rgba(255, 255, 255, 0.5)',
        duration: 600
      })
    : null
  const rippleEvents = rippleHook ? rippleHook.getRippleProps() : {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature-Gated Ripple Button</CardTitle>
        <CardDescription>
          Ripple effect only loads if micro animations are enabled
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button
            ref={rippleHook ? rippleHook.rippleRef as React.RefObject<HTMLButtonElement> : buttonRef}
            {...rippleEvents}
            className="relative overflow-hidden"
          >
            {isEnabled('micro') && isActive ? 'Click for Ripple' : 'Static Button'}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Status: {isEnabled('micro') 
              ? isActive 
                ? 'Ripple active' 
                : 'Waiting for instance slot'
              : 'Micro animations disabled'
            }
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Example: Magnetic hover with quality-based configuration
 */
function AdaptiveMagneticCard() {
  const { isEnabled, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance('hover')
  const cardRef = React.useRef<HTMLDivElement>(null)
  
  // Adjust magnetic strength based on quality level
  const config = useAnimationConfig('hover', {
    duration: 300,
    easing: 'ease-out'
  })
  
  const magneticHook = (isEnabled('hover') && isActive)
    ? useMagneticHover({
        strength: config.enabled ? (config.complexity * 0.3) : 0
      })
    : null
  const magneticProps = magneticHook ? {} : {}

  const quality = getQuality('hover')

  return (
    <Card>
      <CardHeader>
        <CardTitle>Adaptive Magnetic Card</CardTitle>
        <CardDescription>
          Magnetic strength adapts to device quality level
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Card
          ref={magneticHook ? magneticHook.ref as React.RefObject<HTMLDivElement> : cardRef}
          className={`p-6 text-center transition-all cursor-pointer ${
            isEnabled('hover') && isActive ? 'hover:shadow-lg' : ''
          }`}
          {...magneticProps}
        >
          <h3 className="text-lg font-semibold mb-2">
            {quality === 'high' ? '🚀 High Performance' : 
             quality === 'medium' ? '⚡ Balanced' : 
             quality === 'low' ? '🐌 Efficient' : '🚫 Disabled'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Quality: {quality} | 
            Active: {isActive ? 'Yes' : 'No'} |
            Enabled: {isEnabled('hover') ? 'Yes' : 'No'}
          </p>
          <p className="text-xs mt-2">
            {quality === 'high' && 'Strong magnetic effect with smooth animation'}
            {quality === 'medium' && 'Moderate magnetic effect'}
            {quality === 'low' && 'Subtle magnetic effect for performance'}
            {!isEnabled('hover') && 'Static card - hover animations disabled'}
          </p>
        </Card>
      </CardContent>
    </Card>
  )
}

/**
 * Example: Gradient follow with progressive enhancement
 */
function QualityAwareGradientFollow() {
  const { isEnabled, getQuality } = useFeatureFlags()
  const isActive = useAnimationInstance('hover')
  const containerRef = React.useRef<HTMLDivElement>(null)
  
  const quality = getQuality('hover')
  const config = useAnimationConfig('hover', {
    duration: 200,
    complexity: 1
  })

  // Only use gradient follow if enabled and appropriate quality
  const gradientHook = (isEnabled('hover') && isActive && quality !== 'low')
    ? useGradientFollow({
        radius: quality === 'high' ? 200 : 150,
        opacity: config.complexity,
        // updateRate removed as it's not a valid prop
      })
    : null
  const gradientProps = gradientHook ? {} : {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality-Aware Gradient Follow</CardTitle>
        <CardDescription>
          Gradient effect skipped on low-end devices for performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={gradientHook ? gradientHook.ref as React.RefObject<HTMLDivElement> : containerRef}
          className={`p-8 rounded-lg border-2 border-dashed border-muted-foreground/20 text-center relative overflow-hidden ${
            isEnabled('hover') && isActive && quality !== 'low' ? 'cursor-none' : ''
          }`}
          {...gradientProps}
        >
          <h3 className="text-xl font-bold mb-4">Interactive Area</h3>
          <p className="text-muted-foreground mb-2">
            Move your mouse around this area
          </p>
          <div className="text-sm">
            {quality === 'high' && isActive && '✨ Full gradient effect with high update rate'}
            {quality === 'medium' && isActive && '⭐ Gradient effect with balanced performance'}
            {quality === 'low' && '🔋 Gradient disabled for battery/performance'}
            {!isEnabled('hover') && '🚫 Hover effects disabled'}
            {isEnabled('hover') && !isActive && '⏳ Waiting for animation instance'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Example: Lazy-loaded parallax with fallback
 */
function ConditionalParallaxSection() {
  const { isEnabled, shouldLazyLoad, getQuality } = useFeatureFlags()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conditional Parallax Section</CardTitle>
        <CardDescription>
          {isEnabled('scroll') 
            ? `Parallax enabled (${getQuality('scroll')} quality)${shouldLazyLoad('scroll') ? ' - Lazy loaded' : ''}`
            : 'Parallax disabled - showing static content'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="min-h-[300px]">
          <LazyParallax
            config={{
              speed: getQuality('scroll') === 'high' ? 0.5 : 0.3,
              direction: 'vertical'
            }}
            fallback={
              <div className="h-[200px] bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center text-white">
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">Static Content</h3>
                  <p>Scroll animations are disabled on this device</p>
                </div>
              </div>
            }
          >
            <div className="h-[200px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center text-white">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-2">Parallax Content</h3>
                <p>This moves at {getQuality('scroll') === 'high' ? '50%' : '30%'} scroll speed</p>
              </div>
            </div>
          </LazyParallax>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * Helper component to show usage in code
 */
export function CodeExamples() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Code Integration Examples</CardTitle>
        <CardDescription>How to integrate feature flags in your components</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Basic Feature Flag Check</h4>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`const { isEnabled } = useFeatureFlags()

if (!isEnabled('hover')) {
  return <StaticComponent />
}

return <AnimatedComponent />`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Quality-Based Configuration</h4>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`const { getQuality } = useFeatureFlags()
const config = useAnimationConfig('complex', {
  duration: 1000,
  complexity: 1
})

const strength = config.complexity * 0.5
const duration = config.duration`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Instance Management</h4>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`const isActive = useAnimationInstance('scroll')

// Hook only runs if instance is available
const parallax = isActive 
  ? useParallax(ref, config)
  : { bind: {} }`}
            </pre>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Progressive Enhancement</h4>
            <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
{`const animation = useProgressiveAnimation(
  'complex',
  () => complexAnimation(),
  () => simpleAnimation()
)`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}