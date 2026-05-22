import React from "react";
import { Play, Star, Sparkles, TrendingUp } from "lucide-react";
import { MediaItem } from "../types";
import { getImageUrl } from "./Hero";

interface MediaGridProps {
  items: MediaItem[];
  title: string;
  onSelect: (item: MediaItem) => void;
  loading?: boolean;
}

export default function MediaGrid({ items, title, onSelect, loading }: MediaGridProps) {
  if (loading) {
    return (
      <div className="py-10">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500 animate-pulse" />
          <span>{title}</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] w-full rounded-2xl bg-zinc-900/30 animate-pulse border border-white/5" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center rounded-2xl bg-white/5 border border-white/5 p-8 max-w-md mx-auto">
        <Sparkles className="h-10 w-10 text-purple-400 mx-auto mb-3 opacity-80" />
        <h3 className="font-display text-lg font-bold text-white mb-1">No Titles Found</h3>
        <p className="text-zinc-400 text-xs leading-relaxed">
          We couldn't locate any matching media in the database. Please try adjusting your search phrasing or tags.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Grid Headline with Outfit Heavy style */}
      <h2 className="font-display text-lg sm:text-xl font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
        <span className="h-4 w-1 bg-purple-500 rounded-full" />
        <span>{title}</span>
      </h2>

      {/* Grid wrapper */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 md:gap-6">
        {items.map((item) => {
          const itemTitle = item.title || item.name || "Untitled";
          const rating = item.vote_average ? Number(item.vote_average).toFixed(1) : "N/A";
          const year = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";

          return (
            <div
              key={`${item.media_type}-${item.id}`}
              id={`media-card-${item.id}`}
              onClick={() => onSelect(item)}
              className="group relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 hover:border-purple-500/20 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-purple-900/10 glow-hover"
            >
              {/* Poster Image */}
              <img
                src={getImageUrl(item.poster_path, "poster")}
                alt={itemTitle}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Gradient card tint */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover Trigger - Quick Watch Button */}
              <div className="absolute inset-x-0 bottom-0 p-4 transition-all duration-300 opacity-0 group-hover:opacity-100 flex flex-col justify-end transform translate-y-3 group-hover:translate-y-0 z-20">
                <span className="font-display text-2xs font-bold text-zinc-400 uppercase tracking-widest mb-1 font-mono">
                  {item.media_type === "movie" ? "MOVIE" : "SERIES"}
                </span>
                <h3 className="font-display font-black text-sm text-white line-clamp-1 mb-1.5 uppercase leading-tight">
                  {itemTitle}
                </h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center text-3xs text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                      <Star className="h-2.5 w-2.5 fill-amber-400 mr-0.5" />
                      {rating}
                    </div>
                    <span className="text-3xs text-zinc-400 font-mono">{year}</span>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-purple-600 flex items-center justify-center text-white shadow shadow-purple-600/30">
                    <Play className="h-3 w-3 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              {/* Fallback Static Ribbon overlay for rating on non-hovered screens */}
              <div className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg text-3xs font-mono font-bold text-amber-400 border border-white/5 flex items-center space-x-1 group-hover:opacity-0 transition-opacity">
                <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-500" />
                <span>{rating}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
