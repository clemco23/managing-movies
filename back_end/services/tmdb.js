const axios = require("axios");

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_KEY = process.env.TMDB_API_KEY;

async function matchWithTMDB(title, releaseYear) {
  if (!TMDB_KEY) throw new Error("TMDB_API_KEY manquante");

  const res = await axios.get(`${TMDB_BASE}/search/movie`, {
    params: {
      api_key: TMDB_KEY,
      query: title,
      year: releaseYear || undefined,
      include_adult: false,
      language: "fr-FR",
    },
  });

  const results = res.data?.results || [];
  if (!results.length) return null;

  const best = results[0]; 

  return {
    tmdbId: best.id ?? null,
    tmdbPosterPath: best.poster_path ?? null,
    tmdbGenres: best.genre_ids ?? [],
    tmdbVoteAverage: best.vote_average ?? null,
    tmdbVoteCount: best.vote_count ?? null,
  };
}

module.exports = { matchWithTMDB };
