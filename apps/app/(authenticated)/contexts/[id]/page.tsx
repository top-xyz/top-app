import { PageProps } from '../../../types';

interface ContextParams {
  id: string;
}

export default async function ContextPage({ params }: PageProps<ContextParams>) {
  if (!params) {
    throw new Error('Missing context ID');
  }
  const { id } = params;
  // ... existing code ...
} 