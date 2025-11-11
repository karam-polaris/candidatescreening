# 🚀 Deploy Dollar City App Online - Easy Guide

## 🥇 OPTION 1: Railway (EASIEST - RECOMMENDED)

**Why Railway?**
✅ Deploy everything in one place (frontend, backend, database)
✅ Free $5 credit per month (enough for demos)
✅ Automatic HTTPS
✅ PostgreSQL included
✅ Takes 10 minutes

### Step-by-Step:

#### 1. Sign Up
- Go to: https://railway.app
- Click "Start a New Project"
- Sign up with GitHub

#### 2. Create PostgreSQL Database
```
1. Click "New Project" → "Provision PostgreSQL"
2. Railway automatically creates a database
3. Copy the DATABASE_URL (you'll need it)
```

#### 3. Deploy API (Backend)
```
1. In Railway dashboard → Click "+ New"
2. Select "GitHub Repo" → Connect your repo
3. Select the "apps/api" folder as root directory
4. Add Environment Variables:
   - DATABASE_URL: (use the PostgreSQL connection string Railway gives you)
   - PORT: 4000
   - NODE_ENV: production
   
5. Set Build Command: cd apps/api && pnpm install && pnpm build
6. Set Start Command: cd apps/api && node dist/main.js
7. Click Deploy
```

#### 4. Deploy Web App (Frontend)
```
1. Click "+ New" again
2. Select same GitHub repo
3. Select "apps/web" as root directory
4. Add Environment Variables:
   - NEXT_PUBLIC_API_URL: (your API URL from step 3, e.g., https://your-api.railway.app)
   
5. Railway auto-detects Next.js
6. Click Deploy
```

#### 5. Run Database Migrations
```
In Railway API service:
1. Go to Settings → Deploy Triggers
2. Add custom command: npx prisma migrate deploy
```

#### 6. Import Jobs
```
1. Railway API service → Variables → Add:
   - IMPORT_JOBS: true
2. Or manually run seed script from Railway CLI
```

**Done!** Your app is live at:
- Frontend: `https://your-app.railway.app`
- API: `https://your-api.railway.app`

**Cost:** $0 for first month with trial credits

---

## 🥈 OPTION 2: Vercel + Render (FREE FOREVER)

**Why This?**
✅ 100% free (for demos)
✅ Vercel = best for Next.js
✅ Render = free PostgreSQL + API hosting
✅ Takes 15 minutes

### Step-by-Step:

#### Part A: Deploy Database + API on Render

1. **Sign Up at Render.com**
   - Go to: https://render.com
   - Sign up with GitHub

2. **Create PostgreSQL Database**
   ```
   1. Dashboard → New → PostgreSQL
   2. Name: dollarcity-db
   3. Plan: Free
   4. Click Create
   5. Copy "Internal Database URL"
   ```

3. **Deploy API**
   ```
   1. Dashboard → New → Web Service
   2. Connect your GitHub repo
   3. Settings:
      - Name: dollarcity-api
      - Root Directory: apps/api
      - Build Command: pnpm install && pnpm build
      - Start Command: node dist/main.js
      - Plan: Free
      
   4. Environment Variables:
      - DATABASE_URL: (paste from step 2)
      - PORT: 10000
      - NODE_ENV: production
      
   5. Click Create
   6. Copy your API URL: https://dollarcity-api.onrender.com
   ```

#### Part B: Deploy Frontend on Vercel

1. **Sign Up at Vercel**
   - Go to: https://vercel.com
   - Sign up with GitHub

2. **Deploy Web App**
   ```
   1. Dashboard → Add New → Project
   2. Import your GitHub repo
   3. Settings:
      - Framework Preset: Next.js
      - Root Directory: apps/web
      
   4. Environment Variables:
      - NEXT_PUBLIC_API_URL: https://dollarcity-api.onrender.com
      
   5. Click Deploy
   ```

3. **Done!** Your app is at: `https://your-app.vercel.app`

**Cost:** $0 forever (free tier)

**⚠️ Note:** Render free tier has cold starts (may be slow on first load after inactivity)

---

## 🥉 OPTION 3: Render (All-in-One, FREE)

**Why This?**
✅ Everything in one place
✅ 100% free for demos
✅ Simpler than split approach
✅ Takes 20 minutes

### Step-by-Step:

