import { debug } from '../../utils/debug';
import { VertexAIClient } from '../client/vertex-ai';
import {
  EnhancedProjectContext,
  ProjectContext,
  SystemContext,
  EnhancedPromptResponse,
  RelationshipGraph,
  ProjectInitialContext
} from '../../types/core/context';
import { ProjectType } from '../../types/core/project';
import { Logger } from '../../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

export class ContextManager {
  private context: ProjectContext = {} as ProjectContext;
  private ai: VertexAIClient;
  private logger: Logger;
  private contextCache: Map<string, EnhancedProjectContext> = new Map();
  private contextDir: string;

  constructor(ai: VertexAIClient, contextDir?: string) {
    this.ai = ai;
    this.logger = new Logger();
    this.contextDir = contextDir || path.join(process.cwd(), 'context');
  }

  async initialize(): Promise<void> {
    await this.loadContexts();
  }

  private async loadContexts() {
    try {
      await fs.mkdir(this.contextDir, { recursive: true });
      const files = await fs.readdir(this.contextDir);
      
      for (const file of files) {
        if (file.endsWith('.md')) {
          const content = await fs.readFile(path.join(this.contextDir, file), 'utf-8');
          const context = await this.parseContextFile(file, content);
          if (context) {
            this.contextCache.set(context.name, context);
          }
        }
      }
    } catch (error) {
      debug('loadContexts', 'Error:', error);
      throw error;
    }
  }

  async findRelevantContexts(query: string, threshold = 0.7): Promise<EnhancedProjectContext[]> {
    const queryEmbeddings = await this.ai.generateEmbeddings(query);
    const results: EnhancedProjectContext[] = [];

    for (const context of this.contextCache.values()) {
      if (!context._system?.embeddings?.vision) {
        // Generate embeddings for contexts that don't have them
        context._system = {
          ...context._system,
          embeddings: await this.generateContextEmbeddings(context)
        };
        await this.saveContextToFile(context);
      }
      
      // Compare both vision and goals embeddings
      const visionSimilarity = this.calculateSimilarity(
        queryEmbeddings, 
        context._system.embeddings.vision
      );
      
      const goalsSimilarity = this.calculateSimilarity(
        queryEmbeddings,
        context._system.embeddings.goals
      );

      // Use the higher similarity score
      const similarity = Math.max(visionSimilarity, goalsSimilarity);

      if (similarity > threshold) {
        results.push({
          ...context,
          _system: {
            ...context._system,
            similarity,
            matchType: visionSimilarity > goalsSimilarity ? 'vision' : 'goals'
          }
        });
      }
    }

    return results.sort((a, b) => 
      ((b._system?.similarity || 0) - (a._system?.similarity || 0))
    );
  }

  async listContexts(): Promise<EnhancedProjectContext[]> {
    return Array.from(this.contextCache.values());
  }

  async getContext(name: string): Promise<EnhancedProjectContext | null> {
    return this.contextCache.get(name) || null;
  }

  async addContext(context: EnhancedProjectContext): Promise<void> {
    // Generate comprehensive embeddings for better semantic search
    const embeddings = await this.generateContextEmbeddings(context);
    context._system = {
      ...context._system,
      embeddings,
      metadata: {
        ...context._system?.metadata,
        lastUpdated: new Date().toISOString()
      }
    };

    // Save to cache and file
    this.contextCache.set(context.name, context);
    await this.saveContextToFile(context);
  }

