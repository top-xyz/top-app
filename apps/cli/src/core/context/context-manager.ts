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
import { FlowContext, FlowMetadata } from '../../types/core/flow-context';

export class ContextManager {
  private context: ProjectContext = {} as ProjectContext;
  private ai: VertexAIClient;
  private logger: Logger;
  private contextCache: Map<string, EnhancedProjectContext> = new Map();
  private flowContexts: Map<string, FlowContext> = new Map();
  private contextDir: string;
  private currentContext: ProjectContext | null = null;

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

  private async saveContext(): Promise<void> {
    debug('ContextManager', 'Saving context');
    
    if (!this.currentContext) {
      throw new Error('No active context to save');
    }
    
    const filename = `${this.currentContext.name || 'temp'}.json`;
    const filepath = path.join(this.contextDir, filename);
    
    try {
      await fs.promises.mkdir(this.contextDir, { recursive: true });
      await fs.promises.writeFile(filepath, JSON.stringify(this.currentContext, null, 2));
      debug('ContextManager', 'Context saved to:', filepath);
    } catch (error) {
      debug('ContextManager', 'Error saving context:', error);
      throw error;
    }
  }

  async initializeProject(context: ProjectInitialContext): Promise<void> {
    debug('ContextManager', 'Initializing project:', context);

    this.currentContext = {
      name: context.name,
      description: context.description,
      history: [], // Initialize empty history array
      _system: {
        metadata: {},
        embeddings: {},
        responses: {},
        lastUpdated: new Date().toISOString()
      }
    };

    await this.saveContext();
  }

  async updateProjectStructure(vision: any): Promise<void> {
    debug('ContextManager', 'Updating project structure');
    
    if (!this.currentContext) {
      throw new Error('No active project context');
    }
    
    this.currentContext.vision = vision;
    if (this.currentContext._system) {
      this.currentContext._system.vision = vision;
      this.currentContext._system.metadata = {
        ...this.currentContext._system.metadata,
        vision,
        lastUpdated: new Date().toISOString()
      };
    }
    
    await this.saveContext();
  }

  async addInsights(insights: any): Promise<void> {
    debug('ContextManager', 'Adding insights:', insights);
    this.currentContext._system.insights = {
      ...this.currentContext._system.insights,
      ...insights
    };
  }

  async updateInsights(insights: any): Promise<any> {
    debug('ContextManager', 'Updating insights:', insights);
    if (!this.currentContext) {
      throw new Error('No context initialized');
    }
    
    this.currentContext.insights = {
      ...this.currentContext.insights,
      ...insights
    };
    
    await this.saveContext();
    return this.currentContext.insights;
  }

  async addReferences(references: any[]): Promise<void> {
    debug('ContextManager', 'Adding references:', references);
    this.currentContext._system.references = [
      ...this.currentContext._system.references,
      ...references.map(ref => ({
        ...ref,
        added: new Date().toISOString()
      }))
    ];
  }

  async addPatterns(patterns: any[]): Promise<void> {
    debug('ContextManager', 'Adding patterns:', patterns);
    this.currentContext._system.patterns = [
      ...this.currentContext._system.patterns,
      ...patterns.map(pattern => ({
        ...pattern,
        added: new Date().toISOString()
      }))
    ];
  }

  async getContext(): Promise<any> {
    return this.currentContext;
  }

  async getInsights(): Promise<any> {
    return this.currentContext._system.insights;
  }

  async getSystemContext(): Promise<any> {
    return this.currentContext._system;
  }

  async getProjectType(): Promise<string> {
    return this.currentContext._system.projectType;
  }

  async updateProjectType(projectType: ProjectType): Promise<void> {
    if (!this.currentContext) {
      throw new Error('No active context');
    }

    const previousType = this.currentContext.metadata?.projectType;
    
    // Initialize metadata if needed
    if (!this.currentContext.metadata) {
      this.currentContext.metadata = {
        initialized: true,
        version: '1.0.0',
        stage: 'initial',
        projectType
      };
    } else {
      this.currentContext.metadata.projectType = projectType;
    }

    // Track the change
    const change: ContextChange = {
      field: 'projectType',
      previous: previousType,
      current: projectType,
      timestamp: new Date().toISOString(),
      confidence: projectType.confidence
    };

    // Add to change log
    if (!this.currentContext._system) {
      this.currentContext._system = {
        metadata: {
          semanticVersion: {
            major: 1,
            minor: 0,
            patch: 0,
            timestamp: new Date().toISOString()
          },
          lastUpdated: new Date().toISOString(),
          changeLogs: []
        }
      } as any;
    }

    const changeLog: ContextChangeLog = {
      id: `change-${Date.now()}`,
      timestamp: new Date().toISOString(),
      component: 'projectType',
      changes: [change],
      metadata: {
        confidence: projectType.confidence,
        trigger: 'projectTypeDetection'
      }
    };

    if (!this.currentContext._system.metadata.changeLogs) {
      this.currentContext._system.metadata.changeLogs = [];
    }
    this.currentContext._system.metadata.changeLogs.push(changeLog);

    // Save context
    await this.saveContext();
    
    debug('ContextManager', 'Project type updated:', projectType);
  }

