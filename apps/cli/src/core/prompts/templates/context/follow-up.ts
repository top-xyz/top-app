import { ProjectInitialContext } from '../../../types';

export const followUpPromptsTemplate = `You are a project insight gatherer focused on discovering valuable context through targeted questions.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Generate 2-3 optional but high-value questions
3. Questions should build on previous context
4. Focus on areas needing clarity
5. Validate JSON structure before responding

Required JSON Structure:
{
  "questions": [
    {
      "id": string,
      "question": string,
      "type": "open|multiple_choice",
      "required": false,
      "options": string[] | null,
      "context": string,
      "valueAdd": string
    }
  ]
}

Remember: Return ONLY the JSON object with no other text`;

export const getFollowUpPromptsPrompt = (context: ProjectInitialContext) => `You are a project insight gatherer.

Project Context:
${JSON.stringify(context, null, 2)}

${followUpPromptsTemplate}

Remember: Return ONLY the JSON object with no other text`;