import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
export default function Home() {
  const hasToken =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  return (
    <div className="relative bg-slate-50 text-slate-900">
      {/* Top gradient behind navbar & hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-pink-300 via-orange-200/60 to-transparent -z-10" />

      <Navbar />

      {/* Hero section - full viewport height */}
      <HeroSection />
      
      {/* Container 2*/}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center bg-slate-200 p-6">
          <div className="text-4xl text-wrap p-4">
            <h1>Getting Rental Agreement done easily in just few clicks with Dwell Duo</h1>
          </div>
          <img src={'/pic1.jpeg'} alt="Rental Agreement" className="rounded-2xl shadow-lg" />
        </div>  

        {/* Container 3*/}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center p-6">
          <img src={'/pic2.jpeg'} alt="Find Roommate" className="rounded-2xl shadow-lg" />
          <div className="text-4xl text-wrap p-4">
            <h1>Find your perfect roommate with Dwell Duo</h1>
          </div>
        </div>
        {/* Container 4 cities*/}
        <div className="bg-slate-200 p-9">
            <h1 className="text-4xl text-center mb-8">View rooms in Popular cities</h1>
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 p-8">
              {/* Mumbai */}
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                <img 
                  src={'/ahmedabad.jpeg'} 
                  alt="Ahmedabad"
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex items-end justify-center pb-4">
                  <h2 className="text-xl font-bold text-white drop-shadow-lg">Ahmedabad</h2>
                </div>
              </div>
              {/* Delhi*/}
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
              <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
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
