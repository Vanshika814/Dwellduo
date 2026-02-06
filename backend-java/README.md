# DwellDuo Backend - Spring Boot

**🏠 Enterprise-grade roommate matching platform backend built with Java Spring Boot**

## 🛠️ Tech Stack

### Core Framework
- **Java 17** (LTS) - Modern Java features
- **Spring Boot 3.2.1** - Latest Spring framework
- **Maven** - Dependency management

### Database & Persistence
- **PostgreSQL** - Production database (recommended)
- **MySQL/MariaDB** - Alternative option
- **Hibernate + JPA** - ORM framework
- **Flyway** - Database migrations

### Security & Authentication
- **Spring Security** - Enterprise security framework
- **JWT (JSON Web Tokens)** - Stateless authentication
- **BCrypt** - Password hashing (if needed)
- **Clerk Integration** - Third-party auth provider

### Caching & Messaging
- **Redis** - Caching and session management
- **Spring WebSocket + STOMP** - Real-time messaging
- **Spring @Async** - Asynchronous job processing

### File Storage
- **Cloudinary Java SDK** - Cloud image storage

### Testing
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing
- **Testcontainers** - Container-based testing

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Spring Boot Actuator** - Health checks and metrics

---

## 📋 Prerequisites

- **Java 17** or higher
- **Maven 3.6+** or use included Maven wrapper
- **Docker & Docker Compose** (for containerized setup)
- **PostgreSQL** (if running locally without Docker)
- **Redis** (if running locally without Docker)

---

## 🚀 Quick Start

### Option 1: Using Docker Compose (Recommended)

1. **Clone the repository**
```bash
cd backend-java
```

2. **Set up environment variables**
```bash
# Copy example env file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

3. **Configure environment variables in `.env`**
```env
# JWT Secret (generate a long random string)
JWT_SECRET=your-super-secret-jwt-key-min-256-bits-change-in-production

# Cloudinary credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

4. **Start all services**
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Spring Boot application on port 8080

5. **Check application health**
```bash
curl http://localhost:8080/actuator/health
```

6. **View logs**
```bash
docker-compose logs -f app
```

---

### Option 2: Local Development (Without Docker)

#### 1. Install Dependencies

**PostgreSQL**
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Ubuntu
sudo apt install postgresql-15
sudo systemctl start postgresql
```

**Redis**
```bash
# macOS
brew install redis
brew services start redis

# Ubuntu
sudo apt install redis-server
sudo systemctl start redis
```

#### 2. Create Database
```bash
psql -U postgres
CREATE DATABASE dwellduo;
\q
```

#### 3. Configure Application
```bash
# Copy application properties
cp src/main/resources/application.yml src/main/resources/application-local.yml
```

Edit `application-local.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/dwellduo
    username: postgres
    password: your_password
  
  data:
    redis:
      host: localhost
      port: 6379

jwt:
  secret: your-super-secret-jwt-key-change-in-production-make-it-long-and-secure

cloudinary:
  cloud-name: your_cloud_name
  api-key: your_api_key
  api-secret: your_api_secret
```

#### 4. Build and Run
```bash
# Using Maven wrapper (recommended)
./mvnw clean install
./mvnw spring-boot:run -Dspring-boot.run.profiles=local

# Or using installed Maven
mvn clean install
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

The application will start on **http://localhost:8080**

---

## 🧪 Running Tests

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=UserServiceTest

# Run tests with coverage
./mvnw test jacoco:report

# Run integration tests
./mvnw verify
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### POST `/api/auth/clerk`
Authenticate user with Clerk credentials
```json
{
  "clerkId": "clerk_xxx",
  "email": "user@example.com",
  "name": "John Doe",
  "profileImage": "https://..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Authentication successful",
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "tokenType": "Bearer",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      ...
    }
  }
}
```

#### POST `/api/auth/refresh`
Refresh access token
```
?refreshToken=eyJhbGc...
```

---

### User Endpoints (Protected)

All requests require `Authorization: Bearer <token>` header

#### GET `/api/users/me`
Get current user profile

#### PUT `/api/users/me`
Update user profile
```json
{
  "name": "John Doe",
  "age": 25,
  "bio": "Looking for a roommate",
  "currentCity": "Mumbai",
  "budgetMin": 15000,
  "budgetMax": 25000
}
```

#### POST `/api/users/me/complete-profile`
Mark profile as completed

#### DELETE `/api/users/me`
Delete account (soft delete)

---

### Match Endpoints (Protected)

#### GET `/api/matches`
Get all matches for current user

#### GET `/api/matches/top?limit=10`
Get top N matches

#### GET `/api/matches/mutual`
Get mutual matches (both users liked)

#### POST `/api/matches/{userId}/like`
Like/unlike a match

#### POST `/api/matches/calculate`
Trigger match calculation (async job)

---

### Message Endpoints (Protected)

