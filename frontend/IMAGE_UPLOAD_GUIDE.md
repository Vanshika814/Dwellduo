# Frontend Image Upload Integration Guide

This guide explains how to use the Cloudinary image upload feature in your React frontend.

## 🎯 What's Been Implemented

### 1. **ImageUpload Component** (`src/components/ImageUpload.jsx`)

A reusable component that handles image uploads with a beautiful UI matching your design system.

**Features:**
- ✅ File validation (type & size)
- ✅ Live preview before upload
- ✅ Progress indication
- ✅ Error handling
- ✅ Success callbacks
- ✅ Matches your existing design system

**Usage:**

```jsx
import ImageUpload from "../components/ImageUpload";

function MyComponent() {
  const [avatarUrl, setAvatarUrl] = useState("");

  const handleUploadSuccess = (imageUrl) => {
    setAvatarUrl(imageUrl);
    console.log("Image uploaded:", imageUrl);
  };

  return (
    <ImageUpload
      currentImage={avatarUrl}
      onUploadSuccess={handleUploadSuccess}
    />
  );
}
```

### 2. **Profile Page Integration**

The `ImageUpload` component has been integrated into your Profile page (`src/pages/Profile.jsx`):

- Replaces the manual avatar URL input
- Automatically updates the `avatar_url` field when upload succeeds
- Shows success message after upload
- Maintains all existing profile functionality

### 3. **Standalone Example Page** (`src/pages/ImageUploadExample.jsx`)

A test page at `/upload-test` that demonstrates:
- Direct API usage
- Upload flow
- Error handling
- Preview functionality

**Access it at:** `http://localhost:5173/upload-test` (requires authentication)

## 📦 Component Props

### ImageUpload Component

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `currentImage` | string | No | URL of the current/existing image |
| `onUploadSuccess` | function | No | Callback fired with the uploaded image URL |
| `className` | string | No | Additional CSS classes |

**Example:**

```jsx
<ImageUpload
  currentImage={user.avatar_url}
  onUploadSuccess={(url) => updateUserAvatar(url)}
  className="my-4"
/>
```

## 🔧 How It Works

### Upload Flow

1. **User selects image** → File validation (type, size)
2. **Preview shown** → User sees what will be uploaded
3. **User clicks Upload** → FormData sent to `/api/upload`
4. **Backend processes** → Uploads to Cloudinary
5. **Success callback** → Parent component receives image URL

### API Integration

The component uses your existing `api` service (`src/services/api.js`):

```javascript
import api from "../services/api";

// Upload request
const response = await api.post("/upload", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Response format
{
  success: true,
  imageUrl: "https://res.cloudinary.com/...",
  publicId: "profile_images/abc123"
}
```

### Authentication

- Uses your existing Sanctum token from `localStorage`
- Automatically attached via axios interceptor
- No additional auth setup needed

## 🎨 Styling

The component matches your existing design system:
- Tailwind CSS classes
- Gradient backgrounds (sky → violet → fuchsia)
- Consistent spacing and typography
- Responsive design
- Hover and focus states

## 📝 Validation Rules

### Client-Side
- ✅ File must be an image
- ✅ Max size: 5MB
- ✅ Shows user-friendly error messages

### Server-Side (Laravel)
- ✅ Required field validation
- ✅ File type: jpeg, png, jpg, gif
- ✅ Max size: 5120 KB (5MB)
- ✅ Returns validation errors

## 🚀 Usage Examples

### Example 1: Simple Upload

```jsx
import { useState } from "react";
import ImageUpload from "../components/ImageUpload";

function UserProfile() {
  const [profilePic, setProfilePic] = useState("");

  return (
    <div>
      <h2>Upload Profile Picture</h2>
      <ImageUpload
        currentImage={profilePic}
        onUploadSuccess={setProfilePic}
      />
      {profilePic && <p>Current: {profilePic}</p>}
    </div>
  );
}
```

### Example 2: With Form Integration

```jsx
function ProfileForm() {
  const [form, setForm] = useState({
    name: "",
    avatar_url: "",
  });

  const handleImageUpload = (imageUrl) => {
    setForm(prev => ({ ...prev, avatar_url: imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put("/profile", form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <ImageUpload
        currentImage={form.avatar_url}
        onUploadSuccess={handleImageUpload}
      />
      <input
        name="name"
        value={form.name}
        onChange={(e) => setForm(prev => ({
          ...prev,
          name: e.target.value
        }))}
      />
      <button type="submit">Save</button>
    </form>
  );
}
```

### Example 3: Direct API Call (Without Component)

```jsx
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    if (response.data.success) {
      return response.data.imageUrl;
    }
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
};

// Usage
const handleFileChange = async (e) => {
  const file = e.target.files[0];
  const url = await uploadImage(file);
  console.log("Uploaded to:", url);
};
```

## 🐛 Error Handling

The component handles various error scenarios:

```jsx
// Validation errors (422)
{
  success: false,
  message: "Validation failed",
  errors: {
    image: ["The image must be a file of type: jpeg, png, jpg, gif."]
  }
}

// Server errors (500)
{
  success: false,
  message: "Image upload failed",
  error: "Error details..."
}

// Network errors
// Handled by catch block with user-friendly message
```

## 🔐 Security

- ✅ Authentication required (Sanctum token)
- ✅ File type validation (client + server)
- ✅ File size limits (5MB)
- ✅ Secure HTTPS upload to Cloudinary
- ✅ No direct Cloudinary credentials in frontend

## 📱 Testing

### Test the Integration

1. **Start your backend:**
   ```bash
   cd backend
   php artisan serve
   ```

2. **Start your frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test the Profile page:**
   - Navigate to `/profile`
   - Click "Choose Image"
   - Select an image
   - Click "Upload"
   - See the uploaded image URL in the avatar

4. **Test the example page:**
   - Navigate to `/upload-test`
   - Follow the upload flow
   - See detailed upload information

### Manual API Test (Postman/cURL)

```bash
curl -X POST http://localhost:8000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## 🎯 Next Steps

1. ✅ **Set up Cloudinary credentials** in backend `.env`
2. ✅ **Test the upload** on the Profile page
3. ✅ **Customize styling** if needed
4. ✅ **Add to other pages** where image upload is needed

## 💡 Tips

- The uploaded image URL is automatically saved when you click "Save profile"
- You can reuse the `ImageUpload` component anywhere in your app
- The component is fully controlled - you manage the state
- Preview uses `URL.createObjectURL()` for instant feedback
- Cleanup is automatic (no memory leaks)

## 🔗 Related Files

```
frontend/
├── src/
│   ├── components/
│   │   └── ImageUpload.jsx          # Reusable upload component
│   ├── pages/
│   │   ├── Profile.jsx              # Integrated example
│   │   └── ImageUploadExample.jsx   # Standalone test page
│   ├── services/
│   │   └── api.js                   # Axios instance with auth
│   └── App.jsx                      # Routes (includes /upload-test)
```

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Verify Cloudinary credentials in backend `.env`
3. Ensure backend server is running
4. Check authentication token is valid
5. Review network tab for API responses

