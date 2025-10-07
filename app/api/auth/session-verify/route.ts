// Session verification endpoint (stealth security)
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sessionData } = await req.json();
    
    // Get token from httpOnly cookie
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Session expired' 
      }, { status: 401 });
    }
    
    // Forward to backend for verification
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    const res = await fetch(`${backendUrl}/api/auth/session-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token=${token}`
      },
      body: JSON.stringify({ sessionData })
    });
    
    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json({ 
        valid: false, 
        error: data.error || 'Session verification failed' 
      }, { status: res.status });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    return NextResponse.json({ 
      valid: false, 
      error: 'Session verification failed' 
    }, { status: 500 });
  }
}
