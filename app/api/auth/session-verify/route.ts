// Session verification endpoint (stealth security)
export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { createHash } from 'crypto';

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
    
    // Generate current session hash
    const currentSessionHash = createHash('sha256').update(sessionData).digest('hex');
    
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
