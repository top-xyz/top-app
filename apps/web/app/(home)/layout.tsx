import '@repo/design-system/styles/globals.css';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

type HomeLayoutProperties = {
  readonly children: ReactNode;
};

const HomeLayout = ({ children }: HomeLayoutProperties) => (
  <html lang="en" className={cn(fonts, 'scroll-smooth')} suppressHydrationWarning>
    <body>{children}</body>
  </html>
);

export default HomeLayout; 