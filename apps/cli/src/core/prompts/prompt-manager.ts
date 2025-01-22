import { VertexAIClient } from '../client/vertex-ai';
import { ProjectInitialContext, VisionAnalysis, ProjectInsights } from '../../types';
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

  async generateStructuredResponse(prompt: string): Promise<any> {
    try {
      const response = await this.ai.generateContent({
        type: 'structured',
        prompt,
        temperature: 0.7,
        maxTokens: 1000,
        model: 'gemini-pro'
      });

      return this.parseJsonResponse(response);
    } catch (error) {
      debug('PromptManager', 'Error generating response:', error);
      throw error;
    }
  }

  async batchGenerateResponses(prompts: Array<{type: string, prompt: string}>): Promise<any[]> {
    try {
      const responses = await this.ai.generateBatchContent(prompts);
      return responses.map(response => this.parseJsonResponse(response));
    } catch (error) {
      debug('PromptManager', 'Error in batch generation:', error);
      throw error;
    }
  }

  async processUserResponses(responses: Array<{id: string, question: string, response: string}>): Promise<any[]> {
    const prompts = responses.map(r => ({
      type: 'chat',
      prompt: getResponseInsightsPrompt(r.question, r.response)
    }));

    return this.batchGenerateResponses(prompts);
  }

  async generateInitialAnalysis(description: string): Promise<any> {
    const prompts = [
      {
        type: 'structured',
        prompt: getVisionAnalysisPrompt(description)
      },
      {
        type: 'structured', 
        prompt: getProjectTypePrompt(description)
      }
    ];

    const [visionAnalysis, projectType] = await this.batchGenerateResponses(prompts);
    return {
      vision: visionAnalysis,
      type: projectType
    };
  }

  async generateInitialPrompts(context: ProjectInitialContext): Promise<any> {
    const prompt = getInitialPromptsPrompt(context);
    return this.generateStructuredResponse(prompt);
  }

  async generateFollowUpPrompts(context: ProjectInitialContext): Promise<any> {
    try {
      const prompt = getFollowUpPromptsPrompt(context);
      return this.generateStructuredResponse(prompt);
    } catch (error) {
      debug('PromptManager', 'Rate limit exceeded, using default response');
      return {
        questions: []
      };
    }
  }

  private parseJsonResponse(response: string): any {
    try {
      // Clean the response - remove any markdown formatting and find JSON block
      let cleanJson = response;
      const jsonMatch = response.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        cleanJson = jsonMatch[1].trim();
      }
      
      return JSON.parse(cleanJson);
    } catch (error) {
      debug('PromptManager', 'Error parsing JSON response:', error);
      debug('PromptManager', 'Raw response:', response);
      throw new Error('Failed to parse JSON response');
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

  async generateProjectTypeAnalysis(description: string, vision: VisionAnalysis): Promise<ProjectType> {
    debug('PromptManager', 'Generating project type analysis');

    const prompt = getProjectTypePrompt(description, PROJECT_TYPES, vision);
    const response = await this.generateStructuredResponse(prompt);

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

  async generateVisionAnalysis(
    description: string,
    projectType: ProjectType
  ): Promise<VisionAnalysis> {
    debug('PromptManager', 'Generating vision-analysis response');
    
    const prompt = getVisionAnalysisPrompt(description, projectType);
    const response = await this.generateStructuredResponse<VisionAnalysis>(
      prompt
    );

    debug('PromptManager', 'Vision analysis:', response);
    return response;
  }

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

  async generateResponseInsights(prompt: string, response: string): Promise<any> {
    try {
      const promptData = {
        prompt,
        response,
        context: this.context
      };

      const insightPrompt = `
        Analyze this response and generate structured insights.
        Return a JSON object with the following structure:
        {
          "insights": [{
            "category": string,
            "key": string,
            "title": string,
            "description": string,
            "implications": string[],
            "recommendations": string[],
            "priority": "high" | "medium" | "low",
            "confidence": number
          }],
          "summary": {
            "keyThemes": string[],
            "criticalPaths": string[],
            "risks": string[],
            "opportunities": string[]
          }
        }
      `;

      const result = await this.ai.generateContent({
        type: 'structured',
        temperature: 0.7,
        maxTokens: 1000,
        model: 'gemini-pro',
        prompt: `${insightPrompt}\n\nAnalyze this:\n${JSON.stringify(promptData, null, 2)}`
      });

      // Try parsing as JSON first
      try {
        const jsonResult = this.parseJsonResponse(result);
        return {
          insights: jsonResult.insights || [],
          summary: jsonResult.summary || {
            keyThemes: [],
            criticalPaths: [],
            risks: [],
            opportunities: []
          },
          response
        };
      } catch (jsonError) {
        // If JSON parsing fails, try extracting insights from markdown
        debug('PromptManager', 'JSON parsing failed, extracting from markdown');
        
        const insights = this.extractInsightsFromMarkdown(result);
        return {
          insights: insights.insights,
          summary: insights.summary,
          response
        };
      }
    } catch (error) {
      debug('PromptManager', 'Error generating insights:', error);
      return {
        insights: [],
        summary: {
          keyThemes: [],
          criticalPaths: [],
          risks: [],
          opportunities: []
        },
        response
      };
    }
  }

  private extractInsightsFromMarkdown(markdown: string): any {
    const insights: any[] = [];
    const summary = {
      keyThemes: [] as string[],
      criticalPaths: [] as string[],
      risks: [] as string[],
      opportunities: [] as string[]
    };

    // Extract insights sections
    const insightMatches = markdown.match(/\*\*(.*?):\*\*([\s\S]*?)(?=\*\*|$)/g) || [];
    insightMatches.forEach(match => {
      const [title, content] = match.split(':**');
      const cleanTitle = title.replace('**', '').trim();
      const cleanContent = content.trim();
      
      if (cleanTitle && cleanContent) {
        insights.push({
          category: 'Analysis',
          key: cleanTitle.toLowerCase().replace(/\s+/g, '_'),
          title: cleanTitle,
          description: cleanContent,
          implications: [],
          recommendations: [],
          priority: 'medium',
          confidence: 0.8
        });
      }
    });

    // Extract summary sections
    const summaryMatch = markdown.match(/\*\*Summary:\*\*([\s\S]*?)(?=\*\*|$)/);
    if (summaryMatch) {
      const summaryContent = summaryMatch[1];
      const bullets = summaryContent.match(/\*(.*?)(?=\*|$)/g) || [];
      bullets.forEach(bullet => {
        const cleanBullet = bullet.replace(/^\*\s*/, '').trim();
        if (cleanBullet) {
          summary.keyThemes.push(cleanBullet);
        }
      });
    }

    return { insights, summary };
  }

  private async processInsights(insights: any): Promise<ProjectInsights> {
    const processed: ProjectInsights = {
      items: [],
      summary: {
        keyThemes: [],
        criticalPaths: [],
        risks: [],
        opportunities: []
      }
    };

    if (insights?.insights && Array.isArray(insights.insights)) {
      processed.items = insights.insights.map((insight: any) => ({
        category: insight.category || 'Unknown',
        key: insight.key || 'unknown',
        title: insight.title || '',
        description: insight.description || '',
        implications: insight.implications || [],
        recommendations: insight.recommendations || [],
        priority: insight.priority || 'medium',
        confidence: insight.confidence || 0.5
      }));
    }

    if (insights?.summary) {
      processed.summary = {
        keyThemes: insights.summary.keyThemes || [],
        criticalPaths: insights.summary.criticalPaths || [],
        risks: insights.summary.risks || [],
        opportunities: insights.summary.opportunities || []
      };
    }

    if (insights?.response) {
      processed.response = insights.response;
    }

    return processed;
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
      
      return this.processInsights(JSON.parse(jsonStr));
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

  async processUserResponse(promptId: string, response: string, context: ProjectInitialContext) {
    debug('PromptManager', `Processing response for prompt:: ${promptId}`);
    
    // Generate insights
    const insights = await this.generateResponseInsights(promptId, response);
    
    // Show acknowledgment if present
    if (insights?.acknowledgment) {
      debug('PromptManager', `\n${insights.acknowledgment}\n`);
    }
    
    // Update context with insights
    await this.updateContextWithInsights(insights, response);
  }
}