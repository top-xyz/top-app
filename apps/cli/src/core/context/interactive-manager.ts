import { VertexAIClient } from '../../utils/vertex-ai';
import { db } from '../../modules/db/sqlite';
import { Logger } from '../../utils/logger';
import { ProjectInitialContext, GeneratedPrompt, ProjectType } from '../../types';
import { PromptManager } from '../prompts/prompt-manager';
import { DocumentationGenerator } from '../docs/documentation-generator';
import { debug, setDebugMode } from '../../utils/debug';
import ora, { Ora } from 'ora';
import chalk from 'chalk';
import { input, select } from '@inquirer/prompts';
import { ContextManager } from './context-manager';
import { TemplateManager } from '../templates/template-manager';
import { detectProjectType } from '../prompts/templates/project-types/detector';
import { getNameSuggestionsPrompt } from '../prompts/templates/name-suggestions';
import { getInsightsPrompt } from '../prompts/templates/insights';
import { getContextualResponsePrompt } from '../prompts/templates/response';

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
  private contextManager: ContextManager;
  private templateManager: TemplateManager;

  constructor(templatesDir: string, outputDir: string, debugMode = false) {
    debug('InteractiveManager', 'Constructor called with:', { templatesDir, outputDir, debugMode });
    
    // Set debug mode from parameter
    setDebugMode(debugMode);
    
    debug('InteractiveManager', 'Initializing core services');
    this.logger = new Logger();
    this.ai = new VertexAIClient();
    this.contextManager = new ContextManager(this.ai);
    this.promptManager = new PromptManager(this.contextManager);
    this.templateManager = new TemplateManager(templatesDir);
    this.docGenerator = new DocumentationGenerator();
    
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
      
      debug('Checking database initialization');
      if (db.isInitialized()) {
        this.logger.success('Database is ready');
      } else {
        debug('Database initialization failed');
        throw new Error('Database failed to initialize');
      }

      debug('Initializing template manager');
      await this.templateManager.initialize();
      this.logger.success('Template manager is ready');

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

  async handleCreate(description: string): Promise<boolean> {
    try {
      debug('InteractiveManager', 'Starting project creation with description:', description);

      // Analyze description and suggest project names
      const spinner = ora({
        text: chalk.dim('Analyzing your project vision...'),
        spinner: 'dots'
      }).start();

      const nameResponse = await this.ai.generateContent({
        prompt: getNameSuggestionsPrompt(description),
        temperature: 0.9,  // Higher temperature for more creative names
        maxTokens: 256    // Short responses for name suggestions
      });

      debug('InteractiveManager', 'Raw name response:', nameResponse);
      spinner.stop();

      let suggestions = [];
      if (Array.isArray(nameResponse)) {
        suggestions = nameResponse;
      } else {
        debug('InteractiveManager', 'Name response is not an array, attempting to parse');
        try {
          suggestions = JSON.parse(nameResponse);
        } catch (e) {
          debug('InteractiveManager', 'Error parsing name suggestions:', e);
          this.logger.error('Failed to parse name suggestions, but continuing with project creation');
        }
      }

      if (!Array.isArray(suggestions) || suggestions.length === 0) {
        debug('InteractiveManager', 'No valid suggestions generated, using defaults');
        suggestions = [
          { name: 'glow', reason: 'Reflects the ethereal glow UI motif' },
          { name: 'wish', reason: 'Direct reference to the wish list functionality' },
          { name: 'peek', reason: 'Suggests browsing and discovering items' }
        ];
      }

      if (suggestions.length > 0) {
        console.log('\n🎨 Based on your vision, here are some suggested project names:\n');
        suggestions.forEach((s: any) => {
          console.log(chalk.cyan(`• ${s.name}`));
          console.log(chalk.dim(`  ${s.reason}\n`));
        });
      }

      // Get project name
      const projectName = await input({
        message: chalk.cyan('What would you like to name your project?'),
        validate: (value) => value.trim().length > 0 ? true : 'Project name cannot be empty'
      });

      // Initialize the current context
      this.currentContext = {
        name: projectName,
        goals: description,
        responses: {},
        stage: 'initial'
      };

      // Detect project type first
      const projectType = await detectProjectType(this.ai, projectName, description);
      await this.displayProjectType(projectType);
      debug('InteractiveManager', 'Detected project type:', projectType);

      try {
        // Initialize project with type
        debug('InteractiveManager', 'Initializing project with:', { projectName, description, type: projectType.type });
        await this.contextManager.initializeProject(projectName, description, projectType.type);
        debug('InteractiveManager', 'Project initialized successfully');
      } catch (error) {
        debug('InteractiveManager', 'Error initializing project:', error);
        this.logger.error('Failed to initialize project:', error);
        return false;
      }
      
      // Process description to extract initial insights
      spinner.start(chalk.dim('Processing your project vision...'));
      
      const insights = await this.ai.generateContent({
        prompt: getInsightsPrompt(description),
        type: 'structured'  // Request structured JSON response
      });

      spinner.stop();

      try {
        let parsedInsights;
        if (typeof insights === 'object') {
          parsedInsights = insights;
        } else {
          // If we got a string, try to parse it
          const cleanedInsights = insights
            .replace(/^```json\n?|\n?```$/g, '')  // Remove code blocks
            .replace(/[\u201C\u201D]/g, '"')      // Replace curly quotes
            .replace(/[\u2018\u2019]/g, "'")      // Replace curly apostrophes
            .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Add quotes to unquoted keys
            .replace(/:\s*'([^']*)'/g, ':"$1"')   // Replace single quotes with double quotes
            .replace(/,(\s*[}\]])/g, '$1')        // Remove trailing commas
            .replace(/\n/g, ' ')                  // Remove newlines
            .replace(/\s+/g, ' ')                 // Normalize whitespace
            .trim();                              // Remove extra whitespace
          
          try {
            parsedInsights = JSON.parse(cleanedInsights);
          } catch (parseError) {
            debug('InteractiveManager', 'Error parsing insights:', parseError);
            // Use a default structure if parsing fails
            parsedInsights = {
              technicalPatterns: [],
              userNeeds: [],
              challenges: [],
              opportunities: []
            };
          }
        }
        
        await this.contextManager.addInsights(parsedInsights);
        
        this.displayInsights(parsedInsights);
        
        // Generate initial prompts based on project type
        const { required, optional } = await this.promptManager.generateInitialPrompts({
          name: projectName,
          goals: description,
          responses: {},
          stage: 'initial'
        });

        this.requiredPrompts = required;
        this.optionalPrompts = optional;
        this.currentPrompts = [...required];

        console.log(chalk.green('\n✅ Project setup complete! Ready to explore project details.\n'));
        
        // Start the prompting flow with empty input to get first question
        const firstPrompt = await this.handleRequiredPrompts('');
        console.log('\n' + (firstPrompt.response || ''));  // Only print response if it exists
        if (firstPrompt.suggestions?.length > 0) {
          console.log(chalk.dim('\nQuestion:'), firstPrompt.suggestions[0]);
        }

        return true;

      } catch (e) {
        debug('InteractiveManager', 'Error processing insights:', e);
        debug('InteractiveManager', 'Raw insights response:', insights);
        this.logger.error('Failed to process project insights:', e);
        return false;
      }

    } catch (error) {
      debug('InteractiveManager', 'Error in handleCreate:', error);
      this.logger.error('An error occurred during project creation:', error);
      return false;
    }
  }

  async handleCreateWithName(name: string, description: string): Promise<boolean> {
    try {
      debug('InteractiveManager', 'Starting project creation with name and description:', { name, description });

      // Initialize the current context
      this.currentContext = {
        name,
        goals: description,
        responses: {},
        stage: 'initial'
      };

      // Detect project type first
      const projectType = await detectProjectType(this.ai, name, description);
      await this.displayProjectType(projectType);
      debug('InteractiveManager', 'Detected project type:', projectType);

      try {
        // Initialize project with type
        debug('InteractiveManager', 'Initializing project with:', { name, description, type: projectType.type });
        await this.contextManager.initializeProject(name, description, projectType.type);
        debug('InteractiveManager', 'Project initialized successfully');
      } catch (error) {
        debug('InteractiveManager', 'Error initializing project:', error);
        this.logger.error('Failed to initialize project:', error);
        return false;
      }
      
      // Process description to extract initial insights
      const spinner = ora({
        text: chalk.dim('Processing your project vision...'),
        spinner: 'dots'
      }).start();
      
      const insights = await this.ai.generateContent({
        prompt: getInsightsPrompt(description)
      });

      spinner.stop();

      try {
        const cleanedInsights = insights
          .replace(/^```json\n?|\n?```$/g, '')  // Remove code blocks
          .replace(/[\u201C\u201D]/g, '"')      // Replace curly quotes
          .replace(/[\u2018\u2019]/g, "'")      // Replace curly apostrophes
          .replace(/\n\s*(["}])/g, '$1')        // Remove newlines before closing brackets
          .replace(/,(\s*[}\]])/g, '$1')        // Remove trailing commas
          .trim();                              // Remove extra whitespace
        
        const parsedInsights = JSON.parse(cleanedInsights);
        await this.contextManager.addInsights(parsedInsights);
        
        this.displayInsights(parsedInsights);
        
        // Generate initial prompts based on project type
        const { required, optional } = await this.promptManager.generateInitialPrompts({
          name,
          goals: description,
          responses: {},
          stage: 'initial'
        });

        this.requiredPrompts = required;
        this.optionalPrompts = optional;
        this.currentPrompts = [...required];

        console.log(chalk.green('\n✅ Project setup complete! Ready to explore project details.\n'));
        
        // Start the prompting flow
        const firstPrompt = await this.handleRequiredPrompts('');
        console.log('\n' + chalk.cyan(firstPrompt.response));
        if (firstPrompt.suggestions.length > 0) {
          console.log(chalk.dim('\nQuestion:'), firstPrompt.suggestions[0]);
        }

        return true;

      } catch (e) {
        debug('InteractiveManager', 'Error processing insights:', e);
        debug('InteractiveManager', 'Raw insights response:', insights);
        this.logger.error('Failed to process project insights:', e);
        return false;
      }

    } catch (error) {
      debug('InteractiveManager', 'Error in handleCreateWithName:', error);
      this.logger.error('An error occurred during project creation:', error);
      return false;
    }
  }

  private displayInsights(insights: any) {
    const projectType = this.contextManager.getSystemContext()?.projectType || 'innovative';
    const categories = insightCategories[projectType] || insightCategories.innovative;

    console.log('\n🔍 Here\'s what I understand about your project:\n');

    for (const category of categories) {
      const items = insights[category.key];
      if (Array.isArray(items) && items.length > 0) {
        console.log(`${category.label}:`);
        items.forEach((item: string) => console.log(`• ${item}`));
        console.log('');
      } else if (category.required) {
        console.log(`${category.label}:`);
        console.log(`• No ${category.label.toLowerCase()} identified yet`);
        console.log('');
      }
    }
  }

  private async displayProjectType(projectType: ProjectType) {
    console.log('\n🎯 Project Type Analysis:\n');
    
    console.log(`Type: ${projectType.type}`);
    console.log(`Description: ${projectType.description}\n`);

    if (projectType.features?.length) {
      console.log('Key Features:');
      projectType.features.forEach(feature => console.log(`• ${feature}`));
      console.log('');
    }

    if (projectType.suggestedTechnologies?.length) {
      console.log('Suggested Technologies:');
      projectType.suggestedTechnologies.forEach(tech => console.log(`• ${tech}`));
      console.log('');
    }

    if (projectType.commonPatterns?.length) {
      console.log('Common Patterns:');
      projectType.commonPatterns.forEach(pattern => console.log(`• ${pattern}`));
      console.log('');
    }
  }

  private async handleTemplateSelection(): Promise<boolean> {
    try {
      const templates = await this.templateManager.getTemplates();
      const choices = templates.map(t => ({
        message: `${t.type} - ${t.description}`,
        value: t.type
      }));

      console.log('\n📝 Let\'s select documentation templates for your project:\n');
      
      const selected = await input({
        message: 'Toggle template (press ✓ when done):',
        validate: (value) => {
          if (value.toLowerCase() === '✓') return true;
          if (!choices.find(c => c.value === value)) {
            return 'Please enter a valid template name or ✓ to confirm';
          }
          return true;
        }
      });

      if (selected.toLowerCase() === '✓') {
        const spinner = ora({
          text: chalk.dim('Generating documentation...'),
          spinner: 'dots'
        }).start();

        await this.docGenerator.generateDocumentation(this.contextManager.getContext());
        spinner.stop();
        return true;
      }

      return await this.handleTemplateSelection();

    } catch (error) {
      debug('InteractiveManager', 'Error in handleTemplateSelection:', error);
      return false;
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
          const result = await this.handleTemplateSelection();
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
    
    // If we have input but no current prompts, move to generation
    if (input && this.currentPrompts.length === 0) {
      return {
        response: 'Base context is ready!',
        suggestions: [],
        nextStage: 'generating'
      };
    }
    
    // Handle current required prompt
    const currentPrompt = this.currentPrompts[0];
    if (currentPrompt && input) {
      debug('InteractiveManager', `Storing response for prompt ${currentPrompt.id}`);
      this.currentContext!.responses[currentPrompt.id] = input;
      
      // Generate contextual response
      this.spinner.start('Processing your response...');
      const contextualResponse = await this.ai.generateContent({
        prompt: getContextualResponsePrompt(input, currentPrompt.question),
        type: 'response'
      });
      this.spinner.stop();
      
      this.currentPrompts.shift();
      
      // If we have more required prompts, show the next one
      if (this.currentPrompts.length > 0) {
        const nextPrompt = this.currentPrompts[0];
        debug('InteractiveManager', `Next prompt: ${nextPrompt.question}`);
        
        return {
          response: contextualResponse,
          suggestions: [nextPrompt.question],
          nextStage: 'required_prompts'
        };
      }

      // All required prompts completed - show selection prompt
      return {
        response: contextualResponse + '\n\nBase context is ready!',
        suggestions: [],
        nextStage: 'generating'
      };
    }

    // Initial state or no input - show first prompt
    if (this.currentPrompts.length > 0) {
      const nextPrompt = this.currentPrompts[0];
      
      // Skip showing the initial message if we have input
      if (input) {
        return {
          response: '',
          suggestions: [nextPrompt.question],
          nextStage: 'required_prompts'
        };
      }
      
      // Show initial message only when starting prompts
      return {
        response: "Let's start with the essential questions:",
        suggestions: [nextPrompt.question],
        nextStage: 'required_prompts'
      };
    }

    // No more prompts - show selection prompt
    return {
      response: 'Base context is ready!',
      suggestions: [],
      nextStage: 'generating'
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

  private async handleGeneration(input: string): Promise<{
    response: string;
    suggestions: string[];
    nextStage?: string;
  }> {
    debug('InteractiveManager', 'Handling generation with input:', input);
    
    try {
      // Get the full context from the context manager
      const context = this.contextManager.getContext();
      debug('InteractiveManager', 'Context for documentation:', context);

      // Validate context has required fields
      if (!context.metadata?.name || !context.metadata?.goals) {
        throw new Error('Missing required context fields: name and goals');
      }

      // Generate a final summary before documentation
      this.spinner.start('Generating project summary...');
      const summaryPrompt = `Based on all the context and responses gathered, provide a comprehensive summary of the ${context.metadata.name} project.
Consider:
1. Core vision and goals
2. Key features and innovations
3. User experience highlights
4. Technical considerations
5. Next steps

Return a well-formatted summary that captures the essence of the project.`;

      const summary = await this.ai.generateContent({
        prompt: summaryPrompt,
        context: JSON.stringify(context),
        type: 'summary'
      });

      // Store the summary in context
      await this.contextManager.addInsights([{
        type: 'summary',
        content: summary,
        timestamp: new Date().toISOString()
      }]);

      this.spinner.succeed('Summary generated');
      console.log('\n📋 Project Summary:\n');
      console.log(summary);
      console.log('\n🚀 Generating documentation...\n');

      // Present template selection options
      const choice = await select({
        message: 'Select documentation templates to generate:',
        choices: [
          { name: 'Generate All Documentation', value: 'all', description: 'Generate all types of documentation' },
          { name: 'Technical Documentation Only', value: 'technical', description: 'Generate only technical documentation' },
          { name: 'Product Documentation Only', value: 'product', description: 'Generate only product documentation' },
          { name: 'Custom Selection', value: 'custom', description: 'Select specific templates to generate' }
        ]
      });

      let selectedTemplates: string[] = [];
      switch (choice) {
        case 'all':
          selectedTemplates = ['engineering', 'design', 'marketing', 'brainstorm'];
          break;
        case 'technical':
          selectedTemplates = ['engineering'];
          break;
        case 'product':
          selectedTemplates = ['design', 'marketing'];
          break;
        case 'custom':
          // For custom selection, we'll use multiple select prompts
          const customChoices = [
            { name: 'Engineering Documentation', value: 'engineering', checked: true },
            { name: 'Design Documentation', value: 'design', checked: true },
            { name: 'Marketing Documentation', value: 'marketing', checked: false },
            { name: 'Brainstorming & Ideas', value: 'brainstorm', checked: false }
          ];
          
          // Ask for each template individually since we don't have multiselect
          for (const choice of customChoices) {
            const include = await select({
              message: `Include ${choice.name}?`,
              choices: [
                { name: 'Yes', value: true },
                { name: 'No', value: false }
              ]
            });
            if (include) {
              selectedTemplates.push(choice.value);
            }
          }
          break;
      }

      // Initialize documentation generator
      const docGen = new DocumentationGenerator('docs');
      await docGen.initialize();

      // Generate documentation
      const result = await docGen.generateDocumentation(context, selectedTemplates);

      if (result.success) {
        this.spinner.succeed(`Generated ${result.documentCount} documents using ${result.templates.length} templates`);
        return {
          response: 'Documentation generated successfully!',
          suggestions: [],
          nextStage: 'complete'
        };
      } else {
        throw new Error('Failed to generate documentation');
      }

    } catch (error) {
      this.spinner.fail('Error generating documentation');
      debug('InteractiveManager', 'Generation error:', error);
      throw error;
    }
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