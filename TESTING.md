# LokSetu — Hackathon Testing & Demo Guide

Complete checklist for testing and demonstrating the system to judges.

---

## ⚡ Quick Start (5-10 minutes)

### Terminal 1: LLM Backend ✅
```bash
cd C:\Users\DELL\Downloads\Orchestra-LLM-Complaint_resolver-main\backend
venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### Terminal 2: Node Backend ✅
```bash
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend
npm run dev
```

**Expected output:**
```
🚀 LokSetu Backend running on http://localhost:5000
📊 LLM Backend: http://localhost:8000
🌐 CORS enabled for: http://localhost:5173
```

### Terminal 3: React Frontend ✅
```bash
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND
npm run dev
```

**Expected output:**
```
➜  Local:   http://localhost:5173/
```

---

## ✅ Health Check Tests (30 seconds)

Run these in a separate terminal to verify all services are running:

### Test 1: LLM Backend Health
```bash
curl http://localhost:8000/
```
**Expected:**
```json
{"status": "ok", "service": "LangGraph Orchestrator"}
```

### Test 2: Node Backend Health
```bash
curl http://localhost:5000/api/health
```
**Expected:**
```json
{"status":"ok","service":"LokSetu Backend"}
```

### Test 3: Frontend Loading
```bash
curl -I http://localhost:5173/
```
**Expected:**
```
HTTP/1.1 200 OK
```

---

## 🧪 API Testing (Using Postman or cURL)

### Step 1: Register a User

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@test.com",
    "password": "password123",
    "name": "Test Citizen",
    "role": "CITIZEN"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "citizen@test.com",
    "name": "Test Citizen",
    "role": "CITIZEN"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token!** You'll need it for the next requests.

---

### Step 2: Login

**Request:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@test.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Step 3: Create Complaint (With AI)

**Request:**
```bash
curl -X POST http://localhost:5000/api/complaints/ai \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Pothole on MG Road",
    "description": "A large pothole has appeared on MG Road near Karol Bagh Metro station causing accidents. It needs urgent repair.",
    "language": "English"
  }'
```

**Replace** `YOUR_TOKEN_HERE` with the token from Step 1/2.

**Expected Response:**
```json
{
  "id": "...",
  "complaintId": "GRV-2026-001",
  "title": "Pothole on MG Road",
  "description": "A large pothole...",
  "category": "Roads",
  "status": "OPEN",
  "priority": "HIGH",
  "urgency": 8,
  "department": "PWD — Engineering Wing",
  "aiSummary": "..."
}
```

---

### Step 4: Get All Complaints

**Request:**
```bash
curl http://localhost:5000/api/complaints
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": "...",
      "complaintId": "GRV-2026-001",
      "title": "Pothole on MG Road",
      "status": "OPEN",
      "priority": "HIGH",
      "citizen": { "name": "Test Citizen", "email": "citizen@test.com" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "pages": 1
  }
}
```

---

### Step 5: Get Analytics

**Request:**
```bash
curl http://localhost:5000/api/analytics/stats
```

**Expected Response:**
```json
{
  "totalComplaints": 1,
  "resolvedThisMonth": 0,
  "pendingEscalations": 0,
  "openComplaints": 1,
  "criticalComplaints": 0,
  "avgResolutionDays": 4.6
}
```

---

### Step 6: Get Zones Analytics

**Request:**
```bash
curl http://localhost:5000/api/analytics/zones
```

**Expected Response:**
```json
[
  {
    "id": "...",
    "name": "Central",
    "healthScore": 75,
    "totalComplaints": 1,
    "resolved": 0,
    "pending": 0,
    "escalated": 0,
    "critical": 0
  },
  ...
]
```

---

## 🎯 Frontend Testing (Manual)

### Test Flow for Judges:

1. **Open Frontend:**
   ```
   http://localhost:5173/
   ```

2. **Register New User:**
   - Click "Register"
   - Fill form:
     - Email: `judge@demo.com`
     - Password: `password123`
     - Name: `Judge Demo`
   - Click "Sign Up"
   - Should see dashboard

3. **File Complaint (AI-Assisted):**
   - Click "File Complaint"
   - Select "AI Assistant" tab
   - Type: `"There's a broken streetlight on MG Road near the market that hasn't been fixed for 3 weeks"`
   - Watch AI extract details
   - Click "Review & Submit"
   - Complaint should be created

4. **View Complaint:**
   - Navigate to "My Complaints"
   - Should see complaint with:
     - Status: OPEN
     - Priority: HIGH/MEDIUM
     - Department: PWD or similar
     - AI-generated summary

5. **Check Dashboard:**
   - Navigate to Dashboard
   - Should see:
     - KPI statistics
     - Zone-wise metrics
     - Complaint distribution

---

## 🔍 Database Verification

### Check Database Contents:

```bash
# Connect to database
psql -U loksetu_user -d loksetu_db -h localhost

# View all tables
\dt

