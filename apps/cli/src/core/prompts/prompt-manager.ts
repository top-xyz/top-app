import { VertexAIClient } from '../client/vertex-ai';
import { ProjectInitialContext, VisionAnalysis } from '../../types';
import { Logger } from '../../utils/logger';
import { debug } from '../../utils/debug';
import { getProjectTypePrompt } from './templates/detect';
import { getInitialPromptsPrompt } from './templates/initial';
import { getFollowUpPromptsPrompt } from './templates/follow-up';
import { getDocumentationPlanPrompt, getDocumentGenerationPrompt } from './templates/documentation';
import { getVisionAnalysisPrompt } from './templates/vision-analyzer';
import { ProjectType, PROJECT_TYPES } from '../../types/core/project';

export class PromptManager {
  private logger: Logger;

  constructor(private ai: VertexAIClient) {
    debug('PromptManager', 'Initializing PromptManager');
    this.logger = new Logger();
  }

  // Base prompt handling
  async generateStructuredResponse<T>(
    prompt: string,
    type: string,
    temperature: number = 0.3
  ): Promise<T> {
    debug('PromptManager', `Generating ${type} response`);
    
    const response = await this.ai.generateContent({
      prompt,
      type,
      temperature
    });

    try {
      return JSON.parse(response);
    } catch (e) {
      debug('PromptManager', `Error parsing ${type} response:`, e);
      throw new Error(`Failed to parse ${type} response`);
    }
  }

  async generateTextResponse(
    prompt: string,
    type: string = 'text',
    temperature: number = 0.5
  ): Promise<string> {
    debug('PromptManager', `Generating ${type} text response`);
    
    return this.ai.generateContent({
      prompt,
      type,
      temperature
    });
  }

  // Project type prompts
  async generateProjectTypeAnalysis(description: string): Promise<ProjectType> {
    return this.generateStructuredResponse<ProjectType>(
      getProjectTypePrompt(description, PROJECT_TYPES),
      'project-type'
    );
  }

  // Vision analysis prompts
  async generateVisionAnalysis(description: string): Promise<VisionAnalysis> {
    return this.generateStructuredResponse<VisionAnalysis>(
      getVisionAnalysisPrompt(description),
      'vision-analysis'
    );
  }

  // Documentation prompts
  async generateDocumentationPlan(context: ProjectInitialContext): Promise<string> {
    return this.generateTextResponse(
      getDocumentationPlanPrompt(context),
      'documentation-plan'
    );
  }

  async generateDocumentContent(
    context: ProjectInitialContext,
    template: string,
    type: string
  ): Promise<string> {
    return this.generateTextResponse(
      getDocumentGenerationPrompt(context, template, type),
      'documentation'
    );
  }

  // Question generation prompts
  async generateInitialPrompts(context: ProjectInitialContext): Promise<string[]> {
    return this.generateStructuredResponse<string[]>(
      getInitialPromptsPrompt(context),
      'initial-prompts'
    );
  }

  async generateFollowUpPrompts(
    context: ProjectInitialContext,
    previousResponses: string[]
  ): Promise<string[]> {
    return this.generateStructuredResponse<string[]>(
      getFollowUpPromptsPrompt(context, previousResponses),
      'follow-up-prompts'
    );
  }
}