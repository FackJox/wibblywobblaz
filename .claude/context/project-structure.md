---
created: 2025-09-08T19:17:52Z
last_updated: 2025-09-15T14:03:37Z
version: 1.2
author: Claude Code PM System
---

# Project Structure

## Root Directory Organization

```
wibbly-wobblaz-landing/
├── app/                    # Next.js App Router directory
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main landing page component
│   └── globals.css        # Global styles and animations
├── components/            # React components
│   ├── ui/               # Shadcn/UI components (43 files)
│   └── theme-provider.tsx # Theme management wrapper
├── lib/                   # Utility functions
│   └── utils.ts          # cn() utility for class merging
├── public/               # Static assets
│   ├── images/          # Event posters and assets
│   │   ├── 1/          # Hot Series Dixies Chicken artwork
│   │   ├── 2/          # Poster/flyer designs
│   │   ├── 3/          # STGARTER event assets
│   │   └── 4/          # Dayglo poster variations
│   └── fonts/           # Custom fonts (Hegval)
├── styles/              # Additional styles
├── .claude/             # Claude Code PM system
│   ├── context/         # Project context docs
│   ├── docs/           # Feature documentation
│   ├── epics/          # Epic tracking and documentation
│   ├── prds/           # Product requirement documents
│   ├── rules/          # PM rules and guidelines
│   ├── scripts/        # PM automation scripts
│   └── templates/      # Document templates
├── docs/               # Project documentation
│   └── VISUAL_REGRESSION_TESTING.md  # Visual testing setup (NEW)
├── tests/              # Test infrastructure (NEW)
│   └── visual/         # Visual regression tests
├── scripts/            # Performance and testing scripts (NEW)
│   ├── performance-benchmark.js
│   ├── lighthouse-audit.js
│   └── bundle-size-analysis.js
├── performance-results/ # Performance metrics (NEW)
│   └── bundle-analysis files
├── playwright-report/   # Test results (NEW)
│   └── data/           # Visual test snapshots
└── .olddocs/           # Archived documentation

## Key Files

### Configuration Files
- `next.config.mjs` - Next.js configuration (⚠️ build checks disabled)
- `panda.config.ts` - PandaCSS configuration (primary styling system)
- ~~`tailwind.config.ts`~~ - REMOVED (was Tailwind CSS configuration)
- `tsconfig.json` - TypeScript configuration (strict mode)
- `package.json` - Dependencies and scripts (Tailwind dependencies removed)
- `components.json` - Shadcn/UI configuration
- `playwright.config.ts` - Playwright test configuration
- `eslint.config.mjs` - ESLint configuration for PandaCSS

### Application Files
- `app/page.tsx` - Main application (816 lines, monolithic component)
- `app/layout.tsx` - Root layout with metadata configuration
- `app/globals.css` - Global styles, animations, custom properties

### Component Library (`components/ui/`)
43 pre-built UI components including:
- `accordion.tsx` - Expandable content sections
- `button.tsx` - Button component with variants
- `card.tsx` - Card container components
- `dialog.tsx` - Modal dialogs
- `carousel.tsx` - Image/content carousel
- `calendar.tsx` - Date picker component
- `chart.tsx` - Data visualization (Recharts)
- `form.tsx` - Form components with validation
- `toast.tsx` - Notification system (Sonner)
- And 34 more UI components...

## File Naming Patterns

### Components
- **Pattern**: `kebab-case.tsx`
- **Examples**: `theme-provider.tsx`, `scroll-area.tsx`
- **Location**: `/components/ui/` for UI components

### Documentation
- **Pattern**: `kebab-case.md` with numbered prefixes for stories
- **Examples**: `1.1-animation-infrastructure.md`, `project-overview.md`
- **Organization**: Hierarchical by feature/epic

### Styles
- **Global**: `globals.css` in app directory
- **Component**: PandaCSS patterns and recipes
- **Theme**: CSS variables in `:root` selector
- **Generated**: `styled-system/` directory from PandaCSS

## Module Organization

### Feature Structure (Documented but not implemented)
```
docs/stories/[feature]/
├── [feature]-prd.md           # Product requirements
├── [feature]-architecture.md   # Technical design
├── [feature]-front-end-spec.md # Frontend specifications
├── story-X.Y-[name].md        # Individual story specs
└── X.Y-[implementation].md    # Implementation details
```

### PM System Structure
```
.claude/
├── scripts/pm/          # Automation scripts
│   ├── init.sh         # System initialization
│   ├── prd-new.sh      # PRD creation
│   ├── story-new.sh    # Story creation
│   └── ...             # Other PM tools
├── templates/          # Document templates
│   ├── prd.md         # PRD template
│   ├── story.md       # Story template
│   └── epic.md        # Epic template
└── rules/             # Guidelines and rules
    ├── datetime.md    # Date/time handling
    └── ...           # Other rules
```

## Import Patterns

### Absolute Imports
- **Alias**: `@/` maps to project root
- **Example**: `import { cn } from "@/lib/utils"`

### Component Imports
```typescript
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
```

### Icon Imports
```typescript
import { Instagram, Music, Calendar } from "lucide-react"
```

## Build Output

### Development
- `.next/` - Next.js build cache and development files

### Production
- `.next/` - Optimized production build
- `public/` assets served statically

## Notable Observations

1. **Style System Migration**: ✅ COMPLETE - Fully migrated to PandaCSS
2. **Extensive Component Library**: 43 UI components now using PandaCSS
3. **Test Infrastructure**: Playwright for E2E and visual regression testing
4. **Performance Monitoring**: Performance benchmarking and analysis tools
5. **PM System Integration**: Sophisticated project management tooling with epics/PRDs
6. **Custom Font Integration**: Hegval font for branding
7. **Bundle Size Reduction**: Improved by removing Tailwind dependencies

## Update History
- 2025-09-15: Tailwind CSS completely removed, migration to PandaCSS complete
- 2025-09-14: Added test infrastructure, PandaCSS configuration, performance tools