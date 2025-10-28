import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("Profile API route called");
  
  const token = req.cookies.get("token")?.value;
  console.log("Token found:", !!token);
  
  if (!token) {
    console.log("No token, returning 401");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  console.log("Backend URL:", backendUrl);
  
  try {
    console.log("Making request to:", `${backendUrl}/api/admin/profile`);
    const res = await fetch(`${backendUrl}/api/admin/profile`, {
      method: "GET",
      headers: { 
        "Cookie": `token=${token}` // Forward the cookie to backend
      },
    });

    console.log("Backend response status:", res.status);

    if (!res.ok) {
      const errorData = await res.json();
      console.log("Backend error:", errorData);
      return NextResponse.json({ error: errorData.error || "Failed to fetch profile" }, { status: res.status });
    }

    const data = await res.json();
    console.log("Backend success data:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    const body = await req.json();
    
    const res = await fetch(`${backendUrl}/api/admin/profile`, {
      method: "PUT",
      headers: { 
        "Cookie": `token=${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Failed to update profile" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}