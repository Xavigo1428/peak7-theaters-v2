import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, collection, query, where, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Movie } from "../types/movie";
import { ChevronLeft, Clock, Calendar, Star, Film, Eye, User } from "lucide-react";
import { motion } from "motion/react";

export default function MovieDetailView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    window.scrollTo(0, 0);
    setIsLoading(true);
    const movieRef = doc(db, "movies", id);
    getDoc(movieRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          setMovie({ id: docSnap.id, ...docSnap.data() } as Movie);
        } else {
          setMovie(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading movie details:", error);
        setIsLoading(false);
      });
  }, [id]);

  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (!movie || !movie.genre || movie.genre.length === 0) {
      setSimilarMovies([]);
      return;
    }

    const moviesRef = collection(db, "movies");
    const q = query(
      moviesRef,
      where("genre", "array-contains", movie.genre[0]),
      limit(12)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Movie[] = [];
      snapshot.forEach((docSnap) => {
        const m = { id: docSnap.id, ...docSnap.data() } as Movie;
        if (m.id !== movie.id) {
          list.push(m);
        }
      });
      const shuffled = shuffleArray(list).slice(0, 6);
      setSimilarMovies(shuffled);
    }, (error) => {
      console.error("Error fetching similar movies:", error);
    });

    return () => unsubscribe();
  }, [movie]);

  // Helper to extract YouTube video ID and return embed link
  const getYouTubeEmbedUrl = (url: string, isMobileDevice: boolean) => {
    if (!url) return "";
    let videoId = "";
    try {
      if (url.includes("v=")) {
        videoId = url.split("v=")[1]?.split("&")[0] || "";
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
      } else if (url.includes("embed/")) {
        videoId = url.split("embed/")[1]?.split("?")[0] || "";
      }
    } catch (e) {
      console.error("Error parsing youtube URL", e);
    }
    if (!videoId) return url;

    if (isMobileDevice) {
      return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=1&playsinline=1`;
    } else {
      return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1&mute=0`;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12 min-h-[80vh] flex flex-col gap-6 animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded-sm"></div>
        <div className="w-full aspect-video bg-white/5 rounded-sm border border-white/5"></div>
        <div className="h-6 w-48 bg-white/10 rounded-sm"></div>
        <div className="h-4 w-full bg-white/5 rounded-sm"></div>
        <div className="h-4 w-full bg-white/5 rounded-sm"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-24 min-h-[80vh] text-center flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold uppercase tracking-wider text-white">Movie Not Found</h2>
        <p className="text-sm text-white/40">The movie listing you are looking for does not exist or has been removed.</p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  // Detect mobile users based on window inner width
  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false;
  const embedUrl = getYouTubeEmbedUrl(movie.trailer, isMobile);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="max-w-4xl mx-auto px-6 md:px-12 py-12 min-h-[80vh] flex flex-col gap-6"
    >
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Embedded Video Trailer (Top) */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-black tracking-widest font-mono uppercase text-red-500 shrink-0 flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5" /> Official Trailer Player
        </span>
        <div className="relative w-full aspect-video rounded-none border border-white/10 bg-black shadow-[0_0_30px_rgba(220,38,38,0.15)]">
          {embedUrl ? (
            <iframe
              id={`trailer-iframe-${movie.id}`}
              src={embedUrl}
              title={`${movie.name} Trailer`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white/40">
              <span className="text-xs font-mono uppercase tracking-widest">No trailer URL available</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Details (Bottom) */}
      <div className="flex flex-col gap-6 bg-surface-container-low p-6 md:p-8 border border-white/5">
        <div className="flex flex-col gap-4">
          {/* Title and Rating Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-2">
              {movie.genre.map((g, idx) => (
                <span
                  key={g + idx}
                  className="text-[10px] font-mono font-black uppercase tracking-widest text-[#ef4444] border border-[#ef4444]/30 px-2.5 py-0.5 rounded-none bg-red-600/5"
                >
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-black font-display uppercase tracking-tighter text-white leading-none mt-1">
              {movie.name}
            </h1>
          </div>

          {/* Specs Line */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base sm:text-[15x] font-mono uppercase tracking-widest text-white/50">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
              {movie.year}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
              {formatDuration(movie.duration)}
            </span>

            <span className="bg-black/95 backdrop-blur-md text-red-500 font-mono text-[16px] sm:text-base font-black px-2 py-0.5 rounded-none border border-white/5 tracking-widest uppercase">
              {movie.type}
            </span>
            <span className="bg-red-600 text-white text-[16px] sm:text-base font-black px-2.5 py-1 rounded-none uppercase tracking-widest">
              {movie.rating}
            </span>
          </div>

          {/* Narrative of movie */}
          <p className="text-base text-white/80 font-sans leading-relaxed">
            {movie.synopsis || "No description provided."}
          </p>

          {/* Personnel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 text-base font-mono border-t border-white/5 text-white/60">
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="font-bold text-white uppercase shrink-0">Director:</span>
              <span className="truncate uppercase text-[16px] tracking-wide">{movie.director}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span className="font-bold text-white uppercase shrink-0">Lead:</span>
              <span className="truncate uppercase text-[16px] tracking-wide">{movie.leadActor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      {similarMovies.length > 0 && (
        <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/50">You May Also Like</h3>
            <div className="h-[1px] flex-grow mx-8 bg-white/10"></div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mt-2">
            {similarMovies.map((simMovie) => (
              <Link
                key={simMovie.id}
                to={`/movie/${simMovie.id}`}
                className="group cursor-pointer flex flex-col relative"
              >
                <div className="aspect-[2/3] bg-surface-container-low rounded-sm mb-3 border border-white/5 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-white group-hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] shadow-md">
                  <img
                    referrerPolicy="no-referrer"
                    src={simMovie.img}
                    alt={simMovie.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-white group-hover:text-red-500 transition-colors truncate">
                  {simMovie.name}
                </div>
                <div className="flex justify-between items-center text-[9px] text-white/40 uppercase tracking-wider font-mono mt-0.5">
                  <span>{simMovie.year}</span>
                  <span>{simMovie.rating}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </motion.div>
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

// Helper to format duration to Xh Ym format
function formatDuration(duration: string | number | undefined): string {
  if (!duration) return "";
  const durStr = String(duration).toLowerCase();

  if (/^\d+h\s*\d+m$/.test(durStr.trim())) {
    return durStr;
  }

  const minutesMatch = durStr.match(/\d+/);
  if (!minutesMatch) return String(duration);

  const totalMinutes = parseInt(minutesMatch[0], 10);
  if (isNaN(totalMinutes)) return String(duration);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}
