import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, Scale } from "lucide-react";

export default function TermsView() {
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
          <Scale className="w-5 h-5" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter italic text-white font-display">
          Terms of Service & Theater Rules
        </h1>
      </div>

      {/* Content Section */}
      <div className="w-full text-left mt-4 bg-surface-container-low border border-white/5 p-6 md:p-8 rounded-none">
        <p className="text-sm text-white/70 leading-relaxed font-sans">
          Accommodations at the Grand Lodge on Peak 7 mean more than just a place to lay your head. Guests have complimentary access to private movie theater lounges featuring state-of-the-art video technology and over 400 of the latest movies to choose from. Our extensive features range from G to R ratings, ensuring you easily pick a film that fits your group’s preferences. This service is an exclusive, non-commercial amenity strictly for active guests and owners at the resort.
        </p>
      </div>


    </motion.div>
  );
}
