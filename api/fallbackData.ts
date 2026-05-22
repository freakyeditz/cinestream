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

export const FALLBACK_TRENDING_MOVIES: MediaItem[] = [
  {
    id: 872585,
    title: "Oppenheimer",
    media_type: "movie",
    poster_path: "/8Gxv0Z7gZg9tZgPh6v6p7iVEzTC.jpg",
    backdrop_path: "/rLb2FiFSToP6g67y87gGKzYIA6b.jpg",
    overview: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    vote_average: 8.1,
    release_date: "2023-07-19"
  },
  {
    id: 693134,
    title: "Dune: Part Two",
    media_type: "movie",
    poster_path: "/cz01TRQNAgXv39gdfu0u0v7gZp2.jpg",
    backdrop_path: "/xOM6Z6v7IQ6v5kndveq6v7gZp2.jpg",
    overview: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    vote_average: 8.2,
    release_date: "2024-02-27"
  },
  {
    id: 157336,
    title: "Interstellar",
    media_type: "movie",
    poster_path: "/gEU2Qv6G6n3g9tS6v6p7iVEzTC.jpg",
    backdrop_path: "/xJHbUvS6Ur789C68zg6is6bO6Og.jpg",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    vote_average: 8.4,
    release_date: "2014-11-05"
  },
  {
    id: 569094,
    title: "Spider-Man: Across the Spider-Verse",
    media_type: "movie",
    poster_path: "/8Vt1mS9kFunSgCH67SJP87bSTBM.jpg",
    backdrop_path: "/4MCK6997h69nF6v8L7mYIYI77m.jpg",
    overview: "After reuniting with Gwen Stacy, Brooklyn’s full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    vote_average: 8.4,
    release_date: "2023-05-31"
  },
  {
    id: 27205,
    title: "Inception",
    media_type: "movie",
    poster_path: "/o0Ois0un0ic9YgR65v6p7iVEzTC.jpg",
    backdrop_path: "/s3TBr79LIiqg8p2pdSg6is6bO6Og.jpg",
    overview: "Cobb, a skilled thief who is absolute best in the dangerous art of extraction, steals valuable secrets from deep within the subconscious during the dream state.",
    vote_average: 8.4,
    release_date: "2010-07-15"
  },
  {
    id: 155,
    title: "The Dark Knight",
    media_type: "movie",
    poster_path: "/qJ2tW6WMUDmg9S7of6p7iVEzTC.jpg",
    backdrop_path: "/dqK76n2gGQFUOI0gZgGis6bO6Og.jpg",
    overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.",
    vote_average: 8.5,
    release_date: "2008-07-16"
  }
];

export const FALLBACK_TRENDING_TV: MediaItem[] = [
  {
    id: 66732,
    name: "Stranger Things",
    media_type: "tv",
    poster_path: "/49Y03b7mYI2r6v8L7mYIYI77m.jpg",
    backdrop_path: "/56v2byZ96V49XnFv8L7mYIYI77m.jpg",
    overview: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    vote_average: 8.6,
    first_air_date: "2016-07-15"
  },
  {
    id: 99966,
    name: "The Last of Us",
    media_type: "tv",
    poster_path: "/uKvH6997h69nF6v8L7mYIYI77m.jpg",
    backdrop_path: "/26nbUvS6Ur789C68zg6is6bO6Og.jpg",
    overview: "Twenty years after modern civilization has been destroyed, Joel, a hardened survivor, is hired to smuggle Ellie, a 14-year-old girl, out of an oppressive quarantine zone.",
    vote_average: 8.7,
    first_air_date: "2023-01-15"
  },
  {
    id: 1399,
    name: "Game of Thrones",
    media_type: "tv",
    poster_path: "/1XS6UvS6Ur789C68zg6is6bO6Og.jpg",
    backdrop_path: "/7qK76n2gGQFUOI0gZgGis6bO6Og.jpg",
    overview: "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north.",
    vote_average: 8.4,
    first_air_date: "2011-04-17"
  },
  {
    id: 1396,
    name: "Breaking Bad",
    media_type: "tv",
    poster_path: "/gg6is6bO6Og1XS6UvS6Ur789C68zg.jpg",
    backdrop_path: "/39C68zg6is6bO6Og1XS6UvS6Ur78.jpg",
    overview: "Walter White, a chemistry teacher, discovers that he has cancer and decides to get into the meth-making business to repay his medical debts and secure his family's financial future.",
    vote_average: 8.9,
    first_air_date: "2008-01-20"
  },
  {
    id: 111110,
    name: "Sh\u014dgun",
    media_type: "tv",
    poster_path: "/zo7gZg9tZgPh6v6p7iVEzTC.jpg",
    backdrop_path: "/shogun_backdrop.jpg",
    overview: "In Japan in the year 1600, Lord Yoshii Toranaga struggles for his life as his enemies on the Council of Regents unite against him, when a mysterious European ship is found stranded in a nearby fishing village.",
    vote_average: 8.7,
    first_air_date: "2024-02-27"
  },
  {
    id: 76479,
    name: "The Boys",
    media_type: "tv",
    poster_path: "/boys_poster.jpg",
    backdrop_path: "/boys_backdrop.jpg",
    overview: "A group of vigilantes set out to take down corrupt superheroes who abuse their superpowers.",
    vote_average: 8.5,
    first_air_date: "2019-07-25"
  }
];
