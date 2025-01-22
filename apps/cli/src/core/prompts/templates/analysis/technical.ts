import { ProjectInitialContext } from '../../../../types';

export interface TechnicalAnalysis {
  patterns: {
    architecture: string[];
    dataFlow: string[];
    integration: string[];
  };
  requirements: {
    core: string[];
    optional: string[];
    future: string[];
  };
  constraints: {
    technical: string[];
    resource: string[];
    timeline: string[];
  };
}

export const getTechnicalAnalysisPrompt = (context: ProjectInitialContext) => `You are a technical architect analyzing project requirements.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Analyze technical patterns and requirements
3. Identify constraints and limitations
4. Consider scalability and maintenance
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

Required JSON Structure:
{
  "patterns": {
    "architecture": string[],
    "dataFlow": string[],
    "integration": string[]
  },
  "requirements": {
    "core": string[],
    "optional": string[],
    "future": string[]
  },
  "constraints": {
    "technical": string[],
    "resource": string[],
    "timeline": string[]
  }
}

Remember: Return ONLY the JSON object with no other text`;
