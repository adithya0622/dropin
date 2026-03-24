# AURISTRA'26 Upgrade - Deployment Guide

Complete step-by-step guide for deploying to Vercel with 100% success rate.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Google OAuth credentials (optional)
- [ ] 30 minutes of setup time

## Local Setup

### 1. Install Dependencies

```bash
cd upgrade-build
npm install
```

### 2. Configure Environment Variables

Copy the example file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXTAUTH_SECRET=<generate-with-command-below>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<your-id-or-leave-blank>
GOOGLE_CLIENT_SECRET=<your-secret-or-leave-blank>
NEXT_PUBLIC_API_BASE_URL=
```

Generate NEXTAUTH_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Test Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

- Click "Demo Mode" button to seed test data
- Try login with any email/password
- Export PDF from dashboard
- Test share buttons (X/LinkedIn)
- Verify responsive design on mobile

## Vercel Deployment

### Option A: CLI Deployment (Recommended)

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
```

#### Step 2: Authenticate

```bash
vercel login
```

#### Step 3: Deploy

```bash
vercel --prod
```

Vercel CLI will:
1. Detect Next.js framework automatically
2. Ask to link to existing/new project
3. Deploy to production
4. Provide live URL

### Option B: GitHub Integration

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "AURISTRA'26 Upgrade - Production Ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/upgrade-auristra.git
git push -u origin main
```

#### Step 2: Deploy to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select **Root Directory: `upgrade-build/`**
5. Continue to environment setup

#### Step 3: Add Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
NEXTAUTH_SECRET=<your-64-char-secret>
NEXTAUTH_URL=https://your-project.vercel.app
GOOGLE_CLIENT_ID=<your-id>
GOOGLE_CLIENT_SECRET=<your-secret>
NEXT_PUBLIC_API_BASE_URL=
```

#### Step 4: Deploy

Click "Deploy" button or push to main:

```bash
git commit --allow-empty -m "Trigger Vercel deployment"
git push origin main
```

## Post-Deployment Verification

### 1. Check Live Site

Visit your Vercel deployment URL shown in dashboard.

### 2. Test Critical Features

- [ ] Homepage loads (demo data visible)
- [ ] Demo Mode button works
- [ ] PDF export button works
- [ ] Share buttons are functional
- [ ] Navigation responsive on mobile
- [ ] Dark mode toggle works
- [ ] Login/logout flow works (if auth configured)

### 3. Verify Production Build

```bash
npm run build
npm start
```

Should complete without errors.

### 4. Check Vercel Deployment Status

1. Vercel Dashboard → Deployments
2. Should show latest deployment as "Ready" (green checkmark)
3. Verify environment variables are set
4. Check build logs for warnings/errors

## Environment Variables for Production

### Required for All Deployments

```env
NEXTAUTH_SECRET=<generate-new-64-char-key>
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Optional for Google OAuth

```env
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>
```

To get Google credentials:
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URI: `https://your-domain.vercel.app/api/auth/callback/google`
6. Copy Client ID and Secret to Vercel

### Optional for Custom API Backend

```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com
```

## Troubleshooting

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

Check Vercel build logs:
1. Vercel Dashboard → Deployments → Failed deployment
2. Click "View logs" for details

### URL Mismatch Errors

Ensure NEXTAUTH_URL matches your deployment URL:

```env
# If deploying to: https://upgrade-app.vercel.app
NEXTAUTH_URL=https://upgrade-app.vercel.app

# NOT http://localhost:3000
```

### Environment Variables Not Working

1. Check Vercel settings has all variables
2. Redeploy after adding variables: Click "Redeploy" button
3. Wait 1-2 minutes for cache clear

### Demo Mode Not Persisting

- Demo data uses localStorage (24-hour lifetime)
- Works in both development and production
- Clear browser storage and click "Demo Mode" again

### PDF Export Not Working

1. Ensure jsPDF is installed: `npm list jspdf`
2. Try in production build (sometimes issue in dev)
3. Check browser console for errors

## Performance Optimization

The project includes:

- ✅ Image optimization (next/image)
- ✅ Code splitting (React suspense)
- ✅ Automatic compression
- ✅ Cache control headers
- ✅ Security headers (CSP, X-Frame, etc)
- ✅ PWA manifest for app install
- ✅ Lazy loading for charts

Monitor performance:
- Vercel Dashboard → Analytics
- Web Vitals tab shows Core Web Vitals metrics

## Custom Domains

1. Vercel Dashboard → Project Settings → Domains
2. Add your domain
3. Follow DNS configuration steps
4. Update NEXTAUTH_URL to your domain

Example:
```env
NEXTAUTH_URL=https://your-custom-domain.com
```

## Rollback Previous Deployment

1. Vercel Dashboard → Deployments
2. Click on previous working deployment
3. Click "Promote to Production"

## Database Setup (If Needed)

For persistent data (not in current scope), consider:

- [Vercel PostgreSQL](https://vercel.com/storage/postgres)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Firebase](https://firebase.google.com/)

Connect via:
```env
DATABASE_URL=<your-database-connection-string>
```

## Monitoring & Logging

### Vercel Monitoring

- Real-time analytics at vercel.com dashboard
- Function analytics (API route performance)
- Deployment history

### Custom Logging

Add to your code:

```typescript
console.log('User action:', {
  timestamp: new Date().toISOString(),
  action: 'demo_activated',
  userId: user?.id,
});
```

Visible in Vercel function logs.

## Security Checklist

- [x] NextAuth session protected routes
- [x] HTTPS enforced (Vercel)
- [x] Security headers configured
- [x] Credentials not in source code
- [x] Rate limiting on API routes
- [x] CORS configured properly
- [x] No console sensitive data in production

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Success! 🎉

Your AURISTRA'26 Upgrade platform is now:
- ✅ Live on the internet
- ✅ Judge-ready with demo mode
- ✅ Fully responsive on all devices
- ✅ Optimized for performance
- ✅ Secured for production

Share your deployment URL with judges and teammates!
