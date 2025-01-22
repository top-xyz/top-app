import { debug } from '../../utils/debug';
import { VertexAIClient } from '../client/vertex-ai';
import { EnhancedProjectContext } from '../../types/core/context';
import { DocumentSection, DocumentStructure, GeneratedDocument } from '../../types/core/documentation';
import { getDocumentStructurePrompt } from '../prompts/templates/documentation/structure';
import { getDocumentContentPrompt } from '../prompts/templates/documentation/content';
import { ContextVisualizer } from '../../utils/context-visualizer';
import { Logger } from '../../utils/logger';
import path from 'path';
import fs from 'fs';

export class DocumentationGenerator {
  private logger: Logger;
  private outputDir: string;

  constructor(
    private ai: VertexAIClient,
    outputDir: string
  ) {
    debug('DocGen', 'Initializing DocumentationGenerator');
    this.logger = new Logger();
    this.outputDir = outputDir;
  }

  async initialize() {
    debug('DocGen', 'Ensuring output directory exists');
    await fs.promises.mkdir(this.outputDir, { recursive: true });
  }

  async generateDocumentation(context: EnhancedProjectContext): Promise<GeneratedDocument> {
    debug('DocGen', 'Generating documentation with context:', {
      projectName: context.name,
      projectType: context.type
    });

    try {
      // Step 1: Generate context snapshot for better LLM understanding
      const snapshot = await ContextVisualizer.generateSnapshot(context);
      debug('DocGen', 'Generated context snapshot');

      // Step 2: Get ideal document structure from LLM
      const structure = await this.generateDocumentStructure(context, snapshot);
      debug('DocGen', 'Generated document structure:', structure);

      // Step 3: Generate content for each section
      const content = await this.generateDocumentContent(context, structure);
      debug('DocGen', 'Generated document content');

      // Step 4: Save documentation
      const document: GeneratedDocument = {
        content,
        structure,
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
          context: {
            projectType: context.type?.primaryType || 'unknown',
            technicalStack: context.insights?.technicalPatterns || []
          }
        }
      };

      await this.saveDocumentation(document);
      return document;
    } catch (error) {
      debug('DocGen', 'Error generating documentation:', error);
      throw error;
    }
  }

  private async generateDocumentStructure(
    context: EnhancedProjectContext,
    snapshot: any
  ): Promise<DocumentStructure> {
    const prompt = getDocumentStructurePrompt(context, snapshot);

    const response = await this.ai.generateContent({
      prompt,
      type: 'structured',
      temperature: 0.7
    });

    return JSON.parse(response);
  }

  private async generateDocumentContent(
    context: EnhancedProjectContext,
    structure: DocumentStructure
  ): Promise<string> {
    const generateSectionContent = async (section: DocumentSection, depth: number = 0): Promise<string> => {
      const prompt = getDocumentContentPrompt(context, section, structure, depth);

      const content = await this.ai.generateContent({
        prompt,
        type: 'text',
        temperature: 0.5
      });

      let sectionContent = '#'.repeat(depth + 1) + ' ' + section.title + '\n\n' + content;

      if (section.subsections?.length) {
        for (const subsection of section.subsections) {
          sectionContent += '\n\n' + await generateSectionContent(subsection, depth + 1);
        }
      }

      return sectionContent;
    };

    let fullContent = `# ${context.name} Documentation\n\n`;
    
    for (const section of structure.sections) {
      fullContent += await generateSectionContent(section) + '\n\n';
    }

    return fullContent;
  }

  private async saveDocumentation(doc: GeneratedDocument) {
    const outputPath = path.join(this.outputDir, 'documentation.md');
    await fs.promises.writeFile(outputPath, doc.content, 'utf8');
    
    // Save metadata separately
    const metaPath = path.join(this.outputDir, 'documentation.meta.json');
    await fs.promises.writeFile(
      metaPath,
      JSON.stringify({ structure: doc.structure, metadata: doc.metadata }, null, 2),
      'utf8'
    );

    debug('DocGen', 'Documentation saved to:', outputPath);
  }
}