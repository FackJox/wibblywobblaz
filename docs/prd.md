# Wibbly Wobblaz DJ Deck Brownfield Enhancement PRD

## Intro Project Analysis and Context

### Existing Project Overview

**Analysis Source**: IDE-based fresh analysis combined with provided project brief

**Current Project State**: 
The Wibbly Wobblaz landing page is an existing Next.js 14+ web application with a monorepo structure. The project currently features:
- Modern React 18 interface with TypeScript
- Existing glitch effects system (story-3.1) 
- Tailwind CSS styling with Framer Motion animations
- Standard landing page functionality
- Established routing and navigation structure

### Available Documentation Analysis

**Available Documentation**:
- ✓ Project Brief (docs/brief.md) - Comprehensive vision document
- ✓ Tech Stack Documentation (Next.js 14+, React 18, TypeScript, Tailwind)
- ✓ Glitch Effects Story (story-3.1-glitch-effects.md referenced)
- ✓ Core Configuration (.bmad-core/core-config.yaml)
- ⚠️ Architecture Documentation (docs/architecture - sharded, needs review)
- ⚠️ PRD Documentation (docs/prd - sharded v4, existing content)
- ✗ API Documentation (not yet created)
- ✗ UX/UI Guidelines (beyond Tailwind standards)

### Enhancement Scope Definition

**Enhancement Type**:
- ✓ New Feature Addition (DJ Deck interface)
- ✓ Integration with New Systems (YouTube/SoundCloud APIs, WebAudio)
- ✓ UI/UX Overhaul (for DJ deck portion)

**Enhancement Description**: 
Adding a viral web-based DJ mixing interface to the Wibbly Wobblaz platform that allows party guests to contribute music via QR code scanning, implementing a Shadow Deck architecture with visual DJ controls and multi-source audio support.

**Impact Assessment**:
- ✓ Significant Impact (substantial new code, new services, WebSocket infrastructure)

### Goals and Background Context

**Goals**:
- Enable 2+ hour continuous music playback at social events without host intervention
- Allow 5+ party guests to contribute songs via QR code per session
- Create viral social media moments through shareable mix recordings
- Achieve <30 second time from QR scan to song submission
- Maintain 60fps performance with BPM-synced glitch effects integration

**Background Context**:
This enhancement addresses the "playlist monopoly" problem at social gatherings where one person controls music while others passively endure. The DJ Deck transforms any gathering into an interactive experience where everyone can contribute music without app downloads. By implementing a Shadow Deck architecture with perception hacks, we deliver the feeling of professional DJ mixing while working within browser and API constraints. This positions Wibbly Wobblaz as the "Instagram of party music" for Gen Z social events.

### Change Log

| Change | Date | Version | Description | Author |
|--------|------|---------|-------------|---------|
| Initial Draft | 2025-09-03 | v1.0 | Created brownfield PRD for DJ Deck enhancement | John (PM) |

## Requirements

### Functional Requirements

**FR1:** The DJ Deck interface shall provide visual controls including dual turntables, crossfader, 3-band EQ knobs, BPM display, and waveform visualization that control underlying audio playback.

**FR2:** The system shall support three audio sources: drag-and-drop local MP3 files with full WebAudio API control, YouTube video embeds via IFrame API, and SoundCloud tracks via Widget API.

**FR3:** A QR code displayed on the DJ interface shall link to a mobile-optimized web form allowing song submission without requiring app installation, account creation, or authentication.

**FR4:** The system shall maintain a real-time collaborative queue via WebSocket showing upcoming tracks with contributor names, allowing the DJ to reorder, remove, or add tracks.

**FR5:** The perception hack system shall provide visual beat grids, transition effects, and sync indicators that create the illusion of beatmatching even when true audio mixing is not possible.

**FR6:** BPM detection using Essentia.js WASM shall analyze local audio files and estimate tempo for streaming sources to synchronize glitch effect intensity.

**FR7:** The auto-mix mode shall provide smooth transitions between tracks when the DJ is not actively mixing, maintaining continuous playback.

**FR8:** Mix recording via MediaRecorder API shall capture DJ sessions and generate shareable clips optimized for Instagram Reels (15-60s) and TikTok (up to 3min).

