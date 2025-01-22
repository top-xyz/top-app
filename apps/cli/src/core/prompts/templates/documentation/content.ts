import { ProjectInitialContext } from '../../../../types';
import { DocumentSection, DocumentStructure } from '../../../../types/core/documentation';

export const getDocumentContentPrompt = (
  context: ProjectInitialContext,
  section: DocumentSection,
  structure: DocumentStructure,
  depth: number = 0
) => `You are generating documentation content for a specific section.

IMPORTANT INSTRUCTIONS:
1. Return ONLY markdown content with NO additional formatting
2. Content must be comprehensive and clear
3. Include practical examples where relevant
4. Follow section requirements and topics
5. Maintain consistent depth and detail level

Project Context:
${JSON.stringify(context, null, 2)}

Section:
${JSON.stringify(section, null, 2)}

Structure Context:
${JSON.stringify(structure, null, 2)}

Section Depth: ${depth}

Remember: Return ONLY markdown content, no JSON or other formatting`;
