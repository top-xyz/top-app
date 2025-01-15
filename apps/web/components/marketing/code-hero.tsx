'use client'

import { useEffect, useState } from 'react'
import { cn } from '@repo/design-system/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

const marketingSnippets = [
  {
    title: 'The Soul of Software',
    code: `interface Creation {
  input: Thought
  output: Reality
  timeToMagic: "5 minutes"
}`,
    language: 'typescript'
  },
  {
    title: 'The Technical Romance',
    code: `// The dance of creation
async function createReality(dream: Dream): Promise<Universe> {
  const reality = await dream.compile();
  const preview = await reality.deploy();
  return preview.share();
}`,
    language: 'typescript'
  },
  {
    title: 'The Flow',
    code: `interface Magic {
  readonly creation: {
    input: "Natural language"
    output: "Living software"
    latency: "Speed of thought"
  }
}`,
    language: 'typescript'
  }
]

export function CodeHero() {
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0)
  const [displayedCode, setDisplayedCode] = useState('')
  const [cursorPosition, setCursorPosition] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentSnippet = marketingSnippets[currentSnippetIndex]

  useEffect(() => {
    const typeNextCharacter = () => {
      if (cursorPosition < currentSnippet.code.length) {
        setDisplayedCode(prev => prev + currentSnippet.code[cursorPosition])
        setCursorPosition(prev => prev + 1)
      } else {
        // Start fade out transition after a delay
        setTimeout(() => {
          setIsTransitioning(true)
          // After fade out, change snippet
          setTimeout(() => {
            setCurrentSnippetIndex((prev) => (prev + 1) % marketingSnippets.length)
            setDisplayedCode('')
            setCursorPosition(0)
            setIsTransitioning(false)
          }, 400) // Match fade-out duration
        }, 2000)
      }
    }

    const typingInterval = setInterval(typeNextCharacter, 50)
    return () => clearInterval(typingInterval)
  }, [currentSnippet, cursorPosition])

  return (
    <div className={cn(
      "w-[860px] mx-auto", // Fixed width
      "transition-opacity duration-500",
      isTransitioning ? "opacity-0" : "opacity-100"
    )}>
      <div className={cn(
        "relative rounded-lg",
        "bg-black/10 dark:bg-white/10",
        "backdrop-blur-xl border border-black/10 dark:border-white/10",
        "shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.1)]",
        "h-[300px]" // Fixed height
      )}>
        {/* Title pill */}
        <div className={cn(
          "absolute -top-3 left-4 px-3 py-1 rounded-full",
          "bg-background/80 backdrop-blur-sm border border-border/50",
          "shadow-glow-subtle",
          "transition-all duration-300",
          "animate-float"
        )}>
          <div className="text-sm font-medium">
            {currentSnippet.title}
          </div>
        </div>

        {/* Code window controls */}
        <div className="absolute top-4 left-4 flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/20" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
          <div className="w-3 h-3 rounded-full bg-green-500/20" />
        </div>

        {/* Code content */}
        <div className="p-8 pt-12 h-full overflow-hidden">
          <SyntaxHighlighter
            language={currentSnippet.language}
            style={oneDark}
            customStyle={{
              background: 'transparent',
              margin: 0,
              padding: 0,
              height: '100%',
              fontSize: '14px',
            }}
          >
            {displayedCode}
          </SyntaxHighlighter>
          <span className="animate-pulse text-primary">▋</span>
        </div>
      </div>
    </div>
  )
} 