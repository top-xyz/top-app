# Project Overview: Top - Universal Context Management Hub

## Vision
Top is a powerful yet elegant developer tool that transforms how teams manage and utilize codebase knowledge. By seamlessly integrating with popular development and knowledge management tools, it creates a unified knowledge graph that can be consumed by both humans and AI systems in their preferred formats.

## Core Features

### 1. Universal Integration
- One-click GitHub/GitLab/Bitbucket connection
- Export to Obsidian, Notion, Confluence
- Integration with Jira, Linear, Asana
- Real-time sync and webhooks

### 2. Smart Context Generation
- Intelligent code parsing and analysis
- Automatic documentation generation
- Context-aware summaries
- Relationship mapping

### 3. Multi-Format Export
- LLM-optimized markdown
- Obsidian-compatible wiki links
- Notion databases and relations
- Jira/Confluence pages

### 4. Knowledge Graph
- Automatic backlink generation
- Cross-platform relationships
- Visual dependency graphs
- Semantic search

## Technical Architecture

### Core Systems
1. **Integration Engine**
   - Source control connectors
   - Knowledge base adapters
   - Project management bridges
   - Sync management

2. **Context Generator**
   - Code analysis
   - Documentation extraction
   - Relationship detection
   - Template system

3. **Export Pipeline**
   - Format conversion
   - Platform-specific optimization
   - Relationship preservation
   - Real-time sync

4. **Search & Discovery**
   - Vector search
   - Semantic matching
   - Relevance ranking
   - Smart caching

## Development Stack
- Next.js 15 (App Router)
- React 19
- TailwindCSS with custom animations
- Vector database (ChromaDB)
- Multiple API integrations

## Key Benefits

### For Developers
- Single source of truth for code knowledge
- Context-aware AI interactions
- Automated documentation
- Seamless tool integration

### For Teams
- Unified knowledge management
- Cross-tool synchronization
- Automated updates
- Consistent documentation

### For Organizations
- Knowledge preservation
- Onboarding optimization
- Tool consolidation
- Process automation

## Project Structure
```
top/
├── top-app/          # Next.js application
│   ├── app/         # Application routes
│   ├── components/  # React components
│   ├── lib/        # Core libraries
│   │   ├── integrations/  # Tool integrations
│   │   ├── context/      # Context generation
│   │   ├── export/       # Export pipeline
│   │   └── search/       # Search system
│   └── public/     # Static assets
└── notes/          # Project documentation
```

## Development Phases
1. Initial Setup & Documentation
2. Integration Framework
3. Context Generation System
4. Export Pipeline Development
5. Search Implementation
6. UI Development
7. Testing & Optimization
8. Beta Release

## Future Enhancements
- Additional platform integrations
- Advanced templating system
- Team collaboration features
- Enterprise features
- Custom embedding models
- Workflow automation

## Integration Roadmap

### Phase 1: Core Integrations
- GitHub/GitLab repositories
- Obsidian/Notion export
- Basic Jira integration

### Phase 2: Enhanced Features
- Real-time sync
- Advanced relationships
- Custom templates
- Batch operations

### Phase 3: Enterprise Features
- SSO integration
- Audit logging
- Custom deployments
- Advanced security 