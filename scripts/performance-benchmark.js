#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Performance Benchmark Script
 * Measures runtime performance, CSS parsing, and rendering metrics
 */

const RESULTS_DIR = path.join(process.cwd(), 'performance-results');
const DEFAULT_URL = 'http://localhost:3000';

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const PERFORMANCE_METRICS = [
  'firstPaint',
  'firstContentfulPaint',
  'firstMeaningfulPaint',
  'largestContentfulPaint',
  'firstInputDelay',
  'cumulativeLayoutShift',
  'totalBlockingTime',
];

async function measurePagePerformance(url, options = {}) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-plugins',
      '--disable-images=false',
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Enable performance monitoring
    await page.setCacheEnabled(false);
    
    console.log(`🚀 Loading ${url}...`);
    
    // Start performance tracking
    const performanceData = {
      url,
      timestamp: new Date().toISOString(),
      metrics: {},
      resources: [],
      cssMetrics: {},
      jsMetrics: {},
      memoryUsage: {},
      errors: [],
    };

    // Monitor console errors
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        performanceData.errors.push({
          type: 'console',
          message: msg.text(),
          timestamp: Date.now(),
        });
      }
    });

    // Monitor page errors
    page.on('pageerror', (error) => {
      performanceData.errors.push({
        type: 'page',
        message: error.message,
        timestamp: Date.now(),
      });
    });

    // Monitor resource loading
    const resourceMetrics = {};
    page.on('response', (response) => {
      const url = response.url();
      const status = response.status();
      const headers = response.headers();
      
      if (url.includes('.css') || url.includes('.js') || url.includes('fonts')) {
        resourceMetrics[url] = {
          status,
          size: headers['content-length'] ? parseInt(headers['content-length']) : 0,
          type: headers['content-type'] || 'unknown',
          timestamp: Date.now(),
        };
      }
    });

    // Navigate to page
    const startTime = Date.now();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    const loadTime = Date.now() - startTime;

    // Wait for additional rendering
    await page.waitForTimeout(2000);

    // Collect performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      
      const result = {
        navigation: {
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcpConnect: navigation.connectEnd - navigation.connectStart,
          request: navigation.responseStart - navigation.requestStart,
          response: navigation.responseEnd - navigation.responseStart,
          domProcessing: navigation.domComplete - navigation.domLoading,
        },
        paint: {},
        resources: performance.getEntriesByType('resource').map(entry => ({
          name: entry.name,
          duration: entry.duration,
          size: entry.transferSize || 0,
          type: entry.initiatorType,
        })),
      };

      // Paint metrics
      paint.forEach(entry => {
        result.paint[entry.name.replace('-', '')] = entry.startTime;
      });

      return result;
    });

    // Get CSS-specific metrics
    const cssMetrics = await page.evaluate(() => {
      const styleSheets = Array.from(document.styleSheets);
      const cssAnalysis = {
        totalStyleSheets: styleSheets.length,
        totalRules: 0,
        unusedRules: 0,
        cssParseTime: 0,
      };

      let parseTimeStart = performance.now();
      
      styleSheets.forEach(sheet => {
        try {
          if (sheet.cssRules) {
            cssAnalysis.totalRules += sheet.cssRules.length;
          }
        } catch (e) {
          // Cross-origin stylesheets may throw errors
        }
      });

      cssAnalysis.cssParseTime = performance.now() - parseTimeStart;

      return cssAnalysis;
    });

    // Get JavaScript metrics
    const jsMetrics = await page.evaluate(() => {
      const scripts = Array.from(document.scripts);
      return {
        totalScripts: scripts.length,
        inlineScripts: scripts.filter(s => !s.src).length,
        externalScripts: scripts.filter(s => s.src).length,
      };
    });

    // Get memory usage
    const memoryUsage = await page.evaluate(() => {
      if (performance.memory) {
        return {
          usedJSHeapSize: performance.memory.usedJSHeapSize,
          totalJSHeapSize: performance.memory.totalJSHeapSize,
          jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        };
      }
      return {};
    });

    // Test interactions (if specified)
    if (options.testInteractions) {
      console.log('🖱️  Testing page interactions...');
      
      // Test navigation between Links and Parties
      try {
        await page.click('button:has-text("PARTIES")');
        await page.waitForTimeout(1000);
        
        await page.click('button:has-text("LINKS")');
        await page.waitForTimeout(1000);
      } catch (e) {
        performanceData.errors.push({
          type: 'interaction',
          message: `Navigation test failed: ${e.message}`,
          timestamp: Date.now(),
        });
      }
    }

    // Core Web Vitals using PerformanceObserver
    const coreWebVitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {
          lcp: null,
          fid: null,
          cls: null,
        };

        let resolved = false;
        const resolveIfComplete = () => {
          if (!resolved && (vitals.lcp !== null || vitals.cls !== null)) {
            resolved = true;
            resolve(vitals);
          }
        };

        // LCP
        if ('PerformanceObserver' in window) {
          try {
            const lcpObserver = new PerformanceObserver((list) => {
              const entries = list.getEntries();
              const lastEntry = entries[entries.length - 1];
              vitals.lcp = lastEntry.startTime;
              resolveIfComplete();
            });
            lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
          } catch (e) {
            console.warn('LCP observation failed:', e);
          }

          // CLS
          try {
            const clsObserver = new PerformanceObserver((list) => {
              let cls = 0;
              for (const entry of list.getEntries()) {
                if (!entry.hadRecentInput) {
                  cls += entry.value;
                }
              }
              vitals.cls = cls;
              resolveIfComplete();
            });
            clsObserver.observe({ type: 'layout-shift', buffered: true });
          } catch (e) {
            console.warn('CLS observation failed:', e);
          }
        }

        // Fallback timeout
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            resolve(vitals);
          }
        }, 5000);
      });
    });

    // Compile all results
    performanceData.loadTime = loadTime;
    performanceData.metrics = metrics;
    performanceData.cssMetrics = cssMetrics;
    performanceData.jsMetrics = jsMetrics;
    performanceData.memoryUsage = memoryUsage;
    performanceData.coreWebVitals = coreWebVitals;
    performanceData.resources = Object.entries(resourceMetrics).map(([url, data]) => ({
      url,
      ...data
    }));

    return performanceData;

  } finally {
    await browser.close();
  }
}

