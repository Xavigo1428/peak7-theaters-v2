import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { collection, query, where, limit, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { Movie } from "../types/movie";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieCarouselShelfProps {
  genreName?: string;
  title: string;
  onSelectMovie: (movie: Movie) => void;
  isLarge?: boolean;
  isNewlyAdded?: boolean;
  isTop10?: boolean;
}

export default function MovieCarouselShelf({
  genreName,
  title,
  onSelectMovie,
  isLarge = false,
  isNewlyAdded = false,
  isTop10 = false
}: MovieCarouselShelfProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollWidth - clientWidth - scrollLeft > 5);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      checkScrollPosition();
    }, 150);
    return () => clearTimeout(timeout);
  }, [movies]);

  useEffect(() => {
    window.addEventListener("resize", checkScrollPosition);
    return () => {
      window.removeEventListener("resize", checkScrollPosition);
    };
  }, []);

  const sizeClass = isTop10
    ? "w-48 sm:w-60 md:w-72 lg:w-80"
    : isLarge
      ? "w-48 sm:w-56 md:w-64"
      : "w-32 sm:w-40 md:w-44";

  const shelfId = (genreName || title).toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    const moviesRef = collection(db, "movies");
    const q = isTop10
      ? query(moviesRef, where("top10", ">", 0), orderBy("top10", "asc"), limit(10))
      : isNewlyAdded
        ? query(moviesRef, orderBy("timestamp", "desc"), limit(15))
        : query(moviesRef, where("genre", "array-contains", genreName || ""), limit(15));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Movie[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Movie);
        });

        if (list.length > 0) {
          // Client-side Fisher-Yates random shuffle if not newly added and not top 10
          const processed = (isNewlyAdded || isTop10) ? list : shuffleArray(list);
          setMovies(processed);
        } else {
          setMovies([]);
        }
        setIsLoading(false);
      },
      (error) => {
        console.error(`Error loading carousel movies for "${genreName || title}":`, error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [genreName, isNewlyAdded, isTop10]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmt = isTop10 ? 460 : isLarge ? 420 : 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmt : scrollAmt,
        behavior: "smooth"
      });
    }
  };

  // If loading, render a simple skeleton shelf or hide it
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 md:gap-3 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 w-36 bg-white/10 rounded-sm"></div>
          <div className="h-[1px] flex-grow mx-8 bg-white/5"></div>
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-hidden pb-4">
          {[...Array(5)].map((_, idx) => (
            <div key={idx} className={`shrink-0 aspect-[2/3] bg-white/5 rounded-sm ${sizeClass}`}></div>
          ))}
        </div>
      </div>
    );
  }

  // If no movies exist in this category, don't show the shelf (premium catalog clean practice)
  if (movies.length === 0) {
    return null;
  }

  return (
    <section id={`${shelfId}-shelf`} className="flex flex-col gap-2 md:gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">{title}</h3>
        <div className="h-[1px] flex-grow mx-8 bg-white/10"></div>
      </div>

      <div className="relative group/shelf">
        {/* Left Overlay Arrow (Disney+ Style) */}
        <button
          onClick={() => handleScroll("left")}
          className={`hidden md:flex absolute md:-left-12 top-[calc(50%-36px)] -translate-y-1/2 w-10 h-10 items-center justify-center z-20 bg-black/60 hover:bg-red-600 hover:scale-110 active:scale-95 text-white border border-white/10 opacity-0 transition-all duration-300 backdrop-blur-sm cursor-pointer rounded-full shadow-lg ${canScrollLeft
            ? "group-hover/shelf:opacity-100 pointer-events-auto"
            : "pointer-events-none"
            }`}
          title="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={checkScrollPosition}
          className="flex gap-4 overflow-x-auto snap-x hide-scrollbar pb-6 pt-4 -mt-4 px-6 -mx-6 md:px-12 md:-mx-12 scroll-pl-6 md:scroll-pl-12 scroll-pr-6 md:scroll-pr-12 scroll-smooth"
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              id={`${shelfId}-card-${movie.id}`}
              onClick={() => onSelectMovie(movie)}
              className={`snap-start shrink-0 group cursor-pointer ${sizeClass} relative`}
            >
              {/* Giant Background Number for Top 10 */}
              {isTop10 && (
                <div
                  className="absolute left-[-15px] bottom-12 text-[110px] sm:text-[140px] md:text-[180px] lg:text-[210px] select-none z-0 italic"
                  style={{
                    WebkitTextStroke: "2.5px rgba(255, 255, 255, 0.35)",
                    color: "transparent",
                    fontFamily: "'Outfit', 'Impact', 'Arial Black', sans-serif",
                    fontWeight: 900,
                    lineHeight: "0.8"
                  }}
                >
                  {index + 1}
                </div>
              )}

              {/* Poster image & text wrapper */}
              <div className={isTop10 ? "ml-auto w-[65%] relative z-10" : "w-full"}>
                <div className="aspect-[2/3] bg-[#0d0707] rounded-sm mb-4 border border-white/5 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-white group-hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] shadow-md">
                  <img
                    referrerPolicy="no-referrer"
                    src={movie.img}
                    alt={movie.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                </div>
                <div className="text-[12px] font-bold uppercase tracking-wider text-white group-hover:text-red-500 transition-colors truncate">
                  {movie.name}
                </div>
                <div className="flex justify-between items-center text-[9px] text-white/40 uppercase tracking-wider font-mono mt-0.5" title={`${movie.year} ★ ${movie.rating}`}>
                  <span>{movie.year}</span>
                  <span className="truncate max-w-[50%] text-center">{movie.type}</span>
                  <span>{movie.rating}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Stylized View All Card */}
          {!isNewlyAdded && !isTop10 && (
            <Link
              to={`/genre/${encodeURIComponent(genreName || "")}`}
              className={`snap-start shrink-0 group cursor-pointer flex flex-col ${sizeClass}`}
            >
              <div className="aspect-[2/3] bg-[#0d0707]/30 hover:bg-red-950/20 rounded-sm mb-4 border border-white/10 group-hover:border-white group-hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] flex flex-col items-center justify-center transition-all duration-300 group-hover:scale-105 shadow-md gap-2">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white transition-colors">
                  →
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">
                  View All
                </span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/30 truncate group-hover:text-red-500 transition-colors">
                {title} Catalog
              </div>
              <div className="text-[9px] text-white/20 uppercase tracking-widest font-mono mt-0.5">
                Explore Full List
              </div>
            </Link>
          )}
        </div>

        {/* Right Overlay Arrow (Disney+ Style) */}
        <button
          onClick={() => handleScroll("right")}
          className={`hidden md:flex absolute md:-right-12 top-[calc(50%-36px)] -translate-y-1/2 w-10 h-10 items-center justify-center z-20 bg-black/60 hover:bg-red-600 hover:scale-110 active:scale-95 text-white border border-white/10 opacity-0 transition-all duration-300 backdrop-blur-sm cursor-pointer rounded-full shadow-lg ${canScrollRight
            ? "group-hover/shelf:opacity-100 pointer-events-auto"
            : "pointer-events-none"
            }`}
          title="Scroll Right"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </section>
  );
}

// Fisher-Yates Shuffle Utility
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
