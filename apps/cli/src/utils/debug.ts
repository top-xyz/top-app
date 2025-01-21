import chalk from 'chalk';

let isDebugMode = true; // Always on for debugging

export function setDebugMode(enabled: boolean) {
  isDebugMode = enabled;
}

export function debug(context: string, message: string, data?: any) {
  const timestamp = new Date().toISOString();
  const prefix = chalk.dim(`[${timestamp}]`) + chalk.cyan(` [${context}]`);
  
  //return;
  
  if (data) {
    if (typeof data === 'object') {
      console.log(`${prefix} ${message}:`);
      if (data.prompt) {
        // Special handling for prompts to make them more readable
        console.log(chalk.yellow('\n=== Prompt ==='));
        console.log(data.prompt);
        console.log(chalk.yellow('=== End Prompt ===\n'));
        delete data.prompt;
        if (Object.keys(data).length > 0) {
          console.dir(data, { depth: null, colors: true });
        }
      } else {
        console.dir(data, { depth: null, colors: true });
      }
    } else {
      console.log(`${prefix} ${message}:`, data);
    }
  } else {
    console.log(`${prefix} ${message}`);
  }
} 