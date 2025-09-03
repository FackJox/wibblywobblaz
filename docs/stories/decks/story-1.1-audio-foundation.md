# Story 1.1: Foundation - Audio Architecture & Shadow Deck Core

## Story Title
Audio Architecture & Shadow Deck Core - Brownfield Addition

## User Story
As a DJ,
I want a visual DJ interface with dual decks that controls multiple audio sources,
So that I can mix music from local files, YouTube, and SoundCloud in one interface.

## Story Context

**Existing System Integration:**
- Integrates with: Next.js 15.2.4 App Router architecture
- Technology: React 19, TypeScript 5, Tailwind CSS 3.4, Framer Motion 11.18, Radix UI components
- Follows pattern: Existing component patterns, Tailwind configuration, App Router structure
- Touch points: New `/app/dj` route, lazy-loaded module, existing glitch effects from story-3.1

## Acceptance Criteria

**Functional Requirements:**
1. Two visual turntables (Deck A and Deck B) with play/pause, pitch control, and position scrubbing
2. WebAudio API context properly initialized for local MP3 playback with full audio control
3. YouTube IFrame API integrated with volume/play control for Deck A
4. SoundCloud Widget API integrated with volume/play control for Deck B  
5. Crossfader visually updates and controls volume balance between decks
6. 3-band EQ knobs per deck (visual only for streaming sources, functional for local files)
7. BPM display shows detected/estimated tempo per track
8. Drag-and-drop zone accepts local MP3 files
9. Memory management prevents audio context leaks

**Integration Requirements:**
10. Existing routes (/home, /about, etc.) continue to work unchanged
11. New functionality follows existing Radix UI component patterns
12. Integration with App Router maintains current navigation behavior
13. Page performance maintains 60fps when DJ Deck is idle
14. No console errors when navigating between DJ Deck and existing pages

**Quality Requirements:**
15. Change is covered by appropriate unit tests for audio engine
16. TypeScript strict mode compliance for all new code
17. No regression in existing landing page functionality verified

## Technical Notes

- **Integration Approach:** New `/app/dj` route with lazy-loaded DJ module to isolate functionality
- **Existing Pattern Reference:** Follow Radix UI component patterns, extend existing Tailwind config
- **Key Constraints:** 
  - Safari iOS has limited WebAudio API support - provide graceful degradation
  - YouTube/SoundCloud APIs must be conditionally loaded only when needed
  - Must maintain 60fps performance target

## Definition of Done

- [x] Functional requirements met (dual decks with multi-source support)
- [x] Integration requirements verified (no impact on existing routes)
- [x] Existing functionality regression tested
- [x] Code follows existing patterns and standards (Radix UI, Tailwind)
- [x] Tests pass (existing and new)
- [x] TypeScript strict mode compliance
- [x] ESLint/Prettier checks pass
- [x] Documentation updated in `/app/dj/README.md`

## Risk and Compatibility Check

**Minimal Risk Assessment:**
- **Primary Risk:** WebAudio API browser incompatibilities, especially Safari iOS
- **Mitigation:** Feature detection with fallback to visual-only controls
- **Rollback:** Feature flag `DJ_DECK_ENABLED` in environment variables

**Compatibility Verification:**
- [x] No breaking changes to existing APIs
- [x] No database changes required for this story
- [x] UI changes follow existing Radix UI and Tailwind patterns
- [x] Performance impact is negligible when DJ route not active

## Validation Checklist

**Scope Validation:**
- [x] Story establishes foundation that can be completed in 4-6 hours
- [x] Integration approach is straightforward (new isolated route)
- [x] Follows existing patterns exactly (Radix UI, Tailwind, App Router)
- [x] No design work required (follows existing component library)

**Clarity Check:**
- [x] Story requirements are unambiguous
- [x] Integration points are clearly specified
- [x] Success criteria are testable
- [x] Rollback approach is simple (feature flag)

## Implementation Path

1. Create `/app/dj` directory structure with page.tsx and layout.tsx
2. Build DJDeckInterface component using Radix UI primitives
3. Implement AudioEngine service with WebAudio API for local files
4. Add YouTube IFrame API integration for Deck A
5. Add SoundCloud Widget API integration for Deck B
6. Create Turntable and Crossfader components with Framer Motion
7. Implement drag-and-drop for local MP3 files
8. Add visual BPM display (detection in later story)
9. Write unit tests for audio engine
10. Verify no regression in existing routes

## File Structure
```
/app/dj/
  ├── page.tsx           # Main DJ interface page
  ├── layout.tsx         # DJ-specific layout
  └── loading.tsx        # Loading state
/components/dj/
  ├── DJDeckInterface.tsx   # Main interface component
  ├── Turntable.tsx         # Deck visualization
  └── Crossfader.tsx        # Mixing control
/lib/dj/
  └── audio-engine.ts       # WebAudio management
```

## Success Criteria

The story is complete when:
1. DJ can load and play local MP3 files with full control
2. YouTube videos can be loaded and played in Deck A
3. SoundCloud tracks can be loaded and played in Deck B
4. Crossfader visually blends between sources
5. No impact on existing Wibbly Wobblaz landing page
6. Feature can be toggled via environment variable

## Notes
- This is the foundation story - subsequent stories will add queue management, QR codes, WebSocket, etc.
- Focus on getting the core audio architecture right as everything else builds on this
- Visual polish can be iterative - functionality first
- Browser compatibility issues should be documented for future enhancement