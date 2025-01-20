import { innovativeTemplate } from './innovative';
import { utilityTemplate } from './utility';
import { automationTemplate } from './automation';
import { learningTemplate } from './learning';
import { debug } from '../../../../utils/debug';
import { VertexAIClient } from '../../../../utils/vertex-ai';

const projectTypes = [innovativeTemplate, utilityTemplate, automationTemplate, learningTemplate];

export interface ProjectTypeSignal {
  type: string;
  confidence: number;
  reasons: string[];
}

export interface ProjectType {
  type: string;
  description: string;
  promptTemplate: string;
  documentationTypes: string[];
  features?: string[];
  suggestedTechnologies?: string[];
  commonPatterns?: string[];
}

export const detectProjectType = async (ai: VertexAIClient, name: string, goals: string): Promise<ProjectType> => {
  debug('ProjectTypeDetector', 'Analyzing project goals to determine type');
  
  const prompt = `Analyze this project's name and goals to determine its type and key characteristics.
Project Name: ${name}
Goals: ${goals}

For each project type below, analyze how well it matches and provide reasoning:
${projectTypes.map(t => `- ${t.type}: ${t.description}`).join('\n')}

Consider these aspects:
1. Core Purpose:
   - Teaching/learning focus → learning
   - Novel experiences/innovation → innovative
   - Focused utility/script → utility
   - Workflow improvement → automation

2. Key Indicators:
   - Learning: mentions education, skills, teaching, practice
   - Innovative: emphasizes new experiences, creativity, novel approaches
   - Utility: focuses on specific tasks, tools, backend services
   - Automation: mentions workflows, efficiency, integration

3. Technical Signals:
   - Learning: tutorials, exercises, feedback loops
   - Innovative: new technologies, user experience, creative features
   - Utility: data processing, specific functionality, APIs
   - Automation: workflow integration, process improvement

Return a JSON object with this structure:
{
  "primaryType": "type_name",
  "confidence": 0.0-1.0,
  "reasons": ["reason1", "reason2"],
  "secondaryTypes": [
    {
      "type": "type_name",
      "confidence": 0.0-1.0,
      "reasons": ["reason1", "reason2"]
    }
  ]
}`;

  try {
    const response = await ai.generateContent({
      prompt,
      type: 'structured',
      temperature: 0.3
    });

    if (!response || typeof response !== 'object') {
      debug('ProjectTypeDetector', 'Invalid response type:', response);
      return innovativeTemplate;
    }

    const { primaryType, confidence, reasons, secondaryTypes } = response;

    if (!primaryType || !projectTypes.some(t => t.type === primaryType)) {
      debug('ProjectTypeDetector', 'Invalid project type:', primaryType);
      debug('ProjectTypeDetector', 'Valid types are:', projectTypes.map(t => t.type));
      return innovativeTemplate;
    }

    debug('ProjectTypeDetector', 'Detection results:', {
      primaryType,
      confidence,
      reasons,
      secondaryTypes
    });

    // Store secondary types and reasons in context for later use
    const template = projectTypes.find(t => t.type === primaryType)!;
    
    // Enhance template with dynamic features based on analysis
    return {
      ...template,
      features: getTypeFeatures(primaryType, goals),
      suggestedTechnologies: getTypeTechnologies(primaryType, goals),
      commonPatterns: getTypePatterns(primaryType, goals)
    };
  } catch (error) {
    debug('ProjectTypeDetector', 'Error detecting project type:', error);
    return innovativeTemplate;
  }
};

// Helper functions to provide type-specific suggestions
function getTypeFeatures(type: string, goals: string): string[] {
  const baseFeatures = {
    innovative: ['User experience focus', 'Novel interactions', 'Creative elements'],
    utility: ['Core functionality', 'Performance optimization', 'Error handling'],
    automation: ['Workflow integration', 'Process automation', 'Efficiency tracking'],
    learning: ['Progress tracking', 'Interactive exercises', 'Feedback system']
  };
  return baseFeatures[type as keyof typeof baseFeatures] || baseFeatures.innovative;
}

function getTypeTechnologies(type: string, goals: string): string[] {
  const baseTech = {
    innovative: ['Modern frontend frameworks', 'Animation libraries', 'State management'],
    utility: ['Backend services', 'Data processing', 'API integration'],
    automation: ['Workflow engines', 'Integration platforms', 'Monitoring tools'],
    learning: ['Interactive content', 'Progress tracking', 'Assessment tools']
  };
  return baseTech[type as keyof typeof baseTech] || baseTech.innovative;
}

function getTypePatterns(type: string, goals: string): string[] {
  const basePatterns = {
    innovative: ['Component-based architecture', 'Event-driven design', 'Interactive feedback'],
    utility: ['Service architecture', 'Data pipeline', 'Error recovery'],
    automation: ['Event handlers', 'State machines', 'Integration patterns'],
    learning: ['Content modules', 'Progress tracking', 'Assessment loops']
  };
  return basePatterns[type as keyof typeof basePatterns] || basePatterns.innovative;
}