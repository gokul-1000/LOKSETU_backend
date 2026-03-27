# LOKSETU Deployment Guide

## Prerequisites
1. GitHub account (you already have this! ✅)
2. Vercel account (for frontend)
3. Railway account (for backend)

---

## Step 1: Create Accounts

### Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign in with GitHub (recommended)
4. Authorize Vercel

### Railway Account  
1. Go to https://railway.app
2. Click "Start Free"
3. Sign in with GitHub (recommended)
4. Authorize Railway

---

## Step 2: Deploy Backend to Railway

### 2.1 Prepare Backend

1. Ensure `backend/package.json` has a `start` script:
```json
"scripts": {
  "start": "node src/server.js"
}
```

2. Create `backend/.env.production` with production variables:
```
DATABASE_URL=your_db_url
GOOGLE_VISION_API_KEY=your_key
GEMINI_API_KEY=your_key
NODE_ENV=production
PORT=3000
```

### 2.2 Deploy to Railway

1. Go to https://railway.app/dashboard
2. Click "New Project" → "Deploy from GitHub"
3. Select your LOKSETU_backend repository
4. Choose `backend` folder as root directory
5. Set environment variables in Railway dashboard:
   - `DATABASE_URL`
   - `GOOGLE_VISION_API_KEY`
   - `GEMINI_API_KEY`
   - `NODE_ENV=production`
   - `PORT=3000`

6. Railway will auto-deploy when you push to GitHub ✅

### Get Your Backend URL
- Railway will give you a URL like: `https://your-app.railway.app`
- Use this in your frontend API calls

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Prepare Frontend

1. Update `src/api/client.js` to use production backend URL:
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:3001';
```

2. Create `.env.production` in root:
```
VITE_API_URL=https://your-backend.railway.app
```

### 3.2 Deploy to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your LOKSETU_backend repository
4. Configure:
   - **Framework**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.railway.app`

6. Click "Deploy" ✅

---

## Step 4: Database Setup (if using new DB)

If switching to a cloud database:

### PostgreSQL on Railway
1. In Railway dashboard, create new PostgreSQL service
2. Copy connection string
3. Set as `DATABASE_URL` in backend environment

### Run Migrations
```bash
cd backend
npx prisma migrate deploy
npx prisma db seed
```

---

## Step 5: Final Testing

1. Visit your Vercel frontend URL
2. Test login, file complaint, and other features
3. Check browser console for API errors
4. Monitor backend logs in Railway dashboard

---

## Monitoring & Updates

### Auto-Deploy on Push
Both Vercel and Railway auto-deploy when you push to GitHub master branch

### View Logs
- **Vercel**: Dashboard → Your project → Deployments
- **Railway**: Dashboard → Your project → Logs

### Custom Domain (Optional)
- Vercel: Settings → Domains → Add your domain
- Railway: Not needed if using Vercel domain

---

## Troubleshooting

### 403 CORS Error
In `backend/src/server.js`, add CORS:
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://your-vercel-domain.vercel.app',
  credentials: true
}));
```

### API Not Responding
1. Check Railway logs for errors
2. Verify `VITE_API_URL` in Vercel environment
3. Check database connection string

### Build Fails
1. Run `npm install` locally in both folders
2. Run `npm run build` to test locally first

---

## Useful Links
- Backend URL: https://railway.app/dashboard
- Frontend URL: https://vercel.com/dashboard
- GitHub: https://github.com/gokul-1000/LOKSETU_backend
