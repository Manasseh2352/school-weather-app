import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "app.db");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

declare global {
  // eslint-disable-next-line no-var
  var __uniabujaDb: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var __uniabujaDbInitialized: boolean | undefined;
}

export const db = global.__uniabujaDb ?? new Database(DB_PATH, { timeout: 5000 });
if (process.env.NODE_ENV !== "production") {
  global.__uniabujaDb = db;
}

// SQLite can hit BUSY during concurrent Next build workers; give writers a short retry window.
db.pragma("busy_timeout = 5000");
db.pragma("journal_mode = WAL");

if (!global.__uniabujaDbInitialized) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  global.__uniabujaDbInitialized = true;
}
