// Move the contents of interactive-manager.ts here
// Update imports to use relative paths from new location

import { VertexAIClient } from '../../../core/client/vertex-ai';
import { db } from '../../../db/sqlite';
import { Logger } from '../../../utils/logger';
import { ProjectInitialContext, GeneratedPrompt, ProjectType } from '../../../types';
import { PromptManager } from '../../../core/prompts/prompt-manager';
import { DocumentationGenerator } from '../../../core/docs/documentation-generator';
import { debug, setDebugMode } from '../../../utils/debug';
import { spinner } from '../../../utils/spinner';
import chalk from 'chalk';
import { input, select, confirm } from '@inquirer/prompts';
import { ContextManager } from '../../../core/context/context-manager';
import { ProjectManager } from '../../../core/project-manager';
import { getInsightsPrompt } from '../../../core/prompts/templates/context/insights';
import { getContextualResponsePrompt } from '../../../core/prompts/templates/context/response';

const insightCategories = {
  innovative: [
    { key: 'technicalPatterns', label: 'Technical Patterns', required: true },
    { key: 'userNeeds', label: 'User Needs', required: true },
    { key: 'challenges', label: 'Challenges', required: true },
    { key: 'opportunities', label: 'Opportunities', required: true }
  ],
  iterative: [
    { key: 'technicalPatterns', label: 'Technical Patterns', required: true },
    { key: 'userNeeds', label: 'User Needs', required: true },
    { key: 'challenges', label: 'Challenges', required: true },
    { key: 'improvementOpportunities', label: 'Improvement Opportunities', required: true }
  ]
};

export class InteractiveManager {
  private ai: VertexAIClient;
  private promptManager: PromptManager;
  private contextManager: ContextManager;
  private projectManager: ProjectManager;
  private docGenerator: DocumentationGenerator;
  private logger: Logger;
  private currentContext: ProjectInitialContext | null = null;
  private currentPrompts: GeneratedPrompt[] = [];
  private requiredPrompts: GeneratedPrompt[] = [];
  private optionalPrompts: GeneratedPrompt[] = [];
  private initialized: boolean = false;

  constructor(ai: VertexAIClient, templatesDir: string, outputDir: string, debugMode = false) {
    debug('InteractiveManager', 'Constructor called with:', { templatesDir, outputDir, debugMode });
    
    setDebugMode(debugMode);
    
    debug('InteractiveManager', 'Initializing core services');
    this.logger = new Logger();
    this.ai = ai;
    this.contextManager = new ContextManager(ai);
    this.promptManager = new PromptManager(ai, this.contextManager);
    this.projectManager = new ProjectManager(this.contextManager, this.promptManager, ai);
    this.docGenerator = new DocumentationGenerator(ai, outputDir);
    
    spinner.setEnabled(true);
    
    debug('InteractiveManager', 'Constructor complete');
  }

  async initialize(): Promise<void> {
    debug('Initialize called, initialized status:', this.initialized);
    if (this.initialized) {
      debug('Already initialized, returning');
      return;
    }

    try {
      debug('Starting initialization');
      
      debug('Checking database initialization');
      if (db.isInitialized()) {
        this.logger.success('Database is ready');
      } else {
        debug('Database initialization failed');
        throw new Error('Database failed to initialize');
      }

      debug('Initializing documentation generator');
      await this.docGenerator.initialize();
      this.logger.success('Documentation generator is ready');

      this.initialized = true;
      debug('Initialization complete');
    } catch (error) {
      debug('Initialize', 'Error:', error);
      throw error;
    }
  }

  async handleCreate(description: string): Promise<boolean> {
    debug('handleCreate', 'Starting project creation');
    
    try {
      // Initialize empty project context
      const initialContext: ProjectInitialContext = {
        name: '',
        description,
        goals: [],
        type: null
      };
      
      // Initialize project in context manager
      await this.contextManager.initializeProject(initialContext);
      
      // Get name suggestions first
      const suggestions = await this.projectManager.suggestProjectName(description);
      
      // Show suggestions and get user input
      console.log('\n🎨 Here are some suggested names for your project:\n');
      suggestions.forEach((name, i) => {
        console.log(`${i + 1}. ${chalk.cyan(name)}`);
      });
      console.log(); // Add newline
      
      // Let user enter their name
      const finalName = await input({ message: "Enter your creation's name:" });
      
      // Create project with chosen name
      await this.projectManager.createProject(finalName, description);
      this.currentContext = await this.projectManager.getProjectContext();

      // Set project goals and handle prompts
      await this.setProjectGoals(description);
      
      return true;
    } catch (error) {
      debug('handleCreate', 'Error:', error);
      return false;
    }
  }

  private async startProjectCreation(name: string): Promise<void> {
    debug('startProjectCreation', 'Called with name:', name);
    spinner.start('thought', 'initializing project');
    
    try {
      this.currentContext = {
        name,
        description: '',
        goals: [],
        type: null
      };
      
      spinner.succeed('project initialized');
    } catch (error) {
      debug('startProjectCreation', 'Error:', error);
      spinner.fail('failed to initialize project');
      throw error;
    }
  }

  private async setProjectGoals(description: string): Promise<void> {
    debug('setProjectGoals', 'Called with description:', description);
    spinner.start('thought', 'analyzing project goals');
    
    try {
      if (!this.currentContext) {
        throw new Error('No active project context');
      }

      // Detect project type first
      const projectType = await this.projectManager.detectProjectType(description);
      await this.contextManager.updateProjectType(projectType);
      
      console.log('setProjectGoals', 'Project type detected:', projectType);
      
      // Analyze vision and update project structure
      const vision = await this.projectManager.analyzeProjectVision(description);
      await this.contextManager.updateProjectStructure(vision);
      
      spinner.succeed('project goals set');

      console.log('setProjectGoals', 'Project structure updated', vision);
      
      // Display project insights if available
      if (vision.insights) {
        this.displayInsights(vision.insights);
      }
      
      // Display project type
      this.displayProjectType(projectType);

      // Generate and handle initial prompts
      await this.handleInitialPrompts();
    } catch (error) {
      spinner.fail('failed to set project goals');
      throw error;
    }
  }

