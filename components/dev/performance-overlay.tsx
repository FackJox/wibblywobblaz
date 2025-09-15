"use client"

import * as React from "react"
import { usePerformanceMonitor, type PerformanceIssue } from "@/hooks/use-performance-monitor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Activity, Monitor } from "lucide-react"

/**
 * Props for PerformanceOverlay component
 */
interface PerformanceOverlayProps {
  /** Whether the overlay is visible */
  visible?: boolean;
  /** Position of the overlay */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Animation type to monitor */
  animationType?: 'micro' | 'scroll' | 'hover' | 'transition' | 'complex';
  /** Whether to show detailed metrics */
  showDetailed?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Callback when overlay is closed */
  onClose?: () => void;
}

/**
 * Get color class for performance score
 */
function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  return "text-red-500";
}

/**
 * Get color class for FPS
 */
function getFpsColor(fps: number): string {
  if (fps >= 50) return "text-green-500";
  if (fps >= 30) return "text-yellow-500";
  return "text-red-500";
}

/**
 * Get severity color for issues
 */
function getSeverityColor(severity: PerformanceIssue['severity']): string {
  switch (severity) {
    case 'low': return "bg-blue-500";
    case 'medium': return "bg-yellow-500";
    case 'high': return "bg-red-500";
    default: return "bg-gray-500";
  }
}

/**
 * Format memory usage
 */
function formatMemory(mb: number): string {
  if (mb === 0) return "N/A";
  return `${mb.toFixed(1)}MB`;
}

/**
 * Development performance overlay component
 * Shows real-time performance metrics and issues for debugging animations
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <PerformanceOverlay visible={isDev} animationType="hover" />
 * 
 * // Detailed overlay
 * <PerformanceOverlay 
 *   visible={showPerf}
 *   position="bottom-right"
 *   showDetailed={true}
 *   onClose={() => setShowPerf(false)}
 * />
 * ```
 */
