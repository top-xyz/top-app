'use client'

import { useEffect, useState } from 'react'
import { cn } from '@repo/design-system/lib/utils'

const marketingSnippets = [
  {
    title: 'The Soul of Software',
    code: `interface Creation {
  input: Thought
  output: Reality
  timeToMagic: "5 minutes"
}`
  },
  {
    title: 'The Technical Romance',
    code: `// The dance of creation
async function createReality(dream: Dream): Promise<Universe> {
  const reality = await dream.compile();
  const preview = await reality.deploy();
  return preview.share();
}`
  },
  {
    title: 'The Flow',
    code: `interface Magic {
  readonly creation: {
    input: "Natural language"
    output: "Living software"
    latency: "Speed of thought"
  }
}`
  }
]

export function CodeHero() {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)

  const currentSnippet = marketingSnippets[currentSnippetIndex]

  useEffect(() => {
    const typeNextCharacter = () => {
      if (cursorPosition < currentSnippet.code.length) {
        setDisplayedCode(prev => prev + currentSnippet.code[cursorPosition])
        setCursorPosition(prev => prev + 1)
      } else {
        // Move to next snippet after delay
        setTimeout(() => {
          setCurrentSnippetIndex((prev) => (prev + 1) % marketingSnippets.length)
          setDisplayedCode('')
          setCursorPosition(0)
        }, 2000)
      }
    }

    const typingInterval = setInterval(typeNextCharacter, 50)
    return () => clearInterval(typingInterval)
  }, [currentSnippet, cursorPosition])

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className={cn(
        "relative rounded-lg p-6 bg-black/10 dark:bg-white/10",
        "backdrop-blur-xl border border-black/10 dark:border-white/10",
        "shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
      )}>
        <div className="absolute -top-3 left-4 px-2 py-0.5 text-sm font-medium rounded bg-background">
          {currentSnippet.title}
        </div>
        <pre className="overflow-x-auto">
          <code className="text-sm font-mono text-foreground">
            {displayedCode}
            <span className="animate-pulse">▋</span>
          </code>
        </pre>
      </div>
    </div>
  )
} 