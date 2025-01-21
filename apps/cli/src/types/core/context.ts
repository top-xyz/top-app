import { ProjectType, ProjectInsights } from './project';

// Base context interfaces
export interface BaseContext {
  id?: string;
  name: string;
  type: 'project' | 'conversation' | 'insight' | 'document';
  description: string;
  created_at?: string;
  updated_at?: string;
}

export interface ContextEmbeddings {
  vision: number[];        // Project vision/description embeddings
  technical: number[];     // Technical requirements/patterns
  workflow: number[];      // Process/workflow patterns
  insights?: number[];     // Combined project insights
  projectType?: number[];  // Project type classification
  conversation?: number[];
  lastGenerated?: string;
}

export interface ContextInsights {
  technicalPatterns?: string[];
  userNeeds?: string[];
  challenges?: string[];
  opportunities?: string[];
  [key: string]: string[] | undefined;
}

export interface SystemMetadata {
  initialized: boolean;
  version: string;
  stage: string;
  projectType?: ProjectType;
  timestamp?: string;
  references?: Array<{
    url: string;
    type: 'documentation' | 'example' | 'tutorial' | 'resource';
    relevance: string;
    added?: string;
  }>;
  patterns?: Array<{
    name: string;
    description: string;
    applicability: string;
    added?: string;
  }>;
  [key: string]: any;
}

// Main context types
export interface Context extends BaseContext {
  insights?: ContextInsights;
  content?: string;
  metadata?: SystemMetadata;
  embeddings?: ContextEmbeddings;
  _system?: {
    embeddings: ContextEmbeddings;
    metadata: SystemMetadata;
  };
}

export interface EnhancedContext extends Context {
  insights: ContextInsights;
  _system: {
    embeddings: ContextEmbeddings;
    metadata: SystemMetadata;
    similarity?: number;
    matchType?: string;
  };
  embeddings: ContextEmbeddings;
  metadata: SystemMetadata;
  similarity?: number;
  matchType?: string;
}

// Relationship types
export interface ContextRelationship {
  source: string;
  target: string;
  type: string;
  strength: number;
  metadata?: Record<string, any>;
}

export interface ContextGraph {
  nodes: Context[];
  edges: ContextRelationship[];
}

// Analysis types
export interface ContextAnalysis {
  keywords: string[];
  implications: string[];
  connections: Array<{
    context: string;
    strength: number;
  }>;
  context: string;
  strength: number;
  suggestedFollowups?: string[];
}

export interface ContextDecision {
  timestamp: string;
  type: string;
  description: string;
  impact: string[];
  context_id?: string;
}

export interface ContextIteration {
  phase: string;
  insights: string[];
  refinements: string[];
  context_id: string;
}

// Project-specific context types
export interface ProjectContext extends Context {
  insights: ProjectInsights;
  metadata: SystemMetadata & {
    projectType: ProjectType;
  };
}

export interface EnhancedProjectContext extends EnhancedContext {
  insights: ProjectInsights;
  metadata: SystemMetadata & {
    projectType: ProjectType;
  };
}

export interface ProjectInitialContext extends ProjectContext {
  stage: 'initial' | 'detailed' | 'ready' | 'generating';
}

// DB types
export interface DBContext extends BaseContext {
  project_id?: string;
  category?: string;
  priority?: number;
  content: string;
  metadata?: string;
  embeddings?: string;
}

export interface DBContextRelationship {
  id: string;
  source_context_id: string;
  target_context_id: string;
  relationship_type: string;
  strength: number;
  created_at: string;
}

// Utility type for migrations
export interface LegacyProjectContext {
  id: string;
  type: string;
  content: string;
  metadata: Record<string, any>;
}
