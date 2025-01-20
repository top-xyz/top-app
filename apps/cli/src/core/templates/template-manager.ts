import { TemplateConfig, DocumentGenerationPlan } from '../../types';
import { Logger } from '../../utils/logger';
import * as fs from 'fs/promises';
import * as path from 'path';

export class TemplateManager {
  private logger: Logger;
  private templatesDir: string;
  private templates: Map<string, TemplateConfig> = new Map();

  constructor(templatesDir: string = path.join(process.cwd(), 'templates')) {
    this.logger = new Logger();
    this.templatesDir = templatesDir;
  }

  async initialize(): Promise<void> {
    try {
      if (!this.templatesDir) {
        this.templatesDir = path.join(process.cwd(), 'templates');
      }
      
      // Create templates directory if it doesn't exist
      await fs.mkdir(this.templatesDir, { recursive: true });
      
      // Define default templates
      const defaultTemplates: Record<string, string> = {
        'engineering': `# Technical Documentation for {project_name}

## Architecture Overview
{architecture_overview}

## Technical Requirements
{technical_requirements}

## Implementation Details
{implementation_details}

## API Documentation
{api_documentation}

## Development Setup
{development_setup}`,

        'design': `# Design Documentation for {project_name}

## User Interface Design
{ui_design}

## User Experience Flow
{ux_flow}

## Design System
{design_system}

## Component Library
{component_library}

## Design Decisions
{design_decisions}`,

        'marketing': `# Marketing Plan for {project_name}

## Value Proposition
{value_proposition}

## Target Market
{target_market}

## Marketing Strategy
{marketing_strategy}

## Key Messages
{key_messages}

## Launch Plan
{launch_plan}`,

        'sales': `# Sales Documentation for {project_name}

## Product Overview
{product_overview}

## Target Customers
{target_customers}

## Pricing Strategy
{pricing_strategy}

## Sales Process
{sales_process}

## Competitive Analysis
{competitive_analysis}`,

        'brainstorm': `# Project Ideation: {project_name}

## Vision & Goals
{vision_and_goals}

## Key Innovations
{key_innovations}

## Future Possibilities
{future_possibilities}

## Open Questions
{open_questions}

## Next Steps
{next_steps}`
      };

      // Create default template files if they don't exist
      for (const [type, content] of Object.entries(defaultTemplates)) {
        const templatePath = path.join(this.templatesDir, `${type}-template.md`);
        try {
          await fs.access(templatePath);
        } catch {
          await fs.writeFile(templatePath, content, 'utf-8');
          this.logger.info(`Created default template for ${type}`);
        }

        // Create template config
        const config: TemplateConfig = {
          id: type,
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} documentation`,
          version: '1.0.0',
          template: templatePath
        };
        this.templates.set(type, config);
      }
    } catch (error) {
      this.logger.error('Error initializing templates:', error);
      throw error;
    }
  }

  async getTemplate(type: string): Promise<string> {
    try {
      const templatePath = path.join(
        this.templatesDir,
        `${type}-template.md`
      );
      return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      this.logger.error(`Error loading template for ${type}:`, error);
      throw error;
    }
  }

  getAvailableTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category: string): TemplateConfig[] {
    return Array.from(this.templates.values()).filter(t => t.id.startsWith(category));
  }

  async validateTemplates(plan: DocumentGenerationPlan): Promise<boolean> {
    try {
      for (const template of plan.templates) {
        if (!this.templates.has(template)) {
          return false;
        }
      }
      return true;
    } catch (error) {
      this.logger.error('Error validating templates:', error);
      return false;
    }
  }
} 