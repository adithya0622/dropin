# Vercel Deployment Guide - Upgrade Student Recommendation System

## Overview

This guide explains how to deploy the Upgrade system to Vercel with serverless Flask API and Next.js frontend.

## Architecture

```
Vercel (Serverless)
├── Next.js Frontend (api/index.py is served as serverless function)
│   ├── Login page (/login)
│   ├── Profile/Dashboard (/profile)
│   └── Leaderboard (/leaderboard)
│
└── Flask API Routes (upgrade-build/api/index.py)
    ├── GET  /api/health
    ├── POST /api/login
    ├── POST /api/recommend
    ├── GET  /api/leaderboard
    └── GET  /api/top-five
```

## Prerequisites

### Before Deployment

1. **Generate ML Models Locally** (IMPORTANT!)
```bash
cd e:\drop\Upgrade-main

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Generate the trained models (runs on your laptop, takes a few minutes)
python mlcode.py
```

This creates:
- `Default_train_dataset.xlsx` (100,000 rows - needed for reference)
- `Default_dataset_model.joblib` (trained ML model - ~20MB)
- `Default_dataset_mlb.joblib` (label converter - ~100KB)

2. **Create Excel Files** if they don't exist:
- `Students.xlsx` - Student data with 'Total' column (top 5 can login)
- `Courses.xlsx` - Course/assessment configuration

3. **Commit to GitHub**
```bash
git add Students.xlsx Courses.xlsx
git add Default_dataset_model.joblib Default_dataset_mlb.joblib
git commit -m "Add ML models and data files"
git push origin main
```

## Step 1: Prepare Your Repository

### File Structure Required
```
upgrade-main/
├── Students.xlsx                    ← Excel with student data
├── Courses.xlsx                     ← Excel with course config
├── Default_dataset_model.joblib     ← Pre-trained ML model
├── Default_dataset_mlb.joblib       ← ML Labels converter
├── mlcode.py                        ← Original ML code (for reference)
├── requirements.txt                 ← Python dependencies
│
└── upgrade-build/
    ├── package.json                 ← Node.js dependencies
    ├── next.config.js               ← Next.js config
    ├── .env.local.example           ← Environment template
    ├── vercel.json                  ← Vercel config
    │
    ├── api/
    │   └── index.py                 ← Flask serverless function
    │
    ├── mlcode_inference.py          ← Inference-only ML code
    ├── app/
    │   ├── login/page.tsx           ← Login page
    │   ├── profile/page.tsx         ← Dashboard
    │   └── ...
    │
    ├── components/
    │   ├── student-analysis.tsx
    │   └── ...
    │
    └── hooks/
        └── use-student.ts           ← API client
```

### GitHub Setup
```bash
# Initialize git if not already done
git init
git remote add origin https://github.com/YOUR_USERNAME/upgrade-main.git

# Create .gitignore
echo "node_modules/" >> .gitignore
echo "venv/" >> .gitignore
echo ".env.local" >> .gitignore
echo ".next/" >> .gitignore
echo "__pycache__/" >> .gitignore

git add .
git commit -m "Initial commit with ML models and Excel files"
git push -u origin main
```

## Step 2: Configure Vercel

### 2.1 Create Vercel Project

1. Go to https://vercel.com/new
2. Select **Import Git Repository**
3. Choose your GitHub repository
4. Click **Import**

### 2.2 Configure Build Settings

**Project Settings → Build & Development Settings:**

- **Framework Preset**: Next.js
- **Build Command**: `cd upgrade-build && npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `upgrade-build/.next`

### 2.3 Configure Environment Variables

**Settings → Environment Variables:**

Add these variables:
```
NEXT_PUBLIC_API_URL=/api
FILES_DIR=./
```

**Optional for production:**
```
API_PASSWORD=your-secure-password
NODE_ENV=production
```

## Step 3: Vercel Configuration File

Create `upgrade-build/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "env": {
    "NEXT_PUBLIC_API_URL": "/api"
  },
  "functions": {
    "api/index.py": {
      "runtime": "python3.9"
    }
  }
}
```

## Step 4: Update vercel.json in upgrade-build

Your existing `vercel.json` should look like:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev"
}
```

Or update it to include Python function config:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "regions": ["iad1"],
  "functions": {
    "api/index.py": {
      "runtime": "python3.9"
    }
  }
}
```

## Step 5: Deploy

### Option A: Deploy from GitHub (Automatic)

```bash
# Push to GitHub
git push origin main

# Vercel will automatically deploy on push!
```

### Option B: Deploy from CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production
vercel --prod
```

## Step 6: Verify Deployment

Once deployed, your app will be at: `https://your-project.vercel.app`

### Test Endpoints:

1. **Health Check**
   ```
   https://your-project.vercel.app/api/health
   ```
   Should return: `{"status": "ok", ...}`

