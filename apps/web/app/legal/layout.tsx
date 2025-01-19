import { Toolbar } from '@repo/cms/components/toolbar';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Legal - Top',
  description: 'Legal information for Top',
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toolbar />
      {children}
    </>
  );
}
