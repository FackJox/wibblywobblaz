/**
 * PandaCSS Performance Patterns Test
 * 
 * This file tests performance optimization patterns for animations in PandaCSS,
 * focusing on hardware acceleration, efficient rendering, and memory management.
 */

import { css, cx } from "@/styled-system/css";
import { useState, useEffect, useRef, useCallback } from "react";

// Pattern 1: Hardware acceleration optimization
export function TestHardwareAcceleration() {
  const [isAnimating, setIsAnimating] = useState(false);

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Hardware Acceleration Test
      </h3>
      
      <button
        onClick={() => setIsAnimating(!isAnimating)}
        className={css({
          marginBottom: "6",
          padding: "2 4",
          backgroundColor: "primary",
          color: "primary.foreground",
          borderRadius: "md",
          border: "none",
          cursor: "pointer"
        })}
      >
        {isAnimating ? "Stop" : "Start"} Animation
      </button>

      <div className={css({ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6" })}>
        {/* Non-optimized animation */}
        <div>
          <h4 className={css({ fontSize: "md", fontWeight: "medium", marginBottom: "3" })}>
            Non-Optimized (CPU)
          </h4>
          <div
            className={css({
              width: "16",
              height: "16",
              backgroundColor: "destructive",
              borderRadius: "md",
              // CPU-intensive properties
              marginLeft: isAnimating ? "200px" : "0",
              marginTop: isAnimating ? "50px" : "0",
              transition: "margin 2s ease-in-out",
              // Forces layout recalculation
              width: isAnimating ? "20" : "16",
              height: isAnimating ? "20" : "16"
            })}
          />
          <p className={css({ fontSize: "xs", color: "muted.foreground", marginTop: "2" })}>
            Uses margin and size changes (causes layout)
          </p>
        </div>

        {/* Hardware-accelerated animation */}
        <div>
          <h4 className={css({ fontSize: "md", fontWeight: "medium", marginBottom: "3" })}>
            Hardware-Accelerated (GPU)
          </h4>
          <div
            className={css({
              width: "16",
              height: "16",
              backgroundColor: "primary",
              borderRadius: "md",
              // GPU-accelerated properties
              transform: isAnimating ? "translate3d(200px, 50px, 0) scale(1.25)" : "translate3d(0, 0, 0) scale(1)",
              transition: "transform 2s ease-in-out",
              // Force hardware acceleration
              willChange: isAnimating ? "transform" : "auto",
              backfaceVisibility: "hidden",
              perspective: "1000px"
            })}
          />
          <p className={css({ fontSize: "xs", color: "muted.foreground", marginTop: "2" })}>
            Uses transform3d and scale (composite layer)
          </p>
        </div>
      </div>
    </div>
  );
}

// Pattern 2: Efficient batch animations with requestAnimationFrame
export function TestBatchedAnimations() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([]);
  const animationFrameRef = useRef<number>();
  const isRunningRef = useRef(false);

  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 300,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4
    }));
    setParticles(newParticles);
  }, []);

  const animate = useCallback(() => {
    setParticles(prev => prev.map(particle => {
      let { x, y, vx, vy } = particle;
      
      x += vx;
      y += vy;
      
      // Bounce off walls
      if (x <= 0 || x >= 300) vx *= -1;
      if (y <= 0 || y >= 200) vy *= -1;
      
      return { ...particle, x: Math.max(0, Math.min(300, x)), y: Math.max(0, Math.min(200, y)), vx, vy };
    }));
    
    if (isRunningRef.current) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  }, []);

  const startAnimation = () => {
    if (!isRunningRef.current) {
      isRunningRef.current = true;
      animate();
    }
  };

  const stopAnimation = () => {
    isRunningRef.current = false;
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  useEffect(() => {
    createParticles();
    return () => stopAnimation();
  }, [createParticles]);

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Batched Animations Test
      </h3>
      
      <div className={css({ marginBottom: "4", display: "flex", gap: "2" })}>
        <button
          onClick={startAnimation}
          className={css({
            padding: "2 4",
            backgroundColor: "primary",
            color: "primary.foreground",
            borderRadius: "md",
            border: "none",
            cursor: "pointer"
          })}
        >
          Start
        </button>
        <button
          onClick={stopAnimation}
          className={css({
            padding: "2 4",
            backgroundColor: "secondary",
            color: "secondary.foreground",
            borderRadius: "md",
            border: "none",
            cursor: "pointer"
          })}
        >
          Stop
        </button>
        <button
          onClick={createParticles}
          className={css({
            padding: "2 4",
            backgroundColor: "accent",
            color: "accent.foreground",
            borderRadius: "md",
            border: "none",
            cursor: "pointer"
          })}
        >
          Reset
        </button>
      </div>

      <div
        className={css({
          width: "300px",
          height: "200px",
          border: "2px solid",
          borderColor: "border",
          borderRadius: "md",
          position: "relative",
          overflow: "hidden",
          backgroundColor: "muted"
        })}
      >
        {particles.map(particle => (
          <div
            key={particle.id}
            className={css({
              position: "absolute",
              width: "3",
              height: "3",
              backgroundColor: "primary",
              borderRadius: "full",
              // Use transform for efficient positioning
              transform: `translate3d(${particle.x}px, ${particle.y}px, 0)`,
              willChange: "transform"
            })}
          />
        ))}
      </div>
      
      <p className={css({ fontSize: "xs", color: "muted.foreground", marginTop: "2" })}>
        20 particles animated with requestAnimationFrame batching
      </p>
    </div>
  );
}

