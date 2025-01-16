import '@repo/design-system/styles/globals.css';
import './styles/web.css';
import { legal, type LegalPostMeta } from '@repo/cms';
import { Feed } from '@repo/cms/components/feed';
import { fonts } from '@repo/design-system/lib/fonts';
import { cn } from '@repo/design-system/lib/utils';
import { Toolbar } from '@repo/feature-flags/components/toolbar';
import type { ReactNode } from 'react';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Toolbar as CMSToolbar } from '@repo/cms/components/toolbar';
import { ClerkProvider } from '@clerk/nextjs';

type RootLayoutProperties = {
  readonly children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProperties) => {
  // Check if the current route is the marketing home page
  const isMarketingRoute = true; // We'll handle this properly with middleware later

  return (
    <ClerkProvider 
      appearance={{
        layout: {
          socialButtonsVariant: "blockButton",
          logoImageUrl: undefined,
          shimmer: true,
          helpPageUrl: undefined
        },
        variables: {
          colorBackground: "transparent",
          colorInputBackground: "transparent",
          colorText: "rgb(250,250,250)",
          colorTextSecondary: "rgba(250,250,250,0.6)",
          colorPrimary: "rgb(250,250,250)",
          borderRadius: "0.5rem"
        },
        elements: {
          card: cn(
            "relative isolate",
            "bg-[rgba(32,32,32,0.8)] backdrop-blur-[16px] backdrop-saturate-[180%]",
            "border border-[rgba(255,255,255,0.12)]",
            "shadow-[inset_0_0.5px_0_0.5px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.3)]",
            "[background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] !bg-[size:24px_24px]",
            "before:absolute before:inset-0 before:rounded-lg",
            "before:bg-gradient-to-b before:from-[rgba(255,255,255,0.12)] before:to-transparent",
            "before:pointer-events-none before:-z-20",
            "after:absolute after:inset-0 after:rounded-lg",
            "after:ring-1 after:ring-inset after:ring-[rgba(255,255,255,0.12)]",
            "after:pointer-events-none after:-z-10",
            "[mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]"
          ),
          socialButtonsBlockButton: cn(
            "bg-[rgba(255,255,255,0.05)]",
            "hover:bg-[rgba(255,255,255,0.1)]",
            "border border-[rgba(255,255,255,0.1)]",
            "shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]",
            "hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]",
            "hover:border-[rgba(255,255,255,0.2)]",
            "text-white"
          ),
          socialButtonsBlockButtonText: "text-white",
          socialButtonsProviderIcon: "text-white",
          formButtonPrimary: cn(
            "relative isolate",
            "bg-[rgba(255,255,255,0.08)]",
            "hover:bg-[rgba(255,255,255,0.12)]",
            "border border-[rgba(255,255,255,0.1)]",
            "shadow-[0_0_20px_-5px_rgba(255,255,255,0.2)]",
            "hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.3)]",
            "hover:border-[rgba(255,255,255,0.2)]",
            "text-white",
            "backdrop-blur-sm backdrop-saturate-150",
            "before:absolute before:inset-0",
            "before:bg-gradient-to-b before:from-white/10 before:to-transparent",
            "before:pointer-events-none before:-z-20",
            "after:absolute after:inset-0",
            "after:bg-gradient-to-b after:from-transparent after:to-black/20",
            "after:pointer-events-none after:-z-10"
          ),
          dividerLine: "bg-[rgba(255,255,255,0.08)]",
          dividerText: "text-[rgba(250,250,250,0.6)]",
          formFieldInput: cn(
            "bg-[rgba(255,255,255,0.08)]",
            "border-[rgba(255,255,255,0.1)]",
            "focus:border-[rgba(255,255,255,0.2)]",
            "text-white",
            "placeholder:text-[rgba(250,250,250,0.4)]",
            "shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]",
            "focus:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]",
            "backdrop-blur-sm backdrop-saturate-150"
          ),
          formFieldInputGroup: cn(
            "relative isolate",
            "bg-[rgba(255,255,255,0.08)]",
            "border-[rgba(255,255,255,0.1)]",
            "focus-within:border-[rgba(255,255,255,0.2)]",
            "shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]",
            "focus-within:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]",
            "backdrop-blur-sm backdrop-saturate-150",
            "before:absolute before:inset-0",
            "before:bg-gradient-to-b before:from-white/10 before:to-transparent",
            "before:pointer-events-none before:-z-20",
            "after:absolute after:inset-0",
            "after:bg-gradient-to-b after:from-transparent after:to-black/20",
            "after:pointer-events-none after:-z-10"
          ),
          formFieldInputShowPasswordButton: "text-[rgba(250,250,250,0.6)] hover:text-white",
          footerActionLink: "text-[rgba(250,250,250,0.6)] hover:text-white",
          modalBackdrop: cn(
            "backdrop-blur-md bg-background/60",
            "[background-image:linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] !bg-[size:24px_24px]",
            "[mask-image:radial-gradient(ellipse_at_center,black_70%,transparent)]",
            "cursor-pointer"
          ),
          modalContent: "!flex !items-center !justify-center min-h-screen",
          phoneInputBox: cn(
            "relative isolate",
            "!p-0 !bg-transparent",
            "border-0 !shadow-none",
            "backdrop-blur-sm backdrop-saturate-150",
            "flex items-center"
          ),
          phoneInputInput: cn(
            "!pl-[4.5rem]",
            "bg-[rgba(255,255,255,0.08)]",
            "border-[rgba(255,255,255,0.1)]",
            "focus:border-[rgba(255,255,255,0.2)]",
            "text-white",
            "placeholder:text-[rgba(250,250,250,0.4)]",
            "shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]",
            "focus:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]",
            "backdrop-blur-sm backdrop-saturate-150",
            "flex-1"
          ),
          phoneInputMenuButton: cn(
            "absolute left-0 top-0 bottom-0",
            "!bg-[rgba(255,255,255,0.08)]",
            "border-r border-[rgba(255,255,255,0.1)]",
            "hover:bg-[rgba(255,255,255,0.12)]",
            "text-white",
            "backdrop-blur-sm backdrop-saturate-150",
            "flex items-center justify-center",
            "min-w-[4.5rem]"
          ),
          phoneInputMenuItem: cn(
            "!bg-[rgba(32,32,32,0.95)]",
            "hover:!bg-[rgba(255,255,255,0.1)]",
            "text-white",
            "backdrop-blur-sm backdrop-saturate-150"
          ),
          rootBox: cn(
            "!max-w-none",
            "[&_[role=dialog]]:!max-w-none [&_[role=dialog]]:!w-auto",
            "[&_[role=dialog]]:outline-none [&_[role=dialog]]:focus:outline-none",
            "[&_[role=dialog]]:!p-0"
          )
        }
      }}
    >
      <html
        lang="en"
        className={cn(fonts, 'scroll-smooth dark')}
        suppressHydrationWarning
      >
        <body className="bg-background text-foreground">
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
          <Toolbar />
          <CMSToolbar />
        </body>
      </html>
    </ClerkProvider>
  );
};

export default RootLayout;
