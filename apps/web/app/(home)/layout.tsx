import '@repo/design-system/styles/globals.css';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

type MarketingLayoutProperties = {
  readonly children: ReactNode;
};

const MarketingLayout = ({ children }: MarketingLayoutProperties) => (
  <html
    lang="en"
    className={cn(fonts, 'scroll-smooth')}
    suppressHydrationWarning
  >
    <body>
      <DesignSystemProvider>
        {children}
      </DesignSystemProvider>
    </body>
  </html>
);

export default MarketingLayout; 