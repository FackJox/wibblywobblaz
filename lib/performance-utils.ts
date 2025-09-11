/**
 * Performance measurement and optimization utilities for animations
 */

/**
 * Extended performance metrics for comprehensive animation profiling
 */
export interface ExtendedPerformanceMetrics {
  // Frame metrics
  fps: number;
  averageFps: number;
  minFps: number;
  maxFps: number;
  droppedFrames: number;
  totalFrames: number;
  
  // Animation-specific metrics
  animationLatency: number; // Time from trigger to first frame
  jankScore: number; // Percentage of frames that took >16.67ms
  frameVariance: number; // Consistency of frame timing
  memoryUsage: number; // Heap size (if available)
  
  // Performance classifications
  isPerformant: boolean; // >= 50 FPS
  isPoor: boolean; // <= 30 FPS
  isJanky: boolean; // High frame variance
  
  // Timing details
  lastFrameTime: number;
  averageFrameTime: number;
  longestFrame: number;
  
  // Device context
  devicePixelRatio: number;
  isLowEndDevice: boolean;
}

/**
 * Performance budget thresholds for different animation types
 */
export interface PerformanceBudget {
  maxFrameTime: number; // Maximum acceptable frame time (ms)
  targetFps: number; // Target FPS
  maxJankPercentage: number; // Maximum acceptable jank percentage
  maxMemoryIncrease: number; // Maximum memory increase (MB)
}

/**
 * Animation performance budgets by type
 */
export const PERFORMANCE_BUDGETS: Record<string, PerformanceBudget> = {
  'micro': {
    maxFrameTime: 16.67, // 60fps
    targetFps: 60,
    maxJankPercentage: 5,
    maxMemoryIncrease: 2
  },
  'scroll': {
    maxFrameTime: 16.67,
    targetFps: 60,
    maxJankPercentage: 10,
    maxMemoryIncrease: 5
  },
  'hover': {
    maxFrameTime: 16.67,
    targetFps: 60,
    maxJankPercentage: 5,
    maxMemoryIncrease: 1
  },
  'transition': {
    maxFrameTime: 33.33, // 30fps acceptable for transitions
    targetFps: 30,
    maxJankPercentage: 15,
    maxMemoryIncrease: 3
  },
  'complex': {
    maxFrameTime: 33.33,
    targetFps: 30,
    maxJankPercentage: 20,
    maxMemoryIncrease: 10
  }
};

/**
 * Detect if device is low-end based on various heuristics
 */
