import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Database, Film } from "lucide-react";

export default function AdminDashboardView() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-fade-in py-12 text-center items-center">

      {/* Header */}
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 shadow-lg">
          <Film className="w-5 h-5" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter italic text-white font-display">
          Peak7 Admin Panel
        </h1>
        <p className="text-sm text-white/60 leading-relaxed max-w-xl">
          Welcome to the theater lounge management area. Please select an option below to add a new title or manage the existing catalog.
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
        {/* Card 1: Add New Movie */}
        <Link
          to="/admin/add-movie"
          className="group relative bg-surface-container-low border border-white/5 p-8 flex flex-col items-center gap-4 hover:border-red-600/40 hover:shadow-[0_10px_30px_rgba(229,9,20,0.15)] hover:scale-[1.03] transition-all duration-300 rounded-xl cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-red-600/10 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 flex items-center justify-center">
            <PlusCircle className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-black uppercase tracking-wider text-white font-display mb-2 group-hover:text-red-500 transition-colors">
              Add New Movie
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Register a new movie showcase into the database. Fill out details, synopsis, trailer links, and upload posters.
            </p>
          </div>
        </Link>

        {/* Card 2: Movie Library System */}
        <Link
          to="/admin/library"
          className="group relative bg-surface-container-low border border-white/5 p-8 flex flex-col items-center gap-4 hover:border-red-600/40 hover:shadow-[0_10px_30px_rgba(229,9,20,0.15)] hover:scale-[1.03] transition-all duration-300 rounded-xl cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-red-600/10 text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 flex items-center justify-center">
            <Database className="w-8 h-8" />
          </div>
          <div className="text-center">
            <h2 className="text-lg font-black uppercase tracking-wider text-white font-display mb-2 group-hover:text-red-500 transition-colors">
              Movie Library System
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              View the entire active catalog, apply search filters, edit details of existing records, or remove entries permanently.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
