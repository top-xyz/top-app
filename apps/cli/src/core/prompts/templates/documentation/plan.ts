import { ProjectInitialContext, EnhancedProjectContext } from '../../../types';
import { DocumentStructure } from '../../../types/core/documentation';

export const documentationPlanTemplate = `You are a technical documentation architect. Your task is to design a documentation structure that comprehensively covers all aspects needed to achieve the project's goals and vision.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Documentation must thoroughly address:
   - All project goals and objectives
   - Technical implementation details
   - User-facing features and interactions
   - Development and deployment processes
   - Future growth and maintenance needs
3. Consider all stakeholder needs:
   - Developers (setup, architecture, APIs)
   - Users (features, guides, tutorials)
   - Maintainers (processes, standards)
   - Contributors (guidelines, workflows)
4. Structure for maintainability and clarity
5. Validate JSON structure before responding

Required JSON Structure:
{
  "templates": string[],
  "structure": {
    "root": string,
    "sections": {
      [key: string]: string[]
    }
  },
  "metadata": {
    "projectType": string,
    "complexity": "low|medium|high",
    "priority": "low|medium|high",
    "audience": string[],
    "coverage": {
      "technical": string[],
      "functional": string[],
      "process": string[]
    }
  }
}

Remember: Return ONLY the JSON object with no other text`;

export const getDocumentationPlanPrompt = (context: ProjectInitialContext) => `You are a technical documentation architect.

Project Context:
${JSON.stringify(context, null, 2)}

${documentationPlanTemplate}

Remember: Return ONLY the JSON object with no other text`;

export const getDocumentStructurePrompt = (context: EnhancedProjectContext, snapshot: any) => `You are a technical writer and software architect designing documentation structure.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Documentation must comprehensively cover:
   - Project vision and goals
   - Technical architecture and implementation
   - Development and deployment workflows
   - User guides and tutorials
   - Maintenance and scaling procedures
3. Consider all audience types and skill levels
4. Ensure documentation supports project growth
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(snapshot, null, 2)}

Required JSON Structure:
{
  "sections": [
    {
      "title": string,
      "key": string,
      "required": boolean,
      "audience": string[],
      "priority": "high|medium|low",
      "coverage": {
        "goals": string[],
        "requirements": string[]
      },
      "subsections": [
        {
          "title": string,
          "key": string,
          "template": string,
          "requiredTopics": string[]
        }
      ]
    }
  ],
  "metadata": {
    "generatedAt": string,
    "version": string,
    "projectType": string,
    "completeness": {
      "technical": number,
      "functional": number,
      "process": number
    }
  }
}

Remember: Return ONLY the JSON object with no other text`;

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

export const documentGenerationTemplate = `You are generating documentation content based on a specific template.

IMPORTANT INSTRUCTIONS:
1. Return ONLY markdown content
2. Content must comprehensively cover:
   - All specified requirements
   - Technical implementation details
   - User workflows and interactions
   - Setup and deployment steps
   - Maintenance procedures
3. Include practical examples and use cases
4. Provide clear, actionable information
5. Follow markdown best practices

Remember: Return ONLY markdown content, no JSON or other formatting`;

export const getDocumentGenerationPrompt = (context: ProjectInitialContext, template: string, type: string) => 
`You are generating comprehensive ${type} documentation.

Project Context:
${JSON.stringify(context, null, 2)}

Template:
${template}

${documentGenerationTemplate}`;