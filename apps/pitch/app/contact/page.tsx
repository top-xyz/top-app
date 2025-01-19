'use client'

import { Button } from '@repo/design-system'
import { Hero } from '../../components/hero'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, ArrowRight } from 'lucide-react'

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Reach out directly for any inquiries or collaborations.",
    action: "Send Email",
    href: "mailto:hello@example.com"
  },
  {
    icon: MessageSquare,
    title: "Start a Conversation",
    description: "Let's discuss how we can transform your development workflow.",
    action: "Chat Now",
    href: "#"
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

export default function Contact() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero
        title="Let's Create Together"
        subtitle="Every great digital experience begins with a conversation. Start yours today."
        gradient="from-blue-500/20 via-primary/20 to-purple-500/20"
      />

      <section className="container mx-auto px-6 py-24">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {contactMethods.map((method, i) => (
            <motion.div 
              key={i}
              variants={item}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-6 space-y-4">
                <method.icon className="h-8 w-8 text-primary" />
                <h3 className="text-2xl font-semibold">{method.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {method.description}
                </p>
                <a href={method.href}>
                  <Button className="group mt-4">
                    {method.action}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </a>
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
          <h2 className="text-3xl font-bold">Join the Evolution</h2>
          <p className="text-xl text-muted-foreground">
            Be part of the movement that's redefining how software is created.
            Every conversation is a step towards the future of development.
          </p>
        </motion.div>
      </section>
    </main>
  )
} 