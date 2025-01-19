import '@repo/design-system/styles/globals.css';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Top',
  description: 'Top - The AI-powered coding assistant',
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(fonts, 'scroll-smooth')} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
} 