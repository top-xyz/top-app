import { WorkspaceLayout } from './components/workspace-layout'

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <WorkspaceLayout>{children}</WorkspaceLayout>
} 