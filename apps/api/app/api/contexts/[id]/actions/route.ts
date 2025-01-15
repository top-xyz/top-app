import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
// @ts-ignore - Auth import
import { auth } from '@repo/auth';
// @ts-ignore - Database import
import { db } from '@repo/database';

// Input validation schemas
const createActionSchema = z.object({
  type: z.enum([
    'clone_template',
    'configure_tooling',
    'modify_files',
    'deploy',
    'install_dependencies',
    'run_tests',
    'generate_preview'
  ]),
  payload: z.record(z.any()),
  metadata: z.object({
    priority: z.number().optional(),
    retryCount: z.number().optional(),
    timeout: z.number().optional()
  }).optional()
});

// @ts-ignore - Route handler type
export async function POST(req: NextRequest, context: any) {
  try {
    // Authenticate request
    // @ts-ignore - Auth session
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
    const body = await req.json();
    const validatedData = createActionSchema.parse(body);

    // Create action
    const action = await db.action.create({
      data: {
        contextId: context.params.id,
        type: validatedData.type,
        payload: validatedData.payload,
        metadata: validatedData.metadata,
        status: 'pending'
      }
    });

    return NextResponse.json(action, { status: 201 });
  } catch (error) {
    console.error('Error creating action:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// @ts-ignore - Route handler type
export async function GET(req: NextRequest, context: any) {
  try {
    // Authenticate request
    // @ts-ignore - Auth session
    const session = await auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get actions for context
    const actions = await db.action.findMany({
      where: {
        contextId: context.params.id,
        context: {
          userId: session.user.id
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(actions);
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 