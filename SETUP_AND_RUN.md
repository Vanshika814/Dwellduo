# 🚀 DwellDuo - Complete Setup & Run Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup (Java Spring Boot)](#backend-setup-java-spring-boot)
3. [Frontend Setup (React + Vite)](#frontend-setup-react--vite)
4. [Running the Complete Application](#running-the-complete-application)
5. [Testing the Application](#testing-the-application)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## Prerequisites

### Required Software

1. **Java 17 or higher**
```bash
# Check Java version
java -version

# Install Java (macOS)
brew install openjdk@17

# Install Java (Ubuntu)
sudo apt install openjdk-17-jdk
```

2. **Node.js 18 or higher**
```bash
# Check Node version
node --version

# Install Node (macOS)
brew install node

# Install Node (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs
```

3. **Docker & Docker Compose**
```bash
# Check Docker version
docker --version
docker-compose --version

# Install Docker Desktop (macOS/Windows)
# Download from: https://www.docker.com/products/docker-desktop

# Install Docker (Ubuntu)
sudo apt install docker.io docker-compose
```

4. **Git**
```bash
git --version
```

---

## Backend Setup (Java Spring Boot)

### Step 1: Navigate to Backend Directory
```bash
cd backend-java
```

### Step 2: Configure Environment Variables

Create `.env` file from example:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
# Database Configuration (if running locally)
DATABASE_URL=jdbc:postgresql://localhost:5432/dwellduo
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_password

# Redis Configuration (if running locally)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration (IMPORTANT: Use a strong secret in production)
JWT_SECRET=your-super-secret-jwt-key-min-256-bits-change-this-in-production-make-it-very-long-and-secure

# Cloudinary Configuration (Get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=DEBUG
SHOW_SQL=true
```

### Step 3: Choose Your Setup Method

#### **Option A: Using Docker Compose (Recommended - Easiest)**

1. **Start all services** (PostgreSQL + Redis + Spring Boot App)
```bash
docker-compose up -d
```

2. **Verify services are running**
```bash
docker-compose ps
```

You should see:
- `dwellduo-postgres` (running)
- `dwellduo-redis` (running)
- `dwellduo-app` (running)

3. **Check application logs**
```bash
docker-compose logs -f app
```

4. **Test the API**
```bash
curl http://localhost:8080/actuator/health
```

Expected response:
```json
{
  "status": "UP"
}
```

---

#### **Option B: Local Development (More Control)**

1. **Install and start PostgreSQL**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu
sudo apt install postgresql-15
sudo systemctl start postgresql
```

2. **Create database**
```bash
psql -U postgres
CREATE DATABASE dwellduo;
\q
```

3. **Install and start Redis**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt install redis-server
sudo systemctl start redis
```

4. **Build and run Spring Boot application**
```bash
# Build the application
./mvnw clean install

# Run the application
./mvnw spring-boot:run

# Or run with specific profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

5. **Verify application is running**
```bash
curl http://localhost:8080/actuator/health
```

---

### Step 4: Verify Database Migrations

Flyway migrations run automatically on startup. Check logs for:
```
Successfully applied X migrations to schema "public"
```

---

## Frontend Setup (React + Vite)

### Step 1: Navigate to Frontend Directory
```bash
cd ../frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables

Create `.env.local` file:
```bash
cat > .env.local << 'EOF'
# API Configuration - Spring Boot Backend
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws

# Clerk Configuration (Keep your existing Clerk keys)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
EOF
```

**Important:** Replace `your_clerk_publishable_key_here` with your actual Clerk publishable key.

### Step 4: Install Additional Dependencies (for WebSocket)

```bash
npm install sockjs-client @stomp/stompjs
```

### Step 5: Start Development Server
```bash
npm run dev
```

Frontend will start on: **http://localhost:5173**

---

## Running the Complete Application

### Full Stack Startup (Recommended Order)

#### 1. Start Backend (Docker Compose)
```bash
cd backend-java
docker-compose up -d
```

Wait for services to be healthy (~30 seconds):
```bash
docker-compose ps
```

#### 2. Start Frontend
```bash
cd ../frontend
npm run dev
```

#### 3. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/actuator/health

---

## Testing the Application

### 1. Test Backend API

#### Health Check
```bash
curl http://localhost:8080/actuator/health
```

#### Get Game Questions (Public)
```bash
curl http://localhost:8080/api/game/questions
```

#### Test Authentication (with Clerk)
```bash
curl -X POST http://localhost:8080/api/auth/clerk \
  -H "Content-Type: application/json" \
  -d '{
    "clerkId": "clerk_test_123",
    "email": "test@example.com",
    "name": "Test User"
  }'
```

### 2. Test Frontend

1. Open browser: http://localhost:5173
2. Sign up/Login with Clerk
3. Complete your profile
4. Play the compatibility game
5. View matches
6. Send messages

### 3. Test WebSocket Connection

Open browser console and run:
```javascript
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect(
  { Authorization: `Bearer ${yourAccessToken}` },
  (frame) => {
    console.log('Connected:', frame);
    stompClient.subscribe('/user/queue/messages', (message) => {
      console.log('Received:', JSON.parse(message.body));
    });
  }
);
```

---

## Common Issues & Solutions

### Issue 1: Backend Won't Start - Database Connection Error

**Error:**
```
Unable to acquire JDBC Connection
```

**Solution:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# If not running, start Docker Compose
cd backend-java
docker-compose up -d postgres

# Check PostgreSQL logs
docker logs dwellduo-postgres
```

---

### Issue 2: Backend Won't Start - Redis Connection Error

**Error:**
```
Unable to connect to Redis
```

**Solution:**
```bash
# Check if Redis is running
docker ps | grep redis

# Start Redis
docker-compose up -d redis

# Test Redis connection
docker exec -it dwellduo-redis redis-cli ping
# Should return: PONG
```

---

### Issue 3: Frontend Can't Connect to Backend

**Error:**
```
Network Error / CORS Error
```

**Solution:**

1. Check backend is running:
```bash
curl http://localhost:8080/actuator/health
```

2. Verify `.env.local` in frontend:
```bash
VITE_API_URL=http://localhost:8080/api
```

3. Check backend CORS configuration in `application.yml`:
```yaml
cors:
  allowed-origins: http://localhost:5173,http://localhost:3000
```

4. Restart both backend and frontend

---

### Issue 4: JWT Token Invalid/Expired

**Error:**
```
401 Unauthorized
```

**Solution:**

1. Clear localStorage in browser:
```javascript
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

2. Login again through Clerk
3. Check JWT_SECRET is set in backend `.env`

---

### Issue 5: Flyway Migration Errors

**Error:**
```
Flyway migration failed
```

**Solution:**

1. **Reset database** (WARNING: Deletes all data)
```bash
# Connect to database
docker exec -it dwellduo-postgres psql -U postgres -d dwellduo

# Drop and recreate database
DROP DATABASE dwellduo;
CREATE DATABASE dwellduo;
\q

# Restart application
docker-compose restart app
```

---

### Issue 6: Port Already in Use

**Error:**
```
Port 8080 is already in use
```

**Solution:**

1. **Find process using port:**
```bash
# macOS/Linux
lsof -i :8080

# Windows
netstat -ano | findstr :8080
```

2. **Kill process:**
```bash
# macOS/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F
```

3. **Or change backend port** in `.env`:
```env
SERVER_PORT=8081
```

---

### Issue 7: Maven Build Fails

**Error:**
```
Maven build failed
```

**Solution:**

1. **Clean Maven cache:**
```bash
cd backend-java
./mvnw clean
```

2. **Delete target folder:**
```bash
rm -rf target/
```

3. **Rebuild:**
```bash
./mvnw clean install -DskipTests
```

---

## 🎯 Quick Commands Reference

### Backend Commands
```bash
# Start with Docker Compose
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app

# Rebuild and restart
docker-compose up -d --build

# Run tests
./mvnw test

# Build JAR
./mvnw clean package
```

### Frontend Commands
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Database Commands
```bash
# Connect to PostgreSQL
docker exec -it dwellduo-postgres psql -U postgres -d dwellduo

# Connect to Redis
docker exec -it dwellduo-redis redis-cli

# Backup database
docker exec dwellduo-postgres pg_dump -U postgres dwellduo > backup.sql

# Restore database
docker exec -i dwellduo-postgres psql -U postgres dwellduo < backup.sql
```

---

## 📊 Verify Everything is Working

### Checklist

- [ ] Backend health check returns `UP`: http://localhost:8080/actuator/health
- [ ] Database migrations completed successfully (check logs)
- [ ] Redis is connected (check logs)
- [ ] Frontend loads: http://localhost:5173
- [ ] Frontend can call backend API (check Network tab)
- [ ] Clerk authentication works
- [ ] Can create/update user profile
- [ ] Can play compatibility game
- [ ] Can view matches
- [ ] Can send messages
- [ ] WebSocket connection works (real-time messages)

---

## 🎉 Success!

Your DwellDuo application with Java Spring Boot backend is now running!

**Next Steps:**
1. Complete your user profile
2. Answer compatibility questions
3. Calculate matches
4. Start connecting with roommates!

**For Production Deployment:**
- See `backend-java/README.md` for production configuration
- Update JWT_SECRET with a strong secret
- Configure production database and Redis
- Set up proper CORS origins
- Enable HTTPS
- Set up monitoring and logging

---

## 📞 Need Help?

- Check backend logs: `docker-compose logs -f app`
- Check frontend console in browser DevTools
- Open an issue on GitHub
- Review API documentation in `backend-java/README.md`

Happy Coding! 🚀



