---
name: decks
description: Virtual DJ mixing interface with collaborative queue management for Wibbly Wobblaz events
status: backlog
created: 2025-09-08T19:57:20Z
---

# PRD: Decks

## Executive Summary

The Decks feature transforms the Wibbly Wobblaz platform into an innovative web-based DJ mixing interface that bridges the gap between professional DJs and event attendees. This feature enables real-time music mixing through a browser-based dual-deck system while introducing a revolutionary collaborative queue management system where party-goers can submit track requests via QR codes. The platform democratizes the DJ experience while maintaining professional-grade mixing capabilities, perfectly embodying Wibbly Wobblaz's "underground spirit, professional execution" philosophy.

## Problem Statement

### What problem are we solving?

Currently, there's a disconnect between DJs and audiences at underground events. DJs operate in isolation with pre-planned sets, while attendees have no input into the music selection. Additionally, aspiring DJs face high barriers to entry with expensive equipment and software. The traditional DJ setup creates a hierarchical divide that contradicts the collaborative spirit of underground music culture.

### Why is this important now?

1. **Community Engagement**: Post-pandemic, audiences crave more interactive and participatory experiences at events
2. **Accessibility**: Rising cost of DJ equipment excludes many talented individuals from the scene
3. **Digital Evolution**: Web Audio API and modern browsers now enable professional-grade audio processing
4. **Brand Differentiation**: Positions Wibbly Wobblaz as innovative leaders in the Bristol underground scene
5. **Revenue Opportunity**: Creates new engagement touchpoints for ticket sales and community building

## User Stories

### Primary User Personas

#### 1. The Professional DJ ("Marcus")
- **Background**: Regular Wibbly Wobblaz DJ, 5+ years experience
- **Needs**: Reliable mixing interface, crowd engagement tools, ability to maintain artistic control
- **Pain Points**: Heavy equipment transport, inability to gauge crowd energy, limited audience interaction

**User Journey**:
1. Opens Decks on tablet/laptop at venue
2. Loads prepared tracks and opens collaborative queue
3. Displays QR code on venue screens
4. Receives and curates audience submissions
5. Seamlessly blends crowd requests with planned set
6. Records mix for later distribution

#### 2. The Aspiring DJ ("Sofia")
- **Background**: Music enthusiast, wants to learn mixing, limited budget
- **Needs**: Accessible tools, learning resources, practice environment
- **Pain Points**: Cost of equipment, complexity of professional software, lack of audience feedback

**User Journey**:
1. Accesses Decks from home
2. Practices mixing with tutorial mode
3. Records practice sessions
4. Shares mixes with community for feedback
5. Graduates to performing at smaller events

#### 3. The Active Attendee ("James")
- **Background**: Regular at underground events, deep music knowledge
- **Needs**: Influence music selection, share discoveries, engage with the performance
- **Pain Points**: Passive listening experience, unable to share track suggestions, disconnection from DJ

**User Journey**:
1. Scans QR code at event
2. Browses and submits track requests
3. Sees submission appear in queue
4. Votes on other submissions
5. Celebrates when their track gets mixed in

### Detailed User Flows

#### Core Mixing Flow
1. User loads two tracks into deck A and deck B
2. Starts playback on deck A
3. Cues deck B using headphone preview
4. Beatmatches using visual waveforms and BPM display
5. Uses crossfader to blend between tracks
6. Applies EQ adjustments for smooth transition
7. Optionally records the mix

#### Collaborative Queue Flow
1. DJ generates unique session QR code
2. Attendees scan code on mobile devices
3. Submission interface opens (no app required)
4. Users search/submit tracks from integrated catalog
5. Submissions appear in real-time queue
6. DJ reviews, approves, and queues tracks
7. System notifies users when their track plays

## Requirements

### Functional Requirements

#### Core Mixing Features
- **FR-1**: Dual deck interface with independent controls
- **FR-2**: Play, pause, cue, and loop functionality per deck
- **FR-3**: Tempo/pitch adjustment (±8% minimum)
- **FR-4**: 3-band EQ (high, mid, low) per channel
- **FR-5**: Crossfader with curve adjustment
- **FR-6**: Visual waveform display with zoom capability
- **FR-7**: BPM detection and display (±0.1 BPM accuracy)
- **FR-8**: Headphone cue system with mix/cue balance
- **FR-9**: Auto-sync/beatmatch assistance (optional)
- **FR-10**: Hot cue points (minimum 4 per deck)

