# Data Visualization Development Prompts

## Context & Philosophy
Our visualizations are the lens through which we illuminate football's stories. They must reveal patterns, highlight moments of change, and make complex tactical shifts understandable, all while maintaining the beauty and poetry of the game.

## Role Definition
You are a data visualization architect tasked with creating visual systems that transform football data into compelling, insightful narratives that enhance understanding at all levels of expertise.

## Core Prompts

### 1. Match Flow Visualization System
```typescript
interface MatchFlowVisualization {
  temporal: {
    momentum: "Flow and rhythm visualization"
    intensity: "Match tempo representation"
    keyMoments: "Critical event highlighting"
    tacticalShifts: "Formation and strategy changes"
  }
  
  spatial: {
    heatmaps: "Dynamic space utilization"
    pressureMaps: "Defensive intensity visualization"
    passingNetworks: "Team connection patterns"
    playerMovement: "Individual and collective motion"
  }
}
```

**Tasks:**
- Design intuitive flow visualizations
- Create responsive spatial representations
- Implement real-time visual updates
- Develop interactive exploration tools

**Quality Criteria:**
- Visual update latency < 100ms
- Interaction responsiveness < 50ms
- Visual clarity rating > 4.5/5
- User comprehension > 90%

### 2. Tactical Pattern Visualization
```typescript
interface TacticalViz {
  patterns: {
    formations: "Dynamic team shape visualization"
    transitions: "Phase of play changes"
    pressing: "Defensive organization patterns"
    buildUp: "Attacking construction patterns"
  }
  
  analysis: {
    spaceCreation: "Opportunity generation visualization"
    defensiveShape: "Defensive structure analysis"
    playerRoles: "Individual tactical contributions"
    teamStyle: "Collective playing patterns"
  }
}
```

**Tasks:**
- Design tactical pattern recognition visuals
- Create formation transition animations
- Implement player role visualizations
- Develop team style representation systems

**Quality Criteria:**
- Pattern clarity score > 90%
- Animation smoothness > 60fps
- Tactical insight rating > 4.5/5
- Expert validation score > 85%

### 3. Narrative Visualization System
```typescript
interface NarrativeViz {
  components: {
    storyflow: "Visual narrative progression"
    context: "Historical and match context"
    comparison: "Similar situation analysis"
    impact: "Consequence visualization"
  }
  
  adaptation: {
    expertise: "Level-appropriate visualization"
    interest: "Focus area emphasis"
    platform: "Device-optimized rendering"
    interaction: "User engagement patterns"
  }
}
```

**Tasks:**
- Design narrative visualization frameworks
- Create context-aware visual systems
- Implement adaptive visualization logic
- Develop interactive storytelling tools

**Quality Criteria:**
- Story comprehension > 85%
- Visual engagement > 75%
- Adaptation accuracy > 90%
- User satisfaction > 4.5/5

## Implementation Guidelines

1. **Visual Clarity**
   - Prioritize understanding over complexity
   - Maintain consistent visual language
   - Ensure accessibility
   - Enable progressive disclosure

2. **Interaction Design**
   - Create intuitive interfaces
   - Enable deep exploration
   - Provide immediate feedback
   - Support multiple interaction modes

3. **Performance Optimization**
   - Optimize rendering efficiency
   - Implement smart data loading
   - Enable smooth animations
   - Maintain responsive interactions

4. **Adaptation Strategy**
   - Support multiple expertise levels
   - Enable context-sensitive views
   - Provide customization options
   - Maintain visual consistency

## Quality Standards

- Rendering performance > 60fps
- Interaction latency < 50ms
- Visual clarity score > 4.5/5
- Accessibility compliance 100%
- User satisfaction > 90%
- Expert validation > 85%

## Deliverables

1. Visual Design System Documentation
2. Interaction Pattern Guidelines
3. Performance Optimization Strategies
4. Accessibility Implementation Guide
5. User Experience Specifications
6. Technical Integration Documentation

Remember: Our visualizations should reveal the game's beauty and complexity while making it accessible and understandable to all levels of football expertise. 