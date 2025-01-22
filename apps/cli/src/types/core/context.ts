import { ProjectType, ProjectInsights } from './project';
import { FlowState, InteractionPattern, ErgonomicProfile } from './flow';

// Base context interfaces
export interface BaseContext {
  id?: string;
  name: string;
  type: 'project' | 'conversation' | 'insight' | 'document' | 'flow';
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

// Change tracking types
export interface ContextChange {
  field: string;
  previous: any;
  current: any;
  embedding?: number[];
  timestamp: string;
  confidence?: number;
}

export interface ContextChangeLog {
  id: string;
  timestamp: string;
  component: string;
  changes: ContextChange[];
  metadata: {
    flowState?: string;
    trigger?: string;
    confidence?: number;
    source?: string;
  };
}

export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  timestamp: string;
  description?: string;
}

export interface EnhancedSystemMetadata extends SystemMetadata {
  semanticVersion: SemanticVersion;
  lastUpdated: string;
  changeLogs: ContextChangeLog[];
  semanticLinks: {
    related: Array<{contextId: string; similarity: number}>;
    influences: Array<{contextId: string; type: string; strength: number}>;
  };
}

export interface EnhancedContextEmbeddings extends ContextEmbeddings {
  components: {
    [key: string]: number[];  // Component-specific embeddings
  };
  changes: {
    [changeId: string]: number[];  // Change-specific embeddings
  };
  semantic: {
    full: number[];  // Full context semantic embedding
    summary: number[];  // Summary embedding
  };
}

// Flow-specific context types
export interface FlowMetadata extends SystemMetadata {
  currentState: FlowState;
  patterns: InteractionPattern[];
  ergonomics: ErgonomicProfile;
  transitions: {
    history: Array<{
      from: string;
      to: string;
      timestamp: string;
      energy: number;
    }>;
    planned: Array<{
      to: string;
      conditions: string[];
      estimatedEnergy: number;
    }>;
  };
}

export interface FlowEmbeddings extends ContextEmbeddings {
  state: number[];
  patterns: number[];
  ergonomics: number[];
}

export interface FlowContext extends BaseContext {
  type: 'flow';
  metadata: FlowMetadata;
  embeddings: FlowEmbeddings;
  currentEnergy: number;
  momentum: number;
  adaptations: Array<{
    trigger: string;
    response: string;
    success: boolean;
    timestamp: string;
  }>;
}

export interface EnhancedFlowContext extends FlowContext {
  _system: {
    embeddings: FlowEmbeddings;
    metadata: FlowMetadata;
    similarity?: number;
    matchType?: string;
  };
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

// Project-specific context types
export interface ProjectContext extends BaseContext {
  insights: ProjectInsights;
  metadata: SystemMetadata & {
    projectType: ProjectType;
    flowState?: FlowState;
    flowPatterns?: InteractionPattern[];
    flowErgonomics?: ErgonomicProfile;
  };
}

export interface EnhancedProjectContext extends ProjectContext {
  _system: {
    embeddings: ContextEmbeddings;
    metadata: SystemMetadata & {
      projectType: ProjectType;
      flowState?: FlowState;
      flowPatterns?: InteractionPattern[];
      flowErgonomics?: ErgonomicProfile;
    };
    similarity?: number;
    matchType?: string;
  };
}

export interface ProjectInitialContext extends ProjectContext {
  stage: 'initial' | 'detailed' | 'ready' | 'generating';
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