  async updateVisionAnalysis(vision: any): Promise<void> {
    debug('ContextManager', 'Updating vision analysis');
    
    if (!this.currentContext) {
      throw new Error('No active context');
    }

    // Extract and store name suggestions
    const nameSuggestions = vision.nameSuggestions;
    const visionWithoutSuggestions = { ...vision };
    delete visionWithoutSuggestions.nameSuggestions;
    
    // Update vision in context
    this.currentContext.vision = visionWithoutSuggestions;
    
    // Initialize _system if it doesn't exist
    if (!this.currentContext._system) {
      this.currentContext._system = {
        initialized: true,
        stage: 'initialized',
        projectType: null,
        timestamp: new Date().toISOString(),
        metadata: {},
        insights: {},
        vision: null,
        embeddings: {
          vision: [],
          technical: [],
          workflow: []
        },
        references: [],
        patterns: []
      };
    }

    // Update vision in _system
    this.currentContext._system.vision = visionWithoutSuggestions;
    this.currentContext._system.metadata = {
      ...this.currentContext._system.metadata,
      vision: visionWithoutSuggestions,
      nameSuggestions,
      lastUpdated: new Date().toISOString()
    };
    
    await this.saveContext();
  }

  async processResponse(promptId: string, response: string): Promise<void> {
    debug('ContextManager', 'Processing response:', { promptId, response });
    
    if (!this.currentContext) {
      throw new Error('No active project context');
    }

    // Initialize responses if they don't exist
    if (!this.currentContext._system.responses) {
      this.currentContext._system.responses = {};
    }

    // Store the response
    this.currentContext._system.responses[promptId] = {
      response,
      timestamp: new Date().toISOString()
    };

    await this.saveContext();
  }

  async processResponse(questionId: string, question: string, response: any): Promise<any> {
    try {
      // Handle both string and object responses
      const parsed = typeof response === 'string' ? 
        // Try to extract JSON from markdown code blocks
        response.match(/```json\n([\s\S]*?)\n```/)?.[1] || response :
        response;
        
      return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    } catch (error) {
      debug('ContextManager', 'Error parsing response:', error);
      // Return a basic metadata structure if parsing fails
      return {
        topics: [],
        entities: [],
        sentiment: 'neutral',
        confidence: 0
      };
    }
  }

