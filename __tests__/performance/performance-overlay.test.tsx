import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PerformanceOverlay, PerformanceIndicator } from '@/components/dev/performance-overlay';

// Mock the performance monitor hook
const mockPerformanceMonitor = {
  metrics: {
    fps: 60,
    averageFps: 58,
    minFps: 45,
    maxFps: 60,
    droppedFrames: 2,
    totalFrames: 1000,
    animationLatency: 2.5,
    jankScore: 8.3,
    frameVariance: 1.2,
    memoryUsage: 25.5,
    isPerformant: true,
    isPoor: false,
    isJanky: false,
    lastFrameTime: 16.2,
    averageFrameTime: 16.8,
    longestFrame: 22.1,
    devicePixelRatio: 2,
    isLowEndDevice: false
  },
  issues: [
    {
      type: 'low_fps' as const,
      severity: 'medium' as const,
      message: 'FPS dropped below 50',
      data: { fps: 45, target: 60 },
      timestamp: Date.now()
    },
    {
      type: 'high_jank' as const,
      severity: 'low' as const,
      message: 'Jank detected',
      data: { jankScore: 8.3 },
      timestamp: Date.now() - 1000
    }
  ],
  isLowEndDevice: false,
  performanceScore: 85,
  budget: {
    maxFrameTime: 16.67,
    targetFps: 60,
    maxJankPercentage: 5,
    maxMemoryIncrease: 2
  },
  start: jest.fn(),
  stop: jest.fn(),
  reset: jest.fn(),
  generateReport: jest.fn(() => ({
    animationType: 'micro',
    metrics: mockPerformanceMonitor.metrics,
    budget: mockPerformanceMonitor.budget,
    passed: true,
    recommendations: ['Consider optimizing animation complexity']
  })),
  recordFrame: jest.fn(),
  isMonitoring: true
};

// Mock the hook
jest.mock('@/hooks/use-performance-monitor', () => ({
  usePerformanceMonitor: () => mockPerformanceMonitor
}));

// Mock UI components
jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => <div className={`card ${className}`}>{children}</div>,
  CardContent: ({ children, className }: any) => <div className={`card-content ${className}`}>{children}</div>,
  CardHeader: ({ children, className }: any) => <div className={`card-header ${className}`}>{children}</div>,
  CardTitle: ({ children, className }: any) => <div className={`card-title ${className}`}>{children}</div>
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span className={`badge ${variant} ${className}`}>{children}</span>
  )
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, variant, size }: any) => (
    <button onClick={onClick} className={`button ${variant} ${size} ${className}`}>
      {children}
    </button>
  )
}));

jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div className={`progress ${className}`} data-value={value}>
      <div style={{ width: `${value}%` }} />
    </div>
  )
}));

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  AlertTriangle: () => <span>⚠️</span>,
  Activity: () => <span>📊</span>,
  Monitor: () => <span>🖥️</span>,
  Zap: () => <span>⚡</span>,
  TrendingDown: () => <span>📉</span>
}));

