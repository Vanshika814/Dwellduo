# PostgreSQL Setup Guide for DwellDuo

## Step 1: Install PostgreSQL

```bash
# Install PostgreSQL 14
brew install postgresql@14

# Add PostgreSQL to your PATH (add this to ~/.zshrc)
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Step 2: Start PostgreSQL Service

```bash
# Start PostgreSQL
brew services start postgresql@14

# Verify it's running
brew services list | grep postgresql
```

## Step 3: Create Database and User

```bash
# Connect to PostgreSQL as the default user
psql postgres
```

Once connected, run these SQL commands:

```sql
-- Create the database
CREATE DATABASE dwellduo;

-- Create a user with password
CREATE USER dwellduo_user WITH PASSWORD 'dwellduo123';

-- Grant all privileges on the database
GRANT ALL PRIVILEGES ON DATABASE dwellduo TO dwellduo_user;

-- Connect to the database
\c dwellduo

-- Grant schema privileges (PostgreSQL 15+)
GRANT ALL ON SCHEMA public TO dwellduo_user;

-- Exit psql
\q
```

## Step 4: Test Connection

```bash
# Test if you can connect with the new user
psql -U dwellduo_user -d dwellduo -h localhost

# If prompted for password, enter: dwellduo123
# Then exit with: \q
```

## Step 5: Configure Environment Variables

Create or update `.env` file in `backend-java` directory:

```bash
# Database Configuration
DATABASE_URL=jdbc:postgresql://localhost:5432/dwellduo
DATABASE_USERNAME=dwellduo_user
DATABASE_PASSWORD=dwellduo123

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-make-it-at-least-256-bits
JWT_EXPIRATION=86400000
JWT_REFRESH_EXPIRATION=604800000

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=dwellduo/profile_images

# Server Configuration
SERVER_PORT=8080

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000

# Logging
LOG_LEVEL=DEBUG
SHOW_SQL=true
```

## Step 6: Run Database Migrations

```bash
cd /Users/vanshikaagarwal/Dwellduo/backend-java

# Clean and compile
mvn clean compile

# Run Flyway migrations
mvn flyway:migrate
```

## Step 7: Start the Backend

```bash
# Make sure you're in the backend-java directory
cd /Users/vanshikaagarwal/Dwellduo/backend-java

# Start the application
mvn spring-boot:run
```

## Troubleshooting

### Issue: "Access denied" or connection refused

**Solution:**
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Restart if needed
brew services restart postgresql@14

# Check PostgreSQL logs
tail -f /opt/homebrew/var/log/postgresql@14.log
```

### Issue: "database does not exist"

**Solution:**
```bash
psql postgres
CREATE DATABASE dwellduo;
\q
```

### Issue: Flyway migration fails

**Solution:**
```bash
# Reset the database (WARNING: This will delete all data)
psql -U dwellduo_user -d dwellduo -h localhost

DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO dwellduo_user;
\q

# Run migrations again
mvn flyway:migrate
```

### Issue: "peer authentication failed"

**Solution:**
Edit PostgreSQL config to allow password authentication:
```bash
# Find pg_hba.conf location
psql postgres -c "SHOW hba_file"

# Edit the file and change 'peer' to 'md5' for local connections
# Then restart PostgreSQL
brew services restart postgresql@14
```

## Useful PostgreSQL Commands

```bash
# Connect to database
psql -U dwellduo_user -d dwellduo -h localhost

# Inside psql:
\l              # List all databases
\c dwellduo     # Connect to dwellduo database
\dt             # List all tables
\d table_name   # Describe table structure
\du             # List all users
\q              # Quit psql

# View all data in a table
SELECT * FROM users;

# Drop database (careful!)
DROP DATABASE dwellduo;
```

## Quick Start Commands (After Initial Setup)

```bash
# Terminal 1: Start PostgreSQL (if not already running)
brew services start postgresql@14

# Terminal 2: Start Redis (if not already running)
brew services start redis

# Terminal 3: Start Backend
cd /Users/vanshikaagarwal/Dwellduo/backend-java
mvn spring-boot:run

# Terminal 4: Start Frontend
cd /Users/vanshikaagarwal/Dwellduo/frontend
npm run dev
```

## Default Credentials

- **Database:** dwellduo
- **Username:** dwellduo_user
- **Password:** dwellduo123
- **Host:** localhost
- **Port:** 5432

**Important:** Change these credentials in production!


