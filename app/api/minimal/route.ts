// Minimal test endpoint for Cloudflare Workers
export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'Minimal endpoint working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      consoleLog: '✅ [MINIMAL] Endpoint working'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Minimal endpoint error',
      message: (error as Error).message,
      consoleLog: '❌ [MINIMAL] Error occurred'
    }, { status: 500 });
  }
}
