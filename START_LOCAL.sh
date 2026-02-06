#!/bin/bash

# DwellDuo - Local Development Startup Script

echo "🚀 Starting DwellDuo (Local Development)"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MySQL is running
echo "🔍 Checking MySQL..."
if ! mysqladmin ping -h localhost --silent 2>/dev/null; then
    echo -e "${RED}❌ MySQL is not running${NC}"
    echo "Start MySQL with: brew services start mysql"
    exit 1
fi
echo -e "${GREEN}✅ MySQL is running${NC}"

# Check if Redis is running
echo "🔍 Checking Redis..."
if ! redis-cli ping > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Redis is not running. Starting Redis...${NC}"
    if command -v brew &> /dev/null; then
        brew services start redis
    else
        sudo systemctl start redis
    fi
    sleep 2
fi

if redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${RED}❌ Could not start Redis${NC}"
    echo "Start Redis manually with: brew services start redis"
    exit 1
fi

# Check if database exists
echo "🔍 Checking database..."
if ! mysql -u root -p -e "USE dwellduo" 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Database 'dwellduo' does not exist${NC}"
    echo "Creating database..."
    mysql -u root -p -e "CREATE DATABASE dwellduo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Database created${NC}"
    else
        echo -e "${RED}❌ Failed to create database${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Database exists${NC}"
fi

# Check backend .env
echo "🔍 Checking backend configuration..."
if [ ! -f "backend-java/.env" ]; then
    echo -e "${YELLOW}⚠️  backend-java/.env not found${NC}"
    echo "Please create it from .env.example"
    exit 1
fi
echo -e "${GREEN}✅ Backend .env exists${NC}"

# Check frontend .env.local
echo "🔍 Checking frontend configuration..."
if [ ! -f "frontend/.env.local" ]; then
    echo -e "${YELLOW}⚠️  frontend/.env.local not found${NC}"
    echo "Please create it from .env.example"
    exit 1
fi
echo -e "${GREEN}✅ Frontend .env.local exists${NC}"

echo ""
echo "========================================"
echo -e "${GREEN}✅ All checks passed!${NC}"
echo "========================================"
echo ""
echo "📝 To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend-java"
echo "  ./mvnw spring-boot:run"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:5173"
echo ""
