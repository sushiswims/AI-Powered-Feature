// src/lib/llm.js
// AI movie recommendations via Ollama (free, no API key needed)
// Setup: download Ollama at https://ollama.com, then run: ollama pull gemma3:4b

const OLLAMA_API = 'http://localhost:11434/api/generate'

export async function streamRecommendations({ prompt, watchlist = [], onChunk, signal }) {
  const watchlistContext = watchlist.length > 0
    ? `The user has already saved these films: ${watchlist.map(e => e.title).join(', ')}. Avoid recommending those.`
    : ''

  const fullPrompt = `You are a passionate film critic. Suggest exactly 4 movies based on the user's mood or request.

Use this exact format for each recommendation:

**[NUMBER]. [MOVIE TITLE] ([YEAR])**
[One sentence on why it fits. Be specific and enthusiastic — mention a director, actor, or specific quality.]

No preamble, no sign-off — just the four picks.

${watchlistContext}

User request: ${prompt}`

  const response = await fetch(OLLAMA_API, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemma3:4b',
      prompt: fullPrompt,
      stream: true,
    }),
  })

  if (!response.ok) {
    throw new Error('Could not connect to Ollama. Make sure it is running: ollama serve')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    const lines = decoder.decode(value).split('\n').filter(Boolean)
    for (const line of lines) {
      try {
        const event = JSON.parse(line)
        if (event.response) onChunk(event.response)
      } catch { /* skip malformed lines */ }
    }
  }
}
