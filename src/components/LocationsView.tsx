import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, MapPin } from "lucide-react";

export default function LocationsView() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-3xl mx-auto px-6 md:px-12 py-12 min-h-[80vh] flex flex-col gap-8 text-center items-center"
    >
      {/* Back Button */}
      <div className="w-full text-left">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-0 focus:outline-none"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
          <MapPin className="w-5 h-5" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter italic text-white font-display">
          Our Private Theater Lounges
        </h1>
        <p className="text-sm text-white/60 leading-relaxed max-w-xl">
          Discover an escape within your escape. Grand Lodge on Peak 7 features four state-of-the-art private movie theaters distributed across the property:
        </p>
      </div>

      {/* Content Sections */}
      <div className="w-full flex flex-col gap-6 text-left mt-4">
        {/* Section 1 */}
        <div className="bg-surface-container-low border border-white/5 p-6 md:p-8 rounded-none">
          <h2 className="text-lg font-black uppercase tracking-wider text-red-500 font-display mb-3">
            Theaters 1 & 2 (South Building)
          </h2>
          <p className="text-sm text-white/70 leading-relaxed font-sans">
            Located inside the Family Fun Center on the Ground Level. Simply take the stairs or Elevator 1 down one floor. The Family Fun Center is directly underneath the "Bar Down" restaurant.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-surface-container-low border border-white/5 p-6 md:p-8 rounded-none">
          <h2 className="text-lg font-black uppercase tracking-wider text-red-500 font-display mb-3">
            Theaters 3 & 4 (North Building)
          </h2>
          <p className="text-sm text-white/70 leading-relaxed font-sans">
            Located on the ground floor of the North Building. From the front desk/lobby area, walk down the North hallway past the ski lockers, follow the corridor around to the end, and you will find the entrance right next to the North building elevator.
          </p>
        </div>
      </div>


    </motion.div>
  );
}
