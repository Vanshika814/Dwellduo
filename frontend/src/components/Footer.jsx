import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full border-t border-slate-200 bg-white mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500 text-sm font-bold text-white">
                DD
              </span>
              <span className="text-xl font-semibold text-slate-900">
                Dwell Duo
              </span>
            </Link>
            <p className="text-sm text-slate-600 max-w-xs">
              Find your perfect roommate match. Connect with people who share your lifestyle, interests, and values.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="#"
                className="text-slate-400 hover:text-sky-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-sky-500 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/matches"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  Find Matches
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/preferences"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  Preferences
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  Safety Tips
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <a
                  href="mailto:support@dwellduo.com"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  support@dwellduo.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <a
                  href="tel:+911234567890"
                  className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
                >
                  +91 123 456 7890
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-600">
                  India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-600">
              © {new Date().getFullYear()} Dwell Duo. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-slate-600 hover:text-sky-600 transition-colors"
              >
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

