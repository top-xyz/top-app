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
let manager: InteractiveManager
let kbManager: KnowledgeBaseManager
let logger: Logger

// Initialize managers first
async function initializeManagers(debugMode = false) {
  setDebugMode(debugMode);
  debug('CLI', 'Initializing managers with debug mode:', debugMode);
  manager = new InteractiveManager(
    path.join(process.cwd(), cliConfig.templatesDir),
    path.join(process.cwd(), cliConfig.contextDir),
    debugMode
  );
  debug('CLI', 'Managers initialized');
  kbManager = new KnowledgeBaseManager(cliConfig)
  await kbManager.initialize()
  logger = new Logger()
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
  console.log(chalk.cyan('\n🌟 top - Universal Context Manager\n'));
  console.log(chalk.cyan('✨ Let\'s create something amazing together!'));
  console.log(chalk.cyan('I\'ll guide you through each step to set up your project perfectly.\n'));

  // Initialize services early
  const manager = new InteractiveManager(cliConfig.templatesDir, cliConfig.contextDir, options.debug);
  await manager.initialize();

  try {
    // Get project name
    const name = await inquirer.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'What would you like to name your project?',
      validate: (input: string) => {
        if (input.trim().length === 0) {
          return 'Project name cannot be empty';
        }
        return true;
      }
    }]);
    
    await manager.startProjectCreation(name.projectName);
    
    // Get project goals
    const goals = await input({
      message: `What are the main goals of ${name.projectName}?`,
      validate: (value) => value.length > 0 ? true : 'Please enter project goals'
    });
    
    await manager.setProjectGoals(goals);
    
    // Handle required prompts
    let currentStage = 'required_prompts';
    while (currentStage !== 'complete') {
      debug('CLI', `Current stage: ${currentStage}`);
      const result = await manager.handleUserInput('', currentStage);
      
      if (result.response) {
        console.log('\n' + chalk.cyan(result.response) + '\n');
      }
      
      if (result.suggestions?.length > 0) {
        // Display all suggestions
        result.suggestions.forEach((suggestion, index) => {
          console.log(chalk.yellow(`${index + 1}. ${suggestion}`));
        });
        console.log();

        // Get user input for the first suggestion
        const answer = await input({
          message: result.suggestions[0],
          validate: (value) => value.length > 0 ? true : 'Please provide an answer'
        });
        
        debug('CLI', `Got answer for suggestion: ${answer}`);
        const nextResult = await manager.handleUserInput(answer, currentStage);
        debug('CLI', `Next result:`, nextResult);
        
        if (nextResult.nextStage) {
          debug('CLI', `Moving to next stage: ${nextResult.nextStage}`);
          currentStage = nextResult.nextStage;
        }
      } else {
        debug('CLI', 'No suggestions, completing');
        currentStage = 'complete';
      }
    }
    
    console.log(chalk.green('\n✅ Project setup complete! You can find your generated documentation in the context directory.\n'));
    process.exit(0);
  } catch (error) {
    debug('Error in handleCreate:', error);
    logger.error('An error occurred:', error);
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