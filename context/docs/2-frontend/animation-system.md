# Animation System & Transitions

Animation is not just movement - it's the breath of our digital universe. Every transition is a dance, every interaction a ritual, every feedback loop a pulse of life.

## Core Animations

### Intersection-Based Animations
```typescript
// Intersection Observer Hook
export function useIntersectionAnimation(options = {}) {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, {
      threshold: 0.1,
      ...options
    })

    const element = ref.current
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [])

  return { ref, isVisible }
}
```

### Animation Keyframes
```typescript
// Core animations
const keyframes = {
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' }
  },
  'slide-up': {
    '0%': { 
      opacity: '0',
      transform: 'translateY(10px)'
    },
    '100%': { 
      opacity: '1',
      transform: 'translateY(0)'
    }
  },
  'scale-up': {
    '0%': { 
      opacity: '0',
      transform: 'scale(0.95)'
    },
    '100%': { 
      opacity: '1',
      transform: 'scale(1)'
    }
  }
}

// Animation utilities
const animations = {
  'fade-in': 'fade-in 0.5s ease-out forwards',
  'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
  'scale-up': 'scale-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
}
```

### Usage Example
```typescript
function Section() {
  const animation = useIntersectionAnimation()
  
  return (
    <div 
      ref={animation.ref}
      className={cn(
        "opacity-0",
        animation.isVisible && "animate-fade-in"
      )}
    >
      Content
    </div>
  )
}
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
  spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
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

### Staggered Animations
```typescript
// Using animation delays
const staggeredItems = items.map((item, index) => ({
  ...item,
  style: {
    animationDelay: `${index * 100}ms`
  }
}));
```

### Combined Animations
```typescript
// Multiple animations on one element
const combinedAnimation = {
  className: cn(
    "opacity-0",
    isVisible && [
      "animate-fade-in",
      "animate-slide-up"
    ]
  ),
  style: {
    animationDelay: "200ms"
  }
};
``` 