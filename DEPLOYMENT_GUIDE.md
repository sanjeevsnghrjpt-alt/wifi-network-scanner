# WiFi Network Scanner - Public Deployment Guide

## Overview
This guide helps you deploy the WiFi Network Scanner so others can access it publicly.

## Important Note ⚠️
**Network scanning requires running the backend on the network you want to scan.** Cloud hosting only scans the cloud server's network. For actual WiFi device scanning, users need the backend running locally or on their network.

---

## Option 1: Full Public Deployment (Recommended for demo purposes)

### Step 1: Deploy Frontend to Vercel (FREE)
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub/Google/email
3. Click "New Project"
4. Select "Import Git Repository" (you'll need to create a GitHub repo first)
5. Upload the `frontend` folder
6. Set build command: `npm run build`
7. Set start command: `npm start`
8. Deploy - you'll get a public URL instantly ✓

### Step 2: Deploy Backend to Railway.app (FREE tier)
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project → "Deploy from GitHub"
4. Select your repository
5. Add environment variables (if using external AI APIs)
6. Deploy - you'll get a backend URL
7. Update `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
   ```

### Step 3: Update Backend CORS
Edit `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: ['https://your-vercel-domain.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

---

## Option 2: GitHub + Local Backend (Best for actual network scanning)

### For Your Users:
1. **Download/Clone the code:**
   ```bash
   git clone https://github.com/yourusername/wifi-network-scanner
   cd wifi-network-scanner
   ```

2. **Run the backend locally** (on their network):
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Run the frontend locally:**
   ```bash
   cd frontend
   npm install
   NEXT_PUBLIC_API_URL=http://localhost:3001 npm run dev
   ```

4. **Access on their device:**
   - Open `http://localhost:3000` on any device on the same network
   - The scanner will show all connected devices

---

## How to Get Started RIGHT NOW

### 1. Install Git (Required for GitHub)
Download from: https://git-scm.com/download/win

### 2. Create GitHub Repository
1. Go to [GitHub.com](https://github.com), sign up if needed
2. Click "+" → "New repository"
3. Name it: `wifi-network-scanner`
4. Click "Create repository"
5. Copy the commands shown and run them:
   ```bash
   cd "d:\New folder"
   git init
   git add .
   git commit -m "Initial commit: WiFi Network Scanner"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/wifi-network-scanner.git
   git push -u origin main
   ```

### 3. Deploy Frontend to Vercel (Takes 2 minutes)
1. Go to [Vercel.com](https://vercel.com/new)
2. Import your GitHub repo
3. Select the `frontend` folder as root
4. Click "Deploy"
5. Share the generated URL with anyone!

### 4. Optional: Deploy Backend to Railway
For cloud scanning capability (limited use but looks impressive)

---

## What You'll Get

✅ **Public URL** - Anyone can visit and see the website
✅ **Source Code Visible** - On GitHub for transparency
✅ **Auto-Scaling** - Vercel scales automatically
✅ **Free Hosting** - Both Vercel and Railway have free tiers
✅ **Easy Sharing** - One URL to share with anyone

---

## Limitations & How to Work Around Them

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't see devices | Backend scans cloud server network | Users run backend locally |
| Doesn't scan my WiFi | Same as above | Deploy backend on local network or VM on WiFi |
| Connection refused | Backend URL wrong | Update `.env.local` with correct backend URL |

---

## SEO & Discoverability  
To make it searchable on Google:
1. Add proper metadata in `frontend/app/layout.tsx`
2. Create a domain name (optional, not needed for Vercel)
3. Set up a landing page explaining what it does
4. Share on GitHub - repos are indexed by Google

---

## Quick Command Checklist
```bash
# Install Git, then:
cd "d:\New folder"
git init
git add .
git commit -m "WiFi Network Scanner"
git remote add origin https://github.com/YOUR_USERNAME/wifi-network-scanner.git
git push -u origin main

# Then deploy frontend to Vercel via their website
```

---

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- GitHub Docs: https://docs.github.com

---

**Next Steps:**
1. Install Git from https://git-scm.com
2. Create GitHub account (free)
3. Run the git commands above
4. Deploy frontend to Vercel (free, instant)
5. Share your public URL!
