import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import { Movie } from "../types/movie";
import { ChevronLeft, Film, Save } from "lucide-react";

export default function ManageTop10() {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [selectedRanks, setSelectedRanks] = useState<(string | null)[]>(Array(10).fill(null));
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  useEffect(() => {
    const moviesRef = collection(db, "movies");
    const unsubscribe = onSnapshot(moviesRef, (snapshot) => {
      const list: Movie[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Movie);
      });
      list.sort((a, b) => a.name.localeCompare(b.name));
      setAllMovies(list);

      if (!isInitialized) {
        const initialRanks = Array(10).fill(null);
        list.forEach((m) => {
          if (m.top10 !== undefined && m.top10 !== null && m.top10 >= 1 && m.top10 <= 10) {
            initialRanks[m.top10 - 1] = m.id;
          }
        });
        setSelectedRanks(initialRanks);
        setIsInitialized(true);
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching movies in ManageTop10:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isInitialized]);

  const handleRankChange = (rankIndex: number, newId: string) => {
    setSelectedRanks((prev) => {
      const next = [...prev];
      const prevVal = next[rankIndex];

      // If the selected movie is already assigned to another rank, swap them
      if (newId) {
        const duplicateIndex = next.indexOf(newId);
        if (duplicateIndex !== -1 && duplicateIndex !== rankIndex) {
          // Swap: place the previous movie of the current rank into the duplicate rank slot
          next[duplicateIndex] = prevVal;
        }
      }

      next[rankIndex] = newId || null;
      return next;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const batch = writeBatch(db);

      // Find movies that were previously in the Top 10 but are no longer selected
      const previousTop10Movies = allMovies.filter(
        (m) => m.top10 !== undefined && m.top10 !== null && m.top10 > 0
      );

      previousTop10Movies.forEach((movie) => {
        if (!selectedRanks.includes(movie.id)) {
          const docRef = doc(db, "movies", movie.id);
          // Set its rank to null so it doesn't appear in the top 10 list
          batch.update(docRef, { top10: null });
        }
      });

      // Update the 10 selected slots with their new rank numbers (1 to 10)
      selectedRanks.forEach((movieId, index) => {
        if (movieId) {
          const docRef = doc(db, "movies", movieId);
          batch.update(docRef, { top10: index + 1 });
        }
      });

      await batch.commit();

      setModalConfig({
        isOpen: true,
        type: "success",
        message: "Top 10 movie rankings have been updated successfully in the database!",
      });
    } catch (err: any) {
      console.error("Error saving top 10 changes:", err);
      setModalConfig({
        isOpen: true,
        type: "error",
        message: err?.message || "Failed to update rankings. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-20 text-white/50 animate-pulse font-sans">
        <Film className="w-8 h-8 mx-auto mb-2 animate-spin text-red-500" />
        <span>Loading library catalog database...</span>
      </div>
    );
  }

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

      {/* Header and Intro */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <h2 className="text-3xl font-bold font-display text-on-surface tracking-tight text-white">
            Manage Top 10
          </h2>
          <p className="text-xs text-on-surface-variant font-sans mt-1 text-white/60">
            Quickly reorder and assign the top trending titles for Peak 7. Duplicate assignments will automatically swap slots.
          </p>
        </div>
      </div>

      {/* Ranks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 10 }).map((_, index) => {
          const rank = index + 1;
          const selectedMovieId = selectedRanks[index];
          const selectedMovie = allMovies.find((m) => m.id === selectedMovieId);

          return (
            <div
              key={rank}
              className="flex items-center gap-4 bg-surface-container-low border border-white/5 p-4 rounded-xl hover:border-red-600/30 transition-all duration-300 relative group hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
            >
              {/* Rank visual tag */}
              <span className="rank-number-text text-5xl font-black italic select-none shrink-0 w-16 text-center">
                #{rank}
              </span>

              {/* Selector wrapper */}
              <div className="flex-grow flex flex-col gap-1 min-w-0">
                <label
                  htmlFor={`rank-select-${rank}`}
                  className="text-[9px] uppercase font-black tracking-widest text-white/40 font-mono text-left"
                >
                  Rank {rank} Assignment
                </label>
                <select
                  id={`rank-select-${rank}`}
                  value={selectedMovieId || ""}
                  onChange={(e) => handleRankChange(index, e.target.value)}
                  className="w-full bg-[#1c1d1f] border border-white/10 p-2.5 text-xs text-white rounded focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="">-- Empty Rank --</option>
                  {allMovies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.name} ({movie.year})
                    </option>
                  ))}
                </select>
              </div>

              {/* Poster Preview */}
              <div className="w-12 h-16 bg-[#16171a] rounded overflow-hidden border border-white/10 flex items-center justify-center shrink-0 shadow-md">
                {selectedMovie ? (
                  <img
                    referrerPolicy="no-referrer"
                    src={selectedMovie.img}
                    alt={selectedMovie.name}
                    className="w-full h-full object-cover animate-fade-in"
                  />
                ) : (
                  <Film className="w-4 h-4 text-white/10" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Trigger Save */}
      <div className="flex justify-center w-full mt-6 pb-12 border-t border-outline-variant/10 pt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-10 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold tracking-widest rounded uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(229,9,20,0.3)] hover:scale-98 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? "Saving Ranks..." : "Save Top 10 Changes"}</span>
        </button>
      </div>

      {/* Modal Dialog */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#121315] border border-white/10 rounded-xl p-6 shadow-2xl flex flex-col gap-4 animate-scale-in">
            <div className="flex items-center gap-3">
              {modalConfig.type === "success" ? (
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <h3 className="text-base font-bold font-display text-white uppercase tracking-wider">
                {modalConfig.type === "success" ? "Success" : "Error"}
              </h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed font-sans pl-1">
              {modalConfig.message}
            </p>

            <div className="flex justify-end mt-2">
              <button
                onClick={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
                className={`px-6 py-2 rounded text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors ${
                  modalConfig.type === "success"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
