#!/bin/bash
set -e

echo "🔧 GitHub Actions Setup for Vercel Deployment"
echo "=============================================="
echo ""

# Project IDs from .vercel/project.json
VERCEL_ORG_ID="team_V7zmnutFYC2hzYcP4jCNlkEV"
VERCEL_PROJECT_ID="prj_j0s5D4dBlr0GPYHFL3pWXrAOUYlz"
API_URL="http://34.169.143.69:8080"

echo "✅ Project already linked to Vercel"
echo "   Organization ID: $VERCEL_ORG_ID"
echo "   Project ID: $VERCEL_PROJECT_ID"
echo ""

echo "📋 Next Steps:"
echo ""
echo "1. Create Vercel Token:"
echo "   → Visit: https://vercel.com/account/tokens"
echo "   → Click 'Create Token'"
echo "   → Name it: 'GitHub Actions - Campus Helpdesk'"
echo "   → Copy the token"
echo ""

echo "2. Add GitHub Secrets:"
echo "   → Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo "   → Click 'New repository secret'"
echo "   → Add these 4 secrets:"
echo ""
echo "   Secret Name             | Value to Enter"
echo "   ----------------------- | --------------"
echo "   VERCEL_TOKEN           | [Token from step 1]"
echo "   VERCEL_ORG_ID          | $VERCEL_ORG_ID"
echo "   VERCEL_PROJECT_ID      | $VERCEL_PROJECT_ID"
echo "   NEXT_PUBLIC_API_URL    | $API_URL"
echo ""

echo "3. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add GitHub Actions for Vercel deployment'"
echo "   git push origin main"
echo ""

echo "🎯 After setup, every push to 'main' will automatically deploy to Vercel!"
echo ""

read -p "Press Enter to open Vercel tokens page in browser..." 
open "https://vercel.com/account/tokens" 2>/dev/null || echo "Please visit: https://vercel.com/account/tokens"
