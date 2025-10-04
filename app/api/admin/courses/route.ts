import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  
  try {
    const res = await fetch(`${backendUrl}/api/admin/courses`, {
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch courses" }, 
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  const body = await req.json();
  
  try {
    const res = await fetch(`${backendUrl}/api/admin/courses`, {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to create course" }, 
      { status: 500 }
    );
  }
}
