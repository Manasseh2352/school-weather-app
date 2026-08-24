import bcrypt from "bcryptjs";
import { getDb, ensureSchema } from "./db";

export type User = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,32}$/;

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function validateUsername(username: string): string | null {
  const normalized = normalizeUsername(username);

  if (!USERNAME_PATTERN.test(normalized)) {
    return "Username must be 3-32 characters (letters, numbers, . _ - only).";
  }
  return null;
}

export function validatePassword(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }
  return null;
}

export async function getUserByUsername(username: string): Promise<User | undefined> {
  await ensureSchema();
  const normalized = normalizeUsername(username);
  const result = await getDb().execute({
    sql: "SELECT * FROM users WHERE LOWER(username) = ?",
    args: [normalized],
  });
  return result.rows[0] as unknown as User | undefined;
}

export async function createUser(username: string, password: string): Promise<User> {
  await ensureSchema();
  const normalized = normalizeUsername(username);
  const passwordHash = bcrypt.hashSync(password, 10);
  await getDb().execute({
    sql: "INSERT INTO users (username, password_hash) VALUES (?, ?)",
    args: [normalized, passwordHash],
  });
  return (await getUserByUsername(normalized)) as User;
}

export function verifyPassword(user: User, password: string): boolean {
  return bcrypt.compareSync(password, user.password_hash);
}
