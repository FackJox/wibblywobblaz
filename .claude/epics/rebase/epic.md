---
name: rebase
status: backlog
created: 2025-09-14T22:07:05Z
progress: 0%
prd: .claude/prds/rebase.md
github: https://github.com/FackJox/wibblywobblaz/issues/63
---

# Epic: Rebase PandaCSS Migration with Animation Adaptation

## Overview
Streamlined technical approach to rebase the PandaCSS migration branch onto main while adapting the existing animation hooks to work with PandaCSS. Focus on minimal changes using PandaCSS's runtime CSS generation capabilities to preserve hook APIs while eliminating Tailwind dependencies.

## Architecture Decisions

### Simplified Migration Strategy
- **Use PandaCSS runtime CSS**: Leverage `css()` function for dynamic styles instead of complex refactoring
- **Preserve hook signatures**: Keep existing APIs to avoid breaking changes
- **Batch similar hooks**: Group hooks by complexity for efficient conversion
- **Reuse PandaCSS config**: Existing keyframes and tokens already defined in panda.config.ts

### Technical Choices
- **No new dependencies**: Use only PandaCSS's built-in capabilities
- **Minimal refactoring**: Change only the style generation internals
- **Git strategy**: Interactive rebase with conflict resolution in batches
- **Testing approach**: Visual verification + existing component tests

## Technical Approach

### Style Conversion Pattern
Convert Tailwind utilities to PandaCSS using simple mapping:
```typescript
// Tailwind: "hover:scale-105 transition-transform"
// PandaCSS: css({ _hover: { scale: '105' }, transition: 'transform' })
```

### Hook Categories
1. **Simple CSS-only hooks** (use-mobile, use-feature-flags): Direct class mapping
2. **Dynamic style hooks** (use-parallax, use-ripple): Runtime CSS generation
3. **Complex animation hooks** (use-scroll-animations, use-stagger-reveal): Combine CSS + JS

### Rebase Strategy
1. Create clean worktree from main
2. Cherry-pick PandaCSS setup commits first
3. Apply hook adaptations in batches
4. Resolve conflicts per component group

## Implementation Strategy

### Phase 1: Pre-Rebase Setup (Day 1 Morning)
- Backup current branch state
- Analyze main branch animation hooks
- Create conversion mappings document
- Test PandaCSS runtime capabilities

### Phase 2: Hook Batch Conversion (Day 1 Afternoon)
- Convert simple hooks (2-3 hours)
- Convert dynamic hooks (3-4 hours)
- Test each batch before proceeding

### Phase 3: Rebase Execution (Day 2 Morning)
- Interactive rebase with main
- Apply conversions during conflict resolution
- Verify each commit builds

### Phase 4: Cleanup & Validation (Day 2 Afternoon)
- Remove Tailwind completely
- Run build and lint
- Visual regression testing
- Documentation update

## Task Breakdown Preview

Condensed into 8 essential tasks:

- [ ] **Task 1**: Analyze and map animation hooks from main branch
- [ ] **Task 2**: Convert simple utility hooks (mobile, feature-flags, haptics)
- [ ] **Task 3**: Convert dynamic style hooks (ripple, magnetic-hover, gradient-follow)
- [ ] **Task 4**: Convert complex animation hooks (parallax, scroll, stagger, text-reveal)
- [ ] **Task 5**: Execute rebase and resolve conflicts
- [ ] **Task 6**: Remove Tailwind and update build configuration
- [ ] **Task 7**: Test all animations and fix regressions
- [ ] **Task 8**: Update documentation and create migration guide

## Dependencies

### Required Before Starting
- Access to main branch
- Understanding of current PandaCSS setup
- Backup of current work

### External Dependencies
- PandaCSS v0.40.1 (already installed)
- Next.js 15 build pipeline (existing)

### No Additional Dependencies Needed
- Reuse existing PandaCSS configuration
- Leverage current animation keyframes
- Use built-in CSS generation

## Success Criteria (Technical)

### Performance Benchmarks
- Build time < 30 seconds
- Bundle size reduced by minimum 15%
- Animation performance at 60fps

### Quality Gates
- Zero Tailwind classes remaining
- All animations functioning
- ESLint passing
- TypeScript compilation clean

### Acceptance Criteria
- All hooks maintain same API
- No visual regressions
- Clean git history after rebase
- Documentation complete

## Estimated Effort

### Timeline: 2 Days Total
- **Day 1**: Hook conversion and preparation (8 hours)
- **Day 2**: Rebase execution and validation (8 hours)

### Resource Requirements
- 1 developer full-time
- Access to staging environment for testing
- Design review for visual validation

### Critical Path Items
1. Hook conversion must complete before rebase
2. Each batch must be tested before proceeding
3. Tailwind removal is final step only

## Risk Mitigation

### Simplified Approaches
- **Complex animations**: Use inline styles if PandaCSS can't handle
- **Performance issues**: Memoize generated styles
- **Merge conflicts**: Cherry-pick in smaller batches
- **Testing gaps**: Manual visual verification as fallback

### Backup Plans
- Branch backup before rebase
- Ability to revert individual commits
- Fallback to manual conflict resolution
- Keep Tailwind temporarily if critical issue found

## Tasks Created
- [ ] #64 - Analyze and map animation hooks (parallel: true)
- [ ] #65 - Convert simple utility hooks (parallel: false)
- [ ] #66 - Convert dynamic style hooks (parallel: false)
- [ ] #67 - Convert complex animation hooks (parallel: false)
- [ ] #68 - Execute rebase and resolve conflicts (parallel: false)
- [ ] #69 - Remove Tailwind and update build (parallel: false)
- [ ] #70 - Test animations and fix regressions (parallel: false)
- [ ] #71 - Update documentation and migration guide (parallel: false)

Total tasks: 8
Parallel tasks: 1
Sequential tasks: 7
Estimated total effort: 29-36 hours (2 days)