  async getRelationshipGraph(): any {
    // Build a graph of relationships between different pieces of context
    const graph = {
      nodes: [],
      edges: []
    };

    // Add nodes for each major context section
    if (this.currentContext._system.insights) {
      graph.nodes.push({
        id: 'insights',
        type: 'insights',
        data: this.currentContext._system.insights
      });
    }

    // Add nodes for patterns
    this.currentContext._system.patterns.forEach((pattern: any) => {
      graph.nodes.push({
        id: `pattern_${pattern.name}`,
        type: 'pattern',
        data: pattern
      });
    });

    // Add nodes for references
    this.currentContext._system.references.forEach((ref: any, index: number) => {
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

  async updateFlowContext(flowContext: FlowContext): Promise<void> {
    debug('ContextManager', 'Updating flow context');

    try {
      // Store flow context
      this.flowContexts.set(flowContext.name, flowContext);

      // Update project context with flow metadata
      if (this.currentContext) {
        this.currentContext.metadata = {
          ...this.currentContext.metadata,
          flowState: flowContext.metadata.currentState,
          flowPatterns: flowContext.metadata.patterns,
          flowErgonomics: flowContext.metadata.ergonomics
        };
      }

      // Persist flow context
      await this.saveFlowContext(flowContext);

      debug('ContextManager', 'Flow context updated successfully');
    } catch (error) {
      debug('ContextManager', 'Error updating flow context:', error);
      throw error;
    }
  }

  private async saveFlowContext(flowContext: FlowContext): Promise<void> {
    const flowDir = path.join(this.contextDir, 'flow');
    await fs.mkdir(flowDir, { recursive: true });

    const filename = path.join(flowDir, `${flowContext.name}.json`);
    await fs.writeFile(filename, JSON.stringify(flowContext, null, 2));
  }

  async getFlowContext(name: string): Promise<FlowContext | undefined> {
    return this.flowContexts.get(name);
  }

  async getAllFlowContexts(): Promise<FlowContext[]> {
    return Array.from(this.flowContexts.values());
  }

  async updateProjectState(newState: string): Promise<void> {
    if (!this.currentContext) {
      throw new Error('No active context');
    }

    debug('ContextManager', 'Updating project state', { newState });

    this.currentContext.metadata = {
      ...this.currentContext.metadata,
      stage: newState,
      timestamp: new Date().toISOString()
    };

    await this.saveContext(this.currentContext);
  }

  private async generateChangeLog(
    component: string,
    changes: ContextChange[],
    metadata: any = {}
  ): Promise<ContextChangeLog> {
    return {
      id: `change_${Date.now()}`,
      timestamp: new Date().toISOString(),
      component,
      changes,
      metadata: {
        ...metadata,
        flowState: this.currentContext?.metadata?.stage || 'unknown'
      }
    };
  }

  private updateSemanticVersion(
    context: EnhancedProjectContext,
    changeType: 'major' | 'minor' | 'patch',
    description?: string
  ): void {
    const version = context.metadata.semanticVersion || { major: 0, minor: 0, patch: 0, timestamp: '' };
    
    switch (changeType) {
      case 'major':
        version.major++;
        version.minor = 0;
        version.patch = 0;
        break;
      case 'minor':
        version.minor++;
        version.patch = 0;
        break;
      case 'patch':
        version.patch++;
        break;
    }
    
    version.timestamp = new Date().toISOString();
    version.description = description;
    
    context.metadata.semanticVersion = version;
    context.metadata.lastUpdated = version.timestamp;
  }

  async updateContext(
    contextId: string,
    updates: Record<string, any>,
    options: {
      component: string;
      changeType: 'major' | 'minor' | 'patch';
      description?: string;
      metadata?: any;
    }
  ): Promise<void> {
    const context = this.contextCache.get(contextId) as EnhancedProjectContext;
    if (!context) {
      throw new Error(`Context not found: ${contextId}`);
    }

    const changes: ContextChange[] = [];
    
    // Track changes
    for (const [key, value] of Object.entries(updates)) {
      changes.push({
        field: key,
        previous: context[key],
        current: value,
        timestamp: new Date().toISOString()
      });
      context[key] = value;
    }

    // Generate change log
    const changeLog = await this.generateChangeLog(
      options.component,
      changes,
      options.metadata
    );

    // Update semantic version
    this.updateSemanticVersion(
      context,
      options.changeType,
      options.description
    );

    // Update context embeddings
    context.embeddings = await this.ai.generateContextEmbeddings(context);

    // Store change log
    if (!context.metadata.changeLogs) {
      context.metadata.changeLogs = [];
    }
    context.metadata.changeLogs.push(changeLog);

    // Update cache and persist
    this.contextCache.set(contextId, context);
    await this.persistContext(context);
  }

  private async persistContext(context: EnhancedProjectContext): Promise<void> {
    // Implement persistence logic here
  }

  async getVisionAnalysis(): Promise<VisionAnalysis | null> {
    if (!this.currentContext) {
      return null;
    }
    return this.currentContext.vision || null;
  }

  async updateVisionAnalysis(vision: VisionAnalysis): Promise<void> {
    if (!this.currentContext) {
      throw new Error('No active context');
    }
    
    this.currentContext.vision = vision;
    await this.saveContext();
    
    debug('ContextManager', 'Vision analysis updated');
  }

  async saveContext(): Promise<void> {
    if (!this.currentContext?.name) {
      debug('ContextManager', 'No context to save');
      return;
    }

    const contextPath = path.join(this.contextDir, `${this.currentContext.name}.json`);
    await fs.promises.writeFile(contextPath, JSON.stringify(this.currentContext, null, 2));
    debug('ContextManager', 'Context saved to:', contextPath);
  }
}