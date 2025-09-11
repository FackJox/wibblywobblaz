"use client"

import * as React from "react"

/**
 * Animation Frame Budgeting System
 * Manages animation frame budgets to maintain 60fps performance
 */

interface AnimationTask {
  id: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  fn: () => void
  deadline: number
  estimatedCost: number
  retries: number
}

interface FrameBudget {
  remaining: number
  startTime: number
  frameNumber: number
}

interface BudgetStats {
  averageFrameTime: number
  droppedFrames: number
  queuedTasks: number
  completedTasks: number
  averageTaskCost: number
}

class AnimationFrameBudgetManager {
  private tasks = new Map<string, AnimationTask>()
  private taskQueue: AnimationTask[] = []
  private rafId: number | null = null
  private isProcessing = false
  
  // Performance targets
  private readonly TARGET_FPS = 60
  private readonly FRAME_BUDGET = 16.67 // ~16.67ms per frame for 60fps
  private readonly SAFETY_MARGIN = 2 // Leave 2ms buffer
  private readonly MAX_RETRIES = 3
  
  // Priority weights (higher = more important)
  private readonly PRIORITY_WEIGHTS = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  }
  
  // Performance tracking
  private frameCount = 0
  private droppedFrames = 0
  private completedTasks = 0
  private totalTaskTime = 0
  private lastFrameTime = 0
  private frameTimeHistory: number[] = []
  private readonly HISTORY_SIZE = 60 // Track last 60 frames

  constructor() {
    this.startBudgetLoop()
    
    // Monitor page visibility to adjust behavior
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.pauseBudgetLoop()
        } else {
          this.resumeBudgetLoop()
        }
      })
    }
  }

  /**
   * Schedule an animation task with budget management
   */
  schedule(
    id: string,
    fn: () => void,
    priority: AnimationTask['priority'] = 'medium',
    estimatedCost: number = 5, // Default 5ms estimate
    deadline?: number
  ): void {
    const task: AnimationTask = {
      id,
      fn,
      priority,
      estimatedCost: Math.max(0.1, estimatedCost), // Minimum 0.1ms
      deadline: deadline || performance.now() + 1000, // Default 1s deadline
      retries: 0
    }

    this.tasks.set(id, task)
    this.insertTaskByPriority(task)
  }

  /**
   * Cancel a scheduled task
   */
  cancel(id: string): boolean {
    if (this.tasks.has(id)) {
      this.tasks.delete(id)
      this.taskQueue = this.taskQueue.filter(task => task.id !== id)
      return true
    }
    return false
  }

  /**
   * Schedule a low-priority task (scroll effects, parallax)
   */
  scheduleLowPriority(id: string, fn: () => void, estimatedCost?: number): void {
    this.schedule(id, fn, 'low', estimatedCost)
  }

  /**
   * Schedule a high-priority task (user interactions, hover effects)
   */
  scheduleHighPriority(id: string, fn: () => void, estimatedCost?: number): void {
    this.schedule(id, fn, 'high', estimatedCost, performance.now() + 100) // 100ms deadline
  }

  /**
   * Schedule a critical task (must run this frame)
   */
  scheduleCritical(id: string, fn: () => void): void {
    this.schedule(id, fn, 'critical', 1, performance.now() + 16) // Must run within one frame
  }

  /**
   * Get current performance statistics
   */
  getStats(): BudgetStats {
    const avgFrameTime = this.frameTimeHistory.length > 0
      ? this.frameTimeHistory.reduce((a, b) => a + b, 0) / this.frameTimeHistory.length
      : 0

    return {
      averageFrameTime: avgFrameTime,
      droppedFrames: this.droppedFrames,
      queuedTasks: this.taskQueue.length,
      completedTasks: this.completedTasks,
      averageTaskCost: this.completedTasks > 0 ? this.totalTaskTime / this.completedTasks : 0
    }
  }

  /**
   * Check if system is under performance pressure
   */
  isUnderPressure(): boolean {
    const stats = this.getStats()
    return stats.averageFrameTime > 14 || // Close to frame budget
           stats.queuedTasks > 10 || // Too many queued tasks
           this.droppedFrames > 5 // Recent frame drops
  }

  /**
   * Automatically adjust animation quality based on performance
   */
  getRecommendedQuality(): 'high' | 'medium' | 'low' {
    const stats = this.getStats()
    
    if (stats.averageFrameTime < 8 && stats.queuedTasks < 3) {
      return 'high'
    } else if (stats.averageFrameTime < 12 && stats.queuedTasks < 8) {
      return 'medium'
    } else {
      return 'low'
    }
  }

  private insertTaskByPriority(newTask: AnimationTask): void {
    const priority = this.PRIORITY_WEIGHTS[newTask.priority]
    let insertIndex = 0
    
    // Find insertion point based on priority
    for (let i = 0; i < this.taskQueue.length; i++) {
      const taskPriority = this.PRIORITY_WEIGHTS[this.taskQueue[i].priority]
      if (priority > taskPriority) {
        insertIndex = i
        break
      }
      insertIndex = i + 1
    }
    
    this.taskQueue.splice(insertIndex, 0, newTask)
  }

  private startBudgetLoop(): void {
    if (this.rafId) return
    
    const processTasks = (timestamp: number) => {
      if (this.isProcessing) return
      this.isProcessing = true
      
      const frameStart = performance.now()
      const budget: FrameBudget = {
        remaining: this.FRAME_BUDGET - this.SAFETY_MARGIN,
        startTime: frameStart,
        frameNumber: this.frameCount++
      }

      // Track frame time
      if (this.lastFrameTime > 0) {
        const frameTime = frameStart - this.lastFrameTime
        this.frameTimeHistory.push(frameTime)
        if (this.frameTimeHistory.length > this.HISTORY_SIZE) {
          this.frameTimeHistory.shift()
        }
        
        // Detect dropped frames
        if (frameTime > 20) { // More than ~1.2x frame budget
          this.droppedFrames++
        }
      }
      this.lastFrameTime = frameStart

      // Process tasks within budget
      this.processBudgetedTasks(budget)
      
      // Clean up expired tasks
      this.cleanupExpiredTasks()
      
      this.isProcessing = false
      this.rafId = requestAnimationFrame(processTasks)
    }

    this.rafId = requestAnimationFrame(processTasks)
  }

  private processBudgetedTasks(budget: FrameBudget): void {
    while (this.taskQueue.length > 0 && budget.remaining > 1) {
      const task = this.taskQueue.shift()!
      
      // Skip expired tasks with retries
      if (performance.now() > task.deadline) {
        if (task.retries < this.MAX_RETRIES) {
          task.retries++
          task.deadline = performance.now() + 100 // Give 100ms extension
          this.insertTaskByPriority(task)
        } else {
          // Task expired, remove it
          this.tasks.delete(task.id)
        }
        continue
      }

      // Check if we have enough budget for estimated cost
      if (task.estimatedCost > budget.remaining && task.priority !== 'critical') {
        // Re-queue for next frame
        this.insertTaskByPriority(task)
        break
      }

      // Execute task and measure actual cost
      const taskStart = performance.now()
      
      try {
        task.fn()
        this.completedTasks++
        this.tasks.delete(task.id)
      } catch (error) {
        console.warn('Animation task failed:', task.id, error)
        this.tasks.delete(task.id)
      }
      
      const taskCost = performance.now() - taskStart
      this.totalTaskTime += taskCost
      budget.remaining -= taskCost

      // Update estimated cost based on actual performance
      if (this.tasks.has(task.id)) {
        task.estimatedCost = Math.max(task.estimatedCost * 0.8 + taskCost * 0.2, 0.1)
      }

      // If we're over budget, stop processing
      if (budget.remaining <= 0) {
        break
      }
    }
  }

  private cleanupExpiredTasks(): void {
    const now = performance.now()
    
    // Remove expired tasks that have exceeded retry limit
    for (const [id, task] of this.tasks) {
      if (now > task.deadline && task.retries >= this.MAX_RETRIES) {
        this.tasks.delete(id)
      }
    }
    
    // Remove expired tasks from queue
    this.taskQueue = this.taskQueue.filter(task => {
      if (now > task.deadline && task.retries >= this.MAX_RETRIES) {
        this.tasks.delete(task.id)
        return false
      }
      return true
    })
  }

  private pauseBudgetLoop(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  private resumeBudgetLoop(): void {
    if (!this.rafId) {
      this.startBudgetLoop()
    }
  }

  destroy(): void {
    this.pauseBudgetLoop()
    this.tasks.clear()
    this.taskQueue = []
    this.frameTimeHistory = []
  }
}

