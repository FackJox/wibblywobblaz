# Project Structure

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