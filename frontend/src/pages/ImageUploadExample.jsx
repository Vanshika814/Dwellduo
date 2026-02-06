import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

/**
 * Standalone Image Upload Example Page
 * This demonstrates how to use the upload API directly without the ImageUpload component
 */
export default function ImageUploadExample() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) {
      setError("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setUploadedUrl(response.data.imageUrl);
        console.log("Uploaded Image URL:", response.data.imageUrl);
        console.log("Public ID:", response.data.publicId);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPreview(null);
    setUploadedUrl("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-500">
              Test Upload
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
              Image Upload Example
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Upload images to Cloudinary using your backend API
            </p>
          </div>

          <div className="space-y-6">
            {/* File Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                disabled={loading}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-sky-50 file:text-sky-700
                  hover:file:bg-sky-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Preview */}
            {preview && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Preview
                </label>
                <div className="rounded-lg border-2 border-dashed border-slate-200 p-4 bg-slate-50">
                  <img
                    src={preview}
                    alt="Preview"
                    className="mx-auto max-h-64 rounded-lg shadow-md"
                  />
                </div>
              </div>
            )}

            {/* Uploaded Image */}
            {uploadedUrl && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">
                  Uploaded Image
                </label>
                <div className="rounded-lg border-2 border-green-200 p-4 bg-green-50">
                  <img
                    src={uploadedUrl}
                    alt="Uploaded"
                    className="mx-auto max-h-64 rounded-lg shadow-md mb-3"
                  />
                  <div className="bg-white rounded-md p-3 break-all">
                    <p className="text-xs font-mono text-slate-600">
                      {uploadedUrl}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={!image || loading}
                className="flex-1 rounded-md bg-sky-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Uploading..." : "Upload Image"}
              </button>
              <button
                onClick={handleReset}
                disabled={loading}
                className="rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Info */}
            <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                📝 Upload Requirements
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Maximum file size: 5MB</li>
                <li>• Accepted formats: JPEG, PNG, GIF</li>
                <li>• Images are uploaded to Cloudinary</li>
                <li>• Authentication required (Sanctum token)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

