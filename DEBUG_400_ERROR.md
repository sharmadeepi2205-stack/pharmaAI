# 🔧 Debugging the 400 Error

## Current Status
- ❌ POST `/api/analyze` returns **400 Bad Request**
- ❌ Results not displaying

---

## Root Cause Analysis

The 400 error means the backend received the request but rejected it. Most likely:

1. **CORS headers not matching** - Request is being blocked
2. **File not being sent** - Multer can't read the file
3. **Render env variables not updated** - Using old configuration

---

## 🚀 Quick Fix Steps

### Step 1: Clear Browser Cache
Press `Ctrl + Shift + Delete` in browser → Clear all cache

### Step 2: Force Frontend Rebuild on Render
1. Go to https://dashboard.render.com
2. Select **pharmaai-up8b** (frontend)
3. Click **"Clear build cache"** in Settings
4. Click **"Redeploy"**
5. Wait 5 minutes for deployment

### Step 3: Verify Backend Environment Variables
1. Go to https://dashboard.render.com
2. Select **pharmaguard-backend-d36m** (backend)
3. Check **Settings → Environment Variables**

Ensure these are set EXACTLY:
```
PYTHON_BACKEND_URL = https://pharmaguard-ml.onrender.com/analyze
PYTHON_VALIDATOR_URL = https://pharmaguard-ml.onrender.com/validate
FORWARD_TIMEOUT_MS = 30000
FORWARD_RETRIES = 3
PORT = 5000
```

### Step 4: Verify CORS Configuration
Backend is set to allow **only**:
```
origin: 'https://pharmaai-up8b.onrender.com'
```

This is correct ✅

### Step 5: Test Backend Health Check
Open this in browser:
```
https://pharmaguard-backend-d36m.onrender.com/
```

Should return:
```json
{
  "success": true,
  "message": "PharmaGuard Backend is running",
  "version": "1.0.0",
  "timestamp": "2026-03-12T..."
}
```

If it shows **Cannot GET /** → There's a deployment issue

---

## 📋 Browser DevTools Debugging

### Check Network Tab (F12 → Network)
1. **Filter:** Type "analyze" 
2. **Click Analyze button**
3. Look for POST request to `/api/analyze`

**Check these properties:**
- **Request Headers:**
  - `Origin: https://pharmaai-up8b.onrender.com` ✅
  - `Content-Type: multipart/form-data; boundary=...` ✅

- **Request Payload:**
  - Should show form data with `vcf_file` and `drugs` ✅

- **Response:**
  - Status: should be 200 (not 400)
  - Body: should contain analysis results

### Common Issues:
| Status | Reason | Fix |
|--------|--------|-----|
| **400** | Bad request/file not sent | Check file upload in console |
| **404** | Route not found | Render deployment issue |
| **CORS error** | Frontend domain not allowed | Update backend CORS |
| **Timeout** | ML service too slow | Increase `FORWARD_TIMEOUT_MS` |

---

## 🐛 Local Testing (Before Render)

If fixing Render doesn't work, test locally:

```bash
cd backend
npm install
npm run dev
```

Then in another terminal:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` and test the upload. If it works locally but fails on Render, it's an environment variable issue.

---

## ✅ Final Checklist Before Deployment

Before saying "deployment complete", verify:

- [ ] Frontend env vars set in Render (VITE_API_URL, VITE_GEMINI_API_KEY)
- [ ] Backend env vars set in Render (PYTHON_BACKEND_URL, PYTHON_VALIDATOR_URL)
- [ ] Both services redeployed after env var changes
- [ ] Browser cache cleared
- [ ] Backend health check returns JSON (not 404)
- [ ] Network tab shows successful POST to `/api/analyze`
- [ ] Results display on frontend

---

## 🎯 Next Action

1. **Check backend health:** https://pharmaguard-backend-d36m.onrender.com/
2. **Share the response** (or if it's a 404/error)
3. I'll diagnose from there!
