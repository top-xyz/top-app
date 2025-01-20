import { detectProjectType, ProjectType } from './project-types/detector';
import { innovativeTemplate } from './project-types/innovative';
import { utilityTemplate } from './project-types/utility';
import { automationTemplate } from './project-types/automation';
import { learningTemplate } from './project-types/learning';

const projectTypes = [innovativeTemplate, utilityTemplate, automationTemplate, learningTemplate];

export const initialPromptsTemplate = `Generate questions that help build a rich project context.
Focus on gathering information that will be valuable for documentation generation.

IMPORTANT: Return a JSON object with both visible questions and hidden context gathering:
{
  "questions": [
    {
      "id": string,
      "question": string,
      "type": string,
      "required": boolean,
      "_analysis": {
        "purpose": string,
        "contextualValue": string[],
        "suggestedPatterns": string[],
        "technicalImplications": string[],
        "valueProposition": string[],
        "userExperience": string[],
        "uniqueAspects": string[],
        "innovationAreas": string[],
        "marketOpportunities": string[],
        "userJourney": string[],
        "emotionalTouchpoints": string[],
        "growthPotential": string[]
      }
    }
  ],
  "_meta": {
    "detectedConcepts": string[],
    "suggestedArchitectures": string[],
    "potentialChallenges": string[],
    "recommendedPatterns": string[],
    "detectedThemes": string[],
    "userNeeds": string[],
    "opportunities": string[],
    "innovationAreas": string[],
    "marketTrends": string[],
    "userSegments": string[],
    "experienceGoals": string[],
    "growthVectors": string[]
  }
}

The _analysis and _meta fields will be used internally to build context for documentation.
Questions should be appropriate for the project type while gathering maximum useful context.

QUESTION PRINCIPLES BY PROJECT TYPE:
- Innovative: Focus on novel experiences, emotional touchpoints, and unexpected possibilities
- Utility: Emphasize core value, workflow integration, and essential functionality
- Automation: Explore process improvements, efficiency gains, and integration points
- Learning: Consider knowledge transfer, engagement patterns, and skill development

Example format:
{
  "questions": [
    {
      "id": "q1",
      "question": "What magical moments do you envision users experiencing with this?",
      "type": "delight",
      "required": true,
      "_analysis": {
        "purpose": "Identify key user experience patterns and potential innovations",
        "contextualValue": [
          "Will inform UX/UI direction",
          "Helps identify unique value propositions",
          "Reveals innovation opportunities"
        ],
        "suggestedPatterns": [
          "Engagement loops",
          "Discovery mechanisms",
          "Social interactions"
        ],
        "technicalImplications": [
          "Real-time capabilities",
          "State management needs",
          "Integration requirements"
        ],
        "valueProposition": [
          "Unique differentiators",
          "Core benefits",
          "Market positioning"
        ],
        "userExperience": [
          "Key moments",
          "Interaction patterns",
          "Flow transitions"
        ],
        "uniqueAspects": [
          "Novel approaches",
          "Special features",
          "Competitive advantages"
        ],
        "innovationAreas": [
          "Experience design",
          "Technical capabilities",
          "Market opportunities"
        ],
        "marketOpportunities": [
          "Target segments",
          "Growth vectors",
          "Market gaps"
        ],
        "userJourney": [
          "Entry points",
          "Core loops",
          "Exit points"
        ],
        "emotionalTouchpoints": [
          "Delight moments",
          "Trust builders",
          "Engagement hooks"
        ],
        "growthPotential": [
          "Expansion areas",
          "Network effects",
          "Platform possibilities"
        ]
      }
    }
  ],
  "_meta": {
    "detectedConcepts": [
      "user engagement",
      "social interaction",
      "discovery"
    ],
    "suggestedArchitectures": [
      "event-driven",
      "real-time",
      "scalable"
    ],
    "potentialChallenges": [
      "user adoption",
      "technical complexity",
      "market fit"
    ],
    "recommendedPatterns": [
      "engagement loops",
      "social proof",
      "viral mechanics"
    ],
    "detectedThemes": [
      "user delight",
      "social connection",
      "discovery"
    ],
    "userNeeds": [
      "seamless experience",
      "meaningful interactions",
      "value creation"
    ],
    "opportunities": [
      "network effects",
      "viral growth",
      "market expansion"
    ],
    "innovationAreas": [
      "user experience",
      "social dynamics",
      "technical capabilities"
    ],
    "marketTrends": [
      "social commerce",
      "mobile-first",
      "ai-enabled"
    ],
    "userSegments": [
      "early adopters",
      "power users",
      "casual users"
    ],
    "experienceGoals": [
      "intuitive",
      "delightful",
      "memorable"
    ],
    "growthVectors": [
      "user acquisition",
      "engagement depth",
      "network expansion"
    ]
  }
}`;

export const getInitialPromptsPrompt = async (context: any): Promise<string> => {
  const { name, goals, systemContext } = context;
  const projectType = systemContext.projectType;
  
  if (!projectType) {
    throw new Error('Project type not found in system context');
  }
  
  const selectedTemplate = projectTypes.find(t => t.type === projectType) || innovativeTemplate;
  
  return `Given a ${projectType} project named "${name}" with the following vision:
${goals}

${selectedTemplate.promptTemplate}

Consider these additional dimensions for deeper context:
1. User Experience & Emotions
   - Key moments and interactions
   - Emotional touchpoints
   - User journey highlights

2. Value & Innovation
   - Unique differentiators
   - Core benefits
   - Novel approaches

3. Growth & Evolution
   - Future possibilities
   - Expansion areas
   - Network effects

4. Market & Users
   - Target segments
   - User needs
   - Market opportunities

Generate questions that inspire creative thinking while gathering valuable context for documentation.
Focus on understanding the vision and possibilities, while keeping technical details implicit.

Example format:
[
  {
    "id": "q1",
    "question": "...",
    "type": "vision",
    "required": true
  }
]`
}; 