# Top CLI Development Instructions

## Overview

This document serves as a living guide for the development of the Top CLI system, a context-aware development tool that uses natural language processing and embeddings to manage project knowledge and facilitate development workflows.

## Development Process

### 1. Documentation-First Approach
```typescript
interface DocumentationFlow {
  steps: {
    design: "Document the intended functionality"
    implement: "Create the implementation"
    test: "Verify behavior"
    iterate: "Refine based on feedback"
  }

  artifacts: {
    specs: "Functional specifications"
    interfaces: "TypeScript interfaces"
    examples: "Usage examples"
    tests: "Test cases"
  }
}
```

### 2. Context Management
Each feature should be documented with:
- Purpose and scope
- Interface definitions
- Implementation details
- Usage examples
- Test scenarios
- Integration points

### 3. Knowledge Base Structure
```typescript
interface KnowledgeBase {
  sections: {
    core: "Core functionality"
    extensions: "Additional features"
    integrations: "External systems"
    workflows: "Usage patterns"
  }

  metadata: {
    status: "Current state"
    priority: "Implementation order"
    dependencies: "Required components"
  }
}
```

## Implementation Guidelines

### 1. Code Organization
```typescript
interface CodeStructure {
  core: {
    cli: "Command line interface"
    context: "Context management"
    llm: "Language model integration"
    embeddings: "Vector storage"
  }

  utils: {
    display: "Output formatting"
    storage: "Data persistence"
    config: "Configuration"
  }

  types: {
    interfaces: "Type definitions"
    schemas: "Data structures"
    constants: "Shared values"
  }
}
```

### 2. Feature Implementation
1. Document the feature in markdown
2. Define TypeScript interfaces
3. Implement core functionality
4. Add tests and examples
5. Update documentation with learnings

### 3. Quality Standards
- Clear type definitions
- Comprehensive error handling
- Detailed logging
- Performance considerations
- Security best practices

## Documentation Template

### 1. Feature Documentation
```markdown
# Feature Name

## Overview
- Purpose
- Core functionality
- Integration points

## Interface
\```typescript
interface FeatureInterface {
  // Core types and methods
}
\```

## Implementation
\```typescript
class FeatureImplementation {
  // Key methods and logic
}
\```

## Usage
\```typescript
// Example usage code
\```

## Testing
- Test scenarios
- Edge cases
- Performance considerations
```

### 2. Knowledge Base Entry
```markdown
# Topic Name

## Context
- Background
- Purpose
- Scope

## Details
- Key concepts
- Implementation notes
- Best practices

## Examples
- Use cases
- Code samples
- Common patterns

## References
- Related topics
- External resources
- Further reading
```

## Development Workflow

### 1. Feature Addition
1. Create feature documentation
2. Define interfaces and types
3. Implement core functionality
4. Add tests and examples
5. Update knowledge base
6. Review and refine

### 2. Knowledge Base Updates
1. Document new concepts
2. Link related topics
3. Add code examples
4. Update references
5. Generate embeddings
6. Verify searchability

## Next Steps Format

Each development iteration should end with a "Next Steps" section in the following format:

### Next Steps Template
```markdown
## Recommended Next Steps

### Current Focus
[Brief description of what was just completed]

### Recommended Next Prompt
\```
[Copy-paste ready prompt that logically continues development]
\```

### Expected Outcome
- What will be created/modified
- Key improvements
- New capabilities

### Alternative Paths
1. [Alternative direction 1]
2. [Alternative direction 2]
3. [Alternative direction 3]

### Documentation Links
- [Link to related docs]
- [Link to dependent systems]
- [Link to impacted areas]
```

## Utility Keywords

### Action Keywords
```typescript
interface ActionKeywords {
  proceed: "Execute the recommended next steps"
  detail: "Expand current topic documentation"
  progress: "Check implementation status"
  link: "Show related documentation"
  why: "Explain current approach"
}
```

