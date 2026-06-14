import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Phone, Calendar, Info, Check, DollarSign } from "lucide-react";

export default function ReservationView() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 md:px-12 py-12 min-h-[85vh] flex flex-col gap-10"
    >
      {/* Page Header */}
      <div className="border-b border-white/10 pb-6">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 font-mono">
          GL7 Resort Amenities
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter italic text-white font-display mt-2">
          Theater Reservations
        </h1>
      </div>

      {/* Table Section */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 font-mono">
            Key Information
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-1">
            Reservation Guidelines at a Glance
          </h2>
        </div>

        {/* Responsive Table */}
        <div className="w-full overflow-x-auto rounded-xl border border-outline-variant/25 bg-surface-container-lowest shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-low text-on-surface-variant font-display font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Details & Process</th>
                <th className="py-4 px-6">Requirements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 text-xs text-white/80 font-mono">
              <tr className="hover:bg-surface-container-low/20 transition-colors">
                <td className="py-4 px-6 font-bold uppercase text-red-500 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Cost
                </td>
                <td className="py-4 px-6 uppercase">Always Complimentary (Free)</td>
                <td className="py-4 px-6 uppercase text-white/40">None</td>
              </tr>
              <tr className="hover:bg-surface-container-low/20 transition-colors">
                <td className="py-4 px-6 font-bold uppercase text-red-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Owners Policy
                </td>
                <td className="py-4 px-6 uppercase">Book in advance prior to visit</td>
                <td className="py-4 px-6 uppercase text-red-500 flex items-center gap-1.5 font-bold">
                  <Phone className="w-3.5 h-3.5" /> Call 970-453-3330
                </td>
              </tr>
              <tr className="hover:bg-surface-container-low/20 transition-colors">
                <td className="py-4 px-6 font-bold uppercase text-red-500 flex items-center gap-2">
                  <Info className="w-4 h-4" /> Non-Owners Policy
                </td>
                <td className="py-4 px-6 uppercase">Request access upon arrival</td>
                <td className="py-4 px-6 uppercase text-white/60">Subject to availability</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Description Info Section */}
      <div className="border-t border-white/10 pt-10 mt-4 max-w-4xl space-y-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 font-mono">
            Reservation Overview
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-1">
            General Policy
          </h2>
        </div>
        <p className="text-white/70 leading-relaxed text-sm md:text-base font-sans">
          The use of these spaces is always complimentary but it is helpful to make a reservation prior to your visit.
          Owners can do this in advance by calling <strong>970-453-3330</strong> and non-owners can request access upon their arrival at the resort.
          Whether you’re seeking a night of relaxation or you’re chasing the thrill for an adventure, the movie theater lounges are the perfect escape for you.
        </p>
      </div>
    </motion.div>
  );
}
