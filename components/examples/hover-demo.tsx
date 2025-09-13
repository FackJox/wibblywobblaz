"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useMagneticHover } from "@/hooks/use-magnetic-hover"
import { useGradientFollow } from "@/hooks/use-gradient-follow"
import { useTextReveal } from "@/hooks/use-text-reveal"

/**
 * Demo component showcasing all hover enhancement features
 */
export function HoverDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
            Hover Enhancements Demo
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore the interactive hover effects: magnetic attraction, gradient following, and text reveals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Enhanced Card with All Effects */}
          <Card enhancedHover className="h-64">
            <CardHeader>
              <CardTitle textReveal>All Effects</CardTitle>
              <CardDescription>
                This card combines magnetic, gradient, and parallax effects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Hover to see all hover enhancements working together seamlessly.
              </p>
            </CardContent>
          </Card>

          {/* Magnetic Only */}
          <Card magnetic className="h-64">
            <CardHeader>
              <CardTitle>Magnetic Attraction</CardTitle>
              <CardDescription>
                Card follows your cursor with smooth attraction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Move your cursor around this card to see the magnetic effect.
              </p>
            </CardContent>
          </Card>

          {/* Gradient Follow */}
          <Card gradientFollow className="h-64">
            <CardHeader>
              <CardTitle>Gradient Follow</CardTitle>
              <CardDescription>
                Spotlight effect tracks cursor movement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                A subtle gradient spotlight follows your cursor position.
              </p>
            </CardContent>
          </Card>

          {/* Parallax Depth */}
          <Card parallax parallaxDepth={0.3} className="h-64">
            <CardHeader>
              <CardTitle>Parallax Depth</CardTitle>
              <CardDescription>
                3D tilt effect based on cursor position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                The card tilts in 3D space as you move your cursor.
              </p>
            </CardContent>
          </Card>

          {/* Interactive with Ripple */}
          <Card interactive ripple className="h-64">
            <CardHeader>
              <CardTitle textReveal textRevealConfig={{ type: 'slide', by: 'word' }}>
                Interactive Card
              </CardTitle>
              <CardDescription>
                Combines text reveal with ripple effects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Click for ripple effect, hover for text animation.
              </p>
            </CardContent>
          </Card>

          {/* Custom Configuration */}
          <Card 
            magnetic 
            magneticConfig={{ strength: 0.5, maxDistance: 120 }}
            gradientFollow
            gradientConfig={{ 
              colors: ['rgba(59, 130, 246, 0.2)', 'transparent'],
              radius: 180
            }}
            className="h-64"
          >
            <CardHeader>
              <CardTitle>
                Custom Effects
              </CardTitle>
              <CardDescription>
                Customized magnetic strength and gradient colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                This card uses custom configurations for stronger effects.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Standalone Hover Hook Demos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <MagneticButtonDemo />
          <GradientTrackingDemo />
          <TextRevealDemo />
        </div>
      </div>
    </div>
  )
}

/**
 * Demo of standalone magnetic hover hook
 */
function MagneticButtonDemo() {
  const magnetic = useMagneticHover<HTMLButtonElement>({
    strength: 0.4,
    maxDistance: 100,
    boundaries: { x: 0.6, y: 0.6 }
  })

  return (
    <div className="text-center space-y-4">
      <h3 className="text-xl font-semibold">Magnetic Button</h3>
      <Button
        ref={magnetic.ref}
        size="lg"
        className="relative transition-all duration-300"
        style={{
          transform: magnetic.isActive 
            ? `translate3d(${magnetic.transform.x}px, ${magnetic.transform.y}px, 0)` 
            : 'none'
        }}
      >
        {magnetic.isHovered ? 'Attracted!' : 'Hover Me'}
      </Button>
      <p className="text-sm text-slate-500">
        Transform: ({magnetic.transform.x.toFixed(1)}, {magnetic.transform.y.toFixed(1)})
      </p>
    </div>
  )
}

/**
 * Demo of gradient following hook
 */
function GradientTrackingDemo() {
  const gradient = useGradientFollow<HTMLDivElement>({
    colors: ['rgba(236, 72, 153, 0.3)', 'rgba(59, 130, 246, 0.2)', 'transparent'],
    radius: 200,
    smooth: true,
    hoverOnly: false
  })

  return (
    <div className="text-center space-y-4">
      <h3 className="text-xl font-semibold">Gradient Tracking</h3>
      <div
        ref={gradient.ref}
        className="w-full h-32 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center relative overflow-hidden"
        style={{
          background: gradient.gradientValue || 'transparent'
        }}
      >
        <span className="text-slate-600 dark:text-slate-400 relative z-10">
          Move cursor here
        </span>
      </div>
      <p className="text-sm text-slate-500">
        Cursor: ({gradient.cursorPosition.x.toFixed(0)}, {gradient.cursorPosition.y.toFixed(0)})
      </p>
    </div>
  )
}

/**
 * Demo of text reveal hook
 */
function TextRevealDemo() {
  const textReveal = useTextReveal<HTMLHeadingElement>({
    type: 'slide',
    by: 'character',
    stagger: 40,
    triggerOn: 'hover',
    resetOnLeave: true
  })

  return (
    <div className="text-center space-y-4">
      <h3 className="text-xl font-semibold">Text Reveal</h3>
      <div className="h-32 flex items-center justify-center">
        <h4
          ref={textReveal.ref}
          className="text-2xl font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
        >
          Hover to Reveal!
        </h4>
      </div>
      <p className="text-sm text-slate-500">
        {textReveal.isRevealed ? 'Revealed!' : 'Hidden'} | 
        {textReveal.isHovered ? ' Hovering' : ' Not hovering'}
      </p>
    </div>
  )
}

export default HoverDemo