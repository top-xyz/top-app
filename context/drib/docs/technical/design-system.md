# Drib Design System
#technical #design #ui

## Core Principles

```typescript
interface DesignPrinciples {
  clarity: "Information hierarchy that guides understanding"
  intelligence: "UI that anticipates and adapts"
  beauty: "Clean aesthetics that enhance function"
  performance: "Smooth, responsive interactions"
}
```

## Color System

### 1. Base Palette
```typescript
interface ColorSystem {
  pitch: {
    grass: "#2D5A27"
    lines: "#FFFFFF"
    area: "#234D1F"
  }
  
  brand: {
    primary: "#1A73E8"
    secondary: "#34A853"
    accent: "#FBBC04"
  }
  
  action: {
    success: "#0F9D58"
    warning: "#F4B400"
    error: "#DB4437"
    info: "#4285F4"
  }
  
  neutral: {
    background: "#FAFAFA"
    surface: "#FFFFFF"
    border: "#E0E0E0"
    text: {
      primary: "#212121"
      secondary: "#757575"
      disabled: "#BDBDBD"
    }
  }
}
```

### 2. Semantic Colors
```typescript
interface SemanticColors {
  match: {
    live: "#FF3D00"
    upcoming: "#00C853"
    finished: "#757575"
  }
  
  stats: {
    positive: "#00C853"
    neutral: "#FFA000"
    negative: "#DD2C00"
  }
  
  charts: {
    primary: ["#1A73E8", "#34A853", "#FBBC04", "#EA4335"]
    secondary: ["#137333", "#185ABC", "#B31412", "#EA8600"]
  }
}
```

## Typography

### 1. Font System
```typescript
interface Typography {
  fonts: {
    display: "Inter"
    body: "Inter"
    mono: "JetBrains Mono"
  }
  
  scale: {
    h1: "2.5rem/1.2"
    h2: "2rem/1.3"
    h3: "1.75rem/1.4"
    h4: "1.5rem/1.4"
    body: "1rem/1.5"
    small: "0.875rem/1.5"
    tiny: "0.75rem/1.5"
  }
  
  weights: {
    regular: "400"
    medium: "500"
    semibold: "600"
    bold: "700"
  }
}
```

### 2. Type Styles
```typescript
interface TypeStyles {
  headings: {
    hero: "h1 + bold + brand"
    section: "h2 + semibold"
    subsection: "h3 + medium"
    feature: "h4 + medium"
  }
  
  content: {
    body: "body + regular"
    emphasis: "body + medium"
    caption: "small + regular"
    code: "mono + regular"
  }
  
  data: {
    stats: "h3 + bold"
    metrics: "h4 + semibold"
    labels: "small + medium"
    values: "body + regular"
  }
}
```

## Spacing & Layout

### 1. Grid System
```typescript
interface GridSystem {
  base: "4px"
  spacing: {
    xs: "0.25rem" // 4px
    sm: "0.5rem"  // 8px
    md: "1rem"    // 16px
    lg: "1.5rem"  // 24px
    xl: "2rem"    // 32px
    xxl: "3rem"   // 48px
  }
  
  layout: {
    container: "1280px"
    gutter: "2rem"
    column: "64px"
  }
}
```

### 2. Component Spacing
```typescript
interface ComponentSpacing {
  card: {
    padding: "1rem"
    gap: "0.75rem"
    border: "1px"
  }
  
  section: {
    margin: "2rem"
    padding: "1.5rem"
    gap: "1rem"
  }
  
  form: {
    gap: "1rem"
    field: "0.5rem"
    input: "0.75rem"
  }
}
```

## Component System

