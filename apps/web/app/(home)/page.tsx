"use client"

import { Header } from '@/components/marketing/header'
import { HeroSection } from '@/components/marketing/sections/hero'
import { MagicMomentSection } from '@/components/marketing/sections/magic-moment'
import { FeaturesSection } from '@/components/marketing/sections/features'
import { LiveDemoSection } from '@/components/marketing/sections/live-demo'
import { ContextManagementSection } from '@/components/marketing/sections/context-management'
import { ProFeaturesSection } from '@/components/marketing/sections/pro-features'
import { Footer } from '@/components/marketing/footer'

export default function HomePage() {
  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <main>
        <HeroSection />
        <MagicMomentSection />
        <FeaturesSection />
        <LiveDemoSection />
        <ContextManagementSection />
        <ProFeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
