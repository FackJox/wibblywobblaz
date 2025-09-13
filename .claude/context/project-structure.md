---
created: 2025-09-08T19:17:52Z
last_updated: 2025-09-12T20:02:22Z
version: 1.1
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
│   ├── rules/          # PM rules and guidelines
│   ├── scripts/        # PM automation scripts
│   └── templates/      # Document templates
├── docs/               # Project documentation (uncommitted)
│   ├── brownfield-architecture/  # Architecture docs
│   ├── stories/                  # Feature stories
│   │   ├── decks/               # DJ decks feature
│   │   └── microinteractions/   # UI animations
│   └── qa/                      # QA configurations
└── .olddocs/           # Archived documentation

## Key Files

### Configuration Files
- `next.config.mjs` - Next.js configuration (⚠️ build checks disabled)
- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `tsconfig.json` - TypeScript configuration (strict mode)
- `package.json` - Dependencies and scripts
- `components.json` - Shadcn/UI configuration

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
- **Component**: Inline Tailwind classes
- **Theme**: CSS variables in `:root` selector

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

1. **Monolithic Structure**: Main app logic in single `page.tsx` file
2. **Extensive Component Library**: 43 pre-built UI components ready to use
3. **Documentation Heavy**: Large amount of uncommitted documentation
4. **PM System Integration**: Sophisticated project management tooling
5. **Missing Test Structure**: No test directories or test files
6. **Custom Font Integration**: Hegval font for branding