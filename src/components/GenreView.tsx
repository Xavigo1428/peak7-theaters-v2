import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Movie } from "../types/movie";
import { ChevronLeft, Film, AlertTriangle } from "lucide-react";

interface GenreViewProps {
  onSelectMovie: (movie: Movie) => void;
}

export default function GenreView({ onSelectMovie }: GenreViewProps) {
  const { genreName } = useParams<{ genreName: string }>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const normalizedGenre = genreName ? normalizeGenre(genreName) : "";

  useEffect(() => {
    if (!normalizedGenre) return;
    window.scrollTo(0, 0);

    setIsLoading(true);
    const moviesRef = collection(db, "movies");
    const q = query(moviesRef, where("genre", "array-contains", normalizedGenre));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Movie[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Movie);
      });
      // Sort alphabetically by name
      list.sort((a, b) => a.name.localeCompare(b.name));
      setMovies(list);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching genre movies:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [normalizedGenre]);

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-fade-in min-h-[70vh]">
      {/* Back to Catalog Breadcrumb */}
      <div className="mb-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="border-b border-white/10 pb-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-black leading-none tracking-tighter uppercase italic font-display text-white mb-2">
          {normalizedGenre} Movies
        </h1>
        <p className="text-[10px] text-white/40 font-mono uppercase mt-1">
          DISPLAYING {movies.length} CINEMATIC MATCH(ES) FROM THE PEAK7 ROSTER.
        </p>
      </div>

      {isLoading ? (
        <div className="py-24 text-center text-white/40">
          <Film className="w-8 h-8 text-red-500 animate-spin mx-auto mb-3" />
          <p className="text-xs uppercase tracking-widest font-mono">Loading curations...</p>
        </div>
      ) : movies.length === 0 ? (
        <div className="py-16 text-center text-white/40 max-w-sm mx-auto flex flex-col gap-3">
          <div className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-xs tracking-wider uppercase font-sans">
            No matching listings found.
          </p>
          <span className="text-[10px] font-mono text-white/30">
            Please add movies with the genre "{normalizedGenre}" in the Admin Dashboard.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div 
              key={movie.id}
              onClick={() => onSelectMovie(movie)}
              className="group relative rounded-sm overflow-hidden aspect-[2/3] cursor-pointer bg-[#0d0707] border border-white/5 transition-all duration-300 hover:scale-105 hover:border-white hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] active:scale-98 shadow-md"
            >
              <img 
                referrerPolicy="no-referrer"
                src={movie.img} 
                alt={movie.name} 
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent group-hover:via-black/50 transition-all duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="text-[9px] font-black font-mono text-red-500 uppercase tracking-widest block mb-1">
                  {movie.type} • {movie.rating}
                </span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-white group-hover:text-red-500 transition-colors truncate">
                  {movie.name}
                </h3>
                <p className="text-[9px] font-mono text-white/40 mt-1 uppercase">
                  {movie.year} • {movie.duration.includes("h") ? movie.duration : `${movie.duration}m`}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function normalizeGenre(name: string): string {
  const lower = name.toLowerCase();
  if (lower === "action") return "Action";
  if (lower === "sci-fi" || lower === "scifi") return "Sci-Fi";
  if (lower === "trending now" || lower === "trending") return "Trending Now";
  return name.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}
