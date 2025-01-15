import { NextRequest, NextResponse } from 'next/server';
import { db } from '@repo/database';

export async function GET(req: NextRequest) {
  try {
    // Check database connection
    await db.$queryRaw`SELECT 1`;

    // Return health status
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_VERSION || '0.0.1',
      services: {
        database: 'connected'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_VERSION || '0.0.1',
      services: {
        database: 'disconnected'
      }
    }, { status: 503 });
  }
}
