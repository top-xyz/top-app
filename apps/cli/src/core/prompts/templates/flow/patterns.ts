import { ProjectInitialContext } from '../../../../types';
import { InteractionPattern } from '../../../../types/core/flow';

export const getInteractionPatternsPrompt = (context: ProjectInitialContext) => `You are analyzing interaction patterns in the project creation flow.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Identify key interaction patterns
3. Consider triggers and responses
4. Map possible state transitions
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

Required JSON Structure:
{
  "patterns": [
    {
      "type": "creation" | "refinement" | "transformation" | "completion",
      "triggers": string[],
      "responses": string[],
      "adaptations": string[],
      "nextStates": string[]
    }
  ]
}

Remember: Return ONLY the JSON object with no other text`;
