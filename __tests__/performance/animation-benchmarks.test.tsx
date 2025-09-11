import { renderHook, act } from '@testing-library/react';
import { benchmark, PERFORMANCE_BUDGETS, AnimationProfiler } from '@/lib/performance-utils';

// Import animation hooks to benchmark
import { useAnimation } from '@/hooks/use-animation';
import { useGradientFollow } from '@/hooks/use-gradient-follow';
import { useMagneticHover } from '@/hooks/use-magnetic-hover';
import { useRipple } from '@/hooks/use-ripple';
import { useParallax } from '@/hooks/use-parallax';
import { useStaggerReveal } from '@/hooks/use-stagger-reveal';
import { useTextReveal } from '@/hooks/use-text-reveal';

// Mock DOM APIs
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  value: jest.fn(() => ({
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
    width: 100,
    height: 100,
    x: 0,
    y: 0
  }))
});

Object.defineProperty(window, 'getComputedStyle', {
  value: jest.fn(() => ({
    getPropertyValue: jest.fn(() => ''),
    transform: 'none'
  }))
});

// Mock RAF for consistent timing
let rafCallbacks: Array<(time: number) => void> = [];
let rafId = 0;

const mockRAF = jest.fn((callback: (time: number) => void) => {
  rafCallbacks.push(callback);
  return ++rafId;
});

const mockCancelRAF = jest.fn((id: number) => {
  // Remove callback by id (simplified)
});

const flushRAF = () => {
  const callbacks = [...rafCallbacks];
  rafCallbacks = [];
  callbacks.forEach(callback => callback(performance.now()));
};

beforeAll(() => {
  global.requestAnimationFrame = mockRAF;
  global.cancelAnimationFrame = mockCancelRAF;
});

beforeEach(() => {
  jest.clearAllMocks();
  rafCallbacks = [];
  rafId = 0;
});

