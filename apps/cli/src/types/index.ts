// Core exports
export * from './core/chat';
export * from './core/client';
export * from './core/context';
export * from './core/prompts';
export * from './core/vector-store';

// Database exports
export * from './db/sqlite';

// Utility exports
export * from './utils';

// Config types
export interface CLIConfig {
  templatesDir: string;
  contextDir: string;
  cacheDir: string;
  embeddings: {
    provider: string;
    model: string;
    dimensions: number;
    similarity: string;
  };
  defaultTemplate: string;
  validateTemplate: boolean;
  validateLinks: boolean;
  strictMode: boolean;
  format: string;
  colors: boolean;
  preview: {
    enabled: boolean;
    type: string;
  };
  collaboration: {
    enabled: boolean;
    realtime: boolean;
    presence: boolean;
    comments: boolean;
  };
  streaming: {
    enabled: boolean;
    chunkSize: number;
    delay: number;
  };
  api: {
    url: string;
    version: string;
  };
}

export interface CommandOptions {
  type?: string;
  name?: string;
  format?: 'markdown' | 'json';
  template?: string;
  validate?: boolean;
  preview?: boolean;
  collaborate?: boolean;
}

export interface CommandContext {
  config: CLIConfig;
  options: CommandOptions;
  command: string;
}
