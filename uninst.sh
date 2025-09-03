#!/bin/bash

# ============================================================
# PERMANENT CLAUDE FLOW REMOVAL SCRIPT
# ============================================================
# This script completely removes all Claude Flow and Swarm
# MCP servers from your system and prevents them from
# coming back.
# ============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${RED}╔════════════════════════════════════════════╗${NC}"
echo -e "${RED}║   CLAUDE FLOW PERMANENT REMOVAL SCRIPT    ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}This will permanently remove Claude Flow/Swarm from your system!${NC}"
echo ""

# Step 1: Kill all running processes
echo -e "${CYAN}Step 1: Killing all Claude Flow/Swarm processes...${NC}"
PIDS=$(ps aux | grep -E "claude-flow|ruv-swarm" | grep -v grep | awk '{print $2}')
if [ -n "$PIDS" ]; then
    echo "$PIDS" | xargs -r kill -9 2>/dev/null
    echo -e "${GREEN}✓ Killed $(echo "$PIDS" | wc -l) processes${NC}"
else
    echo -e "${GREEN}✓ No processes found${NC}"
fi

# Step 2: Remove directories
echo ""
echo -e "${CYAN}Step 2: Removing Claude Flow directories...${NC}"
rm -rf .swarm .claude-flow 2>/dev/null
rm -rf ~/.swarm ~/.claude-flow 2>/dev/null
rm -rf /tmp/.swarm /tmp/.claude-flow 2>/dev/null
rm -rf ~/.config/claude-flow ~/.config/ruv-swarm 2>/dev/null
echo -e "${GREEN}✓ Directories removed${NC}"

# Step 3: Clean npm cache
echo ""
echo -e "${CYAN}Step 3: Cleaning npm cache...${NC}"
rm -rf ~/.npm/_npx/*claude-flow* 2>/dev/null
rm -rf ~/.npm/_npx/*ruv-swarm* 2>/dev/null
npm cache clean --force 2>/dev/null
echo -e "${GREEN}✓ NPM cache cleaned${NC}"

# Step 4: Remove from package.json if exists
echo ""
echo -e "${CYAN}Step 4: Checking package.json...${NC}"
if [ -f "package.json" ]; then
    if grep -q "claude-flow\|ruv-swarm" package.json; then
        cp package.json package.json.backup
        sed -i '/claude-flow/d' package.json
        sed -i '/ruv-swarm/d' package.json
        echo -e "${GREEN}✓ Removed from package.json (backup saved)${NC}"
    else
        echo -e "${GREEN}✓ Not found in package.json${NC}"
    fi
fi

# Step 5: Remove from claude_desktop_config.json
echo ""
echo -e "${CYAN}Step 5: Checking Claude Desktop config...${NC}"
CLAUDE_CONFIG="$HOME/.config/Claude/claude_desktop_config.json"
if [ -f "$CLAUDE_CONFIG" ]; then
    if grep -q "claude-flow\|ruv-swarm" "$CLAUDE_CONFIG"; then
        cp "$CLAUDE_CONFIG" "$CLAUDE_CONFIG.backup"
        # Remove claude-flow and ruv-swarm MCP server entries
        jq 'del(.mcpServers."claude-flow") | del(.mcpServers."ruv-swarm")' "$CLAUDE_CONFIG" > "$CLAUDE_CONFIG.tmp"
        mv "$CLAUDE_CONFIG.tmp" "$CLAUDE_CONFIG"
        echo -e "${GREEN}✓ Removed from Claude Desktop config (backup saved)${NC}"
    else
        echo -e "${GREEN}✓ Not found in Claude Desktop config${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Claude Desktop config not found${NC}"
fi

# Step 6: Create prevention script
echo ""
echo -e "${CYAN}Step 6: Creating prevention measures...${NC}"

# Create a blocking script
cat > ~/.config/block-claude-flow.sh << 'EOF'
#!/bin/bash
# This script blocks Claude Flow from running
while true; do
    pkill -f "claude-flow" 2>/dev/null
    pkill -f "ruv-swarm" 2>/dev/null
    rm -rf .swarm .claude-flow 2>/dev/null
    sleep 5
done
EOF
chmod +x ~/.config/block-claude-flow.sh

echo -e "${GREEN}✓ Created blocking script${NC}"

# Step 7: Check for any remaining references
echo ""
echo -e "${CYAN}Step 7: Checking for remaining references...${NC}"
REMAINING=$(find . -type f -name "*.json" -o -name "*.js" -o -name "*.ts" 2>/dev/null | xargs grep -l "claude-flow\|ruv-swarm" 2>/dev/null | grep -v node_modules | grep -v ".git")
if [ -n "$REMAINING" ]; then
    echo -e "${YELLOW}⚠ Found references in:${NC}"
    echo "$REMAINING"
    echo ""
    echo "Review these files manually and remove any Claude Flow references."
else
    echo -e "${GREEN}✓ No references found${NC}"
fi

# Step 8: Final verification
echo ""
echo -e "${CYAN}Step 8: Final verification...${NC}"
sleep 2

# Check if processes came back
if ps aux | grep -E "claude-flow|ruv-swarm" | grep -v grep > /dev/null; then
    echo -e "${RED}✗ WARNING: Processes have respawned!${NC}"
    echo "Claude Flow is being started by another process."
    echo "Check your shell configuration and startup scripts."
else
    echo -e "${GREEN}✓ No processes running${NC}"
fi

# Check if directories came back
if [ -d ".swarm" ] || [ -d ".claude-flow" ]; then
    echo -e "${RED}✗ WARNING: Directories have been recreated!${NC}"
    echo "Something is actively creating these directories."
else
    echo -e "${GREEN}✓ Directories remain deleted${NC}"
fi

echo ""
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo -e "${GREEN}       CLEANUP COMPLETE!${NC}"
echo -e "${GREEN}════════════════════════════════════════${NC}"
echo ""
echo "Actions taken:"
echo "  ✓ Killed all Claude Flow/Swarm processes"
echo "  ✓ Removed all related directories"
echo "  ✓ Cleaned NPM cache"
echo "  ✓ Removed from configuration files"
echo "  ✓ Created prevention measures"
echo ""
echo -e "${YELLOW}IMPORTANT for team members:${NC}"
echo "1. Run this script: ./REMOVE_CLAUDE_FLOW_PERMANENTLY.sh"
echo "2. Restart Claude Desktop after running this script"
echo "3. Never run: npm exec claude-flow or npm exec ruv-swarm"
echo ""
echo -e "${CYAN}To prevent auto-start (optional):${NC}"
echo "Run the blocker in background: ~/.config/block-claude-flow.sh &"
echo ""
echo -e "${RED}If problems persist, check:${NC}"
echo "  - Claude Desktop settings"
echo "  - Shell startup files (.bashrc, .zshrc)"
echo "  - Any automation scripts"
