import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    const formData = await req.formData();
    
    const res = await fetch(`${backendUrl}/api/admin/profile/image`, {
      method: "POST",
      headers: { 
        "Cookie": `token=${token}`
        // Don't set Content-Type for FormData, let the browser set it with boundary
      },
      body: formData
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Failed to upload profile image" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}