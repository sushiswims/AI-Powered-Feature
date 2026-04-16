const TMDB_BASE = 'https://api.themoviedb.org/3'
const TOKEN = import.meta.env.VITE_TMDB_TOKEN

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  'Content-Type': 'application/json',
}

export const searchMovies = async (query) => {
  const res = await fetch(
    `${TMDB_BASE}/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    { headers }
  )
  const data = await res.json()
  return data.results || []
}

export const getMovieDetails = async (id) => {
  const res = await fetch(`${TMDB_BASE}/movie/${id}?language=en-US`, { headers })
  return res.json()
}

export const getTrending = async () => {
  const res = await fetch(`${TMDB_BASE}/trending/movie/week?language=en-US`, { headers })
  const data = await res.json()
  return data.results || []
}

export const getPosterUrl = (path, size = 'w500') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null
