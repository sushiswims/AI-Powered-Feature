# Transcript Highlights

### 1. Planning the data model and project structure (Early)
Before writing any code, I asked Claude to help me think through the full file structure for a React + Supabase app. We mapped out which components, pages, and library files were needed before touching a single line of code. This was important because it prevented me from building things in the wrong order and having to backtrack.

### 2. Setting up Supabase Auth with session persistence (Auth setup)
I asked Claude to build an AuthContext using React Context API so that the logged-in user would be available across the whole app without prop drilling. The key moment was making sure `supabase.auth.getSession()` ran on mount so users stay logged in after a page refresh — not just when they actively sign in.

### 3. Debugging protected routes (Routing)
My protected routes were redirecting to login even when the user was already signed in. The issue was that the auth state had not loaded yet when the route rendered. I described the problem to Claude and we added a `loading` state check in `ProtectedRoute.jsx` so it waits for the session to resolve before deciding whether to redirect.

### 4. Connecting TMDB search to Supabase watchlist (Feature integration)
I asked Claude to make the search results show whether a movie was already in the user's watchlist. Claude suggested fetching all watchlist `tmdb_id` values on load and storing them in a `Set` for O(1) lookups. I thought that was smarter than querying Supabase on every card render, so I kept that approach.

### 5. Rejecting over-complicated profile logic (Human judgment)
Claude initially suggested storing profile data inside Supabase Auth user metadata. I pushed back on this because it would make the data harder to query and display later. We switched to a separate `profiles` table with an upsert approach instead, which was cleaner and more flexible.
