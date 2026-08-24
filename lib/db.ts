import { createClient, type Client } from "@libsql/client";
import path from "path";
import fs from "fs";

// On Vercel (production) a hosted libSQL/Turso database is required — the
// serverless filesystem is read-only and not shared between invocations, so a
// local .db file cannot work there. In local development we fall back to a
// file-based SQLite DB so no account or env vars are needed to run `npm run dev`.
function resolveUrl(): string {
  const url =
    process.env.TURSO_DATABASE_URL ??
    (process.env.NODE_ENV === "production" ? undefined : "file:data/app.db");

  if (!url) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. In Vercel, add TURSO_DATABASE_URL and " +
        "TURSO_AUTH_TOKEN under Project Settings → Environment Variables."
    );
  }
  return url;
}

declare global {
  // eslint-disable-next-line no-var
  var __uniabujaDb: Client | undefined;
  // eslint-disable-next-line no-var
  var __uniabujaSchema: Promise<void> | undefined;
}

// Lazily create the client on first use rather than at import time, so that
// `next build` can import route modules without a database configured. The
// env-var check therefore runs per-request at runtime, where Vercel has it set.
export function getDb(): Client {
  if (!global.__uniabujaDb) {
    const url = resolveUrl();

    // A local file: DB needs its parent directory to exist first.
    if (url.startsWith("file:")) {
      const dir = path.dirname(url.slice("file:".length));
      if (dir && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    global.__uniabujaDb = createClient({
      url,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return global.__uniabujaDb;
}

// Create the schema once per process. libSQL is async, so callers await this
// before their first query. On failure we clear the cached promise so the next
// request can retry instead of being stuck with a rejected result forever.
export function ensureSchema(): Promise<void> {
  if (!global.__uniabujaSchema) {
    global.__uniabujaSchema = getDb()
      .execute(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now'))
        );`
      )
      .then(() => undefined)
      .catch((err) => {
        global.__uniabujaSchema = undefined;
        throw err;
      });
  }
  return global.__uniabujaSchema;
}
