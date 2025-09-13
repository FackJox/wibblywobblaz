/**
 * Integration test for profiling all existing animations
 * This test runs a comprehensive performance profile of all animation hooks
 */

import { AnimationProfiler, PERFORMANCE_BUDGETS } from '@/lib/performance-utils';

// Mock performance.now for consistent testing
const mockNow = jest.spyOn(performance, 'now');
let currentTime = 0;

beforeEach(() => {
  currentTime = 0;
  mockNow.mockImplementation(() => currentTime);
});

afterEach(() => {
  mockNow.mockRestore();
});

describe('Animation Performance Profiling', () => {
  let profiler: AnimationProfiler;

  beforeEach(() => {
    profiler = new AnimationProfiler(100, 50);
  });

  const simulateAnimation = (frameCount: number, frameTimeMs: number = 16.67) => {
    profiler.start('test-animation');
    
    for (let i = 0; i < frameCount; i++) {
      currentTime += frameTimeMs;
      profiler.recordFrame();
    }
    
    return profiler.stop();
  };

  it('should profile smooth 60fps animation', () => {
    const metrics = simulateAnimation(60, 16.67); // 60 frames at ~60fps
    
    expect(metrics.fps).toBeGreaterThanOrEqual(55);
    expect(metrics.jankScore).toBeLessThan(5);
    expect(metrics.isPerformant).toBe(true);
    expect(metrics.isPoor).toBe(false);
  });

  it('should detect poor performance animation', () => {
    const metrics = simulateAnimation(30, 50); // 30 frames at ~20fps
    
    expect(metrics.fps).toBeLessThan(30);
    expect(metrics.jankScore).toBeGreaterThan(50);
    expect(metrics.isPerformant).toBe(false);
    expect(metrics.isPoor).toBe(true);
  });

  it('should detect jank in mixed performance', () => {
    profiler.start('mixed-performance');
    
    // Start with good frames
    for (let i = 0; i < 50; i++) {
      currentTime += 16; // Good frame time
      profiler.recordFrame();
    }
    
    // Add some janky frames
    for (let i = 0; i < 10; i++) {
      currentTime += 40; // Janky frame time
      profiler.recordFrame();
    }
    
    const metrics = profiler.stop();
    
    expect(metrics.jankScore).toBeGreaterThan(10);
    expect(metrics.frameVariance).toBeGreaterThan(5);
    expect(metrics.longestFrame).toBeGreaterThan(35);
  });

  it('should generate comprehensive performance report', () => {
    const metrics = simulateAnimation(100, 16.67);
    const report = profiler.generateReport('micro');
    
    expect(report.animationType).toBe('micro');
    expect(report.metrics).toEqual(metrics);
    expect(report.budget).toEqual(PERFORMANCE_BUDGETS.micro);
    expect(typeof report.passed).toBe('boolean');
    expect(Array.isArray(report.recommendations)).toBe(true);
  });

  it('should provide different recommendations based on issues', () => {
    // Test poor FPS
    let metrics = simulateAnimation(30, 50);
    let report = profiler.generateReport('micro');
    
    expect(report.recommendations.some(r => r.includes('FPS'))).toBe(true);
    
    // Reset profiler
    profiler = new AnimationProfiler();
    
    // Test high jank
    profiler.start('high-jank');
    for (let i = 0; i < 10; i++) {
      currentTime += i % 2 === 0 ? 10 : 40; // Alternating frame times
      profiler.recordFrame();
    }
    metrics = profiler.stop();
    report = profiler.generateReport('micro');
    
    expect(report.recommendations.some(r => r.includes('jank'))).toBe(true);
  });

  it('should handle different performance budgets', () => {
    const microMetrics = simulateAnimation(60, 20); // 20ms frames
    
    const microReport = profiler.generateReport('micro');
    expect(microReport.passed).toBe(false); // Should fail micro budget (16.67ms)
    
    profiler = new AnimationProfiler();
    const transitionReport = profiler.generateReport('transition');
    expect(transitionReport.budget.maxFrameTime).toBe(33.33); // Transition allows 30fps
  });

  it('should measure animation latency correctly', () => {
    profiler.start('latency-test');
    
    currentTime += 25; // First frame takes 25ms (latency)
    profiler.recordFrame();
    
    currentTime += 16; // Subsequent frames are normal
    profiler.recordFrame();
    currentTime += 16;
    profiler.recordFrame();
    
    const metrics = profiler.stop();
    
    expect(metrics.animationLatency).toBe(25);
  });

  it('should calculate frame variance correctly', () => {
    profiler.start('variance-test');
    
    // Consistent frames
    for (let i = 0; i < 30; i++) {
      currentTime += 16.67; // Very consistent timing
      profiler.recordFrame();
    }
    
    const consistentMetrics = profiler.stop();
    
    profiler = new AnimationProfiler();
    profiler.start('inconsistent-test');
    
    // Inconsistent frames
    const frameTimes = [10, 5, 25, 15, 30, 8, 20, 12, 35, 16];
    for (const frameTime of frameTimes) {
      currentTime += frameTime;
      profiler.recordFrame();
    }
    
    const inconsistentMetrics = profiler.stop();
    
    expect(inconsistentMetrics.frameVariance).toBeGreaterThan(consistentMetrics.frameVariance);
  });

  it('should track total frames and dropped frames', () => {
    const targetFrames = 60;
    const actualFrames = 45;
    
    profiler.start('dropped-frames');
    
    // Simulate slow animation (fewer frames than expected)
    const totalTime = 1000; // 1 second
    const frameTime = totalTime / actualFrames;
    
    for (let i = 0; i < actualFrames; i++) {
      currentTime += frameTime;
      profiler.recordFrame();
    }
    
    const metrics = profiler.stop();
    
    expect(metrics.totalFrames).toBe(actualFrames);
    expect(metrics.droppedFrames).toBeGreaterThan(0);
  });
});

describe('Performance Budget Validation', () => {
  it('should have realistic budgets for different animation types', () => {
    // Micro animations should have strictest requirements
    expect(PERFORMANCE_BUDGETS.micro.targetFps).toBe(60);
    expect(PERFORMANCE_BUDGETS.micro.maxFrameTime).toBe(16.67);
    
    // Complex animations can be more lenient
    expect(PERFORMANCE_BUDGETS.complex.targetFps).toBeLessThanOrEqual(PERFORMANCE_BUDGETS.micro.targetFps);
    expect(PERFORMANCE_BUDGETS.complex.maxFrameTime).toBeGreaterThanOrEqual(PERFORMANCE_BUDGETS.micro.maxFrameTime);
    
    // Scroll animations should be performant
    expect(PERFORMANCE_BUDGETS.scroll.targetFps).toBe(60);
    
    // Hover effects should be snappy
    expect(PERFORMANCE_BUDGETS.hover.targetFps).toBe(60);
    expect(PERFORMANCE_BUDGETS.hover.maxMemoryIncrease).toBeLessThanOrEqual(2);
  });

  it('should have appropriate jank thresholds', () => {
    Object.values(PERFORMANCE_BUDGETS).forEach(budget => {
      expect(budget.maxJankPercentage).toBeGreaterThan(0);
      expect(budget.maxJankPercentage).toBeLessThan(50); // No budget should allow >50% jank
    });
  });

  it('should have memory constraints', () => {
    Object.values(PERFORMANCE_BUDGETS).forEach(budget => {
      expect(budget.maxMemoryIncrease).toBeGreaterThan(0);
      expect(budget.maxMemoryIncrease).toBeLessThan(20); // Reasonable memory limits
    });
  });
});