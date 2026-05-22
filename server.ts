import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Standard imports from fallback data
import { FALLBACK_TRENDING_MOVIES, FALLBACK_TRENDING_TV } from "./src/data/fallbackData.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Configuration indicator for the frontend to show whether the real TMDB API is active
  app.get("/api/config", (req, res) => {
    res.json({
      hasTmdbKey: !!process.env.TMDB_API_KEY,
    });
  });

  // API Route: Get Trending Movies and TV Shows
  app.get("/api/media/trending", async (req, res) => {
    const key = process.env.TMDB_API_KEY;
    if (!key || key === "MY_TMDB_API_KEY") {
      // Return high-fidelity fallback list
      return res.json({
        movies: FALLBACK_TRENDING_MOVIES,
        tv: FALLBACK_TRENDING_TV,
        source: "fallback",
      });
    }

    try {
      // Fetch actual data from TMDB
      const movieRes = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${key}&language=en-US`
      );
      const tvRes = await fetch(
        `https://api.themoviedb.org/3/trending/tv/week?api_key=${key}&language=en-US`
      );

      const moviesData = await movieRes.json();
      const tvData = await tvRes.json();

      const movies = (moviesData.results || []).slice(0, 10).map((m: any) => ({
        id: m.id,
        title: m.title,
        media_type: "movie" as const,
        poster_path: m.poster_path,
        backdrop_path: m.backdrop_path,
        overview: m.overview,
        vote_average: m.vote_average,
        release_date: m.release_date,
      }));

      const tv = (tvData.results || []).slice(0, 10).map((t: any) => ({
        id: t.id,
        name: t.name,
        media_type: "tv" as const,
        poster_path: t.poster_path,
        backdrop_path: t.backdrop_path,
        overview: t.overview,
        vote_average: t.vote_average,
        first_air_date: t.first_air_date,
      }));

      res.json({
        movies,
        tv,
        source: "tmdb_api",
      });
    } catch (error) {
      console.error("TMDB fetch error, falling back:", error);
      res.json({
        movies: FALLBACK_TRENDING_MOVIES,
        tv: FALLBACK_TRENDING_TV,
        source: "fallback_on_error",
      });
    }
  });

  // API Route: Universal Search for movies and shows
  app.get("/api/media/search", async (req, res) => {
    const query = String(req.query.query || "").trim();
    if (!query) {
      return res.json({ results: [] });
    }

    const key = process.env.TMDB_API_KEY;
    if (!key || key === "MY_TMDB_API_KEY") {
      // Local client-side searchable fallback
      const combined = [...FALLBACK_TRENDING_MOVIES, ...FALLBACK_TRENDING_TV];
      const filtered = combined.filter((item) => {
        const titleText = (item.title || item.name || "").toLowerCase();
        return titleText.includes(query.toLowerCase());
      });
      return res.json({ results: filtered, source: "fallback" });
    }

    try {
      const searchRes = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${encodeURIComponent(
          query
        )}&language=en-US&include_adult=false`
      );
      const data = await searchRes.json();
      const results = (data.results || [])
        .filter((item: any) => item.media_type === "movie" || item.media_type === "tv")
        .slice(0, 15)
        .map((item: any) => ({
          id: item.id,
          title: item.title,
          name: item.name,
          media_type: item.media_type,
          poster_path: item.poster_path,
          backdrop_path: item.backdrop_path,
          overview: item.overview,
          vote_average: item.vote_average,
          release_date: item.release_date,
          first_air_date: item.first_air_date,
        }));

      res.json({ results, source: "tmdb_api" });
    } catch (error) {
      console.error("TMDB search error:", error);
      res.status(500).json({ error: "Failed to search media" });
    }
  });

  // API Route: TV Show details containing seasons
  app.get("/api/tv/:id", async (req, res) => {
    const id = req.params.id;
    const key = process.env.TMDB_API_KEY;

    if (!key || key === "MY_TMDB_API_KEY" || isNaN(Number(id))) {
      // Return beautiful structured season-episode fallback structure
      return res.json({
        id: Number(id),
        number_of_seasons: 3,
        seasons: [
          { id: 101, name: "Season 1", season_number: 1, episode_count: 10 },
          { id: 102, name: "Season 2", season_number: 2, episode_count: 8 },
          { id: 103, name: "Season 3", season_number: 3, episode_count: 10 },
        ],
      });
    }

    try {
      const tvRes = await fetch(
        `https://api.themoviedb.org/3/tv/${id}?api_key=${key}&language=en-US`
      );
      if (!tvRes.ok) {
        throw new Error(`TMDB responded with status ${tvRes.status}`);
      }
      const data = await tvRes.json();
      const seasons = (data.seasons || [])
        .filter((s: any) => s.season_number > 0) // filter out specials
        .map((s: any) => ({
          id: s.id,
          name: s.name || `Season ${s.season_number}`,
          season_number: s.season_number,
          episode_count: s.episode_count || 10,
        }));

      res.json({
        id: Number(id),
        number_of_seasons: data.number_of_seasons || seasons.length,
        seasons: seasons.length > 0 ? seasons : [
          { id: 201, name: "Season 1", season_number: 1, episode_count: 10 }
        ],
      });
    } catch (error) {
      console.error("TV Show detailed fetch failed, using fallback seasons:", error);
      res.json({
        id: Number(id),
        number_of_seasons: 3,
        seasons: [
          { id: 101, name: "Season 1", season_number: 1, episode_count: 10 },
          { id: 102, name: "Season 2", season_number: 2, episode_count: 8 },
          { id: 103, name: "Season 3", season_number: 3, episode_count: 10 },
        ],
      });
    }
  });

  // Serve static files / Vite dev middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // SPA routing callback
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} (http://localhost:${PORT})`);
  });
}

startServer();