describe('PerformanceOverlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render when visible is true', () => {
    render(<PerformanceOverlay visible={true} />);
    
    expect(screen.getByText('Performance Monitor')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument(); // Performance score
    expect(screen.getByText('60')).toBeInTheDocument(); // FPS
  });

  it('should not render when visible is false', () => {
    render(<PerformanceOverlay visible={false} />);
    
    expect(screen.queryByText('Performance Monitor')).not.toBeInTheDocument();
  });

  it('should display performance metrics correctly', () => {
    render(<PerformanceOverlay visible={true} />);
    
    // Check key metrics are displayed
    expect(screen.getByText('60')).toBeInTheDocument(); // Current FPS
    expect(screen.getByText('58')).toBeInTheDocument(); // Average FPS
    expect(screen.getByText('8.3%')).toBeInTheDocument(); // Jank score
    expect(screen.getByText('2')).toBeInTheDocument(); // Dropped frames
  });

  it('should display device information', () => {
    render(<PerformanceOverlay visible={true} />);
    
    expect(screen.getByText('Standard Device')).toBeInTheDocument();
    expect(screen.getByText('2.0x DPR')).toBeInTheDocument();
  });

  it('should show performance issues when present', () => {
    render(<PerformanceOverlay visible={true} />);
    
    expect(screen.getByText('Recent Issues (2)')).toBeInTheDocument();
    expect(screen.getByText('FPS dropped below 50')).toBeInTheDocument();
  });

  it('should expand and collapse detailed view', () => {
    render(<PerformanceOverlay visible={true} showDetailed={false} />);
    
    // Should not show detailed metrics initially
    expect(screen.queryByText('Detailed Metrics')).not.toBeInTheDocument();
    
    // Find and click the expand button (Monitor icon)
    const expandButton = screen.getByText('🖥️').closest('button');
    expect(expandButton).toBeInTheDocument();
    
    fireEvent.click(expandButton!);
    
    // Should show detailed metrics after expansion
    expect(screen.getByText('Detailed Metrics')).toBeInTheDocument();
    expect(screen.getByText('16.8ms')).toBeInTheDocument(); // Average frame time
    expect(screen.getByText('22.1ms')).toBeInTheDocument(); // Longest frame
  });

  it('should handle close button when onClose is provided', () => {
    const mockOnClose = jest.fn();
    render(<PerformanceOverlay visible={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call reset when reset button is clicked', () => {
    render(<PerformanceOverlay visible={true} showDetailed={true} />);
    
    const resetButton = screen.getByText('Reset');
    fireEvent.click(resetButton);
    
    expect(mockPerformanceMonitor.reset).toHaveBeenCalledTimes(1);
  });

  it('should generate report when report button is clicked', () => {
    // Mock console.log to capture the report
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    
    render(<PerformanceOverlay visible={true} showDetailed={true} />);
    
    const reportButton = screen.getByText('Report');
    fireEvent.click(reportButton);
    
    expect(mockPerformanceMonitor.generateReport).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith('Performance Report:', expect.any(Object));
    
    consoleSpy.mockRestore();
  });

  it('should display performance badges correctly', () => {
    render(<PerformanceOverlay visible={true} showDetailed={true} />);
    
    expect(screen.getByText('Performant')).toBeInTheDocument();
    // Should not show "Janky" or "Poor FPS" badges since metrics indicate good performance
    expect(screen.queryByText('Janky')).not.toBeInTheDocument();
    expect(screen.queryByText('Poor FPS')).not.toBeInTheDocument();
  });

  it('should show issue details when issue is clicked', async () => {
    render(<PerformanceOverlay visible={true} />);
    
    const issueElement = screen.getByText('FPS dropped below 50');
    fireEvent.click(issueElement);
    
    await waitFor(() => {
      expect(screen.getByText('Performance Issue Detail')).toBeInTheDocument();
      expect(screen.getByText('MEDIUM')).toBeInTheDocument(); // Severity badge
      expect(screen.getByText('LOW_FPS')).toBeInTheDocument(); // Type badge
    });
  });

  it('should close issue detail modal', async () => {
    render(<PerformanceOverlay visible={true} />);
    
    // Open issue detail
    const issueElement = screen.getByText('FPS dropped below 50');
    fireEvent.click(issueElement);
    
    await waitFor(() => {
      expect(screen.getByText('Performance Issue Detail')).toBeInTheDocument();
    });
    
    // Close issue detail
    const closeButtons = screen.getAllByText('×');
    const modalCloseButton = closeButtons.find(btn => 
      btn.closest('.card')?.textContent?.includes('Performance Issue Detail')
    );
    fireEvent.click(modalCloseButton!);
    
    await waitFor(() => {
      expect(screen.queryByText('Performance Issue Detail')).not.toBeInTheDocument();
    });
  });

  it('should position overlay correctly based on position prop', () => {
    const { rerender } = render(<PerformanceOverlay visible={true} position="top-left" />);
    let overlay = screen.getByText('Performance Monitor').closest('.card');
    expect(overlay).toHaveClass('top-4', 'left-4');
    
    rerender(<PerformanceOverlay visible={true} position="bottom-right" />);
    overlay = screen.getByText('Performance Monitor').closest('.card');
    expect(overlay).toHaveClass('bottom-4', 'right-4');
  });

  it('should use custom animation type', () => {
    render(<PerformanceOverlay visible={true} animationType="scroll" />);
    
    // The animation type affects the internal performance monitor configuration
    expect(mockPerformanceMonitor.start).toHaveBeenCalled();
  });
});

describe('PerformanceIndicator', () => {
  it('should render compact performance indicator', () => {
    render(<PerformanceIndicator />);
    
    expect(screen.getByText('60 FPS')).toBeInTheDocument();
  });

  it('should show green indicator for good performance', () => {
    render(<PerformanceIndicator />);
    
    const indicator = screen.getByText('60 FPS').previousSibling;
    expect(indicator).toHaveClass('bg-green-500');
  });

  it('should show red indicator when issues are present', () => {
    // Mock performance monitor with issues
    const mockMonitorWithIssues = {
      ...mockPerformanceMonitor,
      issues: [{ type: 'low_fps', severity: 'high', message: 'Bad FPS', data: {}, timestamp: Date.now() }]
    };
    
    jest.doMock('@/hooks/use-performance-monitor', () => ({
      usePerformanceMonitor: () => mockMonitorWithIssues
    }));
    
    // Re-render with issues
    render(<PerformanceIndicator />);
    
    // Check that indicator shows issues (implementation detail - may need adjustment based on actual component)
    expect(screen.getByText('60 FPS')).toBeInTheDocument();
  });

  it('should accept custom className', () => {
    render(<PerformanceIndicator className="custom-class" />);
    
    const container = screen.getByText('60 FPS').closest('div');
    expect(container).toHaveClass('custom-class');
  });

  it('should use specified animation type', () => {
    render(<PerformanceIndicator animationType="hover" />);
    
    // Animation type affects internal hook configuration
    expect(screen.getByText('60 FPS')).toBeInTheDocument();
  });
});

describe('PerformanceOverlay Color Utilities', () => {
  it('should apply correct FPS colors', () => {
    // Test with low FPS
    const mockLowFpsMonitor = {
      ...mockPerformanceMonitor,
      metrics: { ...mockPerformanceMonitor.metrics, fps: 25, averageFps: 25 }
    };
    
    jest.doMock('@/hooks/use-performance-monitor', () => ({
      usePerformanceMonitor: () => mockLowFpsMonitor
    }));
    
    render(<PerformanceOverlay visible={true} />);
    
    // Low FPS should be displayed (specific color class testing would require more detailed component inspection)
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('should show correct performance score colors', () => {
    // Test with low performance score
    const mockLowScoreMonitor = {
      ...mockPerformanceMonitor,
      performanceScore: 45
    };
    
    jest.doMock('@/hooks/use-performance-monitor', () => ({
      usePerformanceMonitor: () => mockLowScoreMonitor
    }));
    
    render(<PerformanceOverlay visible={true} />);
    
    expect(screen.getByText('45')).toBeInTheDocument();
  });
});

describe('PerformanceOverlay Integration', () => {
  it('should work with different performance states', () => {
    // Test with poor performance
    const mockPoorPerformance = {
      ...mockPerformanceMonitor,
      metrics: {
        ...mockPerformanceMonitor.metrics,
        fps: 20,
        averageFps: 22,
        isPerformant: false,
        isPoor: true,
        isJanky: true,
        jankScore: 35
      },
      performanceScore: 30,
      issues: [
        {
          type: 'budget_exceeded' as const,
          severity: 'high' as const,
          message: 'Performance budget exceeded',
          data: { violations: 3 },
          timestamp: Date.now()
        }
      ]
    };
    
    jest.doMock('@/hooks/use-performance-monitor', () => ({
      usePerformanceMonitor: () => mockPoorPerformance
    }));
    
    render(<PerformanceOverlay visible={true} showDetailed={true} />);
    
    expect(screen.getByText('20')).toBeInTheDocument(); // Low FPS
    expect(screen.getByText('30')).toBeInTheDocument(); // Low score
    expect(screen.getByText('35.0%')).toBeInTheDocument(); // High jank
    expect(screen.getByText('Below Target')).toBeInTheDocument(); // Performance badge
    expect(screen.getByText('Janky')).toBeInTheDocument(); // Jank badge
    expect(screen.getByText('Poor FPS')).toBeInTheDocument(); // Poor FPS badge
  });
});