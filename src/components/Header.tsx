import React, { useState, useEffect } from "react";
import { Search, Film, Tv, Key, ShieldCheck, HelpCircle } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasTmdbKey: boolean;
  activeTab: "all" | "movie" | "tv";
  setActiveTab: (tab: "all" | "movie" | "tv") => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  hasTmdbKey,
  activeTab,
  setActiveTab,
}: HeaderProps) {
  const [showConfigTips, setShowConfigTips] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-obsidian-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div 
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => {
            setSearchQuery("");
            setActiveTab("all");
          }}
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 font-display font-extrabold text-white shadow-lg shadow-purple-600/30 transition-transform group-hover:scale-105">
            C
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-white sm:block hidden">
            Cine<span className="text-purple-500 font-extrabold">Stream</span>
          </span>
        </div>

        {/* Categories Tab Selector */}
        <nav className="hidden md:flex space-x-1 bg-white/5 p-1 rounded-full border border-white/5">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              activeTab === "all"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All Feed
          </button>
          <button
            onClick={() => setActiveTab("movie")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === "movie"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Film className="h-3 w-3" />
            Movies
          </button>
          <button
            onClick={() => setActiveTab("tv")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${
              activeTab === "tv"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Tv className="h-3 w-3" />
            TV Shows
          </button>
        </nav>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-sm mx-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            className="w-full h-10 rounded-full bg-white/5 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:bg-white/10 border border-white/5 transition-all"
            placeholder="Search movies or TV shows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Secret Status / Integration Indicator */}
        <div className="relative">
          <button
            onClick={() => setShowConfigTips(!showConfigTips)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-2xs font-mono border transition-all duration-300 ${
              hasTmdbKey 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" 
                : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
            }`}
          >
            {hasTmdbKey ? (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span className="sm:inline hidden">TMDB ENGAGED</span>
              </>
            ) : (
              <>
                <Key className="h-3.5 w-3.5 text-amber-500" />
                <span className="sm:inline hidden">SANDBOX FEED</span>
              </>
            )}
            <HelpCircle className="h-3.5 w-3.5 opacity-60 ml-0.5" />
          </button>

          {showConfigTips && (
            <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-white/10 bg-obsidian-900 p-4 shadow-xl text-xs z-50 text-zinc-300 leading-relaxed">
              <span className="font-semibold block mb-2 text-white font-display">
                API Configuration Hub
              </span>
              {hasTmdbKey ? (
                <p>
                  Your <strong className="text-emerald-400">TMDB_API_KEY</strong> environment variable is active! The catalog is streaming live, real-time media details directly from The Movie Database.
                </p>
              ) : (
                <div className="space-y-2">
                  <p>
                    Currently operating in <strong>Sandbox Mode</strong> with a built-in trending catalog.
                  </p>
                  <p className="bg-white/5 p-2 rounded-lg text-2xs font-mono text-amber-300">
                    To enable live catalogs: Add <strong>TMDB_API_KEY</strong> to the Secrets panel in Google AI Studio.
                  </p>
                </div>
              )}
              <button
                onClick={() => setShowConfigTips(false)}
                className="mt-3 w-full bg-white/5 hover:bg-white/10 text-white rounded-lg py-1 text-2xs transition-colors"
              >
                Got it
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
