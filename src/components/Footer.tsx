import { Film } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-black border-t border-white/5 mt-16 transition-colors duration-300">
      <div className="w-full px-6 md:px-12 py-10 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-8">
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="text-xl font-display font-black text-red-600 flex items-center gap-2 uppercase tracking-tighter italic">
            <Film className="w-4 h-4 text-red-600" />
            Peak7 Theaters.
          </span>
          <span className="text-[10px] font-mono text-white/40 text-center md:text-left tracking-wide uppercase">
            © {currentYear} PEAK7 STITCH LABS. ALL REASONABLE REALITIES RESERVED.
          </span>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center md:justify-end gap-6 md:gap-8 font-mono text-[10px]">
          <a 
            id="footer-privacy"
            href="#privacy" 
            onClick={(e) => { e.preventDefault(); alert("Privacy Policy summary."); }}
            className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
          >
            Privacy
          </a>
          <a 
            id="footer-terms"
            href="#terms" 
            onClick={(e) => { e.preventDefault(); alert("Terms of Service statement."); }}
            className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
          >
            Terms
          </a>
          <a 
            id="footer-locations"
            href="#locations" 
            onClick={(e) => { e.preventDefault(); alert("Find our theaters in Seattle, Denver, and Salt Lake City."); }}
            className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
          >
            Locations
          </a>
          <a 
            id="footer-support"
            href="#support" 
            onClick={(e) => { e.preventDefault(); alert("Contact Peak7 support crew at support@peak7theaters.com"); }}
            className="font-black uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors"
          >
            Support
          </a>
        </nav>
      </div>
    </footer>
  );
}
