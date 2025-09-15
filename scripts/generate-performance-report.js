#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

/**
 * Performance Report Generator
 * Compiles all performance data into comprehensive comparison report
 */

const RESULTS_DIR = path.join(process.cwd(), 'performance-results');
const REPORTS_DIR = path.join(process.cwd(), 'docs', 'performance');

// Ensure directories exist
[RESULTS_DIR, REPORTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function loadLatestResults() {
  const results = {};
  
  // Load bundle analysis
  const bundlePath = path.join(RESULTS_DIR, 'bundle-summary-latest.json');
  if (fs.existsSync(bundlePath)) {
    results.bundle = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));
  }
  
  // Load lighthouse results
  const lighthousePath = path.join(RESULTS_DIR, 'lighthouse-latest.json');
  if (fs.existsSync(lighthousePath)) {
    results.lighthouse = JSON.parse(fs.readFileSync(lighthousePath, 'utf8'));
  }
  
  // Load benchmark results
  const benchmarkPath = path.join(RESULTS_DIR, 'benchmark-latest.json');
  if (fs.existsSync(benchmarkPath)) {
    results.benchmark = JSON.parse(fs.readFileSync(benchmarkPath, 'utf8'));
  }
  
  return results;
}

function loadComparisonData() {
  // Look for previous results to compare against
  const comparisonPath = path.join(REPORTS_DIR, 'baseline-results.json');
  
  if (fs.existsSync(comparisonPath)) {
    return JSON.parse(fs.readFileSync(comparisonPath, 'utf8'));
  }
  
  return null;
}

function calculatePerformanceScore(lighthouse, benchmark) {
  let score = 0;
  let maxScore = 0;
  
  if (lighthouse) {
    // Lighthouse scores (0-100 each, weight: 4)
    score += lighthouse.averagedMetrics.scores.performance * 4;
    score += lighthouse.averagedMetrics.scores.accessibility * 1;
    score += lighthouse.averagedMetrics.scores.bestPractices * 1;
    score += lighthouse.averagedMetrics.scores.seo * 1;
    maxScore += 700; // 100*4 + 100*1 + 100*1 + 100*1
  }
  
  if (benchmark) {
    // Load time score (lower is better, max 5 seconds)
    const loadTimeScore = Math.max(0, 100 - (benchmark.averages.loadTime / 50));
    score += loadTimeScore * 2;
    maxScore += 200;
    
    // Memory usage score (lower is better)
    if (benchmark.averages.memoryUsage.usedJSHeapSize) {
      const memoryMB = benchmark.averages.memoryUsage.usedJSHeapSize / 1024 / 1024;
      const memoryScore = Math.max(0, 100 - memoryMB);
      score += memoryScore * 1;
      maxScore += 100;
    }
  }
  
  return maxScore > 0 ? (score / maxScore) * 100 : 0;
}

function compareMetrics(current, baseline) {
  if (!baseline) return null;
  
  const comparison = {
    bundle: null,
    lighthouse: null,
    benchmark: null,
    summary: {
      improvements: [],
      regressions: [],
      neutral: [],
    }
  };
  
  // Bundle size comparison
  if (current.bundle && baseline.bundle) {
    const currentTotal = parseFloat(current.bundle.totals.overall.gzipped.replace(/[^\d.]/g, ''));
    const baselineTotal = parseFloat(baseline.bundle.totals.overall.gzipped.replace(/[^\d.]/g, ''));
    
    const change = ((currentTotal - baselineTotal) / baselineTotal) * 100;
    
    comparison.bundle = {
      current: current.bundle.totals.overall.gzipped,
      baseline: baseline.bundle.totals.overall.gzipped,
      change: change.toFixed(2) + '%',
      improvement: change < 0,
    };
    
    if (Math.abs(change) > 5) {
      (change < 0 ? comparison.summary.improvements : comparison.summary.regressions).push(
        `Bundle size ${change < 0 ? 'decreased' : 'increased'} by ${Math.abs(change).toFixed(1)}%`
      );
    } else {
      comparison.summary.neutral.push('Bundle size remained stable');
    }
  }
  
  // Lighthouse comparison
  if (current.lighthouse && baseline.lighthouse) {
    const currentScore = current.lighthouse.averagedMetrics.scores.performance;
    const baselineScore = baseline.lighthouse.averagedMetrics.scores.performance;
    const change = currentScore - baselineScore;
    
    comparison.lighthouse = {
      current: currentScore.toFixed(1),
      baseline: baselineScore.toFixed(1),
      change: (change > 0 ? '+' : '') + change.toFixed(1),
      improvement: change > 0,
    };
    
    if (Math.abs(change) > 2) {
      (change > 0 ? comparison.summary.improvements : comparison.summary.regressions).push(
        `Lighthouse performance score ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)} points`
      );
    } else {
      comparison.summary.neutral.push('Lighthouse score remained stable');
    }
  }
  
  // Benchmark comparison
  if (current.benchmark && baseline.benchmark) {
    const currentLoad = current.benchmark.averages.loadTime;
    const baselineLoad = baseline.benchmark.averages.loadTime;
    const change = ((currentLoad - baselineLoad) / baselineLoad) * 100;
    
    comparison.benchmark = {
      current: currentLoad.toFixed(2) + 'ms',
      baseline: baselineLoad.toFixed(2) + 'ms',
      change: (change > 0 ? '+' : '') + change.toFixed(2) + '%',
      improvement: change < 0,
    };
    
    if (Math.abs(change) > 10) {
      (change < 0 ? comparison.summary.improvements : comparison.summary.regressions).push(
        `Load time ${change < 0 ? 'decreased' : 'increased'} by ${Math.abs(change).toFixed(1)}%`
      );
    } else {
      comparison.summary.neutral.push('Load time remained stable');
    }
  }
  
  return comparison;
}

