import bcrypt from "bcryptjs";
import { db } from "./db";

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

export function getUserByUsername(username: string): User | undefined {
  const normalized = normalizeUsername(username);
  return db
    .prepare("SELECT * FROM users WHERE LOWER(username) = ?")
    .get(normalized) as User | undefined;
}

export function createUser(username: string, password: string): User {
  const normalized = normalizeUsername(username);
  const passwordHash = bcrypt.hashSync(password, 10);
  db.prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)").run(normalized, passwordHash);
  return getUserByUsername(normalized) as User;
}

export function verifyPassword(user: User, password: string): boolean {
  return bcrypt.compareSync(password, user.password_hash);
}
