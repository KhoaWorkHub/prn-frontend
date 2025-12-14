# GitHub Actions Secrets Setup Guide

## Required Secrets

You need to add these secrets to your GitHub repository:

### 1. VERCEL_TOKEN
Get your Vercel token:
```bash
# Login to Vercel CLI
vercel login

# Generate token at: https://vercel.com/account/tokens
# Or use CLI
vercel token create
```

### 2. VERCEL_ORG_ID
```bash
# Link your project first
cd prn-frontend
vercel link

# Get ORG_ID from .vercel/project.json
cat .vercel/project.json
```

### 3. VERCEL_PROJECT_ID
```bash
# Also from .vercel/project.json
cat .vercel/project.json
```

### 4. NEXT_PUBLIC_API_URL
```
http://34.169.143.69:8080
```

---

## How to Add Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:
   - Name: `VERCEL_TOKEN`
   - Value: `<your-vercel-token>`
   - Click **Add secret**

Repeat for:
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_API_URL`

---

## Workflow Features

✅ **Automatic deployment** on push to main/master
✅ **Preview deployments** for pull requests
✅ **Build validation** before deployment
✅ **Linting** checks
✅ **PR comments** with deployment URL
✅ **Deployment summary** in GitHub Actions

---

## Manual Deployment

If you need to deploy manually:

```bash
cd prn-frontend

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Or preview deployment
vercel
```

---

## Workflow Triggers

- **Push to main/master** → Production deployment
- **Pull Request** → Preview deployment with comment
- **Manual trigger** → Can be triggered from Actions tab

---

## What Happens on Push?

1. ✅ Checkout code
2. ✅ Setup Node.js 20 & pnpm
3. ✅ Install dependencies
4. ✅ Run linter
5. ✅ Build project with production env vars
6. ✅ Install Vercel CLI
7. ✅ Pull Vercel environment
8. ✅ Build Vercel artifacts
9. ✅ Deploy to Vercel production
10. ✅ Post deployment summary

---

## Monitoring

View deployment status:
- **GitHub Actions** tab in your repository
- **Vercel Dashboard** at https://vercel.com/dashboard
- **Deployment URL** in workflow summary
