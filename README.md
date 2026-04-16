# CineLog — Personal Movie Tracker

A full-stack movie tracking app built with React, Supabase, and the TMDB API. Search for any film, build a personal watchlist, rate and review movies, and track your watching stats — all synced to your account across devices.

Live site: https://sushiswims.github.io/filmlog

---

## Project Description

CineLog is a Letterboxd-inspired personal movie diary. Users can search a live movie catalog powered by the TMDB API, save films to their watchlist, mark them as watched or unwatched, leave star ratings and written reviews, and filter or sort their collection. Each user has their own private account so data is saved and accessible from anywhere.

---

## Features

1. **Movie Search** — Search any movie using the TMDB API. Results show poster, title, and year. Trending movies are shown by default.
2. **Watchlist Management** — Add movies to a personal watchlist and remove them at any time.
3. **Watched / Unwatched Toggle** — Mark movies as watched or flip them back to unwatched.
4. **Ratings and Reviews** — Leave a 1–5 star rating and a written review for any movie.
5. **Filter and Sort** — Filter by watched/unwatched status and sort by date added, rating, or title.
6. **User Authentication** — Sign up, log in, and log out. Session persists on page refresh.
7. **Cloud Database** — All watchlist data stored in Supabase (PostgreSQL). Each user only sees their own data with Row Level Security enabled.
8. **Profile and Stats Dashboard** — View total movies, watched count, average rating, and top-rated films. Edit your display name.

---

## Tech Stack

- **Frontend:** React 19 + Vite
- **Routing:** React Router DOM v6
- **Auth and Database:** Supabase (PostgreSQL + Auth)
- **Movie Data:** TMDB API
- **Deployment:** GitHub Pages

---

## Known Bugs / Limitations

- Movie genre filtering is not yet implemented (planned as a future feature)
- Trending section on the home page shows TMDB weekly trending, not personalized recommendations
- Email confirmation is required by Supabase before logging in after signup

---

## What I Learned

Working with AI assistance on this project taught me a lot about how to prompt effectively. Vague prompts got me vague results, but being specific and sharing the exact error led to much faster solutions. I also learned that AI suggestions are not always the best approach and that pushing back or asking for alternatives often led to cleaner code. The biggest technical thing I learned was how Supabase Row Level Security works and why it matters.
