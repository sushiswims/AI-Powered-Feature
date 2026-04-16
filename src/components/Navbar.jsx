import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav style={{
      backgroundColor: '#141414',
      borderBottom: '1px solid #2a2a2a',
      padding: '0 2rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#e50914', letterSpacing: '1px' }}>
          🎬 CineLog
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
        <Link to="/search" style={navLink}>Search</Link>
        <Link to="/recommend" style={{ ...navLink, color: '#e50914', fontWeight: '600' }}>✦ For You</Link>
        {user ? (
          <>
            <Link to="/watchlist" style={navLink}>Watchlist</Link>
            <Link to="/profile" style={navLink}>Profile</Link>
            <button onClick={handleSignOut} style={btnStyle}>Sign Out</button>
          </>
        ) : (
          <>
            <Link to="/login" style={navLink}>Login</Link>
            <Link to="/signup" style={{ ...btnStyle, textDecoration: 'none' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const navLink = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '0.95rem',
  transition: 'color 0.2s',
}

const btnStyle = {
  backgroundColor: '#e50914',
  color: '#fff',
  border: 'none',
  padding: '0.4rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: '600',
}
