"use client";

import { useEffect, useRef, useCallback } from "react";
import { PERFORMANCE_THRESHOLDS } from "../constants";

interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  droppedFrames: number;
}

interface UsePerformanceMonitorOptions {
  onLowPerformance?: (metrics: PerformanceMetrics) => void;
  enabled?: boolean;
  sampleRate?: number;
}

export function usePerformanceMonitor({
  onLowPerformance,
  enabled = true,
  sampleRate = 100,
}: UsePerformanceMonitorOptions = {}) {
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const fpsHistoryRef = useRef<number[]>([]);
  const rafIdRef = useRef<number | undefined>(undefined);
  const metricsRef = useRef<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    droppedFrames: 0,
  });

  const calculateFPS = useCallback(() => {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTimeRef.current;
    
    frameCountRef.current++;

    if (deltaTime >= sampleRate) {
      const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
      const frameTime = deltaTime / frameCountRef.current;
      
      fpsHistoryRef.current.push(fps);
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift();
      }

      const avgFps = Math.round(
        fpsHistoryRef.current.reduce((a, b) => a + b, 0) / fpsHistoryRef.current.length
      );

      const droppedFrames = fps < PERFORMANCE_THRESHOLDS.fps.target 
        ? Math.round((PERFORMANCE_THRESHOLDS.fps.target - fps) * (deltaTime / 1000))
        : 0;

      metricsRef.current = {
        fps: avgFps,
        frameTime: Math.round(frameTime * 100) / 100,
        droppedFrames,
      };

      if (avgFps < PERFORMANCE_THRESHOLDS.fps.warning && onLowPerformance) {
        onLowPerformance(metricsRef.current);
      }

      if (avgFps < PERFORMANCE_THRESHOLDS.fps.critical) {
        console.warn(
          `[Animation Performance] Critical FPS drop detected: ${avgFps}fps`,
          metricsRef.current
        );
      }

      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }

    if (enabled) {
      rafIdRef.current = requestAnimationFrame(calculateFPS);
    }
  }, [enabled, sampleRate, onLowPerformance]);

  useEffect(() => {
    if (!enabled) return;

    rafIdRef.current = requestAnimationFrame(calculateFPS);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [enabled, calculateFPS]);

  const getMetrics = useCallback(() => metricsRef.current, []);

  const reset = useCallback(() => {
    frameCountRef.current = 0;
    lastTimeRef.current = performance.now();
    fpsHistoryRef.current = [];
    metricsRef.current = {
      fps: 60,
      frameTime: 16.67,
      droppedFrames: 0,
    };
  }, []);

  return {
    metrics: metricsRef.current,
    getMetrics,
    reset,
  };
}