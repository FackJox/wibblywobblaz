"use client"

import * as React from "react"
import { 
  AnimationProfiler, 
  ExtendedPerformanceMetrics, 
  PerformanceReport, 
  PERFORMANCE_BUDGETS, 
  detectLowEndDevice,
  logPerformanceIssue,
  type PerformanceBudget 
} from "@/lib/performance-utils"

/**
 * Configuration for enhanced performance monitoring
 */
export interface PerformanceMonitorConfig {
  /** Animation type for budget selection */
  animationType?: keyof typeof PERFORMANCE_BUDGETS;
  /** Custom performance budget */
  customBudget?: PerformanceBudget;
  /** Whether to automatically start monitoring */
  autoStart?: boolean;
  /** How often to update metrics (ms) */
  updateInterval?: number;
  /** Maximum number of samples to keep */
  maxSamples?: number;
  /** Whether to log performance issues to console */
  logIssues?: boolean;
  /** Callback for performance warnings */
  onPerformanceIssue?: (issue: PerformanceIssue) => void;
  /** Whether to enable memory monitoring */
  enableMemoryMonitoring?: boolean;
}

/**
 * Performance issue types
 */
export interface PerformanceIssue {
  type: 'low_fps' | 'high_jank' | 'memory_leak' | 'frame_spike' | 'budget_exceeded';
  severity: 'low' | 'medium' | 'high';
  message: string;
  data: Record<string, any>;
  timestamp: number;
}

/**
 * Enhanced performance monitoring controls
 */
export interface PerformanceMonitorControls {
  /** Start monitoring with optional animation type */
  start: (animationType?: string) => void;
  /** Stop monitoring */
  stop: () => void;
  /** Reset all metrics */
  reset: () => void;
  /** Generate performance report */
  generateReport: () => PerformanceReport | null;
  /** Check if monitoring is active */
  isMonitoring: boolean;
  /** Get current performance budget */
  budget: PerformanceBudget;
}

/**
 * Return type for usePerformanceMonitor hook
 */
export interface UsePerformanceMonitorReturn extends PerformanceMonitorControls {
  /** Current performance metrics */
  metrics: ExtendedPerformanceMetrics | null;
  /** Performance issues detected */
  issues: PerformanceIssue[];
  /** Whether device is considered low-end */
  isLowEndDevice: boolean;
  /** Performance score (0-100) */
  performanceScore: number;
  /** Record a frame manually */
  recordFrame: () => void;
}

/**
 * Enhanced performance monitoring hook with comprehensive metrics and issue detection
 * 
 * @param config Performance monitoring configuration
 * @returns Performance monitoring controls and metrics
 * 
 * @example
 * ```tsx
 * const monitor = usePerformanceMonitor({
 *   animationType: 'hover',
 *   autoStart: true,
 *   logIssues: true,
 *   onPerformanceIssue: (issue) => {
 *     console.warn('Performance issue:', issue);
 *     // Send to analytics, show user notification, etc.
 *   }
 * });
 * 
 * return (
 *   <div>
 *     <div>FPS: {monitor.metrics?.fps || 0}</div>
 *     <div>Score: {monitor.performanceScore}</div>
 *     {monitor.issues.length > 0 && (
 *       <div className="text-red-500">
 *         Performance issues detected!
 *       </div>
 *     )}
 *   </div>
 * );
 * ```
 */
