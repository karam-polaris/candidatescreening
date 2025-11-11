# 🚀 Deploy Dollar City to Vercel + Render (FREE)

## ✅ What You'll Get
- Frontend: `https://dollarcity-XXXXX.vercel.app` (FREE, fast)
- API: `https://dollarcity-api.onrender.com` (FREE)
- Database: PostgreSQL on Render (FREE)

---

## 📋 CHECKLIST (Follow in Order)

### ☐ PART 1: Push to GitHub (5 minutes)

1. **Initialize Git** (if not already done):
```bash
cd "C:\Users\karam\OneDrive\Documents\Candidate Screening"
git status
```

2. **If git not initialized:**
```bash
git init
git add .
git commit -m "Initial commit - Dollar City recruitment app"
```

3. **Create GitHub repository:**
   - Go to: https://github.com/new
   - Name: `dollarcity-recruitment`
   - Keep it Private (for now)
   - Don't initialize with README (we have code already)
   - Click "Create repository"

4. **Push your code:**
```bash
git remote add origin https://github.com/YOUR-USERNAME/dollarcity-recruitment.git
git branch -M main
git push -u origin main
```

✅ Code is on GitHub!

---

### ☐ PART 2: Deploy Database on Render (3 minutes)

1. **Sign up for Render:**
   - Go to: https://render.com
   - Click "Get Started"
   - Sign up with GitHub

2. **Create PostgreSQL Database:**
   - Dashboard → Click "New +"
   - Select "PostgreSQL"
   - Settings:
     - **Name:** `dollarcity-db`
     - **Database:** `candidate_screening`
     - **User:** `postgres`
     - **Region:** Oregon (or closest to you)
     - **Plan:** Free
   - Click "Create Database"

3. **Wait 2 minutes** for database to provision