#### POST `/api/messages`
Send a message
```json
{
  "receiverId": 2,
  "content": "Hi! Are you still looking for a roommate?",
  "messageType": "TEXT"
}
```

#### GET `/api/messages/conversation/{userId}`
Get conversation with a user

#### GET `/api/messages/unread`
Get all unread messages

#### GET `/api/messages/unread/count`
Get unread message count

#### PUT `/api/messages/{messageId}/read`
Mark message as read

---

### Game Endpoints (Protected)

#### GET `/api/game/questions`
Get all active game questions

#### POST `/api/game/answers`
Submit an answer
```json
{
  "questionId": 1,
  "answer": "A",
  "answerText": "Before 10 PM"
}
```

#### POST `/api/game/answers/bulk`
Submit multiple answers

#### GET `/api/game/completed`
Check if user completed all questions

---

### Image Upload Endpoints (Protected)

#### POST `/api/upload`
Upload image to Cloudinary
```
Content-Type: multipart/form-data
Body: image=<file>
```

#### DELETE `/api/upload?publicId=xxx`
Delete image from Cloudinary

---

## 🔐 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection URL | Yes | `jdbc:postgresql://localhost:5432/dwellduo` |
| `DATABASE_USERNAME` | Database username | Yes | `postgres` |
| `DATABASE_PASSWORD` | Database password | Yes | - |
| `REDIS_HOST` | Redis host | Yes | `localhost` |
| `REDIS_PORT` | Redis port | No | `6379` |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | Yes | - |
| `JWT_EXPIRATION` | Access token expiration (ms) | No | `86400000` (24h) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - |
| `SERVER_PORT` | Server port | No | `8080` |
| `SPRING_PROFILES_ACTIVE` | Active profile | No | `dev` |

---

## 🏗️ Project Structure

```
backend-java/
├── src/
│   ├── main/
│   │   ├── java/com/dwellduo/
│   │   │   ├── config/              # Configuration classes
│   │   │   │   ├── CloudinaryConfig.java
│   │   │   │   ├── RedisConfig.java
│   │   │   │   └── WebSocketConfig.java
│   │   │   ├── controller/          # REST Controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   ├── UserController.java
│   │   │   │   ├── MatchController.java
│   │   │   │   ├── MessageController.java
│   │   │   │   ├── GameController.java
│   │   │   │   └── ImageUploadController.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   ├── entity/              # JPA Entities
│   │   │   │   ├── User.java
│   │   │   │   ├── UserMatch.java
│   │   │   │   ├── Message.java
│   │   │   │   └── GameQuestion.java
│   │   │   ├── exception/           # Custom Exceptions
│   │   │   ├── job/                 # Async Jobs
│   │   │   │   └── MatchCalculationJob.java
│   │   │   ├── repository/          # JPA Repositories
│   │   │   ├── security/            # Security Configuration
│   │   │   │   ├── JwtUtil.java
│   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   └── SecurityConfig.java
│   │   │   ├── service/             # Business Logic
│   │   │   └── DwellDuoApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       ├── application-dev.yml
│   │       ├── application-prod.yml
│   │       └── db/migration/        # Flyway Migrations
│   └── test/                        # Unit & Integration Tests
├── docker-compose.yml
├── Dockerfile
└── pom.xml
```

---

## 🔄 Database Migrations

Migrations are managed by **Flyway** and run automatically on startup.

### Create New Migration
```bash
# Create new migration file in src/main/resources/db/migration/
# Naming convention: V{version}__{description}.sql
# Example: V8__add_user_status_column.sql
```

### Run Migrations Manually
```bash
./mvnw flyway:migrate
```

### Check Migration Status
```bash
./mvnw flyway:info
```

---

## 🧹 Code Quality

### Checkstyle
```bash
./mvnw checkstyle:check
```

### Format Code
```bash
./mvnw spotless:apply
```

---

## 📊 Monitoring & Health Checks

### Actuator Endpoints

- **Health:** `http://localhost:8080/actuator/health`
- **Info:** `http://localhost:8080/actuator/info`
- **Metrics:** `http://localhost:8080/actuator/metrics`

---

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# View PostgreSQL logs
docker logs dwellduo-postgres
```

### Redis Connection Issues
```bash
# Check if Redis is running
docker ps | grep redis

# Test Redis connection
redis-cli ping
```

### Application Logs
```bash
# View application logs
docker logs -f dwellduo-app

# Or check logs directory
tail -f logs/dwellduo.log
```

---

## 🚢 Production Deployment

### Build Production Image
```bash
docker build -t dwellduo-backend:latest .
```

### Deploy with Docker Compose
```bash
# Use production profile
SPRING_PROFILES_ACTIVE=prod docker-compose up -d
```

### Environment Configuration
Ensure all production environment variables are set:
- Strong JWT secret (min 256 bits)
- Secure database credentials
- Production Cloudinary credentials
- CORS origins for production frontend

---

## 📝 License

MIT License

---

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

For issues and questions, please open an issue on GitHub.



