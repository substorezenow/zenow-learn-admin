import { NextResponse } from "next/server";

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
    });
  });
  
  return response;
}
