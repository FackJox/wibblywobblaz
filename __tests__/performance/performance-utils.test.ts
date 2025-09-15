import { 
  AnimationProfiler, 
  PERFORMANCE_BUDGETS,
  detectLowEndDevice,
  getMemoryUsage,
  calculateJankScore,
  calculateFrameVariance,
  benchmark,
  createPerformantRAF,
  logPerformanceIssue
} from '@/lib/performance-utils';

// Mock performance API
const mockPerformance = {
  now: jest.fn(),
  memory: {
    usedJSHeapSize: 50 * 1024 * 1024 // 50MB
  }
};

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
const mockRAF = jest.fn();
const mockCancelRAF = jest.fn();

beforeAll(() => {
  global.performance = mockPerformance as any;
  global.window = { 
    ...global.window, 
    matchMedia: mockMatchMedia,
    devicePixelRatio: 2,
    requestAnimationFrame: mockRAF,
    cancelAnimationFrame: mockCancelRAF
  } as any;
  
  // Mock navigator properties properly
  Object.defineProperty(global.navigator, 'hardwareConcurrency', {
    writable: true,
    configurable: true,
    value: 4
  });
  
  Object.defineProperty(global.navigator, 'deviceMemory', {
    writable: true,
    configurable: true,
    value: 4
  });
  
  Object.defineProperty(global.navigator, 'connection', {
    writable: true,
    configurable: true,
    value: { effectiveType: '4g' }
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  mockPerformance.now.mockReturnValue(0);
  mockMatchMedia.mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn()
  });
});

