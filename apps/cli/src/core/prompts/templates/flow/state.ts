import { ProjectInitialContext } from '../../../../types';
import { FlowState } from '../../../../types/core/flow';

export const getFlowStatePrompt = (context: ProjectInitialContext) => `You are analyzing the current flow state of project creation.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Analyze the current state of project flow
3. Consider all four elements: intention, conversation, manifestation, and momentum
4. Evaluate energy and stability levels
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

Required JSON Structure:
{
  "intention": {
    "essence": string,
    "vision": string,
    "constraints": string[],
    "energy": number
  },
  "conversation": {
    "direction": string,
    "understanding": string[],
    "transformation": string[]
  },
  "manifestation": {
    "form": string,
    "structure": string[],
    "stability": number
  },
  "momentum": {
    "direction": string,
    "force": number,
    "adaptation": string[]
  }
}

Remember: Return ONLY the JSON object with no other text`;
