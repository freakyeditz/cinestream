export default function handler(req: any, res: any) {
  res.status(200).json({ hasTmdbKey: !!process.env.TMDB_API_KEY });
}
