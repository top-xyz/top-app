export const utilityTemplate = {
  type: 'utility',
  description: 'A focused utility, script, or backend service with clear functional requirements',
  characteristics: {
    focus: ['Core functionality', 'Performance', 'Reliability'],
    strengths: ['Focused scope', 'Clear requirements', 'Measurable outcomes'],
    challenges: ['Edge cases', 'Error handling', 'Maintainability']
  },
  contextualFeatures: {
    functional: ['Core operations', 'Data handling', 'Error recovery'],
    technical: ['Performance optimization', 'Resource management', 'Security'],
    quality: ['Reliability', 'Maintainability', 'Testability']
  },
  suggestedTechnologies: {
    backend: ['Node.js/Python/Go', 'SQL/NoSQL', 'Redis/Memcached'],
    tools: ['Docker', 'PM2', 'Monitoring tools'],
    testing: ['Jest/Mocha', 'Load testing', 'Integration tests']
  },
  commonPatterns: {
    architecture: ['Microservices', 'Event-driven', 'Data pipelines'],
    reliability: ['Circuit breakers', 'Retry logic', 'Fallback handlers'],
    optimization: ['Caching', 'Connection pooling', 'Batch processing']
  },
  promptTemplate: `Generate 2-3 targeted questions that help clarify the core functionality and requirements.
Focus on understanding the essential features and constraints.

IMPORTANT: Return ONLY a JSON array of questions, with no markdown or other formatting.
Each question object in the array should have:
- id: unique identifier (string)
- question: the actual question text (string)
- type: one of 'core', 'interface', or 'constraints' (string)
- required: true (boolean)
- contextHints: array of strings suggesting areas to explore
- expectedOutcome: string describing how this answer guides implementation

QUESTION PRINCIPLES:
- Focus on core functionality and requirements
- Clarify input/output expectations
- Understand performance needs
- Identify critical dependencies
- Consider scalability and maintenance

Example questions:
{
  "id": "core_001",
  "question": "What are the essential inputs and outputs this utility needs to handle?",
  "type": "core",
  "required": true,
  "contextHints": ["data formats", "volume expectations", "processing requirements"],
  "expectedOutcome": "Clear understanding of data flow and processing requirements"
}`,

  documentationTypes: [
    {
      type: 'engineering',
      focus: ['Technical specifications', 'Performance requirements', 'Error handling']
    },
    {
      type: 'api',
      focus: ['Interface definitions', 'Usage examples', 'Error responses']
    }
  ],
  
  insightCategories: [
    {
      key: 'functionalRequirements',
      label: 'Functional Requirements',
      required: true,
      contextHints: ['core features', 'data handling', 'processing logic']
    },
    {
      key: 'performanceMetrics',
      label: 'Performance Metrics',
      required: true,
      contextHints: ['response times', 'throughput', 'resource usage']
    },
    {
      key: 'reliability',
      label: 'Reliability Requirements',
      required: true,
      contextHints: ['error handling', 'recovery strategies', 'monitoring']
    }
  ]
};