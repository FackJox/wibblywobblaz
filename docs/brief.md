# Project Brief: Wibbly Wobblaz DJ Deck

## Executive Summary

**Wibbly Wobblaz DJ Deck** is a viral web-based DJ mixing interface that allows party guests to contribute music via QR code scanning. The platform solves the problem of collaborative music control at social events by enabling seamless playlist contribution without app downloads. Targeting party hosts and social event organizers, the key value proposition is transforming any gathering into an interactive DJ experience where everyone can participate while maintaining smooth, continuous music playback.

## Problem Statement

Current social gatherings suffer from the "playlist monopoly" problem - one person controls the music while others passively endure or awkwardly request songs. This creates social friction, with 73% of party-goers reporting frustration with music selection at events (hypothetical but realistic stat). The impact is significant: parties lose energy when music doesn't match the crowd's vibe, hosts stress over playlist curation, and guests feel disconnected from the experience.

Existing solutions fail because:
- **Spotify Group Sessions** requires everyone to have premium accounts and the app installed
- **Physical DJ equipment** is expensive, complex, and intimidating for non-DJs  
- **Taking turns with phones** causes awkward gaps and device-switching chaos
- **Pre-made playlists** can't adapt to the room's changing energy

The urgency is clear: as social gatherings return post-pandemic, people crave interactive, participatory experiences. The "TikTok generation" expects to be creators, not just consumers, even at parties. This is the perfect moment to capture the viral social music market before a major player dominates the space.

## Proposed Solution

The Wibbly Wobblaz DJ Deck implements a "Shadow Deck + Perception Hack" architecture - a dual-layer system combining a visually impressive DJ interface with hidden embedded players for legal audio streaming. Users experience what appears to be professional DJ mixing through clever visual synchronization and effects, while the system seamlessly manages multiple audio sources (local MP3s, YouTube, SoundCloud) within terms of service.

Key differentiators from existing solutions:
- **Zero-friction contribution**: QR code instantly opens web form - no apps, accounts, or downloads required
- **Hybrid audio approach**: Full mixing for local files via WebAudio API, smart API control for streaming services
- **Perception engineering**: Visual beat grids, transition effects, and UI animations create the illusion of perfect beatmatching
- **Progressive complexity**: Simple "Party Mode" for casual users, advanced "Pro Mode" for aspiring DJs

This solution succeeds where others haven't because it embraces constraints as features. Instead of fighting platform limitations, we use visual psychology to deliver the feeling of DJ mixing. The QR-to-playlist pipeline removes every possible barrier to participation. By supporting multiple audio sources, we meet users where their music lives rather than forcing migration to a single platform.

The high-level vision: Transform Wibbly Wobblaz DJ Deck into the "Instagram of party music" - where creating and sharing mixed playlists becomes a social currency, spawning viral challenges and becoming the default way Gen Z experiences music together.

## Target Users

### Primary User Segment: Social Party Hosts

**Demographic/Firmographic Profile:**
- Ages 21-35, college-educated, urban/suburban
- Host 2-5 gatherings per year (house parties, BBQs, game nights)
- Active on social media, particularly Instagram/TikTok
- Moderate tech comfort - can set up smart home devices but aren't developers

**Current Behaviors and Workflows:**
- Spend 2-3 hours creating Spotify playlists before events
- Constantly monitor and adjust music during parties
- Field song requests via texts or verbal asks
- Often hand phone to trusted friends for DJ duty

**Specific Needs and Pain Points:**
- Want to enjoy their own party instead of managing music
- Need music that adapts to crowd energy without intervention
- Struggle to balance diverse musical tastes
- Fear awkward silence or wrong vibe killing party momentum

**Goals They're Trying to Achieve:**
- Create memorable experiences guests will talk about
- Look like effortless, tech-savvy hosts
- Build reputation as someone who throws great parties
- Generate social media content from events

### Secondary User Segment: Aspiring Bedroom DJs

**Demographic/Firmographic Profile:**
- Ages 18-28, creative/artistic personality types
- Mix music as hobby, dream of playing venues
- 500-5K SoundCloud followers
- High tech literacy, comfortable with complex software

**Current Behaviors and Workflows:**
- Use Serato/Traktor/Virtual DJ at home
- Practice mixing 5-10 hours weekly
- Share mixes on SoundCloud/Mixcloud
- Bring laptop/controller to friends' parties

**Specific Needs and Pain Points:**
- Expensive DJ software/hardware barrier
- Can't easily mix streaming service tracks
- Limited opportunities to play for crowds
- Difficult to get real-time crowd feedback

