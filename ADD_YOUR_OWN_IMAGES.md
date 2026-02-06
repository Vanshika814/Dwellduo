# 🖼️ How to Add Your Own Images to Game Options

## Option 1: Upload to Cloudinary (Recommended) ✅

### Step 1: Upload Images to Cloudinary

1. Go to your Cloudinary dashboard: https://cloudinary.com/console
2. Click "Media Library" → "Upload"
3. Upload your images (name them descriptively):
   - `clean-spotless.jpg`
   - `clean-moderate.jpg`
   - `clean-messy.jpg`
   - `sleep-early-bird.jpg`
   - `sleep-night-owl.jpg`
   - etc.

### Step 2: Get Image URLs

After upload, right-click on each image → "Copy URL"

You'll get URLs like:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/clean-spotless.jpg
```

### Step 3: Update GameQuestionSeeder.php

```php
'options' => [
    [
        'text' => 'Spotless - everything has its place',
        'image' => 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/clean-spotless.jpg'
    ],
    [
        'text' => 'Clean but lived-in',
        'image' => 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/v1234567890/clean-moderate.jpg'
    ],
    // ... more options
]
```

### Step 4: Reseed Database

```bash
cd backend
php artisan tinker
```

```php
// Delete old questions and answers
App\Models\UserGameAnswer::query()->delete();
App\Models\GameQuestion::query()->delete();
exit
```

```bash
php artisan db:seed --class=GameQuestionSeeder
```

---

## Option 2: Use Public/Storage Directory

### Step 1: Add Images to Laravel

```bash
cd backend/public
mkdir game-images
```

Copy your images to `backend/public/game-images/`:
- `backend/public/game-images/clean-spotless.jpg`
- `backend/public/game-images/clean-moderate.jpg`
- etc.

### Step 2: Update GameQuestionSeeder.php

```php
'options' => [
    [
        'text' => 'Spotless - everything has its place',
        'image' => 'http://localhost:8000/game-images/clean-spotless.jpg'
    ],
    // ... more options
]
```

### Step 3: Reseed (same as Option 1 Step 4)

---

## Option 3: Use External URLs (Imgur, etc.)

1. Upload images to Imgur, Google Drive (public), or any image host
2. Get public URLs
3. Use those URLs in the seeder

---

## 🎨 Visual Design (Text Over Image)

### Current Design:

```
┌─────────────────────────────┐
│  [✓]  ← Checkmark (top-right)
│  ┌─────────────────────────┐│
│  │                         ││
│  │      YOUR IMAGE         ││
│  │       (hover zoom)      ││
│  │                         ││
│  │    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     ││ ← Dark gradient
│  │  ▓▓ TEXT OVERLAY ▓▓    ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

### Features:
- ✅ Image fills entire card
- ✅ Dark gradient overlay at bottom (for readability)
- ✅ White text overlaid on gradient
- ✅ Hover zooms image
- ✅ Selected shows blue border + checkmark

---

## 📸 Image Recommendations

### Size:
- **Width:** 300-600px
- **Height:** 320-400px
- **Ratio:** 3:4 or 4:3 works best

### Format:
- **JPG** for photos
- **PNG** for graphics/illustrations
- **WebP** for best compression (modern browsers)

### Tips:
1. Use high-quality images (but not too large - keep under 500KB)
2. Choose images with clear subjects
3. Avoid images with too much text already
4. Make sure images are well-lit (dark overlay will darken further)

---

## 🚀 Quick Start (Use Your Own Images)

### Fastest Way:

1. **Upload 30 images to Cloudinary** (10 questions × 3 options)
2. **Name them clearly:**
   ```
   q1-option1.jpg  (Question 1, Option 1)
   q1-option2.jpg  (Question 1, Option 2)
   q1-option3.jpg  (Question 1, Option 3)
   q2-option1.jpg  (Question 2, Option 1)
   ...
   q10-option3.jpg (Question 10, Option 3)
   ```

3. **Copy this template** into `GameQuestionSeeder.php`:

```php
[
    'question_text' => 'Your question here',
    'options' => [
        [
            'text' => 'Option 1 text',
            'image' => 'YOUR_CLOUDINARY_URL_HERE'
        ],
        [
            'text' => 'Option 2 text',
            'image' => 'YOUR_CLOUDINARY_URL_HERE'
        ],
        [
            'text' => 'Option 3 text',
            'image' => 'YOUR_CLOUDINARY_URL_HERE'
        ]
    ],
    'weight' => 5,
    'constraint_type' => 'soft',
    'category' => 'lifestyle',
    'order' => 1,
],
```

4. **Reseed:**
```bash
cd backend
php artisan db:seed --class=GameQuestionSeeder
```

5. **Refresh the game page** → See your images! 🎉

---

## 🎨 Customize Text Overlay Style

If you want to change the text overlay appearance, edit `frontend/src/pages/Game.jsx`:

### Current Style:
```jsx
{/* Dark Gradient Overlay */}
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

{/* White Text at Bottom */}
<div className="absolute inset-0 flex items-end justify-center p-6">
  <p className="text-xl font-bold text-white text-center">
    {optionText}
  </p>
</div>
```

### Alternative Styles:

#### Centered Text:
```jsx
<div className="absolute inset-0 flex items-center justify-center p-6">
  <p className="text-2xl font-bold text-white text-center bg-black/50 px-6 py-3 rounded-xl">
    {optionText}
  </p>
</div>
```

#### Top Text with Solid Background:
```jsx
<div className="absolute top-0 left-0 right-0 bg-black/60 p-4">
  <p className="text-lg font-bold text-white text-center">
    {optionText}
  </p>
</div>
```

---

**Now you can use your own images with text beautifully overlaid! 🎨✨**

