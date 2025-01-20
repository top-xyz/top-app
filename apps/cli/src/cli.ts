#!/usr/bin/env node
import { Command } from 'commander'
import { config as dotenvConfig } from 'dotenv'
import { InteractiveManager } from './core/context/interactive-manager'
import chalk from 'chalk'
import { CLIConfig } from './types'
import config from './config'
import { input } from '@inquirer/prompts'
import { KnowledgeBaseManager } from './core/kb/knowledge-base-manager'
import { Logger } from './utils/logger'
import * as path from 'path'
import * as fs from 'fs/promises'
import { debug, setDebugMode } from './utils/debug'
import inquirer from 'inquirer'
import ora from 'ora'

// Load environment variables
dotenvConfig()

const cliConfig: CLIConfig = {
  templatesDir: 'templates',
  contextDir: 'context',
  cacheDir: 'cache',
  embeddings: {
    provider: 'vertex',
    model: 'textembedding-gecko',
    dimensions: 768,
    similarity: 'cosine'
  },
  defaultTemplate: 'project',
  validateTemplate: true,
  validateLinks: true,
  strictMode: true,
  format: 'markdown',
  colors: true,
  preview: {
    enabled: true,
    type: 'markdown'
  },
  collaboration: {
    enabled: false,
    realtime: false,
    presence: false,
    comments: false
  },
  streaming: {
    enabled: true,
    chunkSize: 80,
    delay: 50
  },
  api: {
    url: process.env.API_URL || 'http://localhost:3000',
    version: process.env.API_VERSION || 'v1'
  }
}

// Initialize CLI
const program = new Command()
const logger = new Logger()
let manager: InteractiveManager
let kbManager: KnowledgeBaseManager

