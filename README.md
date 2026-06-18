# Notes CRUD App

A minimal notes management application built with Next.js (App Router) and TypeScript. Users authenticate with credentials stored in environment variables; notes are persisted on the local filesystem.

## Features

- User login / logout (JWT stored in httpOnly cookies)
- Create, read, update, and delete notes (title + body)
- Multi-user support via environment configuration
- Deployable to Vercel

## Local development

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Default demo users (from `.env.local.example`):

| Username | Password     |
|----------|--------------|
| alice    | password123  |
| bob      | password456  |

## Environment variables

| Variable     | Description                                      |
|--------------|--------------------------------------------------|
| `JWT_SECRET` | Secret key for signing JWT tokens (min 32 chars) |
| `AUTH_USERS` | Comma-separated `username:password` pairs        |

Example:

```
JWT_SECRET=your-secret-key-here
AUTH_USERS=alice:secretpass,bob:otherpass
```

## API endpoints

| Method | Path               | Description              |
|--------|--------------------|--------------------------|
| POST   | `/api/auth/login`  | Authenticate user        |
| POST   | `/api/auth/logout` | Clear session cookie     |
| GET    | `/api/auth/me`     | Current user info        |
| GET    | `/api/notes`       | List current user's notes|
| POST   | `/api/notes`       | Create a note            |
| GET    | `/api/notes/:id`   | Get a note by ID         |
| PUT    | `/api/notes/:id`   | Update a note by ID      |
| DELETE | `/api/notes/:id`   | Delete a note by ID      |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new).
3. Set environment variables in the Vercel dashboard:
   - `JWT_SECRET` — generate a strong random string
   - `AUTH_USERS` — e.g. `alice:yourpass,bob:theirpass`
4. Deploy.

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

Set env vars when prompted, or add them in the Vercel project settings before deploying.

**Note:** On Vercel, the filesystem is ephemeral. Notes are stored under `/tmp` and will not persist across cold starts or redeployments. This is acceptable for demo and security testing purposes.

## Storage layout

```
data/users/{username}/notes/{noteId}.json   (local)
/tmp/notes-crud-data/users/...                (Vercel)
```

Each note file contains:

```json
{
  "id": "uuid",
  "title": "Note title",
  "body": "Note body",
  "owner": "username",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

## Security testing with Strix

Point Strix at your deployed URL (or `http://localhost:3000` for local scans). Provide credentials for at least two users so the scanner can authenticate and exercise the notes API.

Example Strix target configuration:

- **Target URL:** your deployment URL
- **Auth:** login form at `/login` or API at `POST /api/auth/login`
