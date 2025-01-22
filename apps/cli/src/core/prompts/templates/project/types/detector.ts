import { ProjectType } from '../../../../../types/core/project';

export const getProjectTypePrompt = (description: string) => `You are analyzing a project description to determine its type.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Analyze the description carefully
3. Consider project goals and objectives
4. Match against defined project types
5. Validate JSON structure before responding

Project Description:
${description}

Project Types:
- innovative: Novel solutions, cutting-edge technology, unique approaches
- utility: Helper tools, libraries, plugins, extensions
- automation: Process automation, workflow optimization, task scheduling
- learning: Educational projects, tutorials, practice exercises

Required JSON Structure:
{
  "type": "innovative|utility|automation|learning",
  "confidence": number (0-1),
  "reasoning": string[],
  "recommendations": string[]
}

Remember: Return ONLY the JSON object with no other text`;

export const detectProjectType = (description: string): ProjectType => {
  // Simple detection logic - will be enhanced with AI
  const lowerDesc = description.toLowerCase();
  
  if (lowerDesc.includes('learn') || lowerDesc.includes('study') || lowerDesc.includes('practice')) {
    return 'learning';
  }
  
  if (lowerDesc.includes('automate') || lowerDesc.includes('workflow') || lowerDesc.includes('process')) {
    return 'automation';
  }
  
  if (lowerDesc.includes('utility') || lowerDesc.includes('tool') || lowerDesc.includes('helper')) {
    return 'utility';
  }
  
  // Default to innovative for other cases
  return 'innovative';
};

export type { ProjectType };
