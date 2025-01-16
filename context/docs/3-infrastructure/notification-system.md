# Notification System Integration

## Overview
The notification system uses Knock to provide real-time updates about context generation progress, required reviews, and system events. It integrates seamlessly with our async context generation workflow.

## Core Components

### 1. Notification Configuration
```typescript
// lib/notifications/config.ts
interface NotificationConfig {
  channels: {
    inApp: boolean;
    email: boolean;
    slack?: boolean;
  };
  preferences: {
    contextUpdates: boolean;
    reviewRequests: boolean;
    systemAlerts: boolean;
  };
  frequency: 'immediate' | 'digest' | 'scheduled';
}
```

### 2. Event Types
```typescript
// lib/notifications/events.ts
enum NotificationEvent {
  // Context Generation
  CONTEXT_GENERATION_STARTED = 'context.started',
  CONTEXT_GENERATION_COMPLETED = 'context.completed',
  CONTEXT_GENERATION_FAILED = 'context.failed',
  
  // Review Process
  REVIEW_REQUESTED = 'review.requested',
  REVIEW_COMPLETED = 'review.completed',
  
  // System Events
  SYSTEM_UPDATE = 'system.update',
  ERROR_OCCURRED = 'system.error'
}
```

### 3. Notification Templates
```typescript
// lib/notifications/templates.ts
interface NotificationTemplate {
  event: NotificationEvent;
  title: string;
  body: string;
  data: Record<string, unknown>;
  actions?: {
    text: string;
    url: string;
  }[];
}

const templates: Record<NotificationEvent, NotificationTemplate> = {
  [NotificationEvent.CONTEXT_GENERATION_STARTED]: {
    title: 'Context Generation Started',
    body: 'Starting to generate context for {{projectName}}',
    data: {
      projectId: '{{projectId}}',
      timestamp: '{{timestamp}}'
    }
  },
  // ... other templates
};
```

## Integration Points

### 1. Context Generation Notifications
```typescript
// lib/context/notifications.ts
class ContextNotificationManager {
  // Event handling
  async onGenerationStarted(projectId: string): Promise<void> {
    await notifications.trigger(NotificationEvent.CONTEXT_GENERATION_STARTED, {
      projectId,
      timestamp: new Date()
    });
  }
  
  async onGenerationProgress(projectId: string, progress: number): Promise<void> {
    // Send progress updates
  }
  
  async onGenerationCompleted(projectId: string): Promise<void> {
    // Send completion notification
  }
}
```

### 2. Review Process Notifications
```typescript
// lib/review/notifications.ts
class ReviewNotificationManager {
  // Review workflow
  async requestReview(contextId: string, reviewerId: string): Promise<void> {
    await notifications.trigger(NotificationEvent.REVIEW_REQUESTED, {
      contextId,
      reviewerId,
      url: `/review/${contextId}`
    });
  }
  
  async onReviewCompleted(contextId: string): Promise<void> {
    // Send review completion notification
  }
}
```

### 3. System Notifications
```typescript
// lib/system/notifications.ts
class SystemNotificationManager {
  // System events
  async sendSystemUpdate(message: string): Promise<void> {
    await notifications.trigger(NotificationEvent.SYSTEM_UPDATE, {
      message,
      timestamp: new Date()
    });
  }
  
  async sendErrorAlert(error: Error): Promise<void> {
    // Send error notification
  }
}
```

## User Interface Components

### 1. Notification Center
```tsx
// components/notifications/NotificationCenter.tsx
const NotificationCenter = () => {
  return (
    <div className="notification-center">
      <NotificationBell />
      <NotificationList />
      <NotificationPreferences />
    </div>
  );
};
```

### 2. Notification Item
```tsx
// components/notifications/NotificationItem.tsx
const NotificationItem = ({ notification }) => {
  return (
    <div className="notification-item">
      <NotificationIcon type={notification.type} />
      <NotificationContent notification={notification} />
      <NotificationActions actions={notification.actions} />
    </div>
  );
};
```

### 3. Preferences Panel
```tsx
// components/notifications/PreferencesPanel.tsx
const PreferencesPanel = () => {
  return (
    <div className="preferences-panel">
      <ChannelPreferences />
      <EventPreferences />
      <FrequencySettings />
    </div>
  );
};
```

## Best Practices

### 1. Notification Design
- Keep notifications concise and actionable
- Group related notifications
- Provide clear next steps
- Allow quick actions

### 2. User Experience
- Implement read/unread states
- Support notification dismissal
- Enable bulk actions
- Maintain notification history

### 3. Performance
- Batch notifications when possible
- Implement read receipts
- Cache notification data
- Handle offline scenarios

## Configuration

### 1. Environment Variables
```env
KNOCK_SECRET_API_KEY=your_secret_key
NEXT_PUBLIC_KNOCK_API_KEY=your_public_key
NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID=your_channel_id
```

### 2. Knock Setup
```typescript
// lib/notifications/setup.ts
import { Knock } from '@knocklabs/node';
import { keys } from './keys';

const key = keys().KNOCK_SECRET_API_KEY;
export const notifications = new Knock(key);
```

### 3. Channel Configuration
```typescript
// lib/notifications/channels.ts
const channels = {
  inApp: {
    id: 'in-app',
    enabled: true,
    preferences: {
      frequency: 'immediate'
    }
  },
  email: {
    id: 'email',
    enabled: true,
    preferences: {
      frequency: 'digest'
    }
  }
};
```

## Future Enhancements

### 1. Advanced Features
- Rich notification content
- Custom notification sounds
- Mobile push notifications
- Scheduled notifications

### 2. Integration Options
- Slack integration
- MS Teams integration
- Discord webhooks
- Custom channels

### 3. Analytics
- Notification metrics
- Engagement tracking
- A/B testing
- User preferences analysis 