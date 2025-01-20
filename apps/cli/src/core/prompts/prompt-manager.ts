import { VertexAIClient } from '../../utils/vertex-ai';
import { ProjectInitialContext, GeneratedPrompt } from '../../types';
import { Logger } from '../../utils/logger';
import { debug } from '../../utils/debug';
import chalk from 'chalk';

export class PromptManager {
  private ai: VertexAIClient;
  private logger: Logger;

  constructor() {
    this.ai = new VertexAIClient();
    this.logger = new Logger();
  }

  async generateInitialPrompts(context: ProjectInitialContext): Promise<{
    required: GeneratedPrompt[];
    optional: GeneratedPrompt[];
  }> {
    try {
      const prompts = await this.ai.generateInitialPrompts(context);
      
      // Split into required and optional prompts
      const required = prompts.filter(p => p.required).slice(0, 5); // Take top 5 required
      const optional = prompts.filter(p => !p.required);
      
      return { required, optional };
    } catch (error) {
      this.logger.error('Error generating initial prompts:', error);
      throw error;
    }
  }

  async generateFollowUpPrompts(context: ProjectInitialContext): Promise<GeneratedPrompt[]> {
    try {
      const prompts = await this.ai.generateFollowUpPrompts(context);
      return prompts;
    } catch (error) {
      this.logger.error('Error generating follow-up prompts:', error);
      throw error;
    }
  }

  async generateSummaryPrompt(context: ProjectInitialContext): Promise<string> {
    const prompt = `Summarize the current project understanding based on:
Project: ${context.name}
Goals: ${context.goals}
Responses: ${JSON.stringify(context.responses, null, 2)}

Provide a clear and concise summary of what we know so far.`;
    return prompt;
  }

  async generateTemplatePrompt(context: ProjectInitialContext): Promise<string> {
    return `Please select the types of documentation to generate:
- engineering - Technical documentation
- design - Design documentation
- marketing - Marketing materials
- sales - Sales collateral
- brainstorm - Ideation and exploration`;
  }
} 