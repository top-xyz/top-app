import { VertexAI } from '@google-cloud/vertexai';
import { Logger } from './logger';

interface ProjectContextParams {
  name: string;
  type: string;
  timestamp: string;
}

interface DocsStructureParams {
  name: string;
  type: string;
  context: any;
}

export class VertexAIClient {
  private vertexai: VertexAI;
  private logger: Logger;
  private model = 'gemini-pro';
  private project: string;
  private location: string;

  constructor() {
    this.logger = new Logger();
    this.project = process.env.GOOGLE_CLOUD_PROJECT || '';
    this.location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    
    this.vertexai = new VertexAI({
      project: this.project,
      location: this.location
    });
  }

  async generateProjectContext(params: ProjectContextParams) {
    const { name, type, timestamp } = params;

    const prompt = `Generate a comprehensive project context for a ${type} project named "${name}".
Include the following sections:
- Project Overview
- Technical Architecture
- Market Analysis
- Development Roadmap
- Key Features
- Target Audience
- Innovation Areas
- Success Metrics

Format the response in markdown with appropriate headers and sections.
Make it detailed and specific to a ${type} project.
Include TypeScript interfaces where relevant to define data structures.
Timestamp: ${timestamp}`;

    return this.generateContent(prompt);
  }

  async generateDocsStructure(params: DocsStructureParams) {
    const { name, type, context } = params;

    const prompt = `Based on the following project context, generate a detailed documentation structure for ${name}.
Include all necessary files and directories for:
- Technical Documentation
- Marketing Materials
- Investment Documents
- Development Guides
- API Documentation
- User Stories
- Brand Guidelines

Project Type: ${type}
Context: ${JSON.stringify(context)}

Format the response as a markdown document with a directory tree and file descriptions.
Include suggested content outlines for key documents.`;

    return this.generateContent(prompt);
  }

  async generateMarketingContent(type: string, context: any) {
    const prompt = `Generate ${type} content for the project based on the following context.
Make it compelling, professional, and aligned with the project goals.
Context: ${JSON.stringify(context)}

Format the response in markdown with appropriate sections and styling.`;

    return this.generateContent(prompt);
  }

  async generateInvestmentContent(type: string, context: any) {
    const prompt = `Generate ${type} content for investment purposes based on the following context.
Focus on key metrics, market opportunity, and growth potential.
Context: ${JSON.stringify(context)}

Format the response in markdown with appropriate sections and styling.
Include relevant financial projections and market analysis.`;

    return this.generateContent(prompt);
  }

  async generateTechnicalContent(type: string, context: any) {
    const prompt = `Generate ${type} technical documentation based on the following context.
Include detailed specifications, architecture diagrams, and implementation guidelines.
Context: ${JSON.stringify(context)}

Format the response in markdown with appropriate sections and code examples.
Use TypeScript interfaces and code snippets where relevant.`;

    return this.generateContent(prompt);
  }

  private async generateContent(prompt: string): Promise<string> {
    try {
      const model = this.vertexai.preview.getGenerativeModel({
        model: this.model,
        generation_config: {
          max_output_tokens: 8192,
          temperature: 0.2,
          top_p: 0.8,
          top_k: 40
        }
      });

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      const response = result.response;
      if (!response.candidates || response.candidates.length === 0) {
        throw new Error('No response from Vertex AI');
      }

      return response.candidates[0].content.parts[0].text;
    } catch (error) {
      this.logger.error('Error generating content:', error);
      throw error;
    }
  }
} 