import { debug } from '../../utils/debug';
import { VertexAIClient } from '../../utils/vertex-ai';
import { TemplateManager } from '../templates/template-manager';
import { EnhancedProjectContext, DocumentGenerationPlan } from '../../types/context';
import { ContextVisualizer } from '../../utils/context-visualizer';
import { Logger } from '../../utils/logger';
import path from 'path';
import fs from 'fs';

export class DocumentationGenerator {
  private ai: VertexAIClient;
  private templateManager: TemplateManager;
  private logger: Logger;
  private outputDir: string;

  constructor(outputDir: string) {
    debug('DocGen', 'Initializing DocumentationGenerator');
    this.ai = new VertexAIClient();
    this.templateManager = new TemplateManager();
    this.logger = new Logger();
    this.outputDir = outputDir;
  }

  async initialize() {
    debug('DocGen', 'Loading templates');
    await this.templateManager.initialize();
  }

  async generateDocumentation(context: EnhancedProjectContext, selectedTemplates: string[]) {
    debug('DocGen', 'Generating documentation with context:', {
      projectName: context.metadata.name,
      selectedTemplates
    });

    try {
      // Generate a context snapshot for documentation
      const snapshot = await ContextVisualizer.generateSnapshot(context);
      debug('DocGen', 'Generated context snapshot');

      // Generate documentation plan using enhanced context
      const plan = await this.generateDocumentationPlan(context, snapshot);
      debug('DocGen', 'Generated documentation plan:', plan);

      // Validate selected templates
      const validTemplates = await this.validateTemplates(selectedTemplates);
      if (validTemplates.length === 0) {
        throw new Error('No valid templates selected');
      }

      // Generate documents for each template
      const documents = await Promise.all(
        validTemplates.map(template =>
          this.generateDocument(template, context, plan)
        )
      );

      // Write documents to files
      await this.writeDocuments(context.metadata.name, validTemplates, documents);

      return {
        success: true,
        templates: validTemplates,
        documentCount: documents.length
      };
    } catch (error) {
      this.logger.error('Error generating documentation:', error);
      throw error;
    }
  }

  private async generateDocumentationPlan(
    context: EnhancedProjectContext,
    snapshot: any
  ): Promise<DocumentGenerationPlan> {
    const prompt = `Generate a documentation plan for ${context.metadata.name}.
Project Goals: ${context.metadata.goals}

Context Snapshot:
${JSON.stringify(snapshot, null, 2)}

System Context:
${JSON.stringify(context._system, null, 2)}

Return a JSON object with:
{
  "templates": TemplateConfig[],
  "structure": {
    "type": string,
    "files": string[],
    "relationships": Array<{ source: string, target: string, type: string }>
  },
  "metadata": {
    "projectType": string,
    "complexity": string,
    "priority": string
  }
}`;

    const response = await this.ai.generateContent({ prompt });
    return JSON.parse(response);
  }

  private async validateTemplates(templates: string[]): Promise<string[]> {
    const validTemplates = await Promise.all(
      templates.map(async template => {
        try {
          await this.templateManager.getTemplate(template);
          return template;
        } catch {
          debug('DocGen', `Invalid template: ${template}`);
          return null;
        }
      })
    );

    return validTemplates.filter((t): t is string => t !== null);
  }

  private async generateDocument(
    template: string,
    context: EnhancedProjectContext,
    plan: DocumentGenerationPlan
  ): Promise<string> {
    const templateContent = await this.templateManager.getTemplate(template);
    
    // Include relationship graph and contextual hints in generation
    const enhancedContext = {
      ...context,
      _system: {
        ...context._system,
        documentationPlan: plan
      }
    };

    return this.ai.generateDocument(templateContent, enhancedContext, template);
  }

  private async writeDocuments(
    projectName: string,
    templates: string[],
    documents: string[]
  ) {
    const docsDir = path.join(process.cwd(), 'context');
    
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    await Promise.all(
      templates.map((template, i) =>
        fs.promises.writeFile(
          path.join(docsDir, `${template}.md`),
          documents[i]
        )
      )
    );
  }
} 