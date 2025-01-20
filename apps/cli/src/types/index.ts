export interface CLIConfig {
  templatesDir: string
  contextDir: string
  cacheDir: string
  embeddings: {
    provider: 'openai' | 'vertex'
    model: string
    dimensions: number
    similarity: 'cosine' | 'euclidean' | 'dot'
  }
  defaultTemplate: string
  validateTemplate: boolean
  validateLinks: boolean
  strictMode: boolean
  format: 'markdown'
  colors: boolean
  preview: {
    enabled: boolean
    type: 'markdown'
  }
  collaboration: {
    enabled: boolean
    realtime: boolean
    presence: boolean
    comments: boolean
  }
  streaming: {
    enabled: boolean
    chunkSize: number
    delay: number
  }
  api: {
    url: string
    version: string
  }
} 