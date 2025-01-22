export const learningTemplate = {
  type: 'learning',
  description: 'A project focused on education, skill development, or knowledge transfer',
  characteristics: {
    focus: ['Knowledge transfer', 'Skill development', 'Engagement'],
    strengths: ['Interactive learning', 'Progress tracking', 'Feedback loops'],
    challenges: ['Learning curve', 'Engagement', 'Assessment accuracy']
  },
  contextualFeatures: {
    pedagogical: ['Learning paths', 'Content structure', 'Assessment methods'],
    engagement: ['Interactive elements', 'Progress tracking', 'Rewards system'],
    feedback: ['Assessment tools', 'Performance metrics', 'Improvement suggestions']
  },
  suggestedTechnologies: {
    frontend: ['React/Vue', 'Interactive content', 'Visualization tools'],
    backend: ['Node.js/Python', 'Learning analytics', 'Progress tracking'],
    tools: ['Assessment engines', 'Content management', 'Analytics']
  },
  commonPatterns: {
    learning: ['Spaced repetition', 'Progressive difficulty', 'Active recall'],
    engagement: ['Gamification', 'Social learning', 'Achievement system'],
    assessment: ['Skill mapping', 'Progress tracking', 'Performance analytics']
  },
  promptTemplate: `Generate 3-4 focused questions that help understand the learning objectives and approach.
Focus on educational goals and engagement strategies.

IMPORTANT: Return ONLY a JSON array of questions, with no markdown or other formatting.
Each question object in the array should have:
- id: unique identifier (string)
- question: the actual question text (string)
- type: one of 'objectives', 'engagement', or 'assessment' (string)
- required: true (boolean)
- contextHints: array of strings suggesting areas to explore
- expectedOutcome: string describing how this answer guides implementation

QUESTION PRINCIPLES:
- Understand learning objectives
- Consider engagement strategies
- Plan assessment methods
- Focus on user progress
- Design feedback loops

Example questions:
{
  "id": "objectives_001",
  "question": "What specific skills or knowledge should users gain from this experience?",
  "type": "objectives",
  "required": true,
  "contextHints": ["learning outcomes", "skill progression", "success criteria"],
  "expectedOutcome": "Clear definition of learning objectives and success metrics"
}`,

  documentationTypes: [
    {
      type: 'curriculum',
      focus: ['Learning objectives', 'Content structure', 'Assessment criteria']
    },
    {
      type: 'engineering',
      focus: ['Technical architecture', 'Interactive features', 'Progress tracking']
    },
    {
      type: 'user',
      focus: ['Learning paths', 'Progress tracking', 'Help documentation']
    }
  ],
  
  insightCategories: [
    {
      key: 'learningObjectives',
      label: 'Learning Objectives',
      required: true,
      contextHints: ['skills targeted', 'knowledge areas', 'success criteria']
    },
    {
      key: 'engagementStrategies',
      label: 'Engagement Strategies',
      required: true,
      contextHints: ['interaction methods', 'motivation factors', 'retention techniques']
    },
    {
      key: 'assessmentMethods',
      label: 'Assessment Methods',
      required: true,
      contextHints: ['progress tracking', 'skill evaluation', 'feedback mechanisms']
    }
  ]
};