import { VertexAIClient } from '../client/vertex-ai';
import { ProjectInitialContext, VisionAnalysis } from '../../types';
import { Logger } from '../../utils/logger';
import { debug } from '../../utils/debug';
import { getProjectTypePrompt } from './templates/project/types/detector';
import { getInitialPromptsPrompt } from './templates/context/initial';
import { getFollowUpPromptsPrompt } from './templates/context/follow-up';
import { getDocumentationPlanPrompt, getDocumentGenerationPrompt } from './templates/documentation/plan';
import { getVisionAnalysisPrompt } from './templates/project/vision';
import { getNameSuggestionsPrompt } from './templates/project/naming';
import { ProjectType, PROJECT_TYPES } from '../../types/core/project';
import { generateInsightsPrompt, getInsightsPrompt } from './templates/context/insights';

export class PromptManager {
  private logger: Logger;

  constructor(private ai: VertexAIClient) {
    debug('PromptManager', 'Initializing PromptManager');
    this.logger = new Logger();
  }

  // Base prompt handling
  private async generateStructuredResponse(
    prompt: string,
    expectedFormat: string,
    retries = 2
  ): Promise<any> {
    try {
      const response = await this.ai.generateContent({
        prompt: `${prompt}\n\nIMPORTANT: Response must be ONLY valid ${expectedFormat} with no other text, markdown, or formatting.`,
        temperature: 0.7,
        maxTokens: 1000,
        model: 'gemini-pro'
      });

      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        debug('PromptManager', 'No JSON found in response');
        if (retries > 0) {
          return this.generateStructuredResponse(prompt, expectedFormat, retries - 1);
        }
        return this.getDefaultResponse(expectedFormat);
      }

      const jsonStr = jsonMatch[0]
        .replace(/```json\s*|\s*```/g, '') // Remove markdown code blocks
        .replace(/^[\s\n]*\{/, '{')        // Clean start
        .replace(/\}[\s\n]*$/, '}')        // Clean end
        .trim();

      try {
        const parsed = JSON.parse(jsonStr);
        debug('PromptManager', `Successfully parsed ${expectedFormat} response`);
        return parsed;
      } catch (e) {
        debug('PromptManager', `Failed to parse ${expectedFormat} response:`, e);
        debug('PromptManager', 'Raw response:', response);
        debug('PromptManager', 'Extracted JSON:', jsonStr);

        if (retries > 0) {
          debug('PromptManager', `Retrying ${expectedFormat} generation, ${retries} attempts left`);
          return this.generateStructuredResponse(prompt, expectedFormat, retries - 1);
        }

        debug('PromptManager', 'No retries left, using default response');
        return this.getDefaultResponse(expectedFormat);
      }
    } catch (error) {
      debug('PromptManager', 'Error generating response:', error);
      
      if (error.message?.includes('429') || error.message?.includes('Too Many Requests')) {
        debug('PromptManager', 'Rate limit exceeded, using default response');
        return this.getDefaultResponse(expectedFormat);
      }

      debug('PromptManager', 'Unexpected error, using default response');
      return this.getDefaultResponse(expectedFormat);
    }
  }

  private getDefaultResponse(format: string): any {
    // Return appropriate empty response based on format
    switch (format) {
      case 'JSON':
        return { questions: [] };
      case 'project-type':
        return {
          primaryType: 'innovative',
          confidence: 0.8,
          reasons: ['Using default response due to processing limits'],
          secondaryTypes: ['utility'],
          analysis: {
            innovative: { score: 0.8, reasons: ['Default innovative response'] },
            utility: { score: 0.6, reasons: ['Default utility response'] }
          }
        };
      case 'vision-analysis':
        return {
          platformRequirements: {
            primary: 'ios',
            secondary: [],
            platformSpecificRequirements: []
          },
          technicalRequirements: {
            coreTechnicalNeeds: ['iOS development'],
            core: ['Swift', 'UIKit'],
            optional: []
          },
          userExperienceElements: {
            keyInteractions: ['Basic functionality'],
            interactions: [],
            design: ['Default design elements']
          },
          integrationRequirements: {
            apis: [],
            services: [],
            integrations: []
          },
          aiMlCapabilities: {
            requiredAiFeatures: [],
            required: [],
            potential: []
          }
        };
      default:
        return {};
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
  async generateProjectTypeAnalysis(description: string, vision: VisionAnalysis): Promise<ProjectType> {
    debug('PromptManager', 'Generating project type analysis');

    const prompt = getProjectTypePrompt(description, PROJECT_TYPES, vision);
    const response = await this.generateStructuredResponse(prompt, 'JSON');

    try {
      // Map the response to our ProjectType interface
      const projectType: ProjectType = {
        primaryType: response.type,
        confidence: response.confidence,
        reasons: response.reasoning || [],
        secondaryTypes: response.recommendations || []
      };

      debug('PromptManager', 'Project type analysis generated:', projectType);
      return projectType;
    } catch (error) {
      debug('PromptManager', 'Error parsing project type analysis:', error);
      throw error;
    }
  }

  // Vision analysis prompts
  async generateVisionAnalysis(
    description: string,
    projectType: ProjectType
  ): Promise<VisionAnalysis> {
    debug('PromptManager', 'Generating vision-analysis response');
    
    const prompt = getVisionAnalysisPrompt(description, projectType);
    const response = await this.generateStructuredResponse<VisionAnalysis>(
      prompt,
      'JSON'
    );

    debug('PromptManager', 'Vision analysis:', response);
    return response;
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
  async generateInitialPrompts(context: ProjectInitialContext): Promise<any[]> {
    debug('PromptManager', 'Generating initial prompts');
    const prompt = await getInitialPromptsPrompt(context);
    debug('PromptManager', 'Generated initial prompts prompt:', prompt);
    
    const response = await this.generateStructuredResponse<{ questions: any[] }>(
      prompt,
      'JSON'
    );
    debug('PromptManager', 'Got initial prompts response:', response);
    
    if (!response || !response.questions) {
      debug('PromptManager', 'No questions found in response');
      return [];
    }
    
    return response.questions;
  }

  async generateFollowUpPrompts(context: ProjectInitialContext): Promise<any[]> {
    debug('PromptManager', 'Generating follow-up prompts');
    const prompt = getFollowUpPromptsPrompt(context);
    const response = await this.generateStructuredResponse<{ questions: any[] }>(
      prompt,
      'JSON'
    );
    return response.questions;
  }

  async generateFollowUpMessage(
    context: ProjectInitialContext,
    promptId: string,
    response: string
  ): Promise<string> {
    // Extract key elements from vision analysis
    const visionAnalysis = context._system?.visionAnalysis || {};
    const {
      platformRequirements = {},
      technicalRequirements = {},
      userExperienceElements = {},
      integrationRequirements = {},
      aiMlCapabilities = {}
    } = visionAnalysis;

    // Build contextual insights
    const insights = [
      `Platform: ${platformRequirements.primary || 'web'} ${platformRequirements.secondary?.length ? `+ ${platformRequirements.secondary.join(', ')}` : ''}`,
      `Core Tech: ${technicalRequirements.core?.join(', ') || 'TBD'}`,
      `Key UX Elements: ${userExperienceElements.keyInteractions?.join(', ') || 'TBD'}`,
      `Integrations: ${integrationRequirements.apis?.join(', ') || 'None specified'}`,
      `AI Potential: ${aiMlCapabilities.potential?.join(', ') || 'None specified'}`
    ].filter(Boolean).join('\n');

    const projectType = context._system?.projectType?.primaryType || 'innovative';
    const projectConfidence = context._system?.projectType?.confidence || 0.8;
    const projectReasons = context._system?.projectType?.reasons || [];

    const prompt = `You are helping guide the creation of ${context.name}, an ${projectType} project (${Math.round(projectConfidence * 100)}% confidence).

Project Vision Analysis:
${insights}

Key Project Characteristics:
${projectReasons.map(r => `• ${r}`).join('\n')}

Previous Responses:
${Object.entries(context.responses || {})
  .map(([id, r]) => `Q: ${r.question}\nA: ${r.response}`)
  .join('\n\n')}

Current Question: "${context.responses?.[promptId]?.question}"
Current Response: "${response}"

Generate a brief, encouraging follow-up message that:
1. Acknowledges their response
2. Connects it to the overall vision and technical context
3. Shows enthusiasm for how it aligns with the project direction
4. Maintains conversational flow

Keep it concise (1-2 sentences) and natural. No emojis or special formatting.`;

    const responseMessage = await this.ai.generateContent({
      prompt,
      temperature: 0.7,
      maxTokens: 100,
      model: 'gemini-pro'
    });

    return responseMessage.trim();
  }

  async generateResponseInsights(question: string, response: string, context: ProjectInitialContext): Promise<any> {
    debug('PromptManager', 'Generating response insights');
    
    const prompt = generateInsightsPrompt(question, response, context);
    const insightsResponse = await this.ai.generateContent({
      prompt,
      temperature: 0.7
    });
    
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = insightsResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : insightsResponse;
      
      const result = JSON.parse(jsonStr);
      return {
        insights: result.insights,
        summary: result.summary,
        response // Include original response
      };
    } catch (error) {
      debug('PromptManager', 'Error parsing insights response:', error);
      return {
        insights: [],
        summary: {
          keyThemes: [],
          criticalPaths: [],
          risks: [],
          opportunities: []
        }
      };
    }
  }

  async generateProjectInsights(context: ProjectInitialContext): Promise<any> {
    debug('PromptManager', 'Generating project insights');
    
    const prompt = getInsightsPrompt(context);
    const insightsResponse = await this.ai.generateContent({
      prompt,
      temperature: 0.7
    });
    
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = insightsResponse.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : insightsResponse;
      
      return JSON.parse(jsonStr);
    } catch (error) {
      debug('PromptManager', 'Error parsing project insights response:', error);
      return {
        insights: [],
        summary: {
          keyThemes: [],
          criticalPaths: [],
          risks: [],
          opportunities: []
        }
      };
    }
  }
}