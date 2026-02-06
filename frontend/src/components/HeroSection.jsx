import { Link } from "react-router-dom";
import { motion } from "framer-motion";
export default function HeroSection() {
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

    const Floating = ({ children, className, delay = 0 }) => (
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
          className={className}
        >
          {children}
        </motion.div>
      );
      

  return (
    <div>
        
      <section className="min-h-screen flex justify-center items-start px-4 py-24">
        <div className="max-w-5xl w-full grid gap-10 md:grid-cols-2 items-center py-11">
          {/* Text content */}
          <div className="space-y-5">
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
            <div className=" h-[550px] w-[550px] rounded-full border-[2px] border-[#8FB9A8]/20 blur-[0.4px] flex items-center justify-center">
                <div className="h-[400px] w-[400px] rounded-full border-[2px] border-[#8FB9A8]/40 blur-[0.3px] flex items-center justify-center">
                    <div className="h-[250px] w-[250px] rounded-full border-[2px] border-[#8FB9A8]/60 blur-[0.4px]"/>
                </div>
            </div>
            {/* Radial fade overlay */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.7),transparent_65%)]" />
            <div className="absolute inset-0 z-10">
                {/* Floating circle */}
                <div className="absolute top-1/2 right-0 -translate-y-1/2" delay={0}>
                <div className="h-14 w-14 rounded-full border-[4px] border-white bg-white shadow-xl shadow-[#819288]/50">
                <img src={'/heropic3.jpeg'} className="h-full w-full object-cover rounded-full"></img>
                </div>
                </div>

                <div className="absolute top-10 left-1/2 -translate-x-1/2" delay={0}>
                <div className="h-16 w-16 rounded-full border-[4px] border-white shadow-xl shadow-[#819288]/50">
                    <img src={'/heropic5.jpeg'} className="h-full w-full object-cover rounded-full"></img>
                </div>
                </div>
                <div className="absolute top-48 left-1/2 -translate-x-1/2 z-10">
                    <div className="h-2 w-2 rounded-full border-white bg-white shadow-2xl shadow-[#263d30]/50" />
                </div>
                <div className="relative max-w-xs translate-y-52 translate-x-28">
                <div className="relative rounded-3xl bg-gradient-to-br from-[#7FB89C] to-[#3F6F5A] p-6 text-white shadow-[0_20px_40px_rgba(0,0,0,0.25)] rotate-[-3deg]">
                    <p className="text-sm text-wrap leading-relaxed opacity-90">
                    I'm passionate about sharing not just the drinks, but the journey.
                    </p>

                    <p className="mt-4 text-sm leading-relaxed opacity-90">
                    I get to connect with you, share the wins and challenges, 
                    </p>

                </div>
                </div>


            </div>



            {/* <div className="mx-auto w-64 md:h-72 md:w-72 rounded-3xl bg-gradient-to-br from-sky-400 via-violet-500 to-fuchsia-500 shadow-2xl flex items-center justify-center">
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
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
}