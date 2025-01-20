import { debug } from '../../utils/debug';
import { VertexAIClient } from '../../utils/vertex-ai';
import {
  EnhancedProjectContext,
  ProjectResponse,
  SystemContext,
  EnhancedPromptResponse,
  RelationshipGraph
} from '../../types/context';
import { Logger } from '../../utils/logger';

interface ProjectContext {
  name: string;
  description: string;
  insights: {
    technicalPatterns: string[];
    userNeeds: string[];
    challenges: string[];
    opportunities: string[];
  };
  _system: {
    embeddings: {
      vision: number[];
      goals: number[];
    };
    relationships: {
      nodes: string[];
      edges: Array<{
        source: string;
        target: string;
        weight: number;
        type: string;
      }>;
    };
    type: string;
    metadata: {
      initialized: string;
      version: string;
      stage: string;
    };
  };
}

export class ContextManager {
  private context: any = {};
  private ai: VertexAIClient;
  private logger: Logger;

  constructor(ai: VertexAIClient) {
    this.ai = ai;
    this.logger = new Logger();
    this.context = {
      _system: {
        initialized: false,
        version: '1.0.0',
        stage: 'initial',
        references: [],
        patterns: [],
        insights: {},
        metadata: {}
      },
      conceptual: {},
      technical: {},
      history: []
    };
  }

  async initializeProject(name: string, description: string, type: string): Promise<void> {
    debug('ContextManager', 'Initializing project:', { name, description, type });
    
    this.context._system.initialized = true;
    this.context._system.stage = 'initialized';
    this.context._system.projectType = type;
    this.context._system.timestamp = new Date().toISOString();
    
    this.context.name = name;
    this.context.description = description;
    
    debug('ContextManager', 'Project initialized');
  }

  async addInsights(insights: any): Promise<void> {
    debug('ContextManager', 'Adding insights:', insights);
    this.context._system.insights = {
      ...this.context._system.insights,
      ...insights
    };
  }

  async addReferences(references: any[]): Promise<void> {
    debug('ContextManager', 'Adding references:', references);
    this.context._system.references = [
      ...this.context._system.references,
      ...references.map(ref => ({
        ...ref,
        added: new Date().toISOString()
      }))
    ];
  }

  async addPatterns(patterns: any[]): Promise<void> {
    debug('ContextManager', 'Adding patterns:', patterns);
    this.context._system.patterns = [
      ...this.context._system.patterns,
      ...patterns.map(pattern => ({
        ...pattern,
        added: new Date().toISOString()
      }))
    ];
  }

  getContext(): any {
    return this.context;
  }

  async getInsights(): Promise<any> {
    return this.context._system.insights;
  }

  async getSystemContext(): Promise<any> {
    return this.context._system;
  }

  async getProjectType(): Promise<string> {
    return this.context._system.projectType;
  }

  async processResponse(questionId: string, question: string, response: string): Promise<void> {
    debug('ContextManager', 'Processing response:', { questionId, question, response });
    
    // Add to history
    this.context.history.push({
      type: 'response',
      questionId,
      question,
      response,
      timestamp: new Date().toISOString()
    });

    // Generate and store metadata about the response
    const metadata = await this.ai.generateContent({
      prompt: `Analyze this response and extract key metadata:
Question: ${question}
Response: ${response}

Return a JSON object with:
{
  "topics": string[],
  "entities": string[],
  "technicalConcepts": string[],
  "possibleReferences": [
    {
      "type": "documentation" | "example" | "resource",
      "description": string
    }
  ]
}`,
      type: 'structured'
    });

    try {
      const parsedMetadata = JSON.parse(metadata);
      
      // Store metadata
      this.context._system.metadata[questionId] = {
        ...parsedMetadata,
        processed: new Date().toISOString()
      };

      // If new references are suggested, add them
      if (parsedMetadata.possibleReferences?.length > 0) {
        await this.addReferences(parsedMetadata.possibleReferences);
      }

    } catch (error) {
      debug('ContextManager', 'Error processing response metadata:', error);
    }
  }

  getRelationshipGraph(): any {
    // Build a graph of relationships between different pieces of context
    const graph = {
      nodes: [],
      edges: []
    };

    // Add nodes for each major context section
    if (this.context._system.insights) {
      graph.nodes.push({
        id: 'insights',
        type: 'insights',
        data: this.context._system.insights
      });
    }

    // Add nodes for patterns
    this.context._system.patterns.forEach((pattern: any) => {
      graph.nodes.push({
        id: `pattern_${pattern.name}`,
        type: 'pattern',
        data: pattern
      });
    });

    // Add nodes for references
    this.context._system.references.forEach((ref: any, index: number) => {
      graph.nodes.push({
        id: `reference_${index}`,
        type: 'reference',
        data: ref
      });
    });

    return graph;
  }
}