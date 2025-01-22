import { EnhancedProjectContext } from '../../../../types';
import { DocumentSection, DocumentStructure } from '../../../../types/core/documentation';

export const getDocumentContentPrompt = (
  context: EnhancedProjectContext,
  section: any,
  structure: DocumentStructure,
  depth: number = 0
): string => {
  const contextInfo = {
    projectName: context?.name || 'unnamed-project',
    projectType: context?.type?.primaryType || 'unknown',
    description: context?.description || 'No description available'
  };

  const sectionInfo = {
    title: section.title,
    key: section.key,
    required: section.required,
    audience: section.audience,
    priority: section.priority,
    coverage: section.coverage,
    requiredTopics: section.requiredTopics
  };

  return `You are helping to generate documentation for ${contextInfo.projectName}, a ${contextInfo.projectType} project.

Project Description: ${contextInfo.description}

Generate content for the following section:
${JSON.stringify(sectionInfo, null, 2)}

IMPORTANT INSTRUCTIONS:
1. Return ONLY the markdown content with NO code blocks or additional formatting
2. Content should be comprehensive but concise
3. Use clear headings and bullet points for readability
4. Include all required topics from section.requiredTopics
5. Focus on the specified audience
6. Maintain consistent tone and style
7. Include practical examples and code snippets where relevant
8. Add links to related sections if applicable

Remember: Return ONLY the markdown content with no code blocks or additional formatting`;
};
