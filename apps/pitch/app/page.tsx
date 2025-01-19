"use client"

import { Button } from '@repo/design-system'
import { cn } from '@repo/design-system'
import { ArrowRight } from 'lucide-react'
import { Hero } from '../components/hero'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero
        title="Stop writing code. Start weaving realities."
        subtitle="Every conversation is a spell. Every preview is a manifestation. Every deployment is a dream realized."
        gradient="from-primary/30 via-purple-500/20 to-background/20"
      >
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Link href="/vision">
            <Button size="lg" className="group">
              Explore Our Vision
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="/product">
            <Button size="lg" variant="outline">
              See The Product
            </Button>
          </Link>
        </motion.div>
      </Hero>

      <section className="container mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">For Creators</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stop writing code. Start weaving realities. Every thought is a thread. Every word is a pattern. Every creation is a universe.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">For Teams</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stop writing tickets. Start writing futures. Every chat is a branch. Every preview is a possibility. Every deployment is a dream realized.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Technical Alchemy</h3>
            <p className="text-muted-foreground leading-relaxed">
              Software is no longer written. It is spoken into existence. It is woven from intention. It is born from consciousness.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
} 