"use client"

import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { cn } from '@repo/design-system/lib/utils'
import { HeroProvider } from '@repo/ai/lib/providers/hero'

interface HeroResponse {
  response: string
  tags: string[]
  options: string[]
  tools: string[]
}

const provider = new HeroProvider({
  apiUrl: '/api/hero'
})

const presetPrompts = [
  {
    title: "Build a Drawing App",
    prompt: "I want to create a multiplayer game where players draw together",
    tags: ["socket.io", "canvas", "Next.js"],
    followUps: [
      "Can we add different brush styles?",
      "How about real-time collaboration?",
      "Let's add an undo/redo system"
    ]
  },
  {
    title: "Create an AI Blog",
    prompt: "Help me build a blog that uses AI to generate content ideas",
    tags: ["OpenAI", "Next.js", "Prisma"],
    followUps: [
      "Can it suggest trending topics?",
      "How about SEO optimization?",
      "Let's add content scheduling"
    ]
  },
  {
    title: "Design a Portfolio",
    prompt: "I need a modern portfolio website with animations",
    tags: ["Framer Motion", "React", "TailwindCSS"],
    followUps: [
      "Can we add scroll animations?",
      "How about a dark mode?",
      "Let's make it responsive"
    ]
  },
  {
    title: "Build a Chat App",
    prompt: "Let's create a real-time chat application",
    tags: ["Firebase", "React", "Authentication"],
    followUps: [
      "Can we add file sharing?",
      "How about message encryption?",
      "Let's add group chats"
    ]
  },
  {
    title: "Make a Dashboard",
    prompt: "I want to build an analytics dashboard",
    tags: ["Charts.js", "Next.js", "PostgreSQL"],
    followUps: [
      "Can we add real-time updates?",
      "How about custom charts?",
      "Let's add data export"
    ]
  },
  {
    title: "Create an E-commerce",
    prompt: "Help me build an online store",
    tags: ["Stripe", "Next.js", "Prisma"],
    followUps: [
      "Can we add a shopping cart?",
      "How about product search?",
      "Let's add payment processing"
    ]
  },
  {
    title: "Design a Social App",
    prompt: "I want to create a social media platform",
    tags: ["Next.js", "tRPC", "PostgreSQL"],
    followUps: [
      "Can we add user profiles?",
      "How about a feed system?",
      "Let's add notifications"
    ]
  }
]