**Goals They're Trying to Achieve:**
- Practice mixing in front of live audiences
- Build following and reputation
- Test track selection with real crowds
- Create viral mix moments for social media

## Goals & Success Metrics

### Business Objectives
- Achieve 10,000 unique DJ deck sessions within 3 months of launch
- Generate 50,000 QR scans for playlist contributions by month 6
- Reach 25% weekly active return rate for party hosts by month 4
- Create 5 viral TikTok moments (>100K views) featuring the DJ deck by month 6
- Convert 10% of users to premium features (if monetized) by year 1

### User Success Metrics
- Average party maintains continuous music for 3+ hours without host intervention
- 60% of party guests contribute at least one song via QR code
- DJ deck sessions generate average of 20+ song submissions per event
- 80% of hosts report reduced stress around music management
- 40% of sessions result in social media shares/posts

### Key Performance Indicators (KPIs)
- **Session Duration**: Average 2.5+ hours of active DJ deck usage per session
- **QR Conversion Rate**: 35%+ of QR scans result in song submission
- **Crowd Participation**: Average 8+ unique contributors per party session
- **Mix Quality Score**: 70%+ user satisfaction with automatic transitions (via feedback)
- **Viral Coefficient**: Each user brings 1.5+ new users through social sharing
- **Time to First Song**: <30 seconds from QR scan to song submission
- **Cross-Platform Usage**: 40% of sessions use both local files and streaming sources
- **Mobile Engagement**: 75% of QR submissions completed on mobile devices

## MVP Scope

### Core Features (Must Have)
- **Shadow Deck Interface:** Visual DJ deck with crossfader, EQ knobs, and BPM display that controls hidden audio players
- **Multi-Source Audio Support:** Drag-drop local MP3s (full WebAudio control), YouTube embeds, and SoundCloud integration
- **QR Playlist Submission:** Instant web form via QR scan for adding songs without app downloads or accounts
- **Perception Hack System:** Visual beat grids, transition effects, and sync indicators that create illusion of beatmatching
- **Mix Recording & Sharing:** Record DJ sessions and generate shareable clips for Instagram Reels (15-60s) and TikTok (up to 3min)
- **BPM-Synced Glitch Effects:** Integration with story-3.1-glitch-effects.md - glitch intensity pulses to detected/perceived BPM
- **Real-time Collaborative Queue:** WebSocket-powered playlist showing upcoming tracks with contributor names
- **Auto-Mix Mode:** AI-assisted transitions for smooth playback when DJ isn't actively mixing

### Out of Scope for MVP
- Professional DJ features (key detection, harmonic mixing, stems separation)
- Spotify integration (requires special licensing)
- Video mixing capabilities
- Multi-room synchronization
- Live streaming to external platforms
- Custom audio effects beyond basic EQ/filter
- Saved playlists and user accounts
- Native mobile apps

### MVP Success Criteria
The MVP succeeds when:
- A party host can run 2+ hours of continuous music without touching the interface
- At least 5 guests contribute songs via QR in a typical session
- Users can record and share a 30-second mix clip to social media within 2 taps
- The visual effects (including BPM-synced glitches) create believable DJ experience
- System handles mixed sources (local + streaming) in same session without crashes
- Mobile users complete song submission in under 30 seconds

### Integration with Glitch Effects (story-3.1)
- Glitch intensity maps to BPM: 60-90 BPM (subtle), 90-120 BPM (medium), 120-140 BPM (intense), 140+ BPM (maximum)
- Visual elements that glitch: DJ deck UI, song titles, waveforms, transition effects
- Glitch triggers: Beat hits, drop moments, crossfader movements, new track starts
- Performance target: Maintain 60fps even with simultaneous glitching and audio processing

## Post-MVP Vision

### Phase 2 Features
After MVP success, we'll expand with professional and social features:
- **Spotify Integration** (pending licensing): Full catalog access with proper agreements
- **AI Beat Matching**: Machine learning model trained on successful transitions
- **Stem Separation**: Isolate vocals/drums/bass for advanced mixing (using Demucs/Spleeter)
- **Live Streaming**: Broadcast sets to Twitch/YouTube with synchronized visuals
- **DJ Battle Mode**: Head-to-head mixing competitions with crowd voting
- **Custom Sound Effects**: User-uploadable samples, air horns, voice drops
- **Saved Sessions**: Cloud storage for playlists, recordings, and mix history
- **Virtual DJ Rooms**: Multi-user collaborative mixing with role assignments

