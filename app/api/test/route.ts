// Simple test endpoint to check Cloudflare Workers functionality
export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const testInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      backendUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
      hasBackendUrl: !!process.env.NEXT_PUBLIC_API_BASE_URL,
      requestUrl: req.url,
      userAgent: req.headers.get('user-agent'),
      cfRay: req.headers.get('cf-ray'),
      allEnvVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')),
    };

    return NextResponse.json({
      success: true,
      message: 'Test endpoint working',
      test: testInfo,
      consoleLog: '🧪 [TEST] Test endpoint called successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Test error',
      message: (error as Error).message,
      stack: (error as Error).stack,
      consoleLog: '❌ [TEST] Error occurred'
    }, { status: 500 });
  }
}
