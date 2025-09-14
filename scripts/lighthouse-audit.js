#!/usr/bin/env node
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

/**
 * Lighthouse Performance Audit Script
 * Runs comprehensive performance audits using Lighthouse
 */

const RESULTS_DIR = path.join(process.cwd(), 'performance-results');
const DEFAULT_URL = 'http://localhost:3000';

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

const LIGHTHOUSE_CONFIG = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'interactive',
      'cumulative-layout-shift',
      'total-blocking-time',
      'max-potential-fid',
      'render-blocking-resources',
      'unused-css-rules',
      'unminified-css',
      'unminified-javascript',
      'modern-image-formats',
      'uses-optimized-images',
      'uses-webp-images',
      'uses-responsive-images',
      'efficient-animated-content',
      'preload-lcp-image',
      'uses-rel-preconnect',
      'uses-rel-preload',
      'font-display',
      'resource-summary',
      'third-party-summary',
    ],
  },
};

const CHROME_FLAGS = [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-extensions',
  '--disable-plugins',
  '--disable-images=false',
  '--run-all-compositor-stages-before-draw',
  '--disable-background-timer-throttling',
  '--disable-renderer-backgrounding',
  '--disable-backgrounding-occluded-windows',
  '--disable-ipc-flooding-protection',
];

function extractMetrics(lhr) {
  const audits = lhr.audits;
  
  return {
    // Core Web Vitals
    coreWebVitals: {
      lcp: {
        value: audits['largest-contentful-paint']?.numericValue || 0,
        score: audits['largest-contentful-paint']?.score || 0,
        displayValue: audits['largest-contentful-paint']?.displayValue || 'N/A',
      },
      fid: {
        value: audits['max-potential-fid']?.numericValue || 0,
        score: audits['max-potential-fid']?.score || 0,
        displayValue: audits['max-potential-fid']?.displayValue || 'N/A',
      },
      cls: {
        value: audits['cumulative-layout-shift']?.numericValue || 0,
        score: audits['cumulative-layout-shift']?.score || 0,
        displayValue: audits['cumulative-layout-shift']?.displayValue || 'N/A',
      },
    },
    
    // Performance Metrics
    performance: {
      fcp: {
        value: audits['first-contentful-paint']?.numericValue || 0,
        score: audits['first-contentful-paint']?.score || 0,
        displayValue: audits['first-contentful-paint']?.displayValue || 'N/A',
      },
      fmp: {
        value: audits['first-meaningful-paint']?.numericValue || 0,
        score: audits['first-meaningful-paint']?.score || 0,
        displayValue: audits['first-meaningful-paint']?.displayValue || 'N/A',
      },
      si: {
        value: audits['speed-index']?.numericValue || 0,
        score: audits['speed-index']?.score || 0,
        displayValue: audits['speed-index']?.displayValue || 'N/A',
      },
      tti: {
        value: audits['interactive']?.numericValue || 0,
        score: audits['interactive']?.score || 0,
        displayValue: audits['interactive']?.displayValue || 'N/A',
      },
      tbt: {
        value: audits['total-blocking-time']?.numericValue || 0,
        score: audits['total-blocking-time']?.score || 0,
        displayValue: audits['total-blocking-time']?.displayValue || 'N/A',
      },
    },
    
    // Resource Optimization
    resources: {
      renderBlockingResources: audits['render-blocking-resources']?.details?.items || [],
      unusedCSS: audits['unused-css-rules']?.details?.items || [],
      unminifiedCSS: audits['unminified-css']?.details?.items || [],
      unminifiedJS: audits['unminified-javascript']?.details?.items || [],
    },
    
    // Overall Scores
    scores: {
      performance: lhr.categories.performance?.score * 100 || 0,
      accessibility: lhr.categories.accessibility?.score * 100 || 0,
      bestPractices: lhr.categories['best-practices']?.score * 100 || 0,
      seo: lhr.categories.seo?.score * 100 || 0,
    },
  };
}

