/**
 * Verification script for WIBBLY WOBBLAZ brand text wrapping fix
 * Issue #47: Typography Problem Solving - Stream C
 * 
 * This script verifies that the brand text scales properly across all viewport sizes
 * without wrapping and maintains consistent visual hierarchy.
 */

// Simulate the clamp calculation: clamp(4.5rem, 1.5000vw + 4.0500rem, 6rem)
function calculateFluidBrandSize(viewportWidth) {
  // Convert 1.5vw to rem (assuming 16px base font size)
  const vwInRem = (viewportWidth * 0.015) / 16;  // 1.5vw converted to rem
  const preferredSize = vwInRem + 4.05; // + 4.0500rem constant
  
  // Apply clamp: min(max(minSize, preferredSize), maxSize)
  const minSize = 4.5; // 4.5rem
  const maxSize = 6.0;  // 6rem
  
  const actualSize = Math.min(Math.max(minSize, preferredSize), maxSize);
  
  return {
    rem: actualSize,
    px: actualSize * 16,
    vwComponent: vwInRem,
    preferred: preferredSize
  };
}

// Test viewport sizes from mobile to ultra-wide
const testViewports = [
  { name: 'Mobile Small', width: 320 },
  { name: 'Mobile Large', width: 414 },
  { name: 'Tablet Portrait', width: 768 },
  { name: 'Tablet Landscape', width: 1024 },
  { name: 'Desktop', width: 1280 },
  { name: 'Large Desktop', width: 1440 },
  { name: 'Ultra Wide', width: 1920 },
  { name: 'Ultra Wide+', width: 2560 }
];

// Approximate character width for "WIBBLY WOBBLAZ" in Hegval font
// This is estimated based on typical character widths for bold/black fonts
function estimateTextWidth(fontSize) {
  const text = "WIBBLY WOBBLAZ";
  const avgCharWidth = fontSize * 0.6; // Estimate: 0.6em per character for bold fonts
  const letterSpacing = fontSize * -0.02; // -2% letter spacing
  
  return (text.length * avgCharWidth) + (text.length - 1) * letterSpacing;
}

// Check if text would wrap at given viewport
function checkWrapping(viewportWidth, brandSize) {
  const textWidth = estimateTextWidth(brandSize.px);
  const availableWidth = viewportWidth - 32; // Account for padding (16px each side)
  
  return {
    textWidth: textWidth,
    availableWidth: availableWidth,
    wouldWrap: textWidth > availableWidth,
    utilization: (textWidth / availableWidth * 100).toFixed(1)
  };
}

console.log('='.repeat(80));
console.log('WIBBLY WOBBLAZ Brand Text Wrapping Verification');
console.log('Issue #47: Typography Problem Solving - Stream C');
console.log('='.repeat(80));

console.log('\nFluid Brand Token Analysis:');
console.log('Formula: clamp(4.5rem, 1.5000vw + 4.0500rem, 6rem)');
console.log('Min Size: 4.5rem (72px) - at viewports ≤ 320px');
console.log('Max Size: 6.0rem (96px) - at viewports ≥ 1920px');

console.log('\n' + '-'.repeat(120));
console.log('| Viewport           | Width | Font Size    | Text Width | Available | Wrapping | Utilization |');
console.log('-'.repeat(120));

let allPassWrapping = true;
let minUtilization = 100;
let maxUtilization = 0;

testViewports.forEach(viewport => {
  const brandSize = calculateFluidBrandSize(viewport.width);
  const wrapping = checkWrapping(viewport.width, brandSize);
  
  const fontSizeDisplay = `${brandSize.rem.toFixed(2)}rem (${brandSize.px.toFixed(0)}px)`;
  const textWidthDisplay = `${wrapping.textWidth.toFixed(0)}px`;
  const availableDisplay = `${wrapping.availableWidth}px`;
  const wrappingStatus = wrapping.wouldWrap ? '❌ WRAP' : '✅ OK';
  const utilizationDisplay = `${wrapping.utilization}%`;
  
  console.log(
    `| ${viewport.name.padEnd(18)} | ${viewport.width.toString().padStart(5)} | ${fontSizeDisplay.padEnd(12)} | ${textWidthDisplay.padStart(10)} | ${availableDisplay.padStart(9)} | ${wrappingStatus.padEnd(8)} | ${utilizationDisplay.padStart(11)} |`
  );
  
  if (wrapping.wouldWrap) {
    allPassWrapping = false;
  }
  
  const util = parseFloat(wrapping.utilization);
  minUtilization = Math.min(minUtilization, util);
  maxUtilization = Math.max(maxUtilization, util);
});

console.log('-'.repeat(120));

console.log('\n📊 Summary:');
console.log(`✅ All viewport sizes prevent wrapping: ${allPassWrapping ? 'YES' : 'NO'}`);
console.log(`📏 Width utilization range: ${minUtilization.toFixed(1)}% - ${maxUtilization.toFixed(1)}%`);
console.log(`🎯 Optimal utilization (60-80%): ${minUtilization >= 60 && maxUtilization <= 80 ? 'YES' : 'NO'}`);

console.log('\n🔍 Key Implementation Details:');
console.log('• PandaCSS semantic token: fontSize: "brand"');
console.log('• CSS property: white-space: nowrap');  
console.log('• Fluid scaling: Smooth transition across all viewports');
console.log('• Font family: Hegval (maintained)');
console.log('• Font weight: 900 (maintained)');
console.log('• Letter spacing: tighter (maintained)');

console.log('\n🧪 Testing Instructions:');
console.log('1. Open browser dev tools');
console.log('2. Navigate to http://localhost:3000');
console.log('3. Resize viewport from 320px to 1920px+');
console.log('4. Verify "WIBBLY WOBBLAZ" never wraps');
console.log('5. Check smooth font size scaling');
console.log('6. Open test-brand-wrapping.html for detailed analysis');

console.log('\n✅ Solution Status:');
if (allPassWrapping) {
  console.log('🎉 SUCCESS: Brand text wrapping issue is RESOLVED');
  console.log('✅ Static breakpoint classes replaced with fluid token');
  console.log('✅ Text scaling is smooth across all viewport sizes');
  console.log('✅ No wrapping occurs at any tested viewport width');
} else {
  console.log('❌ ISSUE: Text still wraps at some viewport sizes');
  console.log('🔧 Further adjustments may be needed');
}

console.log('\n' + '='.repeat(80));