export function usePerformanceMonitor(
  config: PerformanceMonitorConfig = {}
): UsePerformanceMonitorReturn {
  const {
    animationType = 'micro',
    customBudget,
    autoStart = false,
    updateInterval = 100,
    maxSamples = 1000,
    logIssues = true,
    onPerformanceIssue,
    enableMemoryMonitoring = true
  } = config;

  // State
  const [isMonitoring, setIsMonitoring] = React.useState(autoStart);
  const [metrics, setMetrics] = React.useState<ExtendedPerformanceMetrics | null>(null);
  const [issues, setIssues] = React.useState<PerformanceIssue[]>([]);
  const [isLowEndDevice] = React.useState(() => detectLowEndDevice());

  // Refs
  const profilerRef = React.useRef<AnimationProfiler | null>(null);
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const lastMemoryUsageRef = React.useRef<number>(0);
  const issueCountRef = React.useRef<Record<string, number>>({});
  const animationFrameRef = React.useRef<number | null>(null);

  // Get performance budget
  const budget = React.useMemo(() => {
    return customBudget || PERFORMANCE_BUDGETS[animationType] || PERFORMANCE_BUDGETS.micro;
  }, [customBudget, animationType]);

  /**
   * Detect and report performance issues
   */
  const detectIssues = React.useCallback((currentMetrics: ExtendedPerformanceMetrics) => {
    const newIssues: PerformanceIssue[] = [];
    const now = performance.now();

    // Low FPS detection
    if (currentMetrics.fps < budget.targetFps * 0.8) {
      newIssues.push({
        type: 'low_fps',
        severity: currentMetrics.fps < budget.targetFps * 0.5 ? 'high' : 'medium',
        message: `Low FPS detected: ${currentMetrics.fps} (target: ${budget.targetFps})`,
        data: { fps: currentMetrics.fps, target: budget.targetFps },
        timestamp: now
      });
    }

    // High jank detection
    if (currentMetrics.jankScore > budget.maxJankPercentage) {
      newIssues.push({
        type: 'high_jank',
        severity: currentMetrics.jankScore > budget.maxJankPercentage * 2 ? 'high' : 'medium',
        message: `High jank score: ${currentMetrics.jankScore.toFixed(1)}%`,
        data: { jankScore: currentMetrics.jankScore, threshold: budget.maxJankPercentage },
        timestamp: now
      });
    }

    // Frame spike detection
    if (currentMetrics.longestFrame > budget.maxFrameTime * 3) {
      newIssues.push({
        type: 'frame_spike',
        severity: 'high',
        message: `Frame spike detected: ${currentMetrics.longestFrame.toFixed(1)}ms`,
        data: { frameTime: currentMetrics.longestFrame, threshold: budget.maxFrameTime },
        timestamp: now
      });
    }

    // Memory leak detection (if enabled)
    if (enableMemoryMonitoring && currentMetrics.memoryUsage > 0) {
      const memoryIncrease = currentMetrics.memoryUsage - lastMemoryUsageRef.current;
      if (memoryIncrease > budget.maxMemoryIncrease) {
        newIssues.push({
          type: 'memory_leak',
          severity: 'medium',
          message: `Memory increase detected: +${memoryIncrease.toFixed(1)}MB`,
          data: { increase: memoryIncrease, threshold: budget.maxMemoryIncrease },
          timestamp: now
        });
      }
      lastMemoryUsageRef.current = currentMetrics.memoryUsage;
    }

    // Budget exceeded
    const budgetViolations = [
      currentMetrics.averageFrameTime > budget.maxFrameTime,
      currentMetrics.jankScore > budget.maxJankPercentage,
      currentMetrics.fps < budget.targetFps
    ].filter(Boolean).length;

    if (budgetViolations >= 2) {
      newIssues.push({
        type: 'budget_exceeded',
        severity: 'high',
        message: 'Performance budget exceeded',
        data: { violations: budgetViolations, budget },
        timestamp: now
      });
    }

    // Update issues state and trigger callbacks
    if (newIssues.length > 0) {
      setIssues(prev => [...prev, ...newIssues].slice(-50)); // Keep last 50 issues

      // Log issues if enabled
      if (logIssues) {
        newIssues.forEach(issue => {
          // Throttle similar issues
          const issueKey = `${issue.type}_${issue.severity}`;
          issueCountRef.current[issueKey] = (issueCountRef.current[issueKey] || 0) + 1;
          
          if (issueCountRef.current[issueKey] <= 3) {
            logPerformanceIssue(issue.message, issue.data);
          }
        });
      }

      // Trigger callback
      if (onPerformanceIssue) {
        newIssues.forEach(onPerformanceIssue);
      }
    }
  }, [budget, enableMemoryMonitoring, logIssues, onPerformanceIssue]);

  /**
   * Update metrics from profiler
   */
  const updateMetrics = React.useCallback(() => {
    if (profilerRef.current) {
      const currentMetrics = profilerRef.current.getMetrics();
      setMetrics(currentMetrics);
      detectIssues(currentMetrics);
    }
  }, [detectIssues]);

  /**
   * Animation frame callback for continuous monitoring
   */
  const frameCallback = React.useCallback(() => {
    if (profilerRef.current && isMonitoring) {
      profilerRef.current.recordFrame();
      animationFrameRef.current = requestAnimationFrame(frameCallback);
    }
  }, [isMonitoring]);

  /**
   * Start performance monitoring
   */
  const start = React.useCallback((targetAnimationType?: string) => {
    if (isMonitoring) return;

    const type = targetAnimationType || animationType;
    profilerRef.current = new AnimationProfiler(maxSamples, updateInterval);
    profilerRef.current.start();
    
    setIsMonitoring(true);
    setIssues([]);
    issueCountRef.current = {};

    // Start continuous frame recording
    animationFrameRef.current = requestAnimationFrame(frameCallback);

    // Start periodic metric updates
    intervalRef.current = setInterval(updateMetrics, updateInterval);
  }, [isMonitoring, animationType, maxSamples, updateInterval, frameCallback, updateMetrics]);

  /**
   * Stop performance monitoring
   */
  const stop = React.useCallback(() => {
    setIsMonitoring(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (profilerRef.current) {
      const finalMetrics = profilerRef.current.stop();
      setMetrics(finalMetrics);
    }
  }, []);

  /**
   * Reset all metrics and issues
   */
  const reset = React.useCallback(() => {
    setMetrics(null);
    setIssues([]);
    issueCountRef.current = {};
    
    if (profilerRef.current) {
      profilerRef.current.stop();
      profilerRef.current = null;
    }
  }, []);

  /**
   * Generate comprehensive performance report
   */
  const generateReport = React.useCallback((): PerformanceReport | null => {
    if (!profilerRef.current) return null;
    return profilerRef.current.generateReport(animationType);
  }, [animationType]);

  /**
   * Manually record a frame (useful for specific animation timing)
   */
  const recordFrame = React.useCallback(() => {
    if (profilerRef.current) {
      profilerRef.current.recordFrame();
    }
  }, []);

  /**
   * Calculate overall performance score (0-100)
   */
  const performanceScore = React.useMemo(() => {
    if (!metrics) return 100;

    const fpsScore = Math.min(100, (metrics.fps / budget.targetFps) * 100);
    const jankScore = Math.max(0, 100 - (metrics.jankScore * 2));
    const consistencyScore = Math.max(0, 100 - (metrics.frameVariance * 4));
    
    return Math.round((fpsScore + jankScore + consistencyScore) / 3);
  }, [metrics, budget.targetFps]);

  // Auto-start if configured
  React.useEffect(() => {
    if (autoStart && !isMonitoring) {
      start();
    }
  }, [autoStart, isMonitoring, start]);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    // Metrics and state
    metrics,
    issues,
    isLowEndDevice,
    performanceScore,
    budget,

    // Controls
    start,
    stop,
    reset,
    generateReport,
    recordFrame,
    isMonitoring
  };
}

/**
 * Hook for lightweight performance monitoring of specific animations
 * 
 * @param animationName Name of the animation being monitored
 * @param enabled Whether monitoring is enabled
 * @returns Simple performance state
 * 
 * @example
 * ```tsx
 * const { recordFrame, metrics, issues } = useAnimationProfiler('hover-effect', true);
 * 
 * const handleMouseEnter = () => {
 *   recordFrame(); // Record start of animation
 *   // ... animation logic
 * };
 * ```
 */
export function useAnimationProfiler(animationName: string, enabled: boolean = true) {
  const monitor = usePerformanceMonitor({
    animationType: 'micro',
    autoStart: false,
    logIssues: false
  });

  React.useEffect(() => {
    if (enabled) {
      monitor.start(animationName);
    } else {
      monitor.stop();
    }

    return () => monitor.stop();
  }, [enabled, animationName, monitor]);

  return {
    recordFrame: monitor.recordFrame,
    metrics: monitor.metrics,
    issues: monitor.issues,
    score: monitor.performanceScore
  };
}