import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/register", form);
      const token = response?.data?.token;
      if (token) {
        localStorage.setItem("token", token);
      }
      alert("Registered successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      if (error.response?.status === 422) {
        console.log("Validation errors:", error.response.data.errors);
        alert("Please check your form inputs (password match, email uniqueness, etc.).");
      } else {
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-white to-sky-50 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 border border-slate-200 rounded-2xl shadow-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2 text-center">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-500 mb-6 text-center">
            Join Dwell Duo and find your ideal roommate match.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-xs font-medium text-slate-600 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                required
                value={form.password_confirmation}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-sky-400 hover:text-sky-300"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}



