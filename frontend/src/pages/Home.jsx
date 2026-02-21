import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import { useNavigate } from "react-router-dom";
import { MapPin, DollarSign, User } from "lucide-react";
export default function Home() {
  const navigate = useNavigate();
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const handleCityClick = (cityName) => {
    // Navigate to matches page with city parameter
    navigate(`/matches?city=${encodeURIComponent(cityName)}`);
  };
    function AnimatedPin({ src, alt, className, delay = 0 }) {
      return (
        <motion.img
          src={src}
          alt={alt}
          className={`absolute ${className}`}
          initial={{ scale: 1.8, 
            rotate: 0,
            y: 0,
          }}
          whileInView={{
            scale: 1,
            rotate: [0, -10, 8, -5, 2, 0],
            y: [0, -6, 3, -2, 0],
          }}
          transition={{
            scale: {
              type: "spring",
              stiffness: 180,
              damping: 14,
              delay: delay,
            },
            rotate: {
              duration: 3.6,
              delay: delay + 0.4,
              ease: "easeInOut",
            },
          }}
          viewport={{
            once: true,
            amount: 0.9,
          }}
          style={{
            originX: 0.5,
            originY: 1,
          }}
        />
      );
    }
    
  return (
    <div className="relative bg-[#Fafafa] text-slate-900 overflow-x-hidden">
      <div className="absolute top-[-150px] md:top-[-350px] left-1/2 -translate-x-1/2 
        w-[800px] h-[300px] md:w-[1600px] md:h-[500px]
        bg-[#CDBB9A] 
        rounded-[50%/40%]
        blur-[80px] md:blur-[60px]
        opacity-100
        pointer-events-none">
      </div>
      {/* Top gradient behind navbar & hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-pink-300 via-orange-200/60 to-transparent -z-10" />

      <Navbar />

      {/* Hero section - full viewport height */}
      <HeroSection />
      {/* Container 2 */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-32 justify-center items-center px-4 sm:px-6 py-8 md:p-6 md:m-10">
        {/* LEFT — Wrapper for stacking */}
        <div className="relative w-full max-w-[320px] min-h-[380px] md:min-h-[420px] flex items-center justify-center md:block">
          {/* ===== BIG CARD ===== */}
          <div className="relative w-full max-w-[256px] aspect-[256/338] md:w-[256px] md:h-[338px]">
            {/* Glow frame image */}
            <img
              src="/Group 18.png"
              alt="preferences"
              className="absolute inset-0 w-full h-full object-contain"
            />
            {/* Inner white card */}
            <div className="absolute top-[9px] bottom-[15px] left-[11px] right-[11px] rounded-[10px] bg-white flex flex-col items-center px-2.5 py-3 overflow-hidden">
              {/* Profile Picture with Line Design */}
              <div className="mb-2 relative w-full flex items-center justify-center h-16">
                {/* Left horizontal line - aligned with bottom quarter */}
                <div className="absolute left-0 flex items-center" style={{ top: 'calc(50% + 12px)' }}>
                  <div className="h-0.5 bg-[#D4C5A9] w-[50px]"></div>
                  <div className="w-1.5 h-1.5 bg-[#D4C5A9] rounded-full ml-[-2px]"></div>
                </div>
                {/* Profile image */}
                <div className="relative z-10">
                  <img 
                    src="/person5.png" 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border border-gray-200"
                  />
                </div>
                {/* Right horizontal line - aligned with bottom quarter */}
                <div className="absolute right-0 flex items-center justify-end" style={{ top: 'calc(50% + 12px)' }}>
                  <div className="w-1.5 h-1.5 bg-[#D4C5A9] rounded-full mr-[-2px]"></div>
                  <div className="h-0.5 bg-[#D4C5A9] w-[50px]"></div>
                </div>
              </div>
              
              {/* Name */}
              <h3 className="text-sm font-bold text-[#707070] mb-0.5 text-center">Vanshika Agarwal</h3>
              
              {/* Location */}
              <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                <MapPin className="w-2.5 h-2.5" />
                <span>Hyderabad, India</span>
              </div>
              
              {/* Preference Box */}
              <div className="w-full bg-[#EEEEDF] rounded-md px-3 py-2 mb-2">
                <p className="text-xs text-gray-600 text-center leading-tight">looking for a Roommate in Noida</p>
              </div>
              
              {/* Demographic Details */}
              <div className="grid grid-cols-3 gap-1 w-full mb-2">
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-[#707070] mb-0.5">Age</p>
                  <p className="text-[11px] text-gray-500">23</p>
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-[#707070] mb-0.5">Gender</p>
                  <p className="text-[11px] text-gray-500">Female</p>
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-[#707070] mb-0.5">Phone</p>
                  <p className="text-[11px] text-gray-500 leading-tight">+91 7017519875</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-7 w-3/4 ">
                <button className="flex-1 h-6 rounded-md bg-white border border-gray-200 shadow-sm text-xs">View </button>
                <button className="flex-1 h-6 rounded-md bg-[#FF8A80] shadow-md"></button>
              </div>
            </div>
          </div>
          {/* ===== 🔥 SMALL OVERLAPPING CARD ===== */}
          <div className="absolute bottom-[-1px] right-[-5%] md:right-[-10px] w-[140px] h-[180px] sm:w-[160px] sm:h-[200px] md:w-[190px] md:h-[240px] z-10">
            <img
              src="/Group 20.png"
              alt="small card"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div className="absolute top-[7px] bottom-[12px] left-[15px] right-[15px] rounded-[8px] bg-white flex flex-col px-3 py-2.5 overflow-hidden">
              {/* Preferences Header */}
              <div className="mb-2">
                <h3 className="text-xs font-bold text-[#565656] mb-1">Preferences</h3>
                <div className="h-0.5 bg-[#A8B88A] w-12"></div>
              </div>
              
              {/* Description Box
              <div className="bg-[#E8E8D8] rounded-md px-2 py-1.5 mb-2">
                <p className="text-[7px] text-gray-500 leading-tight">
                  A roommate with shared interests, who likes pets, music.
                </p>
              </div> */}
              
              {/* Monthly Budget */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#E8E8D8] rounded flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4.5 h-4.5 text-[#8A9A6B]" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-bold text-[#595959]">Monthly budget</p>
                  <p className="text-[8px] text-gray-500">₹ 15000-20000</p>
                </div>
              </div>
              
              {/* Gender Preferences */}
              <div className="mb-4 flex items-center justify-end gap-1">
                <div className="flex flex-col">
                  <p className="text-[9px] font-bold text-[#595959]">Gender preferences</p>
                  <p className="text-[8px] text-gray-500">Female</p>
                </div>
                <div className="w-8 h-8 bg-[#E8E8D8] rounded flex items-center justify-center flex-shrink-0">
                  <User className="w-4.5 h-4.5 text-[#8A9A6B]" />
                </div>
              </div>
              
              {/* Location Preferences */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#E8E8D8] rounded flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4.5 h-4.5 text-[#8A9A6B]" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[9px] font-bold text-[#595959]">Location preferences</p>
                  <p className="text-[8px] text-gray-500">Noida, Uttar Pradesh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT — Text */}
        <div className="w-full max-w-xl p-4 sm:p-6 gap-2 flex flex-col items-start justify-center bg-[#EEEEDF] rounded-lg">
          <h1 className="leading-tight text-[#565656] text-xl sm:text-2xl md:text-3xl">
            Create your profile and find your perfect roommate
          </h1>
          <br />
          <button className="bg-[#969736] text-white px-4 py-2 shadow-lg rounded-full text-sm sm:text-base" onClick={() => navigate('/profile')}>Create now</button>
        </div>
      </div>

      {/* Container 3*/}
        <div className="flex flex-col md:flex-row justify-center items-center bg-[#F6F6F4] px-4 py-8 sm:px-6 md:mx-10 md:px-0 md:py-12">
          <div className="text-wrap pl-0 flex flex-col items-center text-center md:pl-10 md:items-start md:text-left order-2 md:order-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl">Shifting to new place for work or studies and don’t wanna share room with random people ?</h1>
            <br />
            <p className="text-sm font-light">Take our quick compatibility test and connect with roommates who truly fit your lifestyle.</p>
            <br />
            <button className="bg-[#969736] text-white px-4 py-2 shadow-lg rounded-full text-sm sm:text-base" onClick={() => navigate('/game')}>Check now</button>
          </div>
          <div className="relative w-full max-w-[360px] sm:max-w-[440px] h-64 sm:h-72 min-h-[300px] mx-auto order-1 mb-6 md:order-2 md:w-3/4 md:h-full md:min-h-0 md:max-w-none md:mx-0 md:mb-0">
            <div className="relative w-full h-full overflow-hidden rounded-lg bg-[#F0F0EE]">
              <img src={'/map.png'} alt="map" className="w-full h-full object-contain md:object-cover" />
              <AnimatedPin src={'/pin1.svg'} alt="pin" className="absolute top-2/3 left-1/4 w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20" delay={0.2} />
              <AnimatedPin src={'/pin2.svg'} alt="pin" className="absolute top-1/3 left-[15%] w-10 h-10 sm:w-14 sm:h-14 md:left-16 md:w-20 md:h-20" delay={0.3} />
              <AnimatedPin src={'/pin3.svg'} alt="pin" className="absolute top-1/2 left-1/4 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16" delay={0.4} />
              <AnimatedPin src={'/pin4.svg'} alt="pin" className="absolute top-1/4 left-[46%] w-12 h-12 sm:w-18 sm:h-18 md:left-72 md:w-28 md:h-28" delay={0.5} />
              <AnimatedPin src={'/pin5.svg'} alt="pin" className="absolute top-1/2 left-[46%] w-10 h-10 sm:w-16 sm:h-16 md:left-60 md:w-24 md:h-24" delay={0.6} />
              <AnimatedPin src={'/pin6.svg'} alt="pin" className="absolute top-[60%] left-[35%] w-10 h-10 sm:w-14 sm:h-14 md:top-64 md:left-40 md:w-20 md:h-20" delay={0.7} />
              <AnimatedPin src={'/pin7.svg'} alt="pin" className="absolute top-[18%] left-[40%] w-8 h-8 sm:w-12 sm:h-12 md:top-56 md:left-96 md:w-16 md:h-16" delay={0.8} />
              <AnimatedPin src={'/pin8.svg'} alt="pin" className="absolute top-[38%] left-[40%] w-7 h-7 sm:w-10 sm:h-10 md:top-96 md:left-80 md:w-12 md:h-12" delay={0.9} />
            </div>
          </div>
        </div>  
        <br />
        <br />
        {/* Container 4 cities*/}
        <div className="bg-[#F6F6F4] px-4 py-6 sm:p-6 md:p-9">
            <h1 className="text-2xl sm:text-3xl md:text-4xl text-center mb-6 md:mb-8">View rooms in Popular cities</h1>
            <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 lg:gap-10 p-2 sm:p-4 md:p-8">
              {/* Mumbai */}
              <div 
                onClick={() => handleCityClick('Mumbai')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/mumbai.jpeg'} 
                  alt="Mumbai"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Mumbai</h2>
                </div>
              </div>

              {/* Noida */}
              <div 
                onClick={() => handleCityClick('Noida')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/noida.jpeg'} 
                  alt="Noida"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Noida</h2>
                </div>
              </div>

              {/* Bangalore */}
              <div 
                onClick={() => handleCityClick('Bangalore')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/banglore.jpeg'} 
                  alt="Bangalore"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Bangalore</h2>
                </div>
              </div>

              {/* Pune */}
              <div 
                onClick={() => handleCityClick('Pune')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/pune.jpeg'} 
                  alt="Pune"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Pune</h2>
                </div>
              </div>

              {/* Hyderabad */}
              <div 
                onClick={() => handleCityClick('Hyderabad')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/hyderabad.jpeg'} 
                  alt="Hyderabad"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Hyderabad</h2>
                </div>
              </div>

              {/* Jaipur */}
              <div 
                onClick={() => handleCityClick('Jaipur')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/jaipur.jpeg'} 
                  alt="Jaipur"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Jaipur</h2>
                </div>
              </div>
              {/* Kolkata*/}
              <div 
                onClick={() => handleCityClick('Kolkata')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/kolkata.jpeg'} 
                  alt="Kolkata"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Kolkata</h2>
                </div>
              </div>
              {/* Chennai*/}
              <div 
                onClick={() => handleCityClick('Chennai')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/chennai.jpeg'} 
                  alt="Chennai"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Chennai</h2>
                </div>
              </div>
              {/* Ahmedabad*/}
              <div 
                onClick={() => handleCityClick('Ahmedabad')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/ahemdabad.jpeg'} 
                  alt="Ahmedabad"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Ahmedabad</h2>
                </div>
              </div>
              {/* Delhi*/}
              <div 
                onClick={() => handleCityClick('Delhi')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/delhi.jpeg'} 
                  alt="Delhi"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Delhi</h2>
                </div>
              </div>
              {/* Nagpur*/}
              <div 
                onClick={() => handleCityClick('Nagpur')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/nagpur.jpeg'} 
                  alt="Nagpur"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Nagpur</h2>
                </div>
              </div>
              {/* Surat*/}
              <div 
                onClick={() => handleCityClick('Surat')}
                className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
              >
                <img 
                  src={'/surat.jpeg'} 
                  alt="Surat"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Surat</h2>
                </div>
              </div>
            </div>
      </div>
      <Footer />
    </div>
  );
}
