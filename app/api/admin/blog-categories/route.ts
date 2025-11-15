/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: any) {
  return proxy(req, params);
}
export async function POST(req: Request, { params }: any) {
  return proxy(req, params);
}
export async function PUT(req: Request, { params }: any) {
  return proxy(req, params);
}
export async function PATCH(req: Request, { params }: any) {
  return proxy(req, params);
}
export async function DELETE(req: Request, { params }: any) {
  return proxy(req, params);
}

async function proxy(req: Request, params: any) {
  const backend = process.env.BACKEND_URL;
  const url = `${backend}/${params.path.join("/")}`;

  const headers: any = {};
  req.headers.forEach((value, key) => (headers[key] = value));

  const res = await fetch(url, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
  });

  return new Response(res.body, {
    status: res.status,
    headers: res.headers,
  });
}
