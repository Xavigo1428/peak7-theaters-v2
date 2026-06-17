import React, { useState, useEffect, useRef } from "react";
import { HashRouter as Router, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import { INITIAL_MOVIES } from "./data/mockMovies";
import { Movie } from "./types/movie";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MovieDetailView from "./components/MovieDetailView";
import AdminLogin from "./components/AdminLogin";
import AdminDashboardView from "./components/AdminDashboardView";
import AdminLibraryView from "./components/AdminLibraryView";
import AdminAddMovieView from "./components/AdminAddMovieView";
import ManageTop10 from "./components/ManageTop10";
import GenreView from "./components/GenreView";
import MovieCarouselShelf from "./components/MovieCarouselShelf";
import ReservationView from "./components/ReservationView";
import LocationsView from "./components/LocationsView";
import TermsView from "./components/TermsView";
import SupportView from "./components/SupportView";
import PrivacyView from "./components/PrivacyView";
import { Play, Info, Flame, Sparkles, ChevronLeft, ChevronRight, Compass, Film, AlertTriangle } from "lucide-react";

// Firebase integrations
import { auth, db } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs, query, where, limit, orderBy } from "firebase/firestore";

function AppContent() {
  const navigate = useNavigate();
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [top10Movies, setTop10Movies] = useState<Movie[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelectMovie = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // Load from Firebase on mount
  useEffect(() => {
    const moviesRef = collection(db, "movies");

    // 1. Check if database needs seeding (once on mount)
    getDocs(query(moviesRef, limit(1))).then((snapshot) => {
      if (snapshot.empty) {
        seedDatabase();
      }
    });

    // 2. Query Top 10 Movies for Hero Slider
    const qTop10 = query(moviesRef, where("top10", ">", 0), orderBy("top10", "asc"), limit(10));
    const unsubscribeTop10 = onSnapshot(qTop10, (snapshot) => {
      const list: Movie[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Movie);
      });
      setTop10Movies(list);
    }, (error) => {
      console.error("Error loading top 10 movies for hero slider:", error);
    });

    // 3. Listen to Firebase Auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => {
      unsubscribeTop10();
      unsubscribeAuth();
    };
  }, []);

  // Load ALL movies for Admin or Search
  useEffect(() => {
    if (!isAuthenticated && !searchQuery.trim()) {
      setAllMovies([]);
      return;
    }

    const moviesRef = collection(db, "movies");
    const unsubscribe = onSnapshot(moviesRef, (snapshot) => {
      const moviesList: Movie[] = [];
      snapshot.forEach((docSnap) => {
        moviesList.push({ id: docSnap.id, ...docSnap.data() } as Movie);
      });
      moviesList.sort((a, b) => a.name.localeCompare(b.name));
      setAllMovies(moviesList);
    });

    return () => unsubscribe();
  }, [isAuthenticated, searchQuery]);

  // Seeding helper
  const seedDatabase = async () => {
    try {
      const moviesRef = collection(db, "movies");
      for (const movie of INITIAL_MOVIES) {
        const { id, ...movieData } = movie;
        await setDoc(doc(moviesRef, id), movieData);
      }
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  };

  // Auth helper
  const handleLogin = () => {
    // This is called on success, but onAuthStateChanged listener also handles this
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  // Movie actions
  const handleAddMovie = async (newMovie: Movie) => {
    try {
      const { id, ...movieData } = newMovie;
      const docId = id || doc(collection(db, "movies")).id;
      await setDoc(doc(db, "movies", docId), movieData);
    } catch (error) {
      console.error("Error adding movie:", error);
      throw error;
    }
  };

  const handleEditMovie = async (updatedMovie: Movie) => {
    try {
      const { id, ...movieData } = updatedMovie;
      if (!id) throw new Error("Movie ID is required");
      await setDoc(doc(db, "movies", id), movieData);
    } catch (error) {
      console.error("Error editing movie:", error);
      throw error;
    }
  };

  const handleDeleteMovie = async (id: string) => {
    try {
      await deleteDoc(doc(db, "movies", id));
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Error deleting movie from Firestore: " + error);
    }
  };

  const handleResetDatabase = async () => {
    if (confirm("This will overwrite your Firestore collection and restore the defaults. Proceed?")) {
      try {
        const moviesRef = collection(db, "movies");
        const querySnapshot = await getDocs(moviesRef);
        for (const docSnap of querySnapshot.docs) {
          await deleteDoc(docSnap.ref);
        }
        await seedDatabase();
        alert("Database reset successfully!");
      } catch (error) {
        console.error("Error resetting database:", error);
        alert("Error resetting database: " + error);
      }
    }
  };

  const searchResults = searchQuery.trim()
    ? allMovies.filter((m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.leadActor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-on-surface">
      {/* Navigation Head */}
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onSearch={setSearchQuery}
      />

      {/* Dynamic Route Content */}
      <main className="flex-grow w-full">
        <Routes>
          {/* Catalog / Guest Area */}
          <Route
            path="/"
            element={
              <GuestCatalogView
                top10Movies={top10Movies}
                searchResults={searchResults}
                searchQuery={searchQuery}
                onSelectMovie={handleSelectMovie}
              />
            }
          />

          {/* Movie Detail Dedicated Page Route */}
          <Route
            path="/movie/:id"
            element={<MovieDetailView />}
          />

          {/* Dedicated Genre Route */}
          <Route
            path="/genre/:genreName"
            element={
              <GenreView onSelectMovie={handleSelectMovie} />
            }
          />

          {/* Dedicated Movie Theater Schedule Page Route (Redirected to Reservation) */}
          <Route
            path="/schedule"
            element={<Navigate to="/reservation" replace />}
          />

          {/* Dedicated Reservation Info Page Route */}
          <Route
            path="/reservation"
            element={<ReservationView />}
          />

          {/* Footer Pages */}
          <Route
            path="/locations"
            element={<LocationsView />}
          />
          <Route
            path="/terms"
            element={<TermsView />}
          />
          <Route
            path="/support"
            element={<SupportView />}
          />
          <Route
            path="/privacy"
            element={<PrivacyView />}
          />

          {/* Admin Management Area */}
          <Route
            path="/admin"
            element={
              isAuthenticated ? (
                <div className="max-w-7xl mx-auto px-4 md:px-16 py-8">
                  <AdminDashboardView />
                </div>
              ) : (
                <div className="max-w-7xl mx-auto px-4 md:px-16 py-8 flex items-center justify-center min-h-[60vh]">
                  <AdminLogin onLoginSuccess={handleLogin} />
                </div>
              )
            }
          />
          <Route
            path="/admin/library"
            element={
              isAuthenticated ? (
                <div className="max-w-7xl mx-auto px-4 md:px-16 py-8">
                  <AdminLibraryView
                    onDeleteMovie={handleDeleteMovie}
                    onResetDatabase={handleResetDatabase}
                  />
                </div>
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
          <Route
            path="/admin/manage-top-10"
            element={
              isAuthenticated ? (
                <div className="max-w-7xl mx-auto px-4 md:px-16 py-8">
                  <ManageTop10 />
                </div>
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
          <Route
            path="/admin/add-movie"
            element={
              isAuthenticated ? (
                <div className="max-w-7xl mx-auto px-4 md:px-16 py-8">
                  <AdminAddMovieView
                    onAddMovie={handleAddMovie}
                  />
                </div>
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />
          <Route
            path="/admin/edit-movie/:id"
            element={
              isAuthenticated ? (
                <div className="max-w-7xl mx-auto px-4 md:px-16 py-8">
                  <AdminAddMovieView
                    onEditMovie={handleEditMovie}
                  />
                </div>
              ) : (
                <Navigate to="/admin" replace />
              )
            }
          />

          {/* Fallback routing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Aesthetic Feet */}
      <Footer isAuthenticated={isAuthenticated} onLogout={handleLogout} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
interface GuestCatalogViewProps {
  top10Movies: Movie[];
  searchResults: Movie[];
  searchQuery: string;
  onSelectMovie: (movie: Movie) => void;
}

function GuestCatalogView({
  top10Movies,
  searchResults,
  searchQuery,
  onSelectMovie
}: GuestCatalogViewProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const timerRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentIndexRef = useRef(0);
  currentIndexRef.current = currentSlideIndex;

  const scrollToSlide = (index: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * scrollRef.current.clientWidth,
        behavior: "smooth"
      });
      setCurrentSlideIndex(index);
    }
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (top10Movies.length > 0) {
        const nextIndex = (currentIndexRef.current + 1) % top10Movies.length;
        scrollToSlide(nextIndex);
      }
    }, 6000);
  };

  useEffect(() => {
    if (top10Movies.length > 0) {
      startTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [top10Movies]);

  useEffect(() => {
    const handleResize = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft = currentIndexRef.current * scrollRef.current.clientWidth;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      if (clientWidth > 0) {
        const index = Math.round(scrollLeft / clientWidth);
        if (index !== currentIndexRef.current && index >= 0 && index < top10Movies.length) {
          setCurrentSlideIndex(index);
          startTimer();
        }
      }
    }
  };

  const handleNextSlide = () => {
    if (top10Movies.length === 0) return;
    const nextIndex = (currentSlideIndex + 1) % top10Movies.length;
    scrollToSlide(nextIndex);
    startTimer();
  };

  const handlePrevSlide = () => {
    if (top10Movies.length === 0) return;
    const prevIndex = (currentSlideIndex - 1 + top10Movies.length) % top10Movies.length;
    scrollToSlide(prevIndex);
    startTimer();
  };

  const handleDotClick = (index: number) => {
    scrollToSlide(index);
    startTimer();
  };

  // Search Results Layout If Active
  if (searchQuery.trim()) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 animate-fade-in min-h-[70vh]">
        <div className="border-b border-white/10 pb-4 mb-8">
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/50">
            Curation Matches for "{searchQuery}"
          </h2>
          <p className="text-[10px] text-white/40 font-mono mt-1">
            DISPLAYING {searchResults.length} CINEMATIC MATCH(ES) FROM THE PEAK7 ROSTER.
          </p>
        </div>

        {searchResults.length === 0 ? (
          <div className="py-16 text-center text-white/40 max-w-sm mx-auto flex flex-col gap-3">
            <div className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white/30 mx-auto">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-xs tracking-wider uppercase font-sans">
              No matching listings in local database catalog.
            </p>
            <span className="text-[10px] font-mono text-white/30">
              Try searching by title, actor name, or genre.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {searchResults.map((movie) => (
              <div
                key={movie.id}
                onClick={() => onSelectMovie(movie)}
                className="group relative rounded-sm overflow-hidden aspect-[2/3] cursor-pointer bg-surface-container-low border border-white/5 transition-all duration-300 hover:scale-105 hover:border-white hover:shadow-[0_0_12px_rgba(255,255,255,0.25)] active:scale-98 shadow-md"
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

  return (
    <div className="w-full relative">
      {/* Dynamic Left Vertical Rail (Artistic Flair Decor) */}
      <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col gap-8 items-center border-r border-white/5 pr-6 py-6 z-40">
        <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping"></div>
        <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
        <div className="w-1.5 h-1.5 bg-white/10 rounded-full"></div>
      </div>



      {/* 1. Cinematic Featured Hero Section (STARZ-Inspired Slider) */}
      {top10Movies.length > 0 && (
        <section
          id="featured-hero"
          className="relative w-full h-[76vh] min-h-[500px] md:h-[82vh] flex items-end max-w-7xl mx-auto overflow-hidden rounded-none md:rounded-sm md:mt-4 border border-white/5 shadow-2xl group/hero"
        >
          {/* Scroll Container */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory hide-scrollbar scroll-smooth"
          >
            {top10Movies.map((movie, idx) => (
              <div
                key={movie.id}
                className="w-full h-full shrink-0 snap-start snap-always relative flex items-end"
              >
                {/* Backdrop Image */}
                <div className="absolute inset-0 z-0">
                  <img
                    referrerPolicy="no-referrer"
                    src={movie.img}
                    alt={movie.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Soft Shadow Overlays with beautiful crimson-black tones */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/5 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-l from-black via-black/5 to-transparent" />
                </div>

                {/* Content Details (inside the slide so they slide together) */}
                <div className="relative z-10 w-full h-full flex items-end p-6 md:p-12 pb-16 md:pb-20 pointer-events-none">
                  {/* Left Side Details */}
                  <div className="flex flex-col gap-4 max-w-3xl pointer-events-auto">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <span className="px-2 py-0.5 bg-red-600 text-[10px] font-black uppercase tracking-tighter italic text-white">
                        Top 10 Rank #{idx + 1}
                      </span>
                      <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/70">
                        ★ {movie.rating} score • {movie.type}
                      </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-8xl font-black leading-[0.85] tracking-tighter uppercase mb-4 drop-shadow-2xl italic font-display text-white">
                      {movie.name}
                    </h1>

                    <p className="text-sm md:text-base leading-relaxed text-white/80 max-w-lg mb-4 line-clamp-3 md:line-clamp-none">
                      {movie.synopsis}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mt-2">
                      <button
                        onClick={() => onSelectMovie(movie)}
                        className="px-8 py-3.5 bg-white text-black font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all cursor-pointer rounded-none hover:scale-105"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play Trailer</span>
                      </button>
                    </div>
                  </div>

                  {/* Metadata Rail (Right Aligned Details) */}
                  <div className="hidden lg:flex flex-col gap-6 items-end absolute right-12 bottom-20 z-10 font-sans pointer-events-none text-right">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Director</div>
                      <div className="text-xs font-black uppercase tracking-wide text-white">{movie.director}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Lead Actor</div>
                      <div className="text-xs font-black uppercase tracking-wide text-white">{movie.leadActor}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Genre</div>
                      <div className="text-xs font-bold uppercase tracking-wide text-red-500 font-mono">{movie.genre.join(" • ")}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Left Arrow Button */}
          <button
            onClick={handlePrevSlide}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center z-20 rounded-full bg-black/50 border border-white/10 text-white hover:bg-red-600 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg opacity-0 group-hover/hero:opacity-100 duration-300"
            title="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow Button */}
          <button
            onClick={handleNextSlide}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center z-20 rounded-full bg-black/50 border border-white/10 text-white hover:bg-red-600 hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg opacity-0 group-hover/hero:opacity-100 duration-300"
            title="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Bottom Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {top10Movies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentSlideIndex
                  ? "bg-red-600 w-6"
                  : "bg-white/40 hover:bg-white/70"
                  }`}
                title={`Go to Slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Main Shelves Grid Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 md:py-12 flex flex-col gap-6 md:gap-10 overflow-hidden">
        <MovieCarouselShelf genreName="Top Rated" title="Top Rated" onSelectMovie={onSelectMovie} isLarge={true} />
        <MovieCarouselShelf title="Top 10 Movies in Grand Lodge on Peak 7 Today" onSelectMovie={onSelectMovie} isTop10={true} />
        <MovieCarouselShelf genreName="Adventure" title="Adventure" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Action" title="Action" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Comedy" title="Comedy" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Romance" title="Romance" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Drama" title="Drama" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Trending Now" title="Trending Now" onSelectMovie={onSelectMovie} isLarge={true} />
        <MovieCarouselShelf genreName="Children" title="Children" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf title="Newly Added" onSelectMovie={onSelectMovie} isNewlyAdded={true} isLarge={true} />
        <MovieCarouselShelf genreName="Sci-Fi" title="Sci-Fi" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Fantasy" title="Fantasy" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Holiday" title="Holiday" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Musical" title="Musical" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Thriller" title="Thriller" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="War" title="War" onSelectMovie={onSelectMovie} />
        <MovieCarouselShelf genreName="Horror" title="Horror" onSelectMovie={onSelectMovie} />
      </div>
    </div>
  );
}
