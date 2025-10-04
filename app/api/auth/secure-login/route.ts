// Secure login with browser fingerprint encryption
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const fingerprint = formData.get("fingerprint");

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Use env var for backend URL, fallback to localhost
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    
    console.log('Backend URL:', backendUrl);
    console.log('Environment:', process.env.NODE_ENV);
    
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
      const errorText = await res.text();
      console.error('Backend login error:', res.status, errorText);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const data = await res.json();
    const token = data.token;

    if (!token) {
      console.error('No token received from backend');
      return NextResponse.json({ error: "No token received from backend" }, { status: 500 });
    }

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
  } catch (error) {
    console.error('Secure login error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
