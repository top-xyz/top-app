import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// @ts-expect-error - Auth import
import { auth } from '@repo/auth';
// @ts-expect-error - Database import
import { db } from '@repo/database';

// Input validation schemas
const createMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
});

// @ts-expect-error - Route handler type
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // @ts-expect-error - Auth session
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify context exists and belongs to user
    const contextRecord = await db.context.findUnique({
      where: {
        id: context.params.id,
        userId: session.user.id
      }
    });

    if (!contextRecord) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createMessageSchema.parse(body);

    // Create message
    const message = await db.message.create({
      data: {
        contextId: context.params.id,
        role: validatedData.role,
        content: validatedData.content,
        metadata: validatedData.metadata
      }
    });

    // If message is from user, trigger AI processing
    if (validatedData.role === 'user') {
      // TODO: Implement AI processing pipeline
      // This will be handled by a separate service
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error creating message:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// @ts-expect-error - Route handler type
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // @ts-expect-error - Auth session
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get messages for context
    const messages = await db.message.findMany({
      where: {
        contextId: context.params.id,
        context: {
          userId: session.user.id
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 