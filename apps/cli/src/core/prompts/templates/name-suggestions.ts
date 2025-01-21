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

  return `Based on this project analysis, suggest 4-5 fun, memorable project names.

Project Description: "${description}"

Project Context:
Type: ${projectContext.type} (${projectContext.confidence * 100}% confidence)
Platform: ${projectContext.platform}
Key Features: ${projectContext.keyFeatures.join(', ')}
UX Elements: ${projectContext.userExperience.join(', ')}
AI Features: ${projectContext.aiFeatures.join(', ')}

Rules for names:
- Must be single words, 3-6 letters long
- Should be cute, fun, or playful
- Can be made-up words that sound good
- Should subtly relate to the project's purpose and type
- Names should reflect the project's personality:
  * innovative: futuristic, novel
  * utility: practical, clear
  * automation: efficient, smooth
  * learning: explorative, growing
- Consider the platform and key features in the name
- Avoid technical terms or obvious descriptions

Format the response as a JSON array of objects with 'name' and 'reason' properties.
Example: [{"name": "zoop", "reason": "Playful word suggesting quick, fun interactions"}]

Reference style: Names like 'squish', 'top', 'sine', 'helios', 'peek', 'drib'

IMPORTANT: Return ONLY the JSON array, no other text or formatting.`;
}