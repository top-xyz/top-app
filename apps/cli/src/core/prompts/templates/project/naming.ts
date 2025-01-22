import { VisionAnalysis } from './vision-analyzer';
import { ProjectType } from './project-types/detector';

export const getNameSuggestionsPrompt = (
  description: string,
  projectType: ProjectType,
  visionAnalysis: VisionAnalysis
) => {
  const projectContext = {
    type: projectType.primaryType,
    confidence: projectType.confidence,
    platform: visionAnalysis.platformRequirements.primary,
    keyFeatures: visionAnalysis.technicalRequirements.core,
    userExperience: visionAnalysis.userExperienceElements.design,
    aiFeatures: visionAnalysis.aiMlCapabilities.required
  };

  return `You are a creative project namer focused on generating memorable names.

IMPORTANT INSTRUCTIONS:
1. Return ONLY a JSON object with NO additional text/markdown
2. Generate 4-5 unique name suggestions
3. Each name must follow the rules below
4. Include reasoning for each name
5. Validate JSON structure before responding

Project Context:
${JSON.stringify({
  description,
  ...projectContext
}, null, 2)}

Name Requirements:
1. Length: 3-6 letters, lowercase only
2. Style: Playful, memorable, unique
3. Relevance: Subtle connection to purpose
4. Personality Match:
   - innovative: futuristic, novel
   - utility: practical, clear
   - automation: efficient, smooth
   - learning: explorative, growing
5. Avoid: Technical terms, literal descriptions

Required JSON Structure:
{
  "suggestions": [
    {
      "name": string,
      "reason": string,
      "associations": string[],
      "confidence": 0.0-1.0
    }
  ],
  "themes": {
    "primary": string,
    "secondary": string[]
  }
}

Remember: Return ONLY the JSON object with no other text`;
}