**FR9:** The glitch effects from story-3.1 shall pulse and distort in sync with detected/perceived BPM across four intensity levels: subtle (60-90 BPM), medium (90-120 BPM), intense (120-140 BPM), and maximum (140+ BPM).

**FR10:** The system shall provide headphone cueing functionality allowing the DJ to preview and beatmatch the next track through their device's headphone output while the main mix plays through speakers, using WebAudio API's channel routing to split cue and master outputs.

**FR11:** A cue/PFL (Pre-Fader Listen) button on each deck shall route that deck's audio to the headphone output, with a headphone mix knob to blend between cue and master signals.

### Non-Functional Requirements

**NFR1:** The DJ Deck interface must maintain 60fps performance even with simultaneous audio playback, visual effects, and glitch animations on devices with 4GB RAM or greater.

**NFR2:** Initial page load time shall not exceed 2 seconds on 4G connections, with lazy loading for non-critical DJ deck components.

**NFR3:** The system shall handle 100+ songs in the playlist queue without performance degradation.

**NFR4:** Audio latency for local file manipulation via WebAudio API shall not exceed 100ms.

**NFR5:** The WebSocket infrastructure must support at least 50 concurrent contributors per DJ session with message delivery under 500ms.

**NFR6:** QR code to song submission completion time shall average under 30 seconds on mobile devices.

**NFR7:** The system shall gracefully degrade on unsupported browsers, showing a "Modern browser required" message with specific browser recommendations.

**NFR8:** Mix recordings shall be compressed to under 50MB for 3-minute clips while maintaining acceptable audio quality.

**NFR9:** Headphone cue latency shall not exceed 50ms to enable accurate beatmatching, with clear audio channel separation between cue and master outputs.

### Compatibility Requirements

**CR1:** All existing Wibbly Wobblaz routes, navigation, and page functionality must remain unchanged and fully functional with the DJ Deck as an additional feature module.

**CR2:** The enhancement shall not modify any existing database schemas if present, using separate tables/collections for DJ Deck data with no foreign key dependencies on existing data.

**CR3:** New UI components must use the existing Tailwind CSS configuration and follow current color schemes, spacing, and typography patterns established in the landing page.

**CR4:** The glitch effects integration must extend, not replace, the existing story-3.1 implementation, maintaining backward compatibility with any current glitch effect triggers.

**CR5:** The headphone cueing system must work with the device's existing audio hardware configuration, supporting both combined headphone/speaker setups and separate audio interfaces where available.

## Technical Constraints and Integration Requirements

### Existing Technology Stack

**Languages**: TypeScript, JavaScript, CSS
**Frameworks**: Next.js 14+, React 18, Tailwind CSS, Framer Motion
**Database**: Not yet implemented (will add PostgreSQL for persistent data, Redis for session management)
**Infrastructure**: Vercel (frontend), will require AWS/Railway for WebSocket backend, CloudFlare CDN for assets
**External Dependencies**: YouTube IFrame API, SoundCloud Widget API, Essentia.js WASM, Socket.io

### Integration Approach

**Database Integration Strategy**: New PostgreSQL tables isolated in 'dj_deck' schema - no foreign keys to existing tables. Redis for real-time queue management and WebSocket session state. Migration scripts will be additive only.

**API Integration Strategy**: New REST endpoints under `/api/dj-deck/*` namespace. WebSocket server on separate port/subdomain (e.g., `ws.wibblywobblas.com`). YouTube/SoundCloud APIs loaded conditionally when DJ Deck is accessed.

**Frontend Integration Strategy**: New route `/dj` with lazy-loaded DJ Deck module. Shared UI components extended from existing Tailwind config. Glitch effects imported from existing story-3.1 implementation with new BPM-based triggers.

**Testing Integration Strategy**: Separate test suite for DJ Deck features. Integration tests to verify existing routes remain functional. Performance benchmarks for 60fps with effects. Mock WebSocket server for queue testing.

### Code Organization and Standards

