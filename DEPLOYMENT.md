# 🚀 Campus Helpdesk Frontend - Deployment Guide

## 🎯 Deployment Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   GitHub Repo   │────────>│  GitHub Actions  │────────>│  Vercel Deploy  │
│                 │  Push   │                  │  Auto   │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
                                                                    │
                                                                    │ HTTPS
                                                                    ▼
                                                          ┌─────────────────┐
                                                          │  GCP Backend    │
                                                          │  34.169.143.69  │
                                                          └─────────────────┘
```

---

## 🚀 Quick Deploy (One Command)

```bash
cd /Users/khoa123/Desktop/PRN232_ASSIGNMENT/prn-frontend
./deploy.sh
```

This script will:
1. ✅ Install dependencies
2. ✅ Run linter
3. ✅ Build production bundle
4. ✅ Install Vercel CLI
5. ✅ Login to Vercel
6. ✅ Link project
7. ✅ Set environment variables
8. ✅ Deploy to production

---

## 📋 Manual Deployment Steps

### 1. Prerequisites

```bash
# Install pnpm if not installed
npm install -g pnpm

# Install Vercel CLI
npm install -g vercel
```

### 2. Build & Test Locally

```bash
cd prn-frontend

# Install dependencies
pnpm install

# Test development server
pnpm dev
# Visit http://localhost:3000

# Build for production
pnpm build

# Test production build
pnpm start
```

### 3. Deploy to Vercel

```bash
# Login to Vercel
vercel login

# Link your project
vercel link

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: http://34.169.143.69:8080

# Deploy to production
vercel --prod
```

---

## 🤖 Automated Deployment with GitHub Actions

### Setup Steps

#### 1. Get Vercel Tokens

```bash
# Login to Vercel
vercel login

# Link project (creates .vercel/project.json)
cd prn-frontend
vercel link

# Get organization and project IDs
cat .vercel/project.json
```

You'll see:
```json
{
  "orgId": "team_xxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxx"
}
```

#### 2. Create Vercel Token

Visit: https://vercel.com/account/tokens

Or use CLI:
```bash
vercel token create
```

#### 3. Add GitHub Secrets

Go to: `https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

Add these secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `VERCEL_TOKEN` | Token from step 2 | `ABCxyz123...` |
| `VERCEL_ORG_ID` | `orgId` from .vercel/project.json | `team_xxxxx` |
| `VERCEL_PROJECT_ID` | `projectId` from .vercel/project.json | `prj_xxxxx` |
| `NEXT_PUBLIC_API_URL` | GCP backend URL | `http://34.169.143.69:8080` |

#### 4. Push to GitHub

```bash
git add .
git commit -m "Add deployment automation"
git push origin main
```

**That's it!** 🎉 Every push to `main` will automatically deploy to Vercel!

---

## 🔄 Workflow Features

### Main Deployment Workflow (`.github/workflows/deploy-vercel.yml`)

**Triggers:**
- ✅ Push to `main` or `master` branch
- ✅ Pull requests to `main` or `master`

**Steps:**
1. Checkout code
2. Setup Node.js 20 & pnpm
3. Install dependencies
4. Run linter
5. Build production bundle
6. Install Vercel CLI
7. Pull Vercel environment
8. Build Vercel artifacts
9. Deploy to production
10. Comment on PR with deployment URL (for PRs)
11. Post deployment summary

**Features:**
- 🚀 Automatic deployment on push
- 👀 Preview deployments for PRs
- 💬 PR comments with deployment URL
- 📊 Deployment summary in Actions tab
- ⚡ Fast builds with caching

### Backend Update Workflow (`.github/workflows/redeploy-on-backend-update.yml`)

**Triggers:**
- 🔔 Repository dispatch event `backend-updated`
- 🔧 Manual workflow dispatch

**Use case:** Redeploy frontend when backend API changes

**Manual trigger:**
```bash
# Trigger via GitHub CLI
gh workflow run redeploy-on-backend-update.yml

# Or from GitHub UI: Actions → Redeploy on Backend Update → Run workflow
```

---

## 🌍 Environment Variables

### Production (.env.production)

```bash
NEXT_PUBLIC_API_URL=http://34.169.143.69:8080
```

### Development (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://34.169.143.69:8080
# or for local backend:
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Vercel Environment Variables

Set via CLI:
```bash
# Production
vercel env add NEXT_PUBLIC_API_URL production

# Preview
vercel env add NEXT_PUBLIC_API_URL preview

# Development
vercel env add NEXT_PUBLIC_API_URL development
```

Or via Vercel Dashboard:
1. Go to project settings
2. Environment Variables
3. Add `NEXT_PUBLIC_API_URL`

---

## 📊 Monitoring Deployments

### GitHub Actions

1. Go to repository **Actions** tab
2. View deployment workflows
3. Check build logs
4. See deployment summaries

### Vercel Dashboard

1. Visit https://vercel.com/dashboard
2. Select your project
3. View deployments, analytics, logs

### Deployment URLs

- **Production:** Shown in GitHub Actions summary
- **Preview:** Posted as PR comment
- **Latest:** Check Vercel dashboard

---

## 🔧 Troubleshooting

### Build Fails

```bash
# Check lint errors
pnpm lint

# Check TypeScript errors
pnpm build

# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Environment Variables Not Working

```bash
# Verify env vars in Vercel
vercel env ls

# Pull env vars locally
vercel env pull

# Re-add if needed
vercel env rm NEXT_PUBLIC_API_URL production
vercel env add NEXT_PUBLIC_API_URL production
```

### CORS Errors

Backend already has `AllowAnyOrigin` enabled. If you still get CORS:

1. Check backend is running:
```bash
curl http://34.169.143.69:8080/swagger/index.html
```

2. Check Vercel deployment domain is allowed

3. Verify `NEXT_PUBLIC_API_URL` is set correctly

### Authentication Issues

```bash
# Check token in browser console
localStorage.getItem('access_token')

# Clear tokens and login again
localStorage.clear()
```

---

## 🎯 Deployment Checklist

Before deploying to production:

- [ ] ✅ All API endpoints tested
- [ ] ✅ Authentication flow works
- [ ] ✅ Environment variables configured
- [ ] ✅ Build passes locally (`pnpm build`)
- [ ] ✅ No TypeScript errors
- [ ] ✅ No lint errors (or only warnings)
- [ ] ✅ Backend API is accessible
- [ ] ✅ Swagger documentation works
- [ ] ✅ GitHub secrets configured
- [ ] ✅ Vercel project linked
- [ ] ✅ Test login/register flows
- [ ] ✅ Test on mobile devices

---

## 🚀 Post-Deployment

After successful deployment:

1. **Test Production URL**
   - Open deployment URL
   - Test login
   - Test API calls
   - Check console for errors

2. **Setup Custom Domain** (Optional)
   ```bash
   vercel domains add yourdomain.com
   ```

3. **Enable Analytics**
   - Already included via `@vercel/analytics`
   - View in Vercel dashboard

4. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor API response times
   - Check error rates

---

## 📈 Continuous Deployment Flow

```
Developer pushes code
         ↓
GitHub Actions triggered
         ↓
Install dependencies
         ↓
Run linter & tests
         ↓
Build production bundle
         ↓
Deploy to Vercel
         ↓
✅ Live in production!
```

**Deployment time:** ~2-3 minutes

---

## 🎉 Success!

Your frontend is now:
- ✅ Deployed to Vercel
- ✅ Connected to GCP backend
- ✅ Auto-deploys on push
- ✅ Has preview deployments for PRs
- ✅ Monitored via GitHub Actions
- ✅ Optimized for production

**Happy deploying! 🚀**
