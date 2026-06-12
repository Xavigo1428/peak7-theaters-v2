import React, { useEffect } from "react";
import { motion } from "motion/react";
import { Phone, Users, Clock, Info, HelpCircle } from "lucide-react";

export default function ScheduleView() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const theaters = [
    {
      id: 1,
      name: "GL7 Theater 1",
      seats: 9,
      slots: [
        "8 a.m. - 11 a.m.",
        "11:20 a.m. - 2:20 p.m.",
        "2:40 p.m. - 5:40 p.m.",
        "6 p.m. - 9 p.m.",
        "9:20 p.m. - 12:20 a.m.",
      ],
    },
    {
      id: 2,
      name: "GL7 Theater 2",
      seats: 10,
      slots: [
        "8:10 a.m. - 11:10 a.m.",
        "11:30 a.m. - 2:30 p.m.",
        "2:50 p.m. - 5:50 p.m.",
        "6:10 p.m. - 9:10 p.m.",
        "9:30 p.m. - 12:30 a.m.",
      ],
    },
    {
      id: 3,
      name: "GL7 Theater 3",
      seats: 8,
      slots: [
        "8 a.m. - 11 a.m.",
        "11:20 a.m. - 2:20 p.m.",
        "2:40 p.m. - 5:40 p.m.",
        "6 p.m. - 9 p.m.",
        "9:20 p.m. - 12:20 a.m.",
      ],
    },
    {
      id: 4,
      name: "GL7 Theater 4",
      seats: 8,
      slots: [
        "8:10 a.m. - 11:10 a.m.",
        "11:30 a.m. - 2:30 p.m.",
        "2:50 p.m. - 5:50 p.m.",
        "6:10 p.m. - 9:10 p.m.",
        "9:30 p.m. - 12:30 a.m.",
      ],
    },
  ];

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
          Private Movie Theaters
        </h1>
      </div>

      {/* Schedules Section */}
      <div className="flex flex-col gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500 font-mono">
            Daily Availability
          </span>
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mt-1">
            Theater Schedule Slots
          </h2>
        </div>

        {/* Theater Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {theaters.map((theater) => (
            <div 
              key={theater.id} 
              className="bg-zinc-900/40 border border-white/5 p-5 flex flex-col gap-4 backdrop-blur-sm shadow-lg hover:border-white/10 transition-colors"
            >
              {/* Theater Title Header */}
              <div className="pb-2 border-b border-white/10">
                <h3 className="text-lg font-black uppercase tracking-tight text-white font-display">
                  {theater.name} -
                </h3>
                <p className="text-sm font-bold text-red-500 mt-0.5">
                  Seats {theater.seats}
                </p>
              </div>

              {/* Time Slots Table (Replicating user image format without "Available") */}
              <div className="border border-black overflow-hidden bg-[#a5f3fc] text-black">
                {theater.slots.map((slot, idx) => (
                  <div 
                    key={idx}
                    className={`py-4 px-3 text-center transition-colors hover:bg-[#bbf7f7] ${
                      idx !== 0 ? "border-t border-black" : ""
                    }`}
                  >
                    <div className="text-[11px] sm:text-xs font-black tracking-wide font-mono uppercase">
                      {slot}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Description Info Section */}
      <div className="border-t border-white/10 pt-10 mt-4 max-w-4xl space-y-6 text-white/70 leading-relaxed text-sm md:text-base">
        <p>
          Guests of the Grand Lodge on Peak 7 have access to four private movie theaters, each featuring 
          state-of-the-art video technology. With over 400 of the latest movies to choose from, your family will 
          be able to find something that everyone loves. From Jonah Hill to Blake Lively to George Clooney, we 
          have a feature that’ll match your mood. At this Breckenridge lodge with a movie theater, the films 
          also range from G to R so that you’ll easily be able to pick one that fits your group’s needs and 
          preferences. Once you make your selection, you can begin the show by using the simple touchscreen pad. 
          If you ever need assistance, our friendly team members are always nearby and willing to provide help.
        </p>
        <p>
          The larger theaters are located inside the Family Fun Center, giving you the perfect place to play 
          before and after the film. These movie spaces feature eleven recliners to ensure max comfort for the 
          whole group. The two more intimate theaters are located in the North Building and allow reclining 
          seating for seven people. If you’re looking for the ideal private viewing experience, here’s your 
          flawless opportunity!
        </p>
        <p>
          The use of these spaces is always complimentary but it is helpful to make a reservation prior to your visit. 
          Owners can do this in advance by calling 970-453-3330 and non-owners can request access upon their arrival at the resort. 
          Whether you’re seeking a night of relaxation or you’re chasing the thrill for an adventure, the movie theater 
          lounges are the perfect escape for you.
        </p>
      </div>
    </motion.div>
  );
}
