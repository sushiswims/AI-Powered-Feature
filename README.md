## AI-Powered Feature: Movie Recommendations

**Option A — LLM API (Complete Tier)**

I added an AI recommendation page that lets users describe a mood or vibe and receive four tailored movie picks, streamed in real time using Ollama.

### What it does
- User types a prompt
- Calls a local LLM via Ollama and streams the response token by token
- Recommendations appear card by card as the response generates
- Works alongside the existing TMDB and Supabase integrations

### How to run
1. Download Ollama at https://ollama.com and install it
2. Run: `ollama pull gemma3:4b`
3. Add your `.env` file with Supabase and TMDB keys
4. `npm install` then `npm run dev`
5. Click **✦ For You** in the navbar
