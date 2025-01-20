import { VertexAIClient } from '../../utils/vertex-ai';
import { ProjectInitialContext, DocumentGenerationPlan, TemplateConfig } from '../../types';
import { Logger } from '../../utils/logger';
import { TemplateManager } from '../templates/template-manager';
import * as fs from 'fs/promises';
import * as path from 'path';
import { debug } from '../../utils/debug';

export class DocumentationGenerator {
  private ai: VertexAIClient;
  private logger: Logger;
  private templateManager: TemplateManager;
  private outputDir: string;

  constructor(templatesDir: string, outputDir: string) {
    debug('DocGen', 'Constructor called with:', { templatesDir, outputDir });
    this.ai = new VertexAIClient();
    this.logger = new Logger();
    this.templateManager = new TemplateManager(templatesDir);
    this.outputDir = outputDir;
    debug('DocGen', 'DocumentationGenerator instance created');
  }

  async initialize(): Promise<void> {
    debug('DocGen', 'Initializing DocumentationGenerator');
    await this.templateManager.initialize();
    await fs.mkdir(this.outputDir, { recursive: true });
    debug('DocGen', 'DocumentationGenerator initialized');
  }

  async generateDocumentation(
    context: ProjectInitialContext,
    selectedTemplates: string[]
  ): Promise<string[]> {
    debug('DocGen', 'Generating documentation for context:', context);
    debug('DocGen', 'Selected templates:', selectedTemplates);
    
    try {
      const generatedFiles: string[] = [];

      // Generate documentation plan
      debug('DocGen', 'Generating documentation plan');
      const plan = await this.ai.generateDocumentationPlan(context);
      debug('DocGen', 'Generated plan:', plan);
      
      // Validate templates
      debug('DocGen', 'Validating templates');
      if (!await this.templateManager.validateTemplates(plan)) {
        debug('DocGen', 'Template validation failed');
        throw new Error('Invalid documentation plan - template validation failed');
      }
      debug('DocGen', 'Templates validated successfully');

      // Generate each document
      for (const templateId of selectedTemplates) {
        debug('DocGen', `Generating documentation for template: ${templateId}`);
        this.logger.info(`Generating documentation for template: ${templateId}`);
        
        const template = await this.templateManager.getTemplate(templateId);
        debug('DocGen', 'Retrieved template:', template);
        
        const content = await this.ai.generateDocument(template, context, templateId);
        debug('DocGen', 'Generated content length:', content.length);
        
        const fileName = await this.generateFileName(templateId, context.name);
        const filePath = path.join(this.outputDir, fileName);
        debug('DocGen', 'Writing to file:', filePath);
        
        await fs.writeFile(filePath, content, 'utf-8');
        generatedFiles.push(fileName);
        
        this.logger.success(`Generated ${fileName}`);
      }

      return generatedFiles;
    } catch (error) {
      this.logger.error('Error generating documentation:', error);
      throw error;
    }
  }

  private async generateFileName(templateId: string, projectName: string): Promise<string> {
    const result = await this.ai.generateContent({
      prompt: `Generate a kebab-case filename for a ${templateId} document about project ${projectName}.
Return just the filename with .md extension.`,
      type: 'filename'
    });

    return result.trim().toLowerCase();
  }

  getAvailableTemplates(): TemplateConfig[] {
    return this.templateManager.getAvailableTemplates();
  }

  getTemplatesByCategory(category: string): TemplateConfig[] {
    return this.templateManager.getTemplatesByCategory(category);
  }
} 