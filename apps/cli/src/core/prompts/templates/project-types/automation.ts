export const automationTemplate = {
  type: 'automation',
  description: 'A project focused on automating workflows, processes, or repetitive tasks',
  characteristics: {
    focus: ['Process optimization', 'Integration', 'Efficiency'],
    strengths: ['Time savings', 'Error reduction', 'Consistency'],
    challenges: ['Process complexity', 'System integration', 'Change management']
  },
  contextualFeatures: {
    workflow: ['Process mapping', 'State management', 'Error recovery'],
    integration: ['API connections', 'Data transformation', 'Event handling'],
    monitoring: ['Progress tracking', 'Performance metrics', 'Alert systems']
  },
  suggestedTechnologies: {
    core: ['Node.js/Python', 'Message queues', 'Workflow engines'],
    integration: ['REST/GraphQL', 'WebHooks', 'OAuth'],
    monitoring: ['Prometheus', 'Grafana', 'ELK Stack']
  },
  commonPatterns: {
    architecture: ['Event-driven', 'Pipeline', 'State machine'],
    reliability: ['Retry logic', 'Dead letter queues', 'Circuit breakers'],
    scalability: ['Job queues', 'Worker pools', 'Distributed tasks']
  },
  promptTemplate: `Generate 3-4 focused questions that help understand the automation requirements and workflow.
Focus on process understanding and integration needs.

IMPORTANT: Return ONLY a JSON array of questions, with no markdown or other formatting.
Each question object in the array should have:
- id: unique identifier (string)
- question: the actual question text (string)
- type: one of 'workflow', 'integration', or 'monitoring' (string)
- required: true (boolean)
- contextHints: array of strings suggesting areas to explore
- expectedOutcome: string describing how this answer guides implementation

QUESTION PRINCIPLES:
- Understand current manual processes
- Identify integration points
- Consider error scenarios
- Focus on measurable improvements
- Plan for monitoring and maintenance

Example questions:
{
  "id": "workflow_001",
  "question": "What are the key steps in the current process that need automation?",
  "type": "workflow",
  "required": true,
  "contextHints": ["process steps", "decision points", "dependencies"],
  "expectedOutcome": "Clear map of workflow steps and automation opportunities"
}`,

  documentationTypes: [
    {
      type: 'engineering',
      focus: ['Technical architecture', 'Integration points', 'Error handling']
    },
    {
      type: 'workflow',
      focus: ['Process diagrams', 'State transitions', 'Error scenarios']
    },
    {
      type: 'operations',
      focus: ['Monitoring setup', 'Alert configuration', 'Maintenance procedures']
    }
  ],
  
  insightCategories: [
    {
      key: 'processAnalysis',
      label: 'Process Analysis',
      required: true,
      contextHints: ['current workflow', 'pain points', 'optimization opportunities']
    },
    {
      key: 'integrationNeeds',
      label: 'Integration Requirements',
      required: true,
      contextHints: ['systems involved', 'data flow', 'api requirements']
    },
    {
      key: 'successMetrics',
      label: 'Success Metrics',
      required: true,
      contextHints: ['time savings', 'error reduction', 'efficiency gains']
    }
  ]
};