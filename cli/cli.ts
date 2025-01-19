#!/usr/bin/env node
import { Command } from 'commander'
import * as dotenv from 'dotenv'
import { InteractiveManager } from './core/context/interactive-manager.js'
import chalk from 'chalk'
import { CLIConfig } from './core/types.js'

// Load environment variables
dotenv.config()

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

const program = new Command()
const manager = new InteractiveManager()

program
  .name('top')
  .description('Project context and documentation management CLI')
  .version('1.0.0')

const logo = `
${chalk.bold.blue('🌟 top')} - ${chalk.dim('Universal Context Manager')}
`;

const helpText = `
${chalk.bold('📋 Commands')}
────────────────
${chalk.green('•')} ${chalk.bold('create')}    Start a new project
${chalk.green('•')} ${chalk.bold('list')}      List existing projects
${chalk.green('•')} ${chalk.bold('open')}      Open an existing project
${chalk.green('•')} ${chalk.bold('help')}      Show this help message

${chalk.bold('💡 Examples')}
────────────────
${chalk.dim('$')} ${chalk.white('top create')}     ${chalk.dim('→ Start a new project wizard')}
${chalk.dim('$')} ${chalk.white('top open demo')}  ${chalk.dim('→ Open the demo project')}
`;

async function main() {
  const command = process.argv[2] || 'help';

  console.clear();
  console.log(logo + '\n');

  switch (command) {
    case 'create':
      console.log(chalk.bold('✨ Let\'s create something amazing together!'));
      console.log(chalk.dim('I\'ll guide you through each step to set up your project perfectly.\n'));
      
      process.stdin.setEncoding('utf8');
      let currentStage = 'initial_setup';
      let projectName = '';

      const askQuestion = (stage: string) => {
        const stageEmojis: Record<string, string> = {
          initial_setup: '📝',
          project_goals: '🎯',
          problem_statement: '❗',
          target_audience: '👥',
          key_features: '🔑',
          unique_value: '💎',
          technical_requirements: '⚙️',
          next_steps: '📋'
        };

        const emoji = stageEmojis[stage] || '💭';
        
        switch (stage) {
          case 'initial_setup':
            console.log(chalk.yellow(`${emoji} What's the name of your project?\n`));
            break;
          case 'project_goals':
            console.log(chalk.yellow(`${emoji} What are the main goals of ${chalk.bold(projectName)}?\n`));
            console.log(chalk.dim('Think about what you want to achieve with this project.\n'));
            break;
          case 'problem_statement':
            console.log(chalk.yellow(`${emoji} What specific problem does ${chalk.bold(projectName)} solve?\n`));
            break;
          case 'target_audience':
            console.log(chalk.yellow(`${emoji} Who is your target audience?\n`));
            break;
          case 'key_features':
            console.log(chalk.yellow(`${emoji} What are the key features or capabilities?\n`));
            break;
          case 'unique_value':
            console.log(chalk.yellow(`${emoji} What makes your solution unique?\n`));
            break;
          case 'technical_requirements':
            console.log(chalk.yellow(`${emoji} What technical requirements or constraints should we consider?\n`));
            break;
          case 'next_steps':
            console.log(chalk.yellow(`${emoji} What would you like to explore next?\n`));
            break;
          default:
            console.log(chalk.yellow(`${emoji} What else would you like to add?\n`));
        }
      };

      askQuestion(currentStage);

      process.stdin.on('data', async (data) => {
        const input = data.toString().trim();
        
        if (input.toLowerCase() === 'exit') {
          console.log(chalk.green('\n✅ Thank you for using Top! Your project context has been saved.\n'));
          process.exit(0);
        }

        try {
          switch (currentStage) {
            case 'initial_setup':
              projectName = input;
              await manager.startProjectCreation(input);
              currentStage = 'project_goals';
              askQuestion(currentStage);
              break;

            case 'project_goals':
              await manager.setProjectGoals(input);
              currentStage = 'problem_statement';
              askQuestion(currentStage);
              break;

            default:
              const { response, suggestions, nextStage } = await manager.handleUserInput(input, currentStage);

              // Parse and format the response
              let formattedResponse = response;
              let formattedSuggestions: string[] = [];

              try {
                // Check if response is JSON
                const parsedResponse = JSON.parse(response);
                if (Array.isArray(parsedResponse)) {
                  formattedResponse = parsedResponse.join('\n');
                } else if (typeof parsedResponse === 'object') {
                  formattedResponse = Object.values(parsedResponse).join('\n');
                }
              } catch {
                // Not JSON, use as is
              }

              try {
                // Parse suggestions if they're JSON
                if (typeof suggestions[0] === 'string' && suggestions[0].startsWith('{')) {
                  formattedSuggestions = suggestions.map(s => {
                    try {
                      const parsed = JSON.parse(s);
                      return typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
                    } catch {
                      return s;
                    }
                  });
                } else {
                  formattedSuggestions = suggestions;
                }
              } catch {
                formattedSuggestions = suggestions;
              }

              console.log('\n' + chalk.cyan(formattedResponse) + '\n');

              if (formattedSuggestions.length > 0) {
                console.log(chalk.white('\n💡 Suggested areas to explore:'));
                formattedSuggestions.forEach((suggestion, index) => {
                  console.log(chalk.yellow(`${index + 1}. ${suggestion}`));
                });
                console.log();
              }

              if (nextStage && nextStage !== currentStage) {
                currentStage = nextStage;
                if (currentStage !== 'complete') {
                  askQuestion(currentStage);
                } else {
                  console.log(chalk.green('\n✨ Great progress! Your project context has been created.\n'));
                  console.log(chalk.white('Next steps:'));
                  console.log(chalk.yellow('📝 Type "docs" to switch to documentation mode'));
                  console.log(chalk.yellow('💾 Type "exit" to save and quit'));
                  console.log(chalk.yellow('🔄 Or continue exploring your project\n'));
                }
              }
          }
        } catch (error) {
          if (error.message?.includes('429 Too Many Requests')) {
            // For rate limit errors, continue with the flow
            console.warn(chalk.yellow('\n⚠️  Rate limit reached, continuing with limited functionality'));
            if (currentStage === 'initial_setup') {
              projectName = input;
              await manager.startProjectCreation(input);
              currentStage = 'project_goals';
              askQuestion(currentStage);
            } else if (currentStage === 'project_goals') {
              await manager.setProjectGoals(input);
              currentStage = 'problem_statement';
              askQuestion(currentStage);
            } else {
              console.error(chalk.red('\n❌ Error:'), error);
              console.log(chalk.yellow('\n🔄 Let\'s try that again. Please provide your answer:\n'));
              askQuestion(currentStage);
            }
          } else {
            console.error(chalk.red('\n❌ Error:'), error);
            console.log(chalk.yellow('\n🔄 Let\'s try that again. Please provide your answer:\n'));
            askQuestion(currentStage);
          }
        }
      });

      // Keep the process alive
      process.stdin.resume();
      break;

    case 'help':
    default:
      console.log(helpText);
      break;
  }
}

main().catch(error => {
  console.error(chalk.red('\n❌ Error:'), error.message);
  process.exit(1);
}); 