import { FALLBACK_TRENDING_MOVIES, FALLBACK_TRENDING_TV } from '../fallbackData.js';

export default async function handler(req: any, res: any) {
  const query = String(req.query.query || "").trim();
  if (!query) {
    return res.status(200).json({ results: [] });
  }

  const key = process.env.TMDB_API_KEY;
  if (!key || key === "MY_TMDB_API_KEY") {
    const combined = [...FALLBACK_TRENDING_MOVIES, ...FALLBACK_TRENDING_TV];
    const filtered = combined.filter((item) => {
      const titleText = (item.title || item.name || "").toLowerCase();
      return titleText.includes(query.toLowerCase());
    });
    return res.status(200).json({ results: filtered, source: "fallback" });
  }

  try {
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=${key}&query=${encodeURIComponent(query)}&language=en-US&include_adult=false`
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

    return res.status(200).json({ results, source: "tmdb_api" });
  } catch (error) {
    console.error("TMDB search error:", error);
    return res.status(500).json({ error: "Failed to search media" });
  }
}
