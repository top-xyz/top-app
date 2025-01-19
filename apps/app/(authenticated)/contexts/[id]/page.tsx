import { LoadingSpinner } from '@repo/design-system/components/ui/loading-spinner';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getContext } from '../../../actions/context';
import { ContextChat } from './components/context-chat';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Context',
  description: 'View and interact with your context.',
};

interface Props {
  params: { id: string }; // Ensure params is correctly typed
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function ContextPage({ params }: Props) {
  const { id } = params;

  const context = await getContext(id);

  if (!context) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <Suspense fallback={<LoadingSpinner />}>
        <ContextChat id={id} />
      </Suspense>
    </div>
  );
}