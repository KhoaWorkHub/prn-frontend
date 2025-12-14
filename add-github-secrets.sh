#!/bin/bash
set -e

echo "🔐 GitHub Secrets Setup Helper"
echo "================================"
echo ""

# Get values from .vercel/project.json
VERCEL_ORG_ID="team_V7zmnutFYC2hzYcP4jCNlkEV"
VERCEL_PROJECT_ID="prj_j0s5D4dBlr0GPYHFL3pWXrAOUYlz"
API_URL="http://34.169.143.69:8080"

echo "📋 Copy these values - you'll need them in a moment:"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "VERCEL_ORG_ID:"
echo "$VERCEL_ORG_ID"
echo ""
echo "VERCEL_PROJECT_ID:"
echo "$VERCEL_PROJECT_ID"
echo ""
echo "NEXT_PUBLIC_API_URL:"
echo "$API_URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Copy to clipboard if available
if command -v pbcopy &> /dev/null; then
    cat > /tmp/github-secrets.txt << EOF
VERCEL_ORG_ID=$VERCEL_ORG_ID
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID
NEXT_PUBLIC_API_URL=$API_URL
EOF
    echo "✅ Values copied to clipboard!"
fi

echo ""
echo "🌐 Step 1: Get Vercel Token"
echo "   Opening Vercel tokens page..."
sleep 2
open "https://vercel.com/account/tokens" 2>/dev/null || echo "   Please visit: https://vercel.com/account/tokens"

echo ""
echo "   → Click 'Create Token'"
echo "   → Name: 'GitHub Actions - Campus Helpdesk'"
echo "   → Scope: Full Account"
echo "   → Copy the token (you'll see it only once!)"
echo ""

read -p "Press Enter when you have the token..." 

echo ""
echo "🔑 Step 2: Add Secrets to GitHub"
echo ""

# Try to get GitHub repo URL
if git remote -v &> /dev/null; then
    REPO_URL=$(git remote get-url origin 2>/dev/null | sed 's/\.git$//')
    if [[ $REPO_URL == git@* ]]; then
        # Convert SSH to HTTPS
        REPO_URL=$(echo $REPO_URL | sed 's/git@github.com:/https:\/\/github.com\//')
    fi
    SECRETS_URL="$REPO_URL/settings/secrets/actions"
    
    echo "   Opening GitHub secrets page..."
    sleep 2
    open "$SECRETS_URL" 2>/dev/null || echo "   Please visit: $SECRETS_URL"
else
    echo "   Visit: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
fi

echo ""
echo "   Add these 4 secrets by clicking 'New repository secret':"
echo ""
echo "   1. VERCEL_TOKEN"
echo "      → Paste the token from Vercel"
echo ""
echo "   2. VERCEL_ORG_ID"
echo "      → Paste: $VERCEL_ORG_ID"
echo ""
echo "   3. VERCEL_PROJECT_ID"
echo "      → Paste: $VERCEL_PROJECT_ID"
echo ""
echo "   4. NEXT_PUBLIC_API_URL"
echo "      → Paste: $API_URL"
echo ""

read -p "Press Enter when all secrets are added..." 

echo ""
echo "✅ Great! Now let's push to GitHub to trigger deployment:"
echo ""
echo "   git add ."
echo "   git commit -m 'Add GitHub Actions deployment'"
echo "   git push origin main"
echo ""

read -p "Push to GitHub now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "📤 Pushing to GitHub..."
    git add .
    git commit -m "🚀 Add GitHub Actions for automated Vercel deployment

- Auto-deploy on push to main
- Preview deployments for PRs
- Environment variables configured
- Backend API: $API_URL
- Production: https://prn-frontend-a7nciafct-khoaworkhubs-projects.vercel.app" || echo "Nothing to commit"
    
    git push origin main || git push origin master
    
    echo ""
    echo "🎉 Done! Check GitHub Actions tab to see deployment progress!"
    echo ""
    
    # Try to open GitHub Actions
    if git remote -v &> /dev/null; then
        REPO_URL=$(git remote get-url origin 2>/dev/null | sed 's/\.git$//')
        if [[ $REPO_URL == git@* ]]; then
            REPO_URL=$(echo $REPO_URL | sed 's/git@github.com:/https:\/\/github.com\//')
        fi
        ACTIONS_URL="$REPO_URL/actions"
        open "$ACTIONS_URL" 2>/dev/null || echo "Visit: $ACTIONS_URL"
    fi
else
    echo ""
    echo "⚠️  Remember to push when ready:"
    echo "   git push origin main"
fi

echo ""
echo "📚 Next steps:"
echo "   1. Watch GitHub Actions run"
echo "   2. Check deployment at Vercel dashboard"
echo "   3. Test your production URL"
echo ""
echo "🎯 Every future push to 'main' will auto-deploy!"
