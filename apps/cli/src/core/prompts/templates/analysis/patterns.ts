import { ProjectInitialContext } from '../../../../types';

export interface PatternAnalysis {
  design: {
    architectural: string[];
    behavioral: string[];
    structural: string[];
  };
  implementation: {
    common: string[];
    emerging: string[];
    antiPatterns: string[];
  };
  integration: {
    data: string[];
    service: string[];
    ui: string[];
  };
}

export const getPatternAnalysisPrompt = (context: ProjectInitialContext) => `You are a software architect analyzing design patterns.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Identify relevant design patterns
3. Consider implementation patterns
4. Analyze integration patterns
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

Required JSON Structure:
{
  "design": {
    "architectural": string[],
    "behavioral": string[],
    "structural": string[]
  },
  "implementation": {
    "common": string[],
    "emerging": string[],
    "antiPatterns": string[]
  },
  "integration": {
    "data": string[],
    "service": string[],
    "ui": string[]
  }
}

Remember: Return ONLY the JSON object with no other text`;
