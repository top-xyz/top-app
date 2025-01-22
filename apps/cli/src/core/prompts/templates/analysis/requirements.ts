import { ProjectInitialContext } from '../../../../types';

export interface RequirementsAnalysis {
  functional: {
    core: string[];
    optional: string[];
    future: string[];
  };
  nonFunctional: {
    performance: string[];
    security: string[];
    scalability: string[];
    maintainability: string[];
  };
  dependencies: {
    external: string[];
    internal: string[];
    tools: string[];
  };
}

export const getRequirementsAnalysisPrompt = (context: ProjectInitialContext) => `You are a requirements analyst focusing on project needs.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Analyze functional and non-functional requirements
3. Identify dependencies and integrations
4. Consider project constraints
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

Required JSON Structure:
{
  "functional": {
    "core": string[],
    "optional": string[],
    "future": string[]
  },
  "nonFunctional": {
    "performance": string[],
    "security": string[],
    "scalability": string[],
    "maintainability": string[]
  },
  "dependencies": {
    "external": string[],
    "internal": string[],
    "tools": string[]
  }
}

Remember: Return ONLY the JSON object with no other text`;
