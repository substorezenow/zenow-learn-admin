// Debug endpoint to help with troubleshooting
export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Simplified debug info to avoid Cloudflare Workers issues
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      backendUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
      requestUrl: req.url,
      userAgent: req.headers.get('user-agent') || 'unknown',
      cfRay: req.headers.get('cf-ray') || 'not-cloudflare',
      hasBackendUrl: !!process.env.NEXT_PUBLIC_API_BASE_URL,
      envVarsCount: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC')).length,
    };

    return NextResponse.json({
      success: true,
      message: 'Debug information',
      debug: debugInfo,
      consoleLog: '🔍 [DEBUG] Debug endpoint called successfully'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Debug error',
      message: (error as Error).message,
      consoleLog: '❌ [DEBUG] Error occurred'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  console.log('🔍 [DEBUG] Debug POST endpoint called');
  
  try {
    const body = await req.text();
    console.log('🔍 [DEBUG] Request body:', body);
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      backendUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
      requestUrl: req.url,
      requestHeaders: Object.fromEntries(req.headers.entries()),
      requestBody: body,
      cookies: req.cookies.getAll().map(cookie => ({ name: cookie.name, value: cookie.value ? '***' : 'empty' })),
    };

    console.log('🔍 [DEBUG] Debug info:', debugInfo);

    return NextResponse.json({
      success: true,
      message: 'Debug information',
      debug: debugInfo
    });
  } catch (error) {
    console.error('🔍 [DEBUG] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Debug error',
      message: (error as Error).message
    }, { status: 500 });
  }
}
