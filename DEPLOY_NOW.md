# 🚀 Deploy to Railway - 10 Minute Guide

## What You'll Get
- ✅ Live URL: `https://your-app.railway.app`
- ✅ Professional demo for clients
- ✅ Free for ~2 weeks ($5 credit)
- ✅ Database + API + Web app all working

---

## Step 1: Push Your Code to GitHub (If Not Already)

```bash
cd "C:\Users\karam\OneDrive\Documents\Candidate Screening"

# Initialize git (if needed)
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/dollarcity-app.git
git push -u origin main
```

---

## Step 2: Sign Up for Railway (1 minute)

1. Go to: **https://railway.app**
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway

✅ You're in!

---

## Step 3: Create Database (2 minutes)

1. Click **"+ New Project"**
2. Select **"Provision PostgreSQL"**
3. Railway creates database automatically
4. Click the database → **"Variables"** tab
5. Copy the **DATABASE_URL** (you'll need this!)

Example: `postgresql://postgres:password@host.railway.app:5432/railway`

---

## Step 4: Deploy API Backend (3 minutes)

1. In your project → Click **"+ New"**
2. Select **"GitHub Repo"**
3. Find and select **your Dollar City repo**
4. Railway will ask what to deploy → Click **"Add variables first"**

### Add Environment Variables:
```
DATABASE_URL = (paste from Step 3)
PORT = 4000
NODE_ENV = production
WEB_URL = https://your-app.railway.app (we'll update this later)
```

### Configure Build Settings:
1. Click **"Settings"** tab
2. **Root Directory:** `apps/api`
3. **Build Command:** `npm install -g pnpm && pnpm install && pnpm build`
4. **Start Command:** `node dist/main.js`
5. **Deploy**

⏳ Wait 2-3 minutes for deployment...

### Get Your API URL:
1. Click **"Settings"**
2. Click **"Generate Domain"**
3. Copy the URL: `https://your-api.railway.app`

---

## Step 5: Run Database Migration (1 minute)

1. In API service → Click **"Settings"**
2. Scroll to **"Deploy Triggers"**
3. Add custom start command:
```bash
npx prisma migrate deploy && node dist/main.js
```
4. **Redeploy**

---

## Step 6: Deploy Web Frontend (3 minutes)

1. Go back to project → Click **"+ New"**
2. Select **"GitHub Repo"** (same repo)
3. Select the repo again

### Add Environment Variables:
```
NEXT_PUBLIC_API_URL = https://your-api.railway.app (from Step 4)
```

### Configure Build Settings:
1. Click **"Settings"**
2. **Root Directory:** `apps/web`
3. Railway auto-detects Next.js ✅
4. **Deploy**

⏳ Wait 3-4 minutes...

### Get Your Web URL:
1. Click **"Settings"**
2. Click **"Generate Domain"**
3. Copy URL: `https://your-app.railway.app`

---

## Step 7: Import Your Data (Optional)

If jobs didn't import automatically:

1. In API service → Click **"Deployments"**
2. Click latest deployment → **"View Logs"**
3. If no jobs, manually run:
   - Click **"Settings"** → **"Variables"**
   - Add: `AUTO_SEED=true`
   - Redeploy

Or use Railway CLI:
```bash
npm i -g @railway/cli
railway login
railway run node scripts/seed/import-data.js
```

---

## Step 8: Update API CORS (Important!)

The API needs to allow requests from your web URL:

1. Edit `apps/api/src/main.ts` locally
2. Add your Railway web URL to CORS:

```typescript
app.enableCors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://your-app.railway.app',  // ADD THIS
    process.env.WEB_URL || 'http://localhost:3000'
  ],
  credentials: true
});
```

3. Commit and push to GitHub:
```bash
git add .
git commit -m "Add production CORS"
git push
```

4. Railway auto-deploys! ✅

---

## ✅ YOU'RE LIVE!

Visit: **https://your-app.railway.app**

You should see:
- 99 Dollar City jobs
- Search and filters working
- Click jobs to see candidates
- All features working!

---

## 🎯 Share with Client

Send them:
```
🏪 Dollar City Recruitment Demo

👉 https://your-app.railway.app

Features:
• 99 job positions across Colombia & Peru
• 278 candidates with realistic fit scores
• Smart filtering by location and role
• Transparent scoring system
• AI chatbot (optional with API key)

Try: Search for "Auxiliar de Tienda" and click any job!
```

---

## 💰 Costs

- **First ~2 weeks:** FREE ($5 credit)
- **After that:** ~$5-10/month
- **To save money:** Switch to Vercel + Render (free) later

---

## 🐛 Troubleshooting

### Problem: Jobs Not Loading
**Solution:**
1. Check API is running: Visit `https://your-api.railway.app/api/jobs`
2. Should see JSON with jobs
3. If not, check API logs in Railway

### Problem: "CORS Error" in Browser
**Solution:**
1. Make sure you added your web URL to CORS (Step 8)
2. Redeploy API

### Problem: Database Connection Error
**Solution:**
1. Check DATABASE_URL is correct in API variables
2. Make sure it's the **internal** database URL from Railway

### Problem: Build Fails
**Solution:**
1. Check build command has `pnpm` install
2. Look at deployment logs for specific error
3. Make sure root directory is correct (`apps/api` or `apps/web`)

---

## 📞 Need Help?

Common issues and fixes are in the full guide: `DEPLOYMENT_GUIDE.md`

---

## 🎉 You Did It!

Your Dollar City app is now live and ready for client demos! 🚀🏪

**Next Steps:**
1. Test all features on the live site
2. Prepare your demo talking points
3. Send the link to your client
4. Wow them with the smart candidate matching! ✨

