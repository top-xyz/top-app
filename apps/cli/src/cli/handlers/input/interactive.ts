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
import { input, select } from '@inquirer/prompts';
import { ContextManager } from '../../../core/context/context-manager';
import { ProjectManager } from '../../../core/project-manager';

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

  async handleCreate(description: string, name?: string): Promise<boolean> {
    debug('handleCreate', 'Called with:', { description, name });
    
    try {
      if (!name) {
        name = await this.projectManager.suggestProjectName(description);
      }
      
      await this.startProjectCreation(name);
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
      
      // Create project using ProjectManager
      await this.projectManager.createProject(this.currentContext.name, description);
      
      // Get updated context
      this.currentContext = await this.projectManager.getProjectContext();
      
      spinner.succeed('project goals set');
      
      // Display project insights
      const insights = await this.projectManager.getProjectInsights();
      this.displayInsights(insights);
      
      // Display project type
      const projectType = this.currentContext.type;
      if (projectType) {
        this.displayProjectType(projectType);
      }

      // Generate and handle initial prompts
      await this.handleInitialPrompts();
    } catch (error) {
      debug('setProjectGoals', 'Error:', error);
      spinner.fail('failed to set project goals');
      throw error;
    }
  }

  private async handleInitialPrompts(): Promise<void> {
    debug('handleInitialPrompts', 'Generating initial prompts');
    spinner.start('thought', 'generating initial questions');

    try {
      if (!this.currentContext) {
        throw new Error('No active project context');
      }

      // Get initial prompts
      const prompts = await this.promptManager.generateInitialPrompts(this.currentContext);
      spinner.succeed('initial questions ready');

      // Process each prompt
      for (const prompt of prompts) {
        // Get user response
        const response = await input({
          message: prompt,
          validate: (value) => value.length > 0 ? true : 'Please provide a response'
        });

        // Process response and update context
        await this.processUserResponse(prompt, response);

        // Get follow-up questions based on response
        const followUps = await this.promptManager.generateFollowUpPrompts(
          this.currentContext!,
          [response]
        );

        // Process follow-up questions
        for (const followUp of followUps) {
          const followUpResponse = await input({
            message: followUp,
            validate: (value) => value.length > 0 ? true : 'Please provide a response'
          });

          await this.processUserResponse(followUp, followUpResponse);
        }
      }

      // Update final context after all responses
      this.currentContext = await this.projectManager.getProjectContext();
      
      debug('handleInitialPrompts', 'All prompts processed');
    } catch (error) {
      debug('handleInitialPrompts', 'Error:', error);
      spinner.fail('failed to process initial questions');
      throw error;
    }
  }

  private async processUserResponse(prompt: string, response: string): Promise<void> {
    debug('processUserResponse', 'Processing response for prompt:', prompt);

    try {
      // Store response in context
      await this.contextManager.processResponse(prompt, response);

      // Get updated context
      this.currentContext = await this.contextManager.getCurrentContext();

      // Generate insights from response
      const insights = await this.promptManager.generateResponseInsights(
        this.currentContext,
        prompt,
        response
      );

      // Update context with new insights
      await this.contextManager.updateInsights(insights);

      // Update project context if needed
      await this.projectManager.updateContext(this.currentContext);

      debug('processUserResponse', 'Response processed successfully');
    } catch (error) {
      debug('processUserResponse', 'Error processing response:', error);
      throw error;
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
    console.log(chalk.cyan('\n🎯 Project Classification:'));
    console.log(chalk.bold(`\nType: ${projectType.primaryType}`));
    console.log(chalk.dim('Confidence: ' + Math.round(projectType.confidence * 100) + '%'));
    
    if (projectType.reasons.length > 0) {
      console.log(chalk.cyan('\nKey Characteristics:'));
      projectType.reasons.forEach(reason => {
        console.log(chalk.dim(`• ${reason}`));
      });
    }
    
    if (projectType.secondaryTypes.length > 0) {
      console.log(chalk.cyan('\nSecondary Aspects:'));
      projectType.secondaryTypes.forEach(type => {
        console.log(chalk.dim(`• ${type}`));
      });
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
