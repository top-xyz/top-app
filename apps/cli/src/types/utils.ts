export interface DocumentLink {
  text: string;
  url: string;
  type: 'internal' | 'external';
}

export interface LogConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format?: 'text' | 'json';
  timestamp?: boolean;
  colors?: boolean;
}

export interface ValidationConfig {
  validateLinks: boolean;
  validateTemplate: boolean;
  strictMode: boolean;
}

export interface PreviewConfig {
  enabled: boolean;
  type: 'iframe' | 'component' | 'markdown';
  url?: string;
  components?: string[];
}

export interface ProjectConfig {
  name: string;
  type: string;
  version: string;
  created: string;
  paths: {
    context: string;
    docs: string;
    src: string;
  };
}

export interface EmbeddingConfig {
  provider: 'openai' | 'cohere' | 'vertex';
  model: string;
  dimensions: number;
  similarity: 'cosine' | 'euclidean' | 'dot';
  cache?: {
    strategy: 'lru' | 'tiered';
    maxSize: number;
    ttl: number;
  };
}

export interface StreamingConfig {
  enabled: boolean;
  chunkSize: number;
  delay?: number;
}

export interface CollaborationConfig {
  enabled: boolean;
  realtime: boolean;
  presence: boolean;
  comments: boolean;
}

export interface CollaborationEvent {
  type: 'join' | 'leave' | 'update' | 'comment';
  user: string;
  data: Record<string, any>;
  timestamp: string;
}

export interface ContextMetadata {
  id: string;
  type: string;
  name: string;
  created: string;
  updated: string;
  version: number;
  status: 'draft' | 'review' | 'approved';
  owner: string;
  collaborators: string[];
  preview?: PreviewData;
  events?: CollaborationEvent[];
}
