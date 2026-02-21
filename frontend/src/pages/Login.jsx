import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { fetchUserProfile, setAuth } from "../store/slices/authSlice";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login", form);
      const { accessToken, refreshToken } = response?.data?.data || {};
      if (accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Immediately update auth state so Navbar reacts without refresh
        dispatch(setAuth(true));
        dispatch(fetchUserProfile());
      }
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-28 pb-12">
        <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-white/90 border border-slate-200 rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-2xl font-semibold mb-2 text-center text-slate-900">
          Login
        </h1>

        <div>
          <label className="block text-sm mb-1 text-slate-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-slate-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-2 inline-flex items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Login
        </button>
      </form>
      </div>
    </div>
  );
}


