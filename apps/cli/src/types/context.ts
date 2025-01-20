// Core Project Types
export interface ProjectMetadata {
  name: string;
  goals: string;
  projectType: string;
  timestamp: string;
}

export interface ConceptualContext {
  vision: string[];
  constraints: string[];
  patterns: string[];
  innovations: string[];
}

export interface TechnicalContext {
  stack: string[];
  architecture: {
    patterns: string[];
    components: string[];
    dataFlow: string[];
  };
  dependencies: string[];
  integrations: string[];
}

export interface ContextEmbeddings {
  vision: number[];
  technical: number[];
  workflow: number[];
}

export interface ContextualHints {
  architecture: string[];
  userExperience: string[];
  implementation: string[];
}

export interface RelationshipNode {
  id: string;
  type: string;
  data: any;
}

export interface RelationshipEdge {
  source: string;
  target: string;
  type: string;
  weight: number;
}

export interface RelationshipGraph {
  nodes: RelationshipNode[];
  edges: RelationshipEdge[];
}

export interface ResponseAnalysis {
  keywords: string[];
  implications: string[];
  connections: Array<{
    concept: string;
    strength: number;
  }>;
  suggestedFollowups: string[];
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

export interface ProjectDecision {
  timestamp: string;
  type: string;
  description: string;
  impact: string[];
}

export interface ProjectIteration {
  phase: string;
  insights: string[];
  refinements: string[];
}

export interface SystemContext {
  initialized: boolean;
  version: string;
  stage: string;
  projectType?: string;
  timestamp?: string;
  references: Array<{
    url: string;
    type: 'documentation' | 'example' | 'tutorial' | 'resource';
    relevance: string;
    added?: string;
  }>;
  patterns: Array<{
    name: string;
    description: string;
    applicability: string;
    added?: string;
  }>;
  insights: {
    technicalPatterns?: string[];
    userNeeds?: string[];
    challenges?: string[];
    opportunities?: string[];
  };
  metadata: Record<string, any>;
}

export interface EnhancedProjectContext {
  name: string;
  goals: string;
  responses: Record<string, string>;
  stage: string;
  insights?: SystemContext['insights'];
  systemContext?: SystemContext;
  metadata?: {
    stage: string;
    timestamp: string;
    references: SystemContext['references'];
  };
}

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
  references?: SystemContext['references'];
  patterns?: SystemContext['patterns'];
}

export interface MetaAnalysis {
  detectedConcepts: string[];
  suggestedArchitectures: string[];
  potentialChallenges: string[];
  recommendedPatterns: string[];
} 