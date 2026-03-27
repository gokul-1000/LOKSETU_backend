# PostgreSQL Setup for LokSetu Backend

## Option 1: Install PostgreSQL on Windows (Recommended)

### Step 1: Download PostgreSQL
1. Go to https://www.postgresql.org/download/windows/
2. Download **PostgreSQL 14 or 15** (latest stable)
3. Run the installer

### Step 2: During Installation
- **Username**: postgres
- **Password**: postgres (or something secure)
- **Port**: 5432 (default)
- **Locale**: [Default]
- ✅ Check "Stack Builder" at the end

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
psql -U postgres -c "SELECT version();"
```
If successful, you'll see PostgreSQL version info.

---

## Option 2: Use Docker (If you have Docker installed)

```powershell
docker run --name loksetu-postgres -e POSTGRES_PASSWORD=postgres -d -p 5432:5432 postgres:15
```

Verify:
```powershell
docker ps
```

---

## Option 3: Quick Test with SQLite (Development Only)

If you want to quick-test without PostgreSQL, I can modify the setup to use SQLite instead.

---

## Once PostgreSQL is Running

### Step 1: Create Database
```powershell
psql -U postgres -c "CREATE DATABASE loksetu_db;"
```

### Step 2: Create User
```powershell
psql -U postgres -c "CREATE USER loksetu_user WITH PASSWORD 'password123';"
psql -U postgres -c "ALTER ROLE loksetu_user CREATEDB;"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE loksetu_db TO loksetu_user;"
```

### Step 3: Verify Connection
```powershell
psql -U loksetu_user -d loksetu_db -h localhost
```
Type `\q` to exit.

### Step 4: Update .env File
Edit `backend/.env`:
```
DATABASE_URL="postgresql://loksetu_user:password123@localhost:5432/loksetu_db"
```

### Step 5: Run Migrations
```powershell
cd backend
npm run prisma:migrate
npm run seed
```

---

## Troubleshooting

### Port 5432 already in use?
```powershell
# Find process using port 5432
netstat -ano | findstr 5432

# Kill it (replace PID with actual number)
taskkill /PID <PID> /F
```

### `psql` command not found?
Add PostgreSQL to PATH:
1. Find PostgreSQL bin folder (usually `C:\Program Files\PostgreSQL\15\bin`)
2. Add to Windows PATH environment variable
3. Restart PowerShell

### Connection refused?
```powershell
# Check if PostgreSQL service is running
Get-Service postgresql-x64-15  # (adjust version)

# If not, start it
Start-Service postgresql-x64-15
```

---

## Quick Start After Setup

```powershell
cd c:\Users\DELL\Desktop\LOKSETU_BACKEND\backend

# Run migrations
npm run prisma:migrate

# Seed demo users
npm run seed

# Start backend
npm run dev
```

✅ **Demo credentials will be ready:**
- Citizen: +919876543210 / demo123
- Ward Officer: officer@demo.com / demo123
- Dept Head: dept@demo.com / demo123
- Leader/Admin: admin@demo.com / demo123

---

Need help? Let me know what step you're on!
