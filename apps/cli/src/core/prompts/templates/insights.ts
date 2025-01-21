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

export const getInsightsPrompt = (context: ProjectInitialContext) => {
  const { name, goals, type, responses = {} } = context;
  const categories = insightCategories[type] || insightCategories.innovative;
  
  // Build category-specific prompts with context hints
  const categoryPrompts = categories.map(category => {
    const hints = category.contextHints?.length 
      ? `\nConsider:\n${category.contextHints.map(hint => `- ${hint}`).join('\n')}`
      : '';
    
    return `${category.label} (${category.key}):
${category.description}${hints}`;
  }).join('\n\n');

  // Include relevant user responses in the context
  const relevantResponses = Object.entries(responses)
    .filter(([key, value]) => value && typeof value === 'string')
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return `Analyze this ${type} project and extract key insights:

Project Name: ${name}
Project Goals: ${goals}
${relevantResponses ? `\nUser Input:\n${relevantResponses}` : ''}

Generate insights for each category below. Each insight should be specific, actionable, and relevant to the project context.

${categoryPrompts}

Return a JSON object with this structure:
{
  ${categories.map(category => `"${category.key}": ["insight1", "insight2", ...]`).join(',\n  ')}
}

IMPORTANT:
- Each insight should be specific to this project
- Keep insights concise (10-15 words)
- Ensure insights align with the project type (${type})
- Focus on actionable and relevant information
- Maintain valid JSON format with double quotes
- No trailing commas
- No comments or additional text`;
};