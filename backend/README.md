# SY Digital Backend

Production-ready Express + MongoDB API for SY Digital.

## Setup

1. Copy `.env.example` to `.env` and fill in the values.
2. `npm install`
3. `npm run dev` (nodemon) or `npm start`

## Scripts

- `npm run dev` — start with nodemon (`src/server.js`)
- `npm start` — start for production
- `npm run seed:services` — seed default services

## API Endpoints

Swagger docs available at `/api/docs` when running.

### Auth (`/api/auth`)
- `POST /register` — create account (auto-sends welcome + email verification)
- `POST /login` — login, returns JWT
- `GET /profile` — current user profile (auth)
- `PATCH /profile` — update firstName / lastName / phone / avatar / notificationPrefs
- `PATCH /change-password` — change password (auth)
- `POST /forgot-password` — send password reset email
- `POST /reset-password` — reset password with token
- `POST /send-verification` — resend email verification link
- `POST /verify-email` — verify email with token

### Content
- `Services` (`/api/services`) — public GET/GET /featured/GET /:slug; admin POST/GET/stats/PATCH/DELETE
- `Projects` (`/api/projects`) — public GET/GET /featured/GET /:slug; admin CRUD + bulk-delete + bulk-status
- `Blogs` (`/api/blogs`) — full CRUD, search/filter/pagination, featured toggle, view counter
- `Reviews` (`/api/reviews`) — public GET /featured; admin CRUD + stats + rating-analytics

### Lead / Ops
- `Meetings` (`/api/meetings`) — public booking; admin manage (status/reschedule/cancel/history)
- `Messages` (`/api/messages`) — public contact form; admin reply/status/stats
- `Payments` (`/api/payments`) — admin CRUD + status + dashboard stats
- `Project Requests` (`/api/project-requests`) — public submit; admin manage

### Admin
- Dashboard (`/api/admin/dashboard`) — stats, recent meetings, monthly analytics, upcoming, activities
- Analytics (`/api/admin/analytics`) — visitor stats (incl. conversion/bounce) + traffic chart data
- Notifications (`/api/notifications`) — read-all, stats, CRUD
- Users (`/api/users`) — admin CRUD
- Roles (`/api/roles`) — system roles with live user counts
- Settings (`/api/settings`) — platform settings (single document) GET/PATCH
- Media (`/api/media`) — media library list/delete (uploads recorded via `/api/upload`)
- Uploads (`/api/upload`) — image/video upload to Cloudinary, persists Media record

### Client Portal (`/api/client`)
- Meetings, Messages, Payments, Projects, Dashboard, Project Requests — role-guarded for clients

### Other
- `POST /api/track/page-view` — public analytics tracking
- `POST /api/ai/chat` — Groq-powered AI chatbot
- `GET /health` — health check
- `GET /api/docs` — Swagger UI

## Architecture

```
src/
├── app.js            # Express app assembly (middleware + routes)
├── server.js         # Entry point (HTTP + Socket.IO + DB)
├── config/           # env, cloudinary, email
├── constants/        # roles
├── controllers/      # route handlers
├── database/         # MongoDB connection
├── docs/             # Swagger spec
├── emails/           # HTML email templates
├── helpers/          # slugify
├── middlewares/      # auth, authorize, validate, rate limit, upload, error handler
├── models/           # Mongoose models
├── prompts/          # AI system prompt
├── routes/           # Express routers
├── services/         # business logic
├── socket/           # Socket.IO setup + emitters
├── utils/            # ApiError, ApiResponse, token/password helpers
└── validators/       # express-validator schemas
```
