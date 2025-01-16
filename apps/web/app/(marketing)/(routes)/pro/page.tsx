"use client"

import { Header } from '@/components/marketing/header'
import { ProHero } from '@/components/marketing/sections/pro/hero'
import { AIFeatures } from '@/components/marketing/sections/pro/ai-features'
import { AdvancedPreview } from '@/components/marketing/sections/pro/advanced-preview'
import { CustomThemes } from '@/components/marketing/sections/pro/custom-themes'
import { TeamCollaboration } from '@/components/marketing/sections/pro/team-collaboration'
import { IntegrationShowcase } from '@/components/marketing/sections/pro/integration-showcase'
import { SmartContextDemo } from '@/components/marketing/sections/pro/smart-context-demo'
import { PricingCTA } from '@/components/marketing/sections/pro/pricing-cta'
import { Footer } from '@/components/marketing/footer'

export default function ProPage() {
  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <main>
        <ProHero />
        <AIFeatures />
        <SmartContextDemo />
        <AdvancedPreview />
        <CustomThemes />
        <TeamCollaboration />
        <IntegrationShowcase />
        <PricingCTA />
      </main>
      <Footer />
    </div>
  )
} 