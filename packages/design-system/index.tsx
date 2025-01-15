import { AnalyticsProvider } from '@repo/analytics';
import { AuthProvider } from '@repo/auth/provider';
import type { ThemeProviderProps } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './providers/theme';

// Export components
export { Button } from './components/button';
export { ChatInput } from './components/chat-input';
export { ModeToggle } from './components/mode-toggle';

type DesignSystemProviderProperties = ThemeProviderProps;

export const DesignSystemProvider = ({
  children,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <AuthProvider>
      <AnalyticsProvider>
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster />
      </AnalyticsProvider>
    </AuthProvider>
  </ThemeProvider>
);
