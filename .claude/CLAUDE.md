# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> Think carefully and implement the most concise solution that changes as little code as possible.

## Development Commands

```bash
# Development
npm run dev         # Start development server on http://localhost:3000

# Build & Production
npm run build       # Create production build
npm run start       # Start production server

# Code Quality
npm run lint        # Run ESLint

# Project Management (CCPM)
/pm:prd-new <feature>   # Create new PRD
/pm:status              # Check PM system status
/pm:help                # View PM commands
```

## Architecture Overview

This is a Next.js 15 landing page with App Router for Wibbly Wobblaz (music/event platform).

### Tech Stack
- **Framework**: Next.js 15.2.4 with App Router
- **UI Components**: Radix UI primitives via shadcn/ui (40+ components in /components/ui/)
- **Styling**: Tailwind CSS with HSL-based CSS variables for theming
- **Forms**: React Hook Form + Zod validation
- **Animations**: Custom keyframes in globals.css + Tailwind Animate

### Key Architecture Patterns

1. **Single Page with Client-Side Navigation**: Main page (`app/page.tsx`) manages two views - "Links" and "Parties" with slide transitions
2. **Component Library Pattern**: All UI components in `/components/ui/` built on Radix primitives
3. **Theme System**: CSS variables in HSL format, managed by next-themes via ThemeProvider
4. **Mobile-First**: Responsive design with hamburger menu and scrollable content

### Critical Build Configuration

⚠️ **WARNING**: The following are disabled in `next.config.mjs`:
- TypeScript errors ignored in builds (`ignoreBuildErrors: true`)
- ESLint errors ignored in builds (`ignoreDuringBuilds: true`)
- Image optimization disabled (`unoptimized: true`)

These should be addressed before production deployment.

### Project Management System

Extensive PM tooling in `.claude/` directory:
- Epic and story management
- PRD handling with templates
- Git worktree support for parallel development
- Issue tracking integration with GitHub

## USE SUB-AGENTS FOR CONTEXT OPTIMIZATION

### 1. Always use the file-analyzer sub-agent when asked to read files.
The file-analyzer agent is an expert in extracting and summarizing critical information from files, particularly log files and verbose outputs. It provides concise, actionable summaries that preserve essential information while dramatically reducing context usage.

### 2. Always use the code-analyzer sub-agent when asked to search code, analyze code, research bugs, or trace logic flow.

The code-analyzer agent is an expert in code analysis, logic tracing, and vulnerability detection. It provides concise, actionable summaries that preserve essential information while dramatically reducing context usage.

### 3. Always use the test-runner sub-agent to run tests and analyze the test results.

Using the test-runner agent ensures:

- Full test output is captured for debugging
- Main conversation stays clean and focused
- Context usage is optimized
- All issues are properly surfaced
- No approval dialogs interrupt the workflow

## Philosophy

### Error Handling

- **Fail fast** for critical configuration (missing text model)
- **Log and continue** for optional features (extraction model)
- **Graceful degradation** when external services unavailable
- **User-friendly messages** through resilience layer

### Testing

- Always use the test-runner agent to execute tests.
- Do not use mock services for anything ever.
- Do not move on to the next test until the current test is complete.
- If the test fails, consider checking if the test is structured correctly before deciding we need to refactor the codebase.
- Tests to be verbose so we can use them for debugging.


## Tone and Behavior

- Criticism is welcome. Please tell me when I am wrong or mistaken, or even when you think I might be wrong or mistaken.
- Please tell me if there is a better approach than the one I am taking.
- Please tell me if there is a relevant standard or convention that I appear to be unaware of.
- Be skeptical.
- Be concise.
- Short summaries are OK, but don't give an extended breakdown unless we are working through the details of a plan.
- Do not flatter, and do not give compliments unless I am specifically asking for your judgement.
- Occasional pleasantries are fine.
- Feel free to ask many questions. If you are in doubt of my intent, don't guess. Ask.

## ABSOLUTE RULES:

- NO PARTIAL IMPLEMENTATION
- NO SIMPLIFICATION : no "//This is simplified stuff for now, complete implementation would blablabla"
- NO CODE DUPLICATION : check existing codebase to reuse functions and constants Read files before writing new functions. Use common sense function name to find them easily.
- NO DEAD CODE : either use or delete from codebase completely
- IMPLEMENT TEST FOR EVERY FUNCTIONS
- NO CHEATER TESTS : test must be accurate, reflect real usage and be designed to reveal flaws. No useless tests! Design tests to be verbose so we can use them for debuging.
- NO INCONSISTENT NAMING - read existing codebase naming patterns.
- NO OVER-ENGINEERING - Don't add unnecessary abstractions, factory patterns, or middleware when simple functions would work. Don't think "enterprise" when you need "working"
- NO MIXED CONCERNS - Don't put validation logic inside API handlers, database queries inside UI components, etc. instead of proper separation
- NO RESOURCE LEAKS - Don't forget to close database connections, clear timeouts, remove event listeners, or clean up file handles
