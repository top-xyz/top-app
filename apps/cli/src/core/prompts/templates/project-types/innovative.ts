export const innovativeTemplate = {
  type: 'innovative',
  description: 'A project focused on novel interactions, user experiences, or technological innovation',
  characteristics: {
    focus: ['User delight', 'Novel interactions', 'Creative solutions'],
    strengths: ['Unique experiences', 'Emotional engagement', 'Technical innovation'],
    challenges: ['Balance novelty with usability', 'Technical feasibility', 'User adoption']
  },
  contextualFeatures: {
    userExperience: ['Emotional resonance', 'Memorable moments', 'Intuitive flow'],
    technical: ['Modern frameworks', 'Real-time feedback', 'Smooth animations'],
    innovation: ['Novel interactions', 'Unique approaches', 'Creative solutions']
  },
  suggestedTechnologies: {
    frontend: ['React/Vue/Svelte', 'Three.js', 'Framer Motion'],
    backend: ['Node.js', 'WebSocket', 'GraphQL'],
    tools: ['Design systems', 'Prototyping tools', 'Analytics']
  },
  commonPatterns: {
    architecture: ['Component-based', 'Event-driven', 'State machines'],
    interaction: ['Gesture control', 'Voice commands', 'Haptic feedback'],
    feedback: ['Real-time updates', 'Progressive disclosure', 'Contextual help']
  },
  promptTemplate: `Generate 3-4 inspiring questions that explore the creative vision and innovative potential of this project.
Focus on questions that spark imagination and excitement about the possibilities.

IMPORTANT: Return ONLY a JSON array of questions, with no markdown or other formatting.
Each question object in the array should have:
- id: unique identifier (string)
- question: the actual question text (string)
- type: one of 'vision', 'innovation', 'experience', or 'delight' (string)
- required: true (boolean)
- contextHints: array of strings suggesting areas to explore
- expectedOutcome: string describing how this answer guides the project

QUESTION PRINCIPLES:
- Focus on the "what if" and "imagine if" possibilities
- Explore novel interactions and experiences
- Dive into emotional and experiential aspects
- Encourage thinking about unexpected use cases
- Consider both immediate and future potential

Example questions:
{
  "id": "vision_001",
  "question": "Imagine the most delightful interaction someone could have - what does that moment feel like?",
  "type": "vision",
  "required": true,
  "contextHints": ["emotional impact", "user journey", "memorable moments"],
  "expectedOutcome": "Understanding core emotional experiences to design around"
}`,

  documentationTypes: [
    {
      type: 'engineering',
      focus: ['Technical architecture', 'Implementation approach', 'Performance considerations']
    },
    {
      type: 'design',
      focus: ['User experience', 'Interface design', 'Interaction patterns']
    },
    {
      type: 'marketing',
      focus: ['Unique value proposition', 'User benefits', 'Market positioning']
    },
    {
      type: 'brainstorm',
      focus: ['Creative possibilities', 'Feature ideas', 'Future potential']
    }
  ],
  
  insightCategories: [
    {
      key: 'userExperience',
      label: 'User Experience',
      required: true,
      contextHints: ['emotional impact', 'interaction patterns', 'user journey']
    },
    {
      key: 'technicalInnovation',
      label: 'Technical Innovation',
      required: true,
      contextHints: ['novel approaches', 'emerging technologies', 'creative solutions']
    },
    {
      key: 'marketPotential',
      label: 'Market Potential',
      required: false,
      contextHints: ['target audience', 'competitive advantage', 'growth opportunities']
    }
  ]
};