function generateMarkdownReport(results, comparison) {
  const timestamp = new Date().toISOString().split('T')[0];
  
  let report = `# Performance Analysis Report\n\n`;
  report += `**Generated:** ${new Date().toLocaleString()}\n`;
  report += `**URL:** ${results.lighthouse?.url || results.benchmark?.url || 'N/A'}\n\n`;
  
  // Executive Summary
  report += `## Executive Summary\n\n`;
  
  if (comparison && comparison.summary) {
    if (comparison.summary.improvements.length > 0) {
      report += `### ✅ Improvements\n`;
      comparison.summary.improvements.forEach(improvement => {
        report += `- ${improvement}\n`;
      });
      report += `\n`;
    }
    
    if (comparison.summary.regressions.length > 0) {
      report += `### ❌ Regressions\n`;
      comparison.summary.regressions.forEach(regression => {
        report += `- ${regression}\n`;
      });
      report += `\n`;
    }
    
    if (comparison.summary.neutral.length > 0) {
      report += `### ➖ No Significant Change\n`;
      comparison.summary.neutral.forEach(neutral => {
        report += `- ${neutral}\n`;
      });
      report += `\n`;
    }
  } else {
    report += `*No baseline data available for comparison. This report establishes the performance baseline.*\n\n`;
  }
  
  // Bundle Analysis
  if (results.bundle) {
    report += `## 📦 Bundle Size Analysis\n\n`;
    report += `| Asset Type | File Count | Original Size | Gzipped Size |\n`;
    report += `|------------|------------|---------------|---------------|\n`;
    report += `| CSS | ${results.bundle.totals.css.fileCount} | ${results.bundle.totals.css.original} | ${results.bundle.totals.css.gzipped} |\n`;
    report += `| JavaScript | ${results.bundle.totals.javascript.fileCount} | ${results.bundle.totals.javascript.original} | ${results.bundle.totals.javascript.gzipped} |\n`;
    report += `| Code Split Chunks | ${results.bundle.totals.chunks.fileCount} | ${results.bundle.totals.chunks.original} | ${results.bundle.totals.chunks.gzipped} |\n`;
    report += `| **Total** | **${results.bundle.totals.overall.fileCount}** | **${results.bundle.totals.overall.original}** | **${results.bundle.totals.overall.gzipped}** |\n\n`;
    
    if (comparison?.bundle) {
      report += `### Comparison vs Baseline\n`;
      report += `- **Current:** ${comparison.bundle.current}\n`;
      report += `- **Baseline:** ${comparison.bundle.baseline}\n`;
      report += `- **Change:** ${comparison.bundle.change} ${comparison.bundle.improvement ? '✅' : '❌'}\n\n`;
    }
  }
  
  // Lighthouse Results
  if (results.lighthouse) {
    report += `## 🎯 Lighthouse Performance Audit\n\n`;
    
    const metrics = results.lighthouse.averagedMetrics;
    
    report += `### Overall Scores\n`;
    report += `| Category | Score |\n`;
    report += `|----------|-------|\n`;
    report += `| Performance | ${metrics.scores.performance.toFixed(1)}/100 |\n`;
    report += `| Accessibility | ${metrics.scores.accessibility.toFixed(1)}/100 |\n`;
    report += `| Best Practices | ${metrics.scores.bestPractices.toFixed(1)}/100 |\n`;
    report += `| SEO | ${metrics.scores.seo.toFixed(1)}/100 |\n\n`;
    
    report += `### Core Web Vitals\n`;
    report += `| Metric | Value | Score |\n`;
    report += `|--------|-------|-------|\n`;
    report += `| Largest Contentful Paint (LCP) | ${metrics.coreWebVitals.lcp.displayValue} | ${(metrics.coreWebVitals.lcp.score * 100).toFixed(1)}/100 |\n`;
    report += `| First Input Delay (FID) | ${metrics.coreWebVitals.fid.displayValue} | ${(metrics.coreWebVitals.fid.score * 100).toFixed(1)}/100 |\n`;
    report += `| Cumulative Layout Shift (CLS) | ${metrics.coreWebVitals.cls.displayValue} | ${(metrics.coreWebVitals.cls.score * 100).toFixed(1)}/100 |\n\n`;
    
    report += `### Performance Metrics\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| First Contentful Paint (FCP) | ${metrics.performance.fcp.displayValue} |\n`;
    report += `| First Meaningful Paint (FMP) | ${metrics.performance.fmp.displayValue} |\n`;
    report += `| Speed Index | ${metrics.performance.si.displayValue} |\n`;
    report += `| Time to Interactive (TTI) | ${metrics.performance.tti.displayValue} |\n`;
    report += `| Total Blocking Time (TBT) | ${metrics.performance.tbt.displayValue} |\n\n`;
    
    if (comparison?.lighthouse) {
      report += `### Comparison vs Baseline\n`;
      report += `- **Current Performance Score:** ${comparison.lighthouse.current}\n`;
      report += `- **Baseline Performance Score:** ${comparison.lighthouse.baseline}\n`;
      report += `- **Change:** ${comparison.lighthouse.change} ${comparison.lighthouse.improvement ? '✅' : '❌'}\n\n`;
    }
  }
  
  // Runtime Benchmark
  if (results.benchmark) {
    report += `## ⚡ Runtime Performance Benchmark\n\n`;
    
    const avg = results.benchmark.averages;
    
    report += `### Loading Performance\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Total Load Time | ${avg.loadTime.toFixed(2)}ms |\n`;
    report += `| DOM Content Loaded | ${avg.navigation.domContentLoaded.toFixed(2)}ms |\n`;
    report += `| Load Complete | ${avg.navigation.loadComplete.toFixed(2)}ms |\n`;
    report += `| DNS Lookup | ${avg.navigation.dnsLookup.toFixed(2)}ms |\n`;
    report += `| TCP Connect | ${avg.navigation.tcpConnect.toFixed(2)}ms |\n`;
    report += `| Request | ${avg.navigation.request.toFixed(2)}ms |\n`;
    report += `| Response | ${avg.navigation.response.toFixed(2)}ms |\n\n`;
    
    if (avg.paint.firstpaint || avg.paint.firstcontentfulpaint) {
      report += `### Paint Metrics\n`;
      report += `| Metric | Value |\n`;
      report += `|--------|-------|\n`;
      if (avg.paint.firstpaint) {
        report += `| First Paint | ${avg.paint.firstpaint.toFixed(2)}ms |\n`;
      }
      if (avg.paint.firstcontentfulpaint) {
        report += `| First Contentful Paint | ${avg.paint.firstcontentfulpaint.toFixed(2)}ms |\n`;
      }
      report += `\n`;
    }
    
    if (avg.memoryUsage.usedJSHeapSize) {
      report += `### Memory Usage\n`;
      report += `| Metric | Value |\n`;
      report += `|--------|-------|\n`;
      report += `| Used JS Heap | ${(avg.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB |\n`;
      report += `| Total JS Heap | ${(avg.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB |\n`;
      report += `| JS Heap Limit | ${(avg.memoryUsage.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB |\n\n`;
    }
    
    report += `### CSS Analysis\n`;
    report += `| Metric | Value |\n`;
    report += `|--------|-------|\n`;
    report += `| Total Stylesheets | ${avg.cssMetrics.totalStyleSheets.toFixed(0)} |\n`;
    report += `| Total CSS Rules | ${avg.cssMetrics.totalRules.toFixed(0)} |\n`;
    report += `| CSS Parse Time | ${avg.cssMetrics.cssParseTime.toFixed(2)}ms |\n\n`;
    
    if (avg.coreWebVitals.lcp || avg.coreWebVitals.cls) {
      report += `### Core Web Vitals (Runtime)\n`;
      report += `| Metric | Value |\n`;
      report += `|--------|-------|\n`;
      if (avg.coreWebVitals.lcp) {
        report += `| LCP | ${avg.coreWebVitals.lcp.toFixed(2)}ms |\n`;
      }
      if (avg.coreWebVitals.cls) {
        report += `| CLS | ${avg.coreWebVitals.cls.toFixed(4)} |\n`;
      }
      report += `\n`;
    }
    
    if (results.benchmark.errors.length > 0) {
      report += `### Errors Found\n`;
      report += `${results.benchmark.errors.length} errors detected during testing:\n\n`;
      results.benchmark.errors.slice(0, 10).forEach((error, i) => {
        report += `${i + 1}. **[${error.type}]** ${error.message}\n`;
      });
      report += `\n`;
    }
    
    if (comparison?.benchmark) {
      report += `### Comparison vs Baseline\n`;
      report += `- **Current Load Time:** ${comparison.benchmark.current}\n`;
      report += `- **Baseline Load Time:** ${comparison.benchmark.baseline}\n`;
      report += `- **Change:** ${comparison.benchmark.change} ${comparison.benchmark.improvement ? '✅' : '❌'}\n\n`;
    }
  }
  
  // Performance Score
  const overallScore = calculatePerformanceScore(results.lighthouse, results.benchmark);
  report += `## 🏆 Overall Performance Score\n\n`;
  report += `**${overallScore.toFixed(1)}/100**\n\n`;
  
  if (overallScore >= 90) {
    report += `🟢 **Excellent** - Outstanding performance across all metrics.\n\n`;
  } else if (overallScore >= 75) {
    report += `🟡 **Good** - Good performance with room for optimization.\n\n`;
  } else if (overallScore >= 50) {
    report += `🟠 **Fair** - Moderate performance, optimization recommended.\n\n`;
  } else {
    report += `🔴 **Poor** - Significant performance issues need attention.\n\n`;
  }
  
  // Recommendations
  report += `## 💡 Recommendations\n\n`;
  
  if (results.lighthouse) {
    const perf = results.lighthouse.averagedMetrics.scores.performance;
    if (perf < 90) {
      report += `- **Improve Lighthouse Performance Score** (currently ${perf.toFixed(1)}/100)\n`;
      if (results.lighthouse.averagedMetrics.coreWebVitals.lcp.score < 0.9) {
        report += `  - Optimize Largest Contentful Paint\n`;
      }
      if (results.lighthouse.averagedMetrics.coreWebVitals.cls.score < 0.9) {
        report += `  - Reduce Cumulative Layout Shift\n`;
      }
    }
  }
  
  if (results.benchmark) {
    if (results.benchmark.averages.loadTime > 3000) {
      report += `- **Reduce Load Time** (currently ${results.benchmark.averages.loadTime.toFixed(2)}ms)\n`;
    }
    if (results.benchmark.averages.cssMetrics.cssParseTime > 50) {
      report += `- **Optimize CSS Parsing** (currently ${results.benchmark.averages.cssMetrics.cssParseTime.toFixed(2)}ms)\n`;
    }
    if (results.benchmark.errors.length > 0) {
      report += `- **Fix Runtime Errors** (${results.benchmark.errors.length} found)\n`;
    }
  }
  
  if (results.bundle) {
    const totalKB = parseFloat(results.bundle.totals.overall.gzipped.replace(/[^\d.]/g, ''));
    if (totalKB > 1000) {
      report += `- **Reduce Bundle Size** (currently ${results.bundle.totals.overall.gzipped})\n`;
    }
  }
  
  report += `\n---\n\n`;
  report += `*Report generated by Performance Analysis Suite*\n`;
  
  return report;
}