**File Structure Approach**: 
```
/apps/dj-deck/           # New feature module
  /components/           # DJ-specific React components  
  /lib/                  # Audio engine, WebSocket client
  /hooks/                # DJ Deck custom hooks
  /api/                  # DJ-specific API routes
/packages/audio/         # Shared audio utilities
/packages/websocket/     # Shared real-time infrastructure
```

**Naming Conventions**: Follow existing camelCase for functions, PascalCase for components, kebab-case for files. Prefix DJ-specific components with 'DJ' (e.g., DJDeck, DJQueue, DJCueControl).

**Coding Standards**: Maintain existing ESLint/Prettier config. TypeScript strict mode for all new code. Component props fully typed with interfaces. WebAudio nodes properly cleaned up to prevent memory leaks.

**Documentation Standards**: JSDoc comments for audio processing functions. README in dj-deck module explaining architecture. Inline comments for complex audio routing logic.

### Deployment and Operations

**Build Process Integration**: DJ Deck module built as separate chunk for code splitting. WebAssembly files (Essentia.js) copied to public directory. Environment variables for WebSocket URL and API keys.

**Deployment Strategy**: Frontend deploys to Vercel with existing pipeline. WebSocket server deploys to Railway/AWS with auto-scaling. Database migrations run before deployment. Feature flag to enable/disable DJ Deck.

**Monitoring and Logging**: CloudWatch/DataDog for WebSocket metrics. Sentry for error tracking with DJ Deck context. Performance monitoring for audio latency and frame rate. Analytics for QR scan conversion rates.

**Configuration Management**: `.env` variables for API keys and WebSocket URLs. Feature flags via environment or database config. Audio quality settings adjustable per deployment. Rate limiting configurable for QR submissions.

### Risk Assessment and Mitigation

**Technical Risks**: 
- Browser audio API inconsistencies (especially Safari iOS)
- WebSocket connection drops during parties
- Memory leaks from multiple audio contexts
- YouTube/SoundCloud API changes breaking embeds

**Integration Risks**:
- Glitch effects performance impact when combined with DJ Deck
- Vercel serverless timeout limitations for audio processing
- CORS issues with external audio sources
- Redux/Context state conflicts if existing state management

**Deployment Risks**:
- WebSocket server scaling during viral moments
- CDN caching issues for dynamic audio content
- Database connection pool exhaustion
- SSL certificate problems for WebSocket connections

**Mitigation Strategies**:
- Progressive enhancement with capability detection
- Automatic WebSocket reconnection with queue persistence
- Strict audio context lifecycle management
- API version pinning with fallback strategies
- Load testing before launch
- Circuit breakers for external API calls
- Horizontal scaling strategy for WebSocket servers
- Comprehensive error boundaries in React

## Epic and Story Structure

### Epic Approach

**Epic Structure Decision**: Single comprehensive epic for the DJ Deck MVP. This enhancement, while complex, represents one cohesive feature addition to the Wibbly Wobblaz platform. Breaking it into multiple epics would create artificial boundaries and complicate dependency management. The Shadow Deck architecture requires all components (visual interface, audio engine, QR system, and real-time queue) to work together for minimum viable functionality.

## Epic 1: Wibbly Wobblaz DJ Deck MVP Implementation

**Epic Goal**: Deliver a fully functional web-based DJ mixing interface that enables collaborative music control at social events through QR-based submissions, visual DJ controls with Shadow Deck architecture, and seamless integration with the existing Wibbly Wobblaz platform.

**Integration Requirements**: 
- Preserve all existing landing page functionality and routes
- Extend glitch effects system without breaking current implementation  
- Maintain 60fps performance target across the application
- Ensure zero impact on existing user flows when DJ Deck is not active
- Implement feature flag for safe rollout and rollback capability

### Story 1.1: Foundation - Audio Architecture & Shadow Deck Core

As a DJ,
I want a visual DJ interface with dual decks that controls multiple audio sources,
so that I can mix music from local files, YouTube, and SoundCloud in one interface.

