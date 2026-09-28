# SkillSync frontend

React, Vite, JavaScript, Tailwind CSS, React Router, Framer Motion, Recharts, Axios, and Lucide React.

## Run locally

```powershell
npm install
npm run dev
```

The app uses mock mode by default. It includes 30 student profiles, 10 events, 8 teams, sample invitations, and assistant responses, so you can explore the screens without starting the backend.

## Connect the backend

Copy `.env.example` to `.env.local`, then set:

```env
VITE_USE_MOCK=false
VITE_API_URL=http://localhost:8080
VITE_COLLEGE_EMAIL_DOMAINS=edu,ac.in
```

`VITE_API_URL` is the server origin; endpoint paths, Axios setup, and Bearer token handling are centralized in `src/api/client.js`. Add accepted student email domain suffixes as a comma-separated list.

## Mock accounts

When mock mode is active, use any non-empty password of at least six characters:

- Student: `demo@skillsync.edu`
- Organizer: `organizer@skillsync.edu`
- Admin: `admin@skillsync.edu`

Mock credentials are only for the local frontend preview.

## Pages

- Public landing, sign-in, and registration
- Dashboard, profile editor, and onboarding
- Event discovery, event details, team formation, and student directory
- AI assistant with a floating chat launcher
- Role-gated organizer and admin studio with analytics and CSV export

Run a production build with `npm run build`.
