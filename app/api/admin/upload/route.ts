import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  
  try {
    // Forward the multipart form data to backend
    const formData = await req.formData();
    
    const res = await fetch(`${backendUrl}/api/admin/upload`, {
      method: "POST",
      headers: {
        "Cookie": `token=${token}` // Forward the cookie to backend
      },
      body: formData,
    });

    const data = await res.json();
    
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to upload file" }, 
      { status: 500 }
    );
  }
}
