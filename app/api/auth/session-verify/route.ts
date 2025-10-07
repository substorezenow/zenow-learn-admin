// Session verification endpoint (stealth security)
export const dynamic = "force-dynamic";
export const runtime = 'edge';
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
    
<<<<<<< HEAD
    // Decode JWT to get stored session hash
    const decoded = jwt.decode(token) as { fingerprintHash?: string } | null;
    
    if (!decoded || !decoded.fingerprintHash) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Invalid session' 
      }, { status: 401 });
    }
    
    // Generate current session hash using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(sessionData);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const currentSessionHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Compare with stored hash
    if (currentSessionHash !== decoded.fingerprintHash) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Session mismatch' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      valid: true, 
      message: 'Session verified' 
    });
    
  } catch {
=======
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
>>>>>>> 3d4580f
    return NextResponse.json({ 
      valid: false, 
      error: 'Session verification failed' 
    }, { status: 500 });
  }
}
