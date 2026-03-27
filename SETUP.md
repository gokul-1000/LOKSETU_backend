# LokSetu — Complete Setup Guide

Complete end-to-end setup for the LokSetu civic complaint management system with AI-powered complaint resolution.

## System Architecture

```
┌─────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  React Frontend │       │  Node.js Backend │       │ Python LLM Svc   │
│  :5173          │◄─────►│  :5000           │◄─────►│ :8000            │
│  (Vite)         │       │  Express + Prisma│       │ FastAPI + LangGr │
└─────────────────┘       └──────────────────┘       └──────────────────┘
                                    ▲
                                    │
                          ┌─────────▼──────────┐
                          │  PostgreSQL        │
                          │  (localhost:5432)  │
                          └────────────────────┘
```

## Prerequisites

- **Node.js 18+** — For backend and frontend
- **Python 3.9+** — For LLM backend
- **PostgreSQL 14+** — Database
- **npm or yarn** — Package manager
- **Git** — Version control

## Step 1: Setup PostgreSQL

### macOS (Homebrew)
```bash
brew install postgresql
brew services start postgresql
createuser loksetu_user -P  # Enter password when prompted
createdb -U loksetu_user loksetu_db
```

### Windows (PostgreSQL Installer)
1. Download from https://www.postgresql.org/download/windows/
2. Run installer, remember password for `postgres` user
3. Open pgAdmin or psql:
```bash
psql -U postgres
CREATE USER loksetu_user WITH PASSWORD 'your_password';
CREATE DATABASE loksetu_db OWNER loksetu_user;
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get install postgresql postgresql-contrib
sudo -u postgres createuser loksetu_user -P
sudo -u postgres createdb -O loksetu_user loksetu_db
```

Verify connection:
```bash
psql -U loksetu_user -d loksetu_db -h localhost
```

---

## Step 2: Setup Python LLM Backend

Located at: `C:\Users\DELL\Downloads\Orchestra-LLM-Complaint_resolver-main\backend`

### 2.1 Create Virtual Environment

```bash
cd C:\Users\DELL\Downloads\Orchestra-LLM-Complaint_resolver-main\backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

If no requirements.txt:
```bash
pip install fastapi uvicorn pydantic python-dotenv langgraph google-generativeai
```

### 2.3 Configure Environment

Create `.env` in the backend folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Get API key: https://aistudio.google.com/app/apikeys

### 2.4 Run LLM Backend

```bash
uvicorn main:app --reload --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

✅ **LLM Backend is ready on http://localhost:8000**

Test endpoint:
```bash
curl http://localhost:8000/
# Response: {"status": "ok", "service": "LangGraph Orchestrator"}
```

---

## Step 3: Setup Node.js Backend

Located at: `c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend`

### 3.1 Install Dependencies

```bash
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend
npm install
```

### 3.2 Configure Environment

Create `.env`:

```env
# Database
DATABASE_URL="postgresql://loksetu_user:your_password@localhost:5432/loksetu_db"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your_super_secret_key_change_this"
JWT_EXPIRE="7d"

# LLM Backend
LLM_BACKEND_URL="http://localhost:8000"
GEMINI_API_KEY="your_gemini_key"

# CORS
FRONTEND_URL="http://localhost:5173"
```

### 3.3 Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create tables
npm run prisma:migrate
```

Follow prompts and enter a migration name like: `init`

### 3.4 Seed Database

```bash
npm run seed
```

**Expected output:**
```
🌱 Seeding database...
✓ Zones seeded
✓ Departments seeded
✓ Wards seeded
✅ Database seeded successfully!
```

### 3.5 Run Backend

```bash
npm run dev
```

**Expected output:**
```
🚀 LokSetu Backend running on http://localhost:5000
📊 LLM Backend: http://localhost:8000
🌐 CORS enabled for: http://localhost:5173
```

✅ **Backend is ready on http://localhost:5000**

Test endpoint:
```bash
curl http://localhost:5000/api/health
# Response: {"status":"ok","service":"LokSetu Backend"}
```

---

## Step 4: Setup React Frontend

Located at: `c:\Users\DELL\Desktop\LOKSETU_BACKEND`

### 4.1 Install Dependencies

```bash
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND
npm install
```

### 4.2 Configure Environment

Create `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4.3 Run Frontend

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.x.x  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ **Frontend is ready on http://localhost:5173**

---

## Step 5: Test the Full Stack

### Test 1: Health Checks

```bash
# Frontend
curl http://localhost:5173/

# Backend
curl http://localhost:5000/api/health

# LLM Backend
curl http://localhost:8000/
```

All three should respond with status 200.

### Test 2: Register & Login

Open http://localhost:5173 → Click "Register" → Create account

```json
{
  "email": "citizen@example.com",
  "password": "password123",
  "name": "Test Citizen",
  "role": "CITIZEN"
}
```

### Test 3: File a Complaint

