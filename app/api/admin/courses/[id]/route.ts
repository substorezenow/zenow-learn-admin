import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    const { id } = await params;
    const res = await fetch(`${backendUrl}/api/admin/courses/${id}`, {
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `token=${token}` // Forward the cookie to backend
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch course" }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const body = await req.json();
  
  try {
    const { id } = await params;
    const res = await fetch(`${backendUrl}/api/admin/courses/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `token=${token}` // Forward the cookie to backend
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
      { error: "Failed to update course" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    const { id } = await params;
    const res = await fetch(`${backendUrl}/api/admin/courses/${id}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `token=${token}` // Forward the cookie to backend
      },
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to delete course" }, 
      { status: 500 }
    );
  }
}
