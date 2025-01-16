import { withRetry } from './retry'
import type { ContextUpdate } from './types'

export interface SubscriptionOptions {
  onMessage: (update: ContextUpdate) => void
  onError: (error: Error) => void
  onReconnect: () => void
  retryAttempts?: number
  retryDelay?: number
}

export class ContextSubscription {
  private eventSource: EventSource | null = null
  private isConnected = false
  private reconnectAttempt = 0

  constructor(
    private contextId: string,
    private options: SubscriptionOptions
  ) {}

  async connect(): Promise<void> {
    try {
      await this.setupEventSource()
    } catch (error) {
      this.handleError(error as Error)
    }
  }

  private async setupEventSource(): Promise<void> {
    await withRetry(
      () => {
        return new Promise((resolve, reject) => {
          this.eventSource = new EventSource(
            `/api/contexts/${this.contextId}/subscribe`
          )

          this.eventSource.onopen = () => {
            this.isConnected = true
            this.reconnectAttempt = 0
            resolve()
          }

          this.eventSource.onmessage = (event) => {
            try {
              const update = JSON.parse(event.data)
              this.options.onMessage(update)
            } catch (error) {
              this.handleError(error as Error)
            }
          }

          this.eventSource.onerror = (error) => {
            this.handleError(error as Error)
            reject(error)
          }
        })
      },
      {
        maxAttempts: this.options.retryAttempts ?? 3,
        initialDelay: this.options.retryDelay ?? 1000
      }
    )
  }

  private async handleError(error: Error): Promise<void> {
    this.isConnected = false
    this.options.onError(error)

    if (this.reconnectAttempt < (this.options.retryAttempts ?? 3)) {
      this.reconnectAttempt++
      this.options.onReconnect()
      await this.connect()
    }
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close()
      this.isConnected = false
    }
  }
} 