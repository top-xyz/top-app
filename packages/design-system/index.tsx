import * as React from 'react';
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
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
export { Icons } from './components/ui/icons';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
export { LoadingSpinner } from './components/ui/loading-spinner';
export { DesignSystemProvider } from './providers/design-system';

// Export types
export type { DesignSystemProviderProps } from './providers/design-system';