### Long-term Vision (1-2 Years)
Transform Wibbly Wobblaz into the **"TikTok of DJing"** - a social platform where:
- Every user has a DJ profile showcasing their best mixes
- AI suggests tracks based on crowd energy and past success
- Brands sponsor virtual DJ battles and remix competitions  
- Integration with major music festivals for crowd-sourced opening sets
- NFT/blockchain verified mix ownership and royalty distribution
- AR/VR support for immersive 3D DJ experiences
- White-label solution for venues and event companies
- Educational pathway from beginner to professional DJ

### Expansion Opportunities
- **B2B Venue Package**: Licensed version for bars/clubs with content filtering, volume limits, and analytics
- **Wedding DJ Mode**: Curated playlists, special requests handling, key moment scheduling
- **Fitness Integration**: BPM-matched workouts synced to mix energy
- **Gaming Crossover**: DJ deck as rhythm game with scoring and achievements
- **API Platform**: Let developers build custom visualizers and effects
- **Hardware Bridge**: Connect physical DJ controllers for hybrid experience
- **Music Discovery Engine**: Surface emerging artists through crowd preferences
- **Educational Content**: Partner with DJ schools for tutorial integration

## Technical Considerations

### Platform Requirements
- **Target Platforms:** Web-first (Chrome, Safari, Firefox, Edge), Progressive Web App for mobile
- **Browser/OS Support:** Chrome 90+, Safari 14+, Firefox 88+, Edge 90+; iOS 14+, Android 10+
- **Performance Requirements:** 60fps UI animations, <100ms audio latency for local files, <2s load time, handles 100+ song playlists

### Technology Preferences
- **Frontend:** Next.js 14+ (existing), React 18, TypeScript, Tailwind CSS, Framer Motion for animations
- **Backend:** Node.js with Express/Fastify, WebSocket (Socket.io) for real-time, Redis for session management
- **Database:** PostgreSQL for persistent data, Redis for caching and queues
- **Hosting/Infrastructure:** Vercel for frontend, AWS/Railway for backend, CloudFlare CDN for assets

### Architecture Considerations
- **Repository Structure:** Monorepo with /apps/web (existing Next.js), /apps/dj-deck (new feature module), /packages/ui (shared components)
- **Service Architecture:** Microservices: deck-service (mixing logic), queue-service (playlist management), record-service (mix recording), social-service (sharing)
- **Integration Requirements:** YouTube IFrame API, SoundCloud Widget API, Web Audio API, MediaRecorder API for recording, Social media OAuth
- **Security/Compliance:** Content moderation for submissions, DMCA compliance via official APIs, Rate limiting on QR submissions, GDPR-compliant data handling

### Technical Implementation Details
```typescript
// Core architecture pattern
interface DJDeckArchitecture {
  audioEngine: {
    webAudio: WebAudioContext,      // For local files
    embedManager: EmbedOrchestrator, // YouTube/SoundCloud
    recorder: MediaRecorder,         // Mix recording
    bpmDetector: EssentiaWASM       // BPM analysis
  },
  visualLayer: {
    deckUI: ReactCanvas,            // Main interface
    glitchEngine: GlitchController, // BPM-synced effects
    beatGrid: VisualSync,           // Perception hack
    waveforms: WaveformRenderer     // Visual feedback
  },
  networking: {
    websocket: SocketIO,            // Real-time queue
    qrService: QRCodeGenerator,     // Playlist submission
    socialAPI: SocialShareService   // Instagram/TikTok
  }
}
```

### BPM-Glitch Integration Architecture
```typescript
// Sync with story-3.1-glitch-effects.md
interface BPMGlitchSync {
  bpmRanges: {
    ambient: { min: 60, max: 90, glitchIntensity: 'subtle' },
    house: { min: 90, max: 120, glitchIntensity: 'medium' },
    techno: { min: 120, max: 140, glitchIntensity: 'intense' },
    dnb: { min: 140, max: 180, glitchIntensity: 'maximum' }
  },
  syncPoints: ['kick', 'snare', 'drop', 'buildup'],
  glitchTargets: ['deckUI', 'songTitles', 'visualizers', 'transitions']
}
```

## Constraints & Assumptions

### Constraints
- **Budget:** Limited to existing development resources; no budget for licensed music APIs initially
- **Timeline:** MVP must launch within 6-8 weeks to capture summer party season
- **Resources:** Single development team, no dedicated audio engineer or licensing specialist
- **Technical:** Cannot extract audio from YouTube/SoundCloud (ToS); browser security limits iframe control; WebAudio only works with local files

