import { ProjectInitialContext } from '../../../types';

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