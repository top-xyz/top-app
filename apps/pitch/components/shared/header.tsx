"use client"

import { cn } from "@repo/design-system"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function Header() {
  const router = useRouter()

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 px-4",
      "opacity-0 animate-fade-in"
    )}>
      <nav className={cn(
        "mx-auto my-4 rounded-lg",
        "w-full max-w-[860px]",
        "relative",
        "bg-[rgba(32,32,32,0.6)] backdrop-blur-[12px] backdrop-saturate-[180%]",
        "px-4 py-3 flex items-center justify-between",
        [
          /* Glass edge lighting effects */
          "before:absolute before:inset-0 before:rounded-lg",
          "before:bg-gradient-to-b before:from-[rgba(255,255,255,0.12)] before:to-transparent",
          "before:pointer-events-none",
          /* Inner glass lighting */
          "after:absolute after:inset-0 after:rounded-lg",
          "after:ring-1 after:ring-inset after:ring-[rgba(255,255,255,0.12)]",
          "after:pointer-events-none"
        ],
        "shadow-[inset_0_0.5px_0_0.5px_rgba(255,255,255,0.12),0_2px_8px_rgba(0,0,0,0.3)]"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="text-2xl" onClick={() => router.push('/')}>
            <div className="text-2xl">💬</div>
          </div>
          <div className={cn(
              "text-sm text-muted-foreground",
              "transition-colors duration-300",
              "group-hover:text-foreground"
            )}
          >
            Top
          </div>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-4 md:gap-6">
          {[
            { label: 'Vision', href: '/vision' },
            { label: 'Product', href: '/product' },
            { label: 'Contact', href: '/contact' }
          ].map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "text-sm text-muted-foreground",
                "transition-colors duration-300",
                "hover:text-foreground"
              )}
              style={{
                animationDelay: `${200 + (i * 100)}ms`
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
} 