import { useState, useEffect } from 'react'
import { searchMovies, getTrending } from '../lib/tmdb'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import MovieCard from '../components/MovieCard'

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [trending, setTrending] = useState([])
  const [watchlistIds, setWatchlistIds] = useState(new Set())
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    getTrending().then(setTrending).catch(console.error)
    if (user) fetchWatchlistIds()
  }, [user])

  const fetchWatchlistIds = async () => {
    const { data } = await supabase
      .from('watchlist')
      .select('tmdb_id')
      .eq('user_id', user.id)
    if (data) setWatchlistIds(new Set(data.map(d => d.tmdb_id)))
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    try {
      const data = await searchMovies(query)
      setResults(data)
    } catch {
      setMessage('Search failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (movie) => {
    if (!user) { setMessage('Please log in to add movies to your watchlist.'); return }
    const { error } = await supabase.from('watchlist').insert({
      user_id: user.id,
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      overview: movie.overview,
      watched: false,
    })
    if (!error) {
      setWatchlistIds(prev => new Set([...prev, movie.id]))
      setMessage(`"${movie.title}" added to watchlist!`)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleRemove = async (movie) => {
    if (!user) return
    await supabase.from('watchlist').delete().eq('user_id', user.id).eq('tmdb_id', movie.id)
    setWatchlistIds(prev => { const next = new Set(prev); next.delete(movie.id); return next })
    setMessage(`"${movie.title}" removed from watchlist.`)
    setTimeout(() => setMessage(''), 3000)
  }

  const display = results.length > 0 ? results : trending

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '1.5rem' }}>Search Movies</h1>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', maxWidth: '600px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for a movie..."
          style={inputStyle}
        />
        <button type="submit" style={searchBtnStyle} disabled={loading}>
          {loading ? '...' : 'Search'}
        </button>
      </form>

      {message && (
        <div style={{ backgroundColor: '#1a3a1a', border: '1px solid #2d6a2d', color: '#7ec87e', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1rem', maxWidth: '600px' }}>
          {message}
        </div>
      )}

      <h2 style={{ fontSize: '1rem', color: '#888', marginBottom: '1rem' }}>
        {results.length > 0 ? `${results.length} results for "${query}"` : 'Trending This Week'}
      </h2>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {display.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onAdd={handleAdd}
            onRemove={handleRemove}
            inWatchlist={watchlistIds.has(movie.id)}
          />
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  flex: 1,
  padding: '0.7rem 1rem',
  backgroundColor: '#1a1a1a',
  border: '1px solid #333',
  borderRadius: '4px',
  color: '#fff',
  fontSize: '1rem',
  outline: 'none',
}

const searchBtnStyle = {
  padding: '0.7rem 1.5rem',
  backgroundColor: '#e50914',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '1rem',
}