**Acceptance Criteria:**
1. Two visual turntables with play/pause, pitch control, and position scrubbing
2. WebAudio API context properly initialized for local MP3 playback
3. YouTube IFrame API integrated with volume/play control for Deck A
4. SoundCloud Widget API integrated with volume/play control for Deck B
5. Crossfader visually updates and controls volume balance between decks
6. 3-band EQ knobs per deck (visual only for streaming, functional for local)
7. BPM display shows detected/estimated tempo per track
8. Drag-and-drop zone accepts local MP3 files
9. Memory management prevents audio context leaks

**Integration Verification:**
- IV1: Existing routes (/home, /about, etc.) remain accessible and functional
- IV2: Page performance maintains 60fps when DJ Deck is idle
- IV3: No console errors when navigating between DJ Deck and existing pages

### Story 1.2: Headphone Cueing & Audio Routing System

As a DJ,
I want to preview upcoming tracks in my headphones while the audience hears the main mix,
so that I can beatmatch and prepare smooth transitions.

**Acceptance Criteria:**
1. Cue/PFL buttons on each deck route audio to headphone output
2. Headphone mix knob blends between cue and master signals (0-100%)
3. WebAudio API splits audio into master and cue channels
4. Visual indicators show which deck is cued
5. For local files: true pre-fader listening via gain nodes
6. For streaming: secondary hidden player instances for preview
7. Browser prompts for audio output permissions when needed
8. Graceful fallback message if browser doesn't support audio routing
9. Headphone volume control independent of master volume

**Integration Verification:**
- IV1: Audio routing doesn't interfere with existing sound effects
- IV2: Cue system properly releases resources when switching tracks
- IV3: No audio glitches when toggling between cue and master

### Story 1.3: QR Submission System & Real-time Queue

As a party guest,
I want to scan a QR code and instantly submit song requests,
so that I can contribute to the party playlist without downloading apps.

**Acceptance Criteria:**
1. QR code prominently displayed on DJ interface
2. QR links to mobile-optimized submission form
3. Form accepts: song name, artist, platform preference (YouTube/SoundCloud/Upload)
4. Optional: YouTube/SoundCloud URL paste
5. Optional: Direct MP3 upload (< 20MB)
6. Submission completes in < 30 seconds
7. Success confirmation shows position in queue
8. No authentication or account required
9. Rate limiting prevents spam (3 submissions per device per 10 minutes)

**Integration Verification:**
- IV1: QR submission page uses existing Tailwind styles
- IV2: Form submission doesn't affect main site performance
- IV3: Mobile experience consistent with main site responsive design

### Story 1.4: WebSocket Queue & Collaborative Features

As a DJ,
I want to see real-time song submissions and manage the collaborative queue,
so that I can incorporate guest requests while maintaining control of the mix.

**Acceptance Criteria:**
1. WebSocket connection established on DJ Deck load
2. Real-time updates show new submissions instantly
3. Queue displays: song title, artist, contributor name, platform icon
4. Drag-and-drop reordering of queue items
5. Remove button for inappropriate submissions
6. Auto-queue mode adds next song when deck is empty
7. Visual notification for new submissions
8. Connection status indicator with auto-reconnect
9. Queue persists in Redis for session recovery
10. Support for 50+ concurrent contributors

**Integration Verification:**
- IV1: WebSocket doesn't interfere with existing API calls
- IV2: Queue updates don't cause React re-render issues
- IV3: Graceful degradation if WebSocket fails

### Story 1.5: Perception Hack System & Visual Beatmatching

As a DJ,
I want visual feedback that creates the illusion of professional beatmatching,
so that the audience experiences a convincing DJ performance.

**Acceptance Criteria:**
1. Waveform visualization for each deck (real for local, simulated for streaming)
2. Beat grid overlay with tempo markers
3. Visual sync indicator between decks (phase meter)
4. Transition effects: filter sweep, echo out, backspin animation
5. Vinyl rotation animation synced to playback speed
6. LED-style level meters responding to audio
7. Visual effects trigger on crossfader movements
8. Smooth 60fps animations for all visual elements
9. Performance degradation for low-end devices

**Integration Verification:**
- IV1: Visual effects don't conflict with existing glitch effects
- IV2: Animations maintain smooth performance
- IV3: CSS animations don't break existing transitions

