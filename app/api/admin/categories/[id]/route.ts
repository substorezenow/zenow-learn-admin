import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const body = await req.json();
  
  try {
    const res = await fetch(`${backendUrl}/api/admin/categories/${id}`, {
      method: "PUT",
      headers: { 
        "Cookie": `token=${token}`,
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
      { error: "Failed to update category" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    const res = await fetch(`${backendUrl}/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: { 
        "Cookie": `token=${token}`,
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
      { error: "Failed to delete category" }, 
      { status: 500 }
    );
  }
}
