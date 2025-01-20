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

export type ChatMode = 'exploration' | 'refinement' | 'suggestion' | 'context';

export interface ChatSession {
  id: string;
  mode: ChatMode;
  metadata: {
    generatedDocs?: string[];
    [key: string]: any;
  };
}

export interface ProjectContext {
  id: string;
  type: string;
  content: string;
  metadata: Record<string, any>;
}

// New types for enhanced interaction
export interface ProjectInitialContext {
  name: string;
  goals: string;
  responses: Record<string, string>; // Key prompts and their responses
  stage: 'initial' | 'detailed' | 'ready' | 'generating';
}

export interface GeneratedPrompt {
  id: string;
  question: string;
  context?: string;
  type: 'vision' | 'technical' | 'user' | 'business';
  required: boolean;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'engineering' | 'design' | 'marketing' | 'sales' | 'brainstorm';
  requires?: string[];
  generates: string[];
}

export interface DocumentGenerationPlan {
  templates: TemplateConfig[];
  structure: {
    type: string;
    files: string[];
    relationships: Array<{
      source: string;
      target: string;
      type: string;
    }>;
  };
  metadata: Record<string, any>;
} 