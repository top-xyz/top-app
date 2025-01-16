import { metrics } from '@opentelemetry/api'

const meter = metrics.getMeter('contexts')

// Context operation counters
export const contextOperations = meter.createCounter('context.operations', {
  description: 'Count of context operations'
})

// Subscription metrics
export const activeSubscriptions = meter.createUpDownCounter('context.subscriptions', {
  description: 'Number of active context subscriptions'
})

// Rate limit metrics
export const rateLimitHits = meter.createCounter('context.rate_limits', {
  description: 'Count of rate limit hits'
}) 