#### Collaborative Features
- **FR-11**: QR code generation for session sharing
- **FR-12**: Mobile-optimized submission interface
- **FR-13**: Real-time queue updates via WebSocket
- **FR-14**: Track voting/ranking system
- **FR-15**: DJ moderation tools (approve/reject/reorder)
- **FR-16**: Submission limits per user (configurable)
- **FR-17**: Track search with filters (genre, BPM, key)
- **FR-18**: Queue position notifications

#### Recording & Sharing
- **FR-19**: Mix recording with metadata
- **FR-20**: Export to common formats (MP3, WAV)
- **FR-21**: Social sharing integration
- **FR-22**: Mix replay functionality
- **FR-23**: Tracklist generation with timestamps

#### Additional Features
- **FR-24**: Offline mode for core mixing
- **FR-25**: Keyboard shortcuts for all major functions
- **FR-26**: MIDI controller support (stretch goal)
- **FR-27**: Effects rack (filters, delays, reverbs)
- **FR-28**: Track library management
- **FR-29**: Auto-mix mode for continuous playback

### Non-Functional Requirements

#### Performance
- **NFR-1**: Audio latency < 20ms for real-time mixing
- **NFR-2**: Waveform rendering at 60fps minimum
- **NFR-3**: WebSocket message delivery < 100ms
- **NFR-4**: Page load time < 3 seconds on 4G
- **NFR-5**: Support 50+ concurrent queue participants
- **NFR-6**: Audio processing CPU usage < 40% on mid-range devices

#### Security
- **NFR-7**: Session-based authentication for DJ controls
- **NFR-8**: Rate limiting for track submissions
- **NFR-9**: Content filtering for inappropriate submissions
- **NFR-10**: Secure WebSocket connections (WSS)
- **NFR-11**: CORS protection for API endpoints

#### Scalability
- **NFR-12**: Horizontal scaling for WebSocket servers
- **NFR-13**: CDN distribution for audio assets
- **NFR-14**: Database sharding for session data
- **NFR-15**: Graceful degradation under load

#### Accessibility
- **NFR-16**: WCAG AA compliance for controls
- **NFR-17**: Keyboard navigation for all features
- **NFR-18**: Screen reader support for key functions
- **NFR-19**: High contrast mode option
- **NFR-20**: Minimum touch target 44x44px

#### Compatibility
- **NFR-21**: Chrome 90+, Firefox 88+, Safari 14+
- **NFR-22**: Responsive design (mobile, tablet, desktop)
- **NFR-23**: Progressive Web App capabilities
- **NFR-24**: Fallback for unsupported browsers

## Success Criteria

### Primary Metrics
- **Engagement Rate**: 30% of event attendees use QR submission feature
- **Mix Completion**: 70% of started mixing sessions last > 10 minutes
- **Recording Shares**: 25% of recorded mixes are shared socially
- **Return Usage**: 40% weekly active users return following week
- **Queue Participation**: Average 15 submissions per event session

### Secondary Metrics
- **Learning Progression**: 20% of practice users perform at events within 6 months
- **Cross-Platform Usage**: 35% of users access on multiple devices
- **Community Growth**: 15% monthly increase in registered DJs
- **Technical Reliability**: 99.5% uptime during peak event hours
- **Mobile Adoption**: 60% of queue submissions from mobile devices

### Qualitative Success Indicators
- Positive feedback from professional DJs on usability
- Increased audience engagement reported at events
- Community-generated tutorial content
- Organic social media mentions and shares
- DJ adoption without marketing push

## Constraints & Assumptions

### Technical Constraints
- **Browser Limitations**: Web Audio API constraints on some mobile browsers
- **Network Dependency**: Real-time features require stable internet
- **Audio Quality**: Limited by browser audio processing capabilities
- **Storage**: Local storage limits for offline track caching
- **Processing Power**: High CPU usage on older devices

### Resource Constraints
- **Development Team**: Single developer resource
- **Timeline**: 6-week development cycle for MVP
- **Budget**: Limited to existing infrastructure costs
- **Testing**: No dedicated QA resource
- **Design**: Using existing component library

