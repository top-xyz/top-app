import { debug } from '../../../utils/debug';
import { ProjectType } from './project-types/detector';
import { innovativeTemplate } from './project-types/innovative';
import { utilityTemplate } from './project-types/utility';
import { learningTemplate } from './project-types/learning';
import { automationTemplate } from './project-types/automation';
import { VertexAIClient } from '../../client/vertex-ai';

export interface VisionAnalysis {
  platformRequirements: {
    platformSpecificRequirements: {};
    primary: string;
    secondary: string[];
  };
  technicalRequirements: {
    coreTechnicalNeeds: {};
    core: string[];
    optional: string[];
  };
  userExperienceElements: {
    keyInteractions: {};
    interactions: string[];
    design: string[];
  };
  integrationRequirements: {
    apis: {};
    services: string[];
    integrations: string[];
  };
  aiMlCapabilities: {
    requiredAiFeatures: {};
    required: string[];
    potential: string[];
  };
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
  return `Analyze this project vision to extract detailed technical and platform requirements.
Project Description:
${description}

Return a JSON object with this exact structure:
{
  "platformRequirements": {
    "platformSpecificRequirements": {},
    "primary": "web|mobile|desktop|cli|embedded|cloud",
    "secondary": ["list", "of", "platforms"]
  },
  "technicalRequirements": {
    "coreTechnicalNeeds": {},
    "core": ["required", "technologies"],
    "optional": ["optional", "technologies"]
  },
  "userExperienceElements": {
    "keyInteractions": {},
    "interactions": ["key", "user", "interactions"],
    "design": ["design", "requirements"]
  },
  "integrationRequirements": {
    "apis": {},
    "services": ["required", "services"],
    "integrations": ["needed", "integrations"]
  },
  "aiMlCapabilities": {
    "requiredAiFeatures": {},
    "required": ["required", "ai", "features"],
    "potential": ["potential", "ai", "features"]
  }
}

IMPORTANT:
1. Be specific to this project
2. Include all required fields
3. Return ONLY the JSON object, no explanations
4. Ensure valid JSON format`;
}

export async function analyzeProjectVision(
  description: string,
  aiClient: VertexAIClient,
  logger?: any
): Promise<VisionAnalysis> {
  try {
    const defaultAnalysis: VisionAnalysis = {
      platformRequirements: {
        platformSpecificRequirements: {},
        primary: 'ios',
        secondary: []
      },
      technicalRequirements: {
        coreTechnicalNeeds: {},
        core: [],
        optional: []
      },
      userExperienceElements: {
        keyInteractions: {},
        interactions: [],
        design: []
      },
      integrationRequirements: {
        apis: {},
        services: [],
        integrations: []
      },
      aiMlCapabilities: {
        requiredAiFeatures: {},
        required: [],
        potential: []
      }
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
