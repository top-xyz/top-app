import { ProjectInitialContext } from '../../../types';

export const followUpPromptsTemplate = `Generate 2-3 follow-up questions that would help clarify any remaining aspects.
These should be optional but valuable questions based on the previous responses.

Format as JSON array with the same structure as initial prompts, but set required: false.
Focus on areas that need more clarity or could add value to the project documentation.`;

export const getFollowUpPromptsPrompt = (context: ProjectInitialContext) => `Based on the project context:
Name: ${context.name}
Goals: ${context.goals}
Previous Responses: ${JSON.stringify(context.responses, null, 2)}

${followUpPromptsTemplate}`; 