### Story 1.6: BPM Detection & Glitch Effect Integration

As a user,
I want the glitch effects to pulse in sync with the music's tempo,
so that the visual experience matches the energy of the music.

**Acceptance Criteria:**
1. Essentia.js WASM loaded and initialized
2. BPM detection for local MP3s (±5 BPM accuracy)
3. BPM estimation for streaming tracks via metadata/API
4. Glitch intensity mapped: 60-90 BPM (subtle), 90-120 (medium), 120-140 (intense), 140+ (maximum)
5. Glitch triggers on: beat hits, drops, crossfader moves, track starts
6. Existing glitch effects enhanced, not replaced
7. Performance maintains 60fps with effects active
8. Manual BPM adjustment option if detection fails
9. Visual BPM confidence indicator

**Integration Verification:**
- IV1: Existing glitch effect triggers still function
- IV2: No performance regression in story-3.1 effects
- IV3: BPM data properly cleaned up on track change

### Story 1.7: Auto-Mix Mode & Continuous Playback

As a party host,
I want the music to continue automatically when the DJ steps away,
so that the party never stops.

**Acceptance Criteria:**
1. Auto-mix toggle button on interface
2. Automatic track loading from queue when deck empty
3. Configurable transition type: cut, fade, or auto-detect
4. Transition timing based on track endings (fade out detection)
5. Crossfader animates during auto transitions
6. Manual override instantly disables auto-mix
7. Smart track selection based on BPM similarity (if available)
8. Minimum 2-hour continuous playback without intervention
9. Auto-mix status indicator

**Integration Verification:**
- IV1: Auto-mix doesn't interfere with manual control
- IV2: Smooth transition between auto and manual modes
- IV3: Queue management remains responsive during auto-mix

### Story 1.8: Mix Recording & Social Sharing

As a DJ,
I want to record my mix and create shareable clips,
so that I can promote my skills on social media.

**Acceptance Criteria:**
1. Record button starts/stops mix capture
2. MediaRecorder API captures master output
3. Visual recording indicator with elapsed time
4. Maximum recording length: 10 minutes (storage limit)
5. Generate clips: 15s, 30s, 60s (Instagram), up to 3min (TikTok)
6. Waveform visualization of recorded mix
7. Trim controls for selecting highlight moments
8. Export formats: MP3 (audio), MP4 (with visualizer)
9. Share buttons for major platforms
10. Local download option

**Integration Verification:**
- IV1: Recording doesn't impact playback performance
- IV2: Recorded files properly cleaned from memory
- IV3: Share functionality uses existing meta tags

### Story 1.9: Testing, Polish & Launch Preparation

As a product owner,
I want the DJ Deck thoroughly tested and polished,
so that we can launch with confidence.

**Acceptance Criteria:**
1. Cross-browser testing complete (Chrome, Firefox, Safari, Edge)
2. Mobile device testing (iOS Safari, Chrome Android)
3. Load testing validates 50+ concurrent users
4. Performance benchmarks confirm 60fps target
5. Accessibility review complete (keyboard navigation, screen readers)
6. Error boundaries prevent crashes from affecting main site
7. Feature flag tested for enable/disable scenarios
8. Analytics tracking implemented for key metrics
9. Documentation complete for operations team
10. Rollback plan validated

**Integration Verification:**
- IV1: Full regression test of existing site features
- IV2: Performance testing of entire application with DJ Deck active
- IV3: Deployment process maintains zero-downtime

## Story Sequencing Rationale

The story sequence minimizes risk to the existing system while building toward full functionality:

1. **Foundation first (1.1)**: Establishes core audio architecture
2. **Headphone cueing (1.2)**: Essential DJ feature added early
3. **QR system (1.3)**: Can be developed in parallel
4. **WebSocket queue (1.4)**: Depends on submission system
5. **Visual features (1.5, 1.6)**: Iteratively enhanced
6. **Auto-mix (1.7)**: Requires queue and playback complete
7. **Recording (1.8)**: Nice-to-have feature
8. **Testing (1.9)**: Final validation

Each story can be deployed independently behind the feature flag, allowing for incremental rollout and quick rollback if issues arise.