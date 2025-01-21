import { ProjectTypes } from '../../../types/core/project';

export const getProjectTypePrompt = (description: string, types: ProjectTypes) => `You are a project type analyzer. Your task is to analyze a project description and return a STRICTLY VALID JSON object.

Project Description: ${description}

Project Types:
${Object.entries(types).map(([type, info]) => 
  `- ${type}: ${info.description}
   Indicators: ${info.indicators.join(', ')}`
).join('\n')}

Instructions:
1. Analyze how well the project matches each type:
   - Learning: teaching focus, skills development, practice
   - Innovative: new experiences, creativity, novel approaches
   - Utility: specific tasks, tools, backend services
   - Automation: workflows, efficiency, integration

2. Return ONLY a JSON object with this EXACT structure:
{
  "primaryType": "innovative|utility|automation|learning",
  "confidence": 0.0-1.0,
  "reasons": ["reason1", "reason2"],
  "secondaryTypes": ["type1", "type2"],
  "analysis": {
    "learning": {
      "score": 0.0-1.0,
      "reasons": ["reason1", "reason2"]
    },
    "innovative": {
      "score": 0.0-1.0,
      "reasons": ["reason1", "reason2"]
    },
    "utility": {
      "score": 0.0-1.0,
      "reasons": ["reason1", "reason2"]
    },
    "automation": {
      "score": 0.0-1.0,
      "reasons": ["reason1", "reason2"]
    }
  }
}

IMPORTANT:
- Return ONLY the JSON object
- NO markdown code blocks
- NO explanations or additional text
- Ensure VALID JSON format
- Use DOUBLE QUOTES for strings
- Include ALL required fields`;
