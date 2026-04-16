import { getPosterUrl } from '../lib/tmdb'

export default function MovieCard({ movie, onAdd, onRemove, inWatchlist, showActions = true }) {
  const poster = getPosterUrl(movie.poster_path)
  const year = movie.release_date?.split('-')[0] || 'N/A'

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'transform 0.2s',
      cursor: 'default',
      width: '160px',
      flexShrink: 0,
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {poster ? (
        <img src={poster} alt={movie.title} style={{ width: '100%', display: 'block', height: '240px', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: '240px', backgroundColor: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
          No Image
        </div>
      )}
      <div style={{ padding: '0.6rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {movie.title}
        </p>
        <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>{year}</p>
        {showActions && (
          inWatchlist ? (
            <button onClick={() => onRemove(movie)} style={removeBtnStyle}>✓ Added</button>
          ) : (
            <button onClick={() => onAdd(movie)} style={addBtnStyle}>+ Watchlist</button>
          )
        )}
      </div>
    </div>
  )
}

const addBtnStyle = {
  width: '100%',
  padding: '0.3rem',
  backgroundColor: '#e50914',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: '600',
}

const removeBtnStyle = {
  width: '100%',
  padding: '0.3rem',
  backgroundColor: '#2a2a2a',
  color: '#aaa',
  border: '1px solid #444',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.78rem',
}
