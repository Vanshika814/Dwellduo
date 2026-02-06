import { NavLink, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const handleLogout = () => {
    // JWT is stateless, so we just remove tokens from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full my-3">
      <div className="mx-auto max-w-7xl px-1 sm:px-6 lg:px-8 border rounded-full shadow-md">
        <div className="flex items-center justify-between h-16">
          {/* Left: brand */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-white">
              DD
            </span>
            <span className="text-lg font-semibold text-slate-900">
              Dwell Duo
            </span>
          </NavLink>

          {/* Right: navigation links */}
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-sky-600"
                    : "text-slate-600 hover:text-slate-900"
                }`
              }
            >
              Home
            </NavLink>
            {hasToken ? (
              <>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-sky-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`
                  }
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/preferences"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-sky-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`
                  }
                >
                  Preferences
                </NavLink>
                <NavLink
                  to="/game"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-sky-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`
                  }
                >
                  Game
                </NavLink>
                <NavLink
                  to="/matches"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-sky-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`
                  }
                >
                  Matches
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-sky-600"
                        : "text-slate-600 hover:text-slate-900"
                    }`
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 transition-colors"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}


