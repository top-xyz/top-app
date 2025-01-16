"use client"

import { Header } from '@/components/marketing/header'
import { TeamsHero } from '@/components/marketing/sections/teams/hero'
import { CollaborationFeatures } from '@/components/marketing/sections/teams/collaboration-features'
import { ContextSharing } from '@/components/marketing/sections/teams/context-sharing'
import { TeamManagement } from '@/components/marketing/sections/teams/team-management'
import { SecurityCompliance } from '@/components/marketing/sections/teams/security-compliance'
import { TeamsCTA } from '@/components/marketing/sections/teams/teams-cta'
import { Footer } from '@/components/marketing/footer'

export default function TeamsPage() {
  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <main>
        <TeamsHero />
        <CollaborationFeatures />
        <ContextSharing />
        <TeamManagement />
        <SecurityCompliance />
        <TeamsCTA />
      </main>
      <Footer />
    </div>
  )
} 