export function HeroSection() {
  const [selectedPrompt, setSelectedPrompt] = useState(presetPrompts[0])
  const [showResponse, setShowResponse] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [streamedText, setStreamedText] = useState("")
  const [headerText, setHeaderText] = useState("conversation.top")
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant'
    text: string
    tags?: string[]
    options?: string[]
    isNew?: boolean
    isStreaming?: boolean
  }>>([])
  
  const chatRef = useRef<HTMLDivElement>(null)
  const streamRef = useRef<HTMLSpanElement>(null)

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation])

  const streamResponse = async (response: string): Promise<void> => {
    setIsTyping(true)
    setStreamedText("")
    
    const chars = response.split('')
    for (let i = 0; i < chars.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 20))
      setStreamedText(prev => prev + chars[i])
      
      // Ensure cursor is visible during streaming
      if (streamRef.current) {
        streamRef.current.scrollIntoView({ behavior: 'smooth' })
      }
    }
    
    setIsTyping(false)
  }

  const updateHeader = (text: string) => {
    setHeaderText(prev => {
      const el = document.createElement('div')
      el.style.position = 'absolute'
      el.style.opacity = '0'
      el.textContent = prev
      document.body.appendChild(el)
      const width = el.offsetWidth
      document.body.removeChild(el)
      return text
    })
  }

  const handlePromptSelect = async (prompt: typeof presetPrompts[0]) => {
    setSelectedPrompt(prompt)
    setShowResponse(false)
    setConversation([])
    updateHeader(`${prompt.title.toLowerCase()}.top`)
    
    // Add user message with streaming
    setConversation([{ 
      type: 'user', 
      text: prompt.prompt, 
      isNew: true 
    }])
    
    // Get AI response with streaming
    setShowResponse(true)
    const stream = await provider.stream({
      messages: [{ role: 'user', content: prompt.prompt }]
    })

    let responseText = ''
    for await (const chunk of stream) {
      responseText += chunk
      setStreamedText(responseText)
    }

    // Parse the complete response
    const response = JSON.parse(responseText) as HeroResponse

    // Update conversation with full response
    setConversation(prev => [...prev, { 
      type: 'assistant',
      text: response.response,
      tags: response.tags,
      options: response.options,
      isNew: true
    }])

    // Remove isNew flag after animation
    setTimeout(() => {
      setConversation(prev => prev.map(msg => ({ ...msg, isNew: false })))
    }, 500)
  }

  const handleFollowUp = async (option: string) => {
    // Add user follow-up
    setConversation(prev => [...prev, { 
      type: 'user', 
      text: option, 
      isNew: true 
    }])
    
    // Get AI response with streaming
    const stream = await provider.stream({
      messages: [
        ...conversation.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.text
        })),
        { role: 'user', content: option }
      ]
    })

    let responseText = ''
    for await (const chunk of stream) {
      responseText += chunk
      setStreamedText(responseText)
    }

    // Parse the complete response
    const response = JSON.parse(responseText) as HeroResponse

    // Update conversation with full response
    setConversation(prev => [...prev, { 
      type: 'assistant',
      text: response.response,
      tags: response.tags,
      options: response.options,
      isNew: true
    }])

    // Remove isNew flag after animation
    setTimeout(() => {
      setConversation(prev => prev.map(msg => ({ ...msg, isNew: false })))
    }, 500)
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 scroll-fade">
      <div className="text-center mb-12 space-y-8">
        {/* Floating Badge */}
        <div className={cn(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full",
          "bg-foreground/5 border border-border/50",
          "text-sm text-muted-foreground",
          "group cursor-pointer hover:bg-foreground/10 hover:border-primary/50",
          "transition-all duration-300",
          "animate-fade-in-up"
        )}>
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="group-hover:text-foreground transition-colors duration-300">
            Not no-code. No coding.
          </span>
        </div>
        
        {/* Main Headline */}
        <div className="space-y-6 animate-fade-in-up [animation-delay:200ms]">
          <div className="space-y-2">
            <h1 className={cn(
              "text-4xl sm:text-5xl md:text-7xl font-bold font-mono",
              "bg-clip-text text-transparent",
              "bg-gradient-to-b from-foreground via-foreground/90 to-foreground/70",
              "leading-tight tracking-tight"
            )}>
              Code is <span className="text-primary animate-pulse">_</span>
            </h1>
          </div>

          <p className="text-lg sm:text-xl text-muted-foreground">
            Transform thoughts into software through natural conversation
          </p>
        </div>

        {/* Preset Prompts */}
        <div className={cn(
          "flex flex-wrap justify-center gap-2 max-w-2xl mx-auto",
          "animate-fade-in-up [animation-delay:300ms]"
        )}>
          {presetPrompts.map((prompt) => (
            <button
              key={prompt.title}
              onClick={() => handlePromptSelect(prompt)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm",
                "border border-border/50",
                "hover:bg-primary/5 hover:border-primary/50",
                "transition-all duration-300",
                "transform hover:scale-105",
                selectedPrompt === prompt && "bg-primary/10 border-primary/50"
              )}
            >
              {prompt.title}
            </button>
          ))}
        </div>
        
        {/* Interactive Code Preview */}
        <div className={cn(
          "max-w-2xl mx-auto p-6 rounded-lg",
          "bg-background/50 backdrop-blur-xl",
          "border border-border/50",
          "shadow-glow-subtle group hover:shadow-glow-primary",
          "transition-all duration-500",
          "animate-fade-in-up [animation-delay:400ms]",
          "overflow-hidden relative",
          "transform hover:scale-[1.02]",
          "will-change-transform"
        )}>
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
            </div>
            <span className="font-mono transition-all duration-300">
              {headerText}
            </span>
          </div>
          
          <div 
            ref={chatRef}
            className="space-y-4 text-left h-[300px] overflow-y-auto hide-scrollbar"
          >
            {conversation.map((message, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex items-start gap-3",
                  "transition-all duration-500",
                  message.isNew && "animate-slide-in-up"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full flex-shrink-0",
                  message.type === 'user' ? "bg-muted/30" : "bg-primary/30",
                  message.isNew && "animate-fade-in"
                )} />
                <div className="space-y-2 flex-1">
                  <div className="relative">
                    <p className={cn(
                      message.type === 'user' ? "text-muted-foreground" : "text-foreground",
                      "transition-all duration-300",
                      message.isNew && "animate-fade-in"
                    )}>
                      {i === conversation.length - 1 && isTyping ? (
                        <span ref={streamRef}>{streamedText}</span>
                      ) : (
                        message.text
                      )}
                      {isTyping && i === conversation.length - 1 && (
                        <span className="inline-block w-1 h-4 ml-1 bg-primary animate-pulse">_</span>
                      )}
                    </p>
                  </div>
                  {message.type === 'assistant' && message.tags && (
                    <div className="flex flex-wrap gap-2 text-xs">
                      {message.tags.map((tag, i) => (
                        <span
                          key={tag}
                          className={cn(
                            "px-2 py-1 rounded-md",
                            "bg-primary/10 text-primary font-mono",
                            "animate-fade-in-scale",
                            `[animation-delay:${600 + i * 100}ms]`
                          )}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  {message.type === 'assistant' && message.options && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {message.options.map((option, i) => (
                        <button
                          key={option}
                          onClick={() => handleFollowUp(option)}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-sm",
                            "bg-background/50 backdrop-blur-sm",
                            "border border-border/50",
                            "hover:bg-primary/5 hover:border-primary/50",
                            "transition-all duration-300",
                            "transform hover:scale-105",
                            "animate-fade-in-up",
                            `[animation-delay:${800 + i * 100}ms]`
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Animated Gradient Line */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 h-1",
            "bg-gradient-to-r from-primary/50 via-primary to-primary/50",
            "animate-shimmer"
          )} />
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up [animation-delay:800ms]">
        <button className={cn(
          "group relative px-8 py-4 rounded-lg font-medium",
          "bg-foreground text-background",
          "hover:opacity-90 transition-all duration-300",
          "shadow-glow-primary hover:shadow-glow-primary/50",
          "flex items-center gap-2 overflow-hidden",
          "transform hover:scale-[1.02] active:scale-[0.98]",
          "will-change-transform"
        )}>
          <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] skew-x-12 group-hover:translate-x-[100%] transition-transform duration-700" />
          <span className="relative z-10">Start Creating</span>
        </button>
        
        <button className={cn(
          "group px-8 py-4 rounded-lg font-medium",
          "border border-border/50",
          "hover:bg-muted/50 transition-all duration-300",
          "flex items-center gap-2",
          "transform hover:scale-[1.02] active:scale-[0.98]",
          "will-change-transform"
        )}>
          <span>View Examples</span>
          <div className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</div>
        </button>
      </div>

      {/* Version Info */}
      <div className={cn(
        "mt-8 text-sm text-muted-foreground font-mono",
        "flex items-center gap-4",
        "animate-fade-in-up [animation-delay:1000ms]"
      )}>
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          v0.1.0
        </span>
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-pulse [animation-delay:200ms]" />
          Early Access
        </span>
        <span className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/50 animate-pulse [animation-delay:400ms]" />
          Context-First
        </span>
      </div>
    </section>
  )
} 