import { ProjectInitialContext } from '../../../../types';
import { ErgonomicProfile } from '../../../../types/core/flow';

export const getErgonomicProfilePrompt = (context: ProjectInitialContext) => `You are analyzing the ergonomic profile of project interactions.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Evaluate interaction presence and balance
3. Consider learning curves and mastery paths
4. Assess adaptability and flexibility
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

Required JSON Structure:
{
  "presence": {
    "nature": {
      "presence": string,
      "power": string,
      "complexity": string
    },
    "flow": {
      "learning": string,
      "mastery": string,
      "rhythm": string
    }
  },
  "balance": {
    "harmony": {
      "simplicity": string,
      "capability": string,
      "flexibility": string
    },
    "adaptation": {
      "context": string,
      "response": string,
      "evolution": string
    }
  }
}

Remember: Return ONLY the JSON object with no other text`;
