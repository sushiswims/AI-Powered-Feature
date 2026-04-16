import { useRef, useState } from 'react'
import { streamRecommendations } from '../lib/llm'
import { useAuth } from '../lib/AuthContext'

const EXAMPLES = [
  "Something scary but with dark humor",
  "A slow burn that's deeply emotional",
  "Visually stunning, I don't care about plot",
  "A great thriller I've probably never heard of",
  "Something like Parasite but set in the US",
]

// Parse the AI's markdown output into card objects as it streams in
function parseRecs(text) {
  const blocks = text.split(/\n(?=\*\*\d+\.)/).filter(Boolean)
  return blocks.map(block => {
    const titleMatch = block.match(/\*\*\d+\.\s+(.+?)\*\*/)
    const title = titleMatch ? titleMatch[1].trim() : null
    const body = block.replace(/\*\*[^*]+\*\*/, '').trim()
    return { title, body }
  }).filter(r => r.title)
}

export default function AiRecommend() {
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const [recs, setRecs] = useState([])
  const [streamText, setStreamText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef(null)

  async function handleSubmit(promptOverride) {
    const query = (promptOverride || input).trim()
    if (!query || loading) return

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError('')
    setRecs([])
    setStreamText('')

    let accumulated = ''

    try {
      await streamRecommendations({
        prompt: query,
        watchlist: [],
        signal: controller.signal,
        onChunk(chunk) {
          accumulated += chunk
          setStreamText(accumulated)
          setRecs(parseRecs(accumulated))
        },
      })
      setRecs(parseRecs(accumulated))
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError(e.message || 'Could not connect to Ollama. Make sure it is running: ollama serve')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: '#fff', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            ✦ What are you in the mood for?
          </h1>
          <p style={{ color: '#aaa', fontSize: '0.95rem' }}>
            Describe a vibe, a feeling, or a genre — get 4 picks tailored to you.
          </p>
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() } }}
            placeholder="e.g. Something tense and psychological with a twist ending…"
            disabled={loading}
            rows={2}
            style={{
              flex: 1,
              backgroundColor: '#1a1a1a',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              color: '#fff',
              resize: 'none',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              opacity: loading ? 0.5 : 1,
            }}
          />
          <button
            onClick={() => handleSubmit()}
            disabled={loading || !input.trim()}
            style={{
              backgroundColor: loading || !input.trim() ? '#555' : '#e50914',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.75rem 1.25rem',
              fontWeight: '700',
              fontSize: '0.9rem',
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              whiteSpace: 'nowrap',
              minWidth: '130px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
            }}
          >
            {loading ? <Spinner /> : 'Recommend →'}
          </button>
        </div>

        {/* Example chips */}
        {!loading && recs.length === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#555', alignSelf: 'center' }}>Try:</span>
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => { setInput(ex); handleSubmit(ex) }}
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '999px',
                  padding: '0.35rem 0.9rem',
                  color: '#aaa',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s',
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#2a0000',
            border: '1px solid #e50914',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            color: '#ff6b6b',
            fontSize: '0.875rem',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        {/* Raw stream before first card parses */}
        {loading && recs.length === 0 && streamText && (
          <div style={{
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: '8px',
            padding: '1.25rem',
            color: '#aaa',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
          }}>
            {streamText}
            <span style={{ display: 'inline-block', width: '2px', height: '1em', backgroundColor: '#e50914', marginLeft: '2px', verticalAlign: 'text-bottom', animation: 'blink 0.8s step-end infinite' }} />
          </div>
        )}

        {/* Recommendation cards */}
        {recs.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {recs.map((rec, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  animation: 'slideIn 0.2s ease',
                }}
              >
                <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#e50914', minWidth: '2rem', lineHeight: 1 }}>
                  {i + 1}
                </span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: '700', fontSize: '1rem', color: '#fff', marginBottom: '0.4rem' }}>
                    {rec.title}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#aaa', lineHeight: 1.65 }}>
                    {rec.body}
                    {loading && i === recs.length - 1 && (
                      <span style={{ display: 'inline-block', width: '2px', height: '1em', backgroundColor: '#e50914', marginLeft: '2px', verticalAlign: 'text-bottom' }} />
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ask again button */}
        {!loading && recs.length > 0 && (
          <button
            onClick={() => { setRecs([]); setStreamText(''); setInput('') }}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid #2a2a2a',
              borderRadius: '6px',
              color: '#aaa',
              padding: '0.6rem 1.25rem',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Ask something else
          </button>
        )}
      </div>

      <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slideIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}

function Spinner() {
  return (
    <span style={{
      width: '16px', height: '16px',
      border: '2px solid rgba(255,255,255,0.3)',
      borderTopColor: '#fff',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.7s linear infinite',
    }} />
  )
}
