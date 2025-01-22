import { debug } from '../../../../utils/debug';
import { InteractiveManager } from '../interactive';
import { input, select } from '@inquirer/prompts';
import chalk from 'chalk';
import { spinner } from '../../../../utils/spinner';
import { getInitialPromptsPrompt } from '../../../../core/prompts/templates/context/initial';
import { getDocumentationPlanPrompt } from '../../../../core/prompts/templates/documentation/plan';
import { DocumentationGenerator } from '../../../../core/docs/documentation-generator';
import path from 'path';

export async function handleCreate(manager: InteractiveManager): Promise<boolean> {
  try {
    debug('handleCreate', 'Starting project creation');
    
    // Welcome message with emoji art
    console.log(chalk.cyan('\n✨ Welcome to the creative process! ✨'));
    console.log(chalk.gray('\nLet\'s turn your vision into reality, one step at a time.'));
    
    // Prompt for product vision with context
    console.log(chalk.cyan('\n🎯 First, help me understand your vision:'));
    console.log(chalk.gray('Be as detailed as you\'d like - tell me about the problem you\'re solving,'));
    console.log(chalk.gray('the experience you want to create, or the change you want to see.'));
    
    const vision = await input({
      message: 'What would you like to create?',
      default: ''
    });
    
    debug('handleCreate', 'Got product vision:', vision);
    
    // Show thinking indicator
    console.log(chalk.gray('\n💭 Analyzing your vision...'));
    const success = await manager.handleCreate(vision);

    if (success) {
      // Documentation generation section
      console.log(chalk.cyan('\n📚 Documentation Generation'));
      console.log(chalk.gray('I can create comprehensive documentation to help bring your vision to life.'));
      console.log(chalk.gray('This includes:'));
      console.log(chalk.gray('  • Architecture and technical specifications'));
      console.log(chalk.gray('  • Feature breakdowns and user stories'));
      console.log(chalk.gray('  • Implementation guidelines and best practices'));
      
      const generateDocs = await select({
        message: 'Would you like me to generate project documentation?',
        choices: [
          { value: true, label: 'Yes, generate documentation' },
          { value: false, label: 'No, skip documentation' }
        ]
      });

      if (generateDocs) {
        try {
          await manager.generateProjectDocumentation();
        } catch (error) {
          debug('handleCreate', 'Documentation generation error:', error);
          throw error;
        }
      }
    }
    
    return success;
  } catch (error) {
    spinner.stop();
    debug('handleCreate', 'Error in create handler::', error);
    
    // Don't show error for user interrupts
    if (!error.message?.includes('User force closed')) {
      console.error(chalk.red('Failed to create project:'), error.message);
    }
    return false;
  }
}
