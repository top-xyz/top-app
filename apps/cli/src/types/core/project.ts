import { ContextInsights } from './context';

export type ProjectTypeId = 'innovative' | 'utility' | 'automation' | 'learning';

export interface ProjectTypeInfo {
  description: string;
  indicators: string[];
  technologies: string[];
  patterns: string[];
}

export interface ProjectType {
  primaryType: ProjectTypeId;
  confidence: number;
  reasons: string[];
  secondaryTypes: string[];
}

export interface ProjectInsights extends ContextInsights {
  // Required fields for project insights
  technicalPatterns: string[];  // Technical implementation patterns
  userNeeds: string[];         // User requirements and needs
  challenges: string[];        // Implementation challenges
  opportunities: string[];     // Growth opportunities

  // Optional project-specific fields
  technologies?: string[];     // Suggested technologies
  architecture?: string[];     // Architectural decisions
  integrations?: string[];    // External system integrations
  security?: string[];        // Security considerations
  performance?: string[];     // Performance requirements
  
  // Allow extension while maintaining type safety
  [key: string]: string[] | undefined;
}

export type ProjectTypes = Record<ProjectTypeId, ProjectTypeInfo>;

// Predefined project type configurations
export const PROJECT_TYPES: ProjectTypes = {
  innovative: {
    description: 'Novel experiences and creative solutions',
    indicators: [
      'new experiences', 'creativity', 'novel approaches',
      'user experience', 'creative features', 'unique', 'innovative'
    ],
    technologies: ['modern frameworks', 'emerging tech', 'AI/ML', 'interactive UI'],
    patterns: ['user-centric design', 'rapid iteration', 'feedback loops']
  },
  utility: {
    description: 'Focused tools and practical solutions',
    indicators: [
      'specific tasks', 'tools', 'services', 'practical',
      'functionality', 'efficiency', 'solution'
    ],
    technologies: ['backend services', 'APIs', 'data processing', 'CLI tools'],
    patterns: ['modular design', 'clear interfaces', 'robust error handling']
  },
  automation: {
    description: 'Workflow improvements and process automation',
    indicators: [
      'workflows', 'efficiency', 'integration', 'automated',
      'process', 'streamline', 'optimize'
    ],
    technologies: ['task runners', 'workflow engines', 'integration tools'],
    patterns: ['event-driven', 'pipeline architecture', 'state machines']
  },
  learning: {
    description: 'Educational and skill-building applications',
    indicators: [
      'education', 'learning', 'teaching', 'practice',
      'skills', 'tutorial', 'training'
    ],
    technologies: ['interactive content', 'feedback systems', 'progress tracking'],
    patterns: ['scaffolded learning', 'interactive exercises', 'progress metrics']
  }
};
