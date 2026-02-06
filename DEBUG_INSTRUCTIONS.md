# 🔍 Debug Frontend-Backend Connection

## Step 1: Check if you're logged in

Open browser console at `http://localhost:5173` and run:

```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('token'));

// If token exists, test the API
if (localStorage.getItem('token')) {
  fetch('http://127.0.0.1:8000/api/matching/suggestions?page=1&per_page=20', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
      'Accept': 'application/json'
    }
  })
  .then(r => r.json())
  .then(data => {
    console.log('✅ API Response:', data);
    if (data.success) {
      console.log('✅ Matches found:', data.matches.length);
    } else {
      console.log('❌ Error:', data.message);
    }
  })
  .catch(err => console.error('❌ Network error:', err));
} else {
  console.log('❌ Not logged in! Go to /login');
}
```

## Step 2: Expected Results

### If you see matches:
```javascript
✅ API Response: {success: true, matches: Array(4), pagination: {...}}
✅ Matches found: 4
```
**Solution:** Refresh the `/matches` page

### If token is null:
```javascript
❌ Not logged in! Go to /login
```
**Solution:** 
1. Go to `http://localhost:5173/login`
2. Login with: `vanshikaagarwal781@gmail.com`
3. Go back to `/matches`

### If you see "Unauthenticated":
```javascript
❌ Error: Unauthenticated
```
**Solution:** Token expired, logout and login again

### If you see "No matches found":
```javascript
❌ Error: No matches found. Please generate matches first.
```
**Solution:** Run in console:
```javascript
fetch('http://127.0.0.1:8000/api/matching/generate', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token'),
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => {
  console.log('✅ Generated:', data);
  // Then refresh /matches page
});
```

## Step 3: Verify Backend Data

If still no matches, run in Laravel:
```bash
cd backend
php artisan tinker
```

```php
$user = App\Models\User::where('email', 'vanshikaagarwal781@gmail.com')->first();
echo "Matches: " . App\Models\UserMatch::where('user1_id', $user->id)->count();
```

Expected: `Matches: 4`

## Common Issues

1. **Wrong port:** Backend should be on `8000`, frontend on `5173`
2. **Not logged in:** Go to `/login` first
3. **Token expired:** Logout and login again
4. **Wrong user:** Check which user you're logged in as
5. **Cache issue:** Clear browser cache and refresh

## Quick Fix

If all else fails, restart both servers:

**Terminal 1 (Backend):**
```bash
cd backend
php artisan serve
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Then:
1. Go to `http://localhost:5173/login`
2. Login
3. Go to `/matches`
4. Click "Generate Matches" button

