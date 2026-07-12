# Notify

A playful notes app built with Next.js (App Router), TypeScript, PostgreSQL, and Auth0 authentication.

## Features

- Auth0 OIDC sign-in / sign-out (Auth.js)
- Create, read, update, and delete notes (title + body)
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

## Environment variables

| Variable             | Description                                  |
|----------------------|----------------------------------------------|
| `APP_BASE_URL`       | App URL (e.g. `http://localhost:3000`)       |
| `AUTH0_DOMAIN`       | Auth0 tenant domain                          |
| `AUTH0_CLIENT_ID`    | Auth0 application client ID                  |
| `AUTH0_CLIENT_SECRET`| Auth0 application client secret              |
| `AUTH0_SECRET`       | Session encryption secret (64-char hex)      |
| `DATABASE_URL`       | PostgreSQL connection string                 |

Generate `AUTH0_SECRET`:

```bash
openssl rand -hex 32
```

## Auth0 application setup

1. In the [Auth0 Dashboard](https://manage.auth0.com/), create a **Regular Web Application**.
2. Set **Allowed Callback URLs**:
   - `http://localhost:3000/api/auth/callback/auth0`
   - `https://notes-crud-app-eta.vercel.app/api/auth/callback/auth0`
3. Set **Allowed Logout URLs**:
   - `http://localhost:3000/login`
   - `https://notes-crud-app-eta.vercel.app/login`
4. Copy **Domain**, **Client ID**, and **Client Secret** into `.env.local`.

Create test users under **User Management → Users** for multi-user / IDOR testing.

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

## API endpoints

| Method | Path                       | Description               |
|--------|----------------------------|---------------------------|
| GET    | `/api/auth/signin/auth0`   | Start Auth0 sign-in       |
| POST   | `/api/auth/signout`        | Sign out                  |
| GET    | `/api/auth/me`             | Current user info         |
| GET    | `/api/notes`               | List current user's notes |
| POST   | `/api/notes`               | Create a note             |
| GET    | `/api/notes/:id`           | Get a note by ID          |
| PUT    | `/api/notes/:id`           | Update a note by ID       |
| DELETE | `/api/notes/:id`           | Delete a note by ID       |

Note `owner` is derived from the Auth0 profile (`nickname`, `preferred_username`, or email prefix).

## Deploy to Vercel

Set environment variables in Vercel:

- `APP_BASE_URL` → your production URL
- `AUTH0_DOMAIN`, `AUTH0_CLIENT_ID`, `AUTH0_CLIENT_SECRET`, `AUTH0_SECRET`
- `DATABASE_URL`

Add the production callback URL to Auth0, then deploy:

```bash
npx vercel deploy --prod
```

## Security testing with Strix

Auth0 login uses a browser redirect flow. For Strix scans, use **session import**:

```bash
uv run strix -t https://notes-crud-app-eta.vercel.app --session-file storage_state.json
```

Use at least two Auth0 test users to exercise multi-account scenarios (e.g. IDOR testing).
