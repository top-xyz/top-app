import { ProjectInitialContext, EnhancedProjectContext } from '../../../types';
import { DocumentStructure } from '../../../types/core/documentation';

export const documentationPlanTemplate = `Generate a comprehensive documentation plan that covers all aspects of the project.
Consider the project type, goals, and all responses provided.

IMPORTANT: You must return ONLY a valid JSON object with this exact structure, and nothing else:
{
  "templates": ["engineering", "design", "marketing", "sales", "brainstorm"],
  "structure": {
    "root": "docs",
    "sections": {
      "engineering": ["architecture", "api", "setup"],
      "design": ["ui", "ux", "components"],
      "marketing": ["overview", "features", "benefits"],
      "sales": ["pricing", "comparison", "roi"],
      "brainstorm": ["ideas", "future", "notes"]
    }
  },
  "metadata": {
    "projectType": "web-application",
    "complexity": "medium",
    "priority": "high"
  }
}

Do not include any explanations, notes, or additional text. Return only the JSON object.`;

export const getDocumentationPlanPrompt = (context: ProjectInitialContext) => `Based on the complete project context:
${JSON.stringify(context, null, 2)}

${documentationPlanTemplate}`;

export const getDocumentStructurePrompt = (context: EnhancedProjectContext, snapshot: any) => `As an expert technical writer and software architect, analyze this project and suggest an ideal documentation structure.

Project Context:
${JSON.stringify(snapshot, null, 2)}

Requirements:
1. Structure should be comprehensive yet focused on what's most important for this specific project type
2. Consider the technical complexity and user needs
3. Include sections for both technical and non-technical audiences
4. Adapt depth based on project scope
5. Include relevant sections for ${context.type?.primaryType || 'modern'} projects

Return a JSON structure with:
{
  "sections": [{
    "title": string,
    "key": string,
    "required": boolean,
    "description": string,
    "subsections": [same structure]
  }],
  "metadata": {
    "style": string,
    "audience": string[],
    "purpose": string,
    "format": string
  }
}`;

export const getSectionContentPrompt = (
  context: EnhancedProjectContext,
  section: DocumentStructure['sections'][0],
  structure: DocumentStructure,
  depth: number = 0
) => `Generate content for the following documentation section:

Section: ${section.title}
Description: ${section.description}
Project Context:
- Name: ${context.name}
- Type: ${context.type?.primaryType}
- Technical Patterns: ${context.insights?.technicalPatterns?.join(', ')}
- User Needs: ${context.insights?.userNeeds?.join(', ')}
- Vision: ${context.description}

Requirements:
1. Be specific to this project's context
2. Use concrete examples where possible
3. Follow ${structure.metadata.style} style
4. Target audience: ${structure.metadata.audience.join(', ')}
5. Keep content focused and actionable

Return the content in Markdown format.`;

export const documentGenerationTemplate = `Requirements:
1. Return ONLY markdown content, no JSON or other formatting
2. Include all sections from the template
3. Replace all placeholders (e.g. {project_name}, {architecture_overview}) with generated content
4. Be specific to the project context
5. Include relevant technical details, examples, or diagrams as needed
6. Use proper markdown formatting (headers, lists, code blocks, etc.)`;

export const getDocumentGenerationPrompt = (
  context: ProjectInitialContext,
  template: string,
  type: string
) => `Generate a markdown document for ${context.name} of type "${type}".
Use the following context to generate comprehensive and specific content:
${JSON.stringify(context, null, 2)}

Use this template structure:
${template}

${documentGenerationTemplate}`;