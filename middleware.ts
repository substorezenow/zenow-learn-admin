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
  
  // Temporary: Skip authentication for development testing
  if (process.env.NODE_ENV === 'development' && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("[MIDDLEWARE] Development mode - skipping authentication for dashboard");
    return NextResponse.next();
  }
  
  const isAuthPage = AUTH_PATHS.some((p) => req.nextUrl.pathname.startsWith(p));

  // If token exists, validate it
  if (token) {
    // Use env var for backend URL, fallback to localhost
    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    let valid = false;
    try {
      const res = await fetch(`${backendUrl}/api/auth/validate-token`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = null;
      try {
        data = await res.json();
        console.log("response data : ", data);
      } catch (jsonErr) {
        console.log(
          "[MIDDLEWARE] Error parsing JSON from validate-token:",
          jsonErr
        );
      }
      valid = res.ok && data && data.valid === true;
      console.log(
        "[MIDDLEWARE] Token validation response status:",
        res.status,
        "| valid:",
        valid,
        "| data:",
        data
      );
    } catch (e) {
      // Network error, treat as invalid in production
      valid = false;
      console.log("[MIDDLEWARE] Token validation network error:", e);
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
