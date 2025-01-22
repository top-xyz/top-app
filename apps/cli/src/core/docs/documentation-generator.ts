import { debug } from '../../utils/debug';
import { VertexAIClient } from '../client/vertex-ai';
import { EnhancedProjectContext } from '../../types/core/context';
import { DocumentCategory, DocumentFile, DocumentStructure, GeneratedDocument } from '../../types/core/documentation';
import { getDocumentStructurePrompt } from '../prompts/templates/documentation/structure';
import { getDocumentContentPrompt } from '../prompts/templates/documentation/content';
import { ContextVisualizer } from '../../utils/context-visualizer';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class DocumentationGenerator {
  private ai: VertexAIClient;
  private context: any;
  private outputDir: string;

  constructor(ai: VertexAIClient, context: any) {
    this.ai = ai;
    this.context = context;
    this.outputDir = path.join(process.cwd(), 'ctx');
  }

  private filterContext(context: any): any {
    // Extract only essential information to reduce token count
    return {
      project: {
        name: context.name,
        description: context.description,
        type: context?.metadata?.projectType?.primaryType || 'unknown'
      },
      technical: {
        platform: context?.vision?.platformRequirements?.primary,
        requirements: context?.vision?.technicalRequirements?.core?.slice(0, 3) || [],
        integrations: context?.vision?.integrationRequirements?.apis?.slice(0, 2) || []
      },
      ux: context?.vision?.userExperienceElements?.keyInteractions || []
    };
  }

  private getEssentialDocSections(): { category: string; files: string[] }[] {
    return [
      {
        category: 'overview',
        files: ['README.md', 'ARCHITECTURE.md', 'CONTRIBUTING.md']
      },
      {
        category: 'requirements',
        files: ['requirements/functional.md', 'requirements/non-functional.md', 'requirements/constraints.md']
      },
      {
        category: 'architecture',
        files: [
          'architecture/overview.md',
          'architecture/components.md',
          'architecture/data-model.md',
          'architecture/interfaces.md'
        ]
      },
      {
        category: 'development',
        files: [
          'development/setup.md',
          'development/workflow.md',
          'development/guidelines.md',
          'development/testing.md'
        ]
      },
      {
        category: 'deployment',
        files: ['deployment/environments.md', 'deployment/configuration.md', 'deployment/monitoring.md']
      }
    ];
  }

  private async generateDocFile(filePath: string, context: any): Promise<string> {
    const fileInfo = {
      path: filePath,
      category: path.dirname(filePath),
      name: path.basename(filePath, '.md'),
      type: 'markdown'
    };

    const prompt = `Generate comprehensive documentation for ${fileInfo.name} in the ${fileInfo.category} category.
Use this project context:
${JSON.stringify(context, null, 2)}

Requirements:
- Focus on ${fileInfo.category}-specific content
- Use clear, technical language
- Include practical examples where relevant
- Format in markdown
- Keep sections focused and concise
- Include relevant diagrams in mermaid syntax if needed

Output a single markdown file with appropriate sections and content.`;

    try {
      return await this.ai.generateContent({
        type: 'text',
        temperature: 0.7,
        maxTokens: 4096, // Smaller token limit per file
        model: 'gemini-pro',
        prompt
      });
    } catch (error) {
      debug('DocGen', `Error generating ${filePath}:`, error);
      throw error;
    }
  }

  private async writeDocFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.outputDir, filePath);
    await fs.promises.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.promises.writeFile(fullPath, content, 'utf-8');
    debug('DocGen', `Written ${filePath}`);
  }

  public async generateDocumentation(): Promise<void> {
    debug('DocGen', 'Initializing DocumentationGenerator');
    debug('DocGen', 'Context set');

    const sections = this.getEssentialDocSections();
    const generatedFiles: string[] = [];

    for (const section of sections) {
      debug('DocGen', `Generating ${section.category} documentation`);
      
      for (const file of section.files) {
        try {
          const content = await this.generateDocFile(file, this.filterContext(this.context));
          await this.writeDocFile(file, content);
          generatedFiles.push(file);
        } catch (error) {
          debug('DocGen', `Error generating ${file}:`, error);
          // Continue with other files even if one fails
        }
      }
    }

    debug('DocGen', 'Documentation generation complete');
    console.log('\n📂 Documentation Overview');
    console.log('Your project documentation is organized into the following sections:\n');
    
    // Group and display files by category
    const filesByCategory = generatedFiles.reduce((acc, file) => {
      const category = path.dirname(file);
      if (!acc[category]) acc[category] = [];
      acc[category].push(path.basename(file));
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(filesByCategory).forEach(([category, files]) => {
      console.log(`${category}/`);
      files.forEach(file => console.log(`  └─ ${file}`));
      console.log('');
    });
  }
}