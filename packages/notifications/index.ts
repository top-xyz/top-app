import { PubSub } from './pubsub'
import { Knock } from '@knocklabs/node'
import { env } from './env'

// Initialize Knock client
const knock = new Knock(env.KNOCK_API_KEY)

// Initialize PubSub
export const pubsub = new PubSub()

// Export notifications object
export const notifications = {
  notify: async ({ type, userId, data }: { type: string; userId: string; data: Record<string, any> }) => {
    // Send notification via Knock
    await knock.workflows.trigger(type, {
      recipients: [userId],
      data
    })
    
    // Also publish to pubsub for real-time updates
    await pubsub.publish(`user:${userId}`, {
      type,
      data
    })
  }
}
