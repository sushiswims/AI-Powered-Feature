import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getTrending, getPosterUrl } from '../lib/tmdb'
import { useAuth } from '../lib/AuthContext'

export default function Home() {
  const [trending, setTrending] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    getTrending().then(setTrending).catch(console.error)
  }, [])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff' }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0000 0%, #0f0f0f 60%)',
        padding: '5rem 2rem',
        textAlign: 'center',
        borderBottom: '1px solid #2a2a2a',
      }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '1rem' }}>
          Your personal <span style={{ color: '#e50914' }}>movie diary</span>
        </h1>
        <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Search any film, build your watchlist, rate and review — all saved to your account.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/search" style={heroBtnPrimary}>Search Movies</Link>
          {!user && <Link to="/signup" style={heroBtnSecondary}>Create Account</Link>}
          {user && <Link to="/watchlist" style={heroBtnSecondary}>My Watchlist</Link>}
        </div>
      </div>

      {/* Trending */}
      <div style={{ padding: '3rem 2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1.5rem', color: '#fff' }}>
          🔥 Trending This Week
        </h2>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {trending.slice(0, 12).map(movie => (
            <div key={movie.id} style={{ flexShrink: 0, width: '130px' }}>
              {movie.poster_path ? (
                <img
                  src={getPosterUrl(movie.poster_path, 'w300')}
                  alt={movie.title}
                  style={{ width: '100%', borderRadius: '6px', display: 'block' }}
                />
              ) : (
                <div style={{ width: '130px', height: '195px', backgroundColor: '#222', borderRadius: '6px' }} />
              )}
              <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {movie.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const heroBtnPrimary = {
  backgroundColor: '#e50914',
  color: '#fff',
  padding: '0.75rem 2rem',
  borderRadius: '4px',
  textDecoration: 'none',
  fontWeight: '700',
  fontSize: '1rem',
}

const heroBtnSecondary = {
  backgroundColor: 'transparent',
  color: '#fff',
  padding: '0.75rem 2rem',
  borderRadius: '4px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '1rem',
  border: '1px solid #555',
}
