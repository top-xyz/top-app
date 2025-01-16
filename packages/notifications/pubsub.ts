import { Redis } from '@upstash/redis'
import { env } from './env'

export interface Subscription {
  unsubscribe: () => void
}

export class PubSub {
  private redis: Redis
  private subscribers: Map<string, Set<(data: any) => void>>

  constructor() {
    this.redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN
    })
    this.subscribers = new Map()
  }

  async publish(channel: string, data: any): Promise<void> {
    await this.redis.publish(channel, JSON.stringify(data))
  }

  subscribe(channel: string, callback: (data: any) => void): Subscription {
    let channelSubscribers = this.subscribers.get(channel)
    if (!channelSubscribers) {
      channelSubscribers = new Set()
      this.subscribers.set(channel, channelSubscribers)
    }
    channelSubscribers.add(callback)

    return {
      unsubscribe: () => {
        channelSubscribers?.delete(callback)
        if (channelSubscribers?.size === 0) {
          this.subscribers.delete(channel)
        }
      }
    }
  }
}

// Export default instance
export const pubsub = new PubSub() 