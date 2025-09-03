# Technical Debt & Considerations

## Code Quality
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

## Performance Considerations
- Large Radix UI bundle (40+ components imported)
- No code splitting beyond Next.js defaults
- Images not optimized (using Next/Image but no sizing strategy)
- No lazy loading for below-fold content

## Commented Code
- Parties page animation logic commented out (lines 29-55 in page.tsx)
- Appears to be a bounce-back animation feature
- May have been causing issues or incomplete