### 1. ShadCN Customization
```typescript
interface ShadcnCustomization {
  button: {
    variants: {
      primary: "Filled with brand color"
      secondary: "Outlined style"
      ghost: "Minimal style"
      danger: "Error actions"
    }
    
    sizes: {
      sm: "Compact actions"
      md: "Standard size"
      lg: "Call to action"
      icon: "Square format"
    }
  }
  
  card: {
    variants: {
      default: "Standard elevation"
      flat: "No elevation"
      highlighted: "Increased prominence"
    }
    
    parts: {
      header: "Title area"
      content: "Main content"
      footer: "Actions area"
    }
  }
  
  input: {
    variants: {
      default: "Standard style"
      filled: "Background variant"
      minimal: "Borderless style"
    }
    
    states: {
      default: "Regular state"
      focus: "Active state"
      error: "Validation state"
      disabled: "Inactive state"
    }
  }
}
```

### 2. Custom Components
```typescript
interface CustomComponents {
  pitch: {
    container: "Main pitch view"
    overlay: "Data visualization layer"
    controls: "Interactive elements"
    markers: "Position indicators"
  }
  
  dashboard: {
    grid: "Widget layout system"
    widget: "Content container"
    controls: "Dashboard actions"
    customization: "Layout controls"
  }
  
  match: {
    timeline: "Match progress"
    events: "Key moments"
    stats: "Live statistics"
    analysis: "Tactical view"
  }
}
```

## Interactive Patterns

### 1. Motion Design
```typescript
interface Motion {
  duration: {
    instant: "100ms"
    quick: "200ms"
    standard: "300ms"
    complex: "500ms"
  }
  
  easing: {
    standard: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    decelerate: "cubic-bezier(0.0, 0.0, 0.2, 1)"
    accelerate: "cubic-bezier(0.4, 0.0, 1, 1)"
  }
  
  patterns: {
    expand: "Natural expansion"
    fade: "Smooth opacity"
    slide: "Directional movement"
    scale: "Size adjustment"
  }
}
```

### 2. State Feedback
```typescript
interface Feedback {
  loading: {
    skeleton: "Content placeholder"
    spinner: "Action indicator"
    progress: "Process status"
  }
  
  interaction: {
    hover: "Element highlight"
    active: "Press response"
    focus: "Selection indicator"
  }
  
  status: {
    success: "Completion feedback"
    error: "Problem indicator"
    warning: "Caution signal"
    info: "Neutral message"
  }
}
```

## Dashboard Patterns

### 1. Layout System
```typescript
interface DashboardLayout {
  grid: {
    columns: "12-column base"
    breakpoints: {
      sm: "640px"
      md: "768px"
      lg: "1024px"
      xl: "1280px"
    }
    gaps: {
      x: "1rem"
      y: "1rem"
    }
  }
  
  widgets: {
    sizes: {
      small: "1x1"
      medium: "2x1"
      large: "2x2"
      full: "4x2"
    }
    spacing: {
      padding: "1rem"
      margin: "0.5rem"
    }
  }
}
```

### 2. Widget System
```typescript
interface WidgetSystem {
  structure: {
    header: "Title and controls"
    content: "Main information"
    footer: "Additional actions"
  }
  
  types: {
    stats: "Numerical display"
    chart: "Data visualization"
    list: "Information rows"
    map: "Spatial display"
  }
  
  features: {
    resize: "Size adjustment"
    refresh: "Data update"
    configure: "Settings control"
    maximize: "Full view"
  }
}
```

## Implementation Examples

### 1. Match Dashboard
```typescript
interface MatchDashboard {
  layout: {
    timeline: "4x1 top"
    pitch: "2x2 center"
    stats: "2x2 right"
    events: "4x1 bottom"
  }
  
  widgets: {
    timeline: "Match progression"
    pitch: "Tactical view"
    stats: "Live statistics"
    events: "Key moments"
  }
}
```

### 2. Analysis View
```typescript
interface AnalysisView {
  layout: {
    main: "3x2 center"
    sidebar: "1x2 right"
    controls: "4x1 top"
  }
  
  components: {
    visualization: "Main analysis"
    metrics: "Key statistics"
    filters: "Analysis controls"
  }
}
```

## Related Documentation
- [UI Architecture](ui-architecture.md)
- [Component Guidelines](../development/components.md)
- [Performance Standards](../development/performance.md)

---

*"Design is not just what it looks like and feels like. Design is how it works."* 