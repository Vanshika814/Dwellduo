# 🚀 How to Run Backend & Frontend Correctly

## ⚠️ Important: You Need TWO Servers Running

Your app requires **two separate servers**:
1. **Backend** (Laravel) → Port 8000
2. **Frontend** (React/Vite) → Port 5173

---

## 📝 Step-by-Step Setup

### Terminal 1: Backend Server

```bash
cd /Users/vanshikaagarwal/Dwellduo/backend
php artisan serve
```

**Expected output:**
```
Starting Laravel development server: http://127.0.0.1:8000
```

**Keep this terminal running!** ✅

---

### Terminal 2: Frontend Server

```bash
cd /Users/vanshikaagarwal/Dwellduo/frontend
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Keep this terminal running too!** ✅

---

### Terminal 3: Queue Worker (Optional but Recommended)

```bash
cd /Users/vanshikaagarwal/Dwellduo/backend
php artisan queue:work
```

This processes background match calculations.

---

## 🌐 How to Access Your App

**✅ CORRECT:**
- Open browser to: `http://localhost:5173`
- This is your FRONTEND (React app)
- It will make API calls to backend at `http://127.0.0.1:8000`

**❌ WRONG:**
- Don't open `http://localhost:8000` in browser
- That's your BACKEND (API only, no UI)

---

## ✅ Verify Setup

### 1. Check Backend is Running

In browser, go to:
```
http://localhost:8000/api/game/questions
```

You should see JSON with questions (might ask for login first).

### 2. Check Frontend is Running

In browser, go to:
```
http://localhost:5173
```

You should see your beautiful Dwellduo homepage!

---

## 🔧 If Still Getting CORS Errors

### Clear Laravel Config Cache

```bash
cd backend
php artisan config:clear
php artisan cache:clear
```

### Restart Backend Server

Stop the server (Ctrl+C) and restart:
```bash
php artisan serve
```

---

## 🧪 Test the API (After Fixing CORS)

Now try in browser console **while on http://localhost:5173**:

```javascript
// Check game completion
fetch('http://localhost:8000/api/game/completion', {
  headers: { 
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Accept': 'application/json'
  }
}).then(r => r.json()).then(console.log)

// Get questions
fetch('http://localhost:8000/api/game/questions', {
  headers: { 
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Accept': 'application/json'
  }
}).then(r => r.json()).then(console.log)
```

---

## 📊 Quick Checklist

- [ ] Terminal 1: Backend running on port 8000
- [ ] Terminal 2: Frontend running on port 5173
- [ ] Browser open to: `http://localhost:5173`
- [ ] Logged in to the app
- [ ] No CORS errors in console

---

## 🎯 Common Issues & Solutions

### "Connection Refused"
**Problem:** Backend not running
**Solution:** Start backend server in Terminal 1

### "Cannot GET /"
**Problem:** Accessing backend URL directly
**Solution:** Use frontend URL (`localhost:5173`)

### CORS Errors
**Problem:** CORS config not updated
**Solution:** Run `php artisan config:clear` and restart backend

### "No matches found"
**Problem:** Haven't completed game yet
**Solution:** Go to `/game` and answer all 10 questions

---

## 🎉 You're Ready!

Once both servers are running:
1. Open `http://localhost:5173`
2. Login/Register
3. Complete profile
4. Play the game at `/game`
5. View matches at `/matches`

**All API calls will work automatically!** ✨

