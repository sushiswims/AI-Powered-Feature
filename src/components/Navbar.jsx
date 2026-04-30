import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Navbar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/')
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
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
        <Link to="/" style={{ textDecoration: 'none' }} onClick={closeMenu}>
          <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#e50914', letterSpacing: '1px' }}>
            🎬 CineLog
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }} className="desktop-nav">
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

        {/* Hamburger button — mobile only */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="hamburger"
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#fff' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#fff' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', backgroundColor: '#fff' }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          backgroundColor: '#141414',
          borderBottom: '1px solid #2a2a2a',
          zIndex: 99,
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 2rem',
          gap: '1rem',
        }}>
          <Link to="/search" style={mobileLink} onClick={closeMenu}>Search</Link>
          <Link to="/recommend" style={{ ...mobileLink, color: '#e50914' }} onClick={closeMenu}>✦ For You</Link>
          {user ? (
            <>
              <Link to="/watchlist" style={mobileLink} onClick={closeMenu}>Watchlist</Link>
              <Link to="/profile" style={mobileLink} onClick={closeMenu}>Profile</Link>
              <button onClick={handleSignOut} style={{ ...btnStyle, textAlign: 'left', width: 'fit-content' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={mobileLink} onClick={closeMenu}>Login</Link>
              <Link to="/signup" style={{ ...btnStyle, textDecoration: 'none', width: 'fit-content' }} onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

const navLink = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '0.95rem',
}

const mobileLink = {
  color: '#ccc',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: '500',
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
