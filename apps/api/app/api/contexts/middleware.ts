import { createRateLimiter, slidingWindow } from '@repo/rate-limit'
import { auth } from '@repo/auth/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Create rate limiter instance
const limiter = createRateLimiter({
  prefix: 'api-contexts',
  limiter: slidingWindow(10, '10 s') // 10 requests per 10 seconds
})

export async function middleware(request: NextRequest) {
  try {
    // Auth check
    const session = await auth()
    if (!session?.userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Rate limit check
    const { success } = await limiter.limit(session.userId)
    if (!success) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    return NextResponse.next()
  } catch (error) {
    console.error('API middleware error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export const config = {
  matcher: '/api/contexts/:path*'
} 