import Navbar from "../components/Navbar";

export default function Preferences() {
  return (
    <div className="relative min-h-screen bg-[#FAFAFA] overflow-hidden">
      <div className="absolute top-[-150px] md:top-[-350px] left-1/2 -translate-x-1/2 
        w-[800px] h-[300px] md:w-[1600px] md:h-[500px]
        bg-[#D7DBB8] 
        rounded-[50%/40%]
        blur-[80px] md:blur-[60px]
        opacity-100
        pointer-events-none
        z-0">
      </div>
      <div className="relative z-50">
        <Navbar />
      </div>
      <div className="relative z-10 flex items-center justify-center px-4 pt-28 pb-12">
        <div className="w-full max-w-xl bg-white/90 border border-slate-200 rounded-2xl p-6 shadow-xl">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Preferences</h1>
          <p className="text-sm text-slate-500">
            Here you&apos;ll be able to set your lifestyle and roommate preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
