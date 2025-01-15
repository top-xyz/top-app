import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@repo/auth';
import { db } from '@repo/database';

// Input validation schemas
const createContextSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  config: z.record(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate request
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createContextSchema.parse(body);

    // Create context
    const context = await db.context.create({
      data: {
        userId: session.user.id,
        title: validatedData.title,
        description: validatedData.description,
        requirements: validatedData.requirements,
        config: validatedData.config,
        status: 'setup',
        flow: {
          resistance: 'none',
          friction: 'minimal',
          direction: 'natural'
        }
      }
    });

    return NextResponse.json(context, { status: 201 });
  } catch (error) {
    console.error('Error creating context:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate request
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get contexts for user
    const contexts = await db.context.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(contexts);
  } catch (error) {
    console.error('Error fetching contexts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 