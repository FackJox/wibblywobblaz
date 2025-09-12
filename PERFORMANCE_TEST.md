# Performance Testing Guide for Shhh Feature

## Overview
This guide provides step-by-step instructions for testing animation performance and overall application performance using browser developer tools.

**Development Server**: http://localhost:3003

---

## 🚀 Animation Performance Testing

### Chrome DevTools Performance Testing

1. **Open Chrome DevTools**
   - Navigate to http://localhost:3003
   - Press F12 or Ctrl+Shift+I
   - Go to "Performance" tab

2. **Record Animation Performance**
   ```bash
   Steps:
   1. Click "Record" button (circle icon)
   2. Navigate to "PARTIES" page
   3. Click the "FREE" button to trigger animation
   4. Wait for animation to complete and Instagram redirect
   5. Stop recording
   ```

3. **Analyze Results**
   - Target: **60 FPS consistently**
   - Look for: Frame drops, long tasks, paint events
   - Check: GPU acceleration usage
   - Verify: Animation timing matches 900ms duration

### Firefox Developer Tools Testing

1. **Open Firefox DevTools**
   - Navigate to http://localhost:3003
   - Press F12
   - Go to "Performance" tab

2. **Record Performance**
   ```bash
   Steps:
   1. Click "Start recording performance"
   2. Navigate to "PARTIES" page
   3. Click "FREE" button
   4. Wait for complete animation cycle
   5. Stop recording
   ```

3. **Check Animation Inspector**
   - Go to "Inspector" tab
   - Click "Animations" panel
   - Verify smooth animation curves
   - Check timing functions

### Safari Web Inspector Testing

1. **Enable Developer Tools**
   - Safari → Preferences → Advanced
   - Check "Show Develop menu"
   - Navigate to http://localhost:3003
   - Develop → Show Web Inspector

2. **Record Timeline**
   ```bash
   Steps:
   1. Go to "Timelines" tab
   2. Click "Start Timeline Recording"
   3. Trigger the animation
   4. Stop recording after completion
   ```

3. **Analyze Performance**
   - Check render times
   - Verify 60 FPS target
   - Look for memory leaks

---

## 📱 Mobile Performance Testing

### Chrome Mobile Simulation

1. **Device Simulation**
   ```bash
   Steps:
   1. Open Chrome DevTools
   2. Click device toolbar icon (Ctrl+Shift+M)
   3. Select different devices:
      - iPhone SE (375px width)
      - iPhone 12 Pro (390px width)
      - iPad (768px width)
      - Pixel 5 (393px width)
   ```

2. **Performance Testing Per Device**
   ```bash
   For each device:
   1. Navigate to Parties page
   2. Trigger animation
   3. Check frame rate in Performance tab
   4. Verify smooth motion
   5. Test both orientations
   ```

3. **Network Throttling**
   ```bash
   Steps:
   1. Go to "Network" tab in DevTools
   2. Set throttling to "Slow 3G"
   3. Refresh page
   4. Test animation performance
   5. Verify acceptable loading times
   ```

---

## 🔧 Accessibility Testing with DevTools

### Chrome Lighthouse Audit

1. **Run Accessibility Audit**
   ```bash
   Steps:
   1. Open DevTools → Lighthouse tab
   2. Select "Accessibility" category
   3. Click "Generate report"
   4. Target: Score of 95+ required
   ```

2. **Manual Accessibility Checks**
   ```bash
   Steps:
   1. Go to Elements tab
   2. Click "Accessibility" panel
   3. Inspect FREE button element
   4. Verify ARIA attributes are present:
      - aria-label="Free ticket - opens Instagram"
      - aria-pressed (changes during animation)
   ```

### Screen Reader Simulation

1. **Chrome Screen Reader**
   ```bash
   Steps:
   1. Go to Chrome → Settings → Advanced → Accessibility
   2. Enable screen reader mode
   3. Navigate site using Tab key
   4. Verify announcements are clear
   ```

2. **Test ARIA Live Regions**
   ```bash
   Steps:
   1. Inspect live region element
   2. Trigger animation
   3. Verify announcements:
      - "Animation started, opening Instagram..."
      - "Animation completed, Instagram opening in new tab"
   ```

---

## 🌐 Cross-Browser Manual Testing

### Browser Compatibility Checklist

**Test in each browser: Chrome, Firefox, Safari, Edge**

1. **Basic Functionality Test**
   ```bash
   For each browser:
   1. Navigate to http://localhost:3003
   2. Test Links ↔ Parties navigation
   3. Click FREE button
   4. Verify animation plays smoothly
   5. Confirm Instagram opens in new tab
   6. Check no console errors
   ```

2. **Keyboard Navigation Test**
   ```bash
   For each browser:
   1. Use Tab to navigate to FREE button
   2. Press Enter key → Should trigger animation
   3. Use Tab to navigate again
   4. Press Space key → Should trigger animation
   5. Verify focus indicators are visible
   ```

