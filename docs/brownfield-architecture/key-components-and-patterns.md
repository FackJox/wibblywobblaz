# Key Components & Patterns

## Component Architecture
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

## State Management
- Local state via React hooks
- Page state: `"links" | "parties"`
- Mobile menu state
- Transition state for animations
- Shhh animation state (currently disabled)

## Styling Patterns
- Tailwind utility classes
- CSS custom properties for theming
- Dark mode support (CSS variables defined)
- Custom animations (accordion only currently)