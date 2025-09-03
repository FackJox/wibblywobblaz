# Wibbly Wobblaz Landing Page - Brownfield Architecture Document

## Project Overview

**Project Name**: Wibbly Wobblaz Landing Page  
**Type**: Electronic Music Event Platform / Band Landing Page  
**Current State**: Production-Ready MVP  
**Documentation Date**: 2025-09-03  
**Architecture Type**: Brownfield (Existing System)

## Executive Summary

Wibbly Wobblaz is a Next.js-based landing page for an electronic music collective/event series. The application features a two-page system (Links/Parties) with mobile-responsive design, custom branding using the Hegval font, and a comprehensive Radix UI component library integration. The project is well-structured for enhancement with microinteractions and animation systems.

## Tech Stack Analysis

### Core Framework
- **Next.js 15.2.4** - Latest App Router architecture
- **React 19** - Cutting-edge React version
- **TypeScript 5.x** - Full type safety

### Styling & UI
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Tailwind Animate** - Animation utilities plugin
- **Radix UI** - Complete component library (40+ components)
- **Custom Font**: Hegval (TTF) - Brand-specific typography

### State & Forms
- **React Hook Form 7.54.1** - Form management
- **Zod 3.24.1** - Schema validation
- **Class Variance Authority** - Component variant management

### Build & Development
- **Node.js** - Runtime environment
- **npm/yarn** - Package management (both lock files present)
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Project Structure

```
wibbly-wobblaz-landing/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main page component (client-side)
│   └── globals.css        # Global styles with Tailwind
├── components/
│   ├── ui/                # Radix UI components (40+ files)
│   └── theme-provider.tsx # Theme management
├── lib/
│   └── utils.ts           # Utility functions (cn for className merging)
├── public/
│   ├── images/            # Image assets
│   └── hegval.ttf         # Custom font file
├── docs/                  # Documentation
│   ├── epic-microinteractions.md
│   └── stories/           # Implementation stories
└── styles/                # Additional styles
```

## Current Functionality

### Page System
1. **Links Page** (Default)
   - Social media links (Instagram, TikTok, SoundCloud, YouTube)
   - Brand logo display
   - Contact email link
   - Split-screen layout (desktop)

2. **Parties Page**
   - Event listings with flyer images
   - Date, time, venue information
   - Currently shows "Coming Soon" state
   - Commented-out animation bounce-back feature

### Navigation
- Sticky header with brand name
- Desktop: Inline navigation buttons
- Mobile: Hamburger menu with slide-out navigation
- Active state indicators
- Page transition system (800ms duration)

### Responsive Design
- Mobile-first approach
- Breakpoint: md (768px)
- Custom scroll optimization for mobile
- Touch-friendly interaction areas

## Key Components & Patterns

### Component Architecture
```typescript
// Main page component structure
WibblyWobblazLanding (Client Component)
├── Navigation (Sticky)
│   ├── Desktop Nav
│   └── Mobile Menu
├── Page Content Container
│   ├── LinksPage Component
│   └── PartiesPage Component
```

### State Management
- Local state via React hooks
- Page state: `"links" | "parties"`
- Mobile menu state
- Transition state for animations
- Shhh animation state (currently disabled)

### Styling Patterns
- Tailwind utility classes
- CSS custom properties for theming
- Dark mode support (CSS variables defined)
- Custom animations (accordion only currently)

## Integration Points

### For Microinteractions Enhancement
1. **Button Components** (`components/ui/button.tsx`)
   - Ready for ripple effects
   - Variant system in place
   - Click handlers established

2. **Navigation Elements**
   - Clear component boundaries
   - Hover states defined
   - Ready for magnetic effects

3. **Page Transitions**
   - Existing transition system (800ms)
   - State management in place
   - Ready for liquid morphing

4. **Cards & Content**
   - Event cards structure
   - Social links as interactive elements
   - Image containers for parallax

