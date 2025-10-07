import { NextRequest, NextResponse } from "next/server";

const AUTH_PATHS = ["/login", "/forgot-password"];

const middleware = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value;
  // Debug: log route and token value
  console.log("[MIDDLEWARE] Path:", req.nextUrl.pathname);
  console.log("[MIDDLEWARE] token cookie:", token);
  
  // Redirect /admin to /dashboard
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const newPath = req.nextUrl.pathname.replace("/admin", "/dashboard");
    console.log("[MIDDLEWARE] Redirecting /admin to /dashboard:", newPath);
    return NextResponse.redirect(new URL(newPath, req.url));
  }
  
  
  const isAuthPage = AUTH_PATHS.some((p) => req.nextUrl.pathname.startsWith(p));

  // If token exists, do basic validation
  if (token) {
    // Basic JWT token validation (check if it has the right structure)
    const tokenParts = token.split('.');
    let valid = tokenParts.length === 3; // JWT has 3 parts
    
    if (valid) {
      try {
        // Try to decode the JWT payload to check if it's valid
        const payload = JSON.parse(atob(tokenParts[1]));
        valid = payload && payload.exp && payload.exp > Date.now() / 1000;
        console.log("[MIDDLEWARE] Token validation:", valid, "expires:", new Date(payload.exp * 1000));
      } catch (e) {
        valid = false;
        console.log("[MIDDLEWARE] Token decode error:", e);
      }
    }
    
    console.log(
      "[MIDDLEWARE] isAuthPage:",
      isAuthPage,
      "| token valid:",
      valid
    );
    if (isAuthPage && valid) {
      // Already logged in, redirect to dashboard
      console.log(
        "[MIDDLEWARE] Redirecting authenticated user from auth page to /dashboard"
      );
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (!isAuthPage && !valid) {
      // Invalid token, redirect to login
      console.log(
        "[MIDDLEWARE] Invalid or missing token, redirecting to /login"
      );
      const resp = NextResponse.redirect(new URL("/login", req.url));
      resp.cookies.delete("token");
      return resp;
    }
    // Valid token, allow
    console.log("[MIDDLEWARE] Valid token, allowing request");
    return NextResponse.next();
  }
  // No token
  if (!isAuthPage) {
    // Not logged in, redirect to login
    console.log(
      "[MIDDLEWARE] No token and not on auth page, redirecting to /login"
    );
    return NextResponse.redirect(new URL("/login", req.url));
  }
  // On login/forgot-password, allow
  console.log("[MIDDLEWARE] On auth page without token, allowing request");
  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ["/dashboard", "/admin", "/login", "/forgot-password", "/dashboard/:path*", "/admin/:path*"],
};
