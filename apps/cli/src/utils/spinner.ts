import ora, { Ora } from 'ora';
import chalk from 'chalk';

export type SpinnerType = 
  | 'thought'     // For thinking/processing states
  | 'create'      // For creation/manifestation states
  | 'flow'        // For continuous background processes
  | 'sync'        // For synchronization operations
  | 'search';     // For search operations

interface SpinnerConfig {
  frames: string[];
  interval: number;
}

const spinnerConfigs: Record<SpinnerType, SpinnerConfig> = {
  thought: {
    frames: [
      '💭',
      '💭',
      '💭',
      '💭'
    ],
    interval: 800
  },
  create: {
    frames: [
      '✨',
      '✨',
      '✨',
      '✨'
    ],
    interval: 800
  },
  flow: {
    frames: [
      '🌊 flowing',
      '🌊 flowing',
      '🌊 flowing',
      '🌊 flowing'
    ],
    interval: 800
  },
  sync: {
    frames: [
      '🔄',
      '🔄',
      '🔄',
      '🔄'
    ],
    interval: 800
  },
  search: {
    frames: [
      '🔍',
      '🔍',
      '🔍',
      '🔍'
    ],
    interval: 800
  }
};

class SpinnerManager {
  private static instance: SpinnerManager;
  private currentSpinner: Ora | null = null;
  private isEnabled: boolean = true;

  private constructor() {}

  static getInstance(): SpinnerManager {
    if (!SpinnerManager.instance) {
      SpinnerManager.instance = new SpinnerManager();
    }
    return SpinnerManager.instance;
  }

  start(type: SpinnerType, text?: string): void {
    this.stop();
    if (!this.isEnabled) return;

    const config = spinnerConfigs[type];
    this.currentSpinner = ora({
      spinner: {
        frames: config.frames,
        interval: config.interval
      },
      text: text ? chalk.dim(text) : undefined,
      color: 'gray',
      stream: process.stdout
    }).start();
  }

  stop(): void {
    if (this.currentSpinner) {
      this.currentSpinner.stop();
      this.currentSpinner = null;
    }
  }

  update(text: string): void {
    if (this.currentSpinner && this.isEnabled) {
      this.currentSpinner.text = chalk.dim(text);
    }
  }

  succeed(text?: string): void {
    if (this.currentSpinner && this.isEnabled) {
      this.currentSpinner.succeed(text ? chalk.dim(text) : undefined);
      this.currentSpinner = null;
    }
  }

  fail(text?: string): void {
    if (this.currentSpinner && this.isEnabled) {
      this.currentSpinner.fail(text ? chalk.dim(text) : undefined);
      this.currentSpinner = null;
    }
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }
}

export const spinner = SpinnerManager.getInstance();