async function runLighthouseAudit(url, options = {}) {
  let chrome;
  
  try {
    // Launch Chrome
    chrome = await chromeLauncher.launch({
      chromeFlags: CHROME_FLAGS,
      logLevel: 'error',
    });

    console.log(`🚀 Running Lighthouse audit on ${url}`);

    // Run Lighthouse audit
    const runnerResult = await lighthouse(url, {
      port: chrome.port,
      disableStorageReset: false,
      ...options,
    }, LIGHTHOUSE_CONFIG);

    const metrics = extractMetrics(runnerResult.lhr);
    
    return {
      url,
      timestamp: new Date().toISOString(),
      metrics,
      rawReport: runnerResult.lhr,
    };

  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

async function runMultipleAudits(url, runs = 3) {
  const results = [];
  
  for (let i = 0; i < runs; i++) {
    console.log(`📊 Running audit ${i + 1}/${runs}...`);
    const result = await runLighthouseAudit(url);
    results.push(result);
    
    // Wait between runs to avoid throttling
    if (i < runs - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  return results;
}

function calculateAverages(results) {
  const metrics = results[0].metrics;
  const averaged = JSON.parse(JSON.stringify(metrics));
  
  // Average Core Web Vitals
  Object.keys(averaged.coreWebVitals).forEach(key => {
    averaged.coreWebVitals[key].value = 
      results.reduce((sum, r) => sum + r.metrics.coreWebVitals[key].value, 0) / results.length;
    averaged.coreWebVitals[key].score = 
      results.reduce((sum, r) => sum + r.metrics.coreWebVitals[key].score, 0) / results.length;
  });
  
  // Average Performance Metrics
  Object.keys(averaged.performance).forEach(key => {
    averaged.performance[key].value = 
      results.reduce((sum, r) => sum + r.metrics.performance[key].value, 0) / results.length;
    averaged.performance[key].score = 
      results.reduce((sum, r) => sum + r.metrics.performance[key].score, 0) / results.length;
  });
  
  // Average Scores
  Object.keys(averaged.scores).forEach(key => {
    averaged.scores[key] = 
      results.reduce((sum, r) => sum + r.metrics.scores[key], 0) / results.length;
  });
  
  return averaged;
}

async function generateReport(results, averaged) {
  const timestamp = Date.now();
  
  // Save detailed results
  const detailedPath = path.join(RESULTS_DIR, `lighthouse-detailed-${timestamp}.json`);
  fs.writeFileSync(detailedPath, JSON.stringify(results, null, 2));
  
  // Save averaged results
  const summaryReport = {
    timestamp: new Date().toISOString(),
    url: results[0].url,
    runs: results.length,
    averagedMetrics: averaged,
    individual: results.map(r => ({
      timestamp: r.timestamp,
      scores: r.metrics.scores,
      coreWebVitals: r.metrics.coreWebVitals,
    })),
  };
  
  const summaryPath = path.join(RESULTS_DIR, `lighthouse-summary-${timestamp}.json`);
  fs.writeFileSync(summaryPath, JSON.stringify(summaryReport, null, 2));
  
  // Save latest for comparison
  const latestPath = path.join(RESULTS_DIR, 'lighthouse-latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(summaryReport, null, 2));
  
  return { detailedPath, summaryPath, summaryReport };
}

function printResults(averaged) {
  console.log('\n🎯 Lighthouse Performance Results');
  console.log('=================================');
  
  console.log('\n📊 Overall Scores:');
  console.log(`  Performance: ${averaged.scores.performance.toFixed(1)}/100`);
  console.log(`  Accessibility: ${averaged.scores.accessibility.toFixed(1)}/100`);
  console.log(`  Best Practices: ${averaged.scores.bestPractices.toFixed(1)}/100`);
  console.log(`  SEO: ${averaged.scores.seo.toFixed(1)}/100`);
  
  console.log('\n🎯 Core Web Vitals:');
  console.log(`  LCP: ${averaged.coreWebVitals.lcp.displayValue} (Score: ${(averaged.coreWebVitals.lcp.score * 100).toFixed(1)})`);
  console.log(`  FID: ${averaged.coreWebVitals.fid.displayValue} (Score: ${(averaged.coreWebVitals.fid.score * 100).toFixed(1)})`);
  console.log(`  CLS: ${averaged.coreWebVitals.cls.displayValue} (Score: ${(averaged.coreWebVitals.cls.score * 100).toFixed(1)})`);
  
  console.log('\n⚡ Performance Metrics:');
  console.log(`  FCP: ${averaged.performance.fcp.displayValue}`);
  console.log(`  FMP: ${averaged.performance.fmp.displayValue}`);
  console.log(`  Speed Index: ${averaged.performance.si.displayValue}`);
  console.log(`  TTI: ${averaged.performance.tti.displayValue}`);
  console.log(`  TBT: ${averaged.performance.tbt.displayValue}`);
}

async function main() {
  const url = process.argv[2] || DEFAULT_URL;
  const runs = parseInt(process.argv[3]) || 3;
  
  try {
    console.log(`🔍 Starting Lighthouse audit for ${url} (${runs} runs)`);
    
    const results = await runMultipleAudits(url, runs);
    const averaged = calculateAverages(results);
    const { detailedPath, summaryPath, summaryReport } = await generateReport(results, averaged);
    
    printResults(averaged);
    
    console.log(`\n📄 Detailed report: ${detailedPath}`);
    console.log(`📋 Summary report: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Error during Lighthouse audit:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { runLighthouseAudit, runMultipleAudits, calculateAverages };