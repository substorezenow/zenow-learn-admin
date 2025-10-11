import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    const res = await fetch(`${backendUrl}/api/admin/fields`, {
      method: "GET",
      headers: { 
        "Cookie": `token=${token}` // Forward the cookie to backend
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Failed to fetch fields" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching fields:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const body = await req.json();
  
  try {
    const res = await fetch(`${backendUrl}/api/admin/fields`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `token=${token}` // Forward the cookie to backend
      },
      body: JSON.stringify(body), // Use standard JSON.stringify
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Failed to create field" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating field:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}