  private async handleInitialPrompts(): Promise<void> {
    debug('handleInitialPrompts', 'Starting initial prompts flow');
    
    try {
      // Get initial prompts
      const initialPrompts = await this.promptManager.generateInitialPrompts(this.currentContext);
      // console.log('handleInitialPrompts', 'Got initial prompts:', initialPrompts);
      
      if (!initialPrompts || initialPrompts.length === 0) {
        // console.log('handleInitialPrompts', 'No initial prompts generated');
        return;
      }
      
      this.currentPrompts = initialPrompts;
      
      // Separate required and optional prompts
      this.requiredPrompts = initialPrompts.filter(p => p.required);
      this.optionalPrompts = initialPrompts.filter(p => !p.required);
      
      debug('handleInitialPrompts', 'Required prompts:', this.requiredPrompts);
      debug('handleInitialPrompts', 'Optional prompts:', this.optionalPrompts);
      
      // Handle required prompts first
      for (const prompt of this.requiredPrompts) {
        const response = await input({
          message: prompt.question,
          validate: this.validate
        });
        await this.processUserResponse(prompt.id, prompt.question, response);
        
        // Update context after each response
        this.currentContext = await this.projectManager.getProjectContext();
      }
      
      // Ask if user wants to continue with optional prompts
      if (this.optionalPrompts.length > 0) {
        const continueOptional = await confirm({
          message: 'Would you like to answer some optional questions to enhance your project?'
        });
        
        if (continueOptional) {
          for (const prompt of this.optionalPrompts) {
            const response = await input({
              message: prompt.question,
              validate: this.validate
            });
            await this.processUserResponse(prompt.id, prompt.question, response);
            
            // Update context after each response
            this.currentContext = await this.projectManager.getProjectContext();
          }
        }
      }
      
      // Generate follow-up prompts based on all responses
      const followUpPrompts = await this.promptManager.generateFollowUpPrompts(this.currentContext);
      if (followUpPrompts.length > 0) {
        const continueFollowUp = await confirm({
          message: 'I have a few follow-up questions that might help clarify some details. Would you like to continue?'
        });
        
        if (continueFollowUp) {
          for (const prompt of followUpPrompts) {
            const response = await input({
              message: prompt.question,
              validate: this.validate
            });
            await this.processUserResponse(prompt.id, prompt.question, response);
            
            // Update context after each response
            this.currentContext = await this.projectManager.getProjectContext();
          }
        }
      }
      
      // Summarize the gathered information
      // console.log('\n🎯 Project Vision:');
      // console.log(this.currentContext);
      
    } catch (error) {
      debug('handleInitialPrompts', 'Error:', error);
      throw error;
    }
  }

  private validate(value: string): boolean | string {
    if (!value || value.trim().length === 0) {
      return 'Please provide a response';
    }
    return true;
  }

  private async processUserResponse(questionId: string, question: string, response: string) {
    debug('processUserResponse', 'Processing response for prompt:', questionId);

    try {
      if (!this.currentContext) {
        throw new Error('No active project context');
      }

      // Generate insights about the response with context
      const insightsResponse = await this.promptManager.generateResponseInsights(
        question, 
        response,
        this.currentContext
      );
      
      if (insightsResponse) {
        await this.contextManager.updateInsights({
          insights: insightsResponse.insights,
          summary: insightsResponse.summary,
          response // Include actual response
        });
      }

    } catch (error) {
      debug('processUserResponse', 'Error processing response:', error);
      // Continue even if insight processing fails
    }
  }

  private displayInsights(insights: any) {
    if (!insights) return;
    
    console.log(chalk.cyan('\n🔍 Project Insights:'));
    Object.entries(insights).forEach(([category, items]) => {
      if (Array.isArray(items) && items.length > 0) {
        console.log(chalk.bold(`\n${category}:`));
        items.forEach(item => console.log(chalk.dim(`• ${item}`)));
      }
    });
  }

  private displayProjectType(projectType: ProjectType) {
    console.log('\n🎯 Project Classification:');
    console.log(`\nType: ${projectType.primaryType}`);
    console.log(`Confidence: ${Math.round(projectType.confidence * 100)}%`);
    
    if (projectType.reasons?.length > 0) {
      console.log('\nKey Indicators:');
      projectType.reasons.forEach(reason => console.log(`- ${reason}`));
    }
    
    if (projectType.secondaryTypes?.length > 0) {
      console.log('\nSecondary Types:');
      projectType.secondaryTypes.forEach(type => console.log(`- ${type}`));
    }
  }

  private async handleDocGeneration(projectName: string, context: Record<string, string>): Promise<boolean> {
    try {
      spinner.start('thought', 'generating project documentation');
      
      // Use project manager to generate documentation
      const documentation = await this.projectManager.generateDocumentation(this.currentContext!);
      
      if (documentation) {
        spinner.succeed('documentation generated');
        console.log(chalk.cyan('\n📚 Generated Documentation:'));
        console.log(documentation);
        return true;
      }
      
      spinner.fail('failed to generate documentation');
      return false;
    } catch (error) {
      debug('handleDocGeneration', 'Error:', error);
      spinner.fail('failed to generate documentation');
      return false;
    }
  }
}
