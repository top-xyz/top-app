import { detectProjectType, ProjectType } from '../project/types/detector';
import { innovativeTemplate } from '../project/types/innovative';
import { utilityTemplate } from '../project/types/utility';
import { automationTemplate } from '../project/types/automation';
import { learningTemplate } from '../project/types/learning';

const projectTypes = [innovativeTemplate, utilityTemplate, automationTemplate, learningTemplate];

export const initialPromptsTemplate = `You are helping guide the creation of a new project. Your task is to generate insightful questions that build project context.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Questions should progress from core concepts to implementation details
3. Each question should build on previous context
4. Keep questions open-ended but specific
5. Validate JSON structure before responding
6. Return NO MORE THAN 3 required questions
7. Additional questions should be marked as optional (required: false)

Required JSON Structure:
{
  "questions": [
    {
      "id": "q1",
      "question": "Clear, engaging question text",
      "type": "open|multiple_choice",
      "required": true|false,
      "options": ["option1", "option2"] | null,
      "context": "Why this question matters"
    }
  ]
}

Question Guidelines:
1. Core Functionality: What unique value does this create?
2. User Experience: How should it feel to use?
3. Technical Approach: What key technologies enable this?
4. Growth Vector: How might this evolve?

Remember: Return ONLY the JSON object with no other text`;

export const getInitialPromptsPrompt = (context: any): string => {
  const projectType = context.type?.primaryType || 'undefined';
  const projectName = context.name || 'unnamed project';
  const projectDesc = context.description || '';

  return `You are helping guide the creation of ${projectName}, a ${projectType} project.

Project Description: ${projectDesc}

${initialPromptsTemplate}

Remember: Return ONLY the JSON object with no other text`;
};