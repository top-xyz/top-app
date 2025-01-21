# CLI Architecture

```mermaid
graph TD
    subgraph CLI [CLI Layer]
        CLI_INDEX[cli/index.ts]
        HANDLERS[cli/handlers/]
        ACTION_HANDLERS[handlers/action/*]
        INPUT_HANDLERS[handlers/input/*]
    end

    subgraph CORE [Core Layer]
        PROJECT_MGR[ProjectManager]
        CONTEXT_MGR[ContextManager]
        PROMPT_MGR[PromptManager]
        VERTEX_AI[VertexAIClient]
        VECTOR_STORE[VectorStore]
        DOC_GEN[DocumentationGenerator]
    end

    subgraph TYPES [Type System]
        CONTEXT_TYPES[context.ts]
        PROJECT_TYPES[project.ts]
        PROMPT_TYPES[prompts.ts]
        CLIENT_TYPES[client.ts]
        VECTOR_TYPES[vector-store.ts]
    end

    subgraph TEMPLATES [Templates]
        DETECT[detect.ts]
        VISION[vision-analyzer.ts]
        DOCS[documentation.ts]
        INSIGHTS[insights.ts]
        RESPONSE[response.ts]
    end

    subgraph UTILS [Utilities]
        LOGGER[Logger]
        DEBUG[Debug]
        SPINNER[Spinner]
        VALIDATOR[Validator]
        VISUALIZER[ContextVisualizer]
    end

    %% CLI Layer Dependencies
    CLI_INDEX --> HANDLERS
    HANDLERS --> ACTION_HANDLERS
    HANDLERS --> INPUT_HANDLERS
    ACTION_HANDLERS --> PROJECT_MGR
    ACTION_HANDLERS --> CONTEXT_MGR
    INPUT_HANDLERS --> PROJECT_MGR

    %% Core Layer Dependencies
    PROJECT_MGR --> CONTEXT_MGR
    PROJECT_MGR --> VERTEX_AI
    PROJECT_MGR --> PROJECT_TYPES
    CONTEXT_MGR --> VERTEX_AI
    CONTEXT_MGR --> VECTOR_STORE
    CONTEXT_MGR --> CONTEXT_TYPES
    PROMPT_MGR --> TEMPLATES
    DOC_GEN --> CONTEXT_MGR

    %% Type System Dependencies
    PROJECT_TYPES --> CONTEXT_TYPES
    CONTEXT_TYPES --> PROJECT_TYPES
    
    %% Template Dependencies
    DETECT --> PROJECT_TYPES
    VISION --> CONTEXT_TYPES
    DOCS --> CONTEXT_TYPES
    INSIGHTS --> CONTEXT_TYPES
    RESPONSE --> PROMPT_TYPES

    %% Utility Usage
    PROJECT_MGR --> LOGGER
    PROJECT_MGR --> DEBUG
    CONTEXT_MGR --> LOGGER
    CONTEXT_MGR --> DEBUG
    VERTEX_AI --> SPINNER
    HANDLERS --> VALIDATOR
    CONTEXT_MGR --> VISUALIZER

    classDef default fill:#f9f,stroke:#333,stroke-width:2px;
    classDef core fill:#bbf,stroke:#333,stroke-width:2px;
    classDef types fill:#bfb,stroke:#333,stroke-width:2px;
    classDef templates fill:#fbb,stroke:#333,stroke-width:2px;
    classDef utils fill:#fff,stroke:#333,stroke-width:2px;

    class CLI_INDEX,HANDLERS,ACTION_HANDLERS,INPUT_HANDLERS default;
    class PROJECT_MGR,CONTEXT_MGR,PROMPT_MGR,VERTEX_AI,VECTOR_STORE,DOC_GEN core;
    class CONTEXT_TYPES,PROJECT_TYPES,PROMPT_TYPES,CLIENT_TYPES,VECTOR_TYPES types;
    class DETECT,VISION,DOCS,INSIGHTS,RESPONSE templates;
    class LOGGER,DEBUG,SPINNER,VALIDATOR,VISUALIZER utils;
```

## Key Components

### CLI Layer
- Entry point and command handling
- Action handlers for specific commands
- Interactive input handling

### Core Layer
- Project and context management
- AI client integration
- Vector storage
- Documentation generation

### Type System
- Shared type definitions
- Project and context types
- Client interfaces

### Templates
- AI prompt templates
- Response formatting
- Analysis templates

### Utilities
- Logging and debugging
- Progress indication
- Validation
- Visualization

## Type Dependencies

The type system is built around two main concepts:
1. **Context Types** (`context.ts`)
   - Base types for all contexts
   - Enhanced context types with metadata
   - Project-specific context extensions

2. **Project Types** (`project.ts`)
   - Project type definitions
   - Project insights
   - Type detection interfaces

These two type modules are interdependent:
- `ProjectType` is used in `SystemMetadata` (context.ts)
- `ProjectInsights` extends `ContextInsights` (context.ts)
- `EnhancedProjectContext` extends `EnhancedContext` with project-specific constraints

## Flow of Control

1. CLI commands → Action Handlers
2. Action Handlers → Core Managers
3. Core Managers ↔ Type System
4. Core Managers → Templates
5. Core Managers → Utils

## Key Interfaces

### EnhancedContext vs EnhancedProjectContext

EnhancedContext provides the base structure:
```typescript
interface EnhancedContext extends Context {
  insights: ContextInsights;
  _system: {
    embeddings: ContextEmbeddings;
    metadata: SystemMetadata;
    similarity?: number;
    matchType?: string;
  };
  embeddings: ContextEmbeddings;
  metadata: SystemMetadata;
  similarity?: number;
  matchType?: string;
}
```

EnhancedProjectContext adds project-specific constraints:
```typescript
interface EnhancedProjectContext extends EnhancedContext {
  insights: ProjectInsights;  // More specific insight types
  metadata: SystemMetadata & {
    projectType: ProjectType;  // Required project type
  };
}
```

The key differences:
1. `insights` is constrained to `ProjectInsights`
2. `metadata` requires a `projectType`
3. Inherits all base functionality from `EnhancedContext`
