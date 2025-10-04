// Force Node.js runtime for proper cookie handling
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  // Use env var for backend URL, fallback to localhost
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  const res = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    body: (() => {
      const fd = new FormData();
      fd.append("username", username as string);
      fd.append("password", password as string);
      return fd;
    })(),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const data = await res.json();
  const token = data.token;

  // Clear any existing insecure cookies first
  const response = NextResponse.json({ success: true });
  
  // Clear old insecure cookies
  const oldCookieNames = ['admin_access_token', 'auth_token', 'jwt', 'access_token'];
  oldCookieNames.forEach(name => {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    });
  });
  
  // Set secure httpOnly cookie with shorter expiration
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours (matches JWT expiration)
  });
  
  return response;
}
