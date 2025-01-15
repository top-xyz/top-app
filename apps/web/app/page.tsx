import { CodeHero } from '@/components/marketing/code-hero'
import { Background } from '@/components/marketing/background'
import { ModeToggle } from '@repo/design-system/components/mode-toggle'
import { cn } from '@repo/design-system/lib/utils'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background/50">
      <Background />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className={cn(
          "container flex items-center justify-between py-4 px-6",
          "bg-background/50 backdrop-blur-xl border-b border-border/50"
        )}>
          <div className="text-xl font-semibold">next-forge</div>
          <ModeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-12 space-y-4">
          <h1 className={cn(
            "text-4xl sm:text-5xl md:text-6xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/70"
          )}>
            Your shortcut to everything.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of powerful productivity tools all within an extendable launcher. Fast, ergonomic and reliable.
          </p>
        </div>

        <CodeHero />
      </section>
    </main>
  )
} 