1. **Create `render.yaml` in project root:**
```yaml
services:
  # PostgreSQL Database
  - type: pserv
    name: dollarcity-db
    plan: free
    
  # API Backend
  - type: web
    name: dollarcity-api
    env: node
    region: oregon
    plan: free
    buildCommand: cd apps/api && pnpm install && pnpm build
    startCommand: cd apps/api && node dist/main.js
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: dollarcity-db
          property: connectionString
      - key: NODE_ENV
        value: production
    
  # Web Frontend
  - type: web
    name: dollarcity-web
    env: node
    region: oregon
    plan: free
    buildCommand: cd apps/web && pnpm install && pnpm build
    startCommand: cd apps/web && pnpm start
    envVars:
      - key: NEXT_PUBLIC_API_URL
        value: https://dollarcity-api.onrender.com
```

2. **Deploy:**
   - Go to Render dashboard
   - Click "New" → "Blueprint"
   - Connect GitHub repo
   - Render auto-deploys everything

**Cost:** $0 (free tier)

---

## 🏆 BEST FOR YOUR USE CASE

| Option | Best For | Cost | Setup Time | Speed |
|--------|----------|------|------------|-------|
| **Railway** | Easiest, fastest | $5/mo (free trial) | 10 min | ⚡ Fast |
| **Vercel + Render** | Free forever | $0 | 15 min | 🐢 Slow cold starts |
| **Render Only** | Simple, all-in-one | $0 | 20 min | 🐢 Slow cold starts |

### My Recommendation:

**For Client Demo → Use Railway**
- Fastest setup
- Best performance (no cold starts)
- Professional (won't make client wait)
- $5 free credit = 1-2 weeks free
- Worth it for important demo

**For Long-term Free → Use Vercel + Render**
- Completely free
- Good enough for demos if you warn client about first-load delay
- Can upgrade later if needed

---

## 📋 Pre-Deployment Checklist

Before deploying, make sure you have:

- [ ] Code pushed to GitHub
- [ ] `.env.example` file exists (for reference)
- [ ] Database migrations work locally
- [ ] All 99 jobs in your local database
- [ ] Test the app locally one more time

---

## 🛠️ Deployment Preparation

### 1. Create Production Environment File

Create `apps/api/.env.production` template:
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
NODE_ENV=production
PORT=4000
API_URL=https://your-api-url.com

# Optional: AI Chatbot
OPENAI_API_KEY=sk-your-key-here
```

### 2. Update CORS Settings

Edit `apps/api/src/main.ts`:
```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-domain.vercel.app',  // Add your deployed URL
    'https://your-domain.railway.app',
    process.env.WEB_URL || 'http://localhost:3000'
  ],
  credentials: true
});
```

### 3. Add Package.json Scripts

Ensure `apps/api/package.json` has:
```json
{
  "scripts": {
    "build": "nest build",
    "start": "node dist/main.js",
    "start:prod": "node dist/main.js"
  }
}
```

Ensure `apps/web/package.json` has:
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p ${PORT:-3000}"
  }
}
```

---

## 🚀 Quick Deploy Commands

### For Railway:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### For Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web
vercel --prod
```

---

## 🐛 Common Issues & Fixes

### Issue 1: Build Fails - "pnpm not found"
**Fix:** Add to build command:
```bash
npm install -g pnpm && pnpm install
```

### Issue 2: Database Connection Fails
**Fix:** Make sure DATABASE_URL uses the internal database URL (not external)

### Issue 3: Next.js API Routes Don't Work
**Fix:** Use API rewrites in `next.config.js`:
```javascript
async rewrites() {
  return [
    {
      source: '/api/:path*',
      destination: process.env.NEXT_PUBLIC_API_URL + '/api/:path*'
    }
  ]
}
```

### Issue 4: Environment Variables Not Loading
**Fix:** 
- Rebuild after adding env vars
- Check spelling exactly matches
- Use NEXT_PUBLIC_ prefix for client-side vars

---

## 📊 After Deployment

1. **Test the deployed app:**
   - Visit your URL
   - Check jobs load
   - Click into a job
   - Test filters
   - Try calibration

2. **Import your data:**
   ```bash
   # If jobs didn't import automatically
   # Use Railway/Render shell or run locally:
   node scripts/seed/import-data.js
   ```

3. **Monitor performance:**
   - Railway: Dashboard → Metrics
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Analytics

---

## 💰 Cost Comparison

| Service | Month 1 | Month 2+ | Notes |
|---------|---------|----------|-------|
| Railway | Free ($5 credit) | $5-20 | Pay as you grow |
| Render Free | $0 | $0 | Cold starts |
| Vercel + Render | $0 | $0 | Split hosting |
| Heroku | $0 (hobby) | $7-25 | Deprecated free tier |

---

## 🎯 Next Steps

1. Choose your deployment method (I recommend Railway for demo)
2. Follow the step-by-step guide above
3. Test thoroughly before client demo
4. Get your demo URL and share it!

**Questions? Issues?** Let me know and I'll help you deploy! 🚀

