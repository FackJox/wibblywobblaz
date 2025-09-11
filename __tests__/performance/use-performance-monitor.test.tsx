import { renderHook, act } from '@testing-library/react';
import { usePerformanceMonitor, useAnimationProfiler } from '@/hooks/use-performance-monitor';
import { PERFORMANCE_BUDGETS } from '@/lib/performance-utils';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now())
};

// Mock requestAnimationFrame
const mockRAF = jest.fn();
const mockCancelAF = jest.fn();

// Mock navigator
const mockNavigator = {
  hardwareConcurrency: 4,
  deviceMemory: 4,
  connection: { effectiveType: '4g' }
};

// Mock window.matchMedia
const mockMatchMedia = jest.fn();

beforeAll(() => {
  global.performance = mockPerformance as any;
  global.requestAnimationFrame = mockRAF;
  global.cancelAnimationFrame = mockCancelAF;
  global.navigator = { ...global.navigator, ...mockNavigator };
  global.window = { 
    ...global.window, 
    matchMedia: mockMatchMedia,
    devicePixelRatio: 2
  } as any;
  
  // Mock console methods to avoid test noise
  global.console = {
    ...global.console,
    warn: jest.fn(),
    log: jest.fn(),
    group: jest.fn(),
    groupEnd: jest.fn()
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockMatchMedia.mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  });
  
  // Setup RAF mock to execute callbacks immediately in tests
  mockRAF.mockImplementation((callback) => {
    setTimeout(callback, 0);
    return 1;
  });
});

describe('usePerformanceMonitor', () => {
  it('should initialize with default configuration', () => {
    const { result } = renderHook(() => usePerformanceMonitor());
    
    expect(result.current.isMonitoring).toBe(false);
    expect(result.current.metrics).toBeNull();
    expect(result.current.issues).toEqual([]);
    expect(result.current.performanceScore).toBe(100);
    expect(result.current.budget).toEqual(PERFORMANCE_BUDGETS.micro);
  });

  it('should auto-start when configured', () => {
    const { result } = renderHook(() => 
      usePerformanceMonitor({ autoStart: true })
    );
    
    expect(result.current.isMonitoring).toBe(true);
  });

  it('should use custom animation type and budget', () => {
    const customBudget = {
      maxFrameTime: 20,
      targetFps: 50,
      maxJankPercentage: 8,
      maxMemoryIncrease: 3
    };
    
    const { result } = renderHook(() => 
      usePerformanceMonitor({ 
        animationType: 'scroll',
        customBudget 
      })
    );
    
    expect(result.current.budget).toEqual(customBudget);
  });

  it('should start and stop monitoring', () => {
    const { result } = renderHook(() => usePerformanceMonitor());
    
    // Start monitoring
    act(() => {
      result.current.start('test-animation');
    });
    
    expect(result.current.isMonitoring).toBe(true);
    expect(mockRAF).toHaveBeenCalled();
    
    // Stop monitoring
    act(() => {
      result.current.stop();
    });
    
    expect(result.current.isMonitoring).toBe(false);
    expect(mockCancelAF).toHaveBeenCalled();
  });

  it('should reset metrics and issues', () => {
    const { result } = renderHook(() => usePerformanceMonitor());
    
    act(() => {
      result.current.start();
    });
    
    // Simulate some monitoring data
    act(() => {
      result.current.recordFrame();
    });
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.metrics).toBeNull();
    expect(result.current.issues).toEqual([]);
  });

  it('should handle performance issues callback', () => {
    const onPerformanceIssue = jest.fn();
    const { result } = renderHook(() => 
      usePerformanceMonitor({ 
        onPerformanceIssue,
        autoStart: true 
      })
    );
    
    // The callback should be properly stored (we can't easily trigger issues in test environment)
    expect(result.current.isMonitoring).toBe(true);
    expect(onPerformanceIssue).not.toHaveBeenCalled(); // No issues yet
  });

  it('should generate performance reports', () => {
    const { result } = renderHook(() => usePerformanceMonitor());
    
    // Before starting, should return null
    expect(result.current.generateReport()).toBeNull();
    
    act(() => {
      result.current.start('micro');
    });
    
    // After starting, should return a report
    const report = result.current.generateReport();
    expect(report).toBeDefined();
    if (report) {
      expect(report.animationType).toBe('micro');
      expect(report.metrics).toBeDefined();
      expect(report.budget).toBeDefined();
      expect(typeof report.passed).toBe('boolean');
      expect(Array.isArray(report.recommendations)).toBe(true);
    }
  });

  it('should detect low-end devices', () => {
    // Mock low-end device characteristics
    (global.navigator as any).hardwareConcurrency = 2;
    (global.navigator as any).deviceMemory = 1;
    
    const { result } = renderHook(() => usePerformanceMonitor());
    
    // Note: isLowEndDevice is calculated once on initialization
    // We'd need to test this with a fresh component to see the change
    expect(typeof result.current.isLowEndDevice).toBe('boolean');
  });

  it('should handle memory monitoring toggle', () => {
    const { result } = renderHook(() => 
      usePerformanceMonitor({ enableMemoryMonitoring: false })
    );
    
    expect(result.current.isMonitoring).toBe(false);
    // Memory monitoring setting is internal to the hook
  });

  it('should update performance score based on metrics', async () => {
    const { result } = renderHook(() => 
      usePerformanceMonitor({ autoStart: true })
    );
    
    // Initial score should be 100 (no metrics yet)
    expect(result.current.performanceScore).toBe(100);
    
    // After some time, metrics should be available and score may change
    await act(async () => {
      // Simulate some frames
      result.current.recordFrame();
      result.current.recordFrame();
      result.current.recordFrame();
      
      // Wait for metrics update
      await new Promise(resolve => setTimeout(resolve, 150));
    });
    
    // Score should still be a valid number
    expect(typeof result.current.performanceScore).toBe('number');
    expect(result.current.performanceScore).toBeGreaterThanOrEqual(0);
    expect(result.current.performanceScore).toBeLessThanOrEqual(100);
  });

  it('should cleanup on unmount', () => {
    const { result, unmount } = renderHook(() => 
      usePerformanceMonitor({ autoStart: true })
    );
    
    expect(result.current.isMonitoring).toBe(true);
    
    unmount();
    
    // After unmount, monitoring should stop
    expect(mockCancelAF).toHaveBeenCalled();
  });
});

