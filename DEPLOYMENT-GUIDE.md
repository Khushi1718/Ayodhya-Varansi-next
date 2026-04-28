# Vercel Deployment Guide

## ✅ Frontend (Next.js) - Deployed to Vercel

Your frontend is now ready to deploy to Vercel. The build is **100% clean** with no TypeScript errors.

## ⚠️ Backend (Express) - DO NOT Deploy to Vercel

Your Express backend in `/backend` should **NOT** be deployed to Vercel. Vercel is for static sites and serverless functions. Your Express server needs a persistent running process.

### Backend Deployment Options:

1. **Render.com** (Recommended - Free tier available)
   - Go to https://render.com
   - Create new Web Service
   - Connect GitHub repo
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables (see below)

2. **Railway.app**
   - Go to https://railway.app
   - Create new project
   - Deploy from GitHub
   - Set root directory: `backend`
   - Add environment variables

3. **Heroku** (Requires paid plan now)
4. **DigitalOcean App Platform**
5. **AWS, Azure, or Google Cloud**

## 🔐 Environment Variables Setup

### In Vercel Project Settings:

Go to **Project Settings → Environment Variables** and add:

```
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_URL=https://divine-journeys-next.vercel.app (your actual URL)
REVALIDATE_SECRET=generate-a-secure-random-string
```

### For Backend Deployment (Render/Railway):

```
MONGODB_URI=mongodb+srv://Khushi:Zjcx5MwUvJG1PALH@cluster0.3ddffyv.mongodb.net/varanasi-ayodhya?retryWrites=true&w=majority
PORT=10000 (or auto-assigned)
```

## 📋 Deployment Checklist

- [ ] Build passes locally: `npm run build` ✅ (Already done)
- [ ] `.vercelignore` created to exclude backend ✅ (Just created)
- [ ] `vercel.json` created ✅ (Just created)
- [ ] Environment variables set in Vercel dashboard
- [ ] Backend deployed to Render/Railway/other service
- [ ] `NEXT_PUBLIC_BACKEND_URL` updated in Vercel to point to deployed backend
- [ ] Test CMS endpoints from deployed app

## 🚀 Deploy to Vercel

1. Commit your changes:
   ```bash
   git add .
   git commit -m "fix: update Vercel configuration and deployment setup"
   git push origin main
   ```

2. Go to https://vercel.com/dashboard
3. Connect your repository (if not already connected)
4. Vercel will automatically deploy on each push to main

## 🔗 Testing After Deployment

After both frontend and backend are deployed:

1. Visit your Vercel app
2. Go to /cms page
3. Try creating a blog post
4. If it fails, check:
   - Backend is running and accessible
   - `NEXT_PUBLIC_BACKEND_URL` is correctly set in Vercel
   - CORS is enabled on backend (already configured)
   - MongoDB connection is working

## ❌ Troubleshooting

If you still see the Blog type error in Vercel:
1. Clear Vercel build cache: Project Settings → Deployments → Redeploy
2. Force a rebuild: git commit with empty commit `git commit --allow-empty -m "rebuild"`
3. Check build logs in Vercel dashboard for actual error

## Notes

- ✅ All TypeScript errors are fixed locally
- ✅ Build passes successfully
- ✅ Backend is properly excluded from Vercel
- ⚠️ DO NOT deploy backend to Vercel - it won't work
- ⚠️ Update environment variables BEFORE deploying backend
