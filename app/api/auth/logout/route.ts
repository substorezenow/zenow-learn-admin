import { NextResponse } from "next/server";

<<<<<<< HEAD
export const runtime = 'edge';

export async function POST() {
  // Clear ALL authentication cookies
  const response = NextResponse.json({ success: true });
  
  // Clear all possible cookie names that might contain tokens
  const cookieNames = [
    'token',
    'admin_access_token', 
    'auth_token',
    'jwt',
    'access_token'
  ];
  
  cookieNames.forEach(name => {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
=======
export async function POST(req: NextRequest) {
  try {
    // Get token from httpOnly cookie
    const token = req.cookies.get('token')?.value;
    
    // Call backend logout if token exists
    if (token) {
      const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
      try {
        await fetch(`${backendUrl}/api/auth/logout`, {
          method: "POST",
          headers: {
            "Cookie": `token=${token}`
          }
        });
      } catch (error) {
        console.error('Backend logout failed:', error);
      }
    }
    
    // Clear ALL authentication cookies
    const response = NextResponse.json({ success: true });
    
    // Clear all possible cookie names that might contain tokens
    const cookieNames = [
      'token',
      'admin_access_token', 
      'auth_token',
      'jwt',
      'access_token'
    ];
    
    cookieNames.forEach(name => {
      response.cookies.set(name, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // Expire immediately
      });
>>>>>>> 3d4580f
    });
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ 
      success: false, 
      error: "Logout failed" 
    }, { status: 500 });
  }
}
