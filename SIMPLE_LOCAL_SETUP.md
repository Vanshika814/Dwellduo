# 🚀 Simple Local Setup (No Docker)

**Easy setup for running DwellDuo on your local machine**

---

## 📋 What You Need

1. ✅ **Java 17** (you probably have this)
2. ✅ **Node.js 18+** (you probably have this)
3. ✅ **MySQL** (your existing MySQL installation)
4. ✅ **Redis** (optional - will install if needed)

---

## Part 1: Install Missing Software (If Needed)

### Check What You Have

```bash
# Check Java
java -version
# Should show: version "17" or higher

# Check Node
node --version
# Should show: v18.x.x or higher

# Check MySQL
mysql --version
# Should show MySQL version

# Check Redis (optional)
redis-cli --version
# If not installed, we'll install it below
```

---

### Install Redis (If Not Installed)

**macOS:**
```bash
brew install redis
brew services start redis
```

**Ubuntu/Linux:**
```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis
sudo systemctl enable redis
```

**Windows:**
Download from: https://github.com/microsoftarchive/redis/releases

**Test Redis:**
```bash
redis-cli ping
# Should return: PONG
```

---

## Part 2: Configure Database

### Step 1: Create MySQL Database

```bash
# Connect to MySQL
mysql -u root -p
# Enter your MySQL password
```

```sql
-- Create database
CREATE DATABASE IF NOT EXISTS dwellduo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify it was created
SHOW DATABASES;

-- You should see 'dwellduo' in the list
exit;
```

---

## Part 3: Configure Backend

### Step 1: Create Backend .env File

```bash
cd backend-java
```

Create `.env` file with this content:

```env
# MySQL Configuration (Local)
DATABASE_URL=jdbc:mysql://localhost:3306/dwellduo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_mysql_password_here

# Redis Configuration (Local)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Secret (Generate your own - see below)
JWT_SECRET=your-generated-secret-key-here

# Cloudinary (Get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=DEBUG
SHOW_SQL=false
```

### Step 2: Update Your MySQL Password

In the `.env` file, replace `your_mysql_password_here` with your actual MySQL root password.

**Don't know your MySQL password?**
```bash
# Try connecting without password
mysql -u root

# If that works, your password is empty, so in .env use:
DATABASE_PASSWORD=

# If you need to reset MySQL password:
# macOS
brew services stop mysql
mysqld_safe --skip-grant-tables &
mysql -u root
ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';
FLUSH PRIVILEGES;
exit;
brew services start mysql
```

### Step 3: Generate JWT Secret

```bash
# Generate a secure random secret
openssl rand -base64 64 | tr -d '\n'
```

Copy the output and replace `your-generated-secret-key-here` in `.env`

### Step 4: Get Cloudinary Credentials

1. Go to https://cloudinary.com/users/register/free
2. Sign up (FREE account)
3. After login, copy these from Dashboard:
   - Cloud name
   - API Key
   - API Secret (click "Reveal")
4. Update `.env` with these values

---

## Part 4: Configure Frontend

### Step 1: Create Frontend .env.local File

```bash
cd ../frontend
```

Create `.env.local` file with this content:

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

### Step 2: Get Clerk Key

1. Go to https://clerk.com/sign-up
2. Create FREE account
3. Create application named "DwellDuo"
4. Go to "API Keys" in sidebar
5. Copy "Publishable Key" (starts with `pk_test_`)
6. Replace `your_clerk_key_here` in `.env.local`

---

## Part 5: Start Everything

### Terminal 1: Start Backend

```bash
cd backend-java

# Build and run
./mvnw spring-boot:run
```

**Wait for this message:**
```
Started DwellDuoApplication in X.XXX seconds
```

**Test it's working:**
```bash
# Open new terminal
curl http://localhost:8080/actuator/health
# Should return: {"status":"UP"}
```

---

### Terminal 2: Start Frontend

```bash
cd frontend

# Install dependencies (first time only)
npm install

# Start development server
npm run dev
```

**You'll see:**
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 🎉 Open Your Application

Open browser: **http://localhost:5173**

---

## 📝 Quick Reference

### Your Configuration Files

**Backend:** `backend-java/.env`
```env
DATABASE_URL=jdbc:mysql://localhost:3306/dwellduo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_password
REDIS_HOST=localhost
JWT_SECRET=<your_generated_secret>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend:** `frontend/.env.local`
```env
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
```

---

### Start Commands

**Every time you want to run the application:**

```bash
# Terminal 1: Backend
cd backend-java
./mvnw spring-boot:run

