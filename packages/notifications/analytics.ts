import { analytics } from '@repo/analytics/posthog/server'
import { activeSubscriptions } from '@repo/observability/monitoring'

export interface SubscriptionAnalytics {
  trackSubscription(contextId: string, userId: string): Promise<void>
  trackUnsubscription(contextId: string, userId: string): Promise<void>
  getActiveSubscriptions(contextId: string): Promise<number>
}

export class SubscriptionAnalytics implements SubscriptionAnalytics {
  async trackSubscription(contextId: string, userId: string): Promise<void> {
    // Track subscription event
    await analytics.capture({
      distinctId: userId,
      event: 'context.subscribed',
      properties: {
        contextId,
        timestamp: new Date().toISOString()
      }
    })

    // Update metrics
    activeSubscriptions.add(1)
  }

  async trackUnsubscription(contextId: string, userId: string): Promise<void> {
    // Track unsubscription event
    await analytics.capture({
      distinctId: userId,
      event: 'context.unsubscribed',
      properties: {
        contextId,
        timestamp: new Date().toISOString()
      }
    })

    // Update metrics
    activeSubscriptions.add(-1)
  }

  async getActiveSubscriptions(contextId: string): Promise<number> {
    const result = await analytics.groupBy({
      event: 'context.subscribed',
      groupBy: ['contextId'],
      where: {
        contextId,
        timestamp: {
          after: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      }
    })

    return result.length
  }
} 