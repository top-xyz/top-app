import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@repo/auth';
import { db } from '@repo/database';

// Input validation schemas
const createPreviewSchema = z.object({
  url: z.string().url().optional(),
  deploymentId: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify context exists and belongs to user
    const context = await db.context.findUnique({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!context) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createPreviewSchema.parse(body);

    // Create preview
    const preview = await db.preview.create({
      data: {
        contextId: params.id,
        url: validatedData.url,
        deploymentId: validatedData.deploymentId,
        metadata: validatedData.metadata,
        status: 'generating'
      }
    });

    // Trigger preview generation if no URL provided
    if (!validatedData.url) {
      // TODO: Implement preview generation pipeline
      // This will be handled by a separate service
    }

    return NextResponse.json(preview, { status: 201 });
  } catch (error) {
    console.error('Error creating preview:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Get previews for context
    const previews = await db.preview.findMany({
      where: {
        contextId: params.id,
        context: {
          userId: session.user.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(previews);
  } catch (error) {
    console.error('Error fetching previews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 