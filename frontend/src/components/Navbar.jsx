import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-sky-600" : "text-slate-600 hover:text-slate-900"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 text-base font-medium transition-colors ${
      isActive
        ? "text-sky-600 bg-sky-50"
        : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full max-w-[100vw] box-border py-3 px-4">
      <div
          className={`mx-auto max-w-7xl border shadow-sm bg-white/85 backdrop-blur-sm ${
            isMobileMenuOpen ? "rounded-xl md:rounded-full" : "rounded-full"
          }`}
        >
        <div className="flex min-w-0 items-center justify-between h-16 px-4 sm:px-6">
          {/* Left: brand */}
          <NavLink to="/" className="flex min-w-0 shrink-0 items-center gap-2 z-10">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-white">
              DD
            </span>
            <span className="text-lg font-semibold text-slate-900">
              Dwell Duo
            </span>
          </NavLink>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
                <NavLink to="/preferences" className={navLinkClass}>
                  Preferences
                </NavLink>
                <NavLink to="/game" className={navLinkClass}>
                  Game
                </NavLink>
                <NavLink to="/matches" className={navLinkClass}>
                  Matches
                </NavLink>
                <NavLink to="/chat" className={navLinkClass}>
                  Chat
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
                <NavLink to="/login" className={navLinkClass}>
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

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 border-t border-slate-200">
            <NavLink
              to="/"
              className={mobileNavLinkClass}
              onClick={closeMobileMenu}
            >
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/profile"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/preferences"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Preferences
                </NavLink>
                <NavLink
                  to="/game"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Game
                </NavLink>
                <NavLink
                  to="/matches"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Matches
                </NavLink>
                <NavLink
                  to="/chat"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Chat
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={mobileNavLinkClass}
                  onClick={closeMobileMenu}
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  onClick={closeMobileMenu}
                  className="block mx-4 my-2 text-center rounded-lg bg-sky-500 px-4 py-3 text-base font-medium text-white hover:bg-sky-600 transition-colors"
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


