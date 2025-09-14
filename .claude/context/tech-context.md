---
created: 2025-09-08T19:17:52Z
last_updated: 2025-09-15T00:15:00Z
version: 1.1
author: Claude Code PM System
---

# Technology Context

## Core Technologies

### Framework & Runtime
- **Next.js**: 15.2.4 (Latest App Router architecture)
- **React**: 19 (Latest version)
- **TypeScript**: 5.x (Strict mode enabled)
- **Node.js**: Required for development

### Package Management
- **Primary**: Yarn (yarn.lock present)
- **Alternative**: pnpm (pnpm-lock.yaml present)
- **NPM Scripts**: Standard Next.js commands

## Dependencies Overview

### UI Component Libraries
**Radix UI** (Complete suite - 27 packages):
- Primitives for accessible, unstyled components
- Version range: 1.1.x - 2.2.x
- Includes: Dialog, Dropdown, Accordion, Tabs, Toast, etc.
- Foundation for shadcn/ui component system

### Styling & Theming
- **PandaCSS**: Primary styling solution (migrated from Tailwind)
- **Tailwind CSS**: 3.4.17 (being phased out)
- **tailwindcss-animate**: 1.0.7 (Animation utilities)
- **tailwind-merge**: 2.5.5 (Class conflict resolution)
- **class-variance-authority**: 0.7.1 (Component variants)
- **next-themes**: 0.4.4 (Dark/light mode support)

### Form Handling
- **react-hook-form**: 7.54.1 (Form state management)
- **@hookform/resolvers**: 3.9.1 (Validation resolvers)
- **zod**: 3.24.1 (Schema validation)
- **input-otp**: 1.4.1 (OTP input component)

### Data Visualization
- **recharts**: 2.15.0 (React charts library)

### Date & Time
- **date-fns**: 4.1.0 (Date utility library)
- **react-day-picker**: 8.10.1 (Calendar component)

### UI Utilities
- **lucide-react**: 0.454.0 (Icon library)
- **clsx**: 2.1.1 (Conditional classes)
- **cmdk**: 1.0.4 (Command menu)
- **sonner**: 1.7.1 (Toast notifications)
- **vaul**: 0.9.6 (Drawer component)
- **embla-carousel-react**: 8.5.1 (Carousel/slider)
- **react-resizable-panels**: 2.1.7 (Resizable layouts)

### Analytics & Performance
- **@vercel/analytics**: 1.5.0 (Vercel Analytics integration)
- **@next/bundle-analyzer**: 15.5.3 (Bundle size analysis)

### Development Dependencies
- **TypeScript**: 5.x
- **@types/react**: 19
- **@types/react-dom**: 19
- **@types/node**: 22
- **PostCSS**: 8.5
- **Autoprefixer**: 10.4.20

## Build & Development Tools

### Build Configuration
```javascript
// next.config.mjs
{
  eslint: { ignoreDuringBuilds: true },    // ⚠️ WARNING
  typescript: { ignoreBuildErrors: true }, // ⚠️ WARNING
  images: { unoptimized: true }           // ⚠️ WARNING
}
```

### Available Scripts
```json
{
  "dev": "next dev",                      // Development server (port 3000)
  "build": "next build",                  // Production build
  "start": "next start",                  // Production server
  "lint": "next lint",                    // ESLint checking
  "panda:watch": "panda codegen --watch", // PandaCSS development mode
  "test": "playwright test",              // Run all tests
  "test:visual": "playwright test tests/visual/", // Visual regression tests
  "test:visual:update": "playwright test tests/visual/ --update-snapshots",
  "analyze": "ANALYZE=true npm run build", // Bundle analysis
  "perf:benchmark": "node scripts/performance-benchmark.js", // Performance testing
  "perf:lighthouse": "node scripts/lighthouse-audit.js"      // Lighthouse audit
}
```

### TypeScript Configuration
- **Target**: ES2017
- **Module**: ESNext with Bundler resolution
- **Strict Mode**: Enabled
- **Path Aliases**: `@/*` → project root
- **JSX**: Preserve

### Tailwind Configuration
- **Content Paths**: All .tsx/.ts files in app, components, pages
- **Custom Theme Extensions**: 
  - CSS variable-based color system
  - Custom animations (accordion, slide)
  - Custom keyframes
  - Font family: "Hegval" custom font

## Testing Infrastructure

### Testing Frameworks (NEW)
- **Playwright**: 1.55.0 (E2E and visual regression testing)
- **@playwright/test**: 1.55.0 (Test runner)
- **Visual Regression**: Custom visual testing setup
- **Performance Testing**: Custom benchmark scripts

### Performance Tools (NEW)
- **Lighthouse**: 12.8.2 (Web performance auditing)
- **Puppeteer**: 24.20.0 (Browser automation)
- **gzip-size**: 7.0.0 (Bundle size analysis)

## Missing Technologies

### CI/CD
- **No GitHub Actions** workflows
- **No deployment configuration**
- **No environment variables** setup

### State Management
- **No global state** library (Redux, Zustand, etc.)
- Local React state only

### API & Backend
- **No API routes** defined
- **No database** integration
- **No authentication** system

## Version Compatibility

### React 19 Considerations
- Latest React version (19) in use
- Potential compatibility issues with older packages
- Server Components and Suspense fully supported

### Next.js 15 Features
- App Router (modern routing system)
- Server Components by default
- Improved performance and caching
- Partial Prerendering support

## Security Considerations

1. **Build Warnings Disabled**: Type and lint errors ignored
2. **No Environment Variables**: Sensitive data might be hardcoded
3. **External Links**: Properly configured with `rel="noopener noreferrer"`
4. **No API Security**: No authentication or rate limiting

## Performance Optimizations

### Current
- Component code splitting via dynamic imports
- Tailwind CSS purging unused styles
- React 19 optimizations

### Missing
- Image optimization disabled
- No CDN configuration
- No caching strategies
- Bundle analysis available but not automated

## Development Environment Requirements

### Minimum Requirements
- Node.js 18+ (for Next.js 15)
- 4GB RAM for development server
- Modern browser for testing

### Recommended Setup
- VS Code with TypeScript support
- PandaCSS IntelliSense (replacing Tailwind CSS IntelliSense)
- ESLint and Prettier extensions
- React Developer Tools
- Playwright Test extension for VS Code

## Update History
- 2025-09-14: Added PandaCSS migration, new testing infrastructure, performance tools