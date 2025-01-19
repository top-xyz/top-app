'use client'

import { Hero } from '../../components/hero'
import { motion } from 'framer-motion'
import { Code2, Sparkles, Share2, Zap } from 'lucide-react'

const features = [
  {
    icon: Code2,
    title: "The Creation Dance",
    description: "From intent to reality in moments. Natural conversation transforms into living digital experiences."
  },
  {
    icon: Sparkles,
    title: "Technical Alchemy",
    description: "Containers dance in quantum space. Each thought a compilation. Each word a deployment. Reality renders in real-time."
  },
  {
    icon: Share2,
    title: "The Sharing Ritual",
    description: "'Look at this.' Three words that once meant showing a mockup. Now they mean opening a portal to your universe."
  },
  {
    icon: Zap,
    title: "The Speed of Thought",
    description: "Create like you dream. Deploy like you breathe. Share like the universe expands."
  }
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Product() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero
        title="Software is no longer written"
        subtitle="It is spoken into existence. It is woven from intention. It is born from consciousness."
        gradient="from-purple-500/20 via-primary/20 to-background/20"
      />

      <section className="container mx-auto px-6 py-24">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {features.map((feature, i) => (
            <motion.div 
              key={i}
              variants={item}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 space-y-4">
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="container mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <h2 className="text-3xl font-bold">The First Awakening</h2>
          <p className="text-xl text-muted-foreground">
            Remember when you first saw your creation breathe?
            We made that moment eternal.
            Infinitely repeatable.
            In your pocket.
            Between heartbeats.
          </p>
        </motion.div>
      </section>
    </main>
  )
} 