import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { sessionData } = await req.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    
    const res = await fetch(`${backendUrl}/api/auth/session-verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": req.headers.get("cookie") || ""
      },
      body: JSON.stringify({ sessionData })
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ 
      valid: false, 
      error: 'Session verification failed' 
    }, { status: 500 });
  }
}
