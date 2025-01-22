 import { ContextManager } from './context/context-manager';
import { PromptManager } from './prompts/prompt-manager';
import { ProjectInitialContext, VisionAnalysis } from '../types';
import { debug } from '../utils/debug';
import { ProjectType } from '../types/core/project';
import { Logger } from '../utils/logger';
import { FlowManager } from './flow/flow-manager';

export class ProjectManager {
  private logger: Logger;
  private flowManager: FlowManager;

  constructor(
    private contextManager: ContextManager,
    private promptManager: PromptManager,
    private ai: VertexAIClient
  ) {
    this.logger = new Logger();
    this.flowManager = new FlowManager(ai, contextManager, promptManager);
    debug('ProjectManager', 'Initializing ProjectManager');
  }

  async detectProjectType(description: string): Promise<ProjectType> {
    debug('ProjectManager', 'Detecting project type');
    
    try {
      // First ensure we have vision analysis
      const vision = await this.contextManager.getVisionAnalysis();
      if (!vision) {
        debug('ProjectManager', 'No vision analysis found, generating...');
        await this.analyzeProjectVision(description);
      }
      
      // Get the vision analysis (now guaranteed to exist)
      const finalVision = await this.contextManager.getVisionAnalysis();
      if (!finalVision) {
        throw new Error('Failed to get or create vision analysis');
      }
      
      // Use vision analysis for project type detection
      const projectType = await this.promptManager.generateProjectTypeAnalysis(description, finalVision);
      await this.contextManager.updateProjectType(projectType);
      
      debug('ProjectManager', 'Project type detected:', projectType);
      return projectType;
    } catch (error) {
      debug('ProjectManager', 'Error detecting project type:', error);
      throw error;
    }
  }

  async analyzeProjectVision(description: string): Promise<VisionAnalysis> {
    debug('ProjectManager', 'Analyzing project vision');
    
    // Check if vision analysis already exists
    const existingVision = await this.contextManager.getVisionAnalysis();
    if (existingVision) {
      debug('ProjectManager', 'Using existing vision analysis');
      return existingVision;
    }

    // Generate new vision analysis
    const vision = await this.promptManager.generateVisionAnalysis(description);
    await this.contextManager.updateVisionAnalysis(vision);
    return vision;
  }

  async suggestProjectName(description: string): Promise<string[]> {
    debug('ProjectManager', 'Suggesting project name');

    // Try to get existing name suggestions from context
    const context = await this.contextManager.getContext();
    if (context?._system?.metadata?.nameSuggestions) {
      debug('ProjectManager', 'Using existing name suggestions');
      return context._system.metadata.nameSuggestions;
    }

    // If no suggestions exist yet, perform vision analysis
    debug('ProjectManager', 'Generating new name suggestions');
    const newVision = await this.analyzeProjectVision(description);
    return newVision.nameSuggestions || [];
  }

  async createProject(name: string, description: string): Promise<void> {
    debug('ProjectManager', 'Creating project:', name);

    // Step 1: Initialize project context
    await this.contextManager.initializeProject({ name, description });

    // Step 2: Analyze vision and set up project structure
    const vision = await this.analyzeProjectVision(description);

    // Step 3: Generate initial project structure
    await this.contextManager.updateProjectStructure(vision);
  }

  async initializeProject(description: string): Promise<void> {
    debug('ProjectManager', 'Initializing project');

    try {
      // Initialize project context
      const projectType = await this.detectProjectType(description);
      const vision = await this.analyzeProjectVision(description);
      const context = await this.contextManager.createInitialContext(description, projectType);

      // Initialize flow state
      await this.flowManager.initializeFlow(context);

      debug('ProjectManager', 'Project initialized successfully');
    } catch (error) {
      debug('ProjectManager', 'Error initializing project:', error);
      throw error;
    }
  }

  async transitionProjectState(newState: string): Promise<void> {
    debug('ProjectManager', 'Transitioning project state', { newState });

    try {
      // Update project context
      await this.contextManager.updateProjectState(newState);

      // Transition flow state
      await this.flowManager.transitionState(newState);

      // Analyze new flow state
      const flowAnalysis = await this.flowManager.analyzeFlowState();
      
      // Adapt project based on flow analysis
      if (flowAnalysis.momentum < 0.3) {
        await this.adaptProjectFlow('low_momentum');
      } else if (flowAnalysis.stability < 0.5) {
        await this.adaptProjectFlow('low_stability');
      }

      debug('ProjectManager', 'Project state transitioned successfully');
    } catch (error) {
      debug('ProjectManager', 'Error transitioning project state:', error);
      throw error;
    }
  }

  private async adaptProjectFlow(trigger: string): Promise<void> {
    debug('ProjectManager', 'Adapting project flow', { trigger });

    try {
      // Adapt flow state
      await this.flowManager.adaptFlow(trigger);

      // Get current flow state
      const flow = this.flowManager.getCurrentFlow();
      if (!flow) return;

      // Update project context with flow adaptations
      await this.contextManager.updateContext({
        metadata: {
          flowState: flow.metadata.currentState,
          flowAdaptations: flow.adaptations
        }
      });
    } catch (error) {
      debug('ProjectManager', 'Error adapting project flow:', error);
      throw error;
    }
  }

  async generateDocumentation(): Promise<string> {
    debug('ProjectManager', 'Generating project documentation');

    const context = await this.contextManager.getContext();
    
    // Step 1: Generate documentation plan
    const plan = await this.promptManager.generateDocumentationPlan(context);
    debug('ProjectManager', 'Documentation plan generated');

    // Step 2: Generate content based on plan
    const content = await this.promptManager.generateDocumentContent(
      context,
      plan,
      'project-documentation'
    );

    // Step 3: Save documentation to context
    await this.contextManager.updateDocumentation(content);
    debug('ProjectManager', 'Documentation generated and saved');

    return content;
  }

  async getProjectContext(): Promise<ProjectInitialContext> {
    debug('ProjectManager', 'Getting project context');
    const context = await this.contextManager.getContext();
    if (!context) {
      throw new Error('No active project context');
    }
    return context;
  }

  async getProjectType(): Promise<ProjectType | null> {
    debug('ProjectManager', 'Getting project type');
    const context = await this.contextManager.getContext();
    return context?._system?.projectType || null;
  }

  async getProjectVision(): Promise<VisionAnalysis | null> {
    debug('ProjectManager', 'Getting project vision');
    const context = await this.contextManager.getContext();
    return context?._system?.vision || null;
  }

  async updateContext(context: ProjectInitialContext): Promise<void> {
    debug('ProjectManager', 'Updating project context');

    try {
      // Update project type if changed
      if (context.type !== await this.getProjectType()) {
        await this.contextManager.updateProjectType(context.type);
      }

      // Update vision if changed
      if (context.vision !== await this.getProjectVision()) {
        await this.contextManager.updateVisionAnalysis(context.vision);
      }

      // Update other project metadata
      await this.contextManager.updateProjectMetadata({
        name: context.name,
        description: context.description,
        goals: context.goals
      });

      debug('ProjectManager', 'Project context updated successfully');
    } catch (error) {
      debug('ProjectManager', 'Error updating project context:', error);
      throw error;
    }
  }
}