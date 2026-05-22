import React, { useState, useEffect } from "react";
import { X, Tv, Film, Star, Loader2, ArrowLeft, ChevronRight, Play } from "lucide-react";
import { MediaItem, TVShowDetails } from "../types";

interface VideoPlayerProps {
  media: MediaItem | null;
  onClose: () => void;
}

export default function VideoPlayer({ media, onClose }: VideoPlayerProps) {
  if (!media) return null;

  const [tvDetails, setTvDetails] = useState<TVShowDetails | null>(null);
  const [loadingTV, setLoadingTV] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [selectedEpisode, setSelectedEpisode] = useState<number>(1);

  // Initialize and Fetch TV Show info if it's a series
  useEffect(() => {
    if (media.media_type === "tv") {
      setLoadingTV(true);
      // Reset episodes
      setSelectedSeason(1);
      setSelectedEpisode(1);

      fetch(`/api/tv/${media.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("TV Details fetch failed");
          return res.json();
        })
        .then((data) => {
          setTvDetails(data);
          setLoadingTV(false);
        })
        .catch((err) => {
          console.error("Error loading TV show:", err);
          // Fallback local structures if server fails
          setTvDetails({
            ...media,
            number_of_seasons: 3,
            seasons: [
              { id: 101, name: "Season 1", season_number: 1, episode_count: 10 },
              { id: 102, name: "Season 2", season_number: 2, episode_count: 8 },
              { id: 103, name: "Season 3", season_number: 3, episode_count: 10 },
            ],
          });
          setLoadingTV(false);
        });
    }
  }, [media]);

  const isMovie = media.media_type === "movie";

  // Construct Vidking Embed Link as per strict specifications
  const getEmbedLink = () => {
    if (isMovie) {
      return `https://vidking.net/embed/movie/${media.id}`;
    } else {
      return `https://vidking.net/embed/tv/${media.id}/${selectedSeason}/${selectedEpisode}`;
    }
  };

  // Find the episode list of the currently selected season
  const currentSeasonDetails = tvDetails?.seasons?.find(
    (s) => s.season_number === selectedSeason
  );
  const episodeCount = currentSeasonDetails?.episode_count || 10;

  return (
    <div className="fixed inset-0 z-50 bg-obsidian-950/95 overflow-y-auto backdrop-blur-xl flex flex-col justify-start">
      
      {/* Top action/navigation and info banner */}
      <div className="w-full bg-obsidian-900 border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 text-zinc-400 hover:text-white text-xs font-medium bg-white/5 px-4 py-2 rounded-xl border border-white/5 cursor-pointer hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Catalog</span>
          </button>
          
          <div className="text-center sm:block hidden">
            <h1 className="font-display font-black text-white text-base tracking-wide uppercase">
              {media.title || media.name}
            </h1>
            <p className="text-purple-400 text-3xs font-mono font-bold tracking-widest mt-0.5">
              {isMovie ? "CINEMATIC MOVIE" : `SEASON ${selectedSeason} • EPISODE ${selectedEpisode}`}
            </p>
          </div>

          <button
            onClick={onClose}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-600/10 text-purple-400 hover:bg-purple-600 hover:text-white border border-purple-500/10 cursor-pointer transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Cinematic Video Player viewport column */}
        <div className="lg:col-span-3 flex flex-col justify-start space-y-4">
          
          {/* Iframe stage wrapping responsive aspectRatio block */}
          <div className="relative w-full aspect-video rounded-3xl bg-black overflow-hidden border border-white/5 shadow-2xl shadow-purple-600/5">
            <iframe
              src={getEmbedLink()}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              title={media.title || media.name || "Cinema Stream"}
            />
          </div>

          {/* Title information details */}
          <div className="bg-obsidian-900/60 p-6 rounded-2xl border border-white/5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold text-white uppercase tracking-wide">
                  {media.title || media.name}
                </h2>
                <div className="flex items-center space-x-3 text-2xs text-zinc-400 mt-1 font-mono">
                  <span className="flex items-center text-amber-400 font-bold">
                    <Star className="h-3 w-3 fill-amber-400 mr-1" />
                    {media.vote_average ? Number(media.vote_average).toFixed(1) : "N/A"}
                  </span>
                  <span>•</span>
                  <span>{media.media_type.toUpperCase()}</span>
                  <span>•</span>
                  <span>{media.release_date || media.first_air_date || "Unknown Release"}</span>
                </div>
              </div>
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed">
              {media.overview || "No overview available for this title. Continue watching with the video player above."}
            </p>
          </div>

        </div>

        {/* TV Episode Selector Sidebar column */}
        <div className="lg:col-span-1 flex flex-col space-y-4">
          
          <div className="bg-obsidian-900 p-5 rounded-3xl border border-white/5 flex flex-col h-full max-h-[80vh] overflow-hidden">
            
            <div className="flex items-center gap-2 pb-4 border-b border-white/5 mb-4">
              <Tv className="h-4 w-4 text-purple-400" />
              <h3 className="font-display text-sm font-bold text-zinc-200 uppercase tracking-widest">
                {isMovie ? "Cinema Control" : "Episode Selector"}
              </h3>
            </div>

            {isMovie ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3">
                <Film className="h-10 w-10 text-purple-500 opacity-60" />
                <span className="text-xs text-zinc-300 font-bold uppercase tracking-wide">MOVIE MODE ACTIVE</span>
                <p className="text-zinc-500 text-3xs leading-relaxed max-w-[200px]">
                  Feature film playback operates on a single consolidated high-speed stream. Sit back and enjoy.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-hidden">
                {loadingTV ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-2">
                    <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
                    <span className="text-3xs text-zinc-500 uppercase tracking-widest font-mono">
                      Querying seasons database...
                    </span>
                  </div>
                ) : (
                  <>
                    {/* Season dropdown selector */}
                    <div className="mb-4">
                      <label className="block text-3xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2">
                        SELECT SEASON
                      </label>
                      <select
                        value={selectedSeason}
                        onChange={(e) => {
                          setSelectedSeason(Number(e.target.value));
                          setSelectedEpisode(1);
                        }}
                        className="w-full bg-obsidian-950 text-xs text-zinc-300 border border-white/5 rounded-xl px-3 py-2.5 outline-none focus:border-purple-500/50 cursor-pointer"
                      >
                        {(tvDetails?.seasons || []).map((season) => (
                          <option key={season.id} value={season.season_number}>
                            {season.name} ({season.episode_count} Episodes)
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Episode cards / buttons list */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      <label className="block text-3xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-1">
                        EPISODES
                      </label>
                      <div className="space-y-1">
                        {Array.from({ length: episodeCount }).map((_, i) => {
                          const epNum = i + 1;
                          const isActive = epNum === selectedEpisode;
                          return (
                            <button
                              key={epNum}
                              onClick={() => setSelectedEpisode(epNum)}
                              className={`w-full text-left px-3 py-2.5 rounded-xl text-3xs font-medium flex items-center justify-between border cursor-pointer transition-all ${
                                isActive
                                  ? "bg-purple-600 text-white border-purple-500"
                                  : "bg-white/2 hover:bg-white/5 text-zinc-400 hover:text-zinc-200 border-transparent"
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <Play className={`h-3 w-3 ${isActive ? "fill-white" : "opacity-40"}`} />
                                <span className={isActive ? "font-bold text-white" : ""}>
                                  Episode {epNum}
                                </span>
                              </div>
                              <ChevronRight className="h-3 w-3 opacity-40" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
