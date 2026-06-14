import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, Shield } from "lucide-react";

export default function PrivacyView() {
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
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500">
          <Shield className="w-5 h-5" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter italic text-white font-display">
          Privacy Policy
        </h1>
      </div>

      {/* Content Section */}
      <div className="w-full text-left mt-4 bg-surface-container-low border border-white/5 p-6 md:p-8 rounded-none">
        <p className="text-sm text-white/70 leading-relaxed font-sans">
          Peak 7 Theaters operates as an internal informational catalog for resort amenities. This application does not collect, track, or share any personal identity information, location data, or browsing metrics from our guests. Account creation and login functionalities are strictly reserved for internal resort administrators to manage the movie listings.
        </p>
      </div>


    </motion.div>
  );
}
