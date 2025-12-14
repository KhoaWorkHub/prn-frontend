#!/bin/bash
set -e

echo "🚀 Campus Helpdesk Frontend - Complete Setup & Deployment"
echo "=========================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from prn-frontend directory${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
pnpm install

echo ""
echo -e "${BLUE}🔍 Step 2: Running linter...${NC}"
pnpm lint || echo -e "${YELLOW}⚠️  Lint warnings found (continuing...)${NC}"

echo ""
echo -e "${BLUE}🏗️  Step 3: Building production bundle...${NC}"
pnpm build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔧 Step 4: Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
else
    echo -e "${GREEN}✅ Vercel CLI already installed${NC}"
fi

echo ""
echo -e "${BLUE}🔑 Step 5: Vercel Authentication${NC}"
echo "Please login to Vercel (browser will open)..."
vercel login

echo ""
echo -e "${BLUE}🔗 Step 6: Linking project to Vercel...${NC}"
vercel link

echo ""
echo -e "${YELLOW}📋 Step 7: Setting environment variables...${NC}"
echo "Setting NEXT_PUBLIC_API_URL..."
vercel env add NEXT_PUBLIC_API_URL production << EOF
http://34.169.143.69:8080
EOF

echo ""
echo -e "${BLUE}🚀 Step 8: Deploying to Vercel Production...${NC}"
DEPLOYMENT_URL=$(vercel --prod)

echo ""
echo -e "${GREEN}=========================================="
echo "✅ DEPLOYMENT SUCCESSFUL!"
echo "==========================================${NC}"
echo ""
echo -e "${GREEN}🌐 Production URL:${NC} $DEPLOYMENT_URL"
echo -e "${GREEN}📊 API Backend:${NC} http://34.169.143.69:8080"
echo -e "${GREEN}📖 Swagger:${NC} http://34.169.143.69:8080/swagger/index.html"
echo ""
echo -e "${BLUE}📝 Next Steps:${NC}"
echo "  1. Visit your deployment URL"
echo "  2. Test login with existing accounts"
echo "  3. Setup GitHub Actions secrets for auto-deployment"
echo ""
echo -e "${YELLOW}🔐 GitHub Actions Setup:${NC}"
echo "  Add these secrets to your GitHub repository:"
echo "  - VERCEL_TOKEN (get from: vercel token create)"
echo "  - VERCEL_ORG_ID (from: .vercel/project.json)"
echo "  - VERCEL_PROJECT_ID (from: .vercel/project.json)"
echo "  - NEXT_PUBLIC_API_URL (http://34.169.143.69:8080)"
echo ""
echo -e "${GREEN}Done! 🎉${NC}"
