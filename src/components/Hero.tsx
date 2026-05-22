import React from "react";
import { Play, Info, Star, Calendar } from "lucide-react";
import { MediaItem } from "../types";

interface HeroProps {
  media: MediaItem | null;
  onPlay: (media: MediaItem) => void;
}

export function getImageUrl(path: string | null, size: "poster" | "backdrop" = "poster"): string {
  if (!path) {
    return size === "poster"
      ? "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop"
      : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1600&auto=format&fit=crop";
  }
  if (path.startsWith("http") || path.startsWith("https")) {
    return path;
  }
  const baseUrl = size === "poster" ? "https://image.tmdb.org/t/p/w500" : "https://image.tmdb.org/t/p/original";
  return `${baseUrl}${path}`;
}

export default function Hero({ media, onPlay }: HeroProps) {
  if (!media) {
    return (
      <div className="relative h-[65vh] w-full bg-obsidian-900 animate-pulse flex items-center justify-center">
        <span className="text-zinc-600 text-xs font-mono">LOADING CINEMATIC FEED...</span>
      </div>
    );
  }

  const title = media.title || media.name || "Untitled Masterpiece";
  const year = (media.release_date || media.first_air_date || "").split("-")[0] || "N/A";
  const rating = media.vote_average ? Number(media.vote_average).toFixed(1) : "N/A";
  
  return (
    <div className="relative w-full h-[65vh] lg:h-[75vh] flex items-end justify-start overflow-hidden">
      
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={getImageUrl(media.backdrop_path, "backdrop")}
          alt={title}
          className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Dark gradients to paint the cinema backdrop */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian-950 via-obsidian-950/40 to-transparent" />
      </div>

      {/* Cinematic Content Block */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-24">
        <div className="max-w-2xl space-y-4">
          
          {/* Tagline / Subtitle */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-purple-600/90 text-white font-mono font-bold text-3xs tracking-widest uppercase px-2.5 py-1 rounded">
              FEATURED {media.media_type === "movie" ? "MOVIE" : "SERIES"}
            </span>
            <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded text-2xs font-medium text-amber-400">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center space-x-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded text-2xs font-medium text-zinc-300">
              <Calendar className="h-3 w-3" />
              <span>{year}</span>
            </div>
          </div>

          {/* Title with Outfit Bold typeface */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none text-glow uppercase drop-shadow-md">
            {title}
          </h1>

          {/* Overview text with optimized layout */}
          <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-xl text-shadow-sm line-clamp-3">
            {media.overview || "Overview not provided. Immerse yourself in the action by starting playback now."}
          </p>

          {/* Control Triggers */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlay(media)}
              className="flex items-center space-x-2 bg-white text-black hover:bg-zinc-200 font-display font-bold text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform duration-200 active:scale-95 cursor-pointer"
            >
              <Play className="h-4 w-4 fill-black" />
              <span>PLAY TITLE</span>
            </button>
            <button
              onClick={() => {
                const searchStr = media.title || media.name || "";
                window.open(`https://www.google.com/search?q=${encodeURIComponent(searchStr + " review")}`, "_blank");
              }}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold text-xs px-5 py-3.5 rounded-xl transition-colors cursor-pointer"
            >
              <Info className="h-4 w-4" />
              <span>REVIEWS</span>
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
