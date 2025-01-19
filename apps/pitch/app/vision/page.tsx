"use client"

import { Hero } from '../../components/hero'
import { motion } from 'framer-motion'
import { Markdown } from '../../components/markdown'

const content = `
## Core Mantras

### For Creators
Stop writing code.
Start weaving realities.
Every thought is a thread.
Every word is a pattern.
Every creation is a universe.

### For Teams
Stop writing tickets.
Start writing futures.
Every chat is a branch.
Every preview is a possibility.
Every deployment is a dream realized.

## The Evolution

We didn't make development easier.
We transformed it into magic.

We didn't improve the process.
We transcended it.

We didn't enhance creation.
We liberated it.

## The Promise

Create like you dream.
Deploy like you breathe.
Share like the universe expands.

Software is no longer written.
It is spoken into existence.
It is woven from intention.
It is born from consciousness.

## The Invitation

Stop coding.
Start creating.
The future isn't written in text editors.
It's woven in conversations.
It's born in moments of shared understanding.
It's alive in the space between thoughts.

Your next creation exists
In the quantum field of possibility.
Waiting for your voice
To call it into being.
`

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Vision() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero
        title="We are not building software"
        subtitle="We are crafting digital realities. Every conversation is a spell. Every preview is a manifestation."
        gradient="from-blue-500/20 via-primary/20 to-background/20"
      />

      <motion.section 
        className="container mx-auto px-6 py-24"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div 
          variants={item}
          className="prose prose-invert mx-auto"
        >
          <Markdown content={content} />
        </motion.div>
      </motion.section>
    </main>
  )
} 