export function PerformanceOverlay({
  visible = true,
  position = 'top-right',
  animationType = 'micro',
  showDetailed = false,
  className = '',
  onClose
}: PerformanceOverlayProps) {
  const monitor = usePerformanceMonitor({
    animationType,
    autoStart: true,
    logIssues: false, // Avoid console spam in overlay mode
    enableMemoryMonitoring: true
  });

  const [isExpanded, setIsExpanded] = React.useState(showDetailed);
  const [selectedIssue, setSelectedIssue] = React.useState<PerformanceIssue | null>(null);

  // Position classes
  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4'
  };

  if (!visible) return null;

  const currentMetrics = monitor.metrics;
  const recentIssues = monitor.issues.slice(-5); // Show last 5 issues

  return (
    <>
      {/* Main Overlay */}
      <Card className={`
        fixed ${positionClasses[position]} z-50 
        bg-black/90 backdrop-blur-sm border-gray-700 text-white
        ${isExpanded ? 'w-96' : 'w-64'} 
        transition-all duration-300 
        ${className}
      `}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Performance Monitor
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <Monitor className="w-3 h-3" />
              </Button>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-3">
          {/* Performance Score */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Performance Score</span>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${getScoreColor(monitor.performanceScore)}`}>
                {monitor.performanceScore}
              </span>
              <Progress 
                value={monitor.performanceScore} 
                className="w-16 h-1"
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-400">FPS:</span>
              <span className={getFpsColor(currentMetrics?.fps || 0)}>
                {currentMetrics?.fps || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg:</span>
              <span className={getFpsColor(currentMetrics?.averageFps || 0)}>
                {currentMetrics?.averageFps || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Jank:</span>
              <span className={currentMetrics?.jankScore && currentMetrics.jankScore > 10 ? "text-red-500" : "text-green-500"}>
                {currentMetrics?.jankScore?.toFixed(1) || 0}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Dropped:</span>
              <span className={currentMetrics?.droppedFrames && currentMetrics.droppedFrames > 0 ? "text-yellow-500" : "text-green-500"}>
                {currentMetrics?.droppedFrames || 0}
              </span>
            </div>
          </div>

          {/* Device Info */}
          <div className="flex items-center gap-2">
            <Badge variant={monitor.isLowEndDevice ? "destructive" : "secondary"} className="text-xs">
              {monitor.isLowEndDevice ? "Low-End Device" : "Standard Device"}
            </Badge>
            <span className="text-xs text-gray-400">
              {currentMetrics?.devicePixelRatio.toFixed(1)}x DPR
            </span>
          </div>

          {/* Issues Summary */}
          {recentIssues.length > 0 && (
            <div className="border-t border-gray-700 pt-2">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                <span className="text-xs text-gray-400">
                  Recent Issues ({recentIssues.length})
                </span>
              </div>
              <div className="space-y-1">
                {recentIssues.slice(0, 2).map((issue, index) => (
                  <div 
                    key={index}
                    className="text-xs p-1 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
                    onClick={() => setSelectedIssue(issue)}
                  >
                    <div className="flex items-center gap-1">
                      <div className={`w-1 h-1 rounded-full ${getSeverityColor(issue.severity)}`} />
                      <span className="text-gray-300 truncate">
                        {issue.message}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expanded Details */}
          {isExpanded && currentMetrics && (
            <div className="border-t border-gray-700 pt-3 space-y-2">
              <div className="text-xs text-gray-400 font-semibold">Detailed Metrics</div>
              
              {/* Frame Timing */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Avg Frame:</span>
                  <span>{currentMetrics.averageFrameTime.toFixed(1)}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Longest:</span>
                  <span className={currentMetrics.longestFrame > 33 ? "text-red-500" : "text-green-500"}>
                    {currentMetrics.longestFrame.toFixed(1)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Variance:</span>
                  <span className={currentMetrics.frameVariance > 5 ? "text-yellow-500" : "text-green-500"}>
                    {currentMetrics.frameVariance.toFixed(1)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Memory:</span>
                  <span>{formatMemory(currentMetrics.memoryUsage)}</span>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="flex flex-wrap gap-1">
                <Badge 
                  variant={currentMetrics.isPerformant ? "default" : "destructive"}
                  className="text-xs"
                >
                  {currentMetrics.isPerformant ? "Performant" : "Below Target"}
                </Badge>
                {currentMetrics.isJanky && (
                  <Badge variant="destructive" className="text-xs">
                    Janky
                  </Badge>
                )}
                {currentMetrics.isPoor && (
                  <Badge variant="destructive" className="text-xs">
                    Poor FPS
                  </Badge>
                )}
              </div>

              {/* Controls */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={monitor.reset}
                  className="h-6 text-xs"
                >
                  Reset
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const report = monitor.generateReport();
                    if (report) {
                      console.log('Performance Report:', report);
                    }
                  }}
                  className="h-6 text-xs"
                >
                  Report
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <Card className="fixed inset-0 z-50 m-8 bg-black/95 backdrop-blur text-white overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Performance Issue Detail
              </CardTitle>
              <Button
                variant="ghost"
                onClick={() => setSelectedIssue(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getSeverityColor(selectedIssue.severity)}>
                  {selectedIssue.severity.toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {selectedIssue.type.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
              <p className="text-sm text-gray-300 mb-4">{selectedIssue.message}</p>
              
              <div className="bg-gray-800 p-3 rounded text-xs">
                <div className="text-gray-400 mb-2">Issue Data:</div>
                <pre className="text-gray-200 overflow-auto">
                  {JSON.stringify(selectedIssue.data, null, 2)}
                </pre>
              </div>
              
              <div className="text-xs text-gray-400 mt-2">
                Occurred: {new Date(selectedIssue.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}

/**
 * Compact performance indicator for embedded use
 */
export function PerformanceIndicator({ 
  animationType = 'micro',
  className = ''
}: {
  animationType?: 'micro' | 'scroll' | 'hover' | 'transition' | 'complex';
  className?: string;
}) {
  const monitor = usePerformanceMonitor({
    animationType,
    autoStart: true,
    logIssues: false
  });

  const hasIssues = monitor.issues.length > 0;
  const currentFps = monitor.metrics?.fps || 0;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${hasIssues ? 'bg-red-500' : 'bg-green-500'}`} />
      <span className={`text-xs ${getFpsColor(currentFps)}`}>
        {currentFps} FPS
      </span>
    </div>
  );
}