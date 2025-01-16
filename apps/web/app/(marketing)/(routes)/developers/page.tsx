"use client"

import { Header } from '@/components/marketing/header'
import { DevelopersHero } from '@/components/marketing/sections/developers/hero'
import { DevTools } from '@/components/marketing/sections/developers/dev-tools'
import { APIReference } from '@/components/marketing/sections/developers/api-reference'
import { ExtensionSystem } from '@/components/marketing/sections/developers/extension-system'
import { SmartContext } from '@/components/marketing/sections/developers/smart-context'
import { DeveloperCTA } from '@/components/marketing/sections/developers/developer-cta'
import { Footer } from '@/components/marketing/footer'

export default function DevelopersPage() {
  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <main>
        <DevelopersHero />
        <DevTools />
        <APIReference />
        <ExtensionSystem />
        <SmartContext />
        <DeveloperCTA />
      </main>
      <Footer />
    </div>
  )
} 