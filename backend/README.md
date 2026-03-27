# LokSetu Backend

Complete Node.js/Express backend for the LokSetu civic complaint management system with Prisma ORM and PostgreSQL integration.

## Features

- 🔐 **JWT Authentication** — User registration, login, and token management
- 🚀 **Complaint API** — Create, read, update, and manage complaints with AI assistance
- 🤖 **LLM Integration** — Proxy layer to call your friend's Python FastAPI LLM backend
- 📊 **Analytics & Reporting** — Zone-wise, department-wise, and category-wise metrics
- 🏢 **Department Management** — Department routing, SLA tracking
- 🗺️ **Zone & Ward Management** — Geographic hierarchy with health scores
- 📝 **Activity Logging** — Track all complaint updates and user actions

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **HTTP Client**: axios (for LLM backend calls)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/loksetu_db"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET="your_secret_key_here"
JWT_EXPIRE="7d"

# LLM Backend (Your friend's Python FastAPI)
LLM_BACKEND_URL="http://localhost:8000"
GEMINI_API_KEY="your_gemini_key"

# CORS
FRONTEND_URL="http://localhost:5173"
```

### 3. Setup PostgreSQL Database

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed initial data
npm run seed
```

### 4. Start the Backend

**Development mode** (with auto-reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET | `/api/auth/me` | Get current user info |

### Complaints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/complaints/ai` | Create complaint with AI assistance |
| POST | `/api/complaints/manual` | Create complaint manually |
| GET | `/api/complaints` | Get all complaints with filters |
| GET | `/api/complaints/:id` | Get single complaint |
| PATCH | `/api/complaints/:id/status` | Update complaint status |
| POST | `/api/complaints/:id/updates` | Add comment to complaint |
| POST | `/api/complaints/:id/assign` | Assign to officer |

### Departments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | Get all departments |
| GET | `/api/departments/:id` | Get department details |
| GET | `/api/departments/:id/complaints` | Get dept's complaints |

### Zones & Wards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/zones` | Get all zones |
| GET | `/api/zones/:id` | Get zone details |
| GET | `/api/zones/:zoneId/wards` | Get wards in zone |

### Analytics

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/stats` | Overall statistics |
| GET | `/api/analytics/zones` | Zone-wise metrics |
| GET | `/api/analytics/departments` | Department metrics |
| GET | `/api/analytics/categories` | Category breakdown |
| GET | `/api/analytics/timeseries` | Time-series data for charts |

### LLM Backend Proxy

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/llm/health` | Check LLM backend status |
| POST | `/api/llm/chat` | Chat with AI (multi-turn) |
| POST | `/api/llm/orchestrate` | Orchestrate complaint through LLM |

## Database Schema

### Core Models

- **User** — Citizens, officers, department heads, leaders with roles
- **Complaint** — Main complaint entity with AI classification
- **Update** — Status changes, comments, assignments
- **Department** — City departments with category mapping
- **Zone** — Geographic zones in Delhi
- **Ward** — Individual wards within zones
- **Activity** — Audit log of all user actions

## Authentication Flow

1. User registers with email/password
2. Backend hashes password with bcrypt
3. On login, JWT token is issued
4. Token sent in `Authorization: Bearer <token>` header for protected routes
5. Middleware verifies token and extracts user info

## LLM Backend Integration

The backend proxies requests to the Python FastAPI backend:

```javascript
// Frontend sends to Node backend
POST /api/complaints/ai
{
  "title": "Pothole on MG Road",
  "description": "Large pothole causing accidents",
  "language": "English"
}

// Backend forwards to Python
POST http://localhost:8000/orchestrate
{
  "id": "user-id",
  "title": "...",
  "description": "..."
}

// LLM response enriches complaint data before saving
```

## Project Structure

```
backend/
├── src/
│   ├── server.js              # Express app setup
│   ├── routes/
│   │   ├── auth.js            # Auth endpoints
│   │   ├── complaints.js       # Complaint CRUD
│   │   ├── departments.js      # Department management
│   │   ├── zones.js            # Zone & ward management
│   │   ├── analytics.js        # Analytics endpoints
│   │   └── llm.js              # LLM proxy endpoints
│   ├── services/
│   │   ├── complaintService.js # Business logic
│   │   └── llmService.js       # LLM backend calls
│   ├── middleware/
│   │   └── auth.js             # JWT verification
│   └── utils/
│       └── db.js               # Database utilities
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── seed.js                 # Seed data
├── .env.example                # Environment template
└── package.json                # Dependencies

```

## Running Multiple Services

To run the complete stack:

**Terminal 1** — Python LLM Backend:
```bash
cd ../path/to/Orchestra-LLM-Complaint_resolver-main/backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
# Runs on http://localhost:8000
```

**Terminal 2** — Node Backend:
```bash
npm run dev
# Runs on http://localhost:5000
```

**Terminal 3** — React Frontend:
```bash
cd ../frontend
npm run dev
# Runs on http://localhost:5173
```

## Troubleshooting

### Database connection fails

- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- Run `npm run prisma:generate` then `npm run prisma:migrate`

### LLM backend not responding

- Check if Python backend is running on port 8000
- Verify `LLM_BACKEND_URL` in `.env`
- Test: `GET /api/llm/health`

### JWT token invalid

- Ensure `JWT_SECRET` matches between requests
- Check token expiration with `JWT_EXPIRE`
- Try re-logging in for a fresh token

## Next Steps

1. ✅ Create Node.js backend
2. ✅ Set up database schema
3. ✅ Build API endpoints
4. ⏳ Update frontend to use real APIs (in progress)
5. ⏳ Add analytics dashboards
6. ⏳ Deploy to production

## License

ISC
