import { useState, useEffect, useId } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { animationPool } from '../utils/animation-pool';

export const useBreathing = (enabled = true) => {
  const [isVisible, setIsVisible] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  const animationId = useId();
  
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);
  
  const shouldAnimate = enabled && isVisible && !prefersReducedMotion && !animationPool.paused;
  
  useEffect(() => {
    if (shouldAnimate) {
      animationPool.register(animationId);
    } else {
      animationPool.unregister(animationId);
    }
    
    return () => {
      animationPool.unregister(animationId);
    };
  }, [shouldAnimate, animationId]);
  
  return shouldAnimate;
};

export const useBreathingWithPerformance = (enabled = true) => {
  const shouldAnimate = useBreathing(enabled);
  const [cpuUsage, setCpuUsage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  useEffect(() => {
    if (!shouldAnimate) return;
    
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId: number;
    
    const measurePerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      
      if (frameCount % 60 === 0) {
        const fps = 1000 / (deltaTime / 60);
        const estimatedCpuUsage = Math.max(0, Math.min(100, (60 - fps) * 2));
        setCpuUsage(estimatedCpuUsage);
        
        if (estimatedCpuUsage > 5) {
          setIsPaused(true);
        } else if (estimatedCpuUsage < 3) {
          setIsPaused(false);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      rafId = requestAnimationFrame(measurePerformance);
    };
    
    rafId = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [shouldAnimate]);
  
  return {
    shouldAnimate: shouldAnimate && !isPaused,
    cpuUsage,
    isPaused,
  };
};