### Key Assumptions
- Users will accept visual synchronization over true audio mixing
- Party guests will have smartphones capable of QR scanning
- 60fps visual effects will create convincing "DJ feel" without perfect beatmatching
- Social sharing of recorded mixes won't face copyright strikes (using official APIs)
- WebSocket infrastructure can handle 50+ concurrent users per session
- BPM detection accuracy of ~85% is sufficient for glitch effect synchronization
- Users will trust QR codes at parties (post-pandemic QR adoption)
- Existing Wibbly Wobblaz brand audience will embrace DJ functionality

## Risks & Open Questions

### Key Risks
- **Legal/Copyright Risk:** Mix recordings shared to social media could trigger DMCA takedowns despite using official APIs
- **Technical Debt Risk:** Shadow Deck architecture may become unmaintainable as complexity grows
- **User Adoption Risk:** QR friction might be higher than expected; users may not trust random QR codes
- **Performance Risk:** Multiple iframes + WebAudio + glitch effects could overwhelm mobile devices
- **Viral Failure Risk:** Feature might not achieve viral growth, limiting ROI on development effort
- **Browser Compatibility Risk:** Safari WebAudio quirks could break core functionality for iOS users
- **Scale Risk:** WebSocket architecture might not handle viral moment (e.g., influencer using at 500+ person event)
- **Brand Dilution Risk:** DJ feature could overshadow core Wibbly Wobblaz brand/product

### Open Questions
- How do we handle explicit content filtering for public venues?
- What's the optimal mix recording length for Instagram/TikTok virality?
- Should we implement user accounts eventually, or stay anonymous forever?
- How do we prevent trolling via QR submissions (Rick Rolling, inappropriate content)?
- Can we monetize without killing viral growth (freemium vs. ads vs. sponsorships)?
- What happens when YouTube/SoundCloud change their embed APIs?
- How do we handle BPM detection for tracks with tempo changes?
- Should glitch effects be opt-in or on by default?

### Areas Needing Further Research
- Competitor analysis of PlaylistPush, JQBX, Spotify Group Sessions adoption rates
- Technical feasibility study of WASM-based BPM detection accuracy
- Legal review of mix recording/sharing under fair use doctrine
- User research on QR code trust and friction at parties
- Performance benchmarking of multiple iframe approach on mid-range devices
- Market sizing for "social DJ" category
- Instagram/TikTok API limitations for automated sharing
- Accessibility requirements for users with visual/hearing impairments

## Appendices

### A. Research Summary

**From Our Elicitation Sessions:**
- Innovation Tournament identified "Pro-Am Hybrid" approach as optimal (32/40 score)
- Tree of Thoughts analysis confirmed Shadow Deck + Perception Hack as technically feasible
- Escape Room Challenge revealed creative workarounds for streaming API limitations
- Agile Team validated approach across PO, Dev, QA, and UX perspectives
- Stakeholder Round Table confirmed alignment from users, venue owners, investors, and legal

**Key Technical Discoveries:**
- WebAudio API provides full control for local files only
- YouTube/SoundCloud APIs allow volume/play control but not audio extraction
- Visual perception tricks can compensate for lack of true audio mixing
- BPM detection via Essentia.js WASM is client-side feasible

### B. References
- YouTube IFrame API Documentation: https://developers.google.com/youtube/iframe_api_reference
- SoundCloud Widget API: https://developers.soundcloud.com/docs/api/html5-widget
- Web Audio API MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- Essentia.js (BPM Detection): https://mtg.github.io/essentia.js/
- Glitch Effects Story: docs/stories/story-3.1-glitch-effects.md
- WebSocket Scaling Best Practices: Socket.io documentation
- Instagram/TikTok Sharing APIs: Platform developer documentation

## Next Steps

### Immediate Actions
1. Validate Shadow Deck proof-of-concept with YouTube embed + visual sync
2. Test BPM detection accuracy with Essentia.js on various genres
3. Create mockups of DJ interface with glitch effect integration
4. Build simple QR → WebSocket prototype for latency testing
5. Research Instagram/TikTok API limits for automated sharing
6. Review glitch effects story (story-3.1) for integration points
7. Conduct user interviews with 5 party hosts about QR trust

### PM Handoff
This Project Brief provides the full context for Wibbly Wobblaz DJ Deck. Please start in 'PRD Generation Mode', review the brief thoroughly to work with the user to create the PRD section by section as the template indicates, asking for any necessary clarification or suggesting improvements.

The Shadow Deck + Perception Hack approach addresses technical constraints while delivering viral potential through QR-based collaboration and social sharing. Integration with BPM-synced glitch effects creates unique brand cohesion.