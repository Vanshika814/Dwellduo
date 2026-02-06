# 🚀 Quick Start Guide - MySQL Configuration

**Fast setup guide for DwellDuo with MySQL**

---

## ⚡ Super Quick Setup (5 minutes)

### Step 1: Backend Configuration

```bash
cd backend-java

# Create .env file
cat > .env << 'EOF'
# MySQL Configuration
DATABASE_URL=jdbc:mysql://mysql:3306/dwellduo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=password

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# JWT Secret (CHANGE THIS!)
JWT_SECRET=kJ8n3mP9qR4sT5uW6xY7zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU

# Cloudinary (Replace with your credentials)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
LOG_LEVEL=DEBUG
EOF

# Generate your own JWT secret
openssl rand -base64 64 | tr -d '\n'
# Copy the output and replace JWT_SECRET in .env
```

### Step 2: Get Cloudinary Credentials (2 minutes)

1. Go to https://cloudinary.com/users/register/free
2. Sign up (it's free)
3. Copy these values from Dashboard:
   - **Cloud name**
   - **API Key**
   - **API Secret** (click "Reveal")
4. Update `.env` file with these values

### Step 3: Frontend Configuration

```bash
cd ../frontend

# Create .env.local file
cat > .env.local << 'EOF'
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
EOF
```

### Step 4: Get Clerk Key (2 minutes)

1. Go to https://clerk.com/sign-up
2. Create account (free)
3. Create application named "DwellDuo"
4. Go to "API Keys" in sidebar
5. Copy "Publishable Key" (starts with `pk_test_`)
6. Update `.env.local` with this key

### Step 5: Start Everything

```bash
# Start backend (MySQL + Redis + Spring Boot)
cd backend-java
docker-compose up -d

# Wait 30 seconds for services to start
sleep 30

# Check if running
curl http://localhost:8080/actuator/health

# Start frontend
cd ../frontend
npm install
npm run dev
```

**Done!** Open http://localhost:5173

---

## 🗄️ Using Your Existing MySQL

If you already have MySQL installed locally:

### 1. Create Database

```bash
mysql -u root -p
```

```sql
CREATE DATABASE dwellduo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
exit;
```

### 2. Update Backend .env

```env
# Change these lines:
DATABASE_URL=jdbc:mysql://localhost:3306/dwellduo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_actual_mysql_password

# Also change Redis to localhost if running locally:
REDIS_HOST=localhost
```

### 3. Start Only Redis in Docker

```bash
cd backend-java
docker-compose up -d redis
```

### 4. Run Backend Locally

```bash
./mvnw spring-boot:run
```

---

## 📝 Configuration Checklist

### Backend (.env in backend-java/)
- [x] `DATABASE_URL` - MySQL connection string
- [x] `DATABASE_USERNAME` - MySQL username (usually `root`)
- [x] `DATABASE_PASSWORD` - MySQL password
- [x] `JWT_SECRET` - **Generate your own!** (see command below)
- [x] `CLOUDINARY_CLOUD_NAME` - From cloudinary.com
- [x] `CLOUDINARY_API_KEY` - From cloudinary.com
- [x] `CLOUDINARY_API_SECRET` - From cloudinary.com

### Frontend (.env.local in frontend/)
- [x] `VITE_API_URL` - http://localhost:8080/api
- [x] `VITE_WS_URL` - http://localhost:8080/ws
- [x] `VITE_CLERK_PUBLISHABLE_KEY` - From clerk.com

---

## 🔐 Generate Secure JWT Secret

**Important:** Don't use the default JWT_SECRET in production!

```bash
# Generate a secure random secret
openssl rand -base64 64 | tr -d '\n'
```

Copy the output and paste it in your `.env` file:
```env
JWT_SECRET=<paste_generated_secret_here>
```

---

## 🧪 Test Your Configuration

### Test Backend

```bash
# Health check
curl http://localhost:8080/actuator/health

# Should return: {"status":"UP"}

# Get game questions
curl http://localhost:8080/api/game/questions

# Should return JSON with questions
```

### Test Frontend

1. Open browser: http://localhost:5173
2. Open Developer Console (F12)
3. Check for errors in Console tab
4. Try to sign up/login with Clerk

---

## 🐛 Common Issues

### MySQL Connection Failed

```bash
# Check MySQL is running in Docker
docker ps | grep mysql

# View MySQL logs
docker logs dwellduo-mysql

# Connect to MySQL
docker exec -it dwellduo-mysql mysql -u root -p
# Password: password
```

### JWT Error / 401 Unauthorized

```bash
# Generate new JWT secret
openssl rand -base64 64 | tr -d '\n'

# Update backend-java/.env
# Restart backend
docker-compose restart app
```

### CORS Error in Browser

```bash
# Check CORS_ORIGINS in backend-java/.env includes frontend URL
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Restart backend
docker-compose restart app
```

### Port 8080 Already in Use

```bash
# Find what's using port 8080
lsof -i :8080

# Kill it
kill -9 <PID>

# Or change port in backend-java/.env
SERVER_PORT=8081
```

### Cloudinary Upload Failed

- Double check your credentials on https://cloudinary.com/console
- Make sure no typos in cloud name, API key, or secret
- API Secret is hidden by default - click "Reveal" to see it

---

## 📊 Verify Database

### Check Tables Were Created

```bash
# Connect to MySQL
docker exec -it dwellduo-mysql mysql -u root -p dwellduo
# Password: password
```

```sql
-- Show all tables (should see 7 tables)
SHOW TABLES;

-- Check tables exist
-- You should see:
-- users
-- user_preferences
-- user_matches
-- user_game_answers
-- messages
-- game_questions
-- flyway_schema_history

-- Check sample data
SELECT COUNT(*) FROM game_questions;
-- Should return: 10

exit;
```

---

## 🎯 What Each File Does

| File | Location | Purpose |
|------|----------|---------|
| `.env` | `backend-java/.env` | Backend configuration |
| `.env.local` | `frontend/.env.local` | Frontend configuration |
| `docker-compose.yml` | `backend-java/` | Defines MySQL, Redis, App services |
| `application.yml` | `backend-java/src/main/resources/` | Spring Boot config |

---

## 💡 Pro Tips

1. **Never commit .env files to Git** - They're in .gitignore already

2. **Use different secrets for production:**
   - Generate new JWT_SECRET
   - Use strong MySQL password
   - Separate Cloudinary account

3. **Keep credentials safe:**
   - Don't share them in screenshots
   - Don't paste them in public forums
   - Use environment variables in deployment platforms

4. **Backup your .env files:**
   ```bash
   cp backend-java/.env backend-java/.env.backup
   cp frontend/.env.local frontend/.env.local.backup
   ```

---

## 🚀 Start Commands Reference

```bash
# Backend - Full Stack (MySQL + Redis + App)
cd backend-java
docker-compose up -d
docker-compose logs -f app

# Backend - Rebuild and Start
docker-compose up -d --build

# Backend - Stop
docker-compose down

# Frontend
cd frontend
npm run dev

# Frontend - Install Dependencies First
npm install
npm run dev
```

---

## 📞 Need More Help?

See detailed guides:
- **Full guide:** [ENV_CONFIGURATION_GUIDE.md](ENV_CONFIGURATION_GUIDE.md)
- **Setup guide:** [SETUP_AND_RUN.md](SETUP_AND_RUN.md)
- **Backend README:** [backend-java/README.md](backend-java/README.md)

---

**Happy Coding!** 🎉



