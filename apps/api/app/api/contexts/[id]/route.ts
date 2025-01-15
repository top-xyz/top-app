import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@repo/auth';
import { db } from '@repo/database';

// Input validation schemas
const updateContextSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  config: z.record(z.any()).optional(),
  status: z.enum(['setup', 'active', 'completed']).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get context with messages and actions
    const context = await db.context.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        messages: true,
        actions: true,
        previews: true
      }
    });

    if (!context) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    return NextResponse.json(context);
  } catch (error) {
    console.error('Error fetching context:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = updateContextSchema.parse(body);

    // Update context
    const context = await db.context.update({
      where: {
        id: params.id,
        userId: session.user.id
      },
      data: validatedData
    });

    return NextResponse.json(context);
  } catch (error) {
    console.error('Error updating context:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete context and all related data
    await db.context.delete({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting context:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 