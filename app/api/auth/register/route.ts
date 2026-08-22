import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  getUserByUsername,
  normalizeUsername,
  validatePassword,
  validateUsername,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const normalizedUsername = normalizeUsername(username);
  const usernameError = validateUsername(normalizedUsername);
  if (usernameError) {
    return NextResponse.json({ ok: false, error: usernameError }, { status: 400 });
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json({ ok: false, error: passwordError }, { status: 400 });
  }

  if (getUserByUsername(normalizedUsername)) {
    return NextResponse.json(
      { ok: false, error: "That username is already taken." },
      { status: 409 }
    );
  }

  const user = createUser(normalizedUsername, password);

  const res = NextResponse.json({ ok: true, username: user.username });
  res.cookies.set("uniabuja-session", user.username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
