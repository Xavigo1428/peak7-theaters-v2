import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Search, LogOut, Menu, X, Film, LayoutDashboard } from "lucide-react";

const GENRES = [
  "Action",
  "Adventure",
  "Children",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Holiday",
  "Horror",
  "Musical",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Thriller",
  "War",
  "Western"
];

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

export default function Header({ isAuthenticated, onLogout, onSearch }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [isGenresOpen, setIsGenresOpen] = useState(false);
  const [isMobileGenresOpen, setIsMobileGenresOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGenresOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // If the path changes and is not home, close the search bar and clear the query
    if (location.pathname !== "/") {
      setIsSearchOpen(false);
      setSearchQuery("");
      onSearch("");
    }
  }, [location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    if (searchQuery && location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
    if (val && location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-black/95 to-black/75 backdrop-blur-xl border-b border-white/5 shadow-lg transition-all duration-300">
      <div className="relative flex justify-between items-center w-full px-4 sm:px-6 md:px-12 py-4 md:py-5 max-w-7xl mx-auto">
        {/* Brand */}
        <Link
          to="/"
          id="brand-logo"
          className="flex items-center gap-1.5 sm:gap-2 text-xl sm:text-2xl font-black font-display text-red-600 uppercase italic tracking-tighter shrink-0"
        >
          <Film className="w-[18px] h-[18px] sm:w-5 sm:h-5 text-red-600 shrink-0" />
          <span className={isSearchOpen ? "hidden sm:inline" : "inline"}>Peak7 Theaters.</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
          <NavLink
            to="/"
            id="nav-home"
            className={({ isActive }) =>
              `text-[11px] font-black tracking-[0.25em] uppercase transition-all duration-300 pb-1 border-b-2 ${isActive
                ? "text-white border-red-600"
                : "text-white/60 border-transparent hover:text-red-500 hover:border-red-500/35"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/reservation"
            id="nav-reservation"
            className={({ isActive }) =>
              `text-[11px] font-black tracking-[0.25em] uppercase transition-all duration-300 pb-1 border-b-2 ${isActive
                ? "text-white border-red-600"
                : "text-white/60 border-transparent hover:text-red-500 hover:border-red-500/35"
              }`
            }
          >
            Reservation
          </NavLink>
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsGenresOpen(!isGenresOpen)}
              className={`text-[11px] font-black tracking-[0.25em] uppercase transition-all duration-300 pb-1 border-b-2 flex items-center gap-1 cursor-pointer focus:outline-none ${isGenresOpen
                  ? "text-white border-red-600"
                  : "text-white/60 border-transparent hover:text-red-500 hover:border-red-500/35"
                }`}
            >
              <span>Genres</span>
              <span className="text-[7px] transition-transform duration-300" style={{ transform: isGenresOpen ? "rotate(180deg)" : "rotate(0deg)" }}>
                ▼
              </span>
            </button>

            {isGenresOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 bg-surface-container-high/95 border border-white/10 backdrop-blur-xl shadow-2xl p-6 w-[480px] z-50 animate-fade-in rounded-sm">
                <div className="grid grid-cols-3 gap-y-3 gap-x-6 text-[10px] font-bold tracking-widest font-mono uppercase text-white/70">
                  {GENRES.map((g) => (
                    <Link
                      key={g}
                      to={`/genre/${encodeURIComponent(g)}`}
                      onClick={() => setIsGenresOpen(false)}
                      className="hover:text-red-500 transition-colors py-1 block"
                    >
                      {g}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Trailing Action */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Detailed Search Trigger */}
          <div className="relative flex items-center h-9">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center animate-fade-in">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-black/95 border border-white/10 px-3 h-9 text-base md:text-xs focus:outline-none focus:border-red-600 text-white w-32 sm:w-40 md:w-56 uppercase tracking-wider rounded-none font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    onSearch("");
                  }}
                  className="bg-black/95 border-y border-r border-white/10 px-3 h-9 text-white hover:text-red-600 rounded-none flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                id="search-btn"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white"
                title="Search Movies"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Admin / Logout Button */}
          {isAuthenticated && (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/admin"
                id="nav-admin-dashboard"
                className="w-9 h-9 md:w-auto md:h-auto flex items-center justify-center rounded-full border border-white/20 bg-transparent text-white/80 hover:border-white hover:text-white md:px-4 md:py-1.5 transition-all gap-1.5 cursor-pointer shrink-0"
                title="Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 md:w-3 md:h-3" />
                <span className="hidden md:inline text-[11px] font-black tracking-widest uppercase">Dashboard</span>
              </Link>
              <button
                id="logout-btn"
                onClick={() => {
                  onLogout();
                  navigate("/");
                }}
                className="w-9 h-9 md:w-auto md:h-auto flex items-center justify-center rounded-full border border-red-600 bg-transparent text-red-500 hover:bg-red-600 hover:text-white md:px-4 md:py-1.5 transition-all gap-1.5 cursor-pointer shrink-0"
                title="Logout"
              >
                <LogOut className="w-4 h-4 md:w-3 md:h-3" />
                <span className="hidden md:inline text-[11px] font-black tracking-widest uppercase">Logout</span>
              </button>
            </div>
          )}

          {/* Mobile Menu Icon */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-surface-container-low text-white/80 hover:text-white transition-all hover:bg-white/5"
          >
            {isMobileMenuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface-container-low/95 border-b border-white/5 px-6 py-4 flex flex-col gap-4 animate-fade-in font-mono text-[12px] sm:text-xs">
          <NavLink
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `font-black tracking-widest uppercase py-2 border-b border-white/5 ${isActive ? "text-red-500" : "text-white/60"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/reservation"
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `font-black tracking-widest uppercase py-2 border-b border-white/5 ${isActive ? "text-red-500" : "text-white/60"
              }`
            }
          >
            Reservation
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `font-black tracking-widest uppercase py-2 border-b border-white/5 ${isActive ? "text-red-500" : "text-white/60"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
          <button
            onClick={() => setIsMobileGenresOpen(!isMobileGenresOpen)}
            className="font-black tracking-widest uppercase py-2 text-white/60 hover:text-red-500 transition-colors flex justify-between items-center w-full"
          >
            <span>Genres</span>
            <span className="font-sans text-xs">{isMobileGenresOpen ? "−" : "+"}</span>
          </button>
          {isMobileGenresOpen && (
            <div className="grid grid-cols-2 gap-2 pl-4 py-2 animate-fade-in">
              {GENRES.map((g) => (
                <Link
                  key={g}
                  to={`/genre/${encodeURIComponent(g)}`}
                  onClick={() => {
                    setIsMobileGenresOpen(false);
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-1.5 text-white/50 hover:text-red-500 transition-colors font-mono text-[11px] uppercase tracking-wider block"
                >
                  {g}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