# Terminal 2: Frontend (new terminal)
cd frontend
npm run dev
```

---

### Stop Commands

- **Backend:** Press `Ctrl+C` in Terminal 1
- **Frontend:** Press `Ctrl+C` in Terminal 2

---

## 🐛 Troubleshooting

### MySQL Connection Error

```
Error: Access denied for user 'root'@'localhost'
```

**Solution:**
1. Check your MySQL password
2. Try connecting manually: `mysql -u root -p`
3. Update `DATABASE_PASSWORD` in `.env` with correct password

---

### MySQL Database Not Found

```
Error: Unknown database 'dwellduo'
```

**Solution:**
```bash
mysql -u root -p
CREATE DATABASE dwellduo;
exit;
```

---

### Redis Connection Error

```
Error: Unable to connect to Redis
```

**Solution:**
```bash
# Check if Redis is running
redis-cli ping
# Should return: PONG

# If not running, start it:
# macOS
brew services start redis

# Linux
sudo systemctl start redis
```

---

### Port 8080 Already in Use

```
Error: Port 8080 is already in use
```

**Solution:**
```bash
# Find what's using port 8080
lsof -i :8080

# Kill it
kill -9 <PID>

# Or change port in backend-java/.env
SERVER_PORT=8081
# And update frontend/.env.local
VITE_API_URL=http://localhost:8081/api
```

---

### Backend Won't Start - Maven Error

```bash
# Clean and rebuild
cd backend-java
./mvnw clean install

# Try running again
./mvnw spring-boot:run
```

---

### Frontend Can't Connect to Backend

**Check:**
1. Backend is running (Terminal 1 should show "Started DwellDuoApplication")
2. Test backend: `curl http://localhost:8080/actuator/health`
3. Check `VITE_API_URL` in `frontend/.env.local` is `http://localhost:8080/api`
4. Restart frontend: Press Ctrl+C, then `npm run dev`

---

## 🔍 Verify Everything Works

### 1. Check Backend

```bash
# Health check
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}

# Get game questions
curl http://localhost:8080/api/game/questions
# Expected: JSON array of questions
```

### 2. Check Database

```bash
mysql -u root -p dwellduo
```

```sql
-- Check tables exist
SHOW TABLES;
-- Expected: 7 tables (users, user_matches, messages, etc.)

-- Check sample data
SELECT COUNT(*) FROM game_questions;
-- Expected: 10

exit;
```

### 3. Check Frontend

1. Open http://localhost:5173
2. Open browser Developer Tools (F12)
3. Check Console for errors
4. Try to sign up/login with Clerk

---

## 📊 What's Running

| Service | Port | URL | Status Check |
|---------|------|-----|--------------|
| Backend API | 8080 | http://localhost:8080/api | `curl http://localhost:8080/actuator/health` |
| Frontend | 5173 | http://localhost:5173 | Open in browser |
| MySQL | 3306 | localhost:3306 | `mysql -u root -p` |
| Redis | 6379 | localhost:6379 | `redis-cli ping` |

---

## 🎯 Daily Workflow

### Starting Your Dev Session

```bash
# 1. Start MySQL (if not auto-started)
# macOS
brew services start mysql

# 2. Start Redis (if not auto-started)
brew services start redis

# 3. Start Backend (Terminal 1)
cd backend-java
./mvnw spring-boot:run

# 4. Start Frontend (Terminal 2 - new window)
cd frontend
npm run dev

# 5. Open browser
# http://localhost:5173
```

### Stopping Your Dev Session

```bash
# In each terminal, press: Ctrl+C

# Optionally stop MySQL and Redis
brew services stop mysql
brew services stop redis
```

---

## 💡 Tips

1. **Keep terminals open** - Don't close them while developing
2. **Backend logs** - Watch Terminal 1 for API errors
3. **Frontend logs** - Check browser Console (F12) for errors
4. **Database changes** - Flyway handles migrations automatically
5. **Code changes**:
   - Backend: Press Ctrl+C, then `./mvnw spring-boot:run` again
   - Frontend: Auto-reloads (no restart needed)

---

## 🔐 Environment Files Checklist

- [ ] `backend-java/.env` created
- [ ] MySQL password updated in `.env`
- [ ] JWT_SECRET generated and added
- [ ] Cloudinary credentials added
- [ ] `frontend/.env.local` created
- [ ] Clerk key added to `.env.local`

---

## ✅ You're All Set!

Your simple local setup is ready. Just run:

```bash
# Terminal 1
cd backend-java && ./mvnw spring-boot:run

# Terminal 2
cd frontend && npm run dev
```

Open http://localhost:5173 and start building! 🚀

---

## 📞 Need Help?

**Common Commands:**

```bash
# Restart Backend
# In Terminal 1: Ctrl+C, then
./mvnw spring-boot:run

# Restart Frontend
# In Terminal 2: Ctrl+C, then
npm run dev

# Check logs
# Backend: Check Terminal 1 output
# Frontend: Check Terminal 2 output
# Database: mysql -u root -p dwellduo

# Clean rebuild backend
./mvnw clean install
```

**Still having issues?** Check:
- MySQL is running: `mysql -u root -p`
- Redis is running: `redis-cli ping`
- Correct passwords in `.env`
- All credentials configured

---

Happy coding! 🎉



