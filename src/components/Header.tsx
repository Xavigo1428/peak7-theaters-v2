import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, LogIn, LogOut, Menu, X, Film } from "lucide-react";

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch(val);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-b from-black/95 to-black/75 backdrop-blur-xl border-b border-white/5 shadow-lg transition-all duration-300">
      <div className="flex justify-between items-center w-full px-6 md:px-12 py-5 max-w-7xl mx-auto">
        {/* Brand */}
        <Link 
          to="/" 
          id="brand-logo"
          className="flex items-center gap-2 text-2xl font-black font-display text-red-600 uppercase italic tracking-tighter"
        >
          <Film className="w-5 h-5 text-red-600" />
          <span>Peak7 Theaters.</span>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink 
            to="/" 
            id="nav-home"
            className={({ isActive }) => 
              `text-[11px] font-black tracking-[0.25em] uppercase transition-all duration-300 pb-1 border-b-2 ${
                isActive 
                  ? "text-white border-red-600" 
                  : "text-white/60 border-transparent hover:text-red-500 hover:border-red-500/35"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/schedule" 
            id="nav-schedule"
            className={({ isActive }) => 
              `text-[11px] font-black tracking-[0.25em] uppercase transition-all duration-300 pb-1 border-b-2 ${
                isActive 
                  ? "text-white border-red-600" 
                  : "text-white/60 border-transparent hover:text-red-500 hover:border-red-500/35"
              }`
            }
          >
            Schedule
          </NavLink>
        </nav>

        {/* Trailing Action */}
        <div className="flex items-center gap-4">
          {/* Detailed Search Trigger */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center animate-fade-in">
                <input
                  type="text"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="bg-black/95 border border-white/10 px-3 py-1.5 text-xs focus:outline-none focus:border-red-600 text-white w-40 md:w-56 uppercase tracking-wider rounded-none font-mono"
                  autoFocus
                />
                <button 
                  type="button"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                    onSearch("");
                  }}
                  className="bg-black/95 border-y border-r border-white/10 px-3 py-1.5 text-white hover:text-red-600 rounded-none"
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

          {/* Admin / Login Button */}
          {isAuthenticated ? (
            <button 
              id="logout-btn"
              onClick={() => {
                onLogout();
                navigate("/");
              }}
              className="text-[10px] font-black tracking-widest uppercase border border-red-600 bg-transparent text-red-500 hover:bg-red-600 hover:text-white px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <button 
              id="signin-btn"
              onClick={() => navigate("/admin")}
              className="text-[10px] font-black tracking-widest uppercase border border-white/20 bg-transparent hover:border-red-600 hover:bg-white hover:text-black text-white px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5"
            >
              <LogIn className="w-3 h-3" />
              <span>Admin Login</span>
            </button>
          )}

          {/* Mobile Menu Icon */}
          <button
            id="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-none border border-white/10 bg-[#0d0707] text-white"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0d0707]/95 border-b border-white/5 px-6 py-4 flex flex-col gap-4 animate-fade-in font-mono text-[10px]">
          <NavLink 
            to="/" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => 
              `font-black tracking-widest uppercase py-2 border-b border-white/5 ${
                isActive ? "text-red-500" : "text-white/60"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/schedule" 
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) => 
              `font-black tracking-widest uppercase py-2 ${
                isActive ? "text-red-500" : "text-white/60"
              }`
            }
          >
            Schedule
          </NavLink>
        </div>
      )}
    </header>
  );
}