  private async saveContextToFile(context: EnhancedProjectContext): Promise<void> {
    const fileName = `${context.name}.md`;
    const filePath = path.join(this.contextDir, fileName);
    const content = this.serializeContext(context);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  private serializeContext(context: EnhancedProjectContext): string {
    // Convert context to markdown format
    return `# ${context.name}\n\n` +
           `## Description\n${context.description}\n\n` +
           `## Insights\n` +
           Object.entries(context.insights || {})
             .map(([key, values]) => 
               `### ${key}\n${values.join('\n')}`
             ).join('\n\n') +
           `\n\n<!-- System Data\n${JSON.stringify(context._system, null, 2)}\n-->`;
  }

  private async parseContextFile(fileName: string, content: string): Promise<EnhancedProjectContext | null> {
    try {
      const name = fileName.replace('.md', '');
      const sections = content.split('\n## ');
      const description = sections[1]?.replace('Description\n', '').trim() || '';
      
      // Extract system data from HTML comments
      const systemMatch = content.match(/<!-- System Data\n([\s\S]*?)\n-->/);
      const system = systemMatch ? JSON.parse(systemMatch[1]) : {};

      return {
        name,
        description,
        _system: system,
        insights: this.parseInsights(sections)
      };
    } catch (error) {
      debug('parseContextFile', 'Error parsing', fileName, error);
      return null;
    }
  }

  private parseInsights(sections: string[]): any {
    const insightsSection = sections.find(s => s.startsWith('Insights\n'));
    if (!insightsSection) return {};

    const insights: any = {};
    const categories = insightsSection.split('\n### ');
    categories.slice(1).forEach(cat => {
      const [name, ...values] = cat.split('\n');
      insights[name.toLowerCase()] = values.filter(v => v.trim());
    });

    return insights;
  }

  async generateContextEmbeddings(context: EnhancedProjectContext) {
    debug('ContextManager', 'Generating embeddings for context:', context.name);

    // Generate vision embeddings from description
    const visionEmbeddings = await this.ai.generateEmbeddings(context.description);
    if (visionEmbeddings) {
      context._system.embeddings.vision = visionEmbeddings;
    }

    // Generate technical embeddings from patterns and technologies
    if (context.insights?.technicalPatterns?.length > 0) {
      const technicalContent = [
        ...context.insights.technicalPatterns,
        ...(context.insights.technologies || []),
        ...(context.insights.architecture || [])
      ].join('\n');
      const technicalEmbeddings = await this.ai.generateEmbeddings(technicalContent);
      if (technicalEmbeddings) {
        context._system.embeddings.technical = technicalEmbeddings;
      }
    }

    // Generate workflow embeddings from challenges and opportunities
    if (context.insights?.challenges?.length > 0 || context.insights?.opportunities?.length > 0) {
      const workflowContent = [
        ...(context.insights.challenges || []),
        ...(context.insights.opportunities || []),
        ...(context.insights.integrations || [])
      ].join('\n');
      const workflowEmbeddings = await this.ai.generateEmbeddings(workflowContent);
      if (workflowEmbeddings) {
        context._system.embeddings.workflow = workflowEmbeddings;
      }
    }

    // Generate combined insights embeddings
    const allInsights = Object.entries(context.insights || {})
      .filter(([_, value]) => Array.isArray(value) && value.length > 0)
      .map(([key, value]) => `${key}: ${value.join(', ')}`)
      .join('\n');
    
    if (allInsights) {
      const insightsEmbeddings = await this.ai.generateEmbeddings(allInsights);
      if (insightsEmbeddings) {
        context._system.embeddings.insights = insightsEmbeddings;
      }
    }

    // Generate project type embeddings
    if (context._system?.metadata?.projectType) {
      const typeContent = [
        context._system.metadata.projectType.primaryType,
        ...context._system.metadata.projectType.reasons,
        ...context._system.metadata.projectType.secondaryTypes
      ].join('\n');
      const typeEmbeddings = await this.ai.generateEmbeddings(typeContent);
      if (typeEmbeddings) {
        context._system.embeddings.projectType = typeEmbeddings;
      }
    }

    debug('ContextManager', 'Embeddings generated for all context aspects');
    context._system.embeddings.lastGenerated = new Date().toISOString();
  }

  private calculateSimilarity(a: number[], b: number[]): number {
    if (!a || !b || a.length !== b.length) return 0;
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async initializeProject(name: string, description: string, type: ProjectType): Promise<void> {
    debug('ContextManager', 'Initializing project:', { name, description, type });
    
    // Initialize context structure
    this.context = {
      name,
      description,
      _system: {
        initialized: true,
        stage: 'initialized',
        projectType: type,
        timestamp: new Date().toISOString(),
        metadata: {
          version: '1.0.0',
          stage: 'initial',
          initialized: new Date().toISOString()
        },
        insights: {
          technicalPatterns: [],
          userNeeds: [],
          challenges: [],
          opportunities: []
        },
        embeddings: {
          vision: [],
          technical: [],
          workflow: []
        }
      }
    };
    
    // Generate initial embeddings
    const visionEmbeddings = await this.ai.generateEmbeddings(description);
    if (visionEmbeddings) {
      this.context._system.embeddings.vision = visionEmbeddings;
    }
    
    debug('ContextManager', 'Project initialized with embeddings');
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

  async compareContexts(contextA: string, contextB: string): Promise<{
    similarity: number,
    relationship: string
  }> {
    const a = await this.getContext(contextA);
    const b = await this.getContext(contextB);
    
    if (!a || !b) throw new Error('Context not found');

    // Generate embeddings if needed
    if (!a._system?.embeddings) {
      a._system = { ...a._system, embeddings: await this.generateContextEmbeddings(a) };
    }
    if (!b._system?.embeddings) {
      b._system = { ...b._system, embeddings: await this.generateContextEmbeddings(b) };
    }

    const similarity = this.calculateSimilarity(
      a._system.embeddings.vision,
      b._system.embeddings.vision
    );

    // Determine relationship based on similarity
    let relationship = 'unrelated';
    if (similarity > 0.9) relationship = 'nearly identical';
    else if (similarity > 0.8) relationship = 'strongly related';
    else if (similarity > 0.6) relationship = 'moderately related';
    else if (similarity > 0.4) relationship = 'weakly related';

    return { similarity, relationship };
  }
}