import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import LocationSearch from "./LocationSearch";
export default function HeroSection() {
  const navigate = useNavigate();
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");
      const AnimatedLeaf = ({ src, className, style }) => (
        <motion.img
          src={src}
          alt="leaf"
          className={className}
          style={{ transformOrigin: "bottom center", ...style }}
          animate={{
            rotate: [-3, 3, -3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      );
      
  return (
    <div className="overflow-x-hidden">
      <section className="min-h-screen flex justify-center items-start px-4 sm:px-6 pt-24 sm:pt-28 pb-12 bg-[#FAFAFA]">
        <div className="max-w-6xl w-full grid grid-cols-1 gap-8 sm:gap-10 md:gap-14 md:grid-cols-2 items-center pt-6 sm:pt-11">
          {/* Text content */}
          <div className="space-y-4 sm:space-y-5 order-2 md:order-1 flex flex-col items-center text-center md:items-start md:text-left">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-sky-500">
              Dwell Duo
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#565656] leading-tight">
              Find Your Perfect Roommate
            </h1>
            <p className="text-sm md:text-base text-slate-600 max-w-md w-full">
              Smart matchmaking based on compatibility, lifestyle, and preferences.
              Discover roommates that feel less like strangers and more like friends.
            </p>

            {/* Search Bar - only for logged-in users */}
            {hasToken && (
              <div className="w-full max-w-md md:max-w-none">
                <LocationSearch
                  placeholder="Select your city..."
                  onSelect={(location) =>
                    navigate(
                      `/matches?mode=location&lat=${location.lat}&lng=${location.lng}&radius=10000`
                    )
                  }
                />
              </div>
            )}
            {!hasToken && (
              <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-[#969736] px-5 py-2.5 sm:px-6 text-sm font-medium text-white shadow-sm hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-violet-300 bg-white/70 px-5 py-2.5 sm:px-6 text-sm font-medium text-violet-700 hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-300"
                >
                  Login
                </Link>
              </div>
            )}
          </div>
          {/* Illustration — smallimage on mobile, full illustration on md+ */}
          <div className="relative order-1 md:order-2 w-full max-w-md mx-auto md:max-w-none md:mx-0 min-h-[280px] sm:min-h-[320px] md:min-h-0 overflow-hidden z-0">
            <img src={'/smallimage.png'} alt="Roommate match" className="block md:hidden w-full max-w-[88%] mx-auto h-auto min-h-[220px] sm:min-h-[260px] object-contain z-0" />
            <img src={'/door.png'} className="hidden md:block h-full w-full object-cover z-0" alt="Roommate match" />
            <img src={'/railing.png'} alt="" className="hidden md:block absolute top-[103px] right-8 h-[398px] w-[850px] translate-x-12 object-cover z-40" />
            <img src={'/person1.png'} alt="" className="hidden md:block absolute top-[164px] left-1 h-2/3 z-30" />
            <img src={'/person2.png'} alt="" className="hidden md:block absolute top-32 right-8 h-2/3 z-10" />
            <img src={'/person3.png'} alt="" className="hidden md:block absolute top-[154px] left-16 h-2/3 z-20" />
            <img src={'/person4.png'} alt="" className="hidden md:block absolute top-44 left-56 h-2/3 z-50" />
            <AnimatedLeaf
              src="/leaf-1.png"
              className="hidden md:block absolute top-8 right-[60px] w-full h-1/2 object-contain z-1 pointer-events-none"
            />
            <AnimatedLeaf
              src="/leaf-1.png"
              className="hidden md:block absolute top-40 right-36 w-full h-1/2 object-contain z-1 pointer-events-none"
            />
            <AnimatedLeaf
              src="/leaf-2.png"
              className="hidden md:block absolute w-full object-contain h-1/3 left-32 z-5 top-20 pointer-events-none"
            />
            <AnimatedLeaf
              src="/leaf-5.png"
              className="hidden md:block absolute w-full object-contain h-1/3 left-48 z-5 top-36 pointer-events-none"
            />
          </div>
        </div>
      </section>
    </div>
  );
}