async function runBenchmarkSuite(url, runs = 3) {
  const results = [];
  
  for (let i = 0; i < runs; i++) {
    console.log(`📊 Running benchmark ${i + 1}/${runs}...`);
    
    const result = await measurePagePerformance(url, {
      testInteractions: i === 0, // Only test interactions on first run
    });
    
    results.push(result);
    
    // Wait between runs
    if (i < runs - 1) {
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  return results;
}

function calculateAverages(results) {
  const averaged = {
    timestamp: new Date().toISOString(),
    runs: results.length,
    url: results[0].url,
    averages: {
      loadTime: 0,
      navigation: {},
      paint: {},
      cssMetrics: {},
      jsMetrics: {},
      memoryUsage: {},
      coreWebVitals: {},
    },
    errors: results.flatMap(r => r.errors),
  };

  // Average load times
  averaged.averages.loadTime = results.reduce((sum, r) => sum + r.loadTime, 0) / results.length;

  // Average navigation metrics
  const navigationKeys = Object.keys(results[0].metrics.navigation);
  navigationKeys.forEach(key => {
    averaged.averages.navigation[key] = 
      results.reduce((sum, r) => sum + r.metrics.navigation[key], 0) / results.length;
  });

  // Average paint metrics
  const paintKeys = Object.keys(results[0].metrics.paint);
  paintKeys.forEach(key => {
    averaged.averages.paint[key] = 
      results.reduce((sum, r) => sum + (r.metrics.paint[key] || 0), 0) / results.length;
  });

  // Average CSS metrics
  const cssKeys = Object.keys(results[0].cssMetrics);
  cssKeys.forEach(key => {
    averaged.averages.cssMetrics[key] = 
      results.reduce((sum, r) => sum + (r.cssMetrics[key] || 0), 0) / results.length;
  });

  // Average JS metrics
  const jsKeys = Object.keys(results[0].jsMetrics);
  jsKeys.forEach(key => {
    averaged.averages.jsMetrics[key] = 
      results.reduce((sum, r) => sum + (r.jsMetrics[key] || 0), 0) / results.length;
  });

  // Average memory usage
  const memoryKeys = Object.keys(results[0].memoryUsage);
  memoryKeys.forEach(key => {
    averaged.averages.memoryUsage[key] = 
      results.reduce((sum, r) => sum + (r.memoryUsage[key] || 0), 0) / results.length;
  });

  // Average Core Web Vitals
  const coreWebVitalKeys = Object.keys(results[0].coreWebVitals);
  coreWebVitalKeys.forEach(key => {
    averaged.averages.coreWebVitals[key] = 
      results.reduce((sum, r) => sum + (r.coreWebVitals[key] || 0), 0) / results.length;
  });

  return averaged;
}

async function generateReport(results, averaged) {
  const timestamp = Date.now();
  
  // Save detailed results
  const detailedPath = path.join(RESULTS_DIR, `benchmark-detailed-${timestamp}.json`);
  fs.writeFileSync(detailedPath, JSON.stringify(results, null, 2));
  
  // Save averaged results
  const summaryPath = path.join(RESULTS_DIR, `benchmark-summary-${timestamp}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(averaged, null, 2));
  
  // Save latest for comparison
  const latestPath = path.join(RESULTS_DIR, 'benchmark-latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(averaged, null, 2));
  
  return { detailedPath, summaryPath, averaged };
}

function printResults(averaged) {
  console.log('\n⚡ Performance Benchmark Results');
  console.log('===============================');
  
  console.log(`\n🚀 Loading Performance:`);
  console.log(`  Total Load Time: ${averaged.averages.loadTime.toFixed(2)}ms`);
  console.log(`  DOM Content Loaded: ${averaged.averages.navigation.domContentLoaded.toFixed(2)}ms`);
  console.log(`  Load Complete: ${averaged.averages.navigation.loadComplete.toFixed(2)}ms`);
  
  console.log(`\n🎨 Paint Metrics:`);
  if (averaged.averages.paint.firstpaint) {
    console.log(`  First Paint: ${averaged.averages.paint.firstpaint.toFixed(2)}ms`);
  }
  if (averaged.averages.paint.firstcontentfulpaint) {
    console.log(`  First Contentful Paint: ${averaged.averages.paint.firstcontentfulpaint.toFixed(2)}ms`);
  }
  
  console.log(`\n💾 Memory Usage:`);
  if (averaged.averages.memoryUsage.usedJSHeapSize) {
    console.log(`  Used JS Heap: ${(averaged.averages.memoryUsage.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Total JS Heap: ${(averaged.averages.memoryUsage.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
  }
  
  console.log(`\n🎯 Core Web Vitals:`);
  if (averaged.averages.coreWebVitals.lcp) {
    console.log(`  LCP: ${averaged.averages.coreWebVitals.lcp.toFixed(2)}ms`);
  }
  if (averaged.averages.coreWebVitals.cls) {
    console.log(`  CLS: ${averaged.averages.coreWebVitals.cls.toFixed(4)}`);
  }
  
  console.log(`\n📊 CSS Analysis:`);
  console.log(`  Stylesheets: ${averaged.averages.cssMetrics.totalStyleSheets.toFixed(0)}`);
  console.log(`  CSS Rules: ${averaged.averages.cssMetrics.totalRules.toFixed(0)}`);
  console.log(`  Parse Time: ${averaged.averages.cssMetrics.cssParseTime.toFixed(2)}ms`);
  
  if (averaged.errors.length > 0) {
    console.log(`\n❌ Errors Found: ${averaged.errors.length}`);
    averaged.errors.slice(0, 5).forEach((error, i) => {
      console.log(`  ${i + 1}. [${error.type}] ${error.message}`);
    });
  }
}

async function main() {
  const url = process.argv[2] || DEFAULT_URL;
  const runs = parseInt(process.argv[3]) || 3;
  
  try {
    console.log(`🔍 Starting performance benchmark for ${url} (${runs} runs)`);
    
    const results = await runBenchmarkSuite(url, runs);
    const averaged = calculateAverages(results);
    const { detailedPath, summaryPath } = await generateReport(results, averaged);
    
    printResults(averaged);
    
    console.log(`\n📄 Detailed report: ${detailedPath}`);
    console.log(`📋 Summary report: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Error during performance benchmark:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { measurePagePerformance, runBenchmarkSuite, calculateAverages };