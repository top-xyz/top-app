# Response Format System

## Overview

The response format system ensures all CLI outputs are consistently formatted in pure markdown, with proper linking and context awareness. This system handles response templates, validation, and error formatting.

## Core Components

### 1. Response Templates

#### Project Information
```markdown
# [Project Name]

## Overview
[Project description]

## Current Status
- Type: [project type]
- Phase: [current phase]
- Last Updated: [timestamp]

## Related Context
- [Context Link 1]
- [Context Link 2]

## Next Actions
1. [Action 1]
2. [Action 2]
```

#### Context Updates
```markdown
# Context Update: [Context Name]

## Changes
- [Change description]
- Updated: [timestamp]

## Impact
- [Affected area 1]
- [Affected area 2]

## Related Documents
- [Document Link 1]
- [Document Link 2]
```

#### Error Messages
```markdown
# Error: [Error Type]

## Details
[Error description]

## Resolution
[Resolution steps]

## Related Information
- [Link to relevant docs]
- [Link to similar issues]
```

### 2. Validation Rules

#### Markdown Structure
- Must start with a level-1 heading
- Must include clear section hierarchy
- Must use proper list formatting
- Must use consistent link syntax

#### Content Requirements
- No raw code blocks
- No HTML elements
- No inline styles
- No images (use links instead)

#### Link Format
- Internal links must be relative
- External links must be fully qualified
- All links must have descriptive text
- Links must be validated

### 3. Response Types

#### Success Response
- Clear heading
- Action summary
- Status details
- Next steps
- Related links

#### Error Response
- Error heading
- Problem description
- Resolution steps
- Related documentation
- Support information

#### Progress Response
- Status heading
- Completion details
- Remaining items
- Blocking issues
- Next actions

## Implementation

### 1. Response Handler
```typescript
interface ResponseHandler {
  templates: {
    project: "Project information"
    context: "Context updates"
    error: "Error messages"
    progress: "Status updates"
  }

  validation: {
    structure: "Markdown structure"
    content: "Content rules"
    links: "Link validation"
  }

  formatting: {
    headers: "Section headers"
    lists: "List formatting"
    links: "Link formatting"
    metadata: "Response metadata"
  }
}
```

### 2. Template System
```typescript
interface TemplateSystem {
  loading: {
    source: "Template source"
    variables: "Template variables"
    context: "Current context"
  }

  processing: {
    substitution: "Variable replacement"
    validation: "Content validation"
    linking: "Document linking"
  }

  output: {
    format: "Markdown format"
    metadata: "Response metadata"
    tracking: "Usage tracking"
  }
}
```

### 3. Validation System
```typescript
interface ValidationSystem {
  rules: {
    structure: "Markdown structure"
    content: "Content requirements"
    links: "Link validation"
  }

  checks: {
    syntax: "Markdown syntax"
    format: "Content format"
    references: "Link checking"
  }

  reporting: {
    errors: "Validation errors"
    warnings: "Potential issues"
    fixes: "Auto-corrections"
  }
}
```

## Usage Examples

### 1. Success Response
```markdown
# Project Initialized: MyApp

## Overview
Successfully initialized new SaaS project "MyApp"

## Details
- Type: SaaS Application
- Created: 2024-01-19 10:00 UTC
- Location: ./myapp

## Next Steps
1. Review project structure
2. Configure development environment
3. Initialize version control

## Related Documentation
- [Project Structure](docs/structure.md)
- [Development Setup](docs/setup.md)
- [Configuration Guide](docs/config.md)
```

### 2. Error Response
```markdown
# Error: Invalid Context Type

## Problem
The specified context type "invalid" is not supported.

## Resolution
1. Use one of the following valid types:
   - project
   - technical
   - marketing
   - investment

2. Try the command again with a valid type:
   ```
   top context create -t project
   ```

## Related Information
- [Context Types](docs/context-types.md)
- [Command Reference](docs/commands.md)
```

## Next Steps

### Current Focus
Defined response format system and templates

### Recommended Next Prompt
```
Let's implement the core ResponseHandler class that will manage markdown response formatting and validation. We'll start with the basic structure and template loading functionality.
```

### Expected Outcome
- ResponseHandler class implementation
- Basic template loading
- Markdown validation
- Error formatting

### Alternative Paths
1. Implement template system first
2. Focus on validation rules
3. Build error handling system

### Documentation Links
- [CLI Implementation](cli-implementation.md)
- [CLI Architecture](cli-architecture.md)
- [Implementation Plan](implementation-plan.md)
``` 