3. **Performance Verification**
   ```bash
   For each browser:
   1. Open developer tools
   2. Record performance during animation
   3. Check frame rate ≥ 60 FPS
   4. Verify animation completes in ~900ms
   5. No memory leaks after multiple animations
   ```

---

## 🎯 Popup Blocker Testing

### Test Popup Blocking Scenarios

1. **Enable Popup Blockers**
   ```bash
   Chrome:
   1. Go to chrome://settings/content/popups
   2. Select "Don't allow sites to send pop-ups"
   3. Test Instagram redirect still works
   
   Firefox:
   1. Go to about:preferences#privacy
   2. Enable "Block pop-up windows"
   3. Test functionality
   
   Safari:
   1. Safari → Preferences → Websites → Pop-up Windows
   2. Set to "Block and Notify"
   3. Test functionality
   ```

2. **Verification Steps**
   ```bash
   For each browser with popup blocker enabled:
   1. Click FREE button
   2. Animation should play normally
   3. Instagram should still open (new tab, not popup)
   4. No popup blocker notifications should appear
   ```

---

## 📊 Performance Metrics to Record

### Animation Performance Targets

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Frame Rate | 60 FPS | 45+ FPS | 30+ FPS |
| Animation Duration | 900ms | ±50ms | ±100ms |
| First Paint | <100ms | <200ms | <500ms |
| CPU Usage | <30% | <50% | <80% |

### Loading Performance Targets

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Initial Load | <2s | <3s | <5s |
| Image Load | <1s | <2s | <3s |
| Font Load | <500ms | <1s | <2s |
| Bundle Size | <500KB | <1MB | <2MB |

### Accessibility Targets

| Metric | Target | Acceptable | Critical |
|--------|--------|------------|----------|
| Lighthouse Score | 100 | 95+ | 90+ |
| Keyboard Navigation | 100% | 95%+ | 90%+ |
| Screen Reader Compat | 100% | 95%+ | 90%+ |
| Color Contrast | AAA | AA | A |

---

## 🔍 Manual Testing Scenarios

### Edge Case Testing

1. **Rapid Clicking Test**
   ```bash
   Steps:
   1. Navigate to Parties page
   2. Click FREE button rapidly multiple times
   3. Expected: Only one animation plays
   4. No animation conflicts or errors
   ```

2. **Navigation During Animation**
   ```bash
   Steps:
   1. Click FREE button to start animation
   2. Immediately click LINKS navigation
   3. Expected: Animation stops gracefully
   4. No visual artifacts remain
   ```

3. **Multiple Device Orientations**
   ```bash
   Steps:
   1. Test on mobile device/simulation
   2. Start in portrait mode
   3. Rotate to landscape during animation
   4. Expected: Animation continues smoothly
   5. Layout adapts without issues
   ```

4. **Slow Network Conditions**
   ```bash
   Steps:
   1. Enable Network throttling (Slow 3G)
   2. Navigate to site
   3. Trigger animation
   4. Expected: Animation still smooth
   5. Instagram redirect still works
   ```

---

## 🐛 Issues to Watch For

### Common Animation Issues
- [ ] **Frame Drops**: Animation stutters or drops below 45 FPS
- [ ] **Memory Leaks**: Memory usage increases after repeated animations
- [ ] **Visual Artifacts**: Elements remain on screen after animation
- [ ] **Timing Issues**: Animation too fast/slow or doesn't complete
- [ ] **Z-Index Problems**: Animation appears behind other elements

### Accessibility Issues
- [ ] **Missing ARIA Labels**: Screen readers can't identify elements
- [ ] **Focus Lost**: Focus disappears during animation
- [ ] **No Announcements**: Screen readers don't announce state changes
- [ ] **Keyboard Traps**: User can't navigate away from element
- [ ] **Poor Contrast**: Focus indicators not visible enough

### Cross-Browser Issues
- [ ] **CSS Differences**: Animation behaves differently across browsers
- [ ] **JavaScript Errors**: Console errors in specific browsers
- [ ] **Font Loading**: Custom fonts don't load properly
- [ ] **Image Issues**: SVG or images don't display correctly
- [ ] **Performance Gaps**: Significantly worse performance in some browsers

---

## 📝 Test Execution Log Template

### Test Session: [DATE] - [BROWSER]
**Tester**: [NAME]  
**Environment**: [OS] - [BROWSER VERSION]  
**Resolution**: [SCREEN SIZE]

#### Performance Results
- **Animation FPS**: _____ FPS
- **Load Time**: _____ seconds
- **Animation Duration**: _____ ms
- **Console Errors**: [ ] None [ ] Minor [ ] Critical

#### Accessibility Results  
- **Keyboard Navigation**: [ ] Pass [ ] Fail
- **Screen Reader**: [ ] Pass [ ] Fail
- **Focus Management**: [ ] Pass [ ] Fail
- **ARIA Attributes**: [ ] Pass [ ] Fail

#### Issues Found
1. _____________________
2. _____________________
3. _____________________

#### Overall Status
[ ] ✅ All tests pass  
[ ] ⚠️ Minor issues found  
[ ] ❌ Critical issues found  

**Next Steps**: _______________