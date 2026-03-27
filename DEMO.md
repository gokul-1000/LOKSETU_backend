# 🚀 LokSetu Hackathon Quick Start

Complete guide to test and demo your system to judges in 5-10 minutes.

---

## 📋 Pre-Demo Checklist

Before the demo, verify:

- [ ] PostgreSQL is running
- [ ] Node.js 18+ installed
- [ ] Python 3.9+ installed
- [ ] All `npm install` completed
- [ ] `.env` files filled in both `backend/` and root
- [ ] You have the LLM backend path ready

---

## ⚡ Option 1: QuickStart Commands (Recommended)

Open **PowerShell as Administrator** and run:

### Terminal 1: LLM Backend
```powershell
cd "C:\Users\DELL\Downloads\Orchestra-LLM-Complaint_resolver-main\backend"
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### Terminal 2: Node Backend  
```powershell
cd "c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend"
npm run dev
```

### Terminal 3: React Frontend
```powershell
cd "c:\Users\DELL\Desktop\LOKSETU_BACKEND"
npm run dev
```

**Expected output in each terminal:**
- LLM: `Uvicorn running on http://127.0.0.1:8000`
- Backend: `🚀 LokSetu Backend running on http://localhost:5000`
- Frontend: `➜  Local:   http://localhost:5173/`

---

## 🖱️ Option 2: One-Click Startup

**Windows users:**
```bash
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND
start-all.bat
```

This will open 3 windows and start everything automatically!

---

## ✅ Step 1: Verify All Services Running (30 seconds)

### In PowerShell:

```powershell
# Test LLM Backend
curl http://localhost:8000/
# Should return: {"status": "ok", "service": "LangGraph Orchestrator"}

# Test Node Backend
curl http://localhost:5000/api/health
# Should return: {"status":"ok","service":"LokSetu Backend"}

# Test Frontend
curl http://localhost:5173/ -o $null
# Should return: HTTP/1.1 200 OK
```

**All three should respond successfully!** ✅

---

## 🎯 Step 2: Manual Testing in Browser

1. **Open:** `http://localhost:5173`

2. **Register:**
   - Click "Register"  
   - Email: `judge@demo.com`
   - Password: `demo123456`
   - Name: `Judge`
   - Click "Sign Up"

3. **File a Complaint:**
   - Click "File Complaint"
   - Choose "🤖 AI Assistant"
   - Describe issue: `"There's a broken streetlight on MG Road near Karol Bagh metro station that's been out for 2 weeks"`
   - AI should extract:
     - Title ✅
     - Category ✅
     - Department routing ✅
     - Priority scoring ✅
   - Click "Review & Submit"

4. **Verify in Database:**
   ```powershell
   psql -U loksetu_user -d loksetu_db -h localhost
   SELECT complaint_id, title, status, department FROM complaints;
   \q
   ```

---

## 🔧 Step 3: API Testing (Show Judges)

### Register User (cURL)

