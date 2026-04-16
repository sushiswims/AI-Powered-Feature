import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import { getPosterUrl } from '../lib/tmdb'
import StarRating from '../components/StarRating'

export default function Watchlist() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | watched | unwatched
  const [sortBy, setSortBy] = useState('date_added') // date_added | rating | title
  const [editingId, setEditingId] = useState(null)
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(0)

  useEffect(() => {
    fetchWatchlist()
  }, [user])

  const fetchWatchlist = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setItems(data || [])
    setLoading(false)
  }

  const toggleWatched = async (item) => {
    const { error } = await supabase
      .from('watchlist')
      .update({ watched: !item.watched })
      .eq('id', item.id)
    if (!error) setItems(prev => prev.map(i => i.id === item.id ? { ...i, watched: !i.watched } : i))
  }

  const removeItem = async (id) => {
    await supabase.from('watchlist').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setReviewText(item.review || '')
    setReviewRating(item.rating || 0)
  }

  const saveReview = async (id) => {
    const { error } = await supabase
      .from('watchlist')
      .update({ rating: reviewRating, review: reviewText })
      .eq('id', id)
    if (!error) {
      setItems(prev => prev.map(i => i.id === id ? { ...i, rating: reviewRating, review: reviewText } : i))
      setEditingId(null)
    }
  }

  const filtered = items
    .filter(i => filter === 'all' ? true : filter === 'watched' ? i.watched : !i.watched)
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return 0
    })

  if (loading) return <div style={loadingStyle}>Loading your watchlist...</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', padding: '2rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem' }}>My Watchlist</h1>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>{items.length} movies · {items.filter(i => i.watched).length} watched</p>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['all', 'watched', 'unwatched'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={filter === f ? activeFilterBtn : filterBtn}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          style={selectStyle}
        >
          <option value="date_added">Sort: Date Added</option>
          <option value="rating">Sort: Rating</option>
          <option value="title">Sort: Title</option>
        </select>
      </div>

      {filtered.length === 0 && (
        <div style={{ color: '#666', textAlign: 'center', marginTop: '4rem' }}>
          {items.length === 0 ? 'Your watchlist is empty. Search for movies to add them!' : 'No movies match this filter.'}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(item => (
          <div key={item.id} style={cardStyle}>
            {item.poster_path && (
              <img
                src={getPosterUrl(item.poster_path, 'w92')}
                alt={item.title}
                style={{ width: '60px', height: '90px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff' }}>{item.title}</h3>
                <span style={{ fontSize: '0.8rem', color: '#888' }}>{item.release_date?.split('-')[0]}</span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.6rem',
                  borderRadius: '20px',
                  backgroundColor: item.watched ? '#1a3a1a' : '#2a2a2a',
                  color: item.watched ? '#7ec87e' : '#888',
                }}>
                  {item.watched ? '✓ Watched' : 'Unwatched'}
                </span>
              </div>
              {item.rating > 0 && <StarRating value={item.rating} readonly />}
              {item.review && <p style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{item.review}"</p>}

              {editingId === item.id && (
                <div style={{ marginTop: '0.75rem', backgroundColor: '#1a1a1a', padding: '1rem', borderRadius: '6px' }}>
                  <p style={{ fontSize: '0.85rem', color: '#aaa', marginBottom: '0.5rem' }}>Rating:</p>
                  <StarRating value={reviewRating} onChange={setReviewRating} />
                  <textarea
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    placeholder="Write a review..."
                    rows={3}
                    style={{ ...textareaStyle, marginTop: '0.75rem' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button onClick={() => saveReview(item.id)} style={saveBtnStyle}>Save</button>
                    <button onClick={() => setEditingId(null)} style={cancelBtnStyle}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
              <button onClick={() => toggleWatched(item)} style={actionBtn}>
                {item.watched ? 'Mark Unwatched' : 'Mark Watched'}
              </button>
              <button onClick={() => openEdit(item)} style={actionBtn}>Rate / Review</button>
              <button onClick={() => removeItem(item.id)} style={removeBtn}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const loadingStyle = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', backgroundColor: '#0f0f0f' }
const cardStyle = { backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }
const filterBtn = { padding: '0.4rem 1rem', backgroundColor: '#2a2a2a', color: '#aaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
const activeFilterBtn = { ...filterBtn, backgroundColor: '#e50914', color: '#fff' }
const selectStyle = { padding: '0.4rem 0.8rem', backgroundColor: '#2a2a2a', color: '#aaa', border: '1px solid #333', borderRadius: '4px', fontSize: '0.85rem', cursor: 'pointer' }
const actionBtn = { padding: '0.3rem 0.7rem', backgroundColor: '#2a2a2a', color: '#ccc', border: '1px solid #333', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem', whiteSpace: 'nowrap' }
const removeBtn = { ...actionBtn, color: '#e57373', borderColor: '#5a2a2a' }
const saveBtnStyle = { padding: '0.3rem 0.8rem', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
const cancelBtnStyle = { padding: '0.3rem 0.8rem', backgroundColor: '#333', color: '#aaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
const textareaStyle = { width: '100%', backgroundColor: '#111', border: '1px solid #333', color: '#fff', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', resize: 'vertical', boxSizing: 'border-box' }
