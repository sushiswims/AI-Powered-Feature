# 🎬 CineLog

A full-stack movie tracking app built with React, Supabase, and the TMDB API. Search any film, build a personal watchlist, rate and review what you've watched, and get AI-powered recommendations based on your mood.

**[Live Demo](https://sushiswims.github.io/Full-Stack-Web-Application)**

---

## Features

- **Search** — Find any movie using the TMDB API with real-time results
- **Watchlist** — Save movies to your personal list, mark them watched, and filter/sort your collection
- **Ratings & Reviews** — Rate movies with a star system and write short reviews
- **AI Recommendations** — Describe a mood or vibe and get four tailored picks streamed in real time via a local LLM (Ollama)
- **Authentication** — Sign up, log in, and persist your session across page refreshes via Supabase Auth
- **Profile** — View your account info and watchlist stats

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Routing | React Router v6 |
| Backend / Auth / DB | Supabase |
| Movie Data | TMDB API |
| AI Recommendations | Ollama (Gemma 3:4b) |
| Deployment | GitHub Pages |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [TMDB API key](https://www.themoviedb.org/settings/api)
- [Ollama](https://ollama.com) installed locally (for AI recommendations)

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/sushiswims/Full-Stack-Web-Application.git
   cd Full-Stack-Web-Application
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root (use `.env.example` as a reference)
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_TMDB_API_KEY=your_tmdb_api_key
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
   ```

4. Pull the AI model (for recommendations)
   ```bash
   ollama pull gemma3:4b
   ```

5. Start the dev server
   ```bash
   npm run dev
   ```

### Supabase Tables

You'll need two tables in your Supabase project:

**watchlist**
| Column | Type |
|---|---|
| id | uuid (primary key) |
| user_id | uuid (references auth.users) |
| tmdb_id | int8 |
| title | text |
| poster_path | text |
| release_date | text |
| overview | text |
| watched | bool |
| rating | int2 |
| review | text |
| created_at | timestamptz |

**profiles**
| Column | Type |
|---|---|
| id | uuid (primary key, references auth.users) |
| username | text |
| updated_at | timestamptz |

---

## Note on AI Recommendations

The AI feature runs against a local Ollama instance and requires Ollama to be running on your machine. It will not work on the live GitHub Pages deployment without a hosted LLM API. This is the main thing I would change in a future version — swapping Ollama for a hosted endpoint so the feature works for everyone.
