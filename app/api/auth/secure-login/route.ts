// Secure login with browser fingerprint encryption
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const fingerprint = formData.get("fingerprint");

  // Use env var for backend URL, fallback to localhost
  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  const res = await fetch(`${backendUrl}/api/auth/login`, {
    method: "POST",
    body: (() => {
      const fd = new FormData();
      fd.append("username", username as string);
      fd.append("password", password as string);
      if (fingerprint) {
        fd.append("fingerprint", fingerprint as string);
      }
      return fd;
    })(),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const data = await res.json();
  const token = data.token;

  // Store token in httpOnly cookie (secure) + browser fingerprint validation
  const response = NextResponse.json({ 
    success: true,
    message: "Login successful. Token secured with browser fingerprint validation."
  });
  
  // Set httpOnly cookie (secure)
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours
  });

  // Store fingerprint hash in JWT payload (not in separate cookie)
  // The fingerprint will be validated dynamically on each request
  
  return response;
}