describe('Performance Utils', () => {
  describe('detectLowEndDevice', () => {
    it('should detect high-end device', () => {
      const isLowEnd = detectLowEndDevice();
      expect(isLowEnd).toBe(false);
    });

    it('should detect low-end device with low CPU cores', () => {
      Object.defineProperty(global.navigator, 'hardwareConcurrency', { value: 2 });
      Object.defineProperty(global.navigator, 'deviceMemory', { value: 2 });
      
      const isLowEnd = detectLowEndDevice();
      expect(isLowEnd).toBe(true);
    });

    it('should detect low-end device with reduced motion preference', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });
      
      Object.defineProperty(global.navigator, 'hardwareConcurrency', { value: 2 });
      
      const isLowEnd = detectLowEndDevice();
      expect(isLowEnd).toBe(true);
    });
  });

  describe('getMemoryUsage', () => {
    it('should return memory usage in MB', () => {
      const memoryUsage = getMemoryUsage();
      expect(memoryUsage).toBe(50); // 50MB as mocked
    });

    it('should return 0 if memory API not available', () => {
      delete (global.performance as any).memory;
      
      const memoryUsage = getMemoryUsage();
      expect(memoryUsage).toBe(0);
    });
  });

  describe('calculateJankScore', () => {
    it('should calculate jank score correctly', () => {
      const frameTimes = [10, 15, 16, 14]; // All under 16.67ms - no jank
      const jankScore = calculateJankScore(frameTimes);
      expect(jankScore).toBe(0);
    });

    it('should detect janky frames', () => {
      const frameTimes = [10, 15, 30, 14]; // One frame over 16.67ms (30ms)
      const jankScore = calculateJankScore(frameTimes);
      expect(jankScore).toBe(25); // 25% jank
    });

    it('should handle empty array', () => {
      const jankScore = calculateJankScore([]);
      expect(jankScore).toBe(0);
    });
  });

  describe('calculateFrameVariance', () => {
    it('should calculate variance correctly', () => {
      const frameTimes = [16, 16, 16, 16]; // No variance
      const variance = calculateFrameVariance(frameTimes);
      expect(variance).toBe(0);
    });

    it('should detect high variance', () => {
      const frameTimes = [10, 20, 30, 40];
      const variance = calculateFrameVariance(frameTimes);
      expect(variance).toBeGreaterThan(0);
    });

    it('should handle small arrays', () => {
      const variance = calculateFrameVariance([16]);
      expect(variance).toBe(0);
    });
  });

  describe('benchmark', () => {
    it('should benchmark synchronous functions', async () => {
      const mockFn = jest.fn();
      const result = await benchmark(mockFn, 5, 'Test Function');
      
      expect(result.name).toBe('Test Function');
      expect(result.iterations).toBe(5);
      expect(mockFn).toHaveBeenCalledTimes(5);
      expect(result.averageTime).toBeGreaterThanOrEqual(0);
      expect(result.minTime).toBeGreaterThanOrEqual(0);
      expect(result.maxTime).toBeGreaterThanOrEqual(0);
      expect(result.totalTime).toBeGreaterThanOrEqual(0);
    });

    it('should benchmark asynchronous functions', async () => {
      const mockAsyncFn = jest.fn().mockResolvedValue(undefined);
      const result = await benchmark(mockAsyncFn, 3, 'Async Test');
      
      expect(result.name).toBe('Async Test');
      expect(result.iterations).toBe(3);
      expect(mockAsyncFn).toHaveBeenCalledTimes(3);
    });
  });

  describe('createPerformantRAF', () => {
    let performantRAF: ReturnType<typeof createPerformantRAF>;
    let mockCallback: jest.Mock;

    beforeEach(() => {
      performantRAF = createPerformantRAF(PERFORMANCE_BUDGETS.micro);
      mockCallback = jest.fn();
      console.warn = jest.fn(); // Mock console.warn
    });

    it('should create performant RAF wrapper', () => {
      expect(typeof performantRAF).toBe('function');
    });

    it('should call requestAnimationFrame', () => {
      performantRAF(mockCallback);
      expect(window.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should warn on frame budget exceeded', () => {
      // Mock a slow frame
      mockPerformance.now
        .mockReturnValueOnce(0) // Frame start
        .mockReturnValueOnce(20); // Frame end (20ms > 16.67ms budget)

      performantRAF(mockCallback);
      
      // Get the callback that was passed to RAF
      const rafCallback = mockRAF.mock.calls[0][0];
      rafCallback(0); // Simulate RAF callback
      
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('Frame budget exceeded')
      );
    });
  });

  describe('logPerformanceIssue', () => {
    let consoleWarnSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    });

    afterEach(() => {
      consoleWarnSpy.mockRestore();
    });

    it('should log performance issues', () => {
      logPerformanceIssue('Test issue', { fps: 20 });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Performance Issue:', 
        'Test issue', 
        { fps: 20 }
      );
    });

    it('should throttle frequent messages', () => {
      // First call should log
      logPerformanceIssue('Frequent issue');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);

      // Second call immediately should not log (throttled)
      logPerformanceIssue('Frequent issue');
      expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('AnimationProfiler', () => {
    let profiler: AnimationProfiler;

    beforeEach(() => {
      profiler = new AnimationProfiler(100, 50);
    });

    it('should initialize correctly', () => {
      expect(profiler).toBeInstanceOf(AnimationProfiler);
    });

    it('should start profiling', () => {
      mockPerformance.now.mockReturnValue(1000);
      profiler.start('test');
      
      const metrics = profiler.getMetrics();
      expect(metrics.totalFrames).toBe(0);
      expect(metrics.fps).toBe(0);
    });

    it('should record frames and calculate metrics', () => {
      let currentTime = 1000;
      mockPerformance.now.mockImplementation(() => currentTime);
      
      profiler.start('test');
      
      // Simulate 10 frames over 100ms (should be ~100 FPS)
      for (let i = 0; i < 10; i++) {
        currentTime += 10; // 10ms per frame
        profiler.recordFrame();
      }
      
      const metrics = profiler.getMetrics();
      expect(metrics.totalFrames).toBe(10);
      expect(metrics.fps).toBeGreaterThan(0);
      expect(metrics.averageFrameTime).toBeGreaterThan(0);
    });

    it('should detect performance issues', () => {
      let currentTime = 1000;
      mockPerformance.now.mockImplementation(() => currentTime);
      
      profiler.start('test');
      
      // Simulate slow frames
      for (let i = 0; i < 5; i++) {
        currentTime += 50; // 50ms per frame (very slow)
        profiler.recordFrame();
      }
      
      const metrics = profiler.getMetrics();
      expect(metrics.jankScore).toBeGreaterThan(0);
      expect(metrics.isPoor).toBe(true);
    });

    it('should generate performance reports', () => {
      profiler.start('micro');
      profiler.recordFrame();
      
      const report = profiler.generateReport('micro');
      expect(report.animationType).toBe('micro');
      expect(report.metrics).toBeDefined();
      expect(report.budget).toEqual(PERFORMANCE_BUDGETS.micro);
      expect(typeof report.passed).toBe('boolean');
      expect(Array.isArray(report.recommendations)).toBe(true);
    });

    it('should stop profiling', () => {
      profiler.start('test');
      const finalMetrics = profiler.stop();
      
      expect(finalMetrics).toBeDefined();
      expect(finalMetrics.totalFrames).toBeGreaterThanOrEqual(0);
    });
  });

  describe('PERFORMANCE_BUDGETS', () => {
    it('should have defined budgets for all animation types', () => {
      const expectedTypes = ['micro', 'scroll', 'hover', 'transition', 'complex'];
      
      expectedTypes.forEach(type => {
        expect(PERFORMANCE_BUDGETS[type]).toBeDefined();
        expect(PERFORMANCE_BUDGETS[type].maxFrameTime).toBeGreaterThan(0);
        expect(PERFORMANCE_BUDGETS[type].targetFps).toBeGreaterThan(0);
        expect(PERFORMANCE_BUDGETS[type].maxJankPercentage).toBeGreaterThanOrEqual(0);
        expect(PERFORMANCE_BUDGETS[type].maxMemoryIncrease).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have reasonable budget values', () => {
      const microBudget = PERFORMANCE_BUDGETS.micro;
      expect(microBudget.targetFps).toBe(60);
      expect(microBudget.maxFrameTime).toBe(16.67);
      expect(microBudget.maxJankPercentage).toBeLessThan(10);
    });
  });
});