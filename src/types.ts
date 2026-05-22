export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  media_type: 'movie' | 'tv';
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

export interface TVShowDetails extends MediaItem {
  number_of_seasons: number;
  seasons: {
    id: number;
    name: string;
    season_number: number;
    episode_count: number;
  }[];
}

export interface APIResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}
