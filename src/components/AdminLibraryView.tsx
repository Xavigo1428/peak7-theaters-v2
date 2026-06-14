import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Movie } from "../types/movie";
import { Plus, Edit2, Trash2, Film, RefreshCw, ChevronLeft } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface AdminLibraryViewProps {
  onDeleteMovie: (id: string) => void;
  onResetDatabase: () => void;
}

export default function AdminLibraryView({
  onDeleteMovie,
  onResetDatabase
}: AdminLibraryViewProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const moviesRef = collection(db, "movies");
    const unsubscribe = onSnapshot(moviesRef, (snapshot) => {
      const list: Movie[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Movie);
      });
      list.sort((a, b) => a.name.localeCompare(b.name));
      setMovies(list);
    });

    return () => unsubscribe();
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const term = searchTerm.toLowerCase();
    const matchesName = movie.name?.toLowerCase().includes(term) || false;
    const matchesDirector = movie.director?.toLowerCase().includes(term) || false;
    const matchesGenre = Array.isArray(movie.genre) 
      ? movie.genre.some((g) => g.toLowerCase().includes(term)) 
      : false;
    return matchesName || matchesDirector || matchesGenre;
  });

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in py-6">
      {/* Back to Admin Panel Breadcrumb */}
      <div className="w-full text-left">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Admin Panel</span>
        </Link>
      </div>

      {/* Upper Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <h2 className="text-3xl font-bold font-display text-on-surface tracking-tight text-white">
            Movie Library System
          </h2>
          <p className="text-xs text-on-surface-variant font-sans mt-1 text-white/60">
            Displaying {filteredMovies.length} of {movies.length} matches. You can register, update, and manage entries instantly.
          </p>
        </div>

        {/* Action button groupings */}
        <div className="flex gap-3">
          <button
            id="reset-preset-btn"
            onClick={onResetDatabase}
            className="text-xs font-semibold bg-surface-container-low hover:bg-surface-container-high border border-white/5 text-white px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-300 cursor-pointer"
            title="Restore Default Mock Movies"
          >
            <RefreshCw className="w-4 h-4 text-white/70" />
            <span>Reset Defaults</span>
          </button>
          
          <Link
            to="/admin/add-movie"
            id="add-movie-btn"
            className="text-xs font-semibold bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:scale-98 transition-all duration-300 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cinematic Movie</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:max-w-md">
          <input
            id="admin-search-input"
            type="text"
            placeholder="Search current table listings by title, director, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-white/10 rounded-lg py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-red-600 text-white"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Movies Collection Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-white/5 bg-surface-container-lowest">
        <table className="w-full text-left border-collapse text-xs md:text-sm text-white">
          <thead>
            <tr className="border-b border-white/10 bg-surface-container-low text-white/50 font-display font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-6">Poster & Title</th>
              <th className="py-4 px-4">Metadata</th>
              <th className="py-4 px-4">Crew Details</th>
              <th className="py-4 px-4 text-center">Settings</th>
              <th className="py-4 px-6 text-right">Edit Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredMovies.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-white/40">
                  <div className="flex flex-col items-center gap-2">
                    <Film className="w-8 h-8 text-white/20 animate-pulse" />
                    <span>No record matched search term "{searchTerm}". Try adding a new movie.</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredMovies.map((movie) => (
                <tr 
                  key={movie.id} 
                  id={`movie-row-${movie.id}`}
                  className="hover:bg-surface-container-low/40 transition-colors"
                >
                  {/* Title and Poster */}
                  <td className="py-3 px-6 flex items-center gap-4">
                    <img 
                      referrerPolicy="no-referrer"
                      src={movie.img} 
                      alt={movie.name} 
                      className="w-10 h-14 object-cover rounded shadow-md shrink-0 bg-surface-container-low"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-white text-xs md:text-sm block truncate max-w-[200px]" title={movie.name}>
                        {movie.name}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {movie.genre.slice(0, 2).map((g) => (
                          <span key={g} className="text-[9px] font-mono font-medium text-white/60 bg-white/5 px-1.5 py-0.2 rounded">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Metadata Specs */}
                  <td className="py-3 px-4 font-mono text-[11px] text-white/60">
                    <div className="flex flex-col gap-0.5">
                      <span>{movie.year} • {movie.duration.includes("h") ? movie.duration : `${movie.duration}m`}</span>
                      <span className="text-red-500 font-bold">{movie.type}</span>
                    </div>
                  </td>

                  {/* Director & Lead Actor */}
                  <td className="py-3 px-4 text-xs">
                    <div className="flex flex-col gap-0.5 max-w-[150px] truncate text-white/60">
                      <span><strong className="text-white">Director:</strong> {movie.director}</span>
                      <span><strong className="text-white">Actor:</strong> {movie.leadActor}</span>
                    </div>
                  </td>

                  {/* Settings Markers */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {movie["1and2"] && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                          ★ Featured
                        </span>
                      )}
                      {movie["3and4"] && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-yellow-500 bg-yellow-500/15 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                          🔥 Trending
                        </span>
                      )}
                      {!movie["1and2"] && !movie["3and4"] && (
                        <span className="text-[10px] text-white/30">Standard</span>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-6 text-right">
                    <div className="flex justify-end gap-2.5">
                      <Link
                        to={`/admin/edit-movie/${movie.id}`}
                        id={`edit-movie-row-${movie.id}`}
                        className="p-2 rounded bg-white/5 hover:bg-red-600 hover:text-white text-white/80 transition-all duration-200 cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        id={`delete-movie-row-${movie.id}`}
                        onClick={() => {
                          if (confirm(`Remove "${movie.name}" from theater rosters permanent?`)) {
                            onDeleteMovie(movie.id);
                          }
                        }}
                        className="p-2 rounded bg-white/5 hover:bg-red-700/85 text-white/80 hover:text-white transition-all duration-200 cursor-pointer"
                        title="Remove Movie"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
