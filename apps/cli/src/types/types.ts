export type ChatMode = 'base' | 'docs' | 'dev'

export interface DocumentLink {
  text: string
  url: string
  type: 'internal' | 'external'
}

export interface ProjectConfig {
  name: string
  type: string
  version: string
  created: string
  paths: {
    context: string
    docs: string
    src: string
  }
}

export interface EmbeddingConfig {
  provider: 'openai' | 'cohere' | 'vertex'
  model: string
  dimensions: number
  similarity: 'cosine' | 'euclidean' | 'dot'
  cache?: {
    strategy: 'lru' | 'tiered'
    maxSize: number
    ttl: number
  }
}

export interface ValidationConfig {
  validateLinks: boolean
  validateTemplate: boolean
  strictMode: boolean
}

export interface PreviewConfig {
  enabled: boolean
  type: 'iframe' | 'component' | 'markdown'
  url?: string
  components?: string[]
}

export interface CollaborationConfig {
  enabled: boolean
  realtime: boolean
  presence: boolean
  comments: boolean
}

export interface StreamingConfig {
  enabled: boolean
  chunkSize: number
  delay?: number
}

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

export interface CommandOptions {
  type?: string
  name?: string
  format?: 'markdown' | 'json'
  template?: string
  validate?: boolean
  preview?: boolean
  collaborate?: boolean
}

export interface CommandContext {
  config: CLIConfig
  options: CommandOptions
  command: string
}

export interface PreviewData {
  type: 'component' | 'document' | 'app'
  content: string
  metadata: Record<string, any>
  url?: string
}

export interface CollaborationEvent {
  type: 'join' | 'leave' | 'update' | 'comment'
  user: string
  data: Record<string, any>
  timestamp: string
}

export interface ContextMetadata {
  id: string
  type: string
  name: string
  created: string
  updated: string
  version: number
  status: 'draft' | 'review' | 'approved'
  owner: string
  collaborators: string[]
  preview?: PreviewData
  events?: CollaborationEvent[]
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  metadata?: {
    type?: 'goal' | 'vision' | 'technical' | 'design' | 'documentation'
    context?: string
    references?: DocumentLink[]
  }
}

export interface ChatSession {
  id: string
  mode: ChatMode
  context: string
  history: ChatMessage[]
  metadata: {
    created: string
    lastUpdated: string
    goals?: string[]
    vision?: string
    currentTopic?: string
    generatedDocs?: string[]
    progress?: number
  }
}

export interface ChatResponse {
  type: 'message' | 'suggestion' | 'preview' | 'error'
  content: string
  metadata: {
    timestamp: string
    error?: boolean
    context?: string
    suggestions?: string[]
    nextSteps?: string[]
    progress?: number
  }
}

export interface ProjectContext {
  name: string
  description: string
  vision: string
  goals: string[]
  architecture: {
    core: string[]
    components: string[]
    integrations: string[]
  }
  features: {
    core: string[]
    planned: string[]
  }
  documentation: {
    overview: string
    technical: string[]
    user: string[]
    generated: {
      timestamp: string
      files: string[]
    }
  }
  metadata: {
    created: string
    lastUpdated: string
    version: string
    status: 'planning' | 'documenting' | 'developing'
    progress: {
      base: number
      docs: number
      dev: number
    }
  }
} 