export function detectLowEndDevice(): boolean {
  // Check available APIs and device characteristics
  const checks = [
    // Hardware concurrency (CPU cores)
    navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2,
    
    // Device memory (if available)
    (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2,
    
    // Connection quality (if available)
    (navigator as any).connection && (navigator as any).connection.effectiveType === 'slow-2g',
    
    // Reduced motion preference
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    
    // Low device pixel ratio (older devices)
    window.devicePixelRatio <= 1
  ];
  
  // Consider low-end if any major indicators are true
  return checks.filter(Boolean).length >= 2;
}

/**
 * Measure memory usage if available
 */
export function getMemoryUsage(): number {
  if ('memory' in performance && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize / (1024 * 1024); // MB
  }
  return 0;
}

/**
 * Calculate jank score based on frame times
 */
export function calculateJankScore(frameTimes: number[]): number {
  if (frameTimes.length === 0) return 0;
  
  const jankyFrames = frameTimes.filter(time => time > 16.67).length;
  return (jankyFrames / frameTimes.length) * 100;
}

/**
 * Calculate frame timing variance for consistency measurement
 */
export function calculateFrameVariance(frameTimes: number[]): number {
  if (frameTimes.length < 2) return 0;
  
  const mean = frameTimes.reduce((sum, time) => sum + time, 0) / frameTimes.length;
  const variance = frameTimes.reduce((sum, time) => sum + Math.pow(time - mean, 2), 0) / frameTimes.length;
  
  return Math.sqrt(variance); // Standard deviation
}

/**
 * Performance profiler for tracking animation performance over time
 */
export class AnimationProfiler {
  private samples: ExtendedPerformanceMetrics[] = [];
  private isActive = false;
  private startTime = 0;
  private lastFrameTime = 0;
  private frameCount = 0;
  private frameTimes: number[] = [];
  private animationStartTime = 0;
  
  constructor(
    private maxSamples: number = 1000,
    private sampleInterval: number = 100
  ) {}
  
  /**
   * Start profiling
   */
  start(animationType: string = 'default'): void {
    this.isActive = true;
    this.startTime = performance.now();
    this.lastFrameTime = this.startTime;
    this.frameCount = 0;
    this.frameTimes = [];
    this.animationStartTime = this.startTime;
  }
  
  /**
   * Record a frame
   */
  recordFrame(): void {
    if (!this.isActive) return;
    
    const now = performance.now();
    const frameTime = now - this.lastFrameTime;
    
    this.frameCount++;
    this.frameTimes.push(frameTime);
    this.lastFrameTime = now;
    
    // Keep frame times within reasonable bounds for memory
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
  }
  
  /**
   * Get current metrics
   */
  getMetrics(): ExtendedPerformanceMetrics {
    const now = performance.now();
    const totalTime = now - this.startTime;
    const fps = this.frameCount > 0 ? (this.frameCount / totalTime) * 1000 : 0;
    
    const jankScore = calculateJankScore(this.frameTimes);
    const frameVariance = calculateFrameVariance(this.frameTimes);
    const averageFrameTime = this.frameTimes.length > 0 ? 
      this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length : 0;
    
    const longestFrame = this.frameTimes.length > 0 ? Math.max(...this.frameTimes) : 0;
    const animationLatency = this.frameTimes.length > 0 ? this.frameTimes[0] : 0;
    
    const isLowEnd = detectLowEndDevice();
    const memoryUsage = getMemoryUsage();
    
    return {
      fps: Math.round(fps),
      averageFps: Math.round(fps),
      minFps: Math.min(fps, 60),
      maxFps: Math.max(fps, 0),
      droppedFrames: Math.max(0, Math.round((totalTime / 16.67) - this.frameCount)),
      totalFrames: this.frameCount,
      
      animationLatency,
      jankScore,
      frameVariance,
      memoryUsage,
      
      isPerformant: fps >= 50,
      isPoor: fps <= 30,
      isJanky: jankScore > 10,
      
      lastFrameTime: this.frameTimes[this.frameTimes.length - 1] || 0,
      averageFrameTime,
      longestFrame,
      
      devicePixelRatio: window.devicePixelRatio,
      isLowEndDevice: isLowEnd
    };
  }
  
  /**
   * Stop profiling and return final metrics
   */
  stop(): ExtendedPerformanceMetrics {
    this.isActive = false;
    return this.getMetrics();
  }
  
  /**
   * Generate performance report
   */
  generateReport(animationType: string): PerformanceReport {
    const metrics = this.getMetrics();
    const budget = PERFORMANCE_BUDGETS[animationType] || PERFORMANCE_BUDGETS.micro;
    
    return {
      animationType,
      metrics,
      budget,
      passed: this.evaluatePerformance(metrics, budget),
      recommendations: this.generateRecommendations(metrics, budget)
    };
  }
  
  private evaluatePerformance(metrics: ExtendedPerformanceMetrics, budget: PerformanceBudget): boolean {
    return (
      metrics.fps >= budget.targetFps &&
      metrics.averageFrameTime <= budget.maxFrameTime &&
      metrics.jankScore <= budget.maxJankPercentage
    );
  }
  
  private generateRecommendations(
    metrics: ExtendedPerformanceMetrics, 
    budget: PerformanceBudget
  ): string[] {
    const recommendations: string[] = [];
    
    if (metrics.fps < budget.targetFps) {
      recommendations.push(`FPS (${metrics.fps}) below target (${budget.targetFps}). Consider optimizing animation complexity.`);
    }
    
    if (metrics.jankScore > budget.maxJankPercentage) {
      recommendations.push(`High jank score (${metrics.jankScore.toFixed(1)}%). Use will-change CSS property and GPU acceleration.`);
    }
    
    if (metrics.frameVariance > 5) {
      recommendations.push(`High frame variance (${metrics.frameVariance.toFixed(1)}ms). Consider using requestAnimationFrame throttling.`);
    }
    
    if (metrics.longestFrame > budget.maxFrameTime * 2) {
      recommendations.push(`Frame spike detected (${metrics.longestFrame.toFixed(1)}ms). Break down complex operations.`);
    }
    
    if (metrics.isLowEndDevice) {
      recommendations.push('Low-end device detected. Consider reduced animation complexity or feature flags.');
    }
    
    if (metrics.memoryUsage > 50) {
      recommendations.push(`High memory usage (${metrics.memoryUsage.toFixed(1)}MB). Check for memory leaks.`);
    }
    
    return recommendations;
  }
}

/**
 * Performance report structure
 */
export interface PerformanceReport {
  animationType: string;
  metrics: ExtendedPerformanceMetrics;
  budget: PerformanceBudget;
  passed: boolean;
  recommendations: string[];
}

/**
 * Utility to benchmark a function's performance
 */
export async function benchmark(
  fn: () => Promise<void> | void,
  iterations: number = 10,
  name: string = 'Function'
): Promise<{
  name: string;
  averageTime: number;
  minTime: number;
  maxTime: number;
  totalTime: number;
  iterations: number;
}> {
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  
  const totalTime = times.reduce((sum, time) => sum + time, 0);
  const averageTime = totalTime / iterations;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  return {
    name,
    averageTime,
    minTime,
    maxTime,
    totalTime,
    iterations
  };
}

/**
 * Create a performance-aware requestAnimationFrame wrapper
 */
export function createPerformantRAF(
  budget: PerformanceBudget = PERFORMANCE_BUDGETS.micro
) {
  let frameStartTime = 0;
  let frameCount = 0;
  let totalFrameTime = 0;
  
  return (callback: FrameRequestCallback): number => {
    return requestAnimationFrame((timestamp) => {
      frameStartTime = performance.now();
      
      callback(timestamp);
      
      const frameEndTime = performance.now();
      const frameTime = frameEndTime - frameStartTime;
      frameCount++;
      totalFrameTime += frameTime;
      
      // Log performance warnings
      if (frameTime > budget.maxFrameTime) {
        console.warn(`Frame budget exceeded: ${frameTime.toFixed(2)}ms (target: ${budget.maxFrameTime}ms)`);
      }
      
      // Log average performance every 60 frames
      if (frameCount % 60 === 0) {
        const avgFrameTime = totalFrameTime / frameCount;
        if (avgFrameTime > budget.maxFrameTime) {
          console.warn(`Average frame time: ${avgFrameTime.toFixed(2)}ms (target: ${budget.maxFrameTime}ms)`);
        }
      }
    });
  };
}

/**
 * Debounced performance logger to avoid console spam
 */
export const logPerformanceIssue = (() => {
  let lastLogTime = 0;
  const LOG_THROTTLE = 1000; // 1 second
  
  return (message: string, data?: any) => {
    const now = performance.now();
    if (now - lastLogTime > LOG_THROTTLE) {
      console.warn('Performance Issue:', message, data);
      lastLogTime = now;
    }
  };
})();