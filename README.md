# Notify

A playful notes app built with Next.js (App Router), TypeScript, and PostgreSQL. Users authenticate with credentials stored in environment variables; notes are persisted in Postgres.

## Features

- User login / logout (JWT stored in httpOnly cookies)
- Create, read, update, and delete notes (title + body)
- Multi-user support via environment configuration
- Permanent PostgreSQL storage
- Deployable to Vercel with Neon Postgres

## Local development

```bash
npm install
cp .env.local.example .env.local
npm run db:up
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default demo users (from `.env.local.example`):

| Username | Password     |
|----------|--------------|
| alice    | password123  |
| bob      | password456  |

## Environment variables

| Variable       | Description                                      |
|----------------|--------------------------------------------------|
| `JWT_SECRET`   | Secret key for signing JWT tokens (min 32 chars) |
| `AUTH_USERS`   | Comma-separated `username:password` pairs        |
| `DATABASE_URL` | PostgreSQL connection string                     |

Example:

```
JWT_SECRET=your-secret-key-here
AUTH_USERS=alice:secretpass,bob:otherpass
DATABASE_URL=postgresql://notify:notify@localhost:5433/notify
```

On Vercel with Neon, `DATABASE_URL` is injected automatically when you connect the Neon integration.

## Database schema

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

Run migrations locally:

```bash
npm run db:migrate
```

The app also auto-creates the schema on first request if it does not exist.

## API endpoints

| Method | Path               | Description               |
|--------|--------------------|---------------------------|
| POST   | `/api/auth/login`  | Authenticate user         |
| POST   | `/api/auth/logout` | Clear session cookie      |
| GET    | `/api/auth/me`     | Current user info         |
| GET    | `/api/notes`       | List current user's notes |
| POST   | `/api/notes`       | Create a note             |
| GET    | `/api/notes/:id`   | Get a note by ID          |
| PUT    | `/api/notes/:id`   | Update a note by ID       |
| DELETE | `/api/notes/:id`   | Delete a note by ID       |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Add the [Neon Postgres](https://vercel.com/integrations/neon) integration and connect it to the project.
4. Set environment variables:
   - `JWT_SECRET` — generate a strong random string
   - `AUTH_USERS` — e.g. `alice:yourpass,bob:theirpass`
   - `DATABASE_URL` — provided by Neon when connected
5. Deploy.

Or use the Vercel CLI:

```bash
npx vercel integration add neon/neon
vercel env pull .env.local
npm run db:migrate
npx vercel deploy --prod
```

## Security testing with Strix

Point Strix at your deployed URL (or `http://localhost:3000` for local scans). Provide credentials for at least two users so the scanner can authenticate and exercise the notes API.

Example Strix target configuration:

- **Target URL:** your deployment URL
- **Auth:** login form at `/login` or API at `POST /api/auth/login`
