import React, { useState } from "react";
import { Movie } from "../types/movie";
import { Plus, Edit2, Trash2, X, Film, Check, ExternalLink, RefreshCw } from "lucide-react";

interface AdminDashboardViewProps {
  movies: Movie[];
  onAddMovie: (movie: Movie) => void;
  onEditMovie: (movie: Movie) => void;
  onDeleteMovie: (id: string) => void;
  onResetDatabase: () => void;
}

export default function AdminDashboardView({
  movies,
  onAddMovie,
  onEditMovie,
  onDeleteMovie,
  onResetDatabase
}: AdminDashboardViewProps) {
  // Modal controllers
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentEditMovie, setCurrentEditMovie] = useState<Movie | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // Form State Values
  const [formData, setFormData] = useState({
    name: "",
    year: "2024",
    duration: "120",
    leadActor: "",
    director: "",
    genre: "", // Comma-separated in entry, array in submission
    rating: "PG-13",
    trailer: "",
    synopsis: "",
    type: "4K Laser",
    img: "",
    "1and2": false, // Featured
    "3and4": false, // Trending
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleOpenAdd = () => {
    setCurrentEditMovie(null);
    setFormData({
      name: "",
      year: "2024",
      duration: "120",
      leadActor: "",
      director: "",
      genre: "Action, Thriller",
      rating: "PG-13",
      trailer: "https://www.youtube.com/watch?v=giXcoY9YXT4",
      synopsis: "",
      type: "4K Laser",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAUqGxzZbsIEXHXbRIe6eKOz5ECyQt6qjYS3hDNx-ljH20Ya3cSFpGdEuP7GnvEw6woEi02C8ZlwNaKM80EfOb08_lCquK5NuK0xPN8PECV0GhQWpDhfBvNbhv2VCZAGyVInSx_hZk9_F-IjoiqwzG2X4hKmU7S38PgLQmQhrEBSCmGd_pvdDsPHdm_FLyNFLfgbkH2vor-CiXuazqPSwbI2plci6lNT8P0SF0W61TGVEfafJAld-qJTilkJY8FDFShCNaZX1ihT1B4",
      "1and2": false,
      "3and4": false,
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEdit = (movie: Movie) => {
    setCurrentEditMovie(movie);
    setFormData({
      name: movie.name,
      year: movie.year,
      duration: movie.duration,
      leadActor: movie.leadActor,
      director: movie.director,
      genre: movie.genre.join(", "),
      rating: movie.rating,
      trailer: movie.trailer,
      synopsis: movie.synopsis,
      type: movie.type,
      img: movie.img,
      "1and2": !!movie["1and2"],
      "3and4": !!movie["3and4"],
    });
    setFormErrors({});
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Title is required";
    if (!formData.year.trim()) errors.year = "Year is required";
    if (!formData.duration.trim()) errors.duration = "Duration is required";
    if (!formData.leadActor.trim()) errors.leadActor = "Lead Actor is required";
    if (!formData.director.trim()) errors.director = "Director is required";
    if (!formData.genre.trim()) errors.genre = "At least one genre is required";
    if (!formData.img.trim()) errors.img = "Poster image url is required";
    if (!formData.trailer.trim()) errors.trailer = "Trailer URL is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Convert comma sequence to array
    const genreArray = formData.genre
      .split(",")
      .map((g) => g.trim())
      .filter((g) => g.length > 0);

    const submissionMovie: Movie = {
      id: currentEditMovie ? currentEditMovie.id : `movie-${Date.now()}`,
      name: formData.name.trim(),
      year: formData.year.trim(),
      duration: formData.duration.trim(),
      leadActor: formData.leadActor.trim(),
      director: formData.director.trim(),
      genre: genreArray,
      rating: formData.rating,
      trailer: formData.trailer.trim(),
      synopsis: formData.synopsis.trim(),
      type: formData.type,
      img: formData.img.trim(),
      "1and2": formData["1and2"],
      "3and4": formData["3and4"],
      location: "all"
    };

    if (currentEditMovie) {
      onEditMovie(submissionMovie);
    } else {
      onAddMovie(submissionMovie);
    }
    setIsFormOpen(false);
  };

  const filteredMovies = movies.filter((movie) =>
    movie.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.genre.some((g) => g.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in py-6">
      {/* Upper Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <h2 className="text-3xl font-bold font-display text-on-surface tracking-tight">
            Movie Library System
          </h2>
          <p className="text-xs text-on-surface-variant font-sans mt-1">
            Displaying {filteredMovies.length} of {movies.length} matches. You can register, update, and manage entries instantly.
          </p>
        </div>

        {/* Action button groupings */}
        <div className="flex gap-3">
          <button
            id="reset-preset-btn"
            onClick={onResetDatabase}
            className="text-xs font-semibold bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all duration-300"
            title="Restore Default Mock Movies"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Defaults</span>
          </button>
          
          <button
            id="add-movie-btn"
            onClick={handleOpenAdd}
            className="text-xs font-semibold bg-primary-container text-on-primary-container hover:bg-primary-container/90 px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(229,9,20,0.3)] hover:scale-98 transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span>Add Cinematic Movie</span>
          </button>
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
            className="w-full bg-surface-container-low border border-outline-variant/40 rounded-lg py-2 pl-4 pr-10 text-xs focus:outline-none focus:border-primary-container text-on-surface"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Movies Collection Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-outline-variant/25 bg-surface-container-lowest">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-low text-on-surface-variant font-display font-bold uppercase tracking-wider text-[10px]">
              <th className="py-4 px-6">Poster & Title</th>
              <th className="py-4 px-4">Metadata</th>
              <th className="py-4 px-4">Crew Details</th>
              <th className="py-4 px-4 text-center">Settings</th>
              <th className="py-4 px-6 text-right">Edit Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/15">
            {filteredMovies.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center gap-2">
                    <Film className="w-8 h-8 text-outline/30 animate-pulse" />
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
                      className="w-10 h-14 object-cover rounded shadow-md shrink-0 bg-surface-container"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-on-surface text-xs md:text-sm block truncate max-w-[200px]" title={movie.name}>
                        {movie.name}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {movie.genre.slice(0, 2).map((g) => (
                          <span key={g} className="text-[9px] font-mono font-medium text-secondary bg-secondary/10 px-1.5 py-0.2 rounded">
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>

                  {/* Metadata Specs */}
                  <td className="py-3 px-4 font-mono text-[11px] text-on-surface-variant">
                    <div className="flex flex-col gap-0.5">
                      <span>{movie.year} • {movie.duration.includes("h") ? movie.duration : `${movie.duration}m`}</span>
                      <span className="text-primary">{movie.type}</span>
                    </div>
                  </td>

                  {/* Director & Lead Actor */}
                  <td className="py-3 px-4 text-xs">
                    <div className="flex flex-col gap-0.5 max-w-[150px] truncate text-on-surface-variant">
                      <span><strong className="text-on-surface">Director:</strong> {movie.director}</span>
                      <span><strong className="text-on-surface">Actor:</strong> {movie.leadActor}</span>
                    </div>
                  </td>

                  {/* Settings Markers */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-1">
                      {movie["1and2"] && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-primary-container bg-primary-container/10 border border-primary-container/20 px-2 py-0.5 rounded-full">
                          ★ Featured
                        </span>
                      )}
                      {movie["3and4"] && (
                        <span className="text-[9px] uppercase font-bold tracking-wider text-yellow-500 bg-yellow-500/15 border border-yellow-500/30 px-2 py-0.5 rounded-full">
                          🔥 Trending
                        </span>
                      )}
                      {!movie["1and2"] && !movie["3and4"] && (
                        <span className="text-[10px] text-outline/40">Standard</span>
                      )}
                    </div>
                  </td>

                  {/* Actions Column */}
                  <td className="py-3 px-6 text-right">
                    <div className="flex justify-end gap-2.5">
                      <button
                        id={`edit-movie-row-${movie.id}`}
                        onClick={() => handleOpenEdit(movie)}
                        className="p-2 rounded bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-on-primary-container transition-all duration-200"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        id={`delete-movie-row-${movie.id}`}
                        onClick={() => {
                          if (confirm(`Remove "${movie.name}" from theater rosters permanent?`)) {
                            onDeleteMovie(movie.id);
                          }
                        }}
                        className="p-2 rounded bg-surface-container-high hover:bg-red-700/85 text-on-surface hover:text-white transition-all duration-200"
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

      {/* Add / Edit Overlay Form Popover */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div 
            id="movie-form-modal"
            className="w-full max-w-2xl bg-surface-container-low border border-outline-variant/35 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-scale-up"
          >
            {/* Modal Title Banner */}
            <div className="bg-surface-container flex justify-between items-center px-6 py-4 border-b border-outline-variant/20">
              <span className="font-display font-bold text-lg text-on-surface flex items-center gap-2">
                <Film className="w-5 h-5 text-primary-container" />
                {currentEditMovie ? `Update: ${currentEditMovie.name}` : "Register New Showcase"}
              </span>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-on-surface-variant hover:text-on-surface w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Fields Inputs */}
            <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
              {/* Form Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                    Movie Title *
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs md:text-sm text-on-surface rounded"
                    placeholder="e.g., Dune Trilogy Part Two"
                    required
                  />
                  {formErrors.name && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.name}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                    Sub-Curation / Project Type *
                  </label>
                  <select
                    id="form-type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs md:text-sm text-on-surface rounded"
                  >
                    <option value="IMAX">IMAX Cinematic</option>
                    <option value="4K Laser">4K Laser Atmos</option>
                    <option value="4K HDR">4K HDR Standard</option>
                    <option value="Dolby Vision">Dolby Vision Surround</option>
                    <option value="3D Atmos">3D Real-D Atmos</option>
                  </select>
                </div>
              </div>

              {/* Form Row 2 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                    Release Year *
                  </label>
                  <input
                    id="form-year"
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs text-on-surface rounded"
                    placeholder="e.g., 2024"
                    required
                  />
                  {formErrors.year && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.year}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                    Duration (min or formatted) *
                  </label>
                  <input
                    id="form-duration"
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs text-on-surface rounded"
                    placeholder="e.g., 159 or 2h 15m"
                    required
                  />
                  {formErrors.duration && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.duration}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                    Rating Tier *
                  </label>
                  <select
                    id="form-rating"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs text-on-surface rounded"
                  >
                    <option value="G">G (General)</option>
                    <option value="PG">PG</option>
                    <option value="PG-13">PG-13 (Parents Caution)</option>
                    <option value="R">R (Restricted)</option>
                    <option value="NC-17">NC-17</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                    Genres (Comma separated) *
                  </label>
                  <input
                    id="form-genre"
                    type="text"
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                    className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs text-on-surface rounded"
                    placeholder="Sci-Fi, Action, Thriller"
                    required
                  />
                  {formErrors.genre && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.genre}</span>}
                </div>
              </div>

              {/* Form Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                    Director Crew Leader *
                  </label>
                  <input
                    id="form-director"
                    type="text"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs md:text-sm text-on-surface rounded"
                    placeholder="Denis Villeneuve"
                    required
                  />
                  {formErrors.director && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.director}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                    Lead Actor / Actress *
                  </label>
                  <input
                    id="form-leadActor"
                    type="text"
                    value={formData.leadActor}
                    onChange={(e) => setFormData({ ...formData, leadActor: e.target.value })}
                    className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs md:text-sm text-on-surface rounded"
                    placeholder="Timothée Chalamet"
                    required
                  />
                  {formErrors.leadActor && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.leadActor}</span>}
                </div>
              </div>

              {/* Form Row 4 URLs */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                  Poster Image High-Res URL *
                </label>
                <input
                  id="form-img"
                  type="url"
                  value={formData.img}
                  onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                  className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs text-on-surface rounded"
                  placeholder="https://images.unsplash.com/..."
                  required
                />
                {formErrors.img && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.img}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                  YouTube Trailer Link (watch or embed format) *
                </label>
                <input
                  id="form-trailer"
                  type="url"
                  value={formData.trailer}
                  onChange={(e) => setFormData({ ...formData, trailer: e.target.value })}
                  className="bg-surface-container border-b border-outline-variant/50 focus:border-primary-container focus:outline-none p-2 text-xs text-on-surface rounded"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
                {formErrors.trailer && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.trailer}</span>}
              </div>

              {/* Synopsis narrative textarea box */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-on-surface-variant upper font-display tracking-wide">
                  Synopsis & Theater Plot Description
                </label>
                <textarea
                  id="form-synopsis"
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  rows={3}
                  className="bg-surface-container border border-outline-variant/40 focus:border-primary-container focus:outline-none p-2.5 text-xs md:text-sm text-on-surface rounded-lg"
                  placeholder="Provide a detailed, intriguing summary of the movie..."
                />
              </div>

              {/* Spotlights and Tags */}
              <div className="bg-surface-container p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-around gap-4 border border-outline-variant/25">
                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold uppercase font-display select-none">
                  <input
                    id="form-1and2"
                    type="checkbox"
                    checked={formData["1and2"]}
                    onChange={(e) => setFormData({ ...formData, "1and2": e.target.checked })}
                    className="w-4.5 h-4.5 bg-surface rounded border-outline-variant focus:ring-primary-container text-primary-container"
                  />
                  <span>Featured Hero Carousel Spotlight</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer text-xs font-semibold uppercase font-display select-none">
                  <input
                    id="form-3and4"
                    type="checkbox"
                    checked={formData["3and4"]}
                    onChange={(e) => setFormData({ ...formData, "3and4": e.target.checked })}
                    className="w-4.5 h-4.5 bg-surface rounded border-outline-variant focus:ring-primary-container text-primary-container"
                  />
                  <span>"Trending Now" Carousel Badge</span>
                </label>
              </div>

              {/* Submit panel */}
              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded text-xs font-semibold text-on-surface hover:bg-surface-container border border-outline-variant/35 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="form-save-btn"
                  type="submit"
                  className="px-6 py-2.5 rounded bg-primary-container text-on-primary-container hover:bg-primary-container/90 text-xs font-bold tracking-wide transition-all uppercase"
                >
                  {currentEditMovie ? "Save Modifications" : "Complete Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
