export interface AnimationPerformanceMetrics {
  fps: number
  droppedFrames: number
  animationCount: number
  averageRenderTime: number
}

class AnimationPerformanceMonitor {
  private frameCount = 0
  private lastTime = performance.now()
  private fps = 60
  private droppedFrames = 0
  private animationCount = 0
  private renderTimes: number[] = []
  private rafId: number | null = null
  private callbacks: Set<(metrics: AnimationPerformanceMetrics) => void> = new Set()

  start() {
    if (this.rafId !== null) return
    
    const measure = (currentTime: number) => {
      this.frameCount++
      
      const delta = currentTime - this.lastTime
      
      // Check for dropped frames (> 17ms between frames indicates < 60fps)
      if (delta > 17) {
        this.droppedFrames++
      }
      
      // Calculate FPS every second
      if (this.frameCount >= 60) {
        this.fps = Math.round(1000 / (delta / this.frameCount))
        this.frameCount = 0
        this.lastTime = currentTime
        
        this.notifyCallbacks()
      }
      
      this.rafId = requestAnimationFrame(measure)
    }
    
    this.rafId = requestAnimationFrame(measure)
  }

  stop() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  }

  recordAnimationStart() {
    this.animationCount++
  }

  recordRenderTime(time: number) {
    this.renderTimes.push(time)
    if (this.renderTimes.length > 100) {
      this.renderTimes.shift()
    }
  }

  getMetrics(): AnimationPerformanceMetrics {
    const averageRenderTime = this.renderTimes.length > 0
      ? this.renderTimes.reduce((a, b) => a + b, 0) / this.renderTimes.length
      : 0

    return {
      fps: this.fps,
      droppedFrames: this.droppedFrames,
      animationCount: this.animationCount,
      averageRenderTime
    }
  }

  subscribe(callback: (metrics: AnimationPerformanceMetrics) => void) {
    this.callbacks.add(callback)
    return () => this.callbacks.delete(callback)
  }

  private notifyCallbacks() {
    const metrics = this.getMetrics()
    this.callbacks.forEach(cb => cb(metrics))
  }

  reset() {
    this.frameCount = 0
    this.droppedFrames = 0
    this.animationCount = 0
    this.renderTimes = []
    this.fps = 60
  }
}

export const performanceMonitor = new AnimationPerformanceMonitor()

// Utility to check if device can handle animations
export const canHandleAnimations = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return false
  }
  
  // Check device memory (if available)
  const nav = navigator as any
  if (nav.deviceMemory && nav.deviceMemory < 4) {
    return false
  }
  
  // Check connection speed (if available)
  if (nav.connection) {
    const connection = nav.connection
    if (connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
      return false
    }
  }
  
  return true
}