```powershell
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email = "test@demo.com"
    password = "test123456"
    name = "Test User"
    role = "CITIZEN"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Shows judges:** ✅ Authentication working

---

### Create Complaint via API

```powershell
# First, get token from login
$loginBody = @{
    email = "test@demo.com"
    password = "test123456"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body $loginBody

$token = ($loginResponse.Content | ConvertFrom-Json).token

# Now create complaint
$complaintBody = @{
    title = "Pothole on MG Road"
    description = "A large pothole has appeared near the metro station causing accidents"
    language = "English"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/complaints/ai" `
    -Method POST `
    -Headers @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $token"
    } `
    -Body $complaintBody
```

**Shows judges:** ✅ Backend API working ✅ LLM integration working

---

## 📊 Step 4: Show Analytics

### In Browser

Navigate to: `http://localhost:5173/leader/dashboard`

**Show judges:**
- Total complaints counter
- Zone-wise health scores
- Department performance
- Category breakdown

### Via API

```powershell
# Get stats
curl http://localhost:5000/api/analytics/stats

# Get zones
curl http://localhost:5000/api/analytics/zones

# Get departments
curl http://localhost:5000/api/analytics/departments
```

---

## 🎬 5-Minute Demo Script

**Perfect for judges:**

```
[0:00] "Good morning judges! I'm demonstrating LokSetu - 
       an AI-powered civic complaint management system."

[0:15] Show three running terminals:
       - Python LLM Backend (port 8000)
       - Node.js Backend (port 5000)
       - React Frontend (port 5173)

[0:30] "Let's register a user and file a complaint."
       Register in browser

[1:00] "Now let's file a complaint using AI assistance."
       Open "File Complaint" page
       Describe issue: "Broken streetlight on MG Road"

[1:30] "Notice how the AI automatically extracts:
       - Title
       - Category  
       - Department routing
       - Priority scoring
       
       This is using LangGraph with Gemini AI."

[2:00] Click "Review & Submit"
       Complaint appears in database

[2:30] Show in database:
       psql query showing the new complaint

[3:00] "Our system also has analytics dashboards."
       Show dashboard page
       Point out KPIs, zone metrics, department stats

[3:30] "For security, each user role has different permissions:
       - Citizens file complaints
       - Ward officers manage their area
       - Department heads process complaints
       - Leaders see city-wide analytics"

[4:00] "The backend is built with Express & Prisma,
       database is PostgreSQL, and frontend is React.
       Everything communicates via REST APIs."

[4:30] Show code quality:
       cat backend/README.md
       cat backend/src/routes/complaints.js

[5:00] "Questions?"
```

---

## 🚨 Troubleshooting (If Something Breaks)

### Port Already in Use
```powershell
# Kill process on specific port
npx kill-port 5000
npx kill-port 8000
npx kill-port 5173
```

### Database Issues  
```powershell
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend
npm run prisma:reset
npm run seed
npm run dev
```

### Module Not Found
```powershell
# Reinstall dependencies
npm install
npm run prisma:generate
```

### LLM Backend Not Responding
```powershell
# Check if Python backend is running
curl http://localhost:8000/

# Restart it:
cd Orchestra-LLM-Complaint_resolver-main\backend
uvicorn main:app --reload --port 8000
```

---

## 📝 What Judges Will Ask

### "How does the system work?"
**Answer:** "Frontend in React talks to Node.js backend via REST APIs. The backend integrates with a Python LLM service that uses LangGraph and Gemini AI to classify complaints and route them to departments. Data is stored in PostgreSQL."

### "Can it handle real data?"
**Answer:** "Yes, PostgreSQL can scale to millions of records. We have proper indexing on status, department, and zone fields. The API supports pagination."

### "Is this production-ready?"
**Answer:** "This is an MVP ready for production with minor enhancements:
- Already has JWT auth and role-based access
- Database queries are optimized with Prisma
- Error handling and validation implemented
- Could add WebSockets for real-time updates"

### "How does AI work?"
**Answer:** "The Python backend uses LangGraph orchestration with Gemini API. It extracts complaint details, classifies them by department, scores urgency 1-10, and analyzes sentiment."

### "What makes this special?"
**Answer:** "Multi-language support (Hindi, Punjabi, English), intelligent department routing, automated urgency scoring, and complete audit trails."

---

## ✨ Things Judges Will Notice

Positive:
- ✅ Clean UI with smooth animations
- ✅ Real authentication system
- ✅ AI actually works and extracts data
- ✅ Database populated with real data
- ✅ Multiple user roles and permissions
- ✅ Professional documentation
- ✅ Proper error handling
- ✅ Responsive design

Potential concerns (be ready to address):
- ❓ "Why REST API instead of GraphQL?" → Simpler, faster to build, perfect for this use case
- ❓ "No real-time updates?" → Can be added with WebSockets, REST is sufficient for MVP
- ❓ "File uploads?" → Endpoint ready, just need AWS S3 integration

---

## 📚 Files to Show Judges

If asked for documentation:

1. **Backend README:**
   ```
   backend/README.md
   ```

2. **API Docs:**
   ```
   backend/src/routes/complaints.js
   backend/src/routes/analytics.js
   ```

3. **Database Schema:**
   ```
   backend/prisma/schema.prisma
   ```

4. **Setup Guide:**
   ```
   SETUP.md
   ```

---

## 🎁 Final Checklist Before Demo

- [ ] All three services running
- [ ] Health checks passing
- [ ] Database seeded
- [ ] Can register/login
- [ ] Can file complaint
- [ ] AI extracts data correctly
- [ ] Data appears in database
- [ ] Dashboard shows metrics
- [ ] No console errors
- [ ] Demo script memorized

---

## 🏁 You're Ready!

You have:
- ✅ Working backend with APIs
- ✅ Real AI integration
- ✅ Professional frontend
- ✅ Complete documentation
- ✅ Clear demo script

**Go impress those judges! 🚀**

Good luck in the hackathon! 🎉
