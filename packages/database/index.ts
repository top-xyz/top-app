import 'server-only';
import { PrismaClient } from '@prisma/client';
import { keys } from './keys';

export const database = new PrismaClient();

export * from '@prisma/client';
