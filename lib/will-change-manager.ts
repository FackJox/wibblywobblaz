"use client"

/**
 * Will-Change Manager - Strategic GPU layer management for animations
 * Prevents memory leaks by automatically managing will-change properties
 */

interface WillChangeOptions {
  /** Properties to add to will-change */
  properties: string[]
  /** Auto remove after duration (ms) */
  duration?: number
  /** Element priority (higher = longer retention) */
  priority?: 'low' | 'medium' | 'high'
  /** Remove will-change when animation ends */
  removeOnComplete?: boolean
}

interface ManagedElement {
  element: HTMLElement
  properties: Set<string>
  timeout?: NodeJS.Timeout
  priority: number
  timestamp: number
}

class WillChangeManager {
  private elements = new Map<HTMLElement, ManagedElement>()
  private cleanupInterval: NodeJS.Timeout | null = null
  private readonly CLEANUP_INTERVAL = 30000 // 30 seconds
  private readonly MAX_ELEMENTS = 50 // Prevent memory issues
  private readonly PRIORITY_WEIGHTS = {
    low: 1,
    medium: 2,
    high: 3
  }

  constructor() {
    this.startCleanupTimer()
    
    // Cleanup on page visibility change
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          this.cleanupAll()
        }
      })
    }
  }

  /**
   * Add will-change properties to element
   */
  add(element: HTMLElement, options: WillChangeOptions): void {
    if (!element || !options.properties.length) return

    const priority = this.PRIORITY_WEIGHTS[options.priority || 'medium']
    const existing = this.elements.get(element)

    // Remove any existing timeout
    if (existing?.timeout) {
      clearTimeout(existing.timeout)
    }

    // Combine with existing properties
    const properties = new Set([
      ...(existing?.properties || []),
      ...options.properties
    ])

    const managed: ManagedElement = {
      element,
      properties,
      priority,
      timestamp: Date.now()
    }

    // Set up auto-removal timeout if specified
    if (options.duration) {
      managed.timeout = setTimeout(() => {
        this.remove(element, options.properties)
      }, options.duration)
    }

    this.elements.set(element, managed)
    this.applyWillChange(element, properties)

    // Enforce element limit
    this.enforceElementLimit()
  }

  /**
   * Remove specific properties from element
   */
  remove(element: HTMLElement, properties?: string[]): void {
    const managed = this.elements.get(element)
    if (!managed) return

    if (managed.timeout) {
      clearTimeout(managed.timeout)
      managed.timeout = undefined
    }

    if (!properties) {
      // Remove all properties
      this.removeWillChange(element)
      this.elements.delete(element)
    } else {
      // Remove specific properties
      properties.forEach(prop => managed.properties.delete(prop))
      
      if (managed.properties.size === 0) {
        this.removeWillChange(element)
        this.elements.delete(element)
      } else {
        this.applyWillChange(element, managed.properties)
      }
    }
  }

  /**
   * Clear all will-change properties from element
   */
  clear(element: HTMLElement): void {
    this.remove(element)
  }

  /**
   * Add transform hints for animation
   */
  addTransform(element: HTMLElement, duration?: number): void {
    this.add(element, {
      properties: ['transform'],
      duration,
      priority: 'high'
    })
  }

  /**
   * Add opacity hints for fade animations
   */
  addOpacity(element: HTMLElement, duration?: number): void {
    this.add(element, {
      properties: ['opacity'],
      duration,
      priority: 'medium'
    })
  }

  /**
   * Add transform + opacity for complex animations
   */
  addTransformOpacity(element: HTMLElement, duration?: number): void {
    this.add(element, {
      properties: ['transform', 'opacity'],
      duration,
      priority: 'high'
    })
  }

  /**
   * Add contents hint for text animations
   */
  addContents(element: HTMLElement, duration?: number): void {
    this.add(element, {
      properties: ['contents'],
      duration,
      priority: 'low'
    })
  }

  /**
   * Add scroll-position for parallax effects
   */
  addScrollPosition(element: HTMLElement): void {
    this.add(element, {
      properties: ['scroll-position'],
      priority: 'medium'
    })
  }

  /**
   * Cleanup all managed elements
   */
  cleanupAll(): void {
    for (const [element, managed] of this.elements) {
      if (managed.timeout) {
        clearTimeout(managed.timeout)
      }
      this.removeWillChange(element)
    }
    this.elements.clear()
  }

  /**
   * Get current stats for debugging
   */
  getStats(): {
    elementCount: number
    propertiesTotal: number
    oldestElement: number
    averageAge: number
  } {
    const now = Date.now()
    const elements = Array.from(this.elements.values())
    const ages = elements.map(el => now - el.timestamp)
    
    return {
      elementCount: elements.length,
      propertiesTotal: elements.reduce((sum, el) => sum + el.properties.size, 0),
      oldestElement: Math.max(...ages, 0),
      averageAge: ages.length ? ages.reduce((sum, age) => sum + age, 0) / ages.length : 0
    }
  }

  private applyWillChange(element: HTMLElement, properties: Set<string>): void {
    const willChangeValue = Array.from(properties).join(', ')
    element.style.willChange = willChangeValue
    
    // Add GPU acceleration hint for transform properties
    if (properties.has('transform')) {
      element.style.transform = element.style.transform || 'translateZ(0)'
    }
  }

  private removeWillChange(element: HTMLElement): void {
    element.style.willChange = 'auto'
    
    // Remove GPU hint if it was our addition
    if (element.style.transform === 'translateZ(0)') {
      element.style.transform = ''
    }
  }

  private enforceElementLimit(): void {
    if (this.elements.size <= this.MAX_ELEMENTS) return

    // Remove oldest low-priority elements
    const elements = Array.from(this.elements.entries())
      .sort(([, a], [, b]) => {
        // Sort by priority (low first) then by age (old first)
        if (a.priority !== b.priority) {
          return a.priority - b.priority
        }
        return a.timestamp - b.timestamp
      })

    const toRemove = elements.slice(0, this.elements.size - this.MAX_ELEMENTS)
    toRemove.forEach(([element]) => this.remove(element))
  }

  private startCleanupTimer(): void {
    if (typeof window === 'undefined') return

    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      const STALE_THRESHOLD = 60000 // 1 minute

      for (const [element, managed] of this.elements) {
        // Remove stale elements
        if (now - managed.timestamp > STALE_THRESHOLD) {
          this.remove(element)
          continue
        }

        // Check if element is still in DOM
        if (!document.contains(element)) {
          this.remove(element)
        }
      }
    }, this.CLEANUP_INTERVAL)
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
    this.cleanupAll()
  }
}

