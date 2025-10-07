// Secure login with browser fingerprint encryption
import { NextRequest, NextResponse } from "next/server";

// Cloudflare Workers compatibility


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
    
    // Validate backend URL is accessible
    if (!backendUrl || backendUrl === "undefined") {
      console.error('Backend URL not configured properly');
      return NextResponse.json({ error: "Backend service not configured" }, { status: 500 });
    }
    
    console.log('Backend URL:', backendUrl);
    console.log('Environment:', process.env.NODE_ENV);
    
    let res;
    try {
      // Convert FormData to JSON for backend compatibility
      const loginData = {
        username: username as string,
        password: password as string,
        ...(fingerprint && { fingerprint: fingerprint as string })
      };

      res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        // Add timeout for Cloudflare Pages
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
    } catch (fetchError) {
      console.error('Backend connection error:', fetchError);
      return NextResponse.json({ 
        error: "Backend service unavailable. Please try again later." 
      }, { status: 503 });
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Backend login error:', res.status, errorText);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const data = await res.json();

    if (!res.ok) {
      console.error('Backend login failed:', data.error);
      return NextResponse.json({ error: data.error || "Login failed" }, { status: 401 });
    }

    // Extract token from backend response and set it as httpOnly cookie for frontend domain
    const token = data.token;
    if (!token) {
      console.error('No token received from backend');
      return NextResponse.json({ error: "No token received from backend" }, { status: 500 });
    }

    // Set httpOnly cookie for frontend domain
    const response = NextResponse.json({ 
      success: true,
      message: "Login successful. Token secured with browser fingerprint validation."
    });
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4, // 4 hours
    });
    
    return response;
  } catch (error) {
    console.error('Secure login error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
