# Deploy to Internet - Quick Start Guide

## Overview
Your LOKSETU app will be deployed to:
- **Frontend**: Vercel (free) - `https://your-app.vercel.app`
- **Backend**: Railway (free tier) - `https://your-app.railway.app`
- **Database**: PostgreSQL on Railway (free)

---

## STEP 1: Create Vercel Account (5 minutes)

1. Go to **https://vercel.com/signup**
2. Click **"Continue with GitHub"**
3. Authorize and connect your GitHub account
4. ✅ Done!

---

## STEP 2: Create Railway Account (5 minutes)

1. Go to **https://railway.app**
2. Click **"Start Free"** → **"Sign in with GitHub"**
3. Authorize and connect your GitHub account
4. Click **"Just now"** when asked "When will you deploy?"
5. ✅ Done!

---

## STEP 3: Update Environment Variables

### In your GitHub repo, add these files:

#### 1. `.env.production` (root folder - for Vercel)
```
VITE_API_URL=https://loksetu-backend.railway.app
```

#### 2. Update backend/.env.example for Railway reference
Already good! ✓

---

## STEP 4: Deploy Backend to Railway (10 minutes)

1. Go to **https://railway.app/dashboard**
2. Click **"+ New Project"** → **"Deploy from GitHub Repo"**
3. Select **`gokul-1000/LOKSETU_backend`**
4. Click **"Deploy"**

5. **Set Environment Variables** in Railway:
   - Go to **Variables** tab
   - Add each variable:
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `3000` |
   | `JWT_SECRET` | `your_secure_random_string_here` |
   | `FRONTEND_URL` | `https://your-frontend.vercel.app` |
   | `DATABASE_URL` | Auto-generated when you add PostgreSQL |
   | `GEMINI_API_KEY` | Your actual API key |
   | `GOOGLE_VISION_API_KEY` | Your actual API key |
   | `LLM_BACKEND_URL` | Your Python FastAPI URL |

6. **Add PostgreSQL Database:**
   - Click **"+ Add"** → **"Add from marketplace"** → **"PostgreSQL"**
   - Railway auto-fills `DATABASE_URL` ✓
   - Install Prisma migrations:
     ```bash
     cd backend
     npx prisma migrate deploy
     npx prisma db seed
     ```

7. **Get Your Backend URL:**
   - Go to Settings → Domain
   - Copy the URL (e.g., `https://loksetu-backend.railway.app`)
   - Save it - you'll need it for Vercel!

---

## STEP 5: Deploy Frontend to Vercel (10 minutes)

1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Paste: `https://github.com/gokul-1000/LOKSETU_backend`
4. Click **"Import"**

5. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: **./** (or leave blank)
   - Build Command: **`npm run build`**
   - Output Directory: **`dist`**

6. **Add Environment Variables:**
   - Click **"Environment Variables"**
   - Add:
     - Name: `VITE_API_URL`
     - Value: `https://your-backend-url.railway.app` (from Step 4)
   - Click **"Save"**

7. Click **"Deploy"** and wait ⏳
   - Takes 2-3 minutes
   - Get your Vercel URL from deployment page

8. **Update Railway CORS:**
   - Go back to Railway dashboard
   - Update `FRONTEND_URL = https://your-app.vercel.app`

---

## STEP 6: Test Your Deployment

1. **Visit your Vercel URL** → https://your-app.vercel.app
2. Try these:
   - ✅ Load the website
   - ✅ Click Login
   - ✅ Try to file a complaint
   - ✅ Check dashboard

3. **If something breaks:**
   - Check browser **Console** (F12) for errors
   - Check **Railway Logs** for backend errors
   - Check **Vercel Logs** for frontend errors

---

## Important Notes

### Auto-Deploy
- Every time you push to GitHub, both Vercel and Railway auto-deploy! 🚀
- Push code, wait 2-3 minutes, and it's live

### Environment Variables
- **Never commit `.env`** (it's in .gitignore ✓)
- Always set them in the platform dashboard

### Database
- Railway PostgreSQL is free for first month
- Then $5/month - very affordable
- You can scale up anytime

### Custom Domain (Optional)
- Vercel: Settings → Domains → Add your domain
- Railway: Not required, but can add if needed

---

## Troubleshooting

### Issue: 403 CORS Error
**Solution:** Make sure `FRONTEND_URL` is set in Railway backend variables

### Issue: API calls return 404
**Solution:** Check that `VITE_API_URL` in Vercel matches your Railway URL

### Issue: Build fails on Vercel
**Solution:** 
- Run `npm run build` locally to test
- Check if all dependencies are installed
- Review build logs in Vercel dashboard

### Issue: Database not working
**Solution:**
- Verify `DATABASE_URL` is set in Railway
- Run migrations: `npx prisma migrate deploy`

---

## Next Steps After Deployment

1. **Share your live URL** with your team
2. **Monitor logs** regularly for errors
3. **Scale backend** if needed (Railway settings)
4. **Add custom domain** when ready
5. **Set up monitoring** for uptime

---

## Useful Links

| Resource | URL |
|----------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Railway Dashboard | https://railway.app/dashboard |
| GitHub Repo | https://github.com/gokul-1000/LOKSETU_backend |
| Vercel Docs | https://vercel.com/docs |
| Railway Docs | https://railway.app/docs |

---

**You're ready to go live! 🎉**
