 import { ContextManager } from './context/context-manager';
import { PromptManager } from './prompts/prompt-manager';
import { ProjectInitialContext, VisionAnalysis } from '../types';
import { debug } from '../utils/debug';
import { ProjectType } from '../types/core/project';
import { Logger } from '../utils/logger';

export class ProjectManager {
  private logger: Logger;

  constructor(
    private contextManager: ContextManager,
    private promptManager: PromptManager
  ) {
    this.logger = new Logger();
    debug('ProjectManager', 'Initializing ProjectManager');
  }

  async detectProjectType(description: string): Promise<ProjectType> {
    debug('ProjectManager', 'Detecting project type');
    
    try {
      const projectType = await this.promptManager.generateProjectTypeAnalysis(description);
      await this.contextManager.updateProjectType(projectType);
      debug('ProjectManager', 'Project type detected:', projectType);
      return projectType;
    } catch (error) {
      debug('ProjectManager', 'Error detecting project type:', error);
      throw error;
    }
  }

  async analyzeVision(description: string): Promise<VisionAnalysis> {
    debug('ProjectManager', 'Analyzing project vision');
    
    try {
      const vision = await this.promptManager.generateVisionAnalysis(description);
      await this.contextManager.updateVisionAnalysis(vision);
      debug('ProjectManager', 'Vision analyzed:', vision);
      return vision;
    } catch (error) {
      debug('ProjectManager', 'Error analyzing vision:', error);
      throw error;
    }
  }

  async suggestProjectName(description: string): Promise<string> {
    debug('ProjectManager', 'Suggesting project name');

    // Get project insights for better name suggestions
    const projectType = await this.detectProjectType(description);
    const vision = await this.analyzeVision(description);
    const context = await this.contextManager.getCurrentContext();

    // Use combined context for name generation
    const suggestions = await this.promptManager.generateNameSuggestions(
      description,
      projectType,
      vision,
      context
    );

    debug('ProjectManager', 'Name suggestions generated:', suggestions);
    return suggestions[0] || 'project';
  }

  async createProject(name: string, description: string): Promise<void> {
    debug('ProjectManager', 'Creating project:', name);

    // Step 1: Initialize basic context
    await this.contextManager.initializeProject({ name, description });

    // Step 2: Detect project type and analyze vision
    const [projectType, vision] = await Promise.all([
      this.detectProjectType(description),
      this.analyzeVision(description)
    ]);

    // Step 3: Generate initial project structure
    const context = await this.contextManager.getCurrentContext();
    const structure = await this.promptManager.generateProjectStructure(context);
    await this.contextManager.updateProjectStructure(structure);

    debug('ProjectManager', 'Project created successfully');
  }

  async generateDocumentation(): Promise<string> {
    debug('ProjectManager', 'Generating project documentation');

    const context = await this.contextManager.getCurrentContext();
    
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
    return this.contextManager.getCurrentContext();
  }

  async getProjectType(): Promise<ProjectType | null> {
    const context = await this.getProjectContext();
    return context.type;
  }

  async getProjectVision(): Promise<VisionAnalysis | null> {
    const context = await this.getProjectContext();
    return context.vision;
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