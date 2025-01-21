#!/usr/bin/env node
import { Command } from 'commander';
import { config as dotenvConfig } from 'dotenv';
import chalk from 'chalk';
import { CLIConfig } from '../types';
import config from '../config';
import { debug, setDebugMode } from '../utils/debug';
import { handleCreate } from './handlers/input/action/create';
import { handleChat } from './handlers/input/action/chat';
import { handleKBSync, handleKBSearch } from './handlers/input/action/kb';
import { handleContextAdd, handleContextList } from './handlers/input/action/context';
import { InteractiveManager } from './handlers/input/interactive';
import { select } from '@inquirer/prompts';
import { spinner } from '../utils/spinner';
import { VertexAIClient } from '../core/client/vertex-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenvConfig();

const cliConfig: CLIConfig = config;

const program = new Command();

program
  .name('top')
  .description('context is everything')
  .version('1.0.0')
  .option('-d, --debug', 'enable debug mode');

program.parse(process.argv);
const options = program.opts();

if (options.debug) {
  setDebugMode(true);
}

// Get file paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize AI client
const ai = new VertexAIClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
  apiEndpoint: process.env.GOOGLE_CLOUD_API_ENDPOINT,
});

// Create a singleton interactive manager
const manager = new InteractiveManager(
  ai,
  path.join(__dirname, '../core/prompts/templates'),
  path.join(__dirname, '../docs'),
  options.debug || false
);

const logo = `
${chalk.bold.blue('🌟 top')} - ${chalk.dim('conscious creation')}
${chalk.dim('thought → intention → reality')}`;

// Command descriptions for selection menu
const commands = [
  {
    name: '💨 create',
    description: 'manifest new digital alchemy',
    handler: handleCreate
  },
  {
    name: '🔥 context',
    description: 'explore and shape your creations',
    handler: handleContextList
  },
  {
    name: '🌍 dev',
    description: '🚧 coming soon: bring your creations to life 🚧',
    handler: () => {}
  }
];

// Handle interrupts gracefully
process.on('SIGINT', () => {
  spinner.stop();
  console.log(chalk.dim('\nflow interrupted'));
  process.exit(0);
});

async function main() {
  const command = process.argv[2];

  console.clear();
  console.log(logo);
  console.log();

  if (!command || command === 'help') {
    // Show interactive command selection
    const selected = await select({
      message: chalk.cyan('what would you like to manifest?'),
      choices: commands.map(cmd => ({
        value: cmd.name,
        name: cmd.name,
        description: '\n' + chalk.dim(cmd.description)
      }))
    });

    const selectedCommand = commands.find(cmd => cmd.name === selected);
    if (selectedCommand) {
      await selectedCommand.handler(manager);
    }
  } else {
    // Handle direct command invocation
    const selectedCommand = commands.find(cmd => cmd.name === command);
    if (selectedCommand) {
      await selectedCommand.handler(manager);
    } else {
      console.log(chalk.red(`Unknown command: ${command}`));
      process.exit(1);
    }
  }
}

main().catch(error => {
  spinner.stop();
  if (error.message?.includes('User force closed')) {
    console.log(chalk.dim('\nflow interrupted'));
  } else {
    console.error(chalk.red('\n❌ Error:'), error.message);
  }
  process.exit(1);
});
