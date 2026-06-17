import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ChevronLeft, HelpCircle } from "lucide-react";

export default function SupportView() {
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
          <HelpCircle className="w-5 h-5" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter italic text-white font-display">
          Reservations & Technical Support
        </h1>
      </div>

      {/* Content Sections */}
      <div className="w-full flex flex-col gap-6 text-left mt-4">
        {/* Section 1 */}
        <div className="bg-surface-container-low border border-white/5 p-6 md:p-8 rounded-none">
          <h2 className="text-lg font-black uppercase tracking-wider text-red-500 font-display mb-3">
            How to Book a Theater Room
          </h2>
          <p className="text-sm text-white/70 leading-relaxed font-sans">
            The use of our theater spaces is always complimentary, but reservations are highly recommended prior to your visit. Owners can book in advance by calling 970-453-3330. Non-owners and regular resort guests can comfortably request access upon their arrival at the resort at the Front Desk.
          </p>
        </div>

        {/* Section 2 */}
        <div className="bg-surface-container-low border border-white/5 p-6 md:p-8 rounded-none">
          <h2 className="text-lg font-black uppercase tracking-wider text-red-500 font-display mb-3">
            Technical Assistance
          </h2>
          <p className="text-sm text-white/70 leading-relaxed font-sans">
            Once inside your reserved theater, you can easily begin the show using our simple touchscreen control pad. If you ever experience issues with audio, video, or navigation, our friendly team members are always nearby and willing to provide immediate help.
          </p>
        </div>
      </div>


    </motion.div>
  );
}
