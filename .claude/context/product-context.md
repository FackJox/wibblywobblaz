---
created: 2025-09-08T19:17:52Z
last_updated: 2025-09-08T19:17:52Z
version: 1.0
author: Claude Code PM System
---

# Product Context

## Product Definition

### What is Wibbly Wobblaz?
A landing page and digital presence for an underground electronic music collective and event series based in Bristol, UK. The product serves as the primary touchpoint between the collective and their audience.

### Product Type
- **Category**: Music/Entertainment Landing Page
- **Platform**: Web (Mobile-first responsive)
- **Distribution**: Public website

## Target Users

### Primary Audience
**Underground Music Enthusiasts (18-35)**
- Fans of electronic, experimental, and underground music
- Active on social media (Instagram, TikTok)
- Attend live music events regularly
- Value authentic, non-commercial music experiences
- Based primarily in Bristol and surrounding areas

### Secondary Audience
**Event Promoters & Venues**
- Looking for emerging acts and collectives
- Interested in booking or collaboration
- Need professional contact information

### User Behaviors
- Access primarily via mobile devices
- Share events with friends via social media
- Purchase tickets in advance
- Follow on multiple social platforms
- Check for upcoming events regularly

## Core Functionality

### Current Features

#### 1. Links Hub
- **Social Media Links**: Direct access to Instagram and SoundCloud
- **Ticket Purchasing**: "GET TICKETS" call-to-action
- **Merchandise**: "CHECK OUT OUR MERCH" link
- **Visual Identity**: Custom typography and branding

#### 2. Events Calendar
- **Upcoming Events Display**: Date, venue, location format
- **Event Posters**: Visual representation of each event
- **Ticket Links**: Individual ticket purchase for each event
- **Venue Information**: Specific location details

#### 3. Navigation System
- **Page Transition**: Smooth sliding between Links and Parties
- **Mobile Menu**: Hamburger menu for mobile devices
- **Visual Feedback**: Animation states during transitions

### Documented But Not Implemented

#### 1. Decks Feature (Audio Mixing)
From documentation:
- Virtual DJ decks interface
- Audio mixing capabilities
- Real-time queue management
- QR code submission system
- Mix recording and sharing

#### 2. Microinteractions System
From documentation:
- Ripple effects on interactions
- Magnetic navigation elements
- Glitch effects for branding
- 3D card tilts
- Haptic feedback support

## User Journeys

### Primary Journey: Event Discovery
1. User lands on Links page
2. Navigates to Parties page
3. Views upcoming events
4. Clicks ticket link
5. Redirected to ticket vendor

### Secondary Journey: Social Connection
1. User lands on Links page
2. Clicks social media link
3. Follows on platform
4. Returns for event updates

### Tertiary Journey: Merchandise Purchase
1. User lands on Links page
2. Clicks merch link
3. Browses and purchases merchandise

## Core Requirements

### Functional Requirements
- **R1**: Display upcoming events with dates and venues ✅
- **R2**: Provide ticket purchase links ✅
- **R3**: Link to social media profiles ✅
- **R4**: Mobile-responsive design ✅
- **R5**: Fast page load times ⚠️ (images unoptimized)
- **R6**: Smooth animations and transitions ✅

### Non-Functional Requirements
- **Performance**: Sub-3 second initial load
- **Accessibility**: Keyboard navigable, screen reader friendly
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Mobile First**: Optimized for mobile devices
- **SEO**: Basic meta tags and descriptions

## Use Cases

### UC1: Check Next Event
**Actor**: Music Fan
**Goal**: Find details about the next party
**Steps**:
1. Open website
2. Navigate to Parties
3. View next event date and venue
4. Click for tickets

### UC2: Follow on Social Media
**Actor**: New Fan
**Goal**: Connect on social platforms
**Steps**:
1. Open website
2. View Links page
3. Click preferred social platform
4. Follow account

### UC3: Share Event
**Actor**: Existing Fan
**Goal**: Share event with friends
**Steps**:
1. Navigate to Parties
2. Screenshot or copy event details
3. Share via messaging/social media

## Business Goals

### Primary Objectives
1. **Drive Ticket Sales**: Convert visitors to event attendees
2. **Build Community**: Grow social media following
3. **Brand Awareness**: Establish visual identity and presence
4. **Merchandise Sales**: Generate revenue through merch

### Success Metrics
- Ticket link click-through rate
- Social media follower growth
- Page views and unique visitors
- Time on site
- Mobile vs desktop usage
- Event attendance correlation

## Competitive Landscape

### Direct Competitors
- Other Bristol music collectives
- Underground event promoters
- Electronic music event pages

### Differentiation
- Unique visual aesthetic (custom font, animations)
- Underground/authentic positioning
- Multi-venue presence
- Combined merchandise offering

## Content Management

### Current State
- **Static Content**: Hardcoded in component
- **Manual Updates**: Code changes required
- **No CMS**: Direct code editing needed

### Content Types
1. **Event Information**: Date, venue, location, poster
2. **Social Links**: Platform URLs
3. **Merchandise Link**: External store URL
4. **Branding Assets**: Logo, fonts, colors

## Platform Requirements

### Technical Requirements
- Modern JavaScript support
- CSS Grid/Flexbox support
- ES6+ features
- WebP image format support

### Device Support
- **Mobile**: iOS Safari, Chrome Android
- **Tablet**: iPad, Android tablets
- **Desktop**: All modern browsers
- **Minimum Resolution**: 320px width

## Future Considerations

### Planned Features (from docs)
1. Live streaming integration
2. Artist profiles and bios
3. Mix archives and playback
4. Community features
5. Newsletter signup
6. Photo galleries from events

### Scalability Needs
- Dynamic content management
- Multi-language support
- Analytics integration
- Email marketing integration
- Payment processing for merch