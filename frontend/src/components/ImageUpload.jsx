import { useState } from "react";
import api from "../services/api";

export default function ImageUpload({ currentImage, onUploadSuccess, className = "" }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setUploading(true);
      setError("");

      // Use axios but with FormData headers
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const imageUrl = response.data.data.imageUrl;  // ✅ Fixed: data.data.imageUrl
        
        // Call parent callback with the uploaded image URL
        if (onUploadSuccess) {
          onUploadSuccess(imageUrl);
        }

        // Reset state
        setImage(null);
        setPreview(null);
        setError("");
      }
    } catch (err) {
      console.error("Upload error:", err);
      if (err.response?.status === 422) {
        setError(err.response.data.message || "Invalid image file");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Upload failed. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setImage(null);
    setPreview(null);
    setError("");
  };

  const displayImage = preview || currentImage;

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Image Preview */}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 rounded-full border-2 border-white bg-gradient-to-br from-sky-300 via-violet-300 to-fuchsia-300 shadow-lg overflow-hidden">
          {displayImage ? (
            <img
              src={displayImage}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white text-2xl font-semibold">
              ?
            </div>
          )}
        </div>

        <div className="flex-1">
          <label
            htmlFor="image-upload"
            className="inline-block cursor-pointer rounded-md border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 focus-within:ring-2 focus-within:ring-sky-200 transition-colors"
          >
            {image ? "Change Image" : "Choose Image"}
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              disabled={uploading}
            />
          </label>
          
          {image && (
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="rounded-md bg-sky-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
              <button
                onClick={handleCancel}
                disabled={uploading}
                className="rounded-md border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Info Text */}
      {!image && (
        <p className="text-xs text-slate-400">
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Success Indicator */}
      {!image && !error && preview === null && currentImage && (
        <div className="text-xs text-green-600 flex items-center gap-1">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Profile picture uploaded
        </div>
      )}
    </div>
  );
}

