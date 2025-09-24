# How to Use the Auth Token in Your Next.js App

## 1. How the Token is Stored
- The token is stored in a secure, httpOnly cookie by the `/api/auth/login` API route after a successful login.
- This cookie is **not accessible to JavaScript** (for security), but is sent automatically with every request to your domain.

## 2. How to Use the Token in Future API Requests
- **Never try to read the token in client-side code.**
- For any API call that needs authentication, create a Next.js API route (or use a server component) that:
  1. Reads the token from cookies (sent automatically by the browser).
  2. Forwards the token to your backend in the `Authorization` header.

### Example: Authenticated API Route

```ts
// app/api/user/profile/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
  const res = await fetch(`${backendUrl}/api/user/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

### Example: Fetching from the Frontend

```js
const res = await fetch("/api/user/profile");
const data = await res.json();
```
- The browser sends the cookie automatically.
- The API route handles the token securely.

## 3. Protecting Pages (Server Components or Middleware)
- Use middleware or server components to check for the token and redirect if not present/valid.

## 4. Logging Out
- Call `/api/auth/logout` (POST) to clear the token cookie.

---

**Summary:**
- Never access the token in client-side JS.
- Use API routes or server components to forward the token to your backend.
- The browser handles cookies automatically and securely.
