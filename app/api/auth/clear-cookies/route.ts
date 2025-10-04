import { NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  // Clear all possible cookie names
  const cookieNames = [
    'token',
    'admin_access_token', 
    'auth_token',
    'jwt',
    'access_token',
    'sidebar:state'
  ];
  
  cookieNames.forEach(name => {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    });
  });
  
  return response;
}
