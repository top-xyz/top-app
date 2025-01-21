export interface GeneratedQuestion {
  id: string;
  question: string;
  type: 'vision' | 'technical' | 'user' | 'business' | 'innovation' | 'experience' | 'delight';
  required: boolean;
  systemFields?: string[];
  rationale?: string;
}

export interface EnhancedPromptResponse {
  questions: GeneratedQuestion[];
  references?: Array<{
    url: string;
    type: 'documentation' | 'example' | 'tutorial' | 'resource';
    relevance: string;
  }>;
  patterns?: Array<{
    name: string;
    description: string;
    applicability: string;
  }>;
}

export interface ProjectResponse {
  id: string;
  question: string;
  response: string;
  metadata?: {
    topics: string[];
    entities: string[];
    technicalConcepts: string[];
    possibleReferences: Array<{
      url: string;
      type: 'documentation' | 'example' | 'tutorial' | 'resource';
      relevance: string;
    }>;
  };
}

export interface InsightCategory {
  key: string;
  label: string;
  description: string;
  required: boolean;
  contextHints?: string[];
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

export interface GeneratedPrompt {
  id: string;
  question: string;
  context?: string;
  type: 'vision' | 'technical' | 'user' | 'business';
  required: boolean;
}