# Check complaints
SELECT id, complaint_id, title, status, department FROM complaints;

# Check users
SELECT id, email, name, role FROM users;

# View zones
SELECT name, health_score FROM zones;

# Exit
\q
```

### Or use Prisma Studio:

```bash
cd backend
npx prisma studio
```

Opens interactive database viewer at http://localhost:5555

---

## 📊 Common Judge Questions & Answers

### Q1: "Does the backend actually work?"
✅ **Answer:**
- Show health check responses
- Demo API requests with cURL
- Show database contents with psql

### Q2: "How does AI integration work?"
✅ **Answer:**
- Show Python backend running on port 8000
- Explain `/api/complaints/ai` endpoint
- Demo: Create complaint → See AI classification → View in database

### Q3: "Does it handle multiple users?"
✅ **Answer:**
- Register second user
- Each user sees only their complaints
- Show Database queries

### Q4: "What about spam/security?"
✅ **Answer:**
- JWT authentication protects endpoints
- Role-based access control (CITIZEN, OFFICER, HEAD, LEADER)
- Password hashing with bcrypt

### Q5: "Can you scale this?"
✅ **Answer:**
- PostgreSQL supports millions of records
- Indexed queries on status, department, ward, zone
- Prisma ORM optimized queries
- Stateless backend (can run multiple instances)

### Q6: "What about real-time updates?"
✅ **Answer:**
- Current: REST API with polling
- Could add: WebSockets for real-time notifications
- Activity log tracks all changes

---

## 🚨 Troubleshooting Common Issues

### Issue 1: Backend won't start

**Error:**
```
EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Kill process on port 5000
npx kill-port 5000

# Or start on different port
PORT=5001 npm run dev
```

### Issue 2: Database connection failed

**Error:**
```
can't reach database server
```

**Solution:**
```bash
# Check PostgreSQL is running
psql -U loksetu_user -d loksetu_db

# If fails, reset database
npm run prisma:reset
npm run seed
```

### Issue 3: LLM Backend not responding

**Error:**
```
Failed to connect to LLM backend
```

**Solution:**
```bash
# Verify Python backend is running
curl http://localhost:8000/

# Restart if needed
uvicorn main:app --reload --port 8000
```

### Issue 4: CORS errors in browser

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
- Ensure `FRONTEND_URL` in backend `.env` = `http://localhost:5173`
- Restart backend: `npm run dev`

### Issue 5: Token invalid

**Error:**
```
401 Unauthorized: Invalid or expired token
```

**Solution:**
- Login again to get fresh token
- Check `JWT_SECRET` in `.env`

---

## ✨ Demo Script (5-minute Hackathon Demo)

1. **(0:00-0:30)** Show three terminals running:
   - LLM Backend ✅
   - Node Backend ✅
   - React Frontend ✅

2. **(0:30-1:00)** Run health checks:
   ```bash
   curl http://localhost:8000/
   curl http://localhost:5000/api/health
   ```

3. **(1:00-2:00)** Register & login in browser:
   - Open http://localhost:5173
   - Show registration form
   - Login successfully

4. **(2:00-4:00)** File complaint with AI:
   - Click "File Complaint"
   - Describe issue in natural language
   - Show AI extracting:
     - Title ✅
     - Category ✅
     - Department ✅
     - Priority ✅
   - Submit complaint

5. **(4:00-4:30)** Show database:
   ```bash
   # Show complaint in database
   psql -U loksetu_user -d loksetu_db
   SELECT complaint_id, title, status, department FROM complaints;
   ```

6. **(4:30-5:00)** Show analytics:
   - Navigate to Dashboard
   - Show KPI statistics
   - Show zone-wise breakdown

**Total: 5 minutes perfectly packaged to impress judges!**

---

## 📝 Checklist for Judges

- [ ] All three services running (LLM, Backend, Frontend)
- [ ] Health checks passing
- [ ] Can register/login
- [ ] Can create complaint with AI assistance
- [ ] AI correctly classifies complaint
- [ ] Database stores data correctly
- [ ] Can view complaints
- [ ] Analytics dashboard shows real data
- [ ] CORS/Security working
- [ ] No console errors

---

## 🎁 Bonus Points

Show judges:

1. **Database schema** — Well-structured Prisma schema
2. **Error handling** — Try invalid login, show proper error message
3. **Real-time data** — Create complaint, refresh page, see it updated
4. **Role-based access** — Show different permissions for CITIZEN vs OFFICER
5. **Code quality** — Show clean, documented code in editor

---

## Files to Share with Judges

1. **Backend README:**
   ```bash
   cat backend/README.md
   ```

2. **API Documentation:**
   ```bash
   cat backend/src/routes/complaints.js
   ```

3. **Database Schema:**
   ```bash
   cat backend/prisma/schema.prisma
   ```

4. **Setup Guide:**
   ```bash
   cat SETUP.md
   ```

---

**You're all set! Good luck in the hackathon! 🚀**
