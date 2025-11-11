# 🎯 EASIEST DEPLOYMENT (No Git Push Needed!)

## ✅ Upload Code to GitHub Using Web Interface

Since Git authentication can be tricky, let's use GitHub's web interface:

### Step 1: Prepare Code for Upload (2 minutes)

1. **Create a ZIP file:**
   - Right-click on your folder: `C:\Users\karam\OneDrive\Documents\Candidate Screening`
   - Send to → Compressed (zipped) folder
   - Name it: `candidatescreening.zip`

### Step 2: Upload to GitHub (3 minutes)

1. **Go to your repository:**
   - https://github.com/karam-polaris/candidatescreening

2. **Upload files:**
   - Click "uploading an existing file"
   - Or: Click "Add file" → "Upload files"
   
3. **Drag the entire folder contents:**
   - Extract your ZIP first
   - Select ALL files and folders from: `Candidate Screening` folder
   - Drag them into the GitHub upload area
   
4. **Commit:**
   - Scroll down
   - Commit message: "Initial commit - Dollar City app"
   - Click "Commit changes"

✅ Your code is now on GitHub!

---

## 🚀 Now Deploy to Vercel + Render

### PART A: Deploy Database on Render (3 min)

1. **Go to:** https://render.com
2. **Sign up** with GitHub
3. **New +** → **PostgreSQL**
   - Name: `dollarcity-db`
   - Database: `candidate_screening`
   - Plan: **Free**
   - Click **Create**
4. **Copy "Internal Database URL"** from Connections tab
   - Save it! Example: `postgres://user:pass@host/db`

---

### PART B: Deploy API on Render (5 min)

1. **New +** → **Web Service**
2. **Connect** your GitHub repo: `karam-polaris/candidatescreening`
3. **Configure:**
   - Name: `dollarcity-api`
   - Root Directory: `apps/api`
   - Build Command:
     ```
     npm install -g pnpm && pnpm install && pnpm build && npx prisma generate && npx prisma migrate deploy
     ```
   - Start Command:
     ```
     node dist/main.js
     ```
   - Plan: **Free**

4. **Environment Variables** (click Advanced):
   ```
   DATABASE_URL = (paste from Part A)
   NODE_ENV = production
   PORT = 10000
   ```

5. **Create Web Service** → Wait 5-7 minutes

6. **Copy your API URL:**
   - Example: `https://dollarcity-api.onrender.com`

---

### PART C: Import Jobs to Database (2 min)

1. In your API service → Click **"Shell"** tab at top
2. Run these commands one by one:
   ```bash
   cd /opt/render/project/src
   node ../../scripts/seed/import-data.js
   ```
3. Wait for success message

---

### PART D: Deploy Frontend on Vercel (3 min)

1. **Go to:** https://vercel.com
2. **Sign up** with GitHub
3. **Add New** → **Project**
4. **Import** your repo: `karam-polaris/candidatescreening`
5. **Configure:**
   - Framework: Next.js ✓ (auto-detected)
   - Root Directory: Click "Edit" → select `apps/web`
   - Build Command: (leave default)

6. **Environment Variables** → Add:
   ```
   NEXT_PUBLIC_API_URL = https://dollarcity-api.onrender.com
   ```
   (Use YOUR API URL from Part B)

7. **Deploy** → Wait 3-5 minutes

8. **Get your URL:**
   - Example: `https://candidatescreening-xxxx.vercel.app`

---

## 🎉 YOU'RE LIVE!

Visit: `https://your-app.vercel.app`

You should see:
- ✅ 99 Dollar City jobs
- ✅ Search and filters
- ✅ Click jobs → see candidates
- ✅ Fit scores working

---

## ⚠️ If Something Goes Wrong

### Jobs not showing:
- Visit API directly: `https://your-api.onrender.com/api/jobs`
- Should see JSON array of jobs
- If empty, re-run import in Render Shell (Part C)

### Build fails on Render:
- Check Root Directory is: `apps/api`
- Check build command has `pnpm install`
- View logs for specific error

### Build fails on Vercel:
- Check Root Directory is: `apps/web`
- Check environment variable is correct
- No trailing slash in API URL

### First load is slow:
- Normal! Render free tier has cold starts
- Takes 10-30 seconds on first visit
- After that, it's fast

---

## 💰 Total Cost

**$0 per month** - Both services are free tier!

---

## 📞 Need Help?

Just tell me which step you're on and what error you see!