// Pattern 3: CSS containment for performance isolation
export function TestCssContainment() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        CSS Containment Test
      </h3>
      
      <button
        onClick={() => setActiveIndex((prev) => (prev + 1) % 6)}
        className={css({
          marginBottom: "4",
          padding: "2 4",
          backgroundColor: "primary",
          color: "primary.foreground",
          borderRadius: "md",
          border: "none",
          cursor: "pointer"
        })}
      >
        Next Animation ({activeIndex + 1}/6)
      </button>

      <div className={css({ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "4" })}>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={css({
              // CSS containment for performance isolation
              contain: "layout style paint",
              padding: "4",
              border: "1px solid",
              borderColor: "border",
              borderRadius: "md",
              backgroundColor: "card",
              position: "relative",
              overflow: "hidden"
            })}
          >
            <div
              className={css({
                width: "12",
                height: "12",
                backgroundColor: i === activeIndex ? "primary" : "muted",
                borderRadius: "md",
                margin: "0 auto",
                transform: i === activeIndex ? "scale(1.2) rotate(180deg)" : "scale(1) rotate(0deg)",
                transition: "all 500ms ease-out",
                // Contain changes within this element
                willChange: i === activeIndex ? "transform" : "auto"
              })}
            />
            <p className={css({ textAlign: "center", fontSize: "xs", marginTop: "2", color: "muted.foreground" })}>
              Container {i + 1}
            </p>
          </div>
        ))}
      </div>
      
      <p className={css({ fontSize: "xs", color: "muted.foreground", marginTop: "4" })}>
        Each container uses CSS containment to isolate layout/paint changes
      </p>
    </div>
  );
}

// Pattern 4: Memory-efficient animation cleanup
export function TestAnimationCleanup() {
  const [components, setComponents] = useState<number[]>([]);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const addComponent = () => {
    const id = Date.now();
    setComponents(prev => [...prev, id]);
    
    // Create timeouts and intervals that need cleanup
    const timeout = setTimeout(() => {
      console.log(`Component ${id} timeout executed`);
      timeoutsRef.current.delete(timeout);
    }, 5000);
    
    const interval = setInterval(() => {
      console.log(`Component ${id} interval tick`);
    }, 1000);
    
    timeoutsRef.current.add(timeout);
    intervalsRef.current.add(interval);
  };

  const removeComponent = (id: number) => {
    setComponents(prev => prev.filter(compId => compId !== id));
    
    // Cleanup associated timers
    timeoutsRef.current.forEach(timeout => {
      clearTimeout(timeout);
    });
    intervalsRef.current.forEach(interval => {
      clearInterval(interval);
    });
    timeoutsRef.current.clear();
    intervalsRef.current.clear();
  };

  const cleanupAll = () => {
    setComponents([]);
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    intervalsRef.current.forEach(interval => clearInterval(interval));
    timeoutsRef.current.clear();
    intervalsRef.current.clear();
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      intervalsRef.current.forEach(interval => clearInterval(interval));
    };
  }, []);

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Animation Cleanup Test
      </h3>
      
      <div className={css({ marginBottom: "4", display: "flex", gap: "2", flexWrap: "wrap" })}>
        <button
          onClick={addComponent}
          className={css({
            padding: "2 4",
            backgroundColor: "primary",
            color: "primary.foreground",
            borderRadius: "md",
            border: "none",
            cursor: "pointer"
          })}
        >
          Add Component
        </button>
        <button
          onClick={cleanupAll}
          className={css({
            padding: "2 4",
            backgroundColor: "destructive",
            color: "destructive.foreground",
            borderRadius: "md",
            border: "none",
            cursor: "pointer"
          })}
        >
          Cleanup All
        </button>
        <span className={css({ 
          padding: "2 4", 
          fontSize: "sm", 
          color: "muted.foreground",
          display: "flex",
          alignItems: "center"
        })}>
          Active: {components.length} | Timers: {timeoutsRef.current.size + intervalsRef.current.size}
        </span>
      </div>

      <div className={css({ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "2" })}>
        {components.map(id => (
          <AnimatedComponent
            key={id}
            id={id}
            onRemove={() => removeComponent(id)}
          />
        ))}
      </div>
      
      <p className={css({ fontSize: "xs", color: "muted.foreground", marginTop: "4" })}>
        Each component manages its own animation timers with proper cleanup
      </p>
    </div>
  );
}

