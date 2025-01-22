import { ProjectType } from '../project-types/detector';
import { ProjectInitialContext } from '../../types';

export interface InsightCategory {
  key: string;
  label: string;
  description: string;
  required: boolean;
  contextHints?: string[];
}

export const insightCategories: Record<string, InsightCategory[]> = {
  innovative: [
    {
      key: 'technicalPatterns',
      label: 'Technical Patterns',
      description: 'Core technologies and implementation approaches',
      required: true,
      contextHints: [
        'Focus on novel or emerging technologies',
        'Consider integration patterns for innovative features',
        'Look for opportunities to leverage cutting-edge approaches'
      ]
    },
    {
      key: 'userNeeds',
      label: 'User Experience',
      description: 'User needs, emotions, and interaction patterns',
      required: true,
      contextHints: [
        'Identify emotional and experiential touchpoints',
        'Consider unexpected use cases and scenarios',
        'Look for opportunities to delight users'
      ]
    },
    {
      key: 'challenges',
      label: 'Innovation Challenges',
      description: 'Technical and experiential challenges to overcome',
      required: true,
      contextHints: [
        'Consider both technical and user experience challenges',
        'Identify potential barriers to adoption',
        'Look for areas requiring novel solutions'
      ]
    },
    {
      key: 'opportunities',
      label: 'Creative Opportunities',
      description: 'Potential areas for innovation and delight',
      required: true,
      contextHints: [
        'Focus on unique differentiators',
        'Consider unexpected benefits',
        'Look for ways to exceed user expectations'
      ]
    }
  ],
  
  utility: [
    {
      key: 'technicalPatterns',
      label: 'Technical Implementation',
      description: 'Core implementation patterns and approaches',
      required: true,
      contextHints: [
        'Focus on reliability and maintainability',
        'Consider scalability patterns',
        'Look for proven implementation approaches'
      ]
    },
    {
      key: 'requirements',
      label: 'Core Requirements',
      description: 'Essential functionality and constraints',
      required: true,
      contextHints: [
        'Identify must-have features',
        'Consider performance requirements',
        'Look for critical dependencies'
      ]
    },
    {
      key: 'performance',
      label: 'Performance Considerations',
      description: 'Performance requirements and optimizations',
      required: true,
      contextHints: [
        'Focus on efficiency and resource usage',
        'Consider scalability requirements',
        'Look for optimization opportunities'
      ]
    }
  ]
};

export const generateInsightsPrompt = (question: string, response: string, context: ProjectInitialContext) => {
  const projectType = context.type?.primaryType || 'undefined';
  const categories = insightCategories[projectType] || insightCategories.innovative;
  const contextualHints = categories
    .map(cat => cat.contextHints || [])
    .flat()
    .join('\n');

  return `
You are a technical insight analyzer.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Analyze the response thoroughly in the context of the project
3. Provide actionable insights that align with project goals
4. Keep insights focused and specific
5. Validate JSON structure before responding

Project Context:
Type: ${projectType}
Vision: ${context.vision?.summary || 'Not defined'}
Goals: ${context.vision?.goals?.join(', ') || 'Not defined'}

Context Considerations:
${contextualHints}

Question: ${question}
Response: ${response}

Required JSON Structure:
{
  "insights": [
    {
      "category": string,
      "key": string,
      "title": string,
      "description": string,
      "implications": string[],
      "recommendations": string[],
      "priority": "high|medium|low",
      "confidence": 0.0-1.0
    }
  ],
  "summary": {
    "keyThemes": string[],
    "criticalPaths": string[],
    "risks": string[],
    "opportunities": string[]
  }
}

Remember: Return ONLY the JSON object with no other text`;
};

export function getInsightsPrompt(context: ProjectInitialContext): string {
  const projectType = context.type?.primaryType || 'undefined';
  const categories = insightCategories[projectType] || insightCategories.innovative;
  
  return `You are a technical insight analyzer.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Analyze each category thoroughly
3. Provide actionable insights
4. Keep insights focused and specific
5. Validate JSON structure before responding

Project Context:
${JSON.stringify(context, null, 2)}

Required JSON Structure:
{
  "insights": [
    {
      "category": string,
      "key": string,
      "title": string,
      "description": string,
      "implications": string[],
      "recommendations": string[],
      "priority": "high|medium|low",
      "confidence": 0.0-1.0
    }
  ],
  "summary": {
    "keyThemes": string[],
    "criticalPaths": string[],
    "risks": string[],
    "opportunities": string[]
  }
}

Categories to Analyze:
${categories.map(cat => `- ${cat.label}: ${cat.description}
  Hints: ${cat.contextHints?.join(', ')}`).join('\n')}

Remember: Return ONLY the JSON object with no other text`;
}