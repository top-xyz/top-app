# UI Components & Animation System

## Core Components

### 1. Navigation Banner
```tsx
// components/nav/Banner.tsx
export const Banner = () => {
  // Glass-morphic header with blur backdrop
  // Position: sticky top-0
  // Height: 64px
}
```

### 2. Brain Emoji Centerpiece
```tsx
// components/home/BrainEmoji.tsx
export const BrainEmoji = () => {
  // Interactive brain with hover/click states
  // Animations: float, glow-pulse, scale-hover
}
```

### 3. Theme-Aware Backdrop
```tsx
// components/home/Backdrop.tsx
export const Backdrop = () => {
  // Animated gradient background
  // Responds to theme changes
}
```

## Animation Classes

### Hover Effects
```css
.interactive-scale {
  /* Scale transform on hover/active */
  transform-style: preserve-3d;
  transition: transform 200ms cubic-bezier(0.32, 0, 0.67, 0);
}

.glow-pulse {
  /* Subtle opacity animation */
  animation: glow-pulse 2s ease-in-out infinite;
}
```

### Motion Effects
```css
.float {
  /* Smooth floating motion */
  animation: float 6s ease-in-out infinite;
}

.fade-in-scale {
  /* Combined fade and scale entrance */
  animation: fade-in-scale 0.3s ease-in-out;
}
```

## Layout Structure

### Homepage Layout
```tsx
// app/page.tsx
<main className="min-h-screen relative">
  <Banner />
  <Backdrop />
  <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <BrainEmoji />
  </div>
</main>
```

## Theme Integration

### Theme Provider
```tsx
// providers/theme-provider.tsx
export const ThemeProvider = ({ children }) => {
  // Manages dark/light mode
  // Syncs with system preferences
  // Persists user choice
}
```

### Theme Variables
```css
:root {
  /* Light theme */
  --background: #ffffff;
  --foreground: #000000;
}

[data-theme="dark"] {
  /* Dark theme */
  --background: #000000;
  --foreground: #ffffff;
}
```

## Responsive Design

### Breakpoints
```css
/* Mobile first approach */
sm: '640px'
md: '768px'
lg: '1024px'
xl: '1280px'
2xl: '1536px'
```

### Component Adaptations
- Banner collapses to minimal view on mobile
- Brain emoji scales appropriately
- Backdrop maintains aspect ratio
- Navigation becomes hamburger menu

## Accessibility

### Focus States
- Visible focus rings
- Skip-to-content link
- Keyboard navigation support

### ARIA Attributes
- Proper roles and labels
- State management
- Screen reader support 