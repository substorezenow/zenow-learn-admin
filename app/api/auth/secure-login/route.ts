// Secure login with browser fingerprint encryption
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  const fingerprint = formData.get("fingerprint");

  // Use env var for backend URL, fallback to localhost
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
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
      // Try to parse error response, fallback to default message
      let errorMessage = "Invalid credentials";
      try {
        const errorData = await res.json();
        errorMessage = errorData.error || errorMessage;
      } catch (parseError) {
        // If JSON parsing fails, use status text or default message
        errorMessage = res.statusText || errorMessage;
      }
      
      return NextResponse.json({ error: errorMessage }, { status: 401 });
    }

    const data = await res.json();
    
    // The backend already set the httpOnly cookie, so we just need to forward the response
    const response = NextResponse.json({ 
      success: true,
      message: "Login successful. Token secured with browser fingerprint validation."
    });
    
    // Copy the Set-Cookie header from backend response to frontend response
    const setCookieHeader = res.headers.get('set-cookie');
    if (setCookieHeader) {
      response.headers.set('Set-Cookie', setCookieHeader);
    }
    
    return response;
  } catch (error) {
    console.error('Secure login error:', error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
