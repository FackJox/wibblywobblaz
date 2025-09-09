---
name: decks
status: backlog
created: 2025-09-08T20:05:41Z
progress: 0%
prd: .claude/prds/decks.md
github: https://github.com/FackJox/wibblywobblaz/issues/2
---

# Epic: Decks

## Overview

Implementation of a browser-based DJ mixing interface with collaborative queue management. The solution leverages Web Audio API for real-time audio processing and WebSockets for crowd participation features. We'll build progressively from a core mixing engine to a full collaborative platform, reusing existing Radix/shadcn components and the current theming system.

## Architecture Decisions

### Core Technology Choices
- **Audio Engine**: Web Audio API with AudioContext for low-latency processing
- **UI Framework**: Reuse existing Next.js 15 + Radix UI components (40+ available)
- **Real-time**: WebSocket via Socket.io for queue management (simpler than raw WS)
- **State Management**: Zustand for global audio state (lightweight, TypeScript-friendly)
- **Audio Analysis**: Web Audio AnalyserNode for waveforms and BPM detection
- **Storage**: IndexedDB for offline track caching, localStorage for settings

### Design Patterns
- **Component Composition**: Leverage existing shadcn components (Slider for EQ, Button for controls)
- **Progressive Enhancement**: Core mixing works offline, collaborative features enhance when online
- **Mobile-First**: Touch-optimized controls with existing responsive patterns
- **Event-Driven**: Audio events drive UI updates, not polling

### Simplification Strategies
- **No Custom Audio Processing**: Use native Web Audio nodes only (no WebAssembly)
- **Leverage Existing UI**: Map DJ controls to existing components (Slider, Toggle, Card)
- **Single Audio Context**: Avoid complexity of multiple contexts
- **Static Track Library**: Start with uploaded files, defer streaming integration

## Technical Approach

### Frontend Components

**Reuse Existing Components:**
- `Slider` component for: Volume faders, EQ knobs, Crossfader, Pitch control
- `Button` and `Toggle` for: Play/Pause, Cue, Loop controls
- `Card` component for: Deck containers, Queue items
- `Dialog` for: QR code display, Track upload
- `Progress` for: Track position, Loading states
- `Tabs` for: Deck A/B switching on mobile

**New Components (Minimal):**
- `Waveform` - Canvas-based visualization using AnalyserNode
- `DeckControl` - Composite of existing controls
- `QueueManager` - List of Cards with drag-drop

### Backend Services

**Simplified Architecture:**
- **No Custom Backend Initially**: Use Vercel Edge Functions
- **WebSocket Service**: Vercel's built-in WebSocket support or Pusher
- **File Storage**: Vercel Blob for mix recordings
- **Database**: Vercel KV for session data (no complex schemas)

### Infrastructure

**Leverage Existing Setup:**
- Deploy to existing Vercel account
- Use current domain with `/decks` route
- Reuse existing Next.js configuration
- Keep within free tier limits initially

## Implementation Strategy

### Development Phases

**Phase 1: Core Audio Engine (Week 1)**
- Web Audio setup with single AudioContext
- Basic play/pause with existing Button components
- Volume control with Slider component
- Simple file upload with existing form components

**Phase 2: Dual Deck Interface (Week 2)**
- Two audio sources with independent controls
- Crossfader using Slider component
- Basic EQ with three Slider components per deck
- Responsive layout with existing Tailwind classes

**Phase 3: Visual Feedback (Week 3)**
- Canvas waveform visualization
- BPM detection using AnalyserNode
- Track position with Progress component
- Cue points with visual markers

**Phase 4: Collaborative Features (Week 4)**
- QR code generation with existing Dialog
- Simple WebSocket connection
- Queue display with Card components
- Mobile submission form

**Phase 5: Polish & Launch (Week 5-6)**
- Mix recording using MediaRecorder API
- Export with existing Button/Dialog pattern
- Performance optimization
- Beta testing with local DJs

### Risk Mitigation
- **Browser Compatibility**: Feature detection with fallbacks
- **Performance**: Start with mono, upgrade to stereo if performant
- **Mobile Audio**: Test early on iOS (known restrictions)
- **Network Issues**: Queue works offline, syncs when online

### Testing Approach
- **Unit Tests**: Audio utility functions
- **Integration Tests**: Component interactions
- **E2E Tests**: Critical user flows only
- **Performance Tests**: Audio latency measurements
- **User Testing**: Weekly sessions with target users

## Task Breakdown Preview

High-level task categories that will be created (keeping under 10 tasks):

- [ ] **Task 1: Audio Foundation** - Set up Web Audio API context, implement play/pause/volume with existing components
- [ ] **Task 2: Dual Deck UI** - Create deck layout using Card components, add controls with Sliders/Buttons
- [ ] **Task 3: Audio Routing** - Implement crossfader logic, EQ filters, channel mixing
- [ ] **Task 4: Visual Feedback** - Add waveform canvas, BPM display, progress indicators
- [ ] **Task 5: File Management** - Track upload, IndexedDB storage, library display
- [ ] **Task 6: Collaborative Queue** - WebSocket setup, QR generation, submission form
- [ ] **Task 7: Mix Recording** - MediaRecorder implementation, export functionality
- [ ] **Task 8: Mobile Optimization** - Touch controls, responsive layout, iOS audio fixes
- [ ] **Task 9: Testing & Polish** - Core user flows, performance optimization, bug fixes

