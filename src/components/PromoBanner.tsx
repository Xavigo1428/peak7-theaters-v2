import React from "react";
import { ArrowUpRight } from "lucide-react";

const SIMULATOR_URL =
  "https://www.grandlodgeonpeak7.com/resort-activities/sports-simulator/";

/**
 * Responsive promotional banner for the Grand Lodge on Peak 7 Golf & Sports Simulator.
 * Placed between the Adventure and Action carousels on the Home catalog screen.
 */
export default function PromoBanner() {
  return (
    <a
      href={SIMULATOR_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Golf & Sports Simulator - Resort Experience - Book Now (opens in new tab)"
      className="block w-full rounded-xl group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
    >
      <article className="relative w-full min-h-[260px] md:min-h-[180px] flex md:block rounded-xl overflow-hidden bg-zinc-900/90 border border-white/10 shadow-2xl transition-all duration-300 hover:border-white/20">
        {/* Media region (first child in source order) */}
        <div className="absolute inset-0 md:inset-y-0 md:left-auto md:right-0 md:w-[60%] md:h-full overflow-hidden">
          <video
            src="/images/Golfer.mp4"
            poster="/images/sports-simulator.jpg"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          {/* Mobile soft dark gradient overlay so video shines clearly underneath */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25 md:hidden" />
        </div>

        {/* Desktop CSS gradient overlay: dark behind left text, bright & clear over golfer on the right */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent pointer-events-none z-10" />

        {/* Text & CTA Content on the Left */}
        <div className="relative z-20 py-8 px-6 sm:p-8 md:p-10 lg:p-12 md:max-w-[58%] lg:max-w-[55%] flex flex-col items-start justify-center">
          <span className="inline-block px-3 py-1 mb-3.5 md:mb-4 rounded-full bg-red-950/70 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-[0.18em] drop-shadow-md">
            RESORT EXPERIENCE
          </span>

          <h2 className="font-display text-2xl sm:text-2xl lg:text-4xl font-black italic uppercase tracking-tight bg-red-950/50 text-red-600 leading-tight mb-3 drop-shadow-md">
            GOLF &amp; SPORTS SIMULATOR
          </h2>

          <p className="text-lg sm:text-lg text-zinc-100 md:text-zinc-200 leading-relaxed mb-6 max-w-lg drop-shadow-md">
            Step into the ultimate indoor arena. Play golf, baseball, hockey,
            soccer, or zombie survival. Up to 6 participants • $60 per session
            (1h 50m).
          </p>

          <span className="inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-red-600/25 transition-transform duration-300 group-hover:scale-105 hover:scale-105">
            BOOK NOW
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
          </span>
        </div>
      </article>
    </a>
  );
}