1. Login with credentials
2. Go to "File Complaint" page
3. Use **AI Assistant** to describe an issue
4. System should call Python backend for orchestration
5. Review and submit

### Test 4: View Complaints

1. Go to "My Complaints"
2. Should see the submitted complaint with real data

---

## Running All Services

Use separate terminal windows/tabs:

**Terminal 1 — LLM Backend:**
```bash
cd C:\Users\DELL\Downloads\Orchestra-LLM-Complaint_resolver-main\backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload
```

**Terminal 2 — Node Backend:**
```bash
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend
npm run dev
```

**Terminal 3 — React Frontend:**
```bash
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND
npm run dev
```

**Terminal 4 — PostgreSQL** (if not running as service):
```bash
# Keep PostgreSQL running in background or service
```

---

## Database Management

### View Database

Using psql:
```bash
psql -U loksetu_user -d loksetu_db

# View tables
\dt

# View complaints
SELECT * FROM complaints;

# View users
SELECT id, email, name, role FROM users;
```

Using Prisma Studio:
```bash
npx prisma studio
```

Opens: http://localhost:5555

### Reset Database

⚠️ **Warning**: This deletes all data!

```bash
cd backend
npm run prisma:reset
```

### Check Migrations

```bash
npx prisma migrate status
```

---

## Troubleshooting

### Issue: PostgreSQL connection failed

**Solution:**
```bash
# Check if PostgreSQL is running
psql -U loksetu_user -d loksetu_db

# If fails, verify DATABASE_URL in .env
# Format: postgresql://user:password@host:port/database
```

### Issue: LLM Backend not responding

**Solution:**
```bash
# Check if Python backend is running
curl http://localhost:8000/

# If fails, restart:
cd Orchestra-LLM-Complaint_resolver-main/backend
uvicorn main:app --reload
```

### Issue: Frontend can't reach backend

**Solution:**
- Check `VITE_API_URL` in `.env`
- Ensure backend is running on port 5000
- Check CORS settings in `src/server.js`
- Try: `curl http://localhost:5000/api/health`

### Issue: JWT token expired

**Solution:**
- Clear browser cache and localStorage
- Login again to get a fresh token
- Check `JWT_EXPIRE` in backend `.env`

### Issue: Prisma migrations fail

**Solution:**
```bash
# Reset and restart
npm run prisma:reset
npm run prisma:migrate
npm run seed
```

---

## API Routes Reference

### Authentication
| Route | Method | Body |
|-------|--------|------|
| `/api/auth/register` | POST | `{email, password, name, role}` |
| `/api/auth/login` | POST | `{email, password}` |
| `/api/auth/me` | GET | Headers: `Authorization: Bearer <token>` |

### Complaints
| Route | Method | Body |
|-------|--------|------|
| `/api/complaints/ai` | POST | `{title, description, language}` |
| `/api/complaints/manual` | POST | `{title, description, category, location}` |
| `/api/complaints` | GET | Query: `?status=OPEN&page=1&limit=20` |
| `/api/complaints/:id` | GET | — |
| `/api/complaints/:id/status` | PATCH | `{status}` |
| `/api/complaints/:id/updates` | POST | `{message}` |

### Analytics
| Route | Method |
|-------|--------|
| `/api/analytics/stats` | GET |
| `/api/analytics/zones` | GET |
| `/api/analytics/departments` | GET |
| `/api/analytics/categories` | GET |

### LLM Proxy
| Route | Method | Body |
|-------|--------|------|
| `/api/llm/health` | GET | — |
| `/api/llm/chat` | POST | `{messages, language}` |
| `/api/llm/orchestrate` | POST | `{title, description}` |

---

## Next Steps

1. ✅ Backend API created
2. ✅ Database integrated
3. ✅ LLM backend integrated
4. ⏳ Add user authentication UI
5. ⏳ Create leader/department dashboards
6. ⏳ Add complaint tracking features
7. ⏳ Deploy to production

---

## Useful Commands

```bash
# Backend
npm run dev              # Development with autoreload
npm start                # Production
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run seed             # Seed initial data

# Frontend
npm run dev              # Development server
npm run build           # Production build
npm run preview         # Preview build

# Project Structure
tree -L 2               # Show directory tree
ls -la                  # List files (Linux/Mac)
dir /s                  # List files (Windows)
```

---

## Deployment Notes

For production deployment:

1. **Environment Variables** — Use proper secrets manager
2. **Database** — Set up managed PostgreSQL (AWS RDS, Heroku, etc.)
3. **Backend** — Deploy to Vercel, Heroku, Railway, or AWS
4. **Frontend** — Deploy to Vercel, Netlify, or AWS S3 + CloudFront
5. **LLM Backend** — Keep on dedicated server or use managed service

---

## Support

For issues:
1. Check logs in terminal where service is running
2. Verify `.env` configuration
3. Check database connection: `psql -U loksetu_user -d loksetu_db`
4. Test API manually: `curl http://localhost:5000/api/health`

---

**Happy coding! 🚀**
