(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__f2b15f93._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
const AUTH_PATHS = [
    "/login",
    "/forgot-password"
];
const middleware = async (req)=>{
    const token = req.cookies.get("token")?.value;
    // Debug: log route and token value
    console.log("[MIDDLEWARE] Path:", req.nextUrl.pathname);
    console.log("[MIDDLEWARE] token cookie:", token);
    // Redirect /admin to /dashboard
    if (req.nextUrl.pathname.startsWith("/admin")) {
        const newPath = req.nextUrl.pathname.replace("/admin", "/dashboard");
        console.log("[MIDDLEWARE] Redirecting /admin to /dashboard:", newPath);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(newPath, req.url));
    }
    const isAuthPage = AUTH_PATHS.some((p)=>req.nextUrl.pathname.startsWith(p));
    // If token exists, do basic validation
    if (token) {
        // Use env var for backend URL, fallback to localhost
        const backendUrl = ("TURBOPACK compile-time value", "https://zenow-learn-backend-710009987783.asia-south1.run.app") || "http://localhost:8080";
        let valid = false;
        try {
            const res = await fetch(`${backendUrl}/api/auth/validate-token`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            let data = null;
            if (res.ok) {
                data = await res.json();
                valid = data.valid;
            }
        } catch (error) {
            console.log("[MIDDLEWARE] Token validation error:", error);
            valid = false;
        }
        // Fallback: Basic JWT token validation (check if it has the right structure)
        if (!valid) {
            const tokenParts = token.split('.');
            valid = tokenParts.length === 3; // JWT has 3 parts
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
        }
        console.log("[MIDDLEWARE] isAuthPage:", isAuthPage, "| token valid:", valid);
        if (isAuthPage && valid) {
            // Already logged in, redirect to dashboard
            console.log("[MIDDLEWARE] Redirecting authenticated user from auth page to /dashboard");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/dashboard", req.url));
        }
        if (!isAuthPage && !valid) {
            // Invalid token, redirect to login
            console.log("[MIDDLEWARE] Invalid or missing token, redirecting to /login");
            const resp = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", req.url));
            resp.cookies.delete("token");
            return resp;
        }
        // Valid token, allow
        console.log("[MIDDLEWARE] Valid token, allowing request");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // No token
    if (!isAuthPage) {
        // Not logged in, redirect to login
        console.log("[MIDDLEWARE] No token and not on auth page, redirecting to /login");
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", req.url));
    }
    // On login/forgot-password, allow
    console.log("[MIDDLEWARE] On auth page without token, allowing request");
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
};
const __TURBOPACK__default__export__ = middleware;
const config = {
    matcher: [
        "/dashboard",
        "/admin",
        "/login",
        "/forgot-password",
        "/dashboard/:path*",
        "/admin/:path*"
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f2b15f93._.js.map