# Development Workflow & Best Practices

## Project Setup

### Environment Setup
```bash
# Required versions
Node.js >= 18.0.0
npm >= 9.0.0

# Initial setup
npm install
npm run dev
```

### Environment Variables
```env
# .env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# AI Provider Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...

# Feature Flags
ENABLE_LOCAL_MODELS=true
ENABLE_STREAMING=true
```

## Development Process

### Branch Strategy
```
main           # Production-ready code
├── develop    # Development branch
├── feature/*  # Feature branches
└── fix/*      # Bug fix branches
```

### Commit Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: Code style changes
refactor: Code refactoring
perf: Performance improvements
test: Test changes
chore: Build/config changes
```

## Code Quality

### TypeScript Best Practices
```typescript
// Use strict type checking
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true
  }
}

// Prefer interfaces for public APIs
interface AIResponse {
  text: string;
  model: string;
  timestamp: Date;
}

// Use type inference when obvious
const provider = new OpenAIProvider(); // Type inferred
```

### Component Guidelines
```typescript
// Functional components with explicit types
interface Props {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: Props) => {
  return <div className={cn("container", className)}>{children}</div>;
};

// Custom hooks for reusable logic
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  // ...
  return { theme, setTheme };
};
```

## Testing Strategy

### Unit Tests
```typescript
// Component tests
describe('BrainEmoji', () => {
  it('renders with default animations', () => {
    render(<BrainEmoji />);
    expect(screen.getByRole('img')).toHaveClass('animate-float');
  });
});

// Hook tests
describe('useAIProvider', () => {
  it('switches providers correctly', async () => {
    const { result } = renderHook(() => useAIProvider());
    act(() => {
      result.current.setProvider('openai');
    });
    expect(result.current.provider).toBe('openai');
  });
});
```

### Integration Tests
```typescript
// API route tests
describe('/api/chat', () => {
  it('streams responses correctly', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'Hello' })
    });
    expect(response.headers.get('content-type')).toBe('text/event-stream');
  });
});
```

## Performance Monitoring

### Key Metrics
```typescript
// Web Vitals tracking
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric);
  // Send to analytics
}

// Custom performance marks
performance.mark('ai-response-start');
// ... AI processing ...
performance.mark('ai-response-end');
performance.measure('ai-response', 'ai-response-start', 'ai-response-end');
```

### Error Tracking
```typescript
// Global error boundary
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service
    console.error(error);
  }
}
```

## Deployment Pipeline

### Build Process
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm ci
      - run: npm run build
      - run: npm run test
      # Deploy steps
```

### Environment Configuration
```typescript
// config/environment.ts
export const getEnvironment = () => ({
  isProd: process.env.NODE_ENV === 'production',
  isStaging: process.env.VERCEL_ENV === 'preview',
  isDev: process.env.NODE_ENV === 'development'
});
```

## Documentation

### Code Documentation
```typescript
/**
 * Manages AI provider configuration and state
 * @param initialProvider - Default provider ID
 * @returns Provider management hooks and utilities
 */
export function useProviderManager(initialProvider?: string) {
  // Implementation
}
```

### API Documentation
```typescript
// pages/api/chat.ts
/**
 * @api {post} /api/chat Send chat message
 * @apiName SendChatMessage
 * @apiGroup Chat
 * @apiParam {String} message User message
 * @apiSuccess {String} response AI response
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Implementation
}
``` 