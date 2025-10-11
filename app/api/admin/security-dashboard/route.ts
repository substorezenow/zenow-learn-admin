import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${backendUrl}/api/admin/security-dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cookie": `token=${token}` // Forward the cookie to backend
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch security data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Security dashboard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
