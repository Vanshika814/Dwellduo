# 🔧 Install Required Software

You need to install **Maven** and **Redis** first. Here's how:

---

## Step 1: Install Homebrew (if you don't have it)

```bash
# Check if you have Homebrew
brew --version

# If not installed, install it:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

## Step 2: Install Maven

```bash
# Install Maven
brew install maven

# Verify installation
mvn --version
# Should show: Apache Maven 3.x.x
```

---

## Step 3: Install Redis

```bash
# Install Redis
brew install redis

# Start Redis
brew services start redis

# Verify it's running
redis-cli ping
# Should return: PONG
```

---

## Step 4: Verify Everything

```bash
# Check Java (you should already have this)
java -version
# Should show: version "17" or higher

# Check Maven
mvn --version
# Should show: Apache Maven 3.x.x

# Check Node
node --version
# Should show: v18.x.x or higher

# Check MySQL
mysql --version
# Should show: mysql  Ver 8.x.x

# Check Redis
redis-cli ping
# Should return: PONG
```

---

## Step 5: Generate Maven Wrapper

```bash
cd /Users/vanshikaagarwal/Dwellduo/backend-java

# Generate Maven wrapper (this creates ./mvnw)
mvn -N wrapper:wrapper

# Now you can use ./mvnw
./mvnw --version
```

---

## Alternative: Use Maven Directly

If you don't want to generate the wrapper, you can use `mvn` directly:

```bash
# Instead of: ./mvnw spring-boot:run
# Use: mvn spring-boot:run

cd /Users/vanshikaagarwal/Dwellduo/backend-java
mvn spring-boot:run
```

---

## Alternative: Use IntelliJ IDEA

If you have IntelliJ IDEA installed:

1. Open IntelliJ IDEA
2. File → Open → Select `backend-java` folder
3. Wait for Maven to sync
4. Right-click on `DwellDuoApplication.java`
5. Click "Run 'DwellDuoApplication'"

---

## ✅ Once Installed, Run:

```bash
# Terminal 1: Backend
cd /Users/vanshikaagarwal/Dwellduo/backend-java
mvn spring-boot:run

# Terminal 2: Frontend
cd /Users/vanshikaagarwal/Dwellduo/frontend
npm run dev
```

---

## Quick Install Script (All at Once)

```bash
# Install everything
brew install maven redis

# Start Redis
brew services start redis

# Verify
mvn --version
redis-cli ping

# Generate Maven wrapper
cd /Users/vanshikaagarwal/Dwellduo/backend-java
mvn -N wrapper:wrapper
```



