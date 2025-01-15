import { cn } from '../lib/utils';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

export const fonts = cn(
  GeistSans.variable,
  GeistMono.variable,
  'touch-manipulation font-sans antialiased'
);
