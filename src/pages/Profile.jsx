import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/AuthContext'
import StarRating from '../components/StarRating'

export default function Profile() {
  const { user, signOut } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [displayName, setDisplayName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchData()
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('watchlist')
      .select('*')
      .eq('user_id', user.id)
    setWatchlist(data || [])

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()
    if (profile?.display_name) setDisplayName(profile.display_name)
    else setDisplayName(user.email.split('@')[0])
    setLoading(false)
  }

  const saveName = async () => {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, display_name: nameInput })
    if (!error) {
      setDisplayName(nameInput)
      setEditingName(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    }
  }

  // Stats
  const watched = watchlist.filter(i => i.watched)
  const unwatched = watchlist.filter(i => !i.watched)
  const rated = watchlist.filter(i => i.rating > 0)
  const avgRating = rated.length > 0
    ? (rated.reduce((sum, i) => sum + i.rating, 0) / rated.length).toFixed(1)
    : null
  const topRated = [...watchlist].filter(i => i.rating > 0).sort((a, b) => b.rating - a.rating).slice(0, 3)

  if (loading) return <div style={loadingStyle}>Loading...</div>

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>

      {/* Profile Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', backgroundColor: '#e50914', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: '700', flexShrink: 0 }}>
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div>
          {editingName ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                style={nameInputStyle}
                autoFocus
              />
              <button onClick={saveName} style={saveBtnStyle}>Save</button>
              <button onClick={() => setEditingName(false)} style={cancelBtnStyle}>Cancel</button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{displayName}</h1>
              <button onClick={() => { setNameInput(displayName); setEditingName(true) }} style={editBtnStyle}>Edit</button>
            </div>
          )}
          <p style={{ color: '#666', fontSize: '0.85rem' }}>{user.email}</p>
          {saved && <p style={{ color: '#7ec87e', fontSize: '0.8rem' }}>Name updated!</p>}
        </div>
      </div>

      {/* Stats Grid */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#aaa', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Stats</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
        {[
          { label: 'Total Movies', value: watchlist.length },
          { label: 'Watched', value: watched.length },
          { label: 'Unwatched', value: unwatched.length },
          { label: 'Avg Rating', value: avgRating ? `${avgRating} ★` : '—' },
        ].map(stat => (
          <div key={stat.label} style={statCard}>
            <p style={{ fontSize: '2rem', fontWeight: '800', color: '#e50914' }}>{stat.value}</p>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Top Rated */}
      {topRated.length > 0 && (
        <>
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#aaa', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Top Rated</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {topRated.map((item, idx) => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: '#1a1a1a', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                <span style={{ color: '#e50914', fontWeight: '800', fontSize: '1.1rem', width: '20px' }}>#{idx + 1}</span>
                <span style={{ flex: 1, fontWeight: '600' }}>{item.title}</span>
                <StarRating value={item.rating} readonly />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Sign Out */}
      <button onClick={signOut} style={signOutBtn}>Sign Out</button>
    </div>
  )
}

const loadingStyle = { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', backgroundColor: '#0f0f0f' }
const statCard = { backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '1.25rem', textAlign: 'center', border: '1px solid #2a2a2a' }
const nameInputStyle = { padding: '0.4rem 0.8rem', backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '1rem', outline: 'none' }
const saveBtnStyle = { padding: '0.4rem 0.8rem', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
const cancelBtnStyle = { padding: '0.4rem 0.8rem', backgroundColor: '#333', color: '#aaa', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }
const editBtnStyle = { padding: '0.2rem 0.6rem', backgroundColor: '#2a2a2a', color: '#aaa', border: '1px solid #444', borderRadius: '4px', cursor: 'pointer', fontSize: '0.78rem' }
const signOutBtn = { padding: '0.7rem 2rem', backgroundColor: 'transparent', color: '#e57373', border: '1px solid #5a2a2a', borderRadius: '4px', cursor: 'pointer', fontSize: '0.95rem' }