function saveAsBaseline(results) {
  const baselinePath = path.join(REPORTS_DIR, 'baseline-results.json');
  fs.writeFileSync(baselinePath, JSON.stringify(results, null, 2));
  console.log(`📊 Results saved as baseline: ${baselinePath}`);
}

async function main() {
  try {
    console.log('📊 Generating performance report...');
    
    const results = loadLatestResults();
    const baseline = loadComparisonData();
    const comparison = compareMetrics(results, baseline);
    
    if (!results.bundle && !results.lighthouse && !results.benchmark) {
      console.error('❌ No performance data found. Run the following commands first:');
      console.error('  npm run perf:bundle-size');
      console.error('  npm run perf:lighthouse');
      console.error('  npm run perf:benchmark');
      process.exit(1);
    }
    
    const report = generateMarkdownReport(results, comparison);
    
    // Save reports
    const timestamp = new Date().toISOString().split('T')[0];
    const reportPath = path.join(REPORTS_DIR, `performance-report-${timestamp}.md`);
    const latestPath = path.join(REPORTS_DIR, 'performance-report-latest.md');
    
    fs.writeFileSync(reportPath, report);
    fs.writeFileSync(latestPath, report);
    
    // Save current results for future comparison
    const resultsPath = path.join(REPORTS_DIR, `results-${timestamp}.json`);
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    
    console.log('✅ Performance report generated successfully!');
    console.log(`📄 Report saved to: ${reportPath}`);
    console.log(`📄 Latest report: ${latestPath}`);
    
    // Ask if user wants to set as baseline
    if (!baseline && process.argv.includes('--set-baseline')) {
      saveAsBaseline(results);
    } else if (!baseline) {
      console.log('\n💡 Tip: Run with --set-baseline to save these results as baseline for future comparisons');
    }
    
  } catch (error) {
    console.error('❌ Error generating performance report:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { loadLatestResults, compareMetrics, generateMarkdownReport };