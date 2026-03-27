# LokSetu Backend - API Reference

Complete API documentation for the Node.js/Express backend.

**Base URL:** `http://localhost:5000`

---

## Authentication

All endpoints (except `/auth/register` and `/auth/login`) require:
```
Header: Authorization: Bearer <jwt_token>
```

Get token by calling `/auth/login` with credentials.

---

## 📝 Auth Endpoints (`/api/auth`)

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "citizen@loksetu.com",
  "password": "secure123",
  "name": "John Citizen",
  "phone": "+919876543210",
  "role": "CITIZEN",
  "ward": "Ward 1",
  "zone": "New Delhi"
}

Response (201):
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "email": "citizen@loksetu.com",
    "role": "CITIZEN"
  }
}
```

**Roles:** `CITIZEN`, `WARD_OFFICER`, `DEPARTMENT_HEAD`, `LEADER`, `ADMIN`

---

### Login User
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "citizen@loksetu.com",
  "password": "secure123"
}

Response (200):
{
  "success": true,
  "token": "eyJhbGc...",
  "user": {
    "id": "clx...",
    "email": "citizen@loksetu.com",
    "role": "CITIZEN",
    "name": "John Citizen"
  }
}
```

---

### Get Current User
```
GET /api/auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "citizen@loksetu.com",
    "name": "John Citizen",
    "role": "CITIZEN",
    "phone": "+919876543210",
    "ward": "Ward 1",
    "zone": "New Delhi"
  }
}
```

---

## 🚨 Complaints Endpoints (`/api/complaints`)

### Create with AI Analysis
```
POST /api/complaints/ai
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Broken streetlight on MG Road",
  "description": "Near Connaught Place, the streetlight has been broken for 3 days...",
  "category": "INFRASTRUCTURE",
  "location": "MG Road, Connaught Place",
  "incidentDate": "2024-01-15",
  "latitude": 28.6328,
  "longitude": 77.2197,
  "channel": "MOBILE_APP",
  "language": "ENGLISH"
}

Response (201):
{
  "success": true,
  "complaint": {
    "id": "GRV-2024-001",
    "title": "Broken streetlight on MG Road",
    "status": "OPEN",
    "priority": "MEDIUM",
    "urgency": 7,
    "department": "MCD",
    "aiSummary": "Street lighting outage in Central Delhi...",
    "sentiment": "COMPLAINT",
    "sentimentScore": 0.85,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Categories:** `WATER`, `ELECTRICITY`, `ROADS`, `GARBAGE`, `POTHOLES`, `STREET_LIGHT`, `CORRUPTION`, `INFRASTRUCTURE`, `OTHER`

---

### Create Manual (No AI)
```
POST /api/complaints/manual
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Complaint Title",
  "description": "Description of issue",
  "category": "WATER",
  "location": "Location name",
  "latitude": 28.6328,
  "longitude": 77.2197
}

