# 🚀 PharmaGuard Backend Deployment to Render — Complete Guide

## ✅ Pre-Deployment Checklist

Your backend is production-ready:
- [x] PORT uses `process.env.PORT || 5000`
- [x] No localhost hardcoded references
- [x] package.json has `"start": "node server.js"`
- [x] CORS enabled globally
- [x] .env file created for environment variables
- [x] Health check route added (`GET /`)

---

## 📤 Step 1: Push to GitHub

**Your repository structure:**
```
PharmaGuard/
├── backend/           ← We're deploying this
│   ├── server.js
│   ├── package.json
│   ├── .env          ← Won't be committed (in .gitignore)
│   └── routes/
├── frontend/         ← Deploy separately
├── ml/              ← Deploy separately
└── .gitignore       ← Includes .env
```

**Push to GitHub:**
```powershell
cd c:\Users\sharm\OneDrive\Desktop\PharmaGuard
git add .
git commit -m "Prepare backend for Render deployment"
git push origin main
```

If you don't have a GitHub repo yet:
1. Go to https://github.com/new
2. Create `PharmaGuard` repository
3. Copy HTTPS URL (e.g., `https://github.com/yourusername/PharmaGuard.git`)
4. Run:
```powershell
git remote add origin <YOUR_HTTPS_URL>
git push -u origin main
```

---

## 🌍 Step 2: Create Render Account & Connect GitHub

1. Go to https://render.com
2. Click **Sign up** (use GitHub account)
3. Click **New + → Web Service**
4. Click **GitHub**
5. Select your **PharmaGuard** repository
6. Authorize Render to access your GitHub

---

## ⚙️ Step 3: Configure Backend Service on Render

Fill in these fields:

### **Name**
```
pharmaguard-backend
```
(Or any name you prefer)

### **Root Directory**
```
backend
```
⚠️ This tells Render to only run code inside `backend/` folder.

### **Runtime**
```
Node
```
(Should auto-detect)

### **Build Command**
```
npm install
```

### **Start Command**
```
npm start
```

---

## 🔐 Step 4: Add Environment Variables in Render

Scroll down to **Environment** section.

Click **"Add Environment Variable"** for each:

| Key | Value |
|-----|-------|
| `PYTHON_BACKEND_URL` | (Leave blank for now, set after ML is deployed) |
| `PYTHON_VALIDATOR_URL` | (Leave blank for now) |
| `FORWARD_TIMEOUT_MS` | `10000` |
| `FORWARD_RETRIES` | `2` |

**For now**, you can leave the ML URLs blank. We'll update them after deploying the ML service.

---

## 🧯 Step 5: Deploy

1. Scroll down
2. Click **"Create Web Service"**
3. Render will:
   - Pull your GitHub repo
   - Install dependencies
   - Start the server

⏳ **Wait 2-5 minutes for deployment**

When you see:
```
Backend listening on 10000
```
✅ **Your backend is live!**

---

## 🧪 Step 6: Test Your Backend

Render will give you a URL like:
```
https://pharmaguard-backend.onrender.com
```

**Test it in your browser:**
```
https://pharmaguard-backend.onrender.com/
```

You should see:
```json
{
  "success": true,
  "message": "PharmaGuard Backend is running",
  "version": "1.0.0",
  "timestamp": "2026-02-20T..."
}
```

✅ **If you see this, your backend is live!**

---

## 🧨 Test the API Endpoint

Once ML service is deployed, test the analyze endpoint:

```
curl -X POST https://pharmaguard-backend.onrender.com/api/analyze \
  -F "vcf_file=@test.vcf" \
  -F "drugs=Warfarin"
```

Or use Postman.

---

## 🚨 Common Errors & Fixes

### Error: "Cannot find module express"
**Problem:** dependency missing in package.json
**Fix:** Render auto-redeploys when you push. Just make sure dependency is in package.json:
```powershell
cd backend
npm install express --save
git add package.json
git commit -m "Add missing dependency"
git push
```

### Error: "Port already in use"
**Problem:** Hardcoded PORT in code
**Fix:** We already fixed this—PORT uses environment variable ✅

### Error: "Cannot read property of undefined"
**Problem:** PYTHON_BACKEND_URL not set
**Fix:** Set it in Render Environment Variables (after ML is deployed)

### Error: "App crashed, restarting"
**Check logs** in Render dashboard:
- Look for errors in the Logs tab
- Common causes:
  - Wrong file path
  - Missing dependency
  - Syntax error in code

---

## 📝 Next Steps After Backend is Live

1. **Update Frontend** to use backend URL:
   - Go to `frontend/.env`
   - Add: `VITE_API_URL=https://pharmaguard-backend.onrender.com`
   - Update API calls to use this URL

2. **Deploy ML Service** to Render or other platform

3. **Update Backend Environment Variables** with ML service URL

4. **Deploy Frontend** to Render or Vercel

5. **Lock CORS** to frontend URL only:
   ```javascript
   app.use(cors({
     origin: 'https://pharmaguard-frontend.onrender.com'
   }))
   ```

---

## 🔗 Important URLs

Once everything is deployed:
- Backend: `https://pharmaguard-backend.onrender.com`
- Frontend: (will be separate URL after deployment)
- ML Service: (will be separate URL after deployment)

Update each service to point to the correct URLs.

---

## 📊 Monitoring

In Render dashboard:
- **Logs**: Real-time server logs
- **Metrics**: CPU, Memory, Request count
- **Auto-deploy**: Redeploys on every push to main

---

**You're all set! 🎉**

Once backend is live on Render, let me know the URL and we can:
1. Deploy the ML service
2. Connect backend to ML
3. Deploy the frontend
4. Test the complete application
