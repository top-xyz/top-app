import { VertexAIClient } from '../../utils/vertex-ai';
import { db } from '../../modules/db/sqlite';
import { Logger } from '../../utils/logger';
import { ProjectInitialContext, GeneratedPrompt } from '../../types';
import { PromptManager } from '../prompts/prompt-manager';
import { DocumentationGenerator } from '../docs/documentation-generator';
import { debug, setDebugMode } from '../../utils/debug';
import ora, { Ora } from 'ora';
import chalk from 'chalk';

export class InteractiveManager {
  private ai: VertexAIClient;
  private promptManager: PromptManager;
  private docGenerator: DocumentationGenerator;
  private spinner: Ora;
  private logger: Logger;
  private currentContext: ProjectInitialContext | null = null;
  private currentPrompts: GeneratedPrompt[] = [];
  private requiredPrompts: GeneratedPrompt[] = [];
  private optionalPrompts: GeneratedPrompt[] = [];
  private selectedTemplates: string[] = [];
  private initialized: boolean = false;
  private currentTemplateState: string[] = [];

  constructor(templatesDir: string, outputDir: string, debugMode = false) {
    debug('InteractiveManager', 'Constructor called with:', { templatesDir, outputDir, debugMode });
    
    // Set debug mode from parameter
    setDebugMode(debugMode);
    
    debug('InteractiveManager', 'Initializing core services');
    this.logger = new Logger();
    this.ai = new VertexAIClient();
    this.promptManager = new PromptManager();
    this.docGenerator = new DocumentationGenerator(templatesDir, outputDir);
    
    debug('InteractiveManager', 'Creating spinner');
    this.spinner = ora({
      spinner: 'dots',
      color: 'cyan',
      text: 'Thinking...'
    });
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
      console.log(chalk.cyan('\n🔧 Initializing services...\n'));
      
      debug('Checking VertexAI initialization');
      if (this.ai.isInitialized()) {
        this.logger.success('VertexAI client is ready');
      } else {
        debug('VertexAI initialization failed');
        throw new Error('VertexAI client failed to initialize');
      }

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
      console.log(); // Add a blank line after initialization
    } catch (error) {
      debug('Initialization failed:', error);
      this.logger.error('Initialization failed:', error);
      throw error;
    }
  }

  async startProjectCreation(name: string): Promise<void> {
    debug('startProjectCreation called with name:', name);
    try {
      if (!this.initialized) {
        debug('Not initialized, calling initialize');
        await this.initialize();
      }
      
      debug('Starting project creation');
      this.spinner.start('Setting up your project...');
      
      debug('Creating initial context');
      this.currentContext = {
        name,
        goals: '',
        responses: {},
        stage: 'initial'
      };
      debug('Current context created:', this.currentContext);
      
      this.spinner.succeed('Project created successfully!');
      
      // Prompt for goals
      debug('Displaying goals prompt');
      console.log(chalk.cyan('\n🎯 What are the main goals of ' + chalk.bold(name) + '?\n'));
      console.log(chalk.gray('Think about what you want to achieve with this project.\n'));
    } catch (error) {
      debug('Error in startProjectCreation:', error);
      this.spinner.fail('Failed to create project');
      throw error;
    }
  }

  async setProjectGoals(goals: string): Promise<void> {
    debug('setProjectGoals called with:', goals);
    if (!this.currentContext) {
      debug('No active project found');
      throw new Error('No active project');
    }

    try {
      debug('Setting project goals');
      this.spinner.start('Processing project goals...');
      this.currentContext.goals = goals;
      this.currentContext.stage = 'detailed';
      debug('Updated context:', this.currentContext);
      
      debug('Generating initial prompts');
      this.spinner.text = 'Generating key questions...';
      const { required, optional } = await this.promptManager.generateInitialPrompts(this.currentContext);
      
      debug('Setting prompts:', { required, optional });
      this.requiredPrompts = required;
      this.optionalPrompts = optional;
      this.currentPrompts = [...required];
      
      this.spinner.succeed('Ready to explore project details');
      
      // Display first prompt
      if (this.currentPrompts.length > 0) {
        const firstPrompt = this.currentPrompts[0];
        debug('Displaying first prompt:', firstPrompt);
        console.log(chalk.yellow(`\n❓ ${firstPrompt.question}\n`));
      } else {
        debug('No prompts available to display');
      }

      debug('setProjectGoals complete');
    } catch (error) {
      debug('Error in setProjectGoals:', error);
      this.spinner.fail('Failed to process project goals');
      throw error;
    }
  }

  async handleUserInput(input: string, stage: string): Promise<{
    response: string;
    suggestions: string[];
    nextStage?: string;
  }> {
    debug('InteractiveManager', `Handling user input for stage: ${stage}, input: ${input}`);
    if (!this.currentContext) {
      throw new Error('No active project');
    }

    try {
      this.spinner.start('Processing your input...');

      switch (stage) {
        case 'required_prompts': {
          debug('InteractiveManager', 'Handling required prompts');
          const result = await this.handleRequiredPrompts(input);
          this.spinner.stop();
          return result;
        }

        case 'optional_prompts': {
          debug('InteractiveManager', 'Handling optional prompts');
          const result = await this.handleOptionalPrompts(input);
          this.spinner.stop();
          return result;
        }

        case 'template_selection': {
          debug('InteractiveManager', 'Handling template selection');
          const result = await this.handleTemplateSelection(input);
          this.spinner.stop();
          return result;
        }

        case 'generating': {
          debug('InteractiveManager', 'Handling generation');
          const result = await this.handleGeneration(input);
          this.spinner.stop();
          return result;
        }

        default:
          this.spinner.stop();
          return {
            response: 'I understand. What would you like to do next?',
            suggestions: ['Generate knowledge base', 'Continue with more details', 'Review current plan'],
            nextStage: stage
          };
      }
    } catch (error) {
      debug('InteractiveManager', 'Error in handleUserInput:', error);
      this.spinner.fail('Error processing input');
      throw error;
    }
  }

  private async handleRequiredPrompts(input: string): Promise<{
    response: string;
    suggestions: string[];
    nextStage?: string;
  }> {
    debug('InteractiveManager', 'Current prompts:', this.currentPrompts);
    
    // Handle current required prompt
    const currentPrompt = this.currentPrompts[0];
    if (currentPrompt && input) {
      debug('InteractiveManager', `Storing response for prompt ${currentPrompt.id}`);
      this.currentContext!.responses[currentPrompt.id] = input;
      this.currentPrompts.shift();
    }

    // If we have more required prompts, show the next one
    if (this.currentPrompts.length > 0) {
      const nextPrompt = this.currentPrompts[0];
      const remainingCount = this.currentPrompts.length;
      debug('InteractiveManager', `Next prompt: ${nextPrompt.question}, ${remainingCount} remaining`);
      return {
        response: `Thanks! Let's continue with the next required question (${this.requiredPrompts.length - remainingCount + 1}/${this.requiredPrompts.length}):`,
        suggestions: [nextPrompt.question],
        nextStage: 'required_prompts'
      };
    }

    // All required prompts completed
    debug('InteractiveManager', 'All required prompts completed');
    return {
      response: 'Great! I have enough information to start. Would you like to:',
      suggestions: [
        'Generate knowledge base now',
        'Continue with optional prompts to further refine the vision'
      ],
      nextStage: 'optional_prompts'
    };
  }

  private async handleOptionalPrompts(input: string): Promise<{
    response: string;
    suggestions: string[];
    nextStage?: string;
  }> {
    debug('InteractiveManager', 'Handling optional prompts with input:', input);

    if (input.toLowerCase().includes('generate')) {
      debug('InteractiveManager', 'User wants to generate documentation');
      return {
        response: 'Please select which types of documentation to generate:',
        suggestions: [
          '[x] engineering - Technical documentation',
          '[x] design - Design documentation',
          '[x] marketing - Marketing materials',
          '[x] sales - Sales collateral',
          '[x] brainstorm - Ideation and exploration',
          '✓ Confirm selection'
        ],
        nextStage: 'template_selection'
      };
    }

    if (input.toLowerCase().includes('continue')) {
      debug('InteractiveManager', 'User wants to continue with optional prompts');
      // Generate follow-up prompts based on all previous responses
      const followUps = await this.promptManager.generateFollowUpPrompts(this.currentContext!);
      
      if (followUps.length > 0) {
        const nextPrompt = followUps[0];
        this.optionalPrompts = followUps.slice(1);
        return {
          response: 'Here\'s an optional question to help refine the vision:',
          suggestions: [nextPrompt.question],
          nextStage: 'optional_prompts'
        };
      }
    }

    // If no specific command or no more optional prompts
    debug('InteractiveManager', 'Moving to template selection');
    return {
      response: 'Please select which types of documentation to generate:',
      suggestions: [
        '[x] engineering - Technical documentation',
        '[x] design - Design documentation',
        '[x] marketing - Marketing materials',
        '[x] sales - Sales collateral',
        '[x] brainstorm - Ideation and exploration',
        '✓ Confirm selection'
      ],
      nextStage: 'template_selection'
    };
  }

  private async handleTemplateSelection(input: string): Promise<{
    response: string;
    suggestions: string[];
    nextStage?: string;
  }> {
    debug('InteractiveManager', 'Handling template selection with input:', input);
    
    if (input.toLowerCase().includes('confirm')) {
      // Process selected templates
      const selectedTypes = ['engineering', 'design', 'marketing', 'sales', 'brainstorm']
        .filter(type => this.currentTemplateState?.includes(type));
      
      debug('InteractiveManager', 'Selected templates:', selectedTypes);
      this.selectedTemplates = selectedTypes;

      return {
        response: `Selected templates: ${selectedTypes.join(', ')}. Ready to generate your knowledge base.`,
        suggestions: ['Start generation'],
        nextStage: 'generating'
      };
    }

    // Toggle template selection
    const match = input.match(/\[([ x])\] (\w+)/);
    if (match) {
      const [_, checked, type] = match;
      if (!this.currentTemplateState) {
        this.currentTemplateState = ['engineering', 'design', 'marketing', 'sales', 'brainstorm'];
      }

      if (checked === 'x') {
        this.currentTemplateState = this.currentTemplateState.filter(t => t !== type);
      } else {
        this.currentTemplateState.push(type);
      }

      return {
        response: 'Select or deselect templates (press ✓ when done):',
        suggestions: [
          'engineering', 'design', 'marketing', 'sales', 'brainstorm'
        ].map(t => `[${this.currentTemplateState?.includes(t) ? 'x' : ' '}] ${t} - ${this.getTemplateDescription(t)}`).concat(['✓ Confirm selection']),
        nextStage: 'template_selection'
      };
    }

    // Initial template selection state
    this.currentTemplateState = ['engineering', 'design', 'marketing', 'sales', 'brainstorm'];
    return {
      response: 'Select or deselect templates (press ✓ when done):',
      suggestions: [
        'engineering', 'design', 'marketing', 'sales', 'brainstorm'
      ].map(t => `[${this.currentTemplateState?.includes(t) ? 'x' : ' '}] ${t} - ${this.getTemplateDescription(t)}`).concat(['✓ Confirm selection']),
      nextStage: 'template_selection'
    };
  }

  private getTemplateDescription(type: string): string {
    const descriptions: Record<string, string> = {
      'engineering': 'Technical documentation',
      'design': 'Design documentation',
      'marketing': 'Marketing materials',
      'sales': 'Sales collateral',
      'brainstorm': 'Ideation and exploration'
    };
    return descriptions[type] || type;
  }

  private async handleGeneration(input: string): Promise<{
    response: string;
    suggestions: string[];
    nextStage?: string;
  }> {
    debug('InteractiveManager', 'Handling generation with input:', input);
    
    if (input.toLowerCase().includes('different')) {
      debug('InteractiveManager', 'User wants to select different templates');
      return {
        response: 'Select or deselect templates (press ✓ when done):',
        suggestions: [
          'engineering', 'design', 'marketing', 'sales', 'brainstorm'
        ].map(t => `[${this.currentTemplateState?.includes(t) ? 'x' : ' '}] ${t} - ${this.getTemplateDescription(t)}`).concat(['✓ Confirm selection']),
        nextStage: 'template_selection'
      };
    }
    
    if (!input || input.toLowerCase().includes('start')) {
      debug('InteractiveManager', 'Starting generation');
      this.spinner.start('Generating knowledge base...');
      
      try {
        const files = await this.docGenerator.generateDocumentation(
          this.currentContext!,
          this.selectedTemplates
        );

        return {
          response: `Knowledge base generation complete! Generated files:\n${files.join('\n')}`,
          suggestions: [],
          nextStage: 'complete'
        };
      } catch (error) {
        debug('InteractiveManager', 'Error generating documentation:', error);
        return {
          response: 'There was an error generating the documentation. Would you like to:',
          suggestions: ['Select different templates', 'Try again'],
          nextStage: 'generating'
        };
      }
    }

    return {
      response: 'Would you like to proceed with generation?',
      suggestions: ['Start generation', 'Select different templates'],
      nextStage: 'generating'
    };
  }

  private async generateProjectSummary(): Promise<string> {
    debug('generateProjectSummary called');
    const prompt = await this.promptManager.generateSummaryPrompt(this.currentContext!);
    debug('Generated summary prompt:', prompt);
    return await this.ai.generateContent({
      prompt,
      context: this.currentContext?.name || '',  // Fix the type error
      type: 'summary'
    });
  }
} 