// Global singleton instance
let budgetManager: AnimationFrameBudgetManager | null = null

export function getAnimationFrameBudgetManager(): AnimationFrameBudgetManager {
  if (!budgetManager) {
    budgetManager = new AnimationFrameBudgetManager()
  }
  return budgetManager
}

// React hook for easy access
export function useAnimationFrameBudget() {
  const manager = getAnimationFrameBudgetManager()
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Note: Don't destroy the global manager, other components might use it
    }
  }, [])
  
  return {
    schedule: manager.schedule.bind(manager),
    cancel: manager.cancel.bind(manager),
    scheduleLowPriority: manager.scheduleLowPriority.bind(manager),
    scheduleHighPriority: manager.scheduleHighPriority.bind(manager),
    scheduleCritical: manager.scheduleCritical.bind(manager),
    getStats: manager.getStats.bind(manager),
    isUnderPressure: manager.isUnderPressure.bind(manager),
    getRecommendedQuality: manager.getRecommendedQuality.bind(manager)
  }
}

// Convenience functions
export const animationBudget = {
  schedule: (id: string, fn: () => void, priority?: AnimationTask['priority'], estimatedCost?: number) => {
    getAnimationFrameBudgetManager().schedule(id, fn, priority, estimatedCost)
  },
  cancel: (id: string) => getAnimationFrameBudgetManager().cancel(id),
  isUnderPressure: () => getAnimationFrameBudgetManager().isUnderPressure(),
  getQuality: () => getAnimationFrameBudgetManager().getRecommendedQuality(),
  getStats: () => getAnimationFrameBudgetManager().getStats()
}

// Export types
export type { AnimationTask, FrameBudget, BudgetStats }