// Session verification endpoint (stealth security)
export const dynamic = "force-dynamic";
export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

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
    return NextResponse.json({ 
      valid: false, 
      error: 'Session verification failed' 
    }, { status: 500 });
  }
}
