# Response Handler Implementation

## Overview

The ResponseHandler is responsible for ensuring all CLI outputs are formatted in pure markdown, with proper validation, templating, and error handling. It serves as the central point for managing response formatting across the CLI.

## Core Types

### 1. Response Types
```typescript
interface ResponseTypes {
  success: {
    type: "success"
    title: string
    description: string
    details?: Record<string, any>
    nextSteps?: string[]
    links?: DocumentLink[]
  }

  error: {
    type: "error"
    title: string
    problem: string
    resolution: string[]
    links?: DocumentLink[]
  }

  progress: {
    type: "progress"
    title: string
    completed: string[]
    pending: string[]
    blocked?: string[]
    nextActions: string[]
  }

  context: {
    type: "context"
    title: string
    changes: string[]
    impact: string[]
    links: DocumentLink[]
  }
}
```

### 2. Template Types
```typescript
interface TemplateTypes {
  base: {
    title: string
    sections: TemplateSection[]
    metadata: TemplateMetadata
  }

  section: {
    heading: string
    content: string | string[]
    type: "text" | "list" | "steps"
    level: number
  }

  metadata: {
    timestamp: Date
    version: string
    links: DocumentLink[]
    context?: string
  }
}
```

### 3. Validation Types
```typescript
interface ValidationTypes {
  rules: {
    name: string
    check: (content: string) => boolean
    fix?: (content: string) => string
    severity: "error" | "warning"
  }

  result: {
    valid: boolean
    errors: ValidationError[]
    warnings: ValidationWarning[]
    fixes?: string[]
  }
}
```

## Implementation Details

### 1. Response Generation
```typescript
class ResponseHandler {
  // Template management
  private templates: Map<string, Template>
  private validators: ValidationRule[]
  private formatter: MarkdownFormatter

  constructor(config: ResponseConfig) {
    this.templates = this.loadTemplates()
    this.validators = this.initializeValidators()
    this.formatter = new MarkdownFormatter()
  }

  // Generate response from template
  async generateResponse(
    type: ResponseType,
    data: ResponseData
  ): Promise<string> {
    const template = await this.getTemplate(type)
    const content = await this.processTemplate(template, data)
    const validated = await this.validateContent(content)
    return this.formatResponse(validated)
  }

  // Handle errors with proper formatting
  async handleError(
    error: Error,
    context?: ErrorContext
  ): Promise<string> {
    const template = await this.getTemplate('error')
    const errorData = this.processError(error, context)
    return this.generateResponse('error', errorData)
  }

  // Format progress updates
  async formatProgress(
    status: ProgressStatus
  ): Promise<string> {
    const template = await this.getTemplate('progress')
    const progressData = this.processProgress(status)
    return this.generateResponse('progress', progressData)
  }
}
```

### 2. Template Processing
```typescript
class TemplateProcessor {
  // Load and parse templates
  async loadTemplate(
    type: string
  ): Promise<Template> {
    const source = await this.readTemplateFile(type)
    return this.parseTemplate(source)
  }

  // Process template with data
  async processTemplate(
    template: Template,
    data: TemplateData
  ): Promise<string> {
    const sections = await this.processSections(template, data)
    const metadata = await this.processMetadata(template, data)
    return this.combineContent(sections, metadata)
  }

  // Validate template structure
  private validateTemplate(
    template: Template
  ): ValidationResult {
    const structureValid = this.validateStructure(template)
    const contentValid = this.validateContent(template)
    return this.combineValidation(structureValid, contentValid)
  }
}
```

### 3. Markdown Validation
```typescript
class MarkdownValidator {
  // Validate markdown content
  async validateMarkdown(
    content: string
  ): Promise<ValidationResult> {
    const structure = await this.validateStructure(content)
    const links = await this.validateLinks(content)
    const format = await this.validateFormat(content)
    return this.combineResults(structure, links, format)
  }

  // Fix common issues
  async fixMarkdown(
    content: string,
    issues: ValidationIssue[]
  ): Promise<string> {
    let fixed = content
    for (const issue of issues) {
      fixed = await this.applyFix(fixed, issue)
    }
    return fixed
  }

  // Check link validity
  private async validateLinks(
    content: string
  ): Promise<LinkValidation> {
    const links = this.extractLinks(content)
    return this.checkLinks(links)
  }
}
```

## Usage Patterns

### 1. Basic Response
```typescript
// Generate success response
const response = await responseHandler.generateResponse('success', {
  title: 'Project Created',
  description: 'Successfully created new project',
  details: {
    name: 'MyProject',
    type: 'web-app'
  },
  nextSteps: [
    'Configure project settings',
    'Initialize repository'
  ]
})
```

### 2. Error Handling
```typescript
// Handle and format error
try {
  await someOperation()
} catch (error) {
  const response = await responseHandler.handleError(error, {
    operation: 'project-creation',
    context: 'initialization'
  })
}
```

### 3. Progress Updates
```typescript
// Format progress information
const progress = await responseHandler.formatProgress({
  completed: ['Step 1', 'Step 2'],
  pending: ['Step 3', 'Step 4'],
  blocked: ['Step 5'],
  nextActions: ['Complete Step 3']
})
```

## Next Steps

### Current Focus
Defined ResponseHandler implementation details and core types

### Recommended Next Prompt
```
Let's implement the core ResponseHandler class and TemplateProcessor in TypeScript, focusing on template loading and basic response generation first.
```

### Expected Outcome
- Working ResponseHandler implementation
- Template loading functionality
- Basic response generation
- Initial validation rules

### Alternative Paths
1. Start with MarkdownValidator implementation
2. Focus on error handling system
3. Build template processor first

### Documentation Links
- [Response Format](response-format.md)
- [CLI Implementation](cli-implementation.md)
- [Implementation Plan](implementation-plan.md)
``` 