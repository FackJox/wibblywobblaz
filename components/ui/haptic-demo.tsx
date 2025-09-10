"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { SwipeIndicatorSystem, SwipeHints } from '@/components/ui/swipe-indicators'
import { useHaptics, useSwipeHaptics, useLongPressHaptics, useUIHaptics, useHapticCapabilities } from '@/hooks/use-haptics'
import { useSwipe } from '@/hooks/use-swipe'
import { useLongPress } from '@/hooks/use-long-press'
import { HAPTIC_PATTERNS } from '@/lib/haptics'
import { cn } from '@/lib/utils'

export function HapticDemo() {
  const [showHints, setShowHints] = useState(false)
  const capabilities = useHapticCapabilities()
  
  // Main haptics hook
  const haptics = useHaptics({ persistPreferences: true })
  
  // Specialized haptic hooks
  const swipeHaptics = useSwipeHaptics()
  const longPressHaptics = useLongPressHaptics()
  const uiHaptics = useUIHaptics()

  // Demo swipe functionality
  const { swipeState, gestureHandlers: swipeHandlers } = useSwipe({
    onSwipeLeft: () => {
      swipeHaptics.swipeHaptics.onSwipeComplete()
      console.log('Swiped left!')
    },
    onSwipeRight: () => {
      swipeHaptics.swipeHaptics.onSwipeComplete()
      console.log('Swiped right!')
    },
    onSwipeProgress: (progress, direction) => {
      if (direction) {
        swipeHaptics.swipeHaptics.onSwipeProgress(progress)
      }
    }
  }, {
    swipeConfig: {
      minSwipeDistance: 50,
      minSwipeVelocity: 0.3,
      enableVisualFeedback: true
    }
  })

  // Demo long press functionality
  const { longPressState, longPressHandlers } = useLongPress({
    onLongPressStart: () => {
      longPressHaptics.longPressHaptics.onLongPressStart()
    },
    onLongPressProgress: (progress) => {
      longPressHaptics.longPressHaptics.onLongPressProgress(progress)
    },
    onLongPress: () => {
      longPressHaptics.longPressHaptics.onLongPressComplete()
      console.log('Long press completed!')
    },
    onLongPressCancel: () => {
      longPressHaptics.longPressHaptics.onLongPressCancel()
    }
  })

  const testPatterns = Object.keys(HAPTIC_PATTERNS).slice(0, 8) // Show first 8 for demo

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Haptic Feedback Demo</h1>
        <p className="text-muted-foreground">
          Experience tactile feedback with swipe gestures and long press interactions
        </p>
        
        {/* Capability badges */}
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant={capabilities.isSupported ? "default" : "secondary"}>
            Vibration: {capabilities.isSupported ? "Supported" : "Not Supported"}
          </Badge>
          {capabilities.isIOS && <Badge variant="outline">iOS</Badge>}
          {capabilities.isAndroid && <Badge variant="outline">Android</Badge>}
          {capabilities.hasReducedMotion && <Badge variant="secondary">Reduced Motion</Badge>}
        </div>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Haptic Settings</CardTitle>
          <CardDescription>
            Configure your haptic feedback preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Enable Haptic Feedback</label>
              <p className="text-xs text-muted-foreground">
                Turn on/off vibration feedback
              </p>
            </div>
            <Switch
              checked={haptics.preferences.enabled}
              onCheckedChange={haptics.setEnabled}
            />
          </div>

          {/* Intensity */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Intensity</label>
              <span className="text-sm text-muted-foreground">
                {Math.round(haptics.preferences.intensity * 100)}%
              </span>
            </div>
            <Slider
              value={[haptics.preferences.intensity]}
              onValueChange={([value]) => haptics.setIntensity(value)}
              min={0.1}
              max={1.0}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Fallback */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Fallback Mode</label>
            <div className="flex gap-2">
              {(['none', 'audio', 'visual'] as const).map((fallback) => (
                <Button
                  key={fallback}
                  variant={haptics.preferences.fallback === fallback ? "default" : "outline"}
                  size="sm"
                  onClick={() => haptics.updatePreferences({ fallback })}
                >
                  {fallback.charAt(0).toUpperCase() + fallback.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={haptics.resetPreferences}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHints(!showHints)}
            >
              {showHints ? 'Hide' : 'Show'} Gesture Hints
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pattern Testing */}
      <Card>
        <CardHeader>
          <CardTitle>Test Haptic Patterns</CardTitle>
          <CardDescription>
            Try different vibration patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {testPatterns.map((patternName) => (
              <Button
                key={patternName}
                variant="outline"
                size="sm"
                onClick={() => {
                  uiHaptics.uiHaptics.onTap()
                  haptics.haptic(patternName)
                }}
                disabled={haptics.isDisabled}
              >
                {patternName}
              </Button>
            ))}
          </div>
          
          {haptics.isDisabled && (
            <p className="text-xs text-muted-foreground mt-2">
              Haptic feedback is currently disabled
            </p>
          )}
        </CardContent>
      </Card>

      {/* Swipe Demo */}
      <Card 
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          swipeState.isSwaping && "scale-105 shadow-lg"
        )}
        onTouchStart={(e) => swipeHandlers.onTouchStart(e.nativeEvent)}
        onTouchMove={(e) => swipeHandlers.onTouchMove(e.nativeEvent)}
        onTouchEnd={(e) => swipeHandlers.onTouchEnd(e.nativeEvent)}
        onTouchCancel={(e) => swipeHandlers.onTouchCancel?.(e.nativeEvent)}
        onMouseDown={(e) => swipeHandlers.onMouseDown?.(e.nativeEvent)}
        onMouseMove={(e) => swipeHandlers.onMouseMove?.(e.nativeEvent)}
        onMouseUp={(e) => swipeHandlers.onMouseUp?.(e.nativeEvent)}
        onMouseLeave={(e) => swipeHandlers.onMouseLeave?.(e.nativeEvent)}
        onContextMenu={(e) => swipeHandlers.onContextMenu?.(e.nativeEvent)}
      >
        <CardHeader>
          <CardTitle>Swipe Gesture Demo</CardTitle>
          <CardDescription>
            Swipe left or right on this card
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-8 border-2 border-dashed rounded-lg">
            <div className="text-4xl mb-2">👆</div>
            <p className="text-sm text-muted-foreground">
              Swipe on this area to test haptic feedback
            </p>
            
            {swipeState.isSwaping && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">
                  Direction: {swipeState.direction || 'detecting...'}
                </p>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-100"
                    style={{ width: `${swipeState.progress * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Progress: {Math.round(swipeState.progress * 100)}%
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {/* Swipe indicators overlay */}
        <SwipeIndicatorSystem
          swipeState={swipeState}
          showIndicators={true}
          showProgressBar={true}
          showHints={false}
        />
      </Card>

      {/* Long Press Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Long Press Demo</CardTitle>
          <CardDescription>
            Press and hold the button below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            <Button
              variant="outline"
              size="lg"
              className={cn(
                "relative w-32 h-32 rounded-full transition-all duration-200",
                longPressState.isTracking && "scale-110 shadow-lg",
                longPressState.isPressed && "bg-primary text-primary-foreground"
              )}
              onTouchStart={(e) => longPressHandlers.onTouchStart(e.nativeEvent)}
              onTouchMove={(e) => longPressHandlers.onTouchMove(e.nativeEvent)}
              onTouchEnd={(e) => longPressHandlers.onTouchEnd(e.nativeEvent)}
              onTouchCancel={(e) => longPressHandlers.onTouchCancel(e.nativeEvent)}
              onMouseDown={(e) => {
                uiHaptics.uiHaptics.onButtonPress()
                longPressHandlers.onMouseDown(e.nativeEvent)
              }}
              onMouseMove={(e) => longPressHandlers.onMouseMove(e.nativeEvent)}
              onMouseUp={(e) => longPressHandlers.onMouseUp(e.nativeEvent)}
              onMouseLeave={(e) => longPressHandlers.onMouseLeave(e.nativeEvent)}
              onContextMenu={(e) => longPressHandlers.onContextMenu(e.nativeEvent)}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-medium">
                  {longPressState.isPressed ? 'Success!' : 'Hold Me'}
                </span>
                {longPressState.isTracking && (
                  <span className="text-xs">
                    {Math.round(longPressState.progress * 100)}%
                  </span>
                )}
              </div>
              
              {/* Progress ring */}
              {longPressState.isTracking && (
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    className="fill-none stroke-current stroke-1 opacity-20"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    className="fill-none stroke-current stroke-2"
                    strokeDasharray={`${longPressState.progress * 301.6} 301.6`}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              {longPressState.isTracking 
                ? `Hold for ${Math.round((1 - longPressState.progress) * 500)}ms more...`
                : 'Press and hold to activate'
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Performance Info */}
      <Card>
        <CardHeader>
          <CardTitle>Performance & Accessibility</CardTitle>
          <CardDescription>
            System information and optimizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Device Capabilities</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Vibration API: {capabilities.isSupported ? '✅' : '❌'}</li>
                <li>Platform: {capabilities.isIOS ? 'iOS' : capabilities.isAndroid ? 'Android' : 'Desktop/Other'}</li>
                <li>Reduced Motion: {capabilities.hasReducedMotion ? '✅ Respected' : '❌ Normal'}</li>
                <li>Current Fallback: {haptics.preferences.fallback}</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Performance Features</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>✅ 60fps gesture tracking</li>
                <li>✅ Debounced haptic triggers</li>
                <li>✅ Progressive enhancement</li>
                <li>✅ Battery-aware patterns</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tutorial hints overlay */}
      <SwipeHints
        show={showHints}
        gestures={['swipe-left', 'swipe-right', 'long-press']}
        position="bottom"
        autoHide={0} // Don't auto-hide in demo
        onDismiss={() => setShowHints(false)}
      />
    </div>
  )
}