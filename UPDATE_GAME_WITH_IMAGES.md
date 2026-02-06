# 🎨 Update Game Questions with Images

## What Changed:

### Backend:
1. **GameQuestionSeeder.php** - Updated `options` to include images:
   ```php
   'options' => [
       ['text' => 'Option 1', 'image' => 'https://...'],
       ['text' => 'Option 2', 'image' => 'https://...'],
       ['text' => 'Option 3', 'image' => 'https://...']
   ]
   ```

2. **No migration needed** - The `options` column is already JSON, so it can store objects.

### Frontend:
1. **Game.jsx** - Updated to display images in option cards:
   - Shows image at the top of the card
   - Text below the image
   - Hover effect zooms the image
   - Backwards compatible (works with old string format too)

## Steps to Apply:

### 1. Reseed Database

```bash
cd backend
php artisan db:seed --class=GameQuestionSeeder
```

This will update the `game_questions` table with image-enabled options.

### 2. Clear Existing Game Answers (Optional)

If you want users to retake the game:

```bash
php artisan tinker
```

```php
// Delete all user answers
App\Models\UserGameAnswer::truncate();

// Clear all matches
App\Models\UserMatch::truncate();

echo "✅ Cleared all game answers and matches. Users can now retake the game!";
exit
```

### 3. Test

1. Go to `http://localhost:5173/game`
2. You should now see beautiful image cards for each option!
3. Select options and complete the game

## Image Sources:

All images are from Unsplash (free to use):
- Clean room images for cleanliness question
- Bedroom images for sleep schedule
- Party images for social preferences
- Kitchen images for cooking habits
- Pet images for pet preferences
- Money/calculator images for expenses
- Office/desk images for work schedule
- Friends images for social time

## Customization:

To change images, edit `backend/database/seeders/GameQuestionSeeder.php`:

```php
'options' => [
    [
        'text' => 'Your option text',
        'image' => 'YOUR_IMAGE_URL_HERE'  // Change this!
    ],
]
```

Then reseed: `php artisan db:seed --class=GameQuestionSeeder`

## Note:

- The matching algorithm still works the same way (compares option indices)
- Old answers (with string options) will still work
- New format: `{text: "...", image: "..."}`
- Old format: `"just a string"` (backwards compatible)

