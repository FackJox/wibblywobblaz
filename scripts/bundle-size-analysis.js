#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { gzipSize } = require('gzip-size');

/**
 * Bundle Size Analysis Script
 * Analyzes bundle sizes for TailwindCSS vs PandaCSS comparison
 */

const BUILD_DIR = path.join(process.cwd(), '.next');
const RESULTS_DIR = path.join(process.cwd(), 'performance-results');

// Ensure results directory exists
if (!fs.existsSync(RESULTS_DIR)) {
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

async function analyzeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const content = fs.readFileSync(filePath);
  const originalSize = content.length;
  const gzippedSize = await gzipSize(content);

  return {
    path: filePath,
    originalSize,
    gzippedSize,
    originalFormatted: formatBytes(originalSize),
    gzippedFormatted: formatBytes(gzippedSize),
  };
}

async function analyzeBundleStructure() {
  const staticDir = path.join(BUILD_DIR, 'static');
  const results = {
    timestamp: new Date().toISOString(),
    css: {
      files: [],
      totalOriginal: 0,
      totalGzipped: 0,
    },
    javascript: {
      files: [],
      totalOriginal: 0,
      totalGzipped: 0,
    },
    chunks: {
      files: [],
      totalOriginal: 0,
      totalGzipped: 0,
    }
  };

  if (!fs.existsSync(staticDir)) {
    console.error('Build directory not found. Please run "npm run build" first.');
    process.exit(1);
  }

  // Find all CSS files
  const cssFiles = [];
  const jsFiles = [];
  
  function walkDir(dir, category) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath, category);
      } else {
        if (file.endsWith('.css')) {
          cssFiles.push(filePath);
        } else if (file.endsWith('.js')) {
          jsFiles.push(filePath);
        }
      }
    }
  }

  walkDir(staticDir, 'static');

  // Analyze CSS files
  console.log('📊 Analyzing CSS files...');
  for (const file of cssFiles) {
    const analysis = await analyzeFile(file);
    if (analysis) {
      results.css.files.push({
        name: path.relative(BUILD_DIR, file),
        ...analysis
      });
      results.css.totalOriginal += analysis.originalSize;
      results.css.totalGzipped += analysis.gzippedSize;
    }
  }

  // Analyze JavaScript files
  console.log('📊 Analyzing JavaScript files...');
  for (const file of jsFiles) {
    const analysis = await analyzeFile(file);
    if (analysis) {
      const category = file.includes('chunks') ? 'chunks' : 'javascript';
      results[category].files.push({
        name: path.relative(BUILD_DIR, file),
        ...analysis
      });
      results[category].totalOriginal += analysis.originalSize;
      results[category].totalGzipped += analysis.gzippedSize;
    }
  }

  return results;
}

async function generateReport(results) {
  const reportPath = path.join(RESULTS_DIR, `bundle-analysis-${Date.now()}.json`);
  
  // Save detailed JSON report
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));

  // Generate summary report
  const summary = {
    timestamp: results.timestamp,
    totals: {
      css: {
        original: formatBytes(results.css.totalOriginal),
        gzipped: formatBytes(results.css.totalGzipped),
        fileCount: results.css.files.length
      },
      javascript: {
        original: formatBytes(results.javascript.totalOriginal),
        gzipped: formatBytes(results.javascript.totalGzipped),
        fileCount: results.javascript.files.length
      },
      chunks: {
        original: formatBytes(results.chunks.totalOriginal),
        gzipped: formatBytes(results.chunks.totalGzipped),
        fileCount: results.chunks.files.length
      },
      overall: {
        original: formatBytes(
          results.css.totalOriginal + 
          results.javascript.totalOriginal + 
          results.chunks.totalOriginal
        ),
        gzipped: formatBytes(
          results.css.totalGzipped + 
          results.javascript.totalGzipped + 
          results.chunks.totalGzipped
        ),
        fileCount: results.css.files.length + results.javascript.files.length + results.chunks.files.length
      }
    }
  };

  const summaryPath = path.join(RESULTS_DIR, 'bundle-summary-latest.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

  return { reportPath, summaryPath, summary };
}

function printResults(summary) {
  console.log('\n📦 Bundle Size Analysis Results');
  console.log('================================');
  console.log(`Timestamp: ${summary.timestamp}`);
  console.log('');
  
  console.log('CSS Bundles:');
  console.log(`  Files: ${summary.totals.css.fileCount}`);
  console.log(`  Original: ${summary.totals.css.original}`);
  console.log(`  Gzipped: ${summary.totals.css.gzipped}`);
  console.log('');
  
  console.log('JavaScript Bundles:');
  console.log(`  Files: ${summary.totals.javascript.fileCount}`);
  console.log(`  Original: ${summary.totals.javascript.original}`);
  console.log(`  Gzipped: ${summary.totals.javascript.gzipped}`);
  console.log('');
  
  console.log('Code Split Chunks:');
  console.log(`  Files: ${summary.totals.chunks.fileCount}`);
  console.log(`  Original: ${summary.totals.chunks.original}`);
  console.log(`  Gzipped: ${summary.totals.chunks.gzipped}`);
  console.log('');
  
  console.log('Overall Totals:');
  console.log(`  Files: ${summary.totals.overall.fileCount}`);
  console.log(`  Original: ${summary.totals.overall.original}`);
  console.log(`  Gzipped: ${summary.totals.overall.gzipped}`);
  console.log('');
}

async function main() {
  try {
    console.log('🔍 Starting bundle size analysis...');
    
    const results = await analyzeBundleStructure();
    const { reportPath, summaryPath, summary } = await generateReport(results);
    
    printResults(summary);
    
    console.log(`📄 Detailed report saved: ${reportPath}`);
    console.log(`📋 Summary report saved: ${summaryPath}`);
    
  } catch (error) {
    console.error('❌ Error during bundle analysis:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { analyzeBundleStructure, generateReport };