// Initialize managers first
async function initializeManagers(debugMode: boolean = false): Promise<void> {
  setDebugMode(debugMode);
  
  try {
    const templatesDir = path.join(process.cwd(), cliConfig.templatesDir);
    const outputDir = path.join(process.cwd(), cliConfig.contextDir);
    
    debug('CLI', 'Creating required directories:', { templatesDir, outputDir });
    await fs.mkdir(templatesDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
    
    debug('CLI', 'Directories created successfully');
  } catch (error) {
    logger.error('Failed to create directories:', error);
    throw error;
  }
}

program
  .name('top')
  .description('Project context and documentation management CLI')
  .version('1.0.0')
  .option('--debug', 'Enable debug mode')

// Create command with subcommands
program.command('create')
  .description('Create a new project interactively')
  .option('-d, --debug', 'Enable debug mode')
  .option('--noname', 'Skip name suggestion generation')
  .action(async (options) => {
    try {
      await initializeManagers(options.debug || false)
      await handleCreate(options)
    } catch (error) {
      logger.error('Error in create command:', error)
      process.exit(1)
    }
  })

// Context management commands
program.command('context')
  .description('Manage project context and documentation')
  .addCommand(
    new Command('add')
      .description('Add new context or documentation')
      .argument('<type>', 'Type of context (vision/technical/user/workflow)')
      .action(async (type) => {
        await handleContextAdd(type)
      })
  )
  .addCommand(
    new Command('list')
      .description('List available context and documentation')
      .action(async () => {
        await handleContextList()
      })
  )

// Chat command for context-aware interactions
program.command('chat')
  .description('Start an interactive chat session')
  .option('-m, --mode <mode>', 'Chat mode (exploration/refinement)', 'exploration')
  .action(async (options) => {
    await handleChat(options)
  })

// Knowledge base commands
program.command('kb')
  .description('Knowledge base management')
  .addCommand(
    new Command('sync')
      .description('Sync knowledgE base with current project')
      .action(async () => {
        await handleKBSync()
      })
  )
  .addCommand(
    new Command('search')
      .description('Search knowledge base')
      .argument('<query>', 'Search query')
      .action(async (query) => {
        await handleKBSearch(query)
      })
  )

const logo = `
${chalk.bold.blue('🌟 top')} - ${chalk.dim('Universal Context Manager')}
`

async function handleCreate(options: any) {
  debug('CLI', 'Starting project creation with options:', options);
  
  try {
    const templatesDir = path.join(process.cwd(), cliConfig.templatesDir);
    const outputDir = path.join(process.cwd(), cliConfig.contextDir);
    
    debug('CLI', 'Using directories:', { templatesDir, outputDir });
    
    // Ensure directories exist
    await fs.mkdir(templatesDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
    
    debug('CLI', 'Created directories');
    
    const manager = new InteractiveManager(templatesDir, outputDir, options.debug);
    
    console.log('\n🌟 top - Universal Context Manager\n');
    console.log('✨ Let\'s create something amazing together!');
    console.log('I\'ll guide you through each step to set up your project perfectly.\n');
    console.log('🔧 Initializing services...\n');
    
    // Initialize services
    await manager.initialize();
    
    // Get project description first
    const description = await input({
      message: chalk.cyan('Describe your project vision in detail:'),
      validate: (value) => {
        if (!value || value.length < 10) {
          return 'Please provide a more detailed description of your project';
        }
        return true;
      }
    });

    // If --noname flag is not set, get project name suggestions
    let projectName;
    if (!options.noname) {
      // Start the creation process with the description
      const success = await manager.handleCreate(description);
      if (!success) {
        process.exit(1);
      }
      projectName = await input({
        message: chalk.cyan('What would you like to name your project?'),
        validate: (value) => value.trim().length > 0 ? true : 'Project name cannot be empty'
      });
    } else {
      // Skip name suggestions and just ask for the name directly
      projectName = await input({
        message: chalk.cyan('Enter your project name:'),
        validate: (value) => value.trim().length > 0 ? true : 'Project name cannot be empty'
      });
      // Initialize the project with the name and description
      const success = await manager.handleCreateWithName(projectName, description);
      if (!success) {
        process.exit(1);
      }
    }

    // Continue with the interactive prompting flow
    let currentStage = 'required_prompts';
    while (currentStage !== 'complete') {
      const userInput = await input({
        message: chalk.cyan('Your response:')
      });

      const result = await manager.handleUserInput(userInput, currentStage);
      
      if (result.response) {
        console.log('\n' + chalk.cyan(result.response));
      }
      
      if (result.suggestions?.length > 0) {
        console.log(chalk.dim('\nQuestion:'), result.suggestions[0]);
      }

      if (result.nextStage) {
        currentStage = result.nextStage;
      }
    }

    console.log(chalk.green('\n✅ Project setup complete! You can find your generated documentation in the context directory.\n'));

  } catch (error) {
    debug('CLI', 'An error occurred:', error);
    console.error(chalk.red('✗'), '[' + new Date().toISOString() + ']', 'An error occurred:', error);
    process.exit(1);
  }
}

async function handleContextAdd(type: string) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  console.log(chalk.cyan(`\n📝 Adding new ${type} context\n`))
  console.log(chalk.yellow('Enter your context content (press Ctrl+D when done):\n'))

  let content = ''
  rl.on('line', (line) => {
    content += line + '\n'
  })

  rl.on('close', async () => {
    try {
      await kbManager.addContext(type, content.trim())
      console.log(chalk.green('\n✓ Context added successfully!\n'))
    } catch (error) {
      console.error(chalk.red('\nError adding context:'), error)
    }
    process.exit(0)
  })
}

async function handleContextList() {
  try {
    const contexts = await kbManager.listContexts()
    
    if (contexts.length === 0) {
      console.log(chalk.yellow('\nNo contexts found in knowledge base.\n'))
      return
    }

    console.log(chalk.cyan('\n📚 Available Contexts:\n'))
    
    // Group contexts by type
    const groupedContexts = contexts.reduce((acc, ctx) => {
      if (!acc[ctx.type]) acc[ctx.type] = []
      acc[ctx.type].push(ctx)
      return acc
    }, {} as Record<string, typeof contexts>)

    // Display grouped contexts
    for (const [type, items] of Object.entries(groupedContexts)) {
      console.log(chalk.yellow(`\n${type.toUpperCase()}`))
      items.forEach(ctx => {
        console.log(chalk.dim(`  └─ ${ctx.id}`))
      })
    }
    console.log()
  } catch (error) {
    console.error(chalk.red('\nError listing contexts:'), error)
  }
}

async function handleChat(options: any) {
  // TODO: Implement chat session logic
  console.log('Starting chat session in mode:', options.mode)
}

async function handleKBSync() {
  try {
    console.log(chalk.cyan('\n🔄 Syncing knowledge base...\n'))
    await kbManager.initialize()
    console.log(chalk.green('✓ Knowledge base synced successfully!\n'))
  } catch (error) {
    console.error(chalk.red('\nError syncing knowledge base:'), error)
  }
}

async function handleKBSearch(query: string) {
  try {
    console.log(chalk.cyan('\n🔍 Searching knowledge base...\n'))
    
    const results = await kbManager.search(query)
    
    if (results.length === 0) {
      console.log(chalk.yellow('No matching contexts found.\n'))
      return
    }

    console.log(chalk.green(`Found ${results.length} relevant contexts:\n`))
    
    results.forEach((ctx, i) => {
      const similarity = (ctx.metadata.similarity as number * 100).toFixed(1)
      console.log(chalk.yellow(`\n${i + 1}. ${ctx.id} (${similarity}% match)`))
      console.log(chalk.dim('   ' + ctx.content.split('\n')[0] + '\n'))
    })
  } catch (error) {
    console.error(chalk.red('\nError searching knowledge base:'), error)
  }
}

// Set up process event handlers
process.on('uncaughtException', (error) => {
  debug('Uncaught exception:', error)
  console.error(chalk.red('\nAn unexpected error occurred:'), error)
  process.exit(1)
})

process.on('unhandledRejection', (error) => {
  debug('Unhandled rejection:', error)
  console.error(chalk.red('\nAn unexpected error occurred:'), error)
  process.exit(1)
})

// Parse command line arguments
program.parse() 