// Global singleton instance
let willChangeManager: WillChangeManager | null = null

export function getWillChangeManager(): WillChangeManager {
  if (!willChangeManager) {
    willChangeManager = new WillChangeManager()
  }
  return willChangeManager
}

// Convenience hooks for React components
export function useWillChangeManager() {
  return getWillChangeManager()
}

// Animation-specific helpers
export const willChangeHelpers = {
  /**
   * Prepare element for transform animation
   */
  prepareTransform: (element: HTMLElement, duration?: number) => {
    getWillChangeManager().addTransform(element, duration)
  },

  /**
   * Prepare element for fade animation
   */
  prepareFade: (element: HTMLElement, duration?: number) => {
    getWillChangeManager().addOpacity(element, duration)
  },

  /**
   * Prepare element for complex animation
   */
  prepareComplex: (element: HTMLElement, duration?: number) => {
    getWillChangeManager().addTransformOpacity(element, duration)
  },

  /**
   * Prepare element for parallax scrolling
   */
  prepareParallax: (element: HTMLElement) => {
    getWillChangeManager().addScrollPosition(element)
    getWillChangeManager().addTransform(element)
  },

  /**
   * Clean up animation hints
   */
  cleanup: (element: HTMLElement) => {
    getWillChangeManager().clear(element)
  }
}

// Export types
export type { WillChangeOptions, ManagedElement }