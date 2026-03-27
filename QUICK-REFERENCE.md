# 🚀 LokSetu - Quick Reference Card

**Keep this open during the demo!**

---

## ⚡ Startup (3 Terminals)

### Terminal 1: LLM
```
cd C:\Users\DELL\Downloads\Orchestra-LLM-Complaint_resolver-main\backend
.\venv\Scripts\activate
uvicorn main:app --reload --port 8000
```
→ Should see: `Uvicorn running on http://127.0.0.1:8000`

### Terminal 2: Backend
```
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend
npm run dev
```
→ Should see: `🚀 LokSetu Backend running on http://localhost:5000`

### Terminal 3: Frontend
```
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND
npm run dev
```
→ Should see: `➜  Local:   http://localhost:5173/`

---

## ✅ Quick Health Check

```powershell
curl http://localhost:8000/
curl http://localhost:5000/api/health
curl http://localhost:5173/ -o $null
```

**All should return 200 OK ✅**

---

## 🎯 Demo Flow (5 minutes)

1. **Show 3 running terminals** (0:30)
2. **Register user** in browser (1:00)
3. **File complaint with AI** (2:00)
4. **Show in database** `psql -U loksetu_user -d loksetu_db` (2:30)
5. **Show dashboard** (3:30)
6. **Q&A** (5:00)

---

## 🔑 Key URLs

| Service | URL | Status Check |
|---------|-----|--------------|
| Frontend | http://localhost:5173 | Open in browser |
| Backend | http://localhost:5000/api/health | GET request |
| LLM | http://localhost:8000/ | GET request |

---

## 📊 Common Judge Questions

| Q | A |
|---|---|
| "Does backend work?" | Show health checks via curl |
| "How does AI work?" | Show Python backend at :8000, explain LangGraph |
| "Show me the database" | Run `psql` query: `SELECT * FROM complaints;` |
| "Multiple users?" | Register 2nd user, show they see different complaints |
| "Is this secure?" | Show JWT auth, role-based access, password hashing |
| "Can it scale?" | "PostgreSQL with Prisma ORM, indexed queries, stateless API" |

---

## ⚠️ If Something Breaks

```powershell
# Port busy?
npx kill-port 5000 && npm run dev

# Database issues?
npm run prisma:reset && npm run seed && npm run dev

# Module not found?
npm install && npm run dev

# LLM not responding?
# Check if it's running on :8000, restart if needed
```

---

## 📸 Demo Talking Points

✅ "This is a civic complaint management system with AI"
✅ "Python backend uses LangGraph + Gemini for NLP"
✅ "Node backend manages data in PostgreSQL"
✅ "React frontend provides beautiful UI"
✅ "Complete JWT authentication with role-based access"
✅ "Automatic department routing based on complaint type"
✅ "Real-time analytics dashboard"
✅ "Supports Hindi, Punjabi, English"

---

## 🎬 Script (Memorize This!)

**Opening:**
"Hi judges! I'm showing you LokSetu - an AI-powered civic complaint system for Delhi. It has three components:
1. Python LLM backend using LangGraph and Gemini
2. Node.js REST API backend with PostgreSQL
3. React frontend with beautiful UI"

**Demo:**
"Let me file a complaint. I'll describe an issue [speaks complaint]. 

Notice how:
- Title extracted ✅
- Category identified ✅
- Best department suggested ✅
- Priority scored ✅
- Sentiment analyzed ✅

This happens because the Node backend calls our Python LLM service, which returns enriched data."

**Database:**
"All complaints are stored in PostgreSQL. You can see here:
[show psql query result]
Complete audit trail, proper relationships, indexed for performance."

**Dashboard:**
"We also have a leadership dashboard showing:
- Total complaints and resolution rate
- Zone-wise health scores
- Department performance metrics
- Complaint trends over time"

**Conclusion:**
"This is an MVP ready for production. With 500M+ people in India expecting better civic services, this helps make government more responsive and data-driven."

---

## 🎁 Safety Net

If anything crashes mid-demo:

1. "We have everything running locally with PostgreSQL"
2. "Let me quickly restart the backend" 
3. `npm run dev`
4. "The database is persistent, data is still there"
5. Continue demo

**Judges appreciate transparency!** Don't hide technical issues, explain them.

---

## 💡 Pro Tips

- Test everything 30 mins before demo
- Have all 3 terminals ready and minimized
- Open browser with localhost:5173 in tab
- Have test credentials ready (judge@demo.com / demo123)
- Know your database query by heart
- Be ready to explain any code shown
- Practice the 5-min script until smooth

---

**Good luck! You got this! 🚀**
