import '@repo/design-system/styles/globals.css';
import './styles/web.css';
import { legal, type LegalPostMeta } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { DesignSystemProvider } from '@repo/design-system';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Toolbar as CMSToolbar } from '@repo/cms/components/toolbar';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => {
  // Check if the current route is the marketing home page
  const isMarketingRoute = true; // We'll handle this properly with middleware later

  return (
    <html
      lang="en"
      className={cn(fonts, 'scroll-smooth')}
      suppressHydrationWarning
    >
      <body>
        <DesignSystemProvider>
          {!isMarketingRoute && <Header />}
          {children}
          {!isMarketingRoute && (
            <Feed queries={[legal.postsQuery]}>
              {async ([data]: [{ legalPages: { items: LegalPostMeta[] } }]) => {
                'use server';
                return <Footer legalPostsMeta={data.legalPages.items} />;
              }}
            </Feed>
          )}
        </DesignSystemProvider>
        <Toolbar />
        <CMSToolbar />
      </body>
    </html>
  );
};

export default RootLayout;
