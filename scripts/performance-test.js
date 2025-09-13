#!/usr/bin/env node

/**
 * Performance Testing Script
 * Runs Lighthouse performance audits and generates reports
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

const REPORT_DIR = 'reports'
const DEFAULT_URL = 'http://localhost:3000'
const TARGET_SCORES = {
  performance: 90,
  accessibility: 95,
  bestPractices: 90,
  seo: 90
}

// Ensure reports directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true })
}

// Configuration for different test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Desktop',
    config: {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      }
    }
  },
  {
    name: 'Mobile',
    config: {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'mobile',
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      }
    }
  },
  {
    name: 'Slow3G',
    config: {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'mobile',
        throttling: {
          rttMs: 300,
          throughputKbps: 700,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      }
    }
  }
]

// Check if server is running
async function checkServer(url) {
  try {
    const response = await fetch(url)
    return response.ok
  } catch (error) {
    return false
  }
}

// Run Lighthouse audit
async function runLighthouseAudit(url, config, scenarioName) {
  console.log(`🔍 Running Lighthouse audit for ${scenarioName}...`)
  
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  }

  try {
    const runnerResult = await lighthouse(url, options, config)
    await chrome.kill()
    
    return {
      scenario: scenarioName,
      lhr: runnerResult.lhr,
      scores: {
        performance: Math.round(runnerResult.lhr.categories.performance.score * 100),
        accessibility: Math.round(runnerResult.lhr.categories.accessibility.score * 100),
        bestPractices: Math.round(runnerResult.lhr.categories['best-practices'].score * 100),
        seo: Math.round(runnerResult.lhr.categories.seo.score * 100),
      },
      metrics: {
        firstContentfulPaint: runnerResult.lhr.audits['first-contentful-paint'].numericValue,
        largestContentfulPaint: runnerResult.lhr.audits['largest-contentful-paint'].numericValue,
        cumulativeLayoutShift: runnerResult.lhr.audits['cumulative-layout-shift'].numericValue,
        totalBlockingTime: runnerResult.lhr.audits['total-blocking-time'].numericValue,
        speedIndex: runnerResult.lhr.audits['speed-index'].numericValue,
      }
    }
  } catch (error) {
    await chrome.kill()
    throw error
  }
}

// Generate performance report
function generatePerformanceReport(results) {
  const timestamp = new Date().toISOString()
  const report = {
    timestamp,
    url: DEFAULT_URL,
    scenarios: results,
    summary: {
      passedTargets: 0,
      totalTargets: Object.keys(TARGET_SCORES).length * results.length,
      recommendations: [],
      criticalIssues: []
    }
  }

  // Analyze results and generate recommendations
  results.forEach(result => {
    const { scenario, scores, metrics } = result
    
    // Check against targets
    Object.entries(TARGET_SCORES).forEach(([category, target]) => {
      if (scores[category] >= target) {
        report.summary.passedTargets++
      } else {
        report.summary.criticalIssues.push(
          `${scenario} ${category}: ${scores[category]} (target: ${target})`
        )
      }
    })

    // Performance-specific recommendations
    if (metrics.largestContentfulPaint > 2500) {
      report.summary.recommendations.push(`${scenario}: Optimize LCP (${Math.round(metrics.largestContentfulPaint)}ms)`)
    }
    
    if (metrics.cumulativeLayoutShift > 0.1) {
      report.summary.recommendations.push(`${scenario}: Reduce CLS (${metrics.cumulativeLayoutShift.toFixed(3)})`)
    }
    
    if (metrics.totalBlockingTime > 300) {
      report.summary.recommendations.push(`${scenario}: Reduce TBT (${Math.round(metrics.totalBlockingTime)}ms)`)
    }
    
    if (metrics.firstContentfulPaint > 1800) {
      report.summary.recommendations.push(`${scenario}: Optimize FCP (${Math.round(metrics.firstContentfulPaint)}ms)`)
    }
  })

  // Overall recommendations
  if (report.summary.passedTargets < report.summary.totalTargets * 0.8) {
    report.summary.recommendations.push('Consider implementing code splitting and lazy loading')
    report.summary.recommendations.push('Optimize images and use next/image component')
    report.summary.recommendations.push('Review and minimize JavaScript bundle size')
  }

  return report
}

// Print console report
function printPerformanceReport(report) {
  console.log('\n🚀 Performance Test Report')
  console.log('==========================')
  console.log(`📅 Generated: ${report.timestamp}`)
  console.log(`🌐 URL: ${report.url}`)
  console.log(`✅ Targets Met: ${report.summary.passedTargets}/${report.summary.totalTargets}`)

  // Score summary
  console.log('\n📊 Lighthouse Scores:')
  report.scenarios.forEach(result => {
    const { scenario, scores } = result
    console.log(`\n   ${scenario}:`)
    Object.entries(scores).forEach(([category, score]) => {
      const target = TARGET_SCORES[category]
      const status = score >= target ? '✅' : '❌'
      console.log(`   ${status} ${category}: ${score}/100 (target: ${target})`)
    })
  })

  // Core Web Vitals
  console.log('\n⚡ Core Web Vitals:')
  report.scenarios.forEach(result => {
    const { scenario, metrics } = result
    console.log(`\n   ${scenario}:`)
    console.log(`   🎨 LCP: ${Math.round(metrics.largestContentfulPaint)}ms`)
    console.log(`   📐 CLS: ${metrics.cumulativeLayoutShift.toFixed(3)}`)
    console.log(`   ⏱️  TBT: ${Math.round(metrics.totalBlockingTime)}ms`)
    console.log(`   🚀 FCP: ${Math.round(metrics.firstContentfulPaint)}ms`)
    console.log(`   📈 SI: ${Math.round(metrics.speedIndex)}`)
  })

  if (report.summary.criticalIssues.length > 0) {
    console.log('\n❌ Critical Issues:')
    report.summary.criticalIssues.forEach(issue => console.log(`   • ${issue}`))
  }

  if (report.summary.recommendations.length > 0) {
    console.log('\n💡 Recommendations:')
    [...new Set(report.summary.recommendations)].forEach(rec => console.log(`   • ${rec}`))
  }

  console.log('\n==========================')
  
  // Exit with error if critical issues in CI
  if (report.summary.criticalIssues.length > 0 && process.env.CI) {
    console.error('❌ Performance tests failed in CI environment')
    process.exit(1)
  }
}

// Save detailed report
function saveDetailedReport(report) {
  const reportPath = path.join(REPORT_DIR, `performance-${Date.now()}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`📋 Detailed report saved: ${reportPath}`)
}

// Main execution
async function main() {
  const url = process.argv[2] || DEFAULT_URL
  
  console.log('🔧 Starting performance testing...')
  
  // Check if server is running
  console.log(`🌐 Checking server at ${url}...`)
  const serverRunning = await checkServer(url)
  
  if (!serverRunning) {
    console.error(`❌ Server not responding at ${url}`)
    console.log('💡 Make sure to run "npm run dev" or "npm run start" first')
    process.exit(1)
  }
  
  console.log('✅ Server is running')

  try {
    const results = []
    
    // Run tests for each scenario
    for (const scenario of TEST_SCENARIOS) {
      const result = await runLighthouseAudit(url, scenario.config, scenario.name)
      results.push(result)
    }
    
    const report = generatePerformanceReport(results)
    printPerformanceReport(report)
    saveDetailedReport(report)
    
    console.log('\n🎉 Performance testing complete!')
    
  } catch (error) {
    console.error('❌ Error during performance testing:', error.message)
    process.exit(1)
  }
}

main().catch(error => {
  console.error('❌ Unexpected error:', error)
  process.exit(1)
})