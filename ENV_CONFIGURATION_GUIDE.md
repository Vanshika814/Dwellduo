# 🔐 Environment Configuration Guide

Complete guide to configure all environment variables for DwellDuo.

---

## 📋 Table of Contents
1. [Backend Configuration (.env)](#backend-configuration-env)
2. [Frontend Configuration (.env.local)](#frontend-configuration-envlocal)
3. [Getting API Keys](#getting-api-keys)
4. [MySQL Setup](#mysql-setup)
5. [Security Best Practices](#security-best-practices)

---

## Backend Configuration (.env)

### Step 1: Create the .env file

```bash
cd backend-java
cp .env.example .env
```

### Step 2: Configure Each Section

#### 🗄️ **DATABASE CONFIGURATION (MySQL)**

```env
# If using Docker Compose (recommended):
DATABASE_URL=jdbc:mysql://mysql:3306/dwellduo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
```

**If using your existing local MySQL:**
```env
# Replace with your MySQL credentials
DATABASE_URL=jdbc:mysql://localhost:3306/dwellduo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_actual_mysql_password
```

**How to find your MySQL credentials:**
```bash
# Check if MySQL is running
mysql --version

# Connect to MySQL
mysql -u root -p
# (Enter your password)

# Once connected, create the database:
CREATE DATABASE IF NOT EXISTS dwellduo;
SHOW DATABASES;
exit;
```

---

#### 🔴 **REDIS CONFIGURATION**

```env
# If using Docker Compose:
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# If using local Redis:
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
```

**Check if Redis is installed:**
```bash
# macOS
brew services list | grep redis

# Ubuntu
systemctl status redis

# Start Redis if not running
brew services start redis  # macOS
sudo systemctl start redis # Ubuntu
```

---

#### 🔐 **JWT AUTHENTICATION CONFIGURATION**

**This is CRITICAL for security!**

```env
# Generate a strong secret key (256+ bits)
JWT_SECRET=your-super-secret-jwt-key-must-be-very-long-and-random-for-security

# Token expiration times (in milliseconds)
JWT_EXPIRATION=86400000        # 24 hours
JWT_REFRESH_EXPIRATION=604800000  # 7 days
```

**Generate a secure JWT secret:**

**Option 1: Using OpenSSL (Recommended)**
```bash
openssl rand -base64 64 | tr -d '\n'
```

**Option 2: Using Python**
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(64))"
```

**Option 3: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

**Copy the output and paste it as your JWT_SECRET value.**

Example result:
```env
JWT_SECRET=kJ8n3mP9qR4sT5uW6xY7zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU
```

⚠️ **NEVER share this secret or commit it to Git!**

---

#### 🖼️ **CLOUDINARY CONFIGURATION**

Cloudinary handles image uploads (profile pictures, etc.)

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=dwellduo/profile_images
```

**How to get Cloudinary credentials:**

1. **Sign up for free account:**
   - Go to https://cloudinary.com
   - Click "Sign Up for Free"
   - Complete registration

2. **Get your credentials:**
   - After login, you'll see the Dashboard
   - You'll see these values immediately:
     ```
     Cloud name: your_cloud_name
     API Key: 123456789012345
     API Secret: abcdefghijklmnopqrstuvwxyz
     ```

3. **Copy to .env:**
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   CLOUDINARY_UPLOAD_FOLDER=dwellduo/profile_images
   ```

**Screenshot locations on Dashboard:**
- Top of page: "Cloud name"
- Under "Account Details" section: API Key and API Secret
- Click "👁️ Reveal" to see API Secret

---

#### 🌐 **SERVER & CORS CONFIGURATION**

```env
# Server port (default is fine)
SERVER_PORT=8080

# Environment profile
SPRING_PROFILES_ACTIVE=dev

# Frontend URLs (add all your frontend URLs)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# For production, add your domain:
# CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,http://localhost:5173
```

---

#### 📝 **LOGGING CONFIGURATION**

```env
# DEBUG for development, INFO for production
LOG_LEVEL=DEBUG

# Show SQL queries in logs (helpful for debugging)
SHOW_SQL=false
```

---

### Complete Backend .env Example

```env
# DATABASE (MySQL)
DATABASE_URL=jdbc:mysql://mysql:3306/dwellduo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=password

# REDIS
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT (GENERATE YOUR OWN!)
JWT_SECRET=kJ8n3mP9qR4sT5uW6xY7zA1bC2dE3fG4hI5jK6lM7nO8pQ9rS0tU1vW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# CLOUDINARY (GET FROM CLOUDINARY.COM)
CLOUDINARY_CLOUD_NAME=dwellduo-prod
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz1234
CLOUDINARY_UPLOAD_FOLDER=dwellduo/profile_images

# SERVER
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=dev
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# LOGGING
LOG_LEVEL=DEBUG
SHOW_SQL=false
```

---

## Frontend Configuration (.env.local)

### Step 1: Create the .env.local file

```bash
cd frontend
cp .env.example .env.local
```

### Step 2: Configure Each Section

#### 🔌 **BACKEND API CONFIGURATION**

```env
# Local development
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws
```

**For production:**
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_WS_URL=https://api.yourdomain.com/ws
```

---

#### 🔐 **CLERK AUTHENTICATION**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
```

**How to get Clerk Publishable Key:**

1. **Go to Clerk:**
   - Visit https://clerk.com
   - Sign in or create an account (FREE)

2. **Create an Application:**
   - Click "Create Application"
   - Name it "DwellDuo" or anything you like
   - Choose authentication methods (Email, Google, etc.)

3. **Get API Keys:**
   - Go to your application dashboard
   - Click on "API Keys" in the left sidebar
   - You'll see:
     ```
     Publishable Key
     pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - Copy the **Publishable Key** (starts with `pk_test_`)

4. **Add to .env.local:**
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcms5Y29tJDEyMzQ1Njc4OQ
   ```

⚠️ **Note:** Publishable keys are safe to use in frontend code.

---

### Complete Frontend .env.local Example

```env
# API Configuration
VITE_API_URL=http://localhost:8080/api
VITE_WS_URL=http://localhost:8080/ws

# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcms5Y29tJDEyMzQ1Njc4OQ
```

---

## Getting API Keys

### 📸 Cloudinary (Required for Image Upload)

**Free Tier:** 25 GB storage, 25 GB bandwidth/month

1. **Sign up:** https://cloudinary.com/users/register/free
2. **Navigate:** Dashboard → Account Details
3. **Copy:**
   - Cloud name
   - API Key
   - API Secret (click "Reveal")

---

### 🔐 Clerk (Required for Authentication)

**Free Tier:** Up to 10,000 monthly active users

1. **Sign up:** https://clerk.com/sign-up
2. **Create Application**
3. **Navigate:** Dashboard → API Keys
4. **Copy:** Publishable Key (starts with `pk_test_`)

---

## MySQL Setup

### Using Your Existing MySQL

1. **Check MySQL is running:**
```bash
# Check status
brew services list | grep mysql  # macOS
systemctl status mysql          # Linux

# Start if not running
brew services start mysql        # macOS
sudo systemctl start mysql       # Linux
```

2. **Create database:**
```bash
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE dwellduo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
exit;
```

3. **Update backend .env:**
```env
DATABASE_URL=jdbc:mysql://localhost:3306/dwellduo?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DATABASE_USERNAME=root
DATABASE_PASSWORD=your_actual_mysql_password
```

4. **Test connection:**
```bash
mysql -u root -p -e "USE dwellduo; SHOW TABLES;"
```

---

### Using Docker MySQL (Recommended)

Already configured in `docker-compose.yml`! Just run:
```bash
docker-compose up -d mysql
```

---

## Security Best Practices

### ✅ DO's

1. **Generate strong JWT secrets:**
   ```bash
   openssl rand -base64 64
   ```

2. **Use environment-specific .env files:**
   - `.env.local` for local development
   - `.env.production` for production

3. **Keep .env files in .gitignore:**
   ```bash
   # Already in .gitignore
   .env
   .env.local
   .env.*.local
   ```

4. **Use different credentials for production:**
   - Different JWT secret
   - Different database password
   - Separate Cloudinary account

5. **Rotate secrets regularly** (every 3-6 months)

---

### ❌ DON'Ts

1. ❌ NEVER commit .env files to Git
2. ❌ NEVER share JWT_SECRET publicly
3. ❌ NEVER use default passwords in production
4. ❌ NEVER store secrets in frontend code
5. ❌ NEVER reuse secrets across environments

---

## Verification Checklist

### Backend
- [ ] `.env` file created in `backend-java/`
- [ ] MySQL database created and accessible
- [ ] JWT_SECRET is 256+ bits (32+ characters)
- [ ] Cloudinary credentials added
- [ ] Redis is running (or will use Docker)
- [ ] CORS_ORIGINS includes frontend URL

### Frontend
- [ ] `.env.local` file created in `frontend/`
- [ ] `VITE_API_URL` points to backend (http://localhost:8080/api)
- [ ] `VITE_CLERK_PUBLISHABLE_KEY` is set
- [ ] Clerk account created and configured

---

## Testing Configuration

### Test Backend Configuration
```bash
cd backend-java

# If using Docker Compose:
docker-compose up -d

# If running locally:
./mvnw spring-boot:run

# Check health:
curl http://localhost:8080/actuator/health

# Should return:
# {"status":"UP"}
```

### Test Frontend Configuration
```bash
cd frontend
npm run dev

# Open browser: http://localhost:5173
# Check browser console for errors
```

---

## Troubleshooting

### "Cannot connect to MySQL"
```bash
# Check MySQL is running
mysql -u root -p

# Check database exists
SHOW DATABASES;

# Verify credentials in .env match your MySQL
```

### "Invalid JWT Secret"
```bash
# Generate new secret
openssl rand -base64 64

# Update in backend-java/.env
JWT_SECRET=<new_secret_here>
```

### "Cloudinary upload failed"
```bash
# Verify credentials
curl https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload \
  -F "file=@test.jpg" \
  -F "api_key=YOUR_API_KEY" \
  -F "timestamp=1234567890" \
  -F "signature=SIGNATURE"
```

### "CORS Error in Frontend"
```bash
# Add frontend URL to backend .env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Restart backend
docker-compose restart app
```

---

## Quick Reference

### Generate JWT Secret
```bash
openssl rand -base64 64 | tr -d '\n'
```

### Check MySQL
```bash
mysql -u root -p -e "SHOW DATABASES;"
```

### Check Redis
```bash
redis-cli ping  # Should return: PONG
```

### View Backend Logs
```bash
docker-compose logs -f app
```

### Check Environment Variables
```bash
# Backend
cat backend-java/.env

# Frontend
cat frontend/.env.local
```

---

## Need Help?

1. **Check logs:** `docker-compose logs -f app`
2. **Verify .env syntax:** No spaces around `=`
3. **Restart services:** `docker-compose restart`
4. **Reset everything:** `docker-compose down -v && docker-compose up -d`

---

**You're all set!** 🎉 Follow the [SETUP_AND_RUN.md](SETUP_AND_RUN.md) guide to start the application.



