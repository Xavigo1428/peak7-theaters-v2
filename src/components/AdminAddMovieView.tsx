import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Movie } from "../types/movie";
import { Film, ChevronLeft, ArrowRight } from "lucide-react";
import { doc, onSnapshot, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const toLocalDateTimeString = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const capitalizeTitle = (title: string) => {
  return title
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 1200): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        resolve(compressedBase64);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

interface AdminAddMovieViewProps {
  onAddMovie?: (movie: Movie) => Promise<void> | void;
  onEditMovie?: (movie: Movie) => Promise<void> | void;
}

export default function AdminAddMovieView({
  onAddMovie,
  onEditMovie
}: AdminAddMovieViewProps) {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  // Form State Values
  const [formData, setFormData] = useState<{
    name: string;
    year: string;
    duration: string;
    leadActor: string;
    director: string;
    genre: string[];
    rating: string;
    trailer: string;
    synopsis: string;
    type: string;
    img: string;
    "1and2": boolean;
    "3and4": boolean;
    timestamp: string;
  }>({
    name: "",
    year: "",
    duration: "",
    leadActor: "",
    director: "",
    genre: [],
    rating: "",
    trailer: "",
    synopsis: "",
    type: "",
    img: "",
    "1and2": true,
    "3and4": true,
    timestamp: toLocalDateTimeString(new Date()),
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [top10Val, setTop10Val] = useState<number | null | undefined>(undefined);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({
    isOpen: false,
    type: "success",
    message: "",
  });

  // Populate data in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const docRef = doc(db, "movies", id);
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const movieToEdit = { id: docSnap.id, ...docSnap.data() } as Movie;
            setTop10Val(movieToEdit.top10);
            let tsDate = new Date();
            if (movieToEdit.timestamp) {
              if (typeof movieToEdit.timestamp.toDate === "function") {
                tsDate = movieToEdit.timestamp.toDate();
              } else {
                tsDate = new Date(movieToEdit.timestamp);
              }
            }
            setFormData({
              name: movieToEdit.name || "",
              year: movieToEdit.year || "",
              duration: movieToEdit.duration || "",
              leadActor: movieToEdit.leadActor || "",
              director: movieToEdit.director || "",
              genre: Array.isArray(movieToEdit.genre) ? movieToEdit.genre : [],
              rating: movieToEdit.rating || "G",
              trailer: movieToEdit.trailer || "",
              synopsis: movieToEdit.synopsis || "",
              type: movieToEdit.type || "DVD Quality",
              img: movieToEdit.img || "",
              "1and2": !!movieToEdit["1and2"],
              "3and4": !!movieToEdit["3and4"],
              timestamp: toLocalDateTimeString(tsDate),
            });
          }
        },
        (error) => {
          console.error("Error loading movie details from Firestore:", error);
        }
      );
      return () => unsubscribe();
    }
  }, [id, isEditMode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Image must be less than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        compressImage(reader.result).then((compressed) => {
          setFormData((prev) => ({ ...prev, img: compressed }));
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    // Name validation
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      errors.name = "Title is required";
    } else if (nameTrimmed.length > 150) {
      errors.name = "Title cannot exceed 150 characters";
    }

    // Year validation
    const yearTrimmed = formData.year.trim();
    if (!yearTrimmed) {
      errors.year = "Year is required";
    } else {
      const yearNum = parseInt(yearTrimmed, 10);
      if (isNaN(yearNum) || yearNum.toString() !== yearTrimmed) {
        errors.year = "Year must be a valid number";
      } else if (yearNum < 1900 || yearNum > 2050) {
        errors.year = "Year must be between 1900 and 2050";
      }
    }

    // Duration validation
    const durationTrimmed = formData.duration.trim();
    if (!durationTrimmed) {
      errors.duration = "Duration is required";
    } else {
      const durationNum = parseInt(durationTrimmed, 10);
      if (isNaN(durationNum) || durationNum.toString() !== durationTrimmed || durationNum <= 0) {
        errors.duration = "Duration must be a positive number of minutes";
      } else if (durationNum > 240) {
        errors.duration = "Duration cannot exceed 240 minutes (4 hours)";
      }
    }

    // Lead Actor validation
    const leadActorTrimmed = formData.leadActor.trim();
    if (!leadActorTrimmed) {
      errors.leadActor = "Lead Actor is required";
    } else if (leadActorTrimmed.length > 100) {
      errors.leadActor = "Lead Actor cannot exceed 100 characters";
    }

    // Director validation
    const directorTrimmed = formData.director.trim();
    if (!directorTrimmed) {
      errors.director = "Director is required";
    } else if (directorTrimmed.length > 100) {
      errors.director = "Director cannot exceed 100 characters";
    }

    // Genre validation
    if (formData.genre.length === 0) {
      errors.genre = "At least one genre is required";
    }

    // Rating validation
    if (!formData.rating) {
      errors.rating = "Rating is required";
    }

    // Type validation
    if (!formData.type) {
      errors.type = "Type is required";
    }

    // Trailer validation
    const trailerTrimmed = formData.trailer.trim();
    if (trailerTrimmed) {
      try {
        new URL(trailerTrimmed);
        if (trailerTrimmed.length > 500) {
          errors.trailer = "Trailer URL cannot exceed 500 characters";
        }
      } catch (_) {
        errors.trailer = "Trailer must be a valid URL (e.g., https://...)";
      }
    }

    // Synopsis validation
    const synopsisTrimmed = formData.synopsis.trim();
    if (synopsisTrimmed && synopsisTrimmed.length > 1000) {
      errors.synopsis = `Synopsis cannot exceed 1000 characters`;
    }

    // Image validation
    if (!formData.img.trim()) {
      errors.img = "Poster image file is required";
    }

    // Timestamp validation
    if (!formData.timestamp) {
      errors.timestamp = "Timestamp is required";
    } else {
      const tsDate = new Date(formData.timestamp);
      if (isNaN(tsDate.getTime())) {
        errors.timestamp = "Invalid timestamp date/time";
      } else {
        const tsYear = tsDate.getFullYear();
        if (tsYear < 1900 || tsYear > 2100) {
          errors.timestamp = "Timestamp year must be between 1900 and 2100";
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setModalConfig({ isOpen: false, type: "success", message: "" });
    setIsSaving(true);

    const capitalizedName = capitalizeTitle(formData.name);

    if (!isEditMode) {
      try {
        const moviesRef = collection(db, "movies");
        const querySnapshot = await getDocs(moviesRef);
        const nameExists = querySnapshot.docs.some((docSnap) => {
          const m = docSnap.data();
          return (
            m.name &&
            m.name.toLowerCase().trim() === capitalizedName.toLowerCase().trim()
          );
        });

        if (nameExists) {
          setModalConfig({
            isOpen: true,
            type: "error",
            message: `A movie with the name "${capitalizedName}" already exists in the library.`,
          });
          setIsSaving(false);
          return;
        }
      } catch (err: any) {
        console.error("Error checking duplicate movie:", err);
        setModalConfig({
          isOpen: true,
          type: "error",
          message: err?.message || "Failed to verify database duplicates. Please try again.",
        });
        setIsSaving(false);
        return;
      }
    }

    const submissionMovie: Movie = {
      id: isEditMode && id ? id : `movie-${Date.now()}`,
      name: capitalizedName,
      year: formData.year.trim(),
      duration: formData.duration.trim(),
      leadActor: formData.leadActor.trim(),
      director: formData.director.trim(),
      genre: formData.genre,
      rating: formData.rating,
      trailer: formData.trailer.trim(),
      synopsis: formData.synopsis.trim(),
      type: formData.type,
      img: formData.img.trim(),
      "1and2": formData["1and2"],
      "3and4": formData["3and4"],
      location: "all",
      timestamp: new Date(formData.timestamp)
    };

    if (top10Val !== undefined) {
      submissionMovie.top10 = top10Val;
    }

    try {
      if (isEditMode && onEditMovie) {
        await onEditMovie(submissionMovie);
        setModalConfig({
          isOpen: true,
          type: "success",
          message: "Movie updated successfully!",
        });
      } else if (onAddMovie) {
        await onAddMovie(submissionMovie);
        setModalConfig({
          isOpen: true,
          type: "success",
          message: "Movie added successfully!",
        });
        setFormData({
          name: "",
          year: "",
          duration: "",
          leadActor: "",
          director: "",
          genre: [],
          rating: "",
          trailer: "",
          synopsis: "",
          type: "",
          img: "",
          "1and2": true,
          "3and4": true,
          timestamp: toLocalDateTimeString(new Date()),
        });
      }
    } catch (error: any) {
      console.error("Error saving movie:", error);
      setModalConfig({
        isOpen: true,
        type: "error",
        message: error?.message || "Failed to save the movie. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const ALL_GENRES = [
    "Action", "Adventure", "Animated", "Comedy",
    "Children", "Crime", "Drama", "Documentary",
    "Epic", "Family", "Fantasy", "Holiday", "Horror",
    "Musical", "Romance", "Sci-Fi", "Spy", "Sports",
    "Satire", "Top Rated", "Thriller", "Trending Now",
    "War"
  ];

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-fade-in py-6">
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

      <div className="bg-black border border-white/20 p-8 rounded-xl flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="text-center pb-4 border-b border-white/10 mb-2">
          <h2 className="text-xl font-bold font-display text-white tracking-wide uppercase">
            {isEditMode ? "Edit Movie" : "Add Movie"}
          </h2>
        </div>



        {/* Credentials Form */}
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
          
          {/* Main Grid for Inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Side: General Info */}
            <div className="flex flex-col gap-4">
              
              {/* Name */}
              <div className="flex flex-col gap-1 w-full">
                <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                  Name <span className="text-red-500 font-bold ml-0.5">*</span>
                </span>
                <input
                  id="form-name"
                  type="text"
                  placeholder="E.g., Star Wars"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#1c1d1f] border border-white/10 p-2.5 text-xs text-white rounded focus:outline-none focus:border-blue-500"
                  maxLength={150}
                  required
                />
                {formErrors.name && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.name}</span>}
              </div>

              <div className="border-b border-white/10 my-1"></div>

              {/* Location */}
              <div className="flex flex-col gap-2 w-full">
                <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">Location</span>
                <div className="flex gap-8 items-center pl-2">
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] text-white/70 tracking-wide font-sans">Theaters 3and4</span>
                    <input
                      type="checkbox"
                      checked={formData["3and4"]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, "3and4": e.target.checked }))}
                      className="w-4.5 h-4.5 bg-black border border-white/20 rounded focus:ring-blue-500 text-blue-500 cursor-pointer"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="text-[11px] text-white/70 tracking-wide font-sans">Theaters 1and2</span>
                    <input
                      type="checkbox"
                      checked={formData["1and2"]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, "1and2": e.target.checked }))}
                      className="w-4.5 h-4.5 bg-black border border-white/20 rounded focus:ring-blue-500 text-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Timestamp (Hidden) */}
              <input type="hidden" value={formData.timestamp} />

              <div className="border-b border-white/10 my-1"></div>

              {/* Year & Duration */}
              <div className="flex items-center gap-4 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                    Year <span className="text-red-500 font-bold ml-0.5">*</span>
                  </span>
                  <input
                    id="form-year"
                    type="text"
                    placeholder="E.g., 2017"
                    value={formData.year}
                    onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                    className="w-full bg-[#1c1d1f] border border-white/10 p-2.5 text-xs text-white rounded focus:outline-none focus:border-blue-500"
                    maxLength={4}
                    required
                  />
                  {formErrors.year && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.year}</span>}
                </div>
                <span className="text-white/40 self-end mb-2.5 font-bold">&</span>
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                    Duration (in minutes) <span className="text-red-500 font-bold ml-0.5">*</span>
                  </span>
                  <input
                    id="form-duration"
                    type="text"
                    placeholder="E.g., 135"
                    value={formData.duration}
                    onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                    className="w-full bg-[#1c1d1f] border border-white/10 p-2.5 text-xs text-white rounded focus:outline-none focus:border-blue-500"
                    maxLength={3}
                    required
                  />
                  {formErrors.duration && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.duration}</span>}
                </div>
              </div>

              <div className="border-b border-white/10 my-1"></div>

              {/* Lead Actor & Director */}
              <div className="flex items-center gap-4 w-full">
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                    Lead Actor <span className="text-red-500 font-bold ml-0.5">*</span>
                  </span>
                  <input
                    id="form-leadActor"
                    type="text"
                    placeholder="E.g., Bill Murray"
                    value={formData.leadActor}
                    onChange={(e) => setFormData((prev) => ({ ...prev, leadActor: e.target.value }))}
                    className="w-full bg-[#1c1d1f] border border-white/10 p-2.5 text-xs text-white rounded focus:outline-none focus:border-blue-500"
                    maxLength={100}
                    required
                  />
                  {formErrors.leadActor && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.leadActor}</span>}
                </div>
                <span className="text-white/40 self-end mb-2.5 font-bold">&</span>
                <div className="flex flex-col gap-1 w-full">
                  <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                    Director <span className="text-red-500 font-bold ml-0.5">*</span>
                  </span>
                  <input
                    id="form-director"
                    type="text"
                    placeholder="E.g., Quentin Tarantino"
                    value={formData.director}
                    onChange={(e) => setFormData((prev) => ({ ...prev, director: e.target.value }))}
                    className="w-full bg-[#1c1d1f] border border-white/10 p-2.5 text-xs text-white rounded focus:outline-none focus:border-blue-500"
                    maxLength={100}
                    required
                  />
                  {formErrors.director && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.director}</span>}
                </div>
              </div>

            </div>

            {/* Right Side: Genres */}
            <div className="flex flex-col gap-4">
              
              {/* Genre Grid */}
              <div className="flex flex-col gap-3 w-full">
                <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                  Genre <span className="text-red-500 font-bold ml-0.5">*</span>
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-4 gap-x-2 text-center items-center">
                  {ALL_GENRES.map((g) => {
                    const isChecked = formData.genre.includes(g);
                    return (
                      <div key={g} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] text-white/70 tracking-wide font-sans">{g}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData((prev) => ({ ...prev, genre: [...prev.genre, g] }));
                            } else {
                              setFormData((prev) => ({ ...prev, genre: prev.genre.filter((genre) => genre !== g) }));
                            }
                          }}
                          className="w-4.5 h-4.5 bg-black border border-white/20 rounded focus:ring-blue-500 text-blue-500 cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
                {formErrors.genre && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.genre}</span>}
              </div>

            </div>

          </div>

          <div className="border-b border-white/10 my-2"></div>

          {/* Row 3: Rating and Type side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24">
            
            {/* Rating */}
            <div className="flex flex-col gap-2.5 w-full">
              <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                Rating <span className="text-red-500 font-bold ml-0.5">*</span>
              </span>
              <div className="flex flex-col items-start gap-4 w-full">
                <div className="flex justify-between w-full pr-4">
                  {["G", "NR-R", "NR-G", "PG", "PG-13", "R"].map((r) => (
                    <div key={r} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] text-white/70 tracking-wide font-mono">{r}</span>
                      <input
                        type="radio"
                        name="rating"
                        value={r}
                        checked={formData.rating === r}
                        onChange={() => setFormData((prev) => ({ ...prev, rating: r }))}
                        className="w-4 h-4 bg-black border border-white/20 rounded-full focus:ring-blue-500 text-blue-500 cursor-pointer"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-white/70 tracking-wide font-mono">TV-G</span>
                    <input
                      type="radio"
                      name="rating"
                      value="TV-G"
                      checked={formData.rating === "TV-G"}
                      onChange={() => setFormData((prev) => ({ ...prev, rating: "TV-G" }))}
                      className="w-4 h-4 bg-black border border-white/20 rounded-full focus:ring-blue-500 text-blue-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
              {formErrors.rating && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.rating}</span>}
            </div>

            {/* Type */}
            <div className="flex flex-col gap-2.5 w-full">
              <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                Type <span className="text-red-500 font-bold ml-0.5">*</span>
              </span>
              <div className="flex justify-between w-full">
                {["DVD Quality", "4K HDR", "Blu-ray", "4K Ultra HD"].map((t) => (
                  <div key={t} className="flex flex-col items-center gap-1">
                    <span className="text-[10px] text-white/70 tracking-wide font-mono">{t}</span>
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={formData.type === t}
                      onChange={() => setFormData((prev) => ({ ...prev, type: t }))}
                      className="w-4 h-4 bg-black border border-white/20 rounded-full focus:ring-blue-500 text-blue-500 cursor-pointer"
                    />
                  </div>
                ))}
              </div>
              {formErrors.type && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.type}</span>}
            </div>

          </div>

          <div className="border-b border-white/10 my-2"></div>

          {/* Row 4: Trailer and Image Upload side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Trailer */}
            <div className="flex flex-col gap-1 w-full">
              <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                Trailer <span className="text-yellow-500/80 font-normal lowercase italic">(Optional)</span>
              </span>
              <input
                type="url"
                placeholder="E.g., https://www.youtube.com/watch?v=F88L0Vr-cs"
                value={formData.trailer}
                onChange={(e) => setFormData((prev) => ({ ...prev, trailer: e.target.value }))}
                className="w-full bg-[#1c1d1f] border border-white/10 p-2.5 text-xs text-white rounded focus:outline-none focus:border-blue-500"
                maxLength={500}
              />
              {formErrors.trailer && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.trailer}</span>}
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-1.5 w-full items-start">
              <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
                Image <span className="text-red-500 font-bold ml-0.5">*</span> <span className="text-yellow-500/80 font-normal lowercase italic">(Less than 4MB)</span>
              </span>
              <div className="flex items-center gap-4 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-grow bg-[#1c1d1f] border border-white/10 p-2 text-xs text-white rounded focus:outline-none focus:border-blue-500 cursor-pointer"
                />
                {formData.img && (
                  <div className="relative shrink-0">
                    <img
                      src={formData.img}
                      alt="Preview"
                      className="w-10 h-14 object-cover rounded border border-white/20 shadow-md"
                    />
                  </div>
                )}
              </div>
              {formErrors.img && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.img}</span>}
            </div>

          </div>

          <div className="border-b border-white/10 my-2"></div>

          {/* Row 5: Synopsis full width */}
          <div className="flex flex-col gap-1 w-full">
            <span className="text-xs text-white/60 font-semibold tracking-wide uppercase font-display text-left">
              Synopsis <span className="text-yellow-500/80 font-normal lowercase italic">(Optional)</span>
            </span>
            <textarea
              placeholder="E.g., Atmospheric slow-burn about a Hollywood stuntman whose side job as a getaway driver for criminals earns a bounty on his head after a botched heist."
              value={formData.synopsis}
              onChange={(e) => setFormData((prev) => ({ ...prev, synopsis: e.target.value }))}
              rows={3}
              className="w-full bg-[#1c1d1f] border border-white/10 p-2.5 text-xs text-white rounded focus:outline-none focus:border-blue-500"
              maxLength={1000}
            />
            {formErrors.synopsis && <span className="text-[10px] text-red-400 font-mono mt-0.5">{formErrors.synopsis}</span>}
          </div>

          <div className="border-b border-white/10 my-2"></div>

          {/* Validation Errors List */}
          {Object.keys(formErrors).length > 0 && (
            <div className="w-full text-center flex flex-col gap-1.5 mb-2 animate-fade-in font-sans">
              {Object.values(formErrors).map((errMsg, idx) => (
                <span key={idx} className="text-xs text-red-400 font-semibold">
                  {errMsg}
                </span>
              ))}
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center w-full mt-2">
            <button
              id="form-save-btn"
              type="submit"
              disabled={isSaving}
              className="px-12 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wide rounded uppercase cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal Overlay */}
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
