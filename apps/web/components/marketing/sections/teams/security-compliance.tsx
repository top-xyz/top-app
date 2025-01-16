"use client"

import { cn } from '@repo/design-system/lib/utils'
import { Button } from '@repo/design-system/components/button'
import { Shield, Lock, FileCheck, Key, Bell, History } from 'lucide-react'
import { useIntersectionAnimation } from '@/hooks/use-intersection-animation'

export function SecurityCompliance() {
  const headerAnimation = useIntersectionAnimation()
  const contentAnimation = useIntersectionAnimation()

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div 
          ref={headerAnimation.ref as any}
          className={cn(
            "text-center space-y-4 mb-16",
            "opacity-0",
            headerAnimation.isVisible && "animate-fade-in"
          )}
        >
          <h2 className={cn(
            "text-3xl sm:text-4xl font-bold",
            "bg-clip-text text-transparent",
            "bg-gradient-to-b from-foreground to-foreground/70"
          )}>
            Enterprise-grade security
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built with security and compliance at its core, ensuring your team's data
            is always protected.
          </p>
        </div>

        {/* Main Content */}
        <div 
          ref={contentAnimation.ref as any}
          className={cn(
            "grid grid-cols-1 lg:grid-cols-2 gap-12",
            "opacity-0",
            contentAnimation.isVisible && "animate-slide-up"
          )}
        >
          {/* Features */}
          <div className="space-y-8">
            {[
              {
                icon: Shield,
                title: "SOC2 Compliance",
                description: "Certified SOC2 Type II compliance with annual audits"
              },
              {
                icon: Lock,
                title: "Data Encryption",
                description: "End-to-end encryption for all data in transit and at rest"
              },
              {
                icon: FileCheck,
                title: "GDPR Ready",
                description: "Full GDPR compliance with data processing agreements"
              },
              {
                icon: Key,
                title: "Access Controls",
                description: "Role-based access control with granular permissions"
              },
              {
                icon: Bell,
                title: "Security Alerts",
                description: "Real-time alerts for suspicious activities"
              },
              {
                icon: History,
                title: "Audit Logging",
                description: "Comprehensive audit trails for all actions"
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={cn(
                  "flex items-start gap-4",
                  "opacity-0",
                  contentAnimation.isVisible && "animate-fade-in"
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}

            <Button 
              className={cn(
                "mt-8",
                "opacity-0",
                contentAnimation.isVisible && "animate-fade-in"
              )}
              style={{ animationDelay: '600ms' }}
            >
              Security Details
            </Button>
          </div>

          {/* Security Badge Grid */}
          <div className={cn(
            "grid grid-cols-2 gap-4",
            "opacity-0",
            contentAnimation.isVisible && "animate-scale-up"
          )}>
            {[
              "SOC2",
              "GDPR",
              "HIPAA",
              "ISO 27001"
            ].map((badge, index) => (
              <div 
                key={badge}
                className={cn(
                  "aspect-square rounded-lg",
                  "bg-background/50 backdrop-blur-sm",
                  "border border-border/50",
                  "flex items-center justify-center",
                  "transform hover:scale-105 transition-all duration-300"
                )}
                style={{
                  animationDelay: `${index * 100 + 300}ms`
                }}
              >
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-medium">{badge}</p>
                  <p className="text-xs text-muted-foreground">Compliant</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 