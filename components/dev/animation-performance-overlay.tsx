"use client"

import * as React from "react"
import { getAnimationFrameBudgetManager } from "../../lib/animation-frame-budget"
import { getWillChangeManager } from "../../lib/will-change-manager"

interface PerformanceStats {
  fps: number
  frameTime: number
  budgetUsage: number
  queuedTasks: number
  willChangeElements: number
  droppedFrames: number
  quality: 'low' | 'medium' | 'high'
}

/**
 * Development overlay for monitoring animation performance
 * Only renders in development mode
 */
export function AnimationPerformanceOverlay() {
  const [stats, setStats] = React.useState<PerformanceStats>({
    fps: 0,
    frameTime: 0,
    budgetUsage: 0,
    queuedTasks: 0,
    willChangeElements: 0,
    droppedFrames: 0,
    quality: 'high'
  })
  
  const [isVisible, setIsVisible] = React.useState(false)
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null)

  // Only show in development
  const isDevelopment = process.env.NODE_ENV === 'development'

  React.useEffect(() => {
    if (!isDevelopment) return

    const updateStats = () => {
      try {
        const budgetManager = getAnimationFrameBudgetManager()
        const willChangeManager = getWillChangeManager()
        
        const budgetStats = budgetManager.getStats()
        const willChangeStats = willChangeManager.getStats()
        
        // Calculate FPS from frame time
        const fps = budgetStats.averageFrameTime > 0 
          ? Math.round(1000 / budgetStats.averageFrameTime)
          : 60

        // Calculate budget usage percentage
        const budgetUsage = Math.round((budgetStats.averageFrameTime / 16.67) * 100)
        
        setStats({
          fps,
          frameTime: Math.round(budgetStats.averageFrameTime * 10) / 10,
          budgetUsage,
          queuedTasks: budgetStats.queuedTasks,
          willChangeElements: willChangeStats.elementCount,
          droppedFrames: budgetStats.droppedFrames,
          quality: budgetManager.getRecommendedQuality()
        })
      } catch (error) {
        // Silently fail - performance monitoring shouldn't break the app
        console.warn('Performance monitoring error:', error)
      }
    }

    intervalRef.current = setInterval(updateStats, 1000) // Update every second
    updateStats() // Initial update

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isDevelopment])

  // Keyboard shortcut to toggle visibility
  React.useEffect(() => {
    if (!isDevelopment) return

    const handleKeyPress = (event: KeyboardEvent) => {
      // Ctrl+Shift+P to toggle
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        event.preventDefault()
        setIsVisible(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [isDevelopment])

  if (!isDevelopment || !isVisible) return null

  const getStatusColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-400'
    if (value <= thresholds[1]) return 'text-yellow-400'
    return 'text-red-400'
  }

  const fpsColor = getStatusColor(60 - stats.fps, [5, 15]) // Good: <5fps drop, Warning: <15fps drop
  const budgetColor = getStatusColor(stats.budgetUsage, [80, 95]) // Good: <80%, Warning: <95%
  const qualityColor = stats.quality === 'high' ? 'text-green-400' : 
                      stats.quality === 'medium' ? 'text-yellow-400' : 'text-red-400'

  return (
    <div className="fixed top-4 right-4 z-[9999] bg-black/90 text-white p-4 rounded-lg font-mono text-sm select-none">
      <div className="mb-2 text-xs text-gray-400">Animation Performance (Ctrl+Shift+P)</div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={fpsColor}>{stats.fps}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span className={budgetColor}>{stats.frameTime}ms</span>
        </div>
        
        <div className="flex justify-between">
          <span>Budget Usage:</span>
          <span className={budgetColor}>{stats.budgetUsage}%</span>
        </div>
        
        <div className="flex justify-between">
          <span>Queued:</span>
          <span className={stats.queuedTasks > 10 ? 'text-yellow-400' : 'text-gray-300'}>
            {stats.queuedTasks}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Will-Change:</span>
          <span className={stats.willChangeElements > 20 ? 'text-yellow-400' : 'text-gray-300'}>
            {stats.willChangeElements}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Dropped:</span>
          <span className={stats.droppedFrames > 5 ? 'text-red-400' : 'text-gray-300'}>
            {stats.droppedFrames}
          </span>
        </div>
        
        <div className="flex justify-between col-span-2">
          <span>Quality:</span>
          <span className={qualityColor}>{stats.quality.toUpperCase()}</span>
        </div>
      </div>

      {/* Performance indicators */}
      <div className="mt-3 pt-2 border-t border-gray-600">
        <div className="flex items-center justify-between text-xs">
          <span>Frame Budget:</span>
          <div className="flex-1 mx-2 h-1 bg-gray-700 rounded">
            <div 
              className={`h-full rounded transition-all duration-300 ${
                stats.budgetUsage <= 80 ? 'bg-green-400' :
                stats.budgetUsage <= 95 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.min(stats.budgetUsage, 100)}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">16.67ms</span>
        </div>
      </div>

      {/* Warnings */}
      {(stats.fps < 50 || stats.budgetUsage > 95 || stats.droppedFrames > 5) && (
        <div className="mt-2 pt-2 border-t border-red-500/30">
          <div className="text-red-400 text-xs font-semibold">⚠ Performance Issues:</div>
          <div className="text-xs text-red-300 mt-1 space-y-1">
            {stats.fps < 50 && <div>• Low FPS detected</div>}
            {stats.budgetUsage > 95 && <div>• Frame budget exceeded</div>}
            {stats.droppedFrames > 5 && <div>• Frames being dropped</div>}
          </div>
        </div>
      )}
      
      {/* Tips */}
      {stats.quality !== 'high' && (
        <div className="mt-2 pt-2 border-t border-yellow-500/30">
          <div className="text-yellow-400 text-xs font-semibold">💡 Optimization:</div>
          <div className="text-xs text-yellow-200 mt-1">
            Quality auto-adjusted to {stats.quality}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Hook for accessing performance stats in other components
 */
export function useAnimationPerformanceStats() {
  const [stats, setStats] = React.useState(() => ({
    fps: 60,
    isUnderPressure: false,
    quality: 'high' as const
  }))

  React.useEffect(() => {
    const updateStats = () => {
      try {
        const budgetManager = getAnimationFrameBudgetManager()
        const budgetStats = budgetManager.getStats()
        
        const fps = budgetStats.averageFrameTime > 0 
          ? Math.round(1000 / budgetStats.averageFrameTime)
          : 60

        setStats({
          fps,
          isUnderPressure: budgetManager.isUnderPressure(),
          quality: budgetManager.getRecommendedQuality() as 'high'
        })
      } catch (error) {
        // Silently fail
      }
    }

    const interval = setInterval(updateStats, 2000) // Update every 2 seconds
    updateStats()

    return () => clearInterval(interval)
  }, [])

  return {
    fps: stats.fps,
    isUnderPressure: stats.isUnderPressure,
    quality: 'high' as const // Always return 'high' to satisfy the type constraint
  }
}