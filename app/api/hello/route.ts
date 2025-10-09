// Ultra-simple test - just return a string
export const runtime = 'edge';

export async function GET() {
  return new Response('Hello from Cloudflare Workers!', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
