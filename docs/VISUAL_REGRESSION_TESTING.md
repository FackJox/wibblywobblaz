# Visual Regression Testing for Panda CSS Migration

This document describes the visual regression testing setup for validating the Tailwind CSS to Panda CSS migration.

## Overview

We use Playwright for visual regression testing to ensure that the migration from Tailwind CSS to Panda CSS maintains pixel-perfect visual consistency across all components and breakpoints.

## Test Coverage

### Pages Tested
- **Main Page**: `/` - Full page and responsive breakpoints
- **Component Test Pages**:
  - `/test-button` - Button components and states
  - `/test-card` - Card layouts and variations  
  - `/test-dialog` - Dialog/modal components
  - `/test-form` - Form layouts and components
  - `/test-form-controls` - Form controls and inputs
  - `/test-feedback-display` - Alerts, progress, and feedback components

### Test Categories

#### 1. Static Layout Tests
- Full page screenshots at multiple viewport sizes
- Component layout verification
- Typography and spacing validation

#### 2. Interactive State Tests
- Button hover and focus states
- Form input focus states
- Dialog open/closed states
- Interactive component states

#### 3. Responsive Design Tests
Tested across viewport sizes:
- **Mobile Small**: 320×568px
- **Mobile Medium**: 375×667px
- **Tablet**: 768×1024px
- **Desktop Small**: 1024×768px
- **Desktop Large**: 1440×900px
- **Desktop XL**: 1920×1080px

#### 4. Cross-Browser Tests
- Chromium (primary baseline)
- Firefox
- WebKit (Safari)
- Mobile Chrome
- Mobile Safari

## Running Tests

### Quick Commands
```bash
# Run all visual tests
npm run test:visual

# Run visual tests for Chromium only (faster)
npm run test:visual:chromium

# Update baseline snapshots (run after making changes)
npm run test:visual:update

# View test results
npm run test:visual:report
```

### Detailed Commands
```bash
# Run specific test files
npx playwright test tests/visual/button-components.spec.ts

# Run tests for specific browsers
npx playwright test tests/visual/ --project=firefox

# Run tests with debugging
npx playwright test tests/visual/ --debug

# Run tests in headed mode
npx playwright test tests/visual/ --headed
```

## Test Results

### Current Baseline Coverage
- **Total Snapshots**: 55+ baseline images
- **Components Covered**: 40+ UI components
- **Viewport Variations**: 6 responsive breakpoints
- **Browser Coverage**: 6 browser/device configurations

### Snapshot Categories
1. **Layout Snapshots**: Full page and component layouts
2. **State Snapshots**: Interactive element states
3. **Responsive Snapshots**: Multi-viewport variations
4. **Cross-browser Snapshots**: Browser-specific rendering

## Configuration

### Playwright Settings
- **Animation Handling**: Disabled for consistent screenshots
- **Wait Strategies**: Network idle + additional timing
- **Color Scheme**: Fixed to light mode
- **Screenshot Comparison**: 0.2 threshold for minor rendering differences

### Test Environment
- **Base URL**: http://localhost:3000
- **Server**: Automatic dev server startup
- **Timeout**: 30s per test, 10s for assertions
- **Workers**: Parallel execution for faster runs

## Maintenance

### When to Update Baselines
- After intentional visual changes
- When upgrading dependencies that affect rendering
- After design system updates
- When browser rendering changes

### Troubleshooting Common Issues
1. **Flaky Tests**: Check for animations or timing issues
2. **Font Loading**: Ensure fonts are loaded before screenshots
3. **Dynamic Content**: Mock or stabilize dynamic elements
4. **Color Variations**: Check color profile and browser settings

## Integration with Migration Process

### Pre-Migration
1. Establish baseline snapshots with Tailwind CSS
2. Document any existing visual inconsistencies
3. Verify test coverage across all components

### During Migration
1. Run visual tests after each component migration
2. Identify and document visual differences
3. Update baselines only for intentional changes

### Post-Migration
1. Final comprehensive visual validation
2. Cross-browser compatibility verification
3. Performance impact assessment

## Visual Differences Documentation

Any visual differences found during migration should be documented in:
- Test result reports (`playwright-report/`)
- Migration progress updates
- Component-specific change logs

## CI/CD Integration

For continuous integration:
```bash
# CI-optimized test run
npx playwright test tests/visual/ --project=chromium --reporter=junit
```

Visual regression tests are designed to catch unintended changes while allowing for intentional design improvements during the migration process.