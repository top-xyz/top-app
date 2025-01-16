"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Check, Sparkles, Zap, Users, Shield, ChevronDown, Workflow, Code2, GitBranch, Share2, Brain } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'
import { Header } from '@/components/marketing/header'
import { Footer } from '@/components/marketing/footer'
import { useState } from 'react'

export default function PricingPage() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const plansAnimation = useIntersectionAnimation<HTMLDivElement>()
  const featuresAnimation = useIntersectionAnimation<HTMLDivElement>()
  const comparisonAnimation = useIntersectionAnimation<HTMLDivElement>()

  return (
    <div className="min-h-screen scroll-smooth">
      <Header />
      <main>
        {/* Hero Section */}
        <section className={cn(
          "relative min-h-[80vh] flex flex-col items-center justify-center",
          "px-4 py-32 overflow-hidden"
        )}>
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
          <div className={cn(
            "absolute inset-0 bg-grid-white/[0.02]",
            "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
          )} />
          
          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div 
              ref={headerAnimation.ref}
              className={cn(
                "space-y-6 opacity-0",
                headerAnimation.isVisible && "animate-fade-in"
              )}
            >
              <h1 className={cn(
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
                "font-bold bg-clip-text text-transparent",
                "bg-gradient-to-b from-foreground to-foreground/50"
              )}>
                Transform intention into reality
              </h1>
              <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
                Choose the perfect plan to unlock the full power of context-aware development.
                Every plan includes core features with expanded capabilities as you grow.
              </p>
            </div>

            {/* Pricing Plans */}
            <div 
              ref={plansAnimation.ref}
              className={cn(
                "mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 opacity-0",
                plansAnimation.isVisible && "animate-slide-up"
              )}
            >
              {/* Free Plan */}
              <div className={cn(
                "p-8 rounded-lg border border-border/50",
                "bg-background/50 backdrop-blur-sm",
                "transform hover:scale-[1.02] transition-transform duration-300"
              )}>
                <h3 className="text-2xl font-bold">Free</h3>
                <p className="mt-2 text-muted-foreground">Perfect for solo developers</p>
                <div className="mt-4 text-4xl font-bold">$0</div>
                <p className="text-sm text-muted-foreground">Forever free</p>
                <ul className="mt-8 space-y-4">
                  {[
                    'Smart context generation',
                    'GitHub integration',
                    'Basic AI features',
                    'Community themes',
                    'Instant previews',
                    'Up to 3 projects'
                  ].map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" variant="outline">
                  Get Started
                </Button>
              </div>

              {/* Pro Plan */}
              <div className={cn(
                "p-8 rounded-lg border-2 border-primary",
                "bg-background/50 backdrop-blur-sm",
                "transform hover:scale-[1.02] transition-transform duration-300",
                "relative"
              )}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className={cn(
                    "px-3 py-1 text-sm rounded-full",
                    "bg-primary text-primary-foreground"
                  )}>
                    Most Popular
                  </span>
                </div>
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="mt-2 text-muted-foreground">Perfect for teams</p>
                <div className="mt-4 text-4xl font-bold">$29</div>
                <p className="text-sm text-muted-foreground">per user / month</p>
                <ul className="mt-8 space-y-4">
                  {[
                    'Everything in Free, plus:',
                    'Advanced AI capabilities',
                    'Multi-repo context',
                    'GitLab & Bitbucket',
                    'Notion & Confluence export',
                    'Custom themes',
                    'Real-time collaboration',
                    'Unlimited projects',
                    'Priority support'
                  ].map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full">
                  Get Started
                </Button>
              </div>

              {/* Enterprise Plan */}
              <div className={cn(
                "p-8 rounded-lg border border-border/50",
                "bg-background/50 backdrop-blur-sm",
                "transform hover:scale-[1.02] transition-transform duration-300"
              )}>
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <p className="mt-2 text-muted-foreground">Perfect for organizations</p>
                <div className="mt-4 text-4xl font-bold">Custom</div>
                <p className="text-sm text-muted-foreground">Contact us for pricing</p>
                <ul className="mt-8 space-y-4">
                  {[
                    'Everything in Pro, plus:',
                    'Custom deployment',
                    'SSO & SAML',
                    'Audit logging',
                    'Custom AI models',
                    'Advanced security',
                    'SLA guarantee',
                    'Dedicated support',
                    'Training & onboarding'
                  ].map(feature => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 w-full" variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className={cn(
          "relative py-32 px-4 overflow-hidden",
          "bg-gradient-to-b from-background to-background/50"
        )}>
          <div className="relative z-10 max-w-6xl mx-auto">
            <div 
              ref={featuresAnimation.ref}
              className={cn(
                "text-center max-w-2xl mx-auto opacity-0",
                featuresAnimation.isVisible && "animate-fade-in"
              )}
            >
              <h2 className={cn(
                "text-3xl sm:text-4xl font-bold",
                "bg-clip-text text-transparent",
                "bg-gradient-to-b from-foreground to-foreground/50"
              )}>
                Compare features
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Find the perfect plan for your team with our detailed feature comparison
              </p>
            </div>

            {/* Feature Grid */}
            <div 
              ref={comparisonAnimation.ref}
              className={cn(
                "mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8",
                "opacity-0",
                comparisonAnimation.isVisible && "animate-slide-up"
              )}
            >
              {[
                {
                  icon: Brain,
                  title: "Context Management",
                  features: {
                    free: ["Basic context generation", "Single repo analysis"],
                    pro: ["Multi-repo context", "Advanced analysis", "Custom templates"],
                    enterprise: ["Custom AI models", "Enterprise knowledge graph"]
                  }
                },
                {
                  icon: Workflow,
                  title: "Integrations",
                  features: {
                    free: ["GitHub", "Basic exports"],
                    pro: ["GitLab & Bitbucket", "Notion & Confluence", "Webhooks"],
                    enterprise: ["Custom integrations", "Enterprise systems", "API access"]
                  }
                },
                {
                  icon: Share2,
                  title: "Collaboration",
                  features: {
                    free: ["Basic sharing", "Public links"],
                    pro: ["Real-time collab", "Team spaces", "Version control"],
                    enterprise: ["SSO & SAML", "Audit logs", "Custom roles"]
                  }
                },
                {
                  icon: Code2,
                  title: "Development",
                  features: {
                    free: ["Instant previews", "Basic AI assistance"],
                    pro: ["Advanced previews", "Custom themes", "Priority builds"],
                    enterprise: ["Custom deployment", "SLA guarantee", "Custom features"]
                  }
                }
              ].map((category, i) => (
                <div 
                  key={category.title}
                  className={cn(
                    "p-6 rounded-lg",
                    "bg-background/50 backdrop-blur-sm",
                    "border border-border/50",
                    "opacity-0"
                  )}
                  style={{
                    animation: comparisonAnimation.isVisible ? 
                      `fade-in 0.5s ease-out forwards ${i * 100}ms` : 'none'
                  }}
                >
                  <category.icon className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Free</h4>
                      <ul className="space-y-2">
                        {category.features.free.map(feature => (
                          <li key={feature} className="text-sm flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-primary mb-2">Pro</h4>
                      <ul className="space-y-2">
                        {category.features.pro.map(feature => (
                          <li key={feature} className="text-sm flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Enterprise</h4>
                      <ul className="space-y-2">
                        {category.features.enterprise.map(feature => (
                          <li key={feature} className="text-sm flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className={cn(
          "relative py-32 px-4 overflow-hidden",
          "bg-gradient-to-b from-background/50 to-background"
        )}>
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="text-center">
              <h2 className={cn(
                "text-3xl sm:text-4xl font-bold",
                "bg-clip-text text-transparent",
                "bg-gradient-to-b from-foreground to-foreground/50"
              )}>
                FAQs
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                You've got questions. We've got answers.
              </p>
            </div>

            <div className="mt-16 space-y-4">
              {[
                {
                  question: "What makes Top App different from other development tools?",
                  answer: "Top App is a universal context management hub that transforms how teams handle codebase knowledge. Unlike traditional tools, we focus on natural creation flow, turning intention into reality through AI-powered context understanding and instant previews."
                },
                {
                  question: "How does the context management system work?",
                  answer: "Our smart context generation system automatically analyzes your codebase, creates relationships between components, and maintains a living knowledge graph. This enables both humans and AI to understand and work with your code more effectively."
                },
                {
                  question: "What integrations do you support?",
                  answer: "We offer one-click integration with GitHub, GitLab, and Bitbucket, plus export capabilities to Obsidian, Notion, and Confluence. Pro and Enterprise plans include additional integrations with project management tools and custom systems."
                },
                {
                  question: "How does team collaboration work?",
                  answer: "Teams can collaborate in real-time with shared contexts, instant previews, and version control. Pro plans include team spaces and advanced collaboration features, while Enterprise plans add SSO, audit logging, and custom roles."
                },
                {
                  question: "Can I try the Pro features before subscribing?",
                  answer: "Yes! We offer a 14-day free trial of our Pro plan with full access to all features. No credit card required. You can also schedule a demo to see our Enterprise features in action."
                },
                {
                  question: "Do you offer educational or open source discounts?",
                  answer: "Yes! We offer special pricing for educational institutions, non-profit organizations, and open source projects. Contact our sales team to learn more about our discount programs."
                }
              ].map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const faqAnimation = useIntersectionAnimation<HTMLDivElement>()
  
  return (
    <div
      ref={faqAnimation.ref}
      className={cn(
        "opacity-0",
        faqAnimation.isVisible && "animate-fade-in"
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-6 py-4 text-left",
          "rounded-lg border border-border/50",
          "bg-background/50 backdrop-blur-sm",
          "transition-colors duration-200",
          "hover:border-border",
          "flex items-center justify-between",
          "group"
        )}
      >
        <span className="font-medium">{question}</span>
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground",
          "transition-transform duration-200",
          "group-hover:text-foreground",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="px-6 py-4 text-muted-foreground">
          {answer}
        </div>
      </div>
    </div>
  )
}