4. **Copy connection strings:**
   - Click on your database
   - Find "Connections" section
   - Copy **"Internal Database URL"** (starts with postgres://)
   - Save it somewhere - you'll need it!

Example:
```
postgres://dollarcity_db_user:XXX@dpg-XXX.oregon-postgres.render.com/dollarcity_db
```

✅ Database ready!

---

### ☐ PART 3: Deploy API on Render (5 minutes)

1. **Create Web Service:**
   - Dashboard → Click "New +"
   - Select "Web Service"
   - Connect your GitHub repository
   - Select `dollarcity-recruitment` repo

2. **Configure Service:**
   - **Name:** `dollarcity-api`
   - **Region:** Oregon (same as database)
   - **Branch:** `main`
   - **Root Directory:** `apps/api`
   - **Runtime:** Node
   - **Build Command:**
     ```bash
     npm install -g pnpm && pnpm install && pnpm build && npx prisma generate && npx prisma migrate deploy
     ```
   - **Start Command:**
     ```bash
     node dist/main.js
     ```
   - **Plan:** Free

3. **Add Environment Variables:**
   Click "Advanced" → Add these:
   
   ```
   DATABASE_URL = (paste from Part 2)
   NODE_ENV = production
   PORT = 10000
   ```

4. **Create Service** - Wait 5-7 minutes for build

5. **Get API URL:**
   - Once deployed, copy the URL
   - Example: `https://dollarcity-api.onrender.com`

✅ API deployed!

---

### ☐ PART 4: Import Jobs to Database (2 minutes)

**Option A: Use Render Shell**
1. Go to your API service on Render
2. Click "Shell" tab
3. Run:
```bash
cd /opt/render/project/src
node ../../scripts/seed/import-data.js
```

**Option B: Use your local machine**
1. Update local `.env` with production DATABASE_URL
2. Run locally:
```bash
cd "C:\Users\karam\OneDrive\Documents\Candidate Screening"
node scripts/seed/import-data.js
```

✅ 99 jobs imported!

---

### ☐ PART 5: Deploy Frontend on Vercel (3 minutes)

1. **Sign up for Vercel:**
   - Go to: https://vercel.com
   - Click "Sign Up"
   - Choose "Continue with GitHub"

2. **Import Project:**
   - Dashboard → Click "Add New..." → "Project"
   - Import your `dollarcity-recruitment` repository
   - Click "Import"

3. **Configure Build:**
   - **Framework Preset:** Next.js (auto-detected ✓)
   - **Root Directory:** `apps/web`
   - Click "Edit" next to Root Directory
   - Select `apps/web`

4. **Add Environment Variable:**
   Click "Environment Variables" → Add:
   ```
   NEXT_PUBLIC_API_URL = https://dollarcity-api.onrender.com
   ```
   (Use YOUR API URL from Part 3)

5. **Deploy:**
   - Click "Deploy"
   - Wait 3-5 minutes

6. **Get Your Live URL:**
   - After deploy completes
   - You'll see: `https://dollarcity-recruitment-XXXXX.vercel.app`
   - Click "Visit" to open it!

✅ Frontend deployed!

---

## 🎉 YOU'RE LIVE!

Your app is now at: `https://your-app.vercel.app`

Test it:
- [ ] Jobs load on homepage
- [ ] Search works
- [ ] Filters work
- [ ] Click a job → see candidates
- [ ] Fit scores show correctly
- [ ] Home button works
- [ ] Calibration works

---

## ⚠️ Troubleshooting

### Problem: "No jobs showing"
**Solution:**
- Visit API directly: `https://dollarcity-api.onrender.com/api/jobs`
- Should see JSON array
- If empty, re-run import script (Part 4)

### Problem: "CORS Error"
**Solution:**
- Already fixed in code! (I updated main.ts)
- If still happens, redeploy API on Render

### Problem: "Can't connect to API"
**Solution:**
- Check NEXT_PUBLIC_API_URL is correct in Vercel
- Go to Vercel → Project → Settings → Environment Variables
- Make sure it's: `https://dollarcity-api.onrender.com` (no trailing slash)

### Problem: "API is slow on first load"
**Solution:**
- This is normal! Render free tier has "cold starts"
- First load takes 10-30 seconds
- After that, it's fast
- Just tell clients: "App is waking up..." 😊

---

## 💰 Costs

| Service | Cost | Limits |
|---------|------|--------|
| Vercel | $0 | Free forever, 100GB bandwidth |
| Render API | $0 | 750 hours/month free |
| Render DB | $0 | 1GB storage, expires after 90 days |

**Total: $0 per month!**

---

## 🔄 Making Updates

When you update your code:

1. **Commit and push:**
```bash
git add .
git commit -m "Your update message"
git push
```

2. **Auto-deploys:**
   - Vercel: Auto-deploys frontend ✅
   - Render: Auto-deploys API ✅

Done! No manual deploy needed.

---

## 📤 Share with Client

```
🏪 Dollar City Recruitment System - Live Demo

👉 https://your-app.vercel.app

What you'll see:
✓ 99 job positions (Colombia & Peru)
✓ 278 candidates with realistic fit scores
✓ Smart search and filtering
✓ Transparent scoring explanation
✓ Job calibration tools

Try searching for "Auxiliar de Tienda"!

Note: First load may take 10-20 seconds 
(free hosting, waking up the server 😊)
```

---

## 🎯 Next Steps

After deployment works:

1. **Custom Domain** (optional):
   - Buy domain on Namecheap/GoDaddy
   - Add to Vercel: Settings → Domains
   - Example: `dollarcity-demo.com`

2. **Enable AI Chatbot:**
   - Add OpenAI API key to Render environment
   - Redeploy API
   - Chat button will work!

3. **Analytics** (optional):
   - Vercel has built-in analytics
   - See visitor counts, performance

---

## ✅ You Did It!

Your app is live and FREE forever! 🎉

Need help with any step? Just ask! 🚀

