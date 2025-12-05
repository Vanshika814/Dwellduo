import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      navigate("/login");
    }
  };

  if (!hasToken) return null;

  return (
    <nav className="w-full bg-transparent pt-4">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between rounded-full bg-white/85 px-4 py-2 shadow-md border border-slate-200">
          {/* Left: brand */}
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-xs font-semibold text-white">
              DD
            </span>
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Dwell Duo
            </span>
          </div>

          {/* Right: simple rounded nav */}
          <div className="flex items-center gap-3 text-xs">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Profile
            </NavLink>
            <NavLink
              to="/preferences"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Preferences
            </NavLink>
            <NavLink
              to="/game"
              className={({ isActive }) =>
                `px-3 py-1 rounded-full font-medium transition-colors ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              Game
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1 rounded-full bg-red-500 text-[11px] font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


