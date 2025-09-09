#!/bin/bash

# Setup script for worktree guardrails
# This script configures a git worktree to prevent accidental commits to main branch

if [ -z "$1" ]; then
    echo "Usage: $0 <worktree-path>"
    echo "Example: $0 ../epic-microinteractions"
    exit 1
fi

WORKTREE_PATH="$1"

if [ ! -d "$WORKTREE_PATH" ]; then
    echo "❌ Error: Worktree path does not exist: $WORKTREE_PATH"
    exit 1
fi

cd "$WORKTREE_PATH" || exit 1

# Set the git config flag for agent worktree
git config --local claude.worktree true

# Verify it was set
if [[ "$(git config --get claude.worktree)" == "true" ]]; then
    echo "✅ Successfully configured worktree guardrails for: $WORKTREE_PATH"
    echo "   Agents working in this worktree cannot commit to main branch"
    current_branch=$(git branch --show-current)
    echo "   Current branch: $current_branch"
else
    echo "❌ Failed to set claude.worktree config"
    exit 1
fi