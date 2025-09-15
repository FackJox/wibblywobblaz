#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes Next.js bundle size and generates performance reports
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const GZIP_THRESHOLD = 30 * 1024 // 30KB target
const WARNING_THRESHOLD = 25 * 1024 // 25KB warning
const BUILD_DIR = '.next'
const REPORT_DIR = 'reports'

// Ensure reports directory exists
if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true })
}

// Helper function to get file size in bytes
function getFileSize(filePath) {
  try {
    return fs.statSync(filePath).size
  } catch (error) {
    console.warn(`Warning: Could not get size for ${filePath}`)
    return 0
  }
}

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Get gzipped size using system gzip
function getGzippedSize(filePath) {
  try {
    const gzipCommand = `gzip -c "${filePath}" | wc -c`
    const size = parseInt(execSync(gzipCommand, { encoding: 'utf8' }).trim())
    return size
  } catch (error) {
    console.warn(`Warning: Could not get gzipped size for ${filePath}`)
    return 0
  }
}

// Analyze bundle files
function analyzeBundleSize() {
  console.log('🔍 Analyzing bundle size...')
  
  const staticDir = path.join(BUILD_DIR, 'static')
  
  if (!fs.existsSync(staticDir)) {
    console.error('❌ Build directory not found. Please run "npm run build" first.')
    process.exit(1)
  }

  const analysis = {
    timestamp: new Date().toISOString(),
    chunks: [],
    css: [],
    totalSize: 0,
    totalGzipped: 0,
    exceedsThreshold: false,
    warnings: []
  }

  // Analyze JavaScript chunks
  const chunksDir = path.join(staticDir, 'chunks')
  if (fs.existsSync(chunksDir)) {
    const chunkFiles = fs.readdirSync(chunksDir).filter(file => file.endsWith('.js'))
    
    for (const file of chunkFiles) {
      const filePath = path.join(chunksDir, file)
      const size = getFileSize(filePath)
      const gzippedSize = getGzippedSize(filePath)
      
      analysis.chunks.push({
        name: file,
        size,
        gzippedSize,
        formatted: {
          size: formatBytes(size),
          gzippedSize: formatBytes(gzippedSize)
        }
      })
      
      analysis.totalSize += size
      analysis.totalGzipped += gzippedSize
      
      // Check thresholds
      if (gzippedSize > GZIP_THRESHOLD) {
        analysis.exceedsThreshold = true
        analysis.warnings.push(`⚠️  Chunk ${file} exceeds 30KB gzipped (${formatBytes(gzippedSize)})`)
      } else if (gzippedSize > WARNING_THRESHOLD) {
        analysis.warnings.push(`⚡ Chunk ${file} approaching size limit (${formatBytes(gzippedSize)})`)
      }
    }
  }

  // Analyze CSS files
  const cssDir = path.join(staticDir, 'css')
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'))
    
    for (const file of cssFiles) {
      const filePath = path.join(cssDir, file)
      const size = getFileSize(filePath)
      const gzippedSize = getGzippedSize(filePath)
      
      analysis.css.push({
        name: file,
        size,
        gzippedSize,
        formatted: {
          size: formatBytes(size),
          gzippedSize: formatBytes(gzippedSize)
        }
      })
      
      analysis.totalSize += size
      analysis.totalGzipped += gzippedSize
    }
  }

  // Sort chunks by gzipped size (largest first)
  analysis.chunks.sort((a, b) => b.gzippedSize - a.gzippedSize)
  analysis.css.sort((a, b) => b.gzippedSize - a.gzippedSize)

  return analysis
}

// Generate performance report
function generateReport(analysis) {
  const report = {
    ...analysis,
    performance: {
      meetsTarget: !analysis.exceedsThreshold,
      totalFormatted: {
        size: formatBytes(analysis.totalSize),
        gzippedSize: formatBytes(analysis.totalGzipped)
      },
      recommendations: []
    }
  }

  // Generate recommendations
  if (analysis.exceedsThreshold) {
    report.performance.recommendations.push('Consider code splitting for large chunks')
    report.performance.recommendations.push('Review and remove unused dependencies')
    report.performance.recommendations.push('Implement lazy loading for non-critical components')
  }

  if (analysis.chunks.length > 10) {
    report.performance.recommendations.push('Consider merging small chunks to reduce HTTP requests')
  }

  const largeChunks = analysis.chunks.filter(chunk => chunk.gzippedSize > WARNING_THRESHOLD)
  if (largeChunks.length > 3) {
    report.performance.recommendations.push('Too many large chunks - review bundle splitting strategy')
  }

  return report
}

// Print console report
function printConsoleReport(report) {
  console.log('\n📊 Bundle Analysis Report')
  console.log('========================')
  console.log(`📅 Generated: ${report.timestamp}`)
  console.log(`📦 Total Size: ${report.performance.totalFormatted.size}`)
  console.log(`🗜️  Total Gzipped: ${report.performance.totalFormatted.gzippedSize}`)
  console.log(`🎯 Target: ${formatBytes(GZIP_THRESHOLD)} gzipped`)
  console.log(`✅ Meets Target: ${report.performance.meetsTarget ? 'Yes' : 'No'}`)

  if (report.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    report.warnings.forEach(warning => console.log(`   ${warning}`))
  }

  console.log('\n📁 JavaScript Chunks:')
  report.chunks.slice(0, 10).forEach(chunk => {
    const indicator = chunk.gzippedSize > GZIP_THRESHOLD ? '🔴' :
                     chunk.gzippedSize > WARNING_THRESHOLD ? '🟡' : '🟢'
    console.log(`   ${indicator} ${chunk.name}: ${chunk.formatted.gzippedSize} gzipped`)
  })

  if (report.css.length > 0) {
    console.log('\n🎨 CSS Files:')
    report.css.forEach(css => {
      console.log(`   📄 ${css.name}: ${css.formatted.gzippedSize} gzipped`)
    })
  }

  if (report.performance.recommendations.length > 0) {
    console.log('\n💡 Recommendations:')
    report.performance.recommendations.forEach(rec => console.log(`   • ${rec}`))
  }

  console.log('\n========================')
  
  // Exit with error if exceeds threshold for CI/CD
  if (report.exceedsThreshold && process.env.CI) {
    console.error('❌ Bundle size exceeds threshold in CI environment')
    process.exit(1)
  }
}

// Save JSON report
function saveJsonReport(report) {
  const reportPath = path.join(REPORT_DIR, `bundle-analysis-${Date.now()}.json`)
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`📋 Detailed report saved: ${reportPath}`)
}

// Main execution
try {
  const analysis = analyzeBundleSize()
  const report = generateReport(analysis)
  
  printConsoleReport(report)
  saveJsonReport(report)
  
  console.log('\n🎉 Bundle analysis complete!')
  
} catch (error) {
  console.error('❌ Error during bundle analysis:', error.message)
  process.exit(1)
}