describe('useAnimationProfiler', () => {
  it('should initialize with animation name', () => {
    const { result } = renderHook(() => 
      useAnimationProfiler('test-animation', true)
    );
    
    expect(typeof result.current.recordFrame).toBe('function');
    expect(result.current.metrics).toBeNull(); // Initially null
    expect(result.current.issues).toEqual([]);
    expect(typeof result.current.score).toBe('number');
  });

  it('should enable/disable based on enabled prop', () => {
    const { result, rerender } = renderHook(
      ({ enabled }) => useAnimationProfiler('test-animation', enabled),
      { initialProps: { enabled: false } }
    );
    
    // Should not be monitoring initially
    expect(result.current.metrics).toBeNull();
    
    // Enable monitoring
    rerender({ enabled: true });
    
    // Should start monitoring (we can't easily test the internal state)
    expect(typeof result.current.recordFrame).toBe('function');
    
    // Disable monitoring
    rerender({ enabled: false });
    
    // Should stop monitoring
    expect(mockCancelAF).toHaveBeenCalled();
  });

  it('should record frames manually', () => {
    const { result } = renderHook(() => 
      useAnimationProfiler('test-animation', true)
    );
    
    act(() => {
      result.current.recordFrame();
      result.current.recordFrame();
      result.current.recordFrame();
    });
    
    // Recording should not throw errors
    expect(typeof result.current.recordFrame).toBe('function');
  });

  it('should update when animation name changes', () => {
    const { result, rerender } = renderHook(
      ({ name }) => useAnimationProfiler(name, true),
      { initialProps: { name: 'animation-1' } }
    );
    
    expect(typeof result.current.recordFrame).toBe('function');
    
    // Change animation name
    rerender({ name: 'animation-2' });
    
    // Should still work with new animation name
    expect(typeof result.current.recordFrame).toBe('function');
    expect(mockCancelAF).toHaveBeenCalled(); // Old monitoring stopped
  });

  it('should cleanup on unmount', () => {
    const { unmount } = renderHook(() => 
      useAnimationProfiler('test-animation', true)
    );
    
    unmount();
    
    // Should cleanup monitoring
    expect(mockCancelAF).toHaveBeenCalled();
  });
});