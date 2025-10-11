import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
  const body = await req.json();
  const { courseId } = await req.json();
  
  try {
    const res = await fetch(`${backendUrl}/api/admin/courses/${courseId}/modules`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": `token=${token}`
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json({ error: errorData.error || "Failed to create module" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}