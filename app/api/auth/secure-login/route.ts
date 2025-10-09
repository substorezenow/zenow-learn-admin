// Secure login with browser fingerprint encryption
export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

// Cloudflare Workers compatibility


export async function POST(req: NextRequest) {
  console.log('🔐 [SECURE-LOGIN] Starting secure login process');
  console.log('🔐 [SECURE-LOGIN] Request URL:', req.url);
  console.log('🔐 [SECURE-LOGIN] Request method:', req.method);
  console.log('🔐 [SECURE-LOGIN] Request headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    const formData = await req.formData();
    const username = formData.get("username");
    const password = formData.get("password");
    const fingerprint = formData.get("fingerprint");

    console.log('🔐 [SECURE-LOGIN] Form data received:', {
      username: username ? '***' : 'missing',
      password: password ? '***' : 'missing',
      fingerprint: fingerprint ? '***' : 'missing'
    });

    if (!username || !password) {
      console.log('❌ [SECURE-LOGIN] Missing username or password');
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // Use env var for backend URL, fallback to localhost
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    
    console.log('🔐 [SECURE-LOGIN] Backend URL:', backendUrl);
    console.log('🔐 [SECURE-LOGIN] Environment:', process.env.NODE_ENV);
    
    // Validate backend URL is accessible
    if (!backendUrl || backendUrl === "undefined") {
      console.error('❌ [SECURE-LOGIN] Backend URL not configured properly');
      return NextResponse.json({ error: "Backend service not configured" }, { status: 500 });
    }
    
    let res;
    try {
      console.log('🔐 [SECURE-LOGIN] Attempting to call backend:', `${backendUrl}/api/auth/login`);
      
      // Convert FormData to JSON for backend compatibility
      const loginData = {
        username: username as string,
        password: password as string,
        ...(fingerprint && { fingerprint: fingerprint as string })
      };

      console.log('🔐 [SECURE-LOGIN] Login data prepared:', {
        username: loginData.username,
        fingerprint: loginData.fingerprint ? '***' : 'missing'
      });

      res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
        // Add timeout for Cloudflare Pages
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
      
      console.log('🔐 [SECURE-LOGIN] Backend response status:', res.status);
      console.log('🔐 [SECURE-LOGIN] Backend response headers:', Object.fromEntries(res.headers.entries()));
      
    } catch (fetchError) {
      console.error('❌ [SECURE-LOGIN] Backend connection error:', fetchError);
      console.error('❌ [SECURE-LOGIN] Error details:', {
        name: (fetchError as Error).name,
        message: (fetchError as Error).message,
        stack: (fetchError as Error).stack
      });
      return NextResponse.json({ 
        error: "Backend service unavailable. Please try again later." 
      }, { status: 503 });
    }

    if (!res.ok) {
      const errorText = await res.text();
      console.error('❌ [SECURE-LOGIN] Backend login error:', res.status, errorText);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const data = await res.json();
    console.log('🔐 [SECURE-LOGIN] Backend response data:', {
      success: data.success,
      hasToken: !!data.token,
      message: data.message
    });

    if (!res.ok) {
      console.error('❌ [SECURE-LOGIN] Backend login failed:', data.error);
      return NextResponse.json({ error: data.error || "Login failed" }, { status: 401 });
    }

    // Extract token from backend response and set it as httpOnly cookie for frontend domain
    const token = data.token;
    if (!token) {
      console.error('❌ [SECURE-LOGIN] No token received from backend');
      return NextResponse.json({ error: "No token received from backend" }, { status: 500 });
    }

    console.log('✅ [SECURE-LOGIN] Token received, setting cookie');
    console.log('✅ [SECURE-LOGIN] Token length:', token.length);
    console.log('✅ [SECURE-LOGIN] Environment:', process.env.NODE_ENV);

    // Set httpOnly cookie for frontend domain
    const response = NextResponse.json({ 
      success: true,
      message: "Login successful. Token secured with browser fingerprint validation."
    });
    
    console.log('✅ [SECURE-LOGIN] Setting cookie with config:', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4
    });
    
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 4, // 4 hours
    });
    
    console.log('✅ [SECURE-LOGIN] Cookie set, checking response cookies');
    console.log('✅ [SECURE-LOGIN] Response cookies:', response.cookies.getAll());
    return response;
  } catch (error) {
    console.error('❌ [SECURE-LOGIN] Unexpected error:', error);
    console.error('❌ [SECURE-LOGIN] Error details:', {
      name: (error as Error).name,
      message: (error as Error).message,
      stack: (error as Error).stack
    });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