2. **Login Test**
   ```bash
   curl -X POST https://your-project.vercel.app/api/login \
     -H "Content-Type: application/json" \
     -d '{"roll_no": 22001, "password": "demo123"}'
   ```

3. **Frontend**
   ```
   https://your-project.vercel.app/login
   ```

## Important Notes

### ✅ What Works on Vercel

- Flask API endpoints (serverless)
- JWT authentication
- Excel file reading (cached for 5 minutes)
- ML model inference (using pre-trained models)
- Next.js frontend
- Static file serving

### ❌ What Does NOT Work

- Training new ML models (too slow, too much memory)
- Real-time database sync
- Long-running processes (>30 seconds timeout)
- Large file uploads

### Model Loading

The models are loaded **once** and kept in memory:

```python
# First request - loads models (~2-3 seconds for cold start)
# Subsequent requests - models cached (~100ms response time)
```

### File Locations on Vercel

- Excel files: `./` (project root)
- .joblib files: `./` (project root)
- Code: `/api/index.py`, `/mlcode_inference.py`

All relative paths are resolved from the project root.

## Troubleshooting

### "Module not found: mlcode_inference"

**Cause**: `mlcode_inference.py` not uploaded to Vercel

**Solution**:
```bash
git add mlcode_inference.py
git commit -m "Add inference code"
git push
```

### "Students.xlsx not found"

**Cause**: Excel files not in repository or in wrong location

**Solution**:
```bash
# Make sure files are in project root
git add Students.xlsx Courses.xlsx
git commit -m "Add Excel files"
git push
```

### "Model files not found"

**Cause**: `.joblib` files not generated or not committed

**Solution**: Generate locally first
```bash
# On your laptop
python mlcode.py

# Then commit
git add *.joblib
git commit -m "Add trained models"
git push
```

### API returns 500 error

**Solution**: Check Vercel logs
```bash
vercel logs
```

Common issues:
- Missing requirements.txt dependencies
- Wrong file paths
- Excel file corruption
- Out of memory (too many students)

### Login says "Access restricted"

**Causes**:
1. Student roll_no not in top 5 by 'Total' marks
2. Students.xlsx not loaded in Vercel
3. Column names don't match

**Solution**:
- Check Students.xlsx is committed
- Verify 'Total' column exists
- Ensure student is in first 5 rows when sorted by Total

## Performance Tuning

### Reduce Cold Start Time

1. **Lazy load models** (already done)
2. **Cache frequently-used data** (already done - cached for 5 minutes)
3. **Minimize dependencies** - only import what's needed

### Response Times

- **First request**: 2-3 seconds (cold start)
- **Subsequent requests**: 100-200ms
- **Leaderboard**: 50-100ms

### Optimization Tips

For many students/requests:
1. Add Vercel's Redis caching
2. Pre-calculate recommendations offline
3. Use CDN for static content

## Rollback / Debugging

### View Deployment History
```bash
vercel list deployments
```

### Rollback to Previous Deployment
```bash
vercel rollback
```

### View Logs
```bash
vercel logs --follow
```

### Local Development vs Production

**Local** (`npm run dev` + Flask):
- No authentication needed
- Direct file access
- Instant model loading

**Production** (Vercel):
- JWT tokens required
- Files must be committed
- Models cached in memory
- 30-second request timeout

## Security Checklist

- [ ] Change `API_PASSWORD` from 'demo123'
- [ ] Use HTTPS (automatic with Vercel)
- [ ] Enable CORS only for your domain
- [ ] Rotate JWT secret in production
- [ ] Don't commit sensitive data (.env files)
- [ ] Monitor Vercel logs for errors
- [ ] Set up rate limiting

## Final Deployment Checklist

Before going live:

- [ ] Generate ML models locally (`python mlcode.py`)
- [ ] Commit `.joblib` files to GitHub
- [ ] Commit `Students.xlsx` and `Courses.xlsx`
- [ ] Update `vercel.json`
- [ ] Set environment variables in Vercel
- [ ] Test `/api/health` endpoint
- [ ] Test login with roll_no 22001
- [ ] Test dashboard loads correctly
- [ ] Verify responsive design on mobile

## Support

### Common Issues

1. **Models not loading**: Check if .joblib files are in repository
2. **Excel file errors**: Verify column names match exactly
3. **Authentication fails**: Check password and top 5 students
4. **Timeouts**: API taking >30 seconds (reduce data size)

### Get Help

1. Check Vercel logs: `vercel logs`
2. Test locally first: `npm run dev`
3. Check API documentation: `/api/health`

## Next Steps

After deployment:

1. ✅ Share login credentials (roll_no + password)
2. ✅ Add more students to Students.xlsx
3. ✅ Train new models for different courses
4. ✅ Set up monitoring and alerts
5. ✅ Collect user feedback

---

**You're now ready to deploy Upgrade to Vercel! 🚀**

Your students can now log in, see their marks, and get AI-powered recommendations - all live on Vercel!
