import { FALLBACK_TRENDING_MOVIES, FALLBACK_TRENDING_TV } from '../fallbackData.js';

export default async function handler(req: any, res: any) {
  const key = process.env.TMDB_API_KEY;
  if (!key || key === "MY_TMDB_API_KEY") {
    return res.status(200).json({
      movies: FALLBACK_TRENDING_MOVIES,
      tv: FALLBACK_TRENDING_TV,
      source: "fallback",
    });
  }

  try {
    const movieRes = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${key}&language=en-US`);
    const tvRes = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${key}&language=en-US`);

    const moviesData = await movieRes.json();
    const tvData = await tvRes.json();

    const movies = (moviesData.results || []).slice(0, 10).map((m: any) => ({
      id: m.id,
      title: m.title,
      media_type: "movie",
      poster_path: m.poster_path,
      backdrop_path: m.backdrop_path,
      overview: m.overview,
      vote_average: m.vote_average,
      release_date: m.release_date,
    }));

    const tv = (tvData.results || []).slice(0, 10).map((t: any) => ({
      id: t.id,
      name: t.name,
      media_type: "tv",
      poster_path: t.poster_path,
      backdrop_path: t.backdrop_path,
      overview: t.overview,
      vote_average: t.vote_average,
      first_air_date: t.first_air_date,
    }));

    return res.status(200).json({ movies, tv, source: "tmdb_api" });
  } catch (error) {
    console.error("TMDB fetch error:", error);
    return res.status(200).json({
      movies: FALLBACK_TRENDING_MOVIES,
      tv: FALLBACK_TRENDING_TV,
      source: "fallback_error",
    });
  }
}
