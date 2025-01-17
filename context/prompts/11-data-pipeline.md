# Data Pipeline Development Prompts

## Context & Philosophy
Our data pipeline is the foundation of our storytelling engine. It must capture, process, and structure football data in a way that enables deep understanding and narrative construction, rather than just prediction.

## Role Definition
You are a data pipeline architect tasked with designing systems that capture the full richness of football matches, from statistical events to tactical patterns and emotional moments.

## Core Prompts

### 1. Real-time Event Processing System
```typescript
interface EventProcessingSystem {
  capture: {
    matchEvents: "High-frequency match events"
    spatialData: "Player and ball positioning"
    tacticalShifts: "Formation and strategy changes"
    emotionalMarkers: "Crowd reactions and player emotions"
  }
  
  processing: {
    eventClassification: "Categorizing and contextualizing events"
    patternRecognition: "Identifying tactical and technical patterns"
    momentumTracking: "Understanding game flow and shifts"
    narrativeMarkers: "Identifying storytelling opportunities"
  }
}
```

**Tasks:**
- Design a real-time event processing pipeline
- Implement pattern recognition systems
- Create contextual analysis frameworks
- Develop narrative marker detection

**Quality Criteria:**
- Event processing latency < 500ms
- Pattern recognition accuracy > 95%
- Context association precision > 90%
- Zero event loss during processing

### 2. Historical Context Engine
```typescript
interface HistoricalContext {
  dataTypes: {
    matchEvents: "Past match events and outcomes"
    playerHistory: "Player performance and patterns"
    teamDynamics: "Team evolution and style"
    rivalryContext: "Historical matchup significance"
  }
  
  analysis: {
    patternMatching: "Finding similar historical situations"
    contextGeneration: "Creating relevant historical narratives"
    insightExtraction: "Drawing meaningful connections"
  }
}
```

**Tasks:**
- Design historical data storage architecture
- Implement efficient retrieval systems
- Create context matching algorithms
- Develop narrative generation frameworks

**Quality Criteria:**
- Query response time < 100ms
- Context relevance score > 85%
- Storage efficiency > 90%
- Data accessibility 99.99%

### 3. Narrative Construction Pipeline
```typescript
interface NarrativePipeline {
  components: {
    eventStream: "Real-time match events"
    contextEngine: "Historical and current context"
    analysisSystem: "Pattern and insight generation"
    narrativeBuilder: "Story construction and delivery"
  }
  
  outputs: {
    instantInsights: "Immediate understanding"
    deepAnalysis: "Comprehensive context"
    visualStories: "Rich visual narratives"
    adaptiveContent: "Personalized storytelling"
  }
}
```

**Tasks:**
- Design narrative construction workflows
- Implement insight generation systems
- Create visualization pipelines
- Develop content adaptation frameworks

**Quality Criteria:**
- Narrative generation latency < 1s
- Story relevance score > 90%
- Visual quality rating > 4.5/5
- User engagement > 80%

## Implementation Guidelines

1. **Data Quality**
   - Prioritize accuracy over speed
   - Maintain comprehensive metadata
   - Ensure contextual richness
   - Preserve raw data fidelity

2. **Processing Architecture**
   - Design for scalability
   - Implement robust error handling
   - Ensure data consistency
   - Enable real-time processing

3. **Storage Strategy**
   - Optimize for quick retrieval
   - Implement efficient indexing
   - Ensure data durability
   - Enable flexible querying

4. **Output Generation**
   - Focus on narrative quality
   - Ensure visual clarity
   - Enable personalization
   - Maintain consistency

## Quality Standards

- End-to-end latency < 2s
- System uptime > 99.99%
- Data accuracy > 99.9%
- Storage efficiency > 90%
- Query performance < 100ms
- Narrative quality > 4.5/5

## Deliverables

1. System Architecture Documentation
2. Data Flow Diagrams
3. Processing Pipeline Specifications
4. Storage Strategy Documentation
5. Query Optimization Guidelines
6. Output Format Specifications

Remember: We're not building a prediction engine; we're creating a storytelling platform that illuminates the beautiful game's complexity and depth. 