Response (201):
{
  "success": true,
  "complaint": { /* complaint object */ }
}
```

---

### Get All Complaints
```
GET /api/complaints?page=1&limit=10&status=OPEN&priority=HIGH&department=MCD&zone=NewDelhi

Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [
    {
      "id": "GRV-2024-001",
      "title": "...",
      "status": "OPEN",
      "priority": "HIGH",
      "department": "MCD",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - OPEN | ASSIGNED | IN_PROGRESS | RESOLVED | CLOSED
- `priority` - LOW | MEDIUM | HIGH | URGENT
- `department` - Department code or name filter
- `zone` - Zone filter
- `ward` - Ward filter

---

### Get Single Complaint
```
GET /api/complaints/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "complaint": {
    "id": "GRV-2024-001",
    "title": "Broken streetlight",
    "status": "OPEN",
    "updates": [
      {
        "id": "upd_...",
        "type": "COMMENT",
        "message": "Complaint received and forwarded to MCD",
        "createdBy": "system",
        "createdAt": "2024-01-15T10:31:00Z"
      }
    ]
  }
}
```

---

### Update Complaint Status
```
PATCH /api/complaints/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "IN_PROGRESS",
  "message": "Work started on ground"
}

Response (200):
{
  "success": true,
  "message": "Status updated successfully",
  "complaint": { /* updated complaint */ }
}
```

**Valid Statuses:** `OPEN`, `ASSIGNED`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

---

### Add Comment/Update
```
POST /api/complaints/:id/updates
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Inspection completed. Parts ordered.",
  "type": "COMMENT"
}

Response (201):
{
  "success": true,
  "update": {
    "id": "upd_...",
    "type": "COMMENT",
    "message": "Inspection completed...",
    "createdAt": "2024-01-15T14:30:00Z"
  }
}
```

---

### Assign Complaint
```
PATCH /api/complaints/:id/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "assignedTo": "officer@loksetu.com"
}

Response (200):
{
  "success": true,
  "complaint": { /* updated complaint */ }
}
```

---

## 🏢 Departments (`/api/departments`)

### Get All Departments
```
GET /api/departments
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "departments": [
    {
      "id": "dept_1",
      "name": "Municipal Corporation of Delhi",
      "code": "MCD",
      "categories": ["WATER", "ROADS", "GARBAGE"],
      "sla": 72,  // hours
      "contactEmail": "mcd@delhi.gov.in"
    },
    {
      "id": "dept_2",
      "name": "Jal Board",
      "code": "DJB",
      "categories": ["WATER"],
      "sla": 48
    }
  ]
}
```

---

### Get Department Details
```
GET /api/departments/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "department": { /* full department object */ }
}
```

---

### Get Department Complaints
```
GET /api/departments/:id/complaints
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* complaints assigned to this department */ ]
}
```

---

## 🗺️ Zones & Wards (`/api/zones`)

### Get All Zones
```
GET /api/zones
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "zones": [
    {
      "id": "zone_1",
      "name": "New Delhi",
      "code": "ND",
      "healthScore": 87,
      "wards": ["Ward 1", "Ward 2"]
    }
  ]
}
```

---

### Get Zone Details
```
GET /api/zones/:id
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "zone": {
    "id": "zone_1",
    "name": "New Delhi",
    "healthScore": 87,
    "wards": [ /* ward details */ ]
  }
}
```

---

### Get Wards by Zone
```
GET /api/zones/:zoneId/wards
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "wards": [
    {
      "id": "ward_1",
      "name": "Ward 1",
      "code": "W1",
      "zone": "New Delhi",
      "population": 95000
    }
  ]
}
```

---

## 📊 Analytics (`/api/analytics`)

### Get Overall Stats
```
GET /api/analytics/stats
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "stats": {
    "total": 1250,
    "resolved": 980,
    "pending": 270,
    "resolutionRate": 78.4,
    "avgResolutionTime": 3.2  // days
  }
}
```

---

### Get Zone Metrics
```
GET /api/analytics/zones
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "zones": [
    {
      "name": "New Delhi",
      "totalComplaints": 245,
      "resolved": 215,
      "pending": 30,
      "resolutionRate": 87.8,
      "healthScore": 87
    }
  ]
}
```

---

### Get Department Metrics
```
GET /api/analytics/departments
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "departments": [
    {
      "name": "MCD",
      "totalComplaints": 450,
      "resolved": 380,
      "pending": 70,
      "avgResolutionTime": 2.8,
      "performanceScore": 84
    }
  ]
}
```

---

### Get Category Breakdown
```
GET /api/analytics/categories
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "categories": [
    {
      "category": "WATER",
      "count": 320,
      "percentage": 25.6,
      "avgResolutionTime": 2.5
    }
  ]
}
```

---

### Get Time Series Data
```
GET /api/analytics/timeseries?days=30
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "timeseries": [
    {
      "date": "2024-01-15",
      "total": 45,
      "resolved": 38,
      "pending": 7
    }
  ]
}
```

---

## 🤖 LLM Integration (`/api/llm`)

### Health Check
```
GET /api/llm/health
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "llmStatus": "connected",
  "endpoint": "http://localhost:8000"
}
```

---

### Chat with LLM
```
POST /api/llm/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "What's a civic complaint?"
    }
  ],
  "language": "ENGLISH"
}

Response (200):
{
  "success": true,
  "response": {
    "role": "assistant",
    "content": "A civic complaint is a formal report..."
  }
}
```

---

### Orchestrate Complaint Analysis
```
POST /api/llm/orchestrate
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Broken streetlight on MG Road",
  "description": "The light has been out for 3 days...",
  "language": "ENGLISH"
}

Response (200):
{
  "success": true,
  "analysis": {
    "extractedTitle": "Broken streetlight on MG Road",
    "category": "STREET_LIGHT",
    "priority": "MEDIUM",
    "urgency": 7,
    "department": "MCD",
    "sentiment": "COMPLAINT",
    "sentimentScore": 0.85,
    "summary": "Street lighting outage..."
  }
}
```

---

## ❌ Error Responses

### Authentication Error
```
Status: 401
{
  "success": false,
  "message": "Unauthorized: No token provided"
}
```

### Validation Error
```
Status: 422
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Server Error
```
Status: 500
{
  "success": false,
  "message": "Internal server error",
  "error": "Error details in development mode"
}
```

---

## 🔑 Test Credentials

Pre-seeded users for testing:

```
Email: citizen@loksetu.com
Password: demo123
Role: CITIZEN

Email: officer@loksetu.com
Password: demo123
Role: WARD_OFFICER

Email: leader@loksetu.com
Password: demo123
Role: LEADER
```

---

## 📱 Using with Frontend

The frontend API client (`src/api/client.js`) provides these methods:

```javascript
// Auth
await authAPI.register(userData)
await authAPI.login(email, password)
await authAPI.getMe()

// Complaints
await complaintsAPI.getAll(filters)
await complaintsAPI.getOne(id)
await complaintsAPI.createWithAI(data)
await complaintsAPI.createManual(data)
await complaintsAPI.updateStatus(id, status, message)
await complaintsAPI.addUpdate(id, message)
await complaintsAPI.assign(id, email)

// Departments
await departmentsAPI.getAll()
await departmentsAPI.getOne(id)

// Zones
await zonesAPI.getAll()
await zonesAPI.getOne(id)

// Analytics
await analyticsAPI.getStats()
await analyticsAPI.getZones()
await analyticsAPI.getDepartments()
await analyticsAPI.getCategories()

// LLM
await llmAPI.chat(messages, language)
await llmAPI.orchestrate(title, description, language)
```

---

## 🧪 Testing with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"citizen@loksetu.com","password":"demo123"}'

# Get token from response, then:

# Get all complaints
curl -X GET http://localhost:5000/api/complaints \
  -H "Authorization: Bearer <TOKEN>"

# Create complaint with AI
curl -X POST http://localhost:5000/api/complaints/ai \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Broken streetlight",
    "description": "...",
    "category": "STREET_LIGHT",
    "location": "MG Road"
  }'
```

---

**Need more details?** Check `backend/README.md` or ask!