### Business Constraints
- **Licensing**: Music licensing for practice tracks
- **Monetization**: Must remain free for basic features
- **Brand**: Must maintain underground aesthetic
- **Competition**: Cannot directly compete with professional DJ software

### Assumptions
- Users have modern browsers with Web Audio API support
- Event venues have reliable WiFi for attendees
- DJs willing to embrace collaborative approach
- Attendees comfortable with QR code interactions
- Music catalog partnerships can be established

## Out of Scope

### Explicitly Not Building (Phase 1)
- **Professional Features**: Video mixing, advanced effects, timecode vinyl
- **Music Production**: DAW features, track editing, stem separation
- **Streaming**: Live streaming to external platforms
- **Mobile App**: Native iOS/Android applications
- **Hardware**: Custom controller manufacturing
- **AI Features**: Automatic mixing, track recommendation engine
- **Social Network**: Full social platform with profiles, follows, messages
- **Marketplace**: Track sales, sample packs, preset sharing
- **Multi-Room**: Synchronized playback across multiple spaces
- **Analytics**: Detailed crowd analytics, heatmaps, mood tracking

### Future Considerations (Phase 2+)
- Integration with Spotify/SoundCloud APIs
- MIDI controller mappings
- Advanced effects and filters
- Multi-deck support (3-4 decks)
- Key detection and harmonic mixing
- Stem separation for live remixing
- Virtual reality DJ environment
- Blockchain-based mix authentication

## Dependencies

### External Dependencies
- **Web Audio API**: Core browser technology for audio processing
- **WebSocket Infrastructure**: Real-time communication service
- **Music Catalog API**: Track database and metadata service
- **CDN Services**: Audio file delivery and caching
- **Authentication Service**: User session management
- **Payment Processor**: For future premium features

### Internal Dependencies
- **Component Library**: Existing Radix/shadcn components
- **Design System**: Current theming and styling framework
- **Event System**: Integration with existing party/event features
- **User Management**: Existing authentication if available
- **Analytics Platform**: Current tracking implementation

### Third-Party Services
- **Audio Streaming**: Service for track delivery
- **Cloud Storage**: Mix recording storage
- **WebRTC**: For potential peer-to-peer features
- **Search Service**: Track search and indexing
- **Social APIs**: Sharing to Instagram, SoundCloud

## Risk Assessment

### High-Risk Items
- **Browser Compatibility**: Web Audio API inconsistencies
- **Music Licensing**: Legal implications of track usage
- **Performance**: Real-time audio processing on low-end devices
- **Network Latency**: Impact on collaborative features
- **User Adoption**: DJs resistant to collaborative approach

### Mitigation Strategies
- Progressive enhancement for unsupported browsers
- Clear terms of service and DMCA compliance
- Performance profiling and optimization cycles
- Offline mode for core features
- Gradual rollout with feedback loops

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Basic dual-deck interface
- Audio playback and controls
- Simple crossfader implementation
- Local file loading

### Phase 2: Core Mixing (Weeks 3-4)
- BPM detection
- Waveform visualization
- EQ controls
- Headphone cueing

### Phase 3: Collaboration (Week 5)
- QR code generation
- Basic queue system
- WebSocket integration
- Mobile submission interface

### Phase 4: Polish & Launch (Week 6)
- Mix recording
- Social sharing
- Performance optimization
- Beta testing with DJs

## Appendix

### Technical Architecture Notes
- Consider Shadow DOM for component isolation
- Implement Web Workers for audio processing
- Use IndexedDB for offline track storage
- WebAssembly for performance-critical audio code

### Competitive Analysis
- **Mixxx**: Open-source, desktop-only, complex interface
- **DJ.Studio**: Browser-based, subscription model, no collaboration
- **Mixcloud Live**: Streaming focus, not real-time mixing
- **Unique Value**: Only platform combining professional mixing with crowd collaboration

### Success Stories Reference
- Twitch Plays Pokémon: Crowd collaboration proof of concept
- Endlesss: Collaborative music creation platform
- Splice: Community-driven sample sharing

---

*This PRD represents the comprehensive vision for the Decks feature. Implementation should follow an iterative approach with continuous user feedback and validation at each phase.*