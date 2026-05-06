#!/bin/bash
# ===================================================
# douguizard.com — Auto-deploy script
# Run this ONCE from inside the douguizard-next folder
# ===================================================

set -e  # exit on first error

# Colors for output
PURPLE='\033[0;35m'
ORANGE='\033[0;33m'
BLUE='\033[0;34m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${PURPLE}"
echo "╔════════════════════════════════════════════════╗"
echo "║   douguizard.com — Git + GitHub setup          ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"

# Verify we're in the right folder
if [ ! -f "package.json" ] || ! grep -q "douguizard" package.json; then
  echo -e "${RED}✗ Error: This doesn't look like the douguizard-next folder.${NC}"
  echo "  Run this script from inside douguizard-next/"
  exit 1
fi

# Verify git is installed
if ! command -v git &> /dev/null; then
  echo -e "${RED}✗ Error: git is not installed.${NC}"
  echo "  Install from https://git-scm.com/downloads"
  exit 1
fi

echo -e "${BLUE}→ Checking Git config...${NC}"
GIT_USER=$(git config --global user.name || echo "")
GIT_EMAIL=$(git config --global user.email || echo "")

if [ -z "$GIT_USER" ] || [ -z "$GIT_EMAIL" ]; then
  echo -e "${ORANGE}  Git user not configured. Setting it now...${NC}"
  read -p "  Your name (e.g. Doug Vargas): " name
  read -p "  Your GitHub email: " email
  git config --global user.name "$name"
  git config --global user.email "$email"
  echo -e "${GREEN}  ✓ Git configured${NC}"
else
  echo -e "${GREEN}  ✓ Git user: $GIT_USER <$GIT_EMAIL>${NC}"
fi

# Initialize repo if needed
if [ ! -d ".git" ]; then
  echo -e "${BLUE}→ Initializing git repository...${NC}"
  git init -b main
  echo -e "${GREEN}  ✓ Repo initialized${NC}"
else
  echo -e "${GREEN}  ✓ Git repo already exists${NC}"
fi

# Stage and commit
echo -e "${BLUE}→ Staging all files...${NC}"
git add .

if git diff --cached --quiet; then
  echo -e "${ORANGE}  No changes to commit${NC}"
else
  echo -e "${BLUE}→ Creating initial commit...${NC}"
  git commit -m "feat: initial commit — douguizard.com

- Next.js 16 + React 19 + Framer Motion
- React Three Fiber cinematic 3D background
- Lenis smooth scroll
- 5 case studies pre-rendered (SSG)
- CV page with print-to-PDF
- Mobile responsive
"
  echo -e "${GREEN}  ✓ Commit created${NC}"
fi

# Set remote
echo -e "${BLUE}→ Setting GitHub remote...${NC}"
if git remote get-url origin &> /dev/null; then
  git remote set-url origin https://github.com/dougnuken/douguizard.git
else
  git remote add origin https://github.com/dougnuken/douguizard.git
fi
echo -e "${GREEN}  ✓ Remote set to: github.com/dougnuken/douguizard${NC}"

echo
echo -e "${PURPLE}════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Local Git is ready.${NC}"
echo
echo -e "${ORANGE}Next, you need to:${NC}"
echo
echo -e "${BLUE}1.${NC} Create the empty repo on GitHub:"
echo "     https://github.com/new"
echo "     Name:  douguizard"
echo "     Visibility: Public"
echo "     ⚠️  Do NOT add README, .gitignore, or license"
echo "     Click \"Create repository\""
echo
echo -e "${BLUE}2.${NC} Come back here and run:"
echo -e "${GREEN}     git push -u origin main${NC}"
echo
echo "     (You'll be asked for credentials. Use a Personal Access Token"
echo "      as password, NOT your GitHub password. Get one at:"
echo "      https://github.com/settings/tokens?type=beta — give it"
echo "      'Contents: write' permission for the douguizard repo.)"
echo
echo -e "${PURPLE}════════════════════════════════════════════════${NC}"
