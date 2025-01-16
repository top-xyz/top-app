"use client"

import { cn } from '@repo/design-system/lib/utils'
import { useRouter } from 'next/navigation'
import { SignInButton, useUser } from "@clerk/nextjs";
import { Button } from "@repo/design-system/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design-system/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/design-system/components/ui/dropdown-menu";
import { useClerk } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";

function UserButton() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  // Don't render anything while loading to prevent hydration mismatch
  if (!isLoaded) {
    return null;
  }

  // Only show sign in button when definitely not signed in
  if (!user) {
    return (
      <SignInButton mode="modal">
        <Button 
          variant="ghost" 
          size="sm"
          className={cn(
            "text-sm",
            "transition-all duration-300",
            "bg-[rgba(255,255,255,0.05)]",
            "hover:bg-[rgba(255,255,255,0.1)]",
            "active:scale-95",
            "border border-[rgba(255,255,255,0.1)]",
            "shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]",
            "hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]",
            "hover:border-[rgba(255,255,255,0.2)]",
            "hover:text-white"
          )}
        >
          Sign in
        </Button>
      </SignInButton>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "relative h-8 w-8 rounded-full",
            "transition-all duration-300",
            "hover:bg-[rgba(255,255,255,0.1)]",
            "active:scale-95"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
            <AvatarFallback>{user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={cn(
        "w-56",
        "bg-[rgba(32,32,32,0.8)] backdrop-blur-[12px] backdrop-saturate-[180%]",
        "border border-[rgba(255,255,255,0.12)]",
        "shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
      )}>
        <DropdownMenuItem onClick={() => router.push(`/${user.username}`)} className="cursor-pointer">
          View Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push('/settings')} className="cursor-pointer">
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Header() {
  const router = useRouter()
  const navLinks = ['Pro', 'Teams', 'Developers', 'Blog', 'Pricing'];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50",
        "opacity-0 animate-fade-in"
      )}
    >
      <div className={cn(
        "px-4 transition-all duration-300",
        "bg-[rgba(32,32,32,0.6)] backdrop-blur-[12px] backdrop-saturate-[180%]",
        isMenuOpen && "bg-[rgba(32,32,32,0.8)]"
      )}>
        <nav className={cn(
          "mx-auto my-4 rounded-lg",
          "w-full max-w-[860px]",
          "relative isolate",
          "px-4 py-3",
          "flex items-center",
          [
            "before:absolute before:inset-0 before:rounded-lg",
            "before:bg-gradient-to-b before:from-[rgba(255,255,255,0.12)] before:to-transparent",
            "before:pointer-events-none",
            "before:-z-20",
            "after:absolute after:inset-0 after:rounded-lg",
            "after:ring-1 after:ring-inset after:ring-[rgba(255,255,255,0.12)]",
            "after:pointer-events-none",
            "after:-z-10"
          ],
          "shadow-[inset_0_0.5px_0_0.5px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.3)]"
        )}>
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push('/')}>
            <div className="text-2xl">💬</div>
            <div className={cn(
                "text-sm text-muted-foreground",
                "transition-colors duration-300",
                "group-hover:text-foreground"
              )}
            >
              Top
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 ml-auto">
            <UserButton />
            {navLinks.map((link, i) => (
              <a 
                key={link}
                href={`/${link.toLowerCase()}`} 
                className={cn(
                  "text-sm text-muted-foreground",
                  "transition-colors duration-300",
                  "hover:text-foreground"
                )}
                style={{
                  animationDelay: `${200 + (i * 100)}ms`
                }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Mobile Nav */}
          <div className="flex items-center gap-4 ml-auto md:hidden">
            <UserButton />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "h-8 w-8",
                "transition-all duration-300",
                "bg-[rgba(255,255,255,0.05)]",
                "hover:bg-[rgba(255,255,255,0.1)]",
                "active:scale-95",
                "border border-[rgba(255,255,255,0.1)]",
                "shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]",
                "hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.2)]",
                "hover:border-[rgba(255,255,255,0.2)]"
              )}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          "border-t border-[rgba(255,255,255,0.12)]",
          isMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className={cn(
            "max-w-[860px] mx-auto px-4 py-4",
            "space-y-4"
          )}>
            {navLinks.map((link) => (
              <a
                key={link}
                href={`/${link.toLowerCase()}`}
                className={cn(
                  "block w-full text-sm text-muted-foreground",
                  "transition-colors duration-300",
                  "hover:text-foreground"
                )}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
} 