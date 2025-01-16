"use client"

import { Brain, Command, Sparkles } from 'lucide-react'
import { cn } from '@repo/design-system/lib/utils'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { ContextPreview } from '../context-preview'

type ContextFile = {
  name: string;
  type: 'code' | 'config' | 'doc';
  preview: string;
};

type Feature = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
  preview: {
    title: string;
    files: ContextFile[];
    activity: string[];
  };
};

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "Natural Creation",
    description: "Describe what you want to build in plain language and watch it come to life.",
    gradient: "from-blue-500 to-cyan-500",
    preview: {
      title: "Creating a Landing Page",
      files: [
        {
          name: "landing-page.tsx",
          type: "code",
          preview: "// Landing page component..."
        },
        {
          name: "styles.css",
          type: "code",
          preview: "/* Styles for landing page */"
        }
      ],
      activity: [
        "User: Create a landing page with a hero section",
        "Top: I'll help you create that. Let's start with the hero section...",
        "User: Add a call-to-action button",
        "Top: I'll add a prominent CTA button..."
      ]
    }
  },
  {
    icon: Brain,
    title: "Smart Context Management",
    description: "Your entire codebase, understood and managed through natural conversation.",
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
    preview: {
      title: "Authentication Flow",
      files: [
        {
          name: "auth.ts",
          type: "code",
          preview: `import NextAuth from 'next-auth'
import { authConfig } from './config'

export default NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  ...authConfig,
})`
        },
        {
          name: "config.ts",
          type: "config",
          preview: `export const authConfig = {
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub
      return session
    },
  },
}`
        },
        {
          name: "README.md",
          type: "doc",
          preview: `# Authentication Flow

This app uses NextAuth.js for authentication with the following features:
- OAuth providers (GitHub, Google)
- Custom sign in pages
- Session management
- Protected API routes`
        }
      ],
      activity: [
        "Updated GitHub OAuth configuration",
        "Added Google provider",
        "Fixed session callback",
        "Updated documentation"
      ]
    }
  },
  {
    icon: Command,
    title: "Context Generation",
    description: "Transform ideas into fully-realized projects in minutes through natural conversation.",
    gradient: "from-emerald-500/20 via-teal-500/20 to-cyan-500/20",
    preview: {
      title: "New Project Setup",
      files: [
        {
          name: "package.json",
          type: "config",
          preview: `{
  "name": "recipe-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "13.4.19",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "tailwindcss": "3.3.3"
  }
}`
        },
        {
          name: "app/page.tsx",
          type: "code",
          preview: `export default function Home() {
  return (
    <main className="container mx-auto py-12">
      <h1 className="text-4xl font-bold">
        Recipe App
      </h1>
      <div className="grid grid-cols-3 gap-6 mt-8">
        {/* Recipe cards */}
      </div>
    </main>
  )
}`
        },
        {
          name: "README.md",
          type: "doc",
          preview: `# Recipe App

A modern recipe sharing application built with:
- Next.js 13 App Router
- Tailwind CSS
- TypeScript
- Prisma ORM`
        }
      ],
      activity: [
        "Initialized Next.js project",
        "Added Tailwind CSS",
        "Created initial layout",
        "Set up database schema"
      ]
    }
  }
]

export function ContextManagementSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section className="py-24 px-4 relative overflow-hidden" ref={ref}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background pointer-events-none" />
      <div className={cn(
        "absolute inset-0 bg-grid-white/[0.02]",
        "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
      )} />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[128px] animate-float-slow" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[128px] animate-float-slow [animation-delay:2s]" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header Badge */}
        <div className={cn(
          "flex justify-center mb-8",
          "transform transition-all duration-700 delay-100",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <div className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full",
            "bg-primary/10 backdrop-blur-sm",
            "border border-primary/20",
            "shadow-glow-subtle"
          )}>
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-sm font-medium">Next Generation Development</span>
          </div>
        </div>

        {/* Main Header */}
        <div className={cn(
          "text-center space-y-6 mb-16",
          "transform transition-all duration-700 delay-200",
          isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className={cn(
            "text-4xl md:text-5xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/70"
          )}>
            Context is the new code
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Transform how you think about software creation. Context becomes your codebase, conversations become your commits, and every thought shapes your digital universe.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={cn(
                "group relative",
                "transform transition-all duration-700",
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
                `[transition-delay:${(i + 1) * 200}ms]`
              )}
            >
              <div className={cn(
                "relative z-10 overflow-hidden",
                "p-8 rounded-xl h-full",
                "bg-background/50 backdrop-blur-xl",
                "border border-border/50",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.05)]",
                "transition-all duration-500",
                "group-hover:shadow-[0_0_30px_-5px_var(--glow-color)]",
                "hover:scale-[1.02]"
              )}
              style={{
                ['--glow-color' as string]: `rgb(var(--${feature.gradient.split(' ')[0].replace('from-', '')}))`,
              }}>
                {/* Icon Container */}
                <div className={cn(
                  "relative mb-6",
                  "transform transition-all duration-500",
                  "group-hover:translate-y-[-4px]"
                )}>
                  <div className={cn(
                    "p-3 rounded-lg",
                    "bg-primary/10",
                    "border border-primary/20",
                    "w-fit",
                    "transform transition-transform duration-500",
                    "group-hover:rotate-[-8deg] group-hover:scale-110",
                    "relative z-10"
                  )}>
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  {/* Icon Glow Effect */}
                  <div className={cn(
                    "absolute inset-0 -z-10",
                    "bg-primary/20",
                    "blur-xl opacity-0 group-hover:opacity-100",
                    "transition-opacity duration-500",
                    "scale-150"
                  )} />
                </div>

                {/* Content */}
                <div className="space-y-4 relative z-10">
                  <h3 className={cn(
                    "text-xl font-semibold",
                    "transform transition-all duration-500",
                    "group-hover:translate-x-1"
                  )}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature Preview */}
                  <div className={cn(
                    "mt-6",
                    "transform transition-all duration-500",
                    "group-hover:translate-y-[-4px]"
                  )}>
                    <ContextPreview
                      title={feature.preview.title}
                      files={feature.preview.files}
                      activity={feature.preview.activity}
                      className="w-full aspect-video"
                    />
                  </div>
                </div>
              </div>

              {/* Background Gradient */}
              <div className={cn(
                "absolute inset-0 -z-10",
                "rounded-xl",
                `bg-gradient-to-br ${feature.gradient}`,
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-500",
                "blur-2xl"
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 