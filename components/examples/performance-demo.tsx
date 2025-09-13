"use client"

import * as React from "react"
import { PerformanceOverlay, PerformanceIndicator } from "@/components/dev/performance-overlay"
import { usePerformanceMonitor, useAnimationProfiler } from "@/hooks/use-performance-monitor"
import { useGradientFollow } from "@/hooks/use-gradient-follow"
import { useMagneticHover } from "@/hooks/use-magnetic-hover"
import { useRipple } from "@/hooks/use-ripple"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

/**
 * Performance monitoring demonstration component
 * Shows how to integrate performance monitoring with animations
 */
export function PerformanceDemo() {
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [activeAnimation, setActiveAnimation] = React.useState<string | null>(null);

  // Main performance monitor for the entire demo
  const mainMonitor = usePerformanceMonitor({
    animationType: 'complex',
    autoStart: true,
    logIssues: true,
    onPerformanceIssue: (issue) => {
      console.warn('Performance issue in demo:', issue);
    }
  });

  // Animation profiler for specific interactions
  const { recordFrame } = useAnimationProfiler('demo-interaction', activeAnimation !== null);

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Performance Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Performance Monitoring Demo
            <PerformanceIndicator animationType="complex" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setShowOverlay(!showOverlay)}
              variant={showOverlay ? "default" : "outline"}
            >
              {showOverlay ? "Hide" : "Show"} Performance Overlay
            </Button>
            
            <Button
              onClick={() => mainMonitor.reset()}
              variant="outline"
            >
              Reset Metrics
            </Button>

            <Button
              onClick={() => {
                const report = mainMonitor.generateReport();
                if (report) {
                  console.log('Performance Report:', report);
                  alert(`Performance Score: ${mainMonitor.performanceScore}/100\nSee console for full report.`);
                }
              }}
              variant="outline"
            >
              Generate Report
            </Button>
          </div>

          {/* Performance Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {mainMonitor.metrics?.fps || 0}
              </div>
              <div className="text-sm text-gray-500">Current FPS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {mainMonitor.performanceScore}
              </div>
              <div className="text-sm text-gray-500">Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">
                {mainMonitor.metrics?.jankScore.toFixed(1) || 0}%
              </div>
              <div className="text-sm text-gray-500">Jank</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {mainMonitor.issues.length}
              </div>
              <div className="text-sm text-gray-500">Issues</div>
            </div>
          </div>

          {/* Recent Issues */}
          {mainMonitor.issues.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Recent Performance Issues:</h3>
              {mainMonitor.issues.slice(-3).map((issue, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant={issue.severity === 'high' ? 'destructive' : issue.severity === 'medium' ? 'default' : 'secondary'}>
                    {issue.severity}
                  </Badge>
                  <span className="text-sm">{issue.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Animated Components to Test Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Gradient Follow Demo */}
        <GradientFollowCard 
          onAnimationStart={() => {
            setActiveAnimation('gradient-follow');
            recordFrame();
          }}
          onAnimationEnd={() => setActiveAnimation(null)}
        />

        {/* Magnetic Hover Demo */}
        <MagneticHoverCard
          onAnimationStart={() => {
            setActiveAnimation('magnetic-hover');
            recordFrame();
          }}
          onAnimationEnd={() => setActiveAnimation(null)}
        />

        {/* Ripple Effect Demo */}
        <RippleCard
          onAnimationStart={() => {
            setActiveAnimation('ripple');
            recordFrame();
          }}
          onAnimationEnd={() => setActiveAnimation(null)}
        />

        {/* Heavy Animation Demo */}
        <HeavyAnimationCard
          onAnimationStart={() => {
            setActiveAnimation('heavy');
            recordFrame();
          }}
          onAnimationEnd={() => setActiveAnimation(null)}
        />

        {/* Optimized Animation Demo */}
        <OptimizedAnimationCard
          onAnimationStart={() => {
            setActiveAnimation('optimized');
            recordFrame();
          }}
          onAnimationEnd={() => setActiveAnimation(null)}
        />

        {/* Multiple Effects Demo */}
        <MultiEffectCard
          onAnimationStart={() => {
            setActiveAnimation('multi-effect');
            recordFrame();
          }}
          onAnimationEnd={() => setActiveAnimation(null)}
        />
      </div>

      {/* Performance Overlay */}
      <PerformanceOverlay
        visible={showOverlay}
        position="bottom-right"
        animationType="complex"
        showDetailed={true}
        onClose={() => setShowOverlay(false)}
      />
    </div>
  );
}

/**
 * Gradient follow demonstration card
 */
function GradientFollowCard({ onAnimationStart, onAnimationEnd }: {
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}) {
  const gradientFollow = useGradientFollow<HTMLDivElement>({
    radius: 200,
    opacity: 0.3
  });

  return (
    <Card
      ref={gradientFollow.ref}
      className="h-48 relative overflow-hidden cursor-pointer"
      onMouseEnter={onAnimationStart}
      onMouseLeave={onAnimationEnd}
      style={{
        background: gradientFollow.gradientValue || 'linear-gradient(45deg, #f0f9ff, #e0e7ff)'
      }}
    >
      <CardContent className="h-full flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Gradient Follow</h3>
          <p className="text-sm text-gray-600">Move mouse to see effect</p>
          <PerformanceIndicator animationType="hover" className="mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Magnetic hover demonstration card
 */
function MagneticHoverCard({ onAnimationStart, onAnimationEnd }: {
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}) {
  const magneticHover = useMagneticHover<HTMLDivElement>({
    strength: 0.3,
    maxDistance: 100
  });

  return (
    <Card className="h-48 flex items-center justify-center">
      <div
        ref={magneticHover.ref}
        className="bg-blue-500 text-white p-6 rounded-lg cursor-pointer transition-transform"
        style={{
          transform: `translate(${magneticHover.transform.x}px, ${magneticHover.transform.y}px)`
        }}
        onMouseEnter={onAnimationStart}
        onMouseLeave={onAnimationEnd}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold">Magnetic Hover</h3>
          <p className="text-sm opacity-90">Follows cursor</p>
          <PerformanceIndicator animationType="hover" className="mt-2" />
        </div>
      </div>
    </Card>
  );
}

/**
 * Ripple effect demonstration card
 */
function RippleCard({ onAnimationStart, onAnimationEnd }: {
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}) {
  const ripple = useRipple<HTMLDivElement>({
    preset: 'button'
  });

  return (
    <Card 
      className="h-48 relative overflow-hidden cursor-pointer bg-gradient-to-br from-blue-500 to-purple-600 text-white"
      onClick={() => {
        onAnimationStart();
        ripple.triggerRipple();
        setTimeout(onAnimationEnd, 600);
      }}
      ref={ripple.rippleRef}
      {...ripple.getRippleProps()}
    >
      <CardContent className="h-full flex items-center justify-center relative z-10">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Ripple Effect</h3>
          <p className="text-sm opacity-90">Click to create ripple</p>
          <PerformanceIndicator animationType="micro" className="mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Heavy animation that may cause performance issues
 */
function HeavyAnimationCard({ onAnimationStart, onAnimationEnd }: {
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleAnimation = () => {
    setIsAnimating(true);
    onAnimationStart();
    
    // Simulate heavy animation work
    setTimeout(() => {
      setIsAnimating(false);
      onAnimationEnd();
    }, 2000);
  };

  return (
    <Card className="h-48 cursor-pointer" onClick={handleAnimation}>
      <CardContent className="h-full flex items-center justify-center">
        <div className={`text-center transition-all duration-2000 ${
          isAnimating ? 'animate-spin scale-125' : ''
        }`}>
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-2" />
          <h3 className="text-lg font-semibold">Heavy Animation</h3>
          <p className="text-sm text-gray-600">May cause performance issues</p>
          <PerformanceIndicator animationType="complex" className="mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Optimized animation example
 */
function OptimizedAnimationCard({ onAnimationStart, onAnimationEnd }: {
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}) {
  const [isAnimating, setIsAnimating] = React.useState(false);

  const handleAnimation = () => {
    setIsAnimating(true);
    onAnimationStart();
    
    setTimeout(() => {
      setIsAnimating(false);
      onAnimationEnd();
    }, 300);
  };

  return (
    <Card className="h-48 cursor-pointer" onClick={handleAnimation}>
      <CardContent className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className={`w-16 h-16 bg-green-500 rounded-full mx-auto mb-2 transition-transform duration-300 ${
            isAnimating ? 'scale-110' : ''
          }`} style={{ willChange: 'transform' }} />
          <h3 className="text-lg font-semibold">Optimized Animation</h3>
          <p className="text-sm text-gray-600">GPU accelerated</p>
          <PerformanceIndicator animationType="micro" className="mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Multiple effects combined
 */
function MultiEffectCard({ onAnimationStart, onAnimationEnd }: {
  onAnimationStart: () => void;
  onAnimationEnd: () => void;
}) {
  const gradientFollow = useGradientFollow({ radius: 150, opacity: 0.2 });
  const magneticHover = useMagneticHover<HTMLDivElement>({ strength: 0.2, maxDistance: 80 });
  const ripple = useRipple({ preset: 'button' });
  
  const handleClick = () => {
    ripple.triggerRipple();
  };

  return (
    <Card
      ref={(el) => {
        if (gradientFollow.ref) {
          (gradientFollow.ref as React.MutableRefObject<HTMLElement | null>).current = el;
        }
        if (ripple.rippleRef) {
          (ripple.rippleRef as React.MutableRefObject<HTMLElement | null>).current = el;
        }
      }}
      className="h-48 relative overflow-hidden cursor-pointer"
      style={{
        background: gradientFollow.gradientValue || 'linear-gradient(45deg, #fef3c7, #fed7aa)'
      }}
      onMouseEnter={onAnimationStart}
      onMouseLeave={onAnimationEnd}
      onClick={handleClick}
      {...ripple.getRippleProps()}
    >
      <CardContent className="h-full flex items-center justify-center">
        <div
          ref={magneticHover.ref}
          className="text-center transition-transform"
          style={{
            transform: `translate(${magneticHover.transform.x}px, ${magneticHover.transform.y}px)`
          }}
        >
          <h3 className="text-lg font-semibold">Multi-Effect</h3>
          <p className="text-sm text-gray-600">Hover + Click + Follow</p>
          <PerformanceIndicator animationType="complex" className="mt-2" />
        </div>
      </CardContent>
    </Card>
  );
}

export default PerformanceDemo;