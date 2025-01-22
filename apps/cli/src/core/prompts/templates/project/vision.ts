import { debug } from '../../../utils/debug';
import { ProjectType } from './types/detector';
import { innovativeTemplate } from './types/innovative';
import { utilityTemplate } from './types/utility';
import { learningTemplate } from './types/learning';
import { automationTemplate } from './types/automation';
import { VertexAIClient } from '../../client/vertex-ai';

export interface VisionAnalysis {
  platformRequirements: {
    platformSpecificRequirements: any[];
    primary: string;
    secondary: string[];
  };
  technicalRequirements: {
    coreTechnicalNeeds: any[];
    core: string[];
    optional: string[];
  };
  userExperienceElements: {
    keyInteractions: any[];
    interactions: string[];
    design: string[];
  };
  integrationRequirements: {
    apis: any[];
    services: string[];
    integrations: string[];
  };
  aiMlCapabilities: {
    requiredAiFeatures: any[];
    required: string[];
    potential: string[];
  };
  nameSuggestions: string[];
}

interface ProjectVisionContext {
  name: string;
  description: string;
  projectType?: string;
}

const projectTemplates = {
  innovative: innovativeTemplate,
  utility: utilityTemplate,
  learning: learningTemplate,
  automation: automationTemplate
};

export function getVisionAnalysisPrompt(description: string): string {
  return `You are a technical architect analyzing project requirements. Your task is to extract structured insights from the project vision.

Project Description:
${description}

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Ensure all JSON fields are properly quoted
3. Use [] for empty arrays, never null
4. Keep suggestions focused and actionable
5. Validate JSON structure before responding

Required JSON Structure:
{
  "platformRequirements": {
    "platformSpecificRequirements": [],
    "primary": "web|mobile|desktop|cli|embedded|cloud",
    "secondary": ["list", "of", "platforms"]
  },
  "technicalRequirements": {
    "coreTechnicalNeeds": [],
    "core": ["required", "technologies"],
    "optional": ["optional", "technologies"] 
  },
  "userExperienceElements": {
    "keyInteractions": [],
    "interactions": ["key", "user", "interactions"],
    "design": ["design", "requirements"]
  },
  "integrationRequirements": {
    "apis": [],
    "services": ["required", "services"],
    "integrations": ["needed", "integrations"]
  },
  "aiMlCapabilities": {
    "requiredAiFeatures": [],
    "required": ["required", "ai", "features"],
    "potential": ["potential", "ai", "features"]
  },
  "nameSuggestions": ["name1", "name2", "name3"]
}

Name Generation Rules:
1. Length: 3-6 letters, all lower case letters 
2. Style: Playful, memorable, unique
3. Relevance: Subtle connection to purpose
4. Quantity: Generate 3-5 suggestions
5. Avoid: Technical terms, literal descriptions

Remember: Return ONLY the JSON object with no other text`;
}

export async function analyzeProjectVision(
  description: string,
  projectType: ProjectType,
  aiClient: VertexAIClient,
  logger?: any
): Promise<VisionAnalysis> {
  try {
    const defaultAnalysis: VisionAnalysis = {
      platformRequirements: {
        platformSpecificRequirements: [],
        primary: 'ios',
        secondary: []
      },
      technicalRequirements: {
        coreTechnicalNeeds: [],
        core: [],
        optional: []
      },
      userExperienceElements: {
        keyInteractions: [],
        interactions: [],
        design: []
      },
      integrationRequirements: {
        apis: [],
        services: [],
        integrations: []
      },
      aiMlCapabilities: {
        requiredAiFeatures: [],
        required: [],
        potential: []
      },
      nameSuggestions: []
    };

    const prompt = getVisionAnalysisPrompt(description);
    logger?.debug('Generated vision analysis prompt:', prompt);

    const response = await aiClient.generateContent({
      text: prompt,
      parameters: {
        temperature: 0.3 // Lower temperature for more focused analysis
      }
    });
    
    if (!response) {
      logger?.error('Failed to get vision analysis response');
      return defaultAnalysis;
    }

    try {
      const analysis = response;
      logger?.debug('Received vision analysis:', analysis);
      return {
        ...defaultAnalysis,
        ...analysis
      };
    } catch (parseError) {
      logger?.error('Error parsing vision analysis response:', parseError);
      return defaultAnalysis;
    }
  } catch (error) {
    logger?.error('Error in vision analysis:', error);
    return defaultAnalysis;
  }
}