// Helper component for cleanup test
function AnimatedComponent({ id, onRemove }: { id: number; onRemove: () => void }) {
  const [rotation, setRotation] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRotation(prev => (prev + 10) % 360);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div
      className={css({
        width: "16",
        height: "16",
        backgroundColor: "primary",
        borderRadius: "md",
        cursor: "pointer",
        transform: `rotate(${rotation}deg)`,
        transition: "transform 100ms linear",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "xs",
        color: "primary.foreground"
      })}
      onClick={onRemove}
      title={`Component ${id} - Click to remove`}
    >
      {String(id).slice(-2)}
    </div>
  );
}

// Pattern 5: Virtualized animation lists
export function TestVirtualizedAnimations() {
  const [itemCount, setItemCount] = useState(100);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const itemHeight = 60;
  const containerHeight = 300;
  const visibleCount = Math.ceil(containerHeight / itemHeight) + 2;
  const startIndex = Math.max(0, Math.floor(scrollY / itemHeight) - 1);
  const endIndex = Math.min(itemCount, startIndex + visibleCount);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  return (
    <div className={css({ padding: "6" })}>
      <h3 className={css({ fontSize: "lg", fontWeight: "semibold", marginBottom: "4" })}>
        Virtualized Animations Test
      </h3>
      
      <div className={css({ marginBottom: "4", display: "flex", gap: "2", alignItems: "center" })}>
        <label className={css({ fontSize: "sm" })}>
          Item count:
          <input
            type="range"
            min="50"
            max="1000"
            step="50"
            value={itemCount}
            onChange={(e) => setItemCount(Number(e.target.value))}
            className={css({ marginLeft: "2" })}
          />
          {itemCount}
        </label>
      </div>

      <div
        ref={containerRef}
        className={css({
          height: "300px",
          overflow: "auto",
          border: "1px solid",
          borderColor: "border",
          borderRadius: "md",
          backgroundColor: "muted"
        })}
        onScroll={handleScroll}
      >
        <div style={{ height: itemCount * itemHeight, position: "relative" }}>
          {Array.from({ length: endIndex - startIndex }, (_, i) => {
            const index = startIndex + i;
            const delay = (index % 10) * 50;
            
            return (
              <div
                key={index}
                className={css({
                  position: "absolute",
                  top: `${index * itemHeight}px`,
                  left: "0",
                  right: "0",
                  height: `${itemHeight}px`,
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4",
                  borderBottom: "1px solid",
                  borderColor: "border",
                  backgroundColor: "card",
                  // Staggered animation based on scroll position
                  animation: `slide-in-from-left 300ms ease-out ${delay}ms both`
                })}
              >
                <div
                  className={css({
                    width: "8",
                    height: "8",
                    backgroundColor: "primary",
                    borderRadius: "full",
                    marginRight: "3",
                    animation: "pulse 2s ease-in-out infinite",
                    animationDelay: `${delay}ms`
                  })}
                />
                <span className={css({ fontSize: "sm" })}>
                  Virtualized Item {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <p className={css({ fontSize: "xs", color: "muted.foreground", marginTop: "2" })}>
        Only renders visible items with staggered animations. Scroll to see virtualization.
      </p>
    </div>
  );
}