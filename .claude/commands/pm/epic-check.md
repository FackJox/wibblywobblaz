---
name: pm:epic-check
instruction: Validate an epic's completion status with interactive testing
---

Validates an epic's completion status through comprehensive checks and interactive testing.

## Usage
```
/pm:epic-check <epic_name>
```

## What it does
1. Switches to the epic's worktree
2. Runs lint, type checks, and tests
3. Interactively tests functionality with user feedback
4. Validates Definition of Done for all issues
5. Generates comprehensive validation report

## Example
```
/pm:epic-check microinteractions
```

This will:
- Switch to `../epic-microinteractions` worktree
- Run code quality checks
- Present expected behaviors for user testing
- Generate report at `.claude/epics/microinteractions/validation-report-{date}.md`

## Interactive Testing
The agent will present tests one at a time:
```
TEST: [Feature Area] - [Test Description]
RELATED: FR-X from PRD
EXPECTED: [Expected behavior]
→ Awaiting your response...
```

Respond with:
- `PASS` - Test passed as expected
- `FAIL - [details]` - Test failed with description

## Implementation
Use the epic-check agent to perform validation.