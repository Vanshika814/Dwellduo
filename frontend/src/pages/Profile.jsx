import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import ImageUpload from "../components/ImageUpload";

export default function Profile() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    age: "",
    gender: "",
    phone: "",
    city: "",
    avatar_url: "",
    // Preferences
    budget: "",
    location_preference: "",
    gender_preference: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .get("/users/me")
      .then((res) => {
        if (!mounted) return;
        const data = res.data?.data || {};
        setForm({
          email: data.email || "",
          name: data.name || "",
          age: data.age ?? "",
          gender: data.gender || "",
          phone: data.phone || "",
          city: data.city || "",
          avatar_url: data.profileImage || "",
          budget: data.budget || "",
          location_preference: data.locationPreference || "",
          gender_preference: data.genderPreference || "",
        });
      })
      .catch(() => {
        if (mounted) setError("Could not load profile. Please try again.");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await api.put("/users/me", {
        email: form.email,
        name: form.name,
        age: form.age === "" ? null : Number(form.age),
        gender: form.gender || null,
        phone: form.phone,
        city: form.city,
        profileImage: form.avatar_url,
        budget: form.budget,
        locationPreference: form.location_preference,
        genderPreference: form.gender_preference || null,
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 422) {
        setError("Please check your inputs and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleImageUploadSuccess = (imageUrl) => {
    setForm((prev) => ({ ...prev, avatar_url: imageUrl }));
    setMessage("Profile picture uploaded successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  const inputBase =
    "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl rounded-3xl border border-white/70 bg-white/90 p-6 sm:p-10 shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-500">
              Profile
            </p>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">
              Build your roommate profile
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-md">
              Share who you are and how you live so we can match you with your ideal roommate.
            </p>
          </div>
          <ImageUpload
            currentImage={form.avatar_url}
            onUploadSuccess={handleImageUploadSuccess}
          />
        </div>

        {loading ? (
          <div className="text-center text-slate-500 py-12">Loading profile...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500 mt-1">Tell us about yourself</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-slate-500 mb-1">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="age" className="block text-xs font-medium text-slate-500 mb-1">
                    Age
                  </label>
                  <input
                    id="age"
                    name="age"
                    type="number"
                    value={form.age}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="24"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-xs font-medium text-slate-500 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-binary</option>
                    <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-slate-500 mb-1">
                    Phone
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-xs font-medium text-slate-500 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="Mumbai"
                  />
                </div>
              </div>
            </section>

            {/* Roommate Preferences */}
            <section>
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Roommate Preferences</h2>
                <p className="text-xs text-slate-500 mt-1">Help us find your ideal roommate</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="budget" className="block text-xs font-medium text-slate-500 mb-1">
                    Monthly Budget (₹)
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">Select budget range</option>
                    <option value="0-5000">₹0 - ₹5,000</option>
                    <option value="5000-10000">₹5,000 - ₹10,000</option>
                    <option value="10000-15000">₹10,000 - ₹15,000</option>
                    <option value="15000-20000">₹15,000 - ₹20,000</option>
                    <option value="20000-30000">₹20,000 - ₹30,000</option>
                    <option value="30000+">₹30,000+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="location_preference" className="block text-xs font-medium text-slate-500 mb-1">
                    Preferred Location
                  </label>
                  <input
                    id="location_preference"
                    name="location_preference"
                    type="text"
                    value={form.location_preference}
                    onChange={handleChange}
                    className={inputBase}
                    placeholder="e.g., South Mumbai, Bangalore North"
                  />
                </div>
                <div>
                  <label htmlFor="gender_preference" className="block text-xs font-medium text-slate-500 mb-1">
                    Roommate Gender Preference
                  </label>
                  <select
                    id="gender_preference"
                    name="gender_preference"
                    value={form.gender_preference}
                    onChange={handleChange}
                    className={inputBase}
                  >
                    <option value="">Select preference</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="any">No preference</option>
                  </select>
                </div>
              </div>
            </section>

            {(message || error) && (
              <div
                className={`rounded-md border px-4 py-3 text-sm ${
                  message
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}
              >
                {message || error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setForm({ 
                  name: "", age: "", gender: "", phone: "", city: "", avatar_url: "",
                  budget: "", location_preference: "", gender_preference: ""
                })}
                className="rounded-md border border-slate-200 px-4 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save profile"}
              </button>
            </div>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}

