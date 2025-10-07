// Force Node.js runtime for proper cookie handling
import { NextRequest, NextResponse } from "next/server";



export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username");
  const password = formData.get("password");

  // Use env var for backend URL, fallback to localhost
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  // Convert FormData to JSON for backend compatibility
  const loginData = {
    username: username as string,
    password: password as string
  };

  const res = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
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