### Progress Tracking
```typescript
interface ProgressTracking {
  command: "progress"
  actions: {
    check: "Compare against planning docs"
    update: "Record completed items"
    summarize: "Show current status"
    blocked: "List blocking items"
  }
  artifacts: {
    workLogs: "Implementation progress"
    planDocs: "Planning documents"
    timeline: "Development timeline"
  }
}
```

### Documentation Linking
```typescript
interface DocLinking {
  types: {
    dependency: "Required by this doc"
    reference: "Referenced by this doc"
    impact: "Impacted by this doc"
  }
  
  metadata: {
    relationship: "Link type"
    strength: "Relevance score"
    bidirectional: boolean
  }

  tracking: {
    source: "Origin document"
    target: "Linked document"
    context: "Link description"
  }
}
```

## Response Guidelines

### 1. Proceed with Next Steps
```bash
# To execute recommended next steps
> proceed

# System will:
- Execute recommended prompt
- Update work logs
- Maintain doc links
```

### 2. Request Details
```bash
# To expand current topic
> detail [topic]

# System will:
- Generate detailed documentation
- Show implementation specifics
- Link related documents
```

### 3. Check Progress
```bash
# To check implementation status
> progress

# System will:
- Compare against plan
- Update work logs
- Show completion status
- List next actions
```

### 4. Link Documents
```bash
# To manage documentation links
> link [doc-id]

# System will:
- Show related docs
- Update relationships
- Maintain context
```

## LLM Pipeline Integration

### 1. Documentation Generation
```typescript
interface DocGeneration {
  prompts: {
    content: "Main content generation"
    links: "Relationship discovery"
    updates: "Content maintenance"
  }

  context: {
    existing: "Current documentation"
    related: "Linked documents"
    history: "Development context"
  }

  outputs: {
    markdown: "Formatted content"
    metadata: "Link information"
    tracking: "Progress updates"
  }
}
```

### 2. Link Maintenance
```typescript
interface LinkMaintenance {
  discovery: {
    semantic: "Content-based links"
    explicit: "Declared links"
    implicit: "Usage-based links"
  }

  validation: {
    bidirectional: "Two-way links"
    consistency: "Link health"
    relevance: "Link strength"
  }

  updates: {
    automatic: "System-managed"
    manual: "User-specified"
    suggested: "AI-recommended"
  }
}
```

## Example Next Steps

```markdown
## Recommended Next Steps

### Current Focus
Implemented basic CLI chat interface with context management

### Recommended Next Prompt
\```
Let's implement the embedding system for context storage and retrieval. Please create the necessary interfaces and base implementation for the VectorStore class that will manage our embeddings.
\```

### Expected Outcome
- Vector storage system for contexts
- Embedding generation utilities
- Semantic search capabilities
- Context relationship tracking

### Alternative Paths
1. Enhance chat interface with rich formatting
2. Implement context visualization system
3. Add advanced prompt templates
```

## Contribution Guidelines

### 1. Documentation Updates
- Keep documentation in sync with code
- Include clear examples
- Update interface definitions
- Maintain consistent formatting

### 2. Code Changes
- Follow TypeScript best practices
- Add comprehensive tests
- Update relevant documentation
- Consider performance impact

### 3. Knowledge Base
- Maintain clear relationships
- Keep examples up to date
- Verify embedding quality
- Update search indices

## Version Control

### 1. Commit Structure
```typescript
interface CommitFormat {
  type: "feat" | "fix" | "docs" | "refactor"
  scope: string  // Component affected
  description: string  // Clear, concise change description
  body?: string  // Detailed explanation if needed
  breaking?: boolean  // Breaking change flag
}
```

### 2. Branch Strategy
- main: Stable releases
- develop: Integration branch
- feature/*: New features
- fix/*: Bug fixes
- docs/*: Documentation updates

## Maintenance

### 1. Regular Tasks
- Update dependencies
- Refresh embeddings
- Verify documentation
- Check test coverage
- Monitor performance

### 2. Quality Checks
- Type consistency
- Code style
- Documentation accuracy
- Test coverage
- Performance metrics
``` 