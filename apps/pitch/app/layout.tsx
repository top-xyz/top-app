import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '../components/header'
import { Footer } from '../components/footer'
import { cn } from '../lib/utils'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Top - Digital Reality Creation',
  description: 'Transform thought into reality.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(
        inter.className,
        "min-h-screen",
        "bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.15),transparent_50%)]",
        "bg-background"
      )}>
        <Header />
        <main className="pt-24 pb-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
} 