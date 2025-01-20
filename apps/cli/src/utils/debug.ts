import chalk from 'chalk';

export let isDebugMode = false;

export function setDebugMode(debug: boolean) {
  isDebugMode = debug;
}

export function debug(namespace: string, ...args: any[]) {
  if (isDebugMode) {
    console.log(chalk.gray(`[DEBUG:${namespace}]`), ...args);
  }
} 