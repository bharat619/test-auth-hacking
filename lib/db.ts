import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __notifySql: postgres.Sql | undefined;
}

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error("DATABASE_URL or POSTGRES_URL is not configured");
  }
  return url;
}

function shouldUseSsl(url: string): boolean | "require" {
  if (url.includes("localhost") || url.includes("127.0.0.1")) {
    return false;
  }
  return "require";
}

function createSql(): postgres.Sql {
  const url = getDatabaseUrl();
  return postgres(url, {
    ssl: shouldUseSsl(url),
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  });
}

export function getSql(): postgres.Sql {
  if (!globalThis.__notifySql) {
    globalThis.__notifySql = createSql();
  }
  return globalThis.__notifySql;
}

let schemaReady: Promise<void> | null = null;

export async function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = (async () => {
      const sql = getSql();
      await sql`
        CREATE TABLE IF NOT EXISTS notes (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          owner TEXT NOT NULL,
          title TEXT NOT NULL,
          body TEXT NOT NULL DEFAULT '',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_notes_owner ON notes (owner)
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS idx_notes_owner_updated ON notes (owner, updated_at DESC)
      `;
    })();
  }

  await schemaReady;
}
