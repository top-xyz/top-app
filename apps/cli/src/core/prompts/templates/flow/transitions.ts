import { ProjectInitialContext } from '../../../../types';
import { FlowTransition } from '../../../../types/core/flow';

export const getFlowTransitionPrompt = (
  context: ProjectInitialContext,
  currentState: string,
  targetState: string
) => `You are analyzing state transitions in the project creation flow.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Analyze the transition between states
3. Consider energy and momentum
4. Map interaction patterns
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

Current State: ${currentState}
Target State: ${targetState}

Required JSON Structure:
{
  "transition": {
    "from": {
      // FlowState structure
    },
    "to": {
      // FlowState structure
    },
    "pattern": {
      "type": string,
      "triggers": string[],
      "responses": string[],
      "adaptations": string[],
      "nextStates": string[]
    },
    "energy": number
  }
}

Remember: Return ONLY the JSON object with no other text`;
