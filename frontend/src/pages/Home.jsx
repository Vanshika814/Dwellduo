import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("token");

  const customers = [
    { name: "Aarav", city: "Delhi", img: "https://i.pravatar.cc/100?img=12" },
    { name: "Kiara", city: "Mumbai", img: "https://i.pravatar.cc/100?img=32" },
    { name: "Rohan", city: "Bangalore", img: "https://i.pravatar.cc/100?img=22" },
    { name: "Ananya", city: "Pune", img: "https://i.pravatar.cc/100?img=45" },
    { name: "Dev", city: "Hyderabad", img: "https://i.pravatar.cc/100?img=5" },
  ];

  return (
    <div className="relative bg-slate-50 text-slate-900">
      {/* Top gradient behind navbar & hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-pink-300 via-orange-200/60 to-transparent -z-10" />

      <Navbar />

      {/* Hero section - full viewport height */}
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full grid gap-10 md:grid-cols-2 items-center">
          {/* Text content */}
          <div className="space-y-6">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sky-500">
              Dwell Duo
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
              Find Your Perfect Roommate
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-md">
              Smart matchmaking based on compatibility, lifestyle, and preferences.
              Discover roommates that feel less like strangers and more like friends.
            </p>

            {!hasToken && (
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-violet-300 bg-white/70 px-6 py-2.5 text-sm font-medium text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
          {/* Illustration / placeholder */}
          <div className="relative">
            <div className="mx-auto max-h-full w-64 md:h-72 md:w-72 rounded-3xl bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 shadow-2xl flex items-center justify-center">
              <div className="h-40 w-40 rounded-2xl bg-white/90 backdrop-blur-sm border border-white/60 flex flex-col items-center justify-center space-y-2">
                <div className="flex -space-x-3">
                  <span className="h-8 w-8 rounded-full bg-sky-200 border border-white" />
                  <span className="h-8 w-8 rounded-full bg-violet-200 border border-white" />
                  <span className="h-8 w-8 rounded-full bg-fuchsia-200 border border-white" />
                </div>
                <p className="text-xs font-medium text-slate-700">
                  Compatible matches
                </p>
                <p className="text-[11px] text-slate-500">
                  Lifestyle • Budget • Location
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Moving customer carousel - visible on scroll */}
      <section className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-md">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 mb-3">
            Roomies who love Dwell Duo
          </p>
          <div className="relative overflow-hidden">
            <div className="customer-carousel-track gap-4">
              {[...customers, ...customers].map((person, idx) => (
                <div
                  key={`${person.name}-${idx}`}
                  className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                    <img
                      src={person.img}
                      alt={person.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-900">
                      {person.name}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {person.city}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

