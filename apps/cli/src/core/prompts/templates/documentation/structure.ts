import { ProjectInitialContext } from '../../../../types';
import { DocumentStructure } from '../../../../types/core/documentation';

export const getDocumentStructurePrompt = (context: ProjectInitialContext) => `You are a technical writer designing documentation structure.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Create comprehensive structure
3. Consider all audience types
4. Include all necessary sections
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

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
