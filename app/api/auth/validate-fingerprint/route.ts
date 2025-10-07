// Validate browser fingerprint for secure requests
export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { fingerprint } = await req.json();
    
    // Get stored fingerprint from cookie or header
    const storedFingerprint = req.cookies.get('zenow_fingerprint')?.value;
    
    if (!storedFingerprint) {
      return NextResponse.json({ 
        valid: false, 
        error: 'No stored fingerprint found' 
      }, { status: 401 });
    }
    
    if (fingerprint !== storedFingerprint) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Browser fingerprint mismatch' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      valid: true, 
      message: 'Fingerprint validated' 
    });
    
  } catch {
    return NextResponse.json({ 
      valid: false, 
      error: 'Fingerprint validation failed' 
    }, { status: 500 });
  }
}