describe('Animation Hook Performance Benchmarks', () => {
  
  describe('useAnimation Hook', () => {
    it('should initialize within performance budget', async () => {
      const initializationTime = await benchmark(
        () => {
          renderHook(() => useAnimation({
            duration: 300,
            easing: 'ease-out'
          }));
        },
        10,
        'useAnimation initialization'
      );
      
      expect(initializationTime.averageTime).toBeLessThan(5); // Should init in under 5ms
      expect(initializationTime.maxTime).toBeLessThan(20); // Max spike under 20ms
    });

    it('should handle rapid state changes efficiently', async () => {
      const { result } = renderHook(() => useAnimation({
        duration: 100
      }));

      const stateChangeTime = await benchmark(
        async () => {
          act(() => {
            result.current.play();
          });
          act(() => {
            result.current.pause();
          });
          act(() => {
            result.current.stop();
          });
        },
        50,
        'useAnimation state changes'
      );

      expect(stateChangeTime.averageTime).toBeLessThan(2); // State changes should be very fast
    });
  });

  describe('useGradientFollow Hook', () => {
    it('should initialize without performance overhead', async () => {
      const initTime = await benchmark(
        () => {
          renderHook(() => useGradientFollow({
            size: 200,
            opacity: 0.3,
            disabled: false
          }));
        },
        10,
        'useGradientFollow initialization'
      );

      expect(initTime.averageTime).toBeLessThan(8); // More complex initialization
      expect(initTime.maxTime).toBeLessThan(25);
    });

    it('should handle mouse events efficiently', async () => {
      const { result } = renderHook(() => useGradientFollow({
        size: 200,
        updateInterval: 16 // 60fps
      }));

      // Create a mock element
      const mockElement = document.createElement('div');
      if (result.current.ref.current) {
        result.current.ref.current = mockElement;
      }

      const mouseEventTime = await benchmark(
        () => {
          act(() => {
            result.current.setCursorPosition({ x: 50, y: 50 });
          });
        },
        100,
        'useGradientFollow mouse updates'
      );

      expect(mouseEventTime.averageTime).toBeLessThan(1); // Mouse updates should be very fast
    });
  });

  describe('useMagneticHover Hook', () => {
    it('should initialize within budget', async () => {
      const initTime = await benchmark(
        () => {
          renderHook(() => useMagneticHover({
            strength: 0.5,
            radius: 100
          }));
        },
        10,
        'useMagneticHover initialization'
      );

      expect(initTime.averageTime).toBeLessThan(6);
    });

    it('should handle hover calculations efficiently', async () => {
      const { result } = renderHook(() => useMagneticHover({
        strength: 0.5,
        radius: 100
      }));

      const mockElement = document.createElement('div');
      if (result.current.ref.current) {
        result.current.ref.current = mockElement;
      }

      const hoverTime = await benchmark(
        () => {
          act(() => {
            result.current.setMousePosition({ x: 60, y: 60 });
          });
        },
        50,
        'useMagneticHover calculations'
      );

      expect(hoverTime.averageTime).toBeLessThan(2);
    });
  });

  describe('useRipple Hook', () => {
    it('should create ripples efficiently', async () => {
      const { result } = renderHook(() => useRipple({
        duration: 300,
        color: 'rgba(255,255,255,0.3)'
      }));

      const rippleTime = await benchmark(
        () => {
          act(() => {
            result.current.createRipple({
              clientX: 50,
              clientY: 50,
              currentTarget: document.createElement('div')
            } as any);
          });
        },
        20,
        'useRipple creation'
      );

      expect(rippleTime.averageTime).toBeLessThan(5); // Ripple creation
    });

    it('should handle multiple rapid ripples', async () => {
      const { result } = renderHook(() => useRipple());

      const multiRippleTime = await benchmark(
        () => {
          // Create 5 rapid ripples
          for (let i = 0; i < 5; i++) {
            act(() => {
              result.current.createRipple({
                clientX: i * 10,
                clientY: i * 10,
                currentTarget: document.createElement('div')
              } as any);
            });
          }
        },
        10,
        'useRipple multiple rapid'
      );

      expect(multiRippleTime.averageTime).toBeLessThan(15); // Multiple ripples
    });
  });

  describe('useParallax Hook', () => {
    it('should initialize parallax efficiently', async () => {
      // Mock IntersectionObserver
      global.IntersectionObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn()
      }));

      const initTime = await benchmark(
        () => {
          renderHook(() => useParallax({
            speed: 0.5,
            direction: 'vertical'
          }));
        },
        10,
        'useParallax initialization'
      );

      expect(initTime.averageTime).toBeLessThan(10); // Parallax setup
    });

    it('should handle scroll updates efficiently', async () => {
      const { result } = renderHook(() => useParallax({
        speed: 0.5
      }));

      const scrollTime = await benchmark(
        () => {
          act(() => {
            // Simulate scroll event
            window.dispatchEvent(new Event('scroll'));
          });
        },
        50,
        'useParallax scroll updates'
      );

      expect(scrollTime.averageTime).toBeLessThan(3); // Scroll handling
    });
  });

  describe('useStaggerReveal Hook', () => {
    it('should handle stagger calculations efficiently', async () => {
      const { result } = renderHook(() => useStaggerReveal({
        itemCount: 10,
        staggerDelay: 50
      }));

      const staggerTime = await benchmark(
        () => {
          act(() => {
            result.current.reveal();
          });
        },
        20,
        'useStaggerReveal calculations'
      );

      expect(staggerTime.averageTime).toBeLessThan(8); // Stagger setup
    });

    it('should scale well with item count', async () => {
      const smallCount = await benchmark(
        () => {
          renderHook(() => useStaggerReveal({
            itemCount: 5,
            staggerDelay: 50
          }));
        },
        10,
        'useStaggerReveal small count'
      );

      const largeCount = await benchmark(
        () => {
          renderHook(() => useStaggerReveal({
            itemCount: 50,
            staggerDelay: 50
          }));
        },
        10,
        'useStaggerReveal large count'
      );

      // Large count shouldn't be more than 3x slower than small count
      expect(largeCount.averageTime).toBeLessThan(smallCount.averageTime * 3);
    });
  });

  describe('useTextReveal Hook', () => {
    it('should handle text processing efficiently', async () => {
      const initTime = await benchmark(
        () => {
          renderHook(() => useTextReveal({
            text: 'This is a test text for performance measurement',
            duration: 1000,
            staggerDelay: 50
          }));
        },
        10,
        'useTextReveal text processing'
      );

      expect(initTime.averageTime).toBeLessThan(15); // Text processing
    });

    it('should scale with text length', async () => {
      const shortText = "Short";
      const longText = "This is a much longer text that should take more time to process but should still be within reasonable performance bounds for text reveal animations";

      const shortTime = await benchmark(
        () => {
          renderHook(() => useTextReveal({
            text: shortText,
            duration: 1000
          }));
        },
        10,
        'useTextReveal short text'
      );

      const longTime = await benchmark(
        () => {
          renderHook(() => useTextReveal({
            text: longText,
            duration: 1000
          }));
        },
        10,
        'useTextReveal long text'
      );

      // Long text processing shouldn't be more than 5x slower
      expect(longTime.averageTime).toBeLessThan(shortTime.averageTime * 5);
      expect(longTime.averageTime).toBeLessThan(25); // Absolute limit
    });
  });

  describe('Animation Hook Memory Usage', () => {
    it('should not leak memory on repeated mount/unmount', async () => {
      // This test checks for memory leaks by repeatedly mounting/unmounting hooks
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;

      const memoryTest = await benchmark(
        () => {
          // Mount and unmount multiple hooks
          const { unmount: unmount1 } = renderHook(() => useAnimation());
          const { unmount: unmount2 } = renderHook(() => useGradientFollow());
          const { unmount: unmount3 } = renderHook(() => useMagneticHover());
          const { unmount: unmount4 } = renderHook(() => useRipple());
          
          unmount1();
          unmount2();
          unmount3();
          unmount4();
          
          // Force garbage collection if available
          if (global.gc) {
            global.gc();
          }
        },
        20,
        'Memory leak test'
      );

      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const memoryIncrease = (finalMemory - initialMemory) / (1024 * 1024); // MB

      // Memory increase should be minimal (less than 5MB after 20 iterations)
      expect(memoryIncrease).toBeLessThan(5);
    });
  });

  describe('Comprehensive Performance Profile', () => {
    it('should generate performance profiles for all hooks', async () => {
      const profiler = new AnimationProfiler();
      
      const hooks = [
        { name: 'useAnimation', hook: () => useAnimation() },
        { name: 'useGradientFollow', hook: () => useGradientFollow() },
        { name: 'useMagneticHover', hook: () => useMagneticHover() },
        { name: 'useRipple', hook: () => useRipple() },
        { name: 'useParallax', hook: () => useParallax() },
        { name: 'useStaggerReveal', hook: () => useStaggerReveal() },
        { name: 'useTextReveal', hook: () => useTextReveal({ text: 'Test' }) }
      ];

      const profileResults = [];

      for (const { name, hook } of hooks) {
        profiler.start(name);
        
        // Benchmark the hook
        const result = await benchmark(
          () => {
            profiler.recordFrame();
            const { unmount } = renderHook(hook);
            unmount();
          },
          5,
          `${name} profile`
        );
        
        const metrics = profiler.stop();
        profileResults.push({ name, benchmark: result, metrics });
      }

      // All hooks should initialize within reasonable time
      profileResults.forEach(({ name, benchmark }) => {
        expect(benchmark.averageTime).toBeLessThan(25); // 25ms initialization limit
        expect(benchmark.maxTime).toBeLessThan(100); // 100ms max spike limit
      });

      // Generate a summary report
      const summary = {
        totalHooks: profileResults.length,
        averageInitTime: profileResults.reduce((sum, r) => sum + r.benchmark.averageTime, 0) / profileResults.length,
        slowestHook: profileResults.reduce((slow, current) => 
          current.benchmark.averageTime > slow.benchmark.averageTime ? current : slow
        ),
        fastestHook: profileResults.reduce((fast, current) => 
          current.benchmark.averageTime < fast.benchmark.averageTime ? current : fast
        )
      };

      console.log('Animation Hook Performance Summary:', summary);

      // Verify performance expectations
      expect(summary.averageInitTime).toBeLessThan(15); // Average under 15ms
      expect(summary.slowestHook.benchmark.averageTime).toBeLessThan(25); // Slowest under 25ms
    });
  });
});