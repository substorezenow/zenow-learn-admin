import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const fingerprint = formData.get("fingerprint");

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const res = await fetch(`${backendUrl}/api/auth/secure-login`, {
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
    const errorData = await res.json();
    return NextResponse.json({ error: errorData.error || "Invalid credentials" }, { status: 401 });
  }

  // const data = await res.json();
  
  // The backend already set the httpOnly cookie, so we just need to forward the response
  const response = NextResponse.json({ 
    success: true,
    message: "Login successful. Token secured with browser fingerprint validation."
  });
  
  // Copy the Set-Cookie header from backend response to frontend response
  const setCookieHeader = res.headers.get('set-cookie');
  if (setCookieHeader) {
    // Extract the token value from the backend cookie
    const tokenMatch = setCookieHeader.match(/token=([^;]+)/);
    if (tokenMatch) {
      const token = tokenMatch[1];
      // Set the cookie for the frontend domain
      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 4 * 60 * 60 * 1000, // 4 hours
      });
    }
  }
  
  return response;
}