# Animation System & Transitions

## Core Animations

### Brain Emoji Animations
```typescript
// Floating animation
const float = keyframes({
  '0%, 100%': { transform: 'translate(0, 0)' },
  '25%': { transform: 'translate(10px, 10px)' },
  '50%': { transform: 'translate(-5px, 15px)' },
  '75%': { transform: 'translate(-15px, -5px)' },
});

// Glow pulse
const glowPulse = keyframes({
  '0%, 100%': { opacity: '0.3' },
  '50%': { opacity: '0.6' }
});
```

### Interactive Animations
```typescript
// Scale transitions
const scaleHover = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
  transition: {
    type: 'spring',
    stiffness: 400,
    damping: 17
  }
};

// Fade transitions
const fadeInScale = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};
```

## Theme Transitions

### Color Transitions
```css
.theme-transition {
  transition: background-color 400ms cubic-bezier(0.32, 0.72, 0, 1),
              color 400ms cubic-bezier(0.32, 0.72, 0, 1);
}
```

### Backdrop Transitions
```typescript
// Gradient flow animation
const gradientFlow = keyframes({
  '0%, 100%': { 
    backgroundPosition: '0% 50%',
    filter: 'saturate(120%) brightness(110%)'
  },
  '50%': { 
    backgroundPosition: '400% 50%',
    filter: 'saturate(150%) brightness(120%)'
  }
});
```

## Navigation Animations

### Menu Transitions
```typescript
// Slide animations
const slideInRight = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: {
    type: 'spring',
    damping: 25,
    stiffness: 200
  }
};

// Glass menu effect
const glassMenuIn = {
  initial: { 
    backdropFilter: 'blur(0px)',
    backgroundColor: 'rgba(255, 255, 255, 0)'
  },
  animate: { 
    backdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
};
```

## Performance Optimizations

### Will-Change Properties
```css
.will-change-transform {
  will-change: transform;
}

.will-change-opacity {
  will-change: opacity;
}

.will-change-backdrop {
  will-change: backdrop-filter;
}
```

### GPU Acceleration
```css
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
}
```

## Animation Utilities

### Timing Functions
```typescript
export const timingFunctions = {
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  easeOut: 'cubic-bezier(0.32, 0, 0.67, 0)',
  theme: 'cubic-bezier(0.32, 0.72, 0, 1)'
};
```

### Duration Constants
```typescript
export const durations = {
  fast: '200ms',
  normal: '300ms',
  theme: '400ms',
  long: '500ms'
};
```

## Responsive Animations

### Mobile Adaptations
```typescript
const mobileAnimations = {
  // Reduce motion complexity
  reducedFloat: {
    amplitude: '50%',
    duration: '4s'
  },
  
  // Optimize performance
  simplifiedGlow: {
    intensity: '30%',
    frequency: '3s'
  }
};
```

### Prefers-Reduced-Motion
```css
@media (prefers-reduced-motion: reduce) {
  .animate-float {
    animation: none;
  }
  
  .theme-transition {
    transition: none;
  }
}
```

## Animation Composition

### Combining Animations
```typescript
const combinedAnimation = {
  initial: { scale: 0.9, opacity: 0, y: 10 },
  animate: { 
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.32, 0.72, 0, 1]
    }
  }
};
```

### Staggered Animations
```typescript
const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}; 