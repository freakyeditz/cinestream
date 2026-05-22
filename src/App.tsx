import React, { useState, useEffect } from "react";
import { Film, Tv, Sparkles, Flame, Loader2, RefreshCw } from "lucide-react";
import { MediaItem } from "./types";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MediaGrid from "./components/MediaGrid";
import VideoPlayer from "./components/VideoPlayer";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "movie" | "tv">("all");
  const [hasTmdbKey, setHasTmdbKey] = useState(false);
  
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingTV, setTrendingTV] = useState<MediaItem[]>([]);
  const [searchResults, setSearchResults] = useState<MediaItem[]>([]);
  
  const [featuredMedia, setFeaturedMedia] = useState<MediaItem | null>(null);
  const [activePlayingMedia, setActivePlayingMedia] = useState<MediaItem | null>(null);
  
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // Initialize: Check server config & Fetch media feed
  useEffect(() => {
    // 1. Fetch server config status
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => setHasTmdbKey(data.hasTmdbKey))
      .catch((err) => console.error("Error loaded API config:", err));

    // 2. Fetch primary trending media feed
    fetchMediaFeed();
  }, []);

  const fetchMediaFeed = () => {
    setLoadingFeed(true);
    fetch("/api/media/trending")
      .then((res) => res.json())
      .then((data) => {
        const movies = data.movies || [];
        const tv = data.tv || [];
        setTrendingMovies(movies);
        setTrendingTV(tv);
        
        // Highlight first movie as featured hero item
        if (movies.length > 0) {
          setFeaturedMedia(movies[0]);
        } else if (tv.length > 0) {
          setFeaturedMedia(tv[0]);
        }
        setLoadingFeed(false);
      })
      .catch((err) => {
        console.error("Error drawing media feed:", err);
        setLoadingFeed(false);
      });
  };

  // Debounce search input to lower TMDB rate limit burden & optimize keystrokes
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Execute TMDB Search
  useEffect(() => {
    if (!searchDebounced.trim()) {
      setSearchResults([]);
      setLoadingSearch(false);
      return;
    }

    setLoadingSearch(true);
    fetch(`/api/media/search?query=${encodeURIComponent(searchDebounced)}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data.results || []);
        setLoadingSearch(false);
      })
      .catch((err) => {
        console.error("Search fetch failed:", err);
        setLoadingSearch(false);
      });
  }, [searchDebounced]);

  // Combined searchable search feed or custom categorization lists
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col justify-start pb-20 select-none">
      
      {/* Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        hasTmdbKey={hasTmdbKey}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Home Hero section (only displayed when browsing catalog) */}
      {!isSearching && (
        <Hero 
          media={featuredMedia} 
          onPlay={(item) => setActivePlayingMedia(item)} 
        />
      )}

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {loadingFeed ? (
          <div className="h-60 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
            <span className="font-mono text-3xs text-zinc-500 uppercase tracking-widest">
              Assembling cinema theater...
            </span>
          </div>
        ) : isSearching ? (
          /* Search Results Stage */
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-2">
              <div>
                <span className="text-3xs font-mono font-bold tracking-widest text-purple-400 uppercase">
                  CINEMA EXPLORER
                </span>
                <h1 className="font-display font-black text-xl sm:text-2xl text-white uppercase tracking-wider mt-0.5">
                  Search Results for: <span className="text-purple-500">"{searchQuery}"</span>
                </h1>
              </div>
              <span className="text-2xs font-mono text-zinc-500 bg-white/5 px-2.5 py-1 rounded">
                {searchResults.length} {searchResults.length === 1 ? "match" : "matches"}
              </span>
            </div>

            <MediaGrid
              items={searchResults}
              title="Matched Titles"
              onSelect={(item) => setActivePlayingMedia(item)}
              loading={loadingSearch}
            />
          </div>
        ) : (
          /* Browsing Feed Stage */
          <div className="space-y-6">
            
            {/* Movies Tab display or All display */}
            {(activeTab === "all" || activeTab === "movie") && (
              <MediaGrid
                items={trendingMovies}
                title="Trending Movies"
                onSelect={(item) => setActivePlayingMedia(item)}
              />
            )}

            {/* TV Shows Tab display or All display */}
            {(activeTab === "all" || activeTab === "tv") && (
              <MediaGrid
                items={trendingTV}
                title="Trending TV Shows"
                onSelect={(item) => setActivePlayingMedia(item)}
              />
            )}

          </div>
        )}
      </main>

      {/* Cinematic Modal Video Player */}
      {activePlayingMedia && (
        <VideoPlayer
          media={activePlayingMedia}
          onClose={() => setActivePlayingMedia(null)}
        />
      )}

    </div>
  );
}
