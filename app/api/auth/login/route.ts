import { NextRequest, NextResponse } from "next/server";
import { getUserByUsername, verifyPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const user = getUserByUsername(username);
  if (!user || !verifyPassword(user, password)) {
    return NextResponse.json(
      { ok: false, error: "Incorrect username or password." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true, username: user.username });
  res.cookies.set("uniabuja-session", user.username, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
