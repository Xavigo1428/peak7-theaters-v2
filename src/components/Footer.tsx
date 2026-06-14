import { Link, useNavigate } from "react-router-dom";
import { Film } from "lucide-react";

interface FooterProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export default function Footer({ isAuthenticated, onLogout }: FooterProps) {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black/45 backdrop-blur-md border-t border-white/5 mt-16 transition-colors duration-300">
      <div className="w-full px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-xl font-display font-black text-red-600 flex items-center gap-2 uppercase tracking-tighter italic">
            <Film className="w-4 h-4 text-red-600" />
            Peak7 Theaters.
          </span>
          <span className="text-[10px] font-mono text-white/40 text-center md:text-left tracking-wide">
            © 2026 Grand Lodge on Peak 7. All Rights Reserved.
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 font-mono text-[10px]">
          <Link 
            id="footer-privacy"
            to="/privacy" 
            className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
          >
            Privacy
          </Link>
          <Link 
            id="footer-terms"
            to="/terms" 
            className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
          >
            Terms
          </Link>
          <Link 
            id="footer-locations"
            to="/locations" 
            className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
          >
            Locations
          </Link>
          <Link 
            id="footer-support"
            to="/support" 
            className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
          >
            Support
          </Link>
          {isAuthenticated ? (
            <>
              <Link 
                id="footer-admin"
                to="/admin" 
                className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
              >
                Admin
              </Link>
              <button 
                id="footer-logout"
                onClick={() => {
                  if (onLogout) {
                    onLogout();
                    navigate("/");
                  }
                }}
                className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              id="footer-admin"
              to="/admin" 
              className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
            >
              Admin Login
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
