import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      navigate('/watchlist')
    }
    setLoading(false)
  }

  return (
    <div style={pageStyle}>
      <div style={formBox}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '0.5rem', textAlign: 'center' }}>Welcome back</h1>
        <p style={{ color: '#888', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>Sign in to your CineLog account</p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />

          <label style={labelStyle}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />

          <button type="submit" disabled={loading} style={submitBtn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/signup" style={{ color: '#e50914' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}

const pageStyle = { minHeight: '100vh', backgroundColor: '#0f0f0f', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }
const formBox = { backgroundColor: '#1a1a1a', borderRadius: '10px', padding: '2.5rem', width: '100%', maxWidth: '400px', border: '1px solid #2a2a2a' }
const labelStyle = { display: 'block', fontSize: '0.85rem', color: '#aaa', marginBottom: '0.4rem', marginTop: '1rem' }
const inputStyle = { width: '100%', padding: '0.7rem 1rem', backgroundColor: '#111', border: '1px solid #333', borderRadius: '4px', color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none' }
const submitBtn = { width: '100%', padding: '0.8rem', backgroundColor: '#e50914', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '700', fontSize: '1rem', marginTop: '1.5rem' }
const errorStyle = { backgroundColor: '#3a1a1a', border: '1px solid #6a2a2a', color: '#e57373', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1rem' }
