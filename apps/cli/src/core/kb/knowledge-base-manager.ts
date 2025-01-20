import { CLIConfig, ProjectContext } from '../../types';
import { VertexAIClient } from '../../utils/vertex-ai';
import * as fs from 'fs/promises';
import * as path from 'path';
import chalk from 'chalk';

export class KnowledgeBaseManager {
  private config: CLIConfig;
  private ai: VertexAIClient;
  private knowledgeBase: Map<string, string> = new Map();

  constructor(config: CLIConfig) {
    this.config = config;
    this.ai = new VertexAIClient();
  }

  async initialize(): Promise<void> {
    await this.loadKnowledgeBase();
  }

  private async loadKnowledgeBase() {
    try {
      // Create directories if they don't exist
      await fs.mkdir(this.config.contextDir, { recursive: true });
      await fs.mkdir(this.config.cacheDir, { recursive: true });

      // Load all markdown files from context directory
      const files = await fs.readdir(this.config.contextDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          try {
            const content = await fs.readFile(
              path.join(this.config.contextDir, file),
              'utf-8'
            );
            this.knowledgeBase.set(file, content);
          } catch (error) {
            console.warn(chalk.yellow(`Warning: Could not load ${file}, skipping...`));
          }
        }
      }
    } catch (error) {
      console.error(chalk.red('Error loading knowledge base:'), error);
      throw error;
    }
  }

  async search(query: string): Promise<ProjectContext[]> {
    try {
      if (this.knowledgeBase.size === 0) {
        return [];
      }

      const queryEmbeddings = await this.ai.generateEmbeddings(query);
      const results: ProjectContext[] = [];

      for (const [file, content] of this.knowledgeBase.entries()) {
        const contentEmbeddings = await this.ai.generateEmbeddings(content);
        const similarity = this.calculateSimilarity(queryEmbeddings, contentEmbeddings);

        if (similarity > 0.7) { // Configurable threshold
          results.push({
            id: file,
            type: this.getContextType(file),
            content,
            metadata: {
              similarity,
              file
            }
          });
        }
      }

      return results.sort((a, b) => 
        (b.metadata.similarity as number) - (a.metadata.similarity as number)
      );
    } catch (error) {
      console.error(chalk.red('Error searching knowledge base:'), error);
      return [];
    }
  }

  async addContext(type: string, content: string, metadata: Record<string, any> = {}): Promise<void> {
    try {
      const fileName = await this.generateFileName(type, content);
      const filePath = path.join(this.config.contextDir, fileName);

      await fs.writeFile(filePath, content, 'utf-8');
      this.knowledgeBase.set(fileName, content);

      console.log(chalk.green(`✓ Added new ${type} context: ${fileName}`));
    } catch (error) {
      console.error(chalk.red('Error adding context:'), error);
      throw error;
    }
  }

  async listContexts(): Promise<ProjectContext[]> {
    return Array.from(this.knowledgeBase.entries()).map(([file, content]) => ({
      id: file,
      type: this.getContextType(file),
      content,
      metadata: { file }
    }));
  }

  private async generateFileName(type: string, content: string): Promise<string> {
    const response = await this.ai.generateContent({
      prompt: `Generate a kebab-case filename for a ${type} document with content: ${content.substring(0, 100)}...`,
      type: 'filename'
    });

    const fileName = response.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
    return `${type}-${fileName}.md`;
  }

  private getContextType(fileName: string): string {
    const match = fileName.match(/^([a-z-]+)-/);
    return match ? match[1] : 'general';
  }

  private calculateSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0;
    
    const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
    const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
    const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
    
    return dotProduct / (mag1 * mag2);
  }
} 