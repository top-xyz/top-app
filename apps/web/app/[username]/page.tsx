import { auth, currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { Button } from '@repo/design-system/components/ui/button';
import Link from 'next/link';

interface UserMetadata {
  location?: string;
  bio?: string;
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await currentUser();
  const { userId } = await auth();
  
  if (!user || !userId || user.username !== username) {
    notFound();
  }

  const metadata = user.publicMetadata as UserMetadata;

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          <Button variant="outline" asChild>
            <Link href="/settings">Edit Profile</Link>
          </Button>
        </div>

        <div className="grid gap-10">
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Info</h2>
            <div className="grid gap-4">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Email</span>
                <span className="text-sm text-muted-foreground">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Location</span>
                <span className="text-sm text-muted-foreground">
                  {metadata.location || 'Not set'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Bio</span>
                <span className="text-sm text-muted-foreground">
                  {metadata.bio || 'No bio yet'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 