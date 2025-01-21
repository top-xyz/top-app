import { handleCreate } from './input/action/create';
import { handleChat } from './input/action/chat';
import { handleKBSync, handleKBSearch } from './input/action/kb';
import { handleContextAdd, handleContextList } from './input/action/context';
import { debug } from '../../utils/debug';
import * as path from 'path';

export class CLIHandler {
  private interactive: InteractiveManager;

  constructor(templatesDir: string, outputDir: string, debugMode = false) {
    debug('CLIHandler', 'Constructor called with:', { templatesDir, outputDir, debugMode });
    this.interactive = new InteractiveManager(templatesDir, outputDir, debugMode);
  }

  // Re-export interactive manager methods
  async handleCreate(description: string) {
    return this.interactive.handleCreate(description);
  }

  async handleCreateWithName(name: string, description: string) {
    return this.interactive.handleCreateWithName(name, description);
  }

  async handleChat() {
    await this.interactive.initialize();
  }
}
