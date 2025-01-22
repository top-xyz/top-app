import { debug } from '../../../../utils/debug';
import { InteractiveManager } from '../interactive';
import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import { spinner } from '../../../../utils/spinner';
import { getInitialPromptsPrompt } from '../../../../core/prompts/templates/context/initial';
import { getDocumentationPlanPrompt } from '../../../../core/prompts/templates/documentation/plan';

export async function handleCreate(manager: InteractiveManager): Promise<boolean> {
  try {
    debug('handleCreate', 'Starting project creation');
    
    // Prompt for product vision
    console.log(chalk.cyan('\n🎯 Let\'s start by understanding your product vision.'));
    const vision = await input({
      message: 'What would you like to create?',
      default: ''
    });
    
    // Stop any existing spinners before proceeding
    spinner.stop();
    
    debug('handleCreate', 'Got product vision:', vision);
    return await manager.handleCreate(vision);
  } catch (error) {
    spinner.stop();
    debug('handleCreate', 'Error:', error);
    // Don't show error for user interrupts
    if (!error.message?.includes('User force closed')) {
      console.error(chalk.red('Failed to create project:'), error.message);
    }
    return false;
  }
}