## Dependencies

### External Service Dependencies
- **Vercel Platform**: Hosting, Edge Functions, KV storage
- **Web Audio API**: Browser support (check caniuse)
- **Socket.io or Pusher**: WebSocket service (free tier)
- **QR Code Library**: qrcode.js (lightweight, no dependencies)

### Internal Dependencies
- **Existing Components**: All 40+ shadcn components available
- **Current Theme System**: HSL variables, dark mode support
- **Build Pipeline**: Current Next.js setup unchanged
- **Auth System**: Reuse if exists, otherwise localStorage sessions

### Prerequisite Work
- Fix TypeScript/ESLint build errors (currently ignored)
- Ensure HTTPS for audio permissions
- Test Web Audio on target browsers
- Verify Vercel limits for WebSocket connections

## Success Criteria (Technical)

### Performance Benchmarks
- **Audio Latency**: < 30ms (relaxed from 20ms for broader compatibility)
- **UI Responsiveness**: 60fps during mixing operations
- **Load Time**: < 3s on 4G (reuse existing optimizations)
- **Memory Usage**: < 200MB with 2 tracks loaded
- **CPU Usage**: < 50% on 2019+ devices

### Quality Gates
- **Cross-browser**: Works on Chrome, Firefox, Safari (latest 2 versions)
- **Mobile Support**: Functional on iOS 14+ and Android 10+
- **Offline Mode**: Core mixing works without internet
- **Error Handling**: Graceful degradation for unsupported features
- **Accessibility**: Keyboard controls for main functions

### Acceptance Criteria
- Professional DJ can perform 30-minute set
- New user can mix two tracks within 5 minutes
- 10+ users can submit to queue simultaneously
- Mix recordings export successfully
- No audio glitches during normal operation

## Estimated Effort

### Overall Timeline
- **Total Duration**: 6 weeks (matching PRD)
- **Development**: 4 weeks core implementation
- **Testing & Polish**: 2 weeks refinement
- **Daily Commitment**: 6-8 hours focused work

### Resource Requirements
- **Developer**: 1 person (full-stack)
- **Design**: Use existing design system (no designer needed)
- **Testing**: Developer + 3-5 beta users
- **Infrastructure**: Existing Vercel account sufficient

### Critical Path Items
1. **Week 1**: Audio engine must work for Week 2 progress
2. **Week 2**: Dual deck system blocks all mixing features
3. **Week 3**: Visual feedback needed for user testing
4. **Week 4**: WebSocket setup blocks collaborative features
5. **Week 5-6**: Polish based on user feedback

## Simplification Opportunities

### Leverage Existing Work
- Use all 40+ existing UI components instead of custom controls
- Reuse current animation patterns for transitions
- Apply existing responsive breakpoints
- Keep current routing (single page approach)

### Defer Complexity
- Start with file upload, add streaming later
- Manual BPM input before auto-detection
- Basic effects before advanced processing
- Simple queue before voting system

### Progressive Rollout
- Launch core mixing first (Week 4)
- Add collaboration in second release
- Introduce effects in third iteration
- Scale infrastructure based on usage

## Tasks Created

- [ ] #6 - Audio Foundation (parallel: false, depends_on: [])
- [ ] #7 - Dual Deck UI (parallel: false, depends_on: [6])
- [ ] #8 - Audio Routing (parallel: false, depends_on: [6, 7])
- [ ] #12 - Visual Feedback (parallel: false, depends_on: [7])
- [ ] #13 - File Management (parallel: true, depends_on: [6])
- [ ] #15 - Collaborative Queue (parallel: false, depends_on: [7])
- [ ] #18 - Mix Recording (parallel: true, depends_on: [8])
- [ ] #19 - Mobile Optimization (parallel: true, depends_on: [7, 12])
- [ ] #22 - Testing & Polish (parallel: false, depends_on: [6, 7, 8, 12, 13, 15, 18, 19])

**Total tasks:** 9
**Parallel tasks:** 3 (Tasks #13, #18, #19)
**Sequential tasks:** 6 (Tasks #6, #7, #8, #12, #15, #22)
**Estimated total effort:** 185-217 hours (~5-6 weeks at full-time)

### Execution Order
1. **Week 1:** Task #6 (Audio Foundation)
2. **Week 2:** Task #7 (Dual Deck UI) + Task #13 (File Management - parallel)
3. **Week 3:** Task #8 (Audio Routing) + Task #12 (Visual Feedback)
4. **Week 4:** Task #15 (Collaborative Queue) + Task #18 (Mix Recording - parallel)
5. **Week 5:** Task #19 (Mobile Optimization)
6. **Week 6:** Task #22 (Testing & Polish)
---

*This epic focuses on rapid delivery of core value while maintaining quality. By leveraging existing components and infrastructure, we can deliver a functional DJ platform in 6 weeks with minimal technical debt.*
