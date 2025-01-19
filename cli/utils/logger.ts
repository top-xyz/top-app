import chalk from 'chalk';

export class Logger {
  private timestamp(): string {
    return new Date().toISOString();
  }

  success(message: string, ...args: any[]) {
    console.log(
      chalk.green('✓'),
      chalk.gray(this.timestamp()),
      chalk.green(message),
      ...args
    );
  }

  error(message: string, error?: any) {
    console.error(
      chalk.red('✗'),
      chalk.gray(this.timestamp()),
      chalk.red(message)
    );
    if (error) {
      if (error instanceof Error) {
        console.error(chalk.red('  →'), chalk.red(error.message));
        if (error.stack) {
          console.error(chalk.gray(error.stack.split('\n').slice(1).join('\n')));
        }
      } else {
        console.error(chalk.red('  →'), chalk.red(error));
      }
    }
  }

  info(message: string, ...args: any[]) {
    console.log(
      chalk.blue('ℹ'),
      chalk.gray(this.timestamp()),
      chalk.blue(message),
      ...args
    );
  }

  warn(message: string, ...args: any[]) {
    console.warn(
      chalk.yellow('⚠'),
      chalk.gray(this.timestamp()),
      chalk.yellow(message),
      ...args
    );
  }

  debug(message: string, ...args: any[]) {
    if (process.env.DEBUG) {
      console.debug(
        chalk.gray('🔍'),
        chalk.gray(this.timestamp()),
        chalk.gray(message),
        ...args
      );
    }
  }

  table(data: any[], columns?: string[]) {
    if (data.length === 0) {
      return this.info('No data to display');
    }

    const headers = columns || Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => item[header] || ''));

    console.log();
    console.table(
      data.map(item => 
        headers.reduce((obj, header) => ({
          ...obj,
          [header]: item[header]
        }), {})
      )
    );
    console.log();
  }

  progress(message: string, current: number, total: number) {
    const percentage = Math.round((current / total) * 100);
    const bar = '█'.repeat(Math.floor(percentage / 2)) + 
                '░'.repeat(50 - Math.floor(percentage / 2));
    
    process.stdout.write(`\r${chalk.blue('↻')} ${chalk.gray(this.timestamp())} `);
    process.stdout.write(`${message}: [${chalk.cyan(bar)}] ${percentage}%`);
    
    if (current === total) {
      process.stdout.write('\n');
    }
  }

  section(title: string) {
    console.log();
    console.log(chalk.bold.underline(title));
    console.log();
  }

  divider() {
    console.log(chalk.gray('─'.repeat(80)));
  }
} 