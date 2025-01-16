"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { ChevronDown, Check } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'
import { useState } from 'react'

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

export function PricingCTA() {
  const headerAnimation = useIntersectionAnimation<HTMLDivElement>()
  const pricingAnimation = useIntersectionAnimation<HTMLDivElement>()
  const faqsAnimation = useIntersectionAnimation<HTMLDivElement>()
  const ctaAnimation = useIntersectionAnimation<HTMLDivElement>()
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('yearly')

  const plans = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: billingInterval === 'monthly' ? 0 : 0,
      features: [
        "Smart context generation",
        "Basic AI features",
        "Project-wide search",
        "Standard support"
      ]
    },
    {
      name: "Pro",
      description: "AI at your fingertips",
      price: billingInterval === 'monthly' ? 29 : 23,
      popular: true,
      features: [
        "Everything in Free",
        "Advanced AI features",
        "Custom themes",
        "Priority support",
        "Cloud sync",
        "Unlimited history"
      ]
    },
    {
      name: "Enterprise",
      description: "For growing teams",
      price: billingInterval === 'monthly' ? 49 : 39,
      features: [
        "Everything in Pro",
        "Custom deployment",
        "Advanced security",
        "24/7 support",
        "SLA",
        "Custom contracts"
      ]
    }
  ]

  return (
    <>
      {/* Pricing Section */}
      <section className={cn(
        "relative py-32 px-4 overflow-hidden"
      )}>
        {/* Monthly/Yearly Toggle */}
        <div className="relative z-10 max-w-[860px] mx-auto mb-8">
          <div className="flex justify-center">
            <div className={cn(
              "relative inline-flex p-1 rounded-full",
              "bg-[#1D1D20] border border-[#2A2A2D]",
              "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
            )}>
              <div className="relative">
                <div className={cn(
                  "absolute -top-6 right-0",
                  "text-xs text-[#30D158] font-medium",
                  "bg-[#1D1D20] px-2 py-0.5 rounded-full",
                  "border border-[#30D158]/20",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
                )}>
                  -20%
                </div>
              </div>
              <button
                onClick={() => setBillingInterval('monthly')}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-sm font-medium",
                  "transition-all duration-200",
                  billingInterval === 'monthly' ? 
                    "text-white bg-[#2A2A2D]" : 
                    "text-[#737373] hover:text-white"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-sm font-medium",
                  "transition-all duration-200",
                  billingInterval === 'yearly' ? 
                    "text-white bg-[#2A2A2D]" : 
                    "text-[#737373] hover:text-white"
                )}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div 
          ref={pricingAnimation.ref}
          className={cn(
            "relative z-10 max-w-[860px] mx-auto",
            "grid grid-cols-1 md:grid-cols-3 gap-4",
            "opacity-0",
            pricingAnimation.isVisible && "animate-fade-in"
          )}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl",
                "bg-[#1D1D20] border border-[#2A2A2D]",
                "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                "transition-all duration-300",
                "hover:border-[#404043]",
                "group",
                plan.popular && [
                  "border-[#0F6BFF]/50",
                  "hover:border-[#0F6BFF]",
                  "before:absolute before:inset-0",
                  "before:rounded-2xl before:-z-10",
                  "before:bg-[#0F6BFF]/5",
                  "after:absolute after:inset-0",
                  "after:rounded-2xl after:-z-20",
                  "after:bg-[#0F6BFF]/10",
                  "after:blur-xl",
                  "after:opacity-50",
                  "after:transition-opacity",
                  "after:duration-300",
                  "group-hover:after:opacity-100"
                ]
              )}
            >
              {/* Graph Paper Effect */}
              <div className={cn(
                "absolute inset-0 bg-grid-white/[0.02]",
                "[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
                "rounded-2xl overflow-hidden"
              )} />

              {plan.popular && (
                <div className={cn(
                  "absolute -top-3 right-4",
                  "flex items-center justify-center",
                  "w-6 h-6 rounded-full",
                  "bg-[#0F6BFF]/10 border border-[#0F6BFF]/30",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
                )}>
                  <Check className="w-3.5 h-3.5 text-[#0F6BFF]" />
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-1 text-sm text-[#737373]">
                  {plan.description}
                </p>

                <div className="mt-6 flex items-baseline">
                  <span className="text-3xl font-bold text-white">${plan.price}</span>
                  <span className="ml-1 text-sm text-[#737373]">
                    /{billingInterval === 'monthly' ? 'month' : 'month'}
                  </span>
                </div>
                {billingInterval === 'yearly' && plan.price > 0 && (
                  <div className="mt-1 text-xs text-[#737373]">
                    ${plan.price * 12} billed annually
                  </div>
                )}

                <div className="mt-6">
                  <Button 
                    className={cn(
                      "w-full h-9 rounded-lg",
                      "bg-[#2A2A2D] hover:bg-[#404043]",
                      "text-sm font-medium text-white",
                      "border border-[#404043]",
                      "shadow-[0_0_0_1px_rgba(0,0,0,0.2)]",
                      "transition-colors duration-200",
                      plan.popular && "bg-[#0F6BFF] hover:bg-[#0F6BFF]/90 border-[#0F6BFF]/50"
                    )}
                  >
                    {plan.price === 0 ? 'Download' : 'Start Free Trial'}
                  </Button>
                </div>

                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[13px]">
                      <Check className="w-4 h-4 mt-0.5 text-[#30D158]" />
                      <span className="text-[#A1A1A6]">{feature}</span>
                    </li>
                  ))}
                  <li className="pt-1 text-[13px] text-[#737373]">
                    ... More coming soon
                  </li>
                </ul>

                {plan.price > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#2A2A2D]">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] text-[#A1A1A6]">Advanced AI</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] text-[#A1A1A6]">+${billingInterval === 'monthly' ? '8' : '6'}/month</span>
                        <button className="ml-1 text-[#737373] hover:text-white">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zM8 5v2M8 9h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className={cn(
        "relative py-32 px-4 overflow-hidden",
        "bg-gradient-to-b from-background/50 to-background"
      )}>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div 
            ref={faqsAnimation.ref}
            className={cn(
              "text-center opacity-0",
              faqsAnimation.isVisible && "animate-fade-in"
            )}
          >
            <h2 className={cn(
              "text-3xl sm:text-4xl font-bold",
              "bg-clip-text text-transparent",
              "bg-gradient-to-b from-foreground to-foreground/50"
            )}>
              Common Questions About Pro
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Everything you need to know about our advanced features
            </p>
          </div>

          <div className="mt-16 space-y-4">
            {[
              {
                question: "How does the context management system work?",
                answer: "Our context management system uses advanced AI to automatically analyze your codebase, external dependencies, and project structure. It creates a semantic understanding of relationships between components, tracks dependency versions, and maintains a living knowledge graph that updates in real-time as your project evolves."
              },
              {
                question: "What makes Top Pro different from other AI coding assistants?",
                answer: "Unlike traditional AI coding tools that focus solely on code completion, Top Pro provides comprehensive context awareness across your entire development workflow. It understands project dependencies, manages documentation, automates testing based on context, and provides intelligent insights about your codebase's architecture."
              },
              {
                question: "Can I integrate Top Pro with my existing tools?",
                answer: "Yes! Top Pro seamlessly integrates with popular development tools and platforms including GitHub, GitLab, Bitbucket, VS Code, JetBrains IDEs, and more. It also supports export to documentation systems like Notion, Confluence, and Obsidian, with custom integration options available."
              },
              {
                question: "How does dependency intelligence help my workflow?",
                answer: "Our dependency intelligence system automatically tracks all your project dependencies, detects potential breaking changes before they cause issues, analyzes the impact of updates across your codebase, and proactively identifies security vulnerabilities. This helps you maintain a healthy, secure codebase with minimal manual oversight."
              },
              {
                question: "What kind of context-aware testing is available?",
                answer: "Top Pro's context-aware testing automatically generates and updates tests based on your codebase changes, identifies affected test cases when you modify code, and ensures comprehensive test coverage across dependent components. It also provides intelligent suggestions for edge cases based on your project's context."
              },
              {
                question: "How does automated documentation work?",
                answer: "Our system automatically generates and maintains documentation by analyzing your code, comments, and project context. It keeps documentation in sync with code changes, creates relationship diagrams, and can export documentation in various formats. The AI understands code semantics and can explain complex functionality in clear, human-readable terms."
              }
            ].map((faq, i) => (
              <FaqItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className={cn(
        "relative py-32 px-4 overflow-hidden",
        "bg-gradient-to-b from-background to-background/50"
      )}>
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <div 
            ref={ctaAnimation.ref}
            className={cn(
              "mt-12 space-x-4 opacity-0",
              ctaAnimation.isVisible && "animate-fade-in"
            )}
          >
            <Button size="lg" className="min-w-[200px]">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="min-w-[200px]">
              View Pricing
            </Button>
          </div>
        </div>
      </section>
    </>
  )
} 