### Animation Hooks
- `isTransitioning` state for coordinating animations
- `scrollContainerRef` for scroll-based effects
- Timeout-based transitions ready for spring physics

## Technical Debt & Considerations

### Code Quality
1. **Good Practices**:
   - TypeScript throughout
   - Component modularity
   - Responsive design implementation
   - Comprehensive UI component library

2. **Areas for Improvement**:
   - No test files present
   - No error boundaries
   - Limited accessibility attributes
   - No performance monitoring

### Performance Considerations
- Large Radix UI bundle (40+ components imported)
- No code splitting beyond Next.js defaults
- Images not optimized (using Next/Image but no sizing strategy)
- No lazy loading for below-fold content

### Commented Code
- Parties page animation logic commented out (lines 29-55 in page.tsx)
- Appears to be a bounce-back animation feature
- May have been causing issues or incomplete

## Modification Guidelines

### Safe Enhancement Areas
1. **Animation Layer**
   - Add as wrapper components
   - Use existing refs and state
   - Preserve existing functionality

2. **Component Enhancement**
   - Extend rather than replace Radix components
   - Use composition pattern
   - Maintain TypeScript types

3. **Style Additions**
   - Use Tailwind utilities where possible
   - Add animations via tailwind.config.ts
   - Keep specificity low

### Risk Areas
1. **State Management**
   - Page transition logic is central
   - Mobile menu state affects layout
   - Be careful with ref manipulations

2. **Performance**
   - Monitor bundle size increases
   - Test on low-end mobile devices
   - Watch for animation frame drops

## Recommended Implementation Approach

### Phase 1: Foundation
1. Install animation libraries (Framer Motion, React Spring)
2. Create animation utility hooks
3. Setup performance monitoring
4. Add animation constants/tokens

### Phase 2: Progressive Enhancement
1. Wrap existing components
2. Add animation layers
3. Enhance interactions
4. Test thoroughly

### Phase 3: Optimization
1. Code split animation features
2. Add loading strategies
3. Implement performance budgets
4. Setup monitoring

## Environment & Deployment

### Development Setup
```bash
npm install  # or yarn install
npm run dev  # Start development server
```

### Build Process
```bash
npm run build  # Production build
npm run start  # Production server
```

### Key Scripts
- `dev`: Next.js development server
- `build`: Production build
- `start`: Production server
- `lint`: ESLint checking

## Security & Best Practices

### Current Security
- No exposed API keys in code
- No database connections
- Client-side only implementation
- External links use rel="noopener noreferrer"

### Recommendations
1. Add Content Security Policy
2. Implement rate limiting for animations
3. Add error boundaries
4. Include accessibility testing

## Migration Path

### From Current to Enhanced
1. **Non-Breaking Additions**
   - Animation wrappers
   - Progressive enhancement
   - Feature flags for rollback

2. **Testing Strategy**
   - Component-level testing
   - Performance benchmarking
   - Cross-browser validation
   - Mobile device testing

3. **Rollback Plan**
   - Feature flags for all animations
   - CSS-only fallbacks
   - Component prop controls

## Conclusion

The Wibbly Wobblaz landing page is a well-structured Next.js application with modern tooling and a solid foundation for enhancement. The existing architecture supports the addition of comprehensive microinteractions without requiring major refactoring. The main considerations are performance monitoring, progressive enhancement, and maintaining the existing user experience while adding delight through animations.

### Key Strengths
- Modern tech stack
- Clean component structure  
- Responsive design implemented
- TypeScript throughout

### Key Opportunities
- Rich animation potential
- Component enhancement ready
- Performance optimization possible
- User experience improvements

### Next Steps
1. Implement Story 1.1 (Animation Infrastructure)
2. Add performance monitoring
3. Begin progressive enhancement
4. Test and iterate

---

*This document serves as the technical foundation for the microinteractions implementation project. All enhancement stories should reference this architecture for context and constraints.*