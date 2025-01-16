"use client"

import { AppPreview } from "../app-preview"

export function MagicMomentSection() {
  return (
    <AppPreview
      title="Experience the Magic"
      description="A development environment powered by AI that understands your codebase, team, and context - helping you build better software, faster."
      contexts={[
        {
          id: "recipe-app",
          name: "Recipe App",
          type: "feature",
          files: ["app/page.tsx", "components/recipe-card.tsx", "lib/api.ts"],
          team: ["Alice", "Bob"],
          activity: [
            "Created initial app structure",
            "Added recipe card component",
            "Implemented API integration"
          ]
        },
        {
          id: "auth-flow",
          name: "Authentication",
          type: "feature",
          files: ["lib/auth.ts", "components/login.tsx", "middleware.ts"],
          team: ["Carol", "Dave"],
          activity: [
            "Set up authentication provider",
            "Added login/signup forms",
            "Configured protected routes"
          ]
        },
        {
          id: "design-system",
          name: "UI Components",
          type: "design",
          files: ["components/ui/button.tsx", "components/ui/card.tsx", "styles/theme.css"],
          team: ["Eve", "Frank"],
          activity: [
            "Created component library",
            "Added dark mode support",
            "Implemented responsive design"
          ]
        }
      ]}
      conversation={[
        {
          type: "user",
          text: "I want to build a recipe sharing app with a beautiful UI",
          tags: ["feature", "ui"]
        },
        {
          type: "assistant",
          text: "I'll help you create a modern recipe sharing app. Let's start with the core features:",
          tags: ["planning"]
        },
        {
          type: "assistant",
          text: "I've set up the initial project structure with Next.js and a beautiful component library. Here's what we have:",
          tags: ["setup", "ui"],
          options: [
            "Recipe card grid layout",
            "Search and filtering",
            "User profiles",
            "Social features"
          ]
        },
        {
          type: "user",
          text: "That looks great! Can we add a feature for users to save their favorite recipes?",
          tags: ["feature"]
        },
        {
          type: "assistant",
          text: "Of course! I'll add a favorites system with animations and real-time updates. Here's the implementation:",
          tags: ["implementation", "ui"],
          options: [
            "Animated heart button",
            "Favorites collection",
            "Real-time updates",
            "Offline support"
          ]
        }
      